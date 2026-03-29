// ── Init ──
document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
});

const categoryClasses = {
    launch: { tag: 'cat-launch', dot: 'dot-launch' },
    funding: { tag: 'cat-funding', dot: 'dot-funding' },
    partnership: { tag: 'cat-partnership', dot: 'dot-partnership' },
    tech: { tag: 'cat-tech', dot: 'dot-tech' },
    regulation: { tag: 'cat-regulation', dot: 'dot-regulation' },
    expansion: { tag: 'cat-expansion', dot: 'dot-expansion' },
    safety: { tag: 'cat-safety', dot: 'dot-safety' },
    awards: { tag: 'cat-awards', dot: 'dot-awards' }
};

// ── Read state persistence (localStorage) ──
const READ_KEY = 'toby_av_news_read';

function getReadArticles() {
    try {
        return JSON.parse(localStorage.getItem(READ_KEY)) || {};
    } catch { return {}; }
}

function markAsRead(companyId, dateStr) {
    const read = getReadArticles();
    const key = companyId + '|' + dateStr;
    read[key] = true;
    localStorage.setItem(READ_KEY, JSON.stringify(read));
}

function isRead(companyId, dateStr) {
    const key = companyId + '|' + dateStr;
    return !!getReadArticles()[key];
}

// ── Column order persistence (localStorage) ──
const ORDER_KEY = 'toby_av_column_order';

function getSavedOrder(dashboard) {
    try {
        const orders = JSON.parse(localStorage.getItem(ORDER_KEY)) || {};
        return orders[dashboard] || null;
    } catch { return null; }
}

function saveOrder(dashboard, ids) {
    try {
        const orders = JSON.parse(localStorage.getItem(ORDER_KEY)) || {};
        orders[dashboard] = ids;
        localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
    } catch {}
}

function reorderCompanies(companiesArr, dashboard) {
    const savedIds = getSavedOrder(dashboard);
    if (!savedIds) return companiesArr;
    const map = {};
    companiesArr.forEach(c => map[c.id] = c);
    const ordered = savedIds.filter(id => map[id]).map(id => map[id]);
    // Append any new companies not in saved order
    companiesArr.forEach(c => { if (!savedIds.includes(c.id)) ordered.push(c); });
    return ordered;
}

// ── Dashboard state ──
let activeDashboard = 'av'; // 'av' or 'trucking'

function getActiveCompanies() {
    const raw = activeDashboard === 'av' ? companies : truckingCompanies;
    return reorderCompanies(raw, activeDashboard);
}

function getActiveLogos() {
    return activeDashboard === 'av' ? logoSVGs : truckingLogoSVGs;
}

// ── Category filter mapping ──
const filterMap = {
    all: null,
    commercial: ['launch', 'expansion'],
    partnership: ['partnership'],
    funding: ['funding'],
    tech: ['tech', 'regulation'],
    safety: ['safety'],
    awards: ['awards']
};

let activeFilter = 'all';

// Set up filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        buildColumns();
    });
});

// ── Dashboard tab switching ──
const stocksView = document.getElementById('stocksView');
const filterBar = document.querySelector('.filter-bar');
const timelineLabels = document.querySelector('.timeline-labels');

document.querySelectorAll('.dash-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeDashboard = tab.dataset.dashboard;

        if (activeDashboard === 'stocks') {
            // Hide news UI, show stocks
            logoStrip.style.display = 'none';
            newsGrid.style.display = 'none';
            filterBar.style.display = 'none';
            timelineLabels.style.display = 'none';
            stocksView.style.display = '';
            buildStocksView();
        } else {
            // Show news UI, hide stocks
            logoStrip.style.display = '';
            newsGrid.style.display = '';
            filterBar.style.display = '';
            timelineLabels.style.display = '';
            stocksView.style.display = 'none';
            rebuildAll();
        }
    });
});

// ── Time range (recomputed on dashboard switch) ──
let globalMinTime, globalMaxTime, timeSpan;

function computeTimeRange() {
    const allDates = [];
    getActiveCompanies().forEach(c => c.news.forEach(n => allDates.push(new Date(n.date).getTime())));
    globalMinTime = Math.min(...allDates);
    globalMaxTime = Math.max(...allDates);
    timeSpan = globalMaxTime - globalMinTime || 1;
}

