#!/usr/bin/env node
/**
 * fetch-news.js — Daily news fetcher for Toby's Amazing News Network
 *
 * Queries GNews API for each company, deduplicates against existing articles,
 * and injects new articles into the data JS files while preserving logos and structure.
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
    process.exit(1);
}

const DATA_DIR = path.join(__dirname, '..');

// ── Company search queries ──
const AV_QUERIES = {
    torc: '"TORC Robotics" OR "Torc autonomous"',
    aurora: '"Aurora Innovation" autonomous truck',
    helm: '"Helm.ai" OR "Helm AI" autonomous',
    waymo: 'Waymo robotaxi OR autonomous',
    mobileye: 'Mobileye autonomous OR SuperVision OR EyeQ',
    wayve: 'Wayve autonomous driving',
    kodiak: 'Kodiak Robotics autonomous trucking',
    nuro: 'Nuro autonomous delivery OR robotaxi',
};

const TRUCKING_QUERIES = {
    daimler: '"Daimler Truck" OR Freightliner electric OR autonomous',
    traton: 'TRATON OR Scania OR "MAN truck"',
    paccar: 'PACCAR OR Peterbilt OR Kenworth',
    tata: '"Tata Motors" truck OR bus',
    volvo: '"Volvo Trucks" electric OR autonomous',
};

// ── Category detection ──
function detectCategory(title, desc) {
    const t = (title + ' ' + desc).toLowerCase();
    if (/fund|raise|invest|valuation|ipo|revenue|earning|profit|billion.*round|million.*round/i.test(t)) return 'funding';
    if (/partner|deal|agreement|collaborat|joint|select|sign/i.test(t)) return 'partnership';
    if (/launch|begin|start|deploy|open.*service|first ride|commercial/i.test(t)) return 'launch';
    if (/expand|new cit|new market|new route|enter.*market|growth/i.test(t)) return 'expansion';
    if (/safety|incident|crash|recall|investigat|driver.out/i.test(t)) return 'safety';
    if (/regulat|permit|approv|license|nhtsa|dmv|certif/i.test(t)) return 'regulation';
    return 'tech';
}

// ── Extract tags ──
function extractTags(title) {
    const stop = new Set(['the','for','and','with','from','that','this','has','its','are','was','will','been','have','more','than','into','also','over','after','about','just','new']);
    return title.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/)
        .filter(w => w.length > 3 && !stop.has(w.toLowerCase()))
        .slice(0, 3);
}

// ── Fetch from GNews API ──
function fetchGNews(query, max = 5) {
    return new Promise((resolve, reject) => {
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=${max}&sortby=publishedAt&apikey=${API_KEY}`;
        https.get(url, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.articles || []);
                } catch (e) { resolve([]); }
            });
        }).on('error', () => resolve([]));
    });
}

// ── Extract existing URLs from a data file to avoid duplicates ──
function extractExistingUrls(filePath) {
    const urls = new Set();
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const urlMatches = content.matchAll(/url:\s*"([^"]+)"/g);
        for (const m of urlMatches) urls.add(m[1]);
    } catch {}
    return urls;
}

// ── Insert new articles into a data JS file ──
function insertArticles(filePath, companyId, newArticles) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Find the news array for this company
    // Pattern: id: "companyId",\n ... news: [\n
    const idPattern = new RegExp(`id:\\s*"${companyId}"[\\s\\S]*?news:\\s*\\[`);
    const match = content.match(idPattern);
    if (!match) {
        console.log(`    Could not find company "${companyId}" in file`);
        return false;
    }

    const insertPos = match.index + match[0].length;

    // Build the new article entries as JS
    const entries = newArticles.map(a => `
            {
                date: "${a.date}",
                title: ${JSON.stringify(a.title)},
                body: ${JSON.stringify(a.body)},
                category: "${a.category}",
                tags: ${JSON.stringify(a.tags)},
                url: ${JSON.stringify(a.url)}
            }`).join(',');

    // Insert after "news: ["
    const before = content.substring(0, insertPos);
    const after = content.substring(insertPos);

    // Add comma after new entries if there are existing entries
    const trimmedAfter = after.trimStart();
    const needsComma = trimmedAfter.length > 0 && trimmedAfter[0] !== ']';

    content = before + entries + (needsComma && entries ? ',' : '') + after;
    fs.writeFileSync(filePath, content);
    return true;
}

// ── Process all companies for a file ──
async function processFile(filePath, queries) {
    const existingUrls = extractExistingUrls(filePath);
    let totalNew = 0;

    for (const [companyId, query] of Object.entries(queries)) {
        console.log(`  ${companyId}: searching...`);
        const articles = await fetchGNews(query, 3);

        const newArticles = articles
            .filter(a => !existingUrls.has(a.url))
            .map(a => ({
                date: a.publishedAt.split('T')[0],
                title: a.title.replace(/ - [^-]*$/, '').trim(),
                body: (a.description || '').substring(0, 500),
                category: detectCategory(a.title, a.description || ''),
                tags: extractTags(a.title),
                url: a.url
            }));

        if (newArticles.length > 0) {
            insertArticles(filePath, companyId, newArticles);
            newArticles.forEach(a => existingUrls.add(a.url));
            console.log(`    +${newArticles.length} new articles`);
            totalNew += newArticles.length;
        } else {
            console.log(`    no new articles`);
        }

        // Rate limit
        await new Promise(r => setTimeout(r, 400));
    }

    return totalNew;
}

// ── Main ──
async function main() {
    console.log("=== Toby's Amazing News Network — Daily Fetch ===\n");

    const avFile = path.join(DATA_DIR, 'data.js');
    const truckFile = path.join(DATA_DIR, 'data_trucking.js');

    console.log('AV Companies:');
    const avNew = await processFile(avFile, AV_QUERIES);

    console.log('\nTrucking & Bus:');
    const truckNew = await processFile(truckFile, TRUCKING_QUERIES);

    console.log(`\n=== Done! ${avNew + truckNew} new articles total ===`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
