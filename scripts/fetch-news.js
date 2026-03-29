#!/usr/bin/env node
/**
 * fetch-news.js — Daily news fetcher for Toby's Amazing News Network
 *
 * Queries GNews API for each company, deduplicates against existing data,
 * and prepends new articles to the top of the JSON data files.
 *
 * Usage:
 *   GNEWS_API_KEY=<key> node scripts/fetch-news.js
 *
 * GNews free tier: 100 requests/day, 10 articles per request.
 * Sign up at https://gnews.io
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.GNEWS_API_KEY;
if (!API_KEY) {
    console.error('Error: GNEWS_API_KEY environment variable is required.');
    console.error('Sign up for a free key at https://gnews.io');
    process.exit(1);
}

// ── Company search queries ──
const AV_QUERIES = [
    { id: 'torc', query: '"TORC Robotics" OR "Torc autonomous"', category_hint: 'tech' },
    { id: 'aurora', query: '"Aurora Innovation" autonomous truck', category_hint: 'tech' },
    { id: 'helm', query: '"Helm.ai" OR "Helm AI" autonomous driving', category_hint: 'tech' },
    { id: 'waymo', query: 'Waymo robotaxi', category_hint: 'launch' },
    { id: 'mobileye', query: 'Mobileye autonomous SuperVision EyeQ', category_hint: 'tech' },
    { id: 'wayve', query: 'Wayve autonomous driving AI', category_hint: 'tech' },
    { id: 'zoox', query: 'Zoox Amazon robotaxi', category_hint: 'launch' },
    { id: 'nuro', query: 'Nuro autonomous delivery OR robotaxi', category_hint: 'tech' },
];

const TRUCKING_QUERIES = [
    { id: 'daimler', query: '"Daimler Truck" OR "Freightliner" electric autonomous', category_hint: 'tech' },
    { id: 'traton', query: 'TRATON OR Scania OR "MAN truck" electric', category_hint: 'tech' },
    { id: 'paccar', query: 'PACCAR OR Peterbilt OR Kenworth truck', category_hint: 'tech' },
    { id: 'tata', query: '"Tata Motors" truck OR bus electric', category_hint: 'tech' },
    { id: 'volvo', query: '"Volvo Trucks" OR "Volvo autonomous" electric', category_hint: 'tech' },
];

// ── Category detection from title/description ──
function detectCategory(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    if (/funding|raises|invest|valuation|ipo|revenue|earnings|profit|billion|million.*round/i.test(text)) return 'funding';
    if (/partner|deal|agreement|collaboration|joint|select|signs/i.test(text)) return 'partnership';
    if (/launch|begin|start|deploy|open|commercial service|first ride/i.test(text)) return 'launch';
    if (/expand|new city|new market|new route|enter|growth/i.test(text)) return 'expansion';
    if (/safety|incident|crash|recall|investigation|driver-out/i.test(text)) return 'safety';
    if (/regulat|permit|approv|license|nhtsa|dmv|certif/i.test(text)) return 'regulation';
    return 'tech';
}

// ── Extract tags from title ──
function extractTags(title, companyName) {
    const words = title.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/);
    const stopwords = new Set(['the', 'a', 'an', 'and', 'or', 'for', 'in', 'on', 'to', 'of', 'is', 'its', 'as', 'with', 'by', 'at', 'from', 'new', 'has', 'will', 'be']);
    const tags = words
        .filter(w => w.length > 3 && !stopwords.has(w.toLowerCase()) && w.toLowerCase() !== companyName.toLowerCase())
        .slice(0, 3);
    return tags.length ? tags : ['Update'];
}

// ── Fetch from GNews API ──
function fetchGNews(query, maxResults = 5) {
    return new Promise((resolve, reject) => {
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=${maxResults}&sortby=publishedAt&apikey=${API_KEY}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.errors) {
                        console.warn(`API warning for "${query}":`, json.errors);
                        resolve([]);
                    } else {
                        resolve(json.articles || []);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// ── Load existing data file ──
function loadExistingData(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        // Extract the array from the JS file
        const match = content.match(/const \w+ = (\[[\s\S]*\]);/);
        if (match) {
            return JSON.parse(match[1]);
        }
    } catch (e) {
        console.warn(`Could not load ${filePath}:`, e.message);
    }
    return [];
}

// ── Get existing article URLs for deduplication ──
function getExistingUrls(companies) {
    const urls = new Set();
    companies.forEach(c => {
        if (c.news) c.news.forEach(n => urls.add(n.url));
    });
    return urls;
}

// ── Process a set of companies ──
async function processCompanies(queries, existingCompanies) {
    const existingUrls = getExistingUrls(existingCompanies);
    const updates = {};

    for (const { id, query, category_hint } of queries) {
        console.log(`  Fetching news for ${id}...`);
        try {
            const articles = await fetchGNews(query);
            const newArticles = [];

            for (const article of articles) {
                if (existingUrls.has(article.url)) continue;

                const newsItem = {
                    date: article.publishedAt.split('T')[0],
                    title: article.title.replace(/ - .*$/, '').trim(), // Remove source suffix
                    body: article.description || article.content?.substring(0, 300) || '',
                    category: detectCategory(article.title, article.description || ''),
                    tags: extractTags(article.title, id),
                    url: article.url
                };
                newArticles.push(newsItem);
                existingUrls.add(article.url);
            }

            updates[id] = newArticles;
            console.log(`    Found ${newArticles.length} new articles`);

            // Rate limit: small delay between requests
            await new Promise(r => setTimeout(r, 500));
        } catch (e) {
            console.error(`    Error fetching ${id}:`, e.message);
            updates[id] = [];
        }
    }

    return updates;
}

// ── Merge new articles into existing company data ──
function mergeUpdates(existingCompanies, updates, maxPerCompany = 8) {
    return existingCompanies.map(company => {
        const newArticles = updates[company.id] || [];
        if (newArticles.length === 0) return company;

        // Prepend new articles, keep max
        const merged = [...newArticles, ...company.news].slice(0, maxPerCompany);
        return { ...company, news: merged };
    });
}

// ── Write updated data file ──
function writeDataFile(filePath, varName, logoVarName, logoObj, companies) {
    const logoJSON = JSON.stringify(logoObj, null, 4);
    const companiesJSON = JSON.stringify(companies, null, 4);

    const content = `// Auto-updated: ${new Date().toISOString()}
// Source: GNews API — https://gnews.io

const ${logoVarName} = ${logoJSON};

const ${varName} = ${companiesJSON};
`;
    fs.writeFileSync(filePath, content);
    console.log(`  Written to ${filePath}`);
}

// ── Main ──
async function main() {
    const dataDir = path.join(__dirname, '..');

    console.log('=== Toby\'s Amazing News Network — Daily Fetch ===\n');

    // Load existing logos (we preserve these, they don't change)
    const avDataPath = path.join(dataDir, 'data.js');
    const truckDataPath = path.join(dataDir, 'data_trucking.js');

    // Read logo objects from existing files
    const avContent = fs.readFileSync(avDataPath, 'utf-8');
    const truckContent = fs.readFileSync(truckDataPath, 'utf-8');

    let avLogos, truckLogos;
    try {
        const avLogoMatch = avContent.match(/const logoSVGs = ({[\s\S]*?});/);
        avLogos = avLogoMatch ? eval('(' + avLogoMatch[1] + ')') : {};
    } catch { avLogos = {}; }

    try {
        const truckLogoMatch = truckContent.match(/const truckingLogoSVGs = ({[\s\S]*?});/);
        truckLogos = truckLogoMatch ? eval('(' + truckLogoMatch[1] + ')') : {};
    } catch { truckLogos = {}; }

    // Load existing company data
    const existingAV = loadExistingData(avDataPath);
    const existingTruck = loadExistingData(truckDataPath);

    // Fetch new articles
    console.log('Fetching AV company news...');
    const avUpdates = await processCompanies(AV_QUERIES, existingAV);

    console.log('\nFetching Trucking & Bus news...');
    const truckUpdates = await processCompanies(TRUCKING_QUERIES, existingTruck);

    // Merge
    const updatedAV = mergeUpdates(existingAV, avUpdates);
    const updatedTruck = mergeUpdates(existingTruck, truckUpdates);

    // Write back — preserve the original file format with logos
    // For AV data
    const avLogoBlock = avContent.match(/const logoSVGs = {[\s\S]*?};/)?.[0] || 'const logoSVGs = {};';
    const avOutput = `// Auto-updated: ${new Date().toISOString()}\n// Source: GNews API + manual curation\n\n${avLogoBlock}\n\nconst companies = ${JSON.stringify(updatedAV, null, 4)};\n`;
    fs.writeFileSync(avDataPath, avOutput);
    console.log(`\nWritten AV data to ${avDataPath}`);

    // For trucking data
    const truckLogoBlock = truckContent.match(/const truckingLogoSVGs = {[\s\S]*?};/)?.[0] || 'const truckingLogoSVGs = {};';
    const truckOutput = `// Auto-updated: ${new Date().toISOString()}\n// Source: GNews API + manual curation\n\n${truckLogoBlock}\n\nconst truckingCompanies = ${JSON.stringify(updatedTruck, null, 4)};\n`;
    fs.writeFileSync(truckDataPath, truckOutput);
    console.log(`Written Trucking data to ${truckDataPath}`);

    // Summary
    const totalNew = Object.values(avUpdates).reduce((s, a) => s + a.length, 0)
        + Object.values(truckUpdates).reduce((s, a) => s + a.length, 0);
    console.log(`\n=== Done! ${totalNew} new articles added ===`);
}

main().catch(e => {
    console.error('Fatal error:', e);
    process.exit(1);
});