// ── Build Logo Strip ──
const logoStrip = document.getElementById('logoStrip');

function buildLogoStrip() {
    logoStrip.innerHTML = '';
    const activeCompanies = getActiveCompanies();
    const logos = getActiveLogos();

    // Update grid columns for logo strip and news grid
    const count = activeCompanies.length;
    logoStrip.style.gridTemplateColumns = `repeat(${count}, 1fr)`;
    newsGrid.style.gridTemplateColumns = `repeat(${count}, 1fr)`;

    let dragSrcId = null;

    activeCompanies.forEach(company => {
        const cell = document.createElement('div');
        cell.className = 'logo-cell';
        cell.draggable = true;
        cell.dataset.companyId = company.id;
        const logoHTML = logos[company.id] || `<span style="font-weight:700;color:${company.color}">${company.name}</span>`;
        cell.innerHTML = logoHTML;

        // Drag events
        cell.addEventListener('dragstart', (e) => {
            dragSrcId = company.id;
            cell.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        cell.addEventListener('dragend', () => {
            cell.classList.remove('dragging');
            document.querySelectorAll('.logo-cell').forEach(c => c.classList.remove('drag-over'));
        });
        cell.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            cell.classList.add('drag-over');
        });
        cell.addEventListener('dragleave', () => {
            cell.classList.remove('drag-over');
        });
        cell.addEventListener('drop', (e) => {
            e.preventDefault();
            cell.classList.remove('drag-over');
            const targetId = company.id;
            if (dragSrcId && dragSrcId !== targetId) {
                // Reorder
                const ids = activeCompanies.map(c => c.id);
                const fromIdx = ids.indexOf(dragSrcId);
                const toIdx = ids.indexOf(targetId);
                ids.splice(fromIdx, 1);
                ids.splice(toIdx, 0, dragSrcId);
                saveOrder(activeDashboard, ids);
                rebuildAll();
            }
        });

        // Click to open most recent news
        cell.addEventListener('click', (e) => {
            if (e.defaultPrevented) return;
            const col = document.querySelector(`[data-company="${company.id}"]`);
            if (col) {
                const bubbles = col.querySelectorAll('.news-bubble');
                if (bubbles.length) bubbles[0].click();
            }
        });

        logoStrip.appendChild(cell);
    });
}

// ── Build News Grid with time-proportional positioning ──
const newsGrid = document.getElementById('newsGrid');
const gridHeight = () => newsGrid.getBoundingClientRect().height;

const BUBBLE_H = 75;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 20;

function timeToY(dateStr) {
    const t = new Date(dateStr).getTime();
    const ratio = (t - globalMinTime) / timeSpan;
    const availableH = gridHeight() - PADDING_TOP - PADDING_BOTTOM - BUBBLE_H;
    return PADDING_TOP + ((1 - ratio) * availableH);
}

function resolveOverlaps(positions) {
    positions.sort((a, b) => a.y - b.y);
    const minGap = BUBBLE_H + 4;
    for (let i = 1; i < positions.length; i++) {
        if (positions[i].y - positions[i - 1].y < minGap) {
            positions[i].y = positions[i - 1].y + minGap;
        }
    }
    const maxY = gridHeight() - PADDING_BOTTOM - BUBBLE_H;
    if (positions.length && positions[positions.length - 1].y > maxY) {
        const overflow = positions[positions.length - 1].y - maxY;
        const step = overflow / positions.length;
        positions.forEach((p, i) => {
            p.y = Math.max(PADDING_TOP, p.y - step * (positions.length - i));
        });
    }
    return positions;
}

function addTimelineTicks() {
    const startDate = new Date(globalMinTime);
    const endDate = new Date(globalMaxTime);
    startDate.setDate(1);
    startDate.setMonth(startDate.getMonth() + 1);

    let d = new Date(startDate);
    while (d <= endDate) {
        const ratio = (d.getTime() - globalMinTime) / timeSpan;
        const availableH = gridHeight() - PADDING_TOP - PADDING_BOTTOM - BUBBLE_H;
        const y = PADDING_TOP + ((1 - ratio) * availableH) + BUBBLE_H / 2;

        const tick = document.createElement('div');
        tick.className = 'time-tick';
        tick.style.top = y + 'px';
        newsGrid.appendChild(tick);

        const label = document.createElement('div');
        label.className = 'time-tick-label';
        label.style.top = y + 'px';
        label.textContent = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        newsGrid.appendChild(label);

        d.setMonth(d.getMonth() + 3);
    }
}

function buildColumns() {
    newsGrid.innerHTML = '';
    const activeCompanies = getActiveCompanies();
    const logos = getActiveLogos();

    activeCompanies.forEach(company => {
        const column = document.createElement('div');
        column.className = 'news-column';
        column.dataset.company = company.id;

        const allowedCategories = filterMap[activeFilter];
        const filteredNews = allowedCategories
            ? company.news.filter(n => allowedCategories.includes(n.category))
            : company.news;
        const sortedNews = [...filteredNews].sort((a, b) => new Date(a.date) - new Date(b.date));

        let positions = sortedNews.map((item, i) => ({
            item,
            y: timeToY(item.date),
            index: i
        }));

        positions = resolveOverlaps(positions);

        positions.forEach(({ item, y }, animIdx) => {
            const cat = categoryClasses[item.category] || categoryClasses.tech;
            const dateObj = new Date(item.date);
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });

            const bubble = document.createElement('div');
            const unread = !isRead(company.id, item.date);
            bubble.className = 'news-bubble' + (unread ? ' unread' : '');
            bubble.style.top = y + 'px';
            bubble.innerHTML = `
                <div class="bubble-date">
                    <span class="dot ${cat.dot}"></span>
                    ${dateStr}
                </div>
                <div class="bubble-title">${item.title}</div>
                <span class="bubble-tag ${cat.tag}">${item.category}</span>
            `;

            bubble.style.opacity = '0';
            bubble.style.transform = `translateY(20px)`;
            setTimeout(() => {
                bubble.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                bubble.style.opacity = '1';
                bubble.style.transform = 'translateY(0)';
            }, 100 + animIdx * 60);

            bubble.addEventListener('click', () => {
                markAsRead(company.id, item.date);
                bubble.classList.remove('unread');
                openModal(company, item);
            });
            bubble.addEventListener('mouseenter', (e) => {
                markAsRead(company.id, item.date);
                bubble.classList.remove('unread');
                showHoverPopup(e, company, item);
            });
            bubble.addEventListener('mouseleave', hideHoverPopup);
            column.appendChild(bubble);
        });

        newsGrid.appendChild(column);
    });

    addTimelineTicks();
}

function rebuildAll() {
    computeTimeRange();
    buildLogoStrip();
    buildColumns();
}

// Initial build
rebuildAll();
window.addEventListener('resize', () => {
    clearTimeout(window._resizeTimer);
    window._resizeTimer = setTimeout(buildColumns, 200);
});

// ── Hover Popup ──
const hoverPopup = document.getElementById('hoverPopup');
let hoverTimeout = null;

function showHoverPopup(e, company, item) {
    if (overlay.classList.contains('active')) return;

    const cat = categoryClasses[item.category] || categoryClasses.tech;
    const dateObj = new Date(item.date);
    const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });

    const logos = getActiveLogos();
    const logoHTML = logos[company.id] || '';
    document.getElementById('hoverCompany').innerHTML = logoHTML + `<span>${company.name}</span>`;
    document.getElementById('hoverDate').textContent = dateStr;
    document.getElementById('hoverTitle').textContent = item.title;
    document.getElementById('hoverBody').textContent = item.body;

    document.getElementById('hoverTags').innerHTML = item.tags.map(tag =>
        `<span class="hover-popup-tag ${cat.tag}">${tag}</span>`
    ).join('');

    const rect = e.currentTarget.getBoundingClientRect();
    const popupWidth = 340;
    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;

    let left, arrowSide;
    if (spaceRight > popupWidth + 16) {
        left = rect.right + 12;
        arrowSide = 'left';
    } else if (spaceLeft > popupWidth + 16) {
        left = rect.left - popupWidth - 12;
        arrowSide = 'right';
    } else {
        left = Math.max(8, (window.innerWidth - popupWidth) / 2);
        arrowSide = 'none';
    }

    let top = rect.top - 20;
    top = Math.max(8, Math.min(top, window.innerHeight - 360));

    hoverPopup.style.left = left + 'px';
    hoverPopup.style.top = top + 'px';
    hoverPopup.className = 'hover-popup' + (arrowSide === 'right' ? ' arrow-right' : '');

    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
        hoverPopup.classList.add('visible');
    }, 150);
}

function hideHoverPopup() {
    clearTimeout(hoverTimeout);
    hoverPopup.classList.remove('visible');
}

// ── Modal ──
const overlay = document.getElementById('modalOverlay');
const btnSummary = document.getElementById('btnSummary');
const btnArticle = document.getElementById('btnArticle');
const modalSummary = document.getElementById('modalSummary');
const modalEmbed = document.getElementById('modalEmbed');
const modalIframe = document.getElementById('modalIframe');
const iframeFallback = document.getElementById('iframeFallback');
let currentArticleUrl = '';

function showSummaryView() {
    btnSummary.classList.add('active');
    btnArticle.classList.remove('active');
    modalSummary.style.display = '';
    modalEmbed.style.display = 'none';
    modalIframe.src = '';
}

function showArticleView() {
    btnArticle.classList.add('active');
    btnSummary.classList.remove('active');
    modalSummary.style.display = 'none';
    modalEmbed.style.display = '';
    modalIframe.style.display = '';
    iframeFallback.style.display = 'none';
    modalIframe.src = currentArticleUrl;

    modalIframe.onerror = () => {
        modalIframe.style.display = 'none';
        iframeFallback.style.display = 'flex';
    };
    setTimeout(() => {
        try {
            const doc = modalIframe.contentDocument;
            if (doc && doc.body && doc.body.innerHTML === '') {
                modalIframe.style.display = 'none';
                iframeFallback.style.display = 'flex';
            }
        } catch(e) {}
    }, 3000);
}

btnSummary.addEventListener('click', showSummaryView);
btnArticle.addEventListener('click', showArticleView);

function openModal(company, item) {
    const cat = categoryClasses[item.category] || categoryClasses.tech;
    const dateObj = new Date(item.date);
    const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    currentArticleUrl = item.url;

    const logos = getActiveLogos();
    const logoHTML = logos[company.id] || '';
    document.getElementById('modalLogo').outerHTML = `<span id="modalLogo">${logoHTML}</span>`;
    document.getElementById('modalCompany').textContent = company.name;
    document.getElementById('modalDate').textContent = dateStr;
    document.getElementById('modalTitle').textContent = item.title;
    document.getElementById('modalBody').textContent = item.body;
    document.getElementById('modalLink').href = item.url;
    document.getElementById('fallbackLink').href = item.url;

    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = item.tags.map(tag =>
        `<span class="modal-tag ${cat.tag}">${tag}</span>`
    ).join('');

    showSummaryView();
    overlay.classList.add('active');
}

function closeModal() {
    overlay.classList.remove('active');
    modalIframe.src = '';
    const logoSpan = document.getElementById('modalLogo');
    if (logoSpan && logoSpan.tagName !== 'IMG') {
        logoSpan.outerHTML = '<img id="modalLogo" src="" alt="">';
    }
}

document.getElementById('modalClose').addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        archOverlay.classList.remove('active');
    }
});

// ── Architecture Diagram Modal ──
const archOverlay = document.getElementById('archOverlay');
document.getElementById('archBtn').addEventListener('click', () => {
    archOverlay.classList.add('active');
});
document.getElementById('archClose').addEventListener('click', () => {
    archOverlay.classList.remove('active');
});
archOverlay.addEventListener('click', (e) => {
    if (e.target === archOverlay) archOverlay.classList.remove('active');
});

// ── Refresh Button ──
const refreshBtn = document.getElementById('refreshBtn');
refreshBtn.addEventListener('click', () => {
    refreshBtn.classList.add('spinning');
    refreshBtn.title = 'Fetching latest news...';

    // Trigger the GitHub Actions workflow via API
    fetch('https://api.github.com/repos/tobiaswessels-lab/av-news-tracker/actions/workflows/daily-news.yml/dispatches', {
        method: 'POST',
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ref: 'main' })
    }).then(res => {
        if (res.status === 204 || res.status === 200) {
            refreshBtn.title = 'Fetching... will reload in 60s';
            // Wait for the action to complete, then reload
            setTimeout(() => {
                refreshBtn.classList.remove('spinning');
                refreshBtn.title = 'Fetch latest news';
                window.location.reload(true);
            }, 60000);
        } else {
            // If API trigger fails (needs auth), just do a hard reload
            // to pick up any recently deployed changes
            refreshBtn.title = 'Reloading...';
            setTimeout(() => window.location.reload(true), 500);
        }
    }).catch(() => {
        // Fallback: hard reload to get latest deployed data
        refreshBtn.title = 'Reloading...';
        setTimeout(() => window.location.reload(true), 500);
    });
});

// ── Stocks View ──
function buildSparklineSVG(data, color, width = 300, height = 50) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / (data.length - 1);

    const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 4) - 2}`).join(' ');
    const gradId = 'g' + Math.random().toString(36).substr(2, 5);

    // Area fill
    const areaPoints = points + ` ${width},${height} 0,${height}`;

    return `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="${color}" stop-opacity="0.02"/>
            </linearGradient>
        </defs>
        <polygon points="${areaPoints}" fill="url(#${gradId})"/>
        <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>`;
}

function formatChange(val) {
    const cls = val >= 0 ? 'positive' : 'negative';
    const sign = val >= 0 ? '+' : '';
    return `<span class="change-badge-value ${cls}">${sign}${val.toFixed(1)}%</span>`;
}

function buildStocksView() {
    stocksView.innerHTML = '';

    stockData.forEach((stock, idx) => {
        const changeClass = stock.change1d >= 0 ? 'positive' : 'negative';
        const changeSign = stock.change1d >= 0 ? '+' : '';

        // 52-week range position
        const rangeSpan = stock.high52w - stock.low52w || 1;
        const rangePct = ((stock.price - stock.low52w) / rangeSpan * 100).toFixed(1);

        const card = document.createElement('div');
        card.className = 'stock-card';
        card.style.borderLeftColor = stock.color;
        card.style.borderLeftWidth = '3px';

        card.innerHTML = `
            <div class="stock-header">
                <div>
                    <div class="stock-name" style="color:${stock.color}">${stock.name}</div>
                    <div class="stock-ticker">${stock.ticker} · ${stock.exchange}</div>
                </div>
                <div class="stock-price-block">
                    <div class="stock-price">${stock.currency === 'EUR' ? '€' : stock.currency === 'USD' ? '$' : stock.currency === 'INR' ? '₹' : ''}${stock.price.toLocaleString()}</div>
                    <div class="stock-change ${changeClass}">${changeSign}${stock.change1d.toFixed(2)}%</div>
                </div>
            </div>

            <div class="stock-sparkline">${buildSparklineSVG(stock.sparkline, stock.color)}</div>

            <div class="stock-changes">
                <div class="change-badge">
                    <div class="change-badge-label">1D</div>
                    ${formatChange(stock.change1d)}
                </div>
                <div class="change-badge">
                    <div class="change-badge-label">1W</div>
                    ${formatChange(stock.change1w)}
                </div>
                <div class="change-badge">
                    <div class="change-badge-label">1M</div>
                    ${formatChange(stock.change1m)}
                </div>
                <div class="change-badge">
                    <div class="change-badge-label">YTD</div>
                    ${formatChange(stock.changeYTD)}
                </div>
            </div>

            <div class="stock-metrics">
                <div class="metric">
                    <div class="metric-label">Market Cap</div>
                    <div class="metric-value">${stock.marketCap}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">P/E Ratio</div>
                    <div class="metric-value">${stock.peRatio.toFixed(1)}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Fwd P/E</div>
                    <div class="metric-value">${stock.forwardPE.toFixed(1)}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">EPS</div>
                    <div class="metric-value">${stock.eps.toFixed(2)}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Div Yield</div>
                    <div class="metric-value">${stock.dividend.toFixed(1)}%</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Revenue</div>
                    <div class="metric-value">${stock.revenue}</div>
                </div>
            </div>

            <div class="range-bar">
                <div class="range-label-52w">52-WEEK RANGE</div>
                <div class="range-labels">
                    <span>${stock.low52w.toLocaleString()}</span>
                    <span>${stock.high52w.toLocaleString()}</span>
                </div>
                <div class="range-track">
                    <div class="range-fill" style="width:100%"></div>
                    <div class="range-marker" style="left:${rangePct}%"></div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            window.open(stock.yahooUrl, '_blank');
        });

        // Stagger animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + idx * 80);

        stocksView.appendChild(card);
    });
}
