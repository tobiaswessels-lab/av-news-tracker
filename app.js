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
const timelineViewEl = document.getElementById('timelineView');
const marketshareView = document.getElementById('marketshareView');
const filterBar = document.querySelector('.filter-bar');
const timelineLabels = document.querySelector('.timeline-labels');

function hideAllViews() {
    logoStrip.style.display = 'none';
    newsGrid.style.display = 'none';
    filterBar.style.display = 'none';
    timelineLabels.style.display = 'none';
    stocksView.style.display = 'none';
    timelineViewEl.style.display = 'none';
    marketshareView.style.display = 'none';
}

function showNewsMode() {
    logoStrip.style.display = '';
    newsGrid.style.display = '';
    filterBar.style.display = '';
    timelineLabels.style.display = '';
    stocksView.style.display = 'none';
    timelineViewEl.style.display = 'none';
    marketshareView.style.display = 'none';
}

document.querySelectorAll('.dash-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeDashboard = tab.dataset.dashboard;

        if (activeDashboard === 'stocks') {
            hideAllViews();
            stocksView.style.display = '';
            buildStocksView();
        } else if (activeDashboard === 'timeline') {
            hideAllViews();
            timelineViewEl.style.display = '';
            buildTimelineView();
        } else if (activeDashboard === 'marketshare') {
            hideAllViews();
            marketshareView.style.display = '';
            buildMarketShareView();
        } else {
            showNewsMode();
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

// ── Timeline View ──
function buildTimelineView() {
    const sidebar = document.getElementById('timelineSidebar');
    const canvas = document.getElementById('timelineCanvas');
    const scrollEl = document.getElementById('timelineScroll');
    sidebar.innerHTML = '';
    canvas.innerHTML = '';

    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.className = 'tl-reset-btn';
    resetBtn.textContent = 'Mark all unread';
    resetBtn.title = 'Mark all articles as unread';
    resetBtn.addEventListener('click', () => {
        localStorage.removeItem(READ_KEY);
        buildTimelineView();
    });
    sidebar.appendChild(resetBtn);

    // Use ALL AV companies (original order from data.js)
    const allCompanies = companies;
    const logos = logoSVGs;
    const LANE_H = 72;
    const HEADER_H = 40;

    // Collect all dates to compute time range
    let allDates = [];
    allCompanies.forEach(c => c.news.forEach(n => allDates.push(new Date(n.date))));
    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));

    // Extend range by 1 month on each side for padding
    const startDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const endDate = new Date(maxDate.getFullYear(), maxDate.getMonth() + 2, 1);

    // Pixels per day — controls how wide the timeline is
    const PX_PER_DAY = 8;
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const canvasWidth = totalDays * PX_PER_DAY;
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = (HEADER_H + allCompanies.length * LANE_H) + 'px';

    function dateToX(dateStr) {
        const d = new Date(dateStr);
        const days = (d - startDate) / (1000 * 60 * 60 * 24);
        return days * PX_PER_DAY;
    }

    // ── Draw month columns ──
    let d = new Date(startDate);
    let monthIdx = 0;
    while (d < endDate) {
        const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        const x = dateToX(d.toISOString());
        const w = dateToX(nextMonth.toISOString()) - x;

        const col = document.createElement('div');
        col.className = 'tl-month-col';
        col.style.left = x + 'px';
        col.style.width = w + 'px';

        const label = document.createElement('div');
        label.className = 'tl-month-label';
        label.textContent = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        col.appendChild(label);

        // Year divider
        if (d.getMonth() === 0 && monthIdx > 0) {
            const yearLine = document.createElement('div');
            yearLine.className = 'tl-year-line';
            yearLine.style.left = x + 'px';
            canvas.appendChild(yearLine);

            const yearLabel = document.createElement('div');
            yearLabel.className = 'tl-year-label';
            yearLabel.style.left = (x + 6) + 'px';
            yearLabel.textContent = d.getFullYear();
            canvas.appendChild(yearLabel);
        }

        canvas.appendChild(col);
        d = nextMonth;
        monthIdx++;
    }

    // ── Draw "NOW" line ──
    const nowX = dateToX(new Date().toISOString());
    const nowLine = document.createElement('div');
    nowLine.className = 'tl-now-line';
    nowLine.style.left = nowX + 'px';
    const nowLabel = document.createElement('div');
    nowLabel.className = 'tl-now-label';
    nowLabel.textContent = 'TODAY';
    nowLine.appendChild(nowLabel);
    canvas.appendChild(nowLine);

    // ── Draw lanes and events ──
    allCompanies.forEach((company, laneIdx) => {
        const laneY = HEADER_H + laneIdx * LANE_H;

        // Sidebar item
        const sideItem = document.createElement('div');
        sideItem.className = 'tl-sidebar-item';
        const logoHTML = logos[company.id] || '';
        sideItem.innerHTML = logoHTML;
        sidebar.appendChild(sideItem);

        // Lane background
        const lane = document.createElement('div');
        lane.className = 'tl-lane';
        lane.style.top = laneY + 'px';

        const laneLine = document.createElement('div');
        laneLine.className = 'tl-lane-line';
        lane.appendChild(laneLine);
        canvas.appendChild(lane);

        // Events
        company.news.forEach(item => {
            const cat = categoryClasses[item.category] || categoryClasses.tech;
            const x = dateToX(item.date);
            const dateObj = new Date(item.date);
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            // Color mapping for the dot
            const dotColors = {
                launch: '#00e5ff', funding: '#7c4dff', partnership: '#ff6090',
                tech: '#00ff88', regulation: '#ffb74d', expansion: '#64b5f6',
                safety: '#ff8a65', awards: '#FFD700'
            };
            const color = dotColors[item.category] || '#00ff88';

            const read = isRead(company.id, item.date);
            const event = document.createElement('div');
            event.className = 'tl-event' + (read ? ' tl-read' : '');
            event.style.left = x + 'px';
            event.style.top = (laneY + LANE_H / 2) + 'px';
            event.style.borderColor = color;
            event.style.color = color;
            if (!read) event.style.backgroundColor = color;

            // Tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'tl-event-tooltip';
            tooltip.innerHTML = `
                <div class="tl-tooltip-date">${dateStr}</div>
                <div class="tl-tooltip-title">${item.title}</div>
                <span class="tl-tooltip-tag ${cat.tag}">${item.category}</span>
            `;
            event.appendChild(tooltip);

            // Flip tooltip if near top
            if (laneIdx < 2) {
                tooltip.style.bottom = 'auto';
                tooltip.style.top = 'calc(100% + 8px)';
            }

            // Click to open modal
            event.addEventListener('click', (e) => {
                e.stopPropagation();
                markAsRead(company.id, item.date);
                event.classList.add('tl-read');
                event.style.backgroundColor = '';
                openModal(company, item);
            });

            canvas.appendChild(event);
        });
    });

    // ── Scroll to "now" ──
    setTimeout(() => {
        scrollEl.scrollLeft = Math.max(0, nowX - scrollEl.clientWidth / 2);
    }, 100);

    // ── Drag to scroll ──
    let isDragging = false, startX, scrollLeft;
    scrollEl.addEventListener('mousedown', (e) => {
        if (e.target.closest('.tl-event')) return;
        isDragging = true;
        scrollEl.classList.add('grabbing');
        startX = e.pageX - scrollEl.offsetLeft;
        scrollLeft = scrollEl.scrollLeft;
    });
    scrollEl.addEventListener('mouseleave', () => { isDragging = false; scrollEl.classList.remove('grabbing'); });
    scrollEl.addEventListener('mouseup', () => { isDragging = false; scrollEl.classList.remove('grabbing'); });
    scrollEl.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollEl.offsetLeft;
        scrollEl.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
}

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

/* =================================================================
   MARKET SHARE SUNBURST
   ================================================================= */
let msBuilt = false;
let msMode = 'regions'; // 'regions' or 'companies'

const MS_BRANDS = [
    { id: 'daimler', name: 'Daimler Truck', color: '#3b82f6', grad: ['#2563eb','#60a5fa'] },
    { id: 'volvo',   name: 'Volvo Trucks',  color: '#8b5cf6', grad: ['#7c3aed','#a78bfa'] },
    { id: 'paccar',  name: 'Paccar',        color: '#f59e0b', grad: ['#d97706','#fbbf24'] },
    { id: 'traton',  name: 'Traton',        color: '#10b981', grad: ['#059669','#34d399'] },
    { id: 'tata',    name: 'Tata',          color: '#ef4444', grad: ['#dc2626','#f87171'] },
];

const MS_REGIONS = [
    { id: 'europe',   name: 'Europe',              weight: 28, tint: '#6366f1',
      shares: { daimler: 28, volvo: 24, paccar: 16, traton: 27, tata: 5 } },
    { id: 'namerica', name: 'North America',        weight: 30, tint: '#3b82f6',
      shares: { daimler: 30, volvo: 14, paccar: 32, traton: 12, tata: 12 } },
    { id: 'asia',     name: 'Asia',                 weight: 24, tint: '#f472b6',
      shares: { daimler: 10, volvo: 8, paccar: 5, traton: 7, tata: 70 } },
    { id: 'samerica', name: 'South America',        weight: 10, tint: '#fbbf24',
      shares: { daimler: 26, volvo: 20, paccar: 10, traton: 30, tata: 14 } },
    { id: 'africa',   name: 'Africa & Middle East', weight: 8,  tint: '#34d399',
      shares: { daimler: 24, volvo: 18, paccar: 8, traton: 20, tata: 30 } },
];

const msTotalWeight = MS_REGIONS.reduce((s, r) => s + r.weight, 0);

// Global shares per brand (weighted avg)
const msGlobalShares = {};
MS_BRANDS.forEach(b => {
    msGlobalShares[b.id] = MS_REGIONS.reduce((s, r) => s + r.shares[b.id] * r.weight, 0) / msTotalWeight;
});

// For company-first mode: each brand's regional breakdown
// brandRegionWeight[bi][ri] = absolute contribution of region ri to brand bi
const msBrandRegionWeight = MS_BRANDS.map(b => {
    return MS_REGIONS.map(r => r.shares[b.id] * r.weight / msTotalWeight);
});

function buildMarketShareView() {
    if (msBuilt) return;

    const TAU = Math.PI * 2;
    const IR1 = 0.34, OR1 = 0.58;  // inner ring radii
    const IR2 = 0.61, OR2 = 0.98;  // outer ring radii
    const GAP1 = 0.018, GAP2 = 0.006;
    const NS = 'http://www.w3.org/2000/svg';

    function polar(cx, cy, r, a) { return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }; }

    function arcPath(cx, cy, rO, rI, a0, a1) {
        const sw = a1 - a0;
        if (sw < 0.001) return '';
        const la = sw > Math.PI ? 1 : 0;
        const p1 = polar(cx, cy, rO, a0), p2 = polar(cx, cy, rO, a1);
        const p3 = polar(cx, cy, rI, a1), p4 = polar(cx, cy, rI, a0);
        return `M${p1.x} ${p1.y} A${rO} ${rO} 0 ${la} 1 ${p2.x} ${p2.y} L${p3.x} ${p3.y} A${rI} ${rI} 0 ${la} 0 ${p4.x} ${p4.y}Z`;
    }

    // ── Compute slices for both modes ──
    function computeRegionFirst() {
        const inner = [], outer = [];
        let cum = -Math.PI / 2;
        MS_REGIONS.forEach((r, ri) => {
            const span = (r.weight / msTotalWeight) * TAU;
            const a0 = cum + GAP1 / 2, a1 = cum + span - GAP1 / 2;
            inner.push({ idx: ri, a0, a1, fill: r.tint, label: r.name.replace('North America','N. America').replace('South America','S. America').replace('Africa & Middle East','Africa & ME') });
            let bc = a0;
            const usable = a1 - a0;
            MS_BRANDS.forEach((b, bi) => {
                const bs = (r.shares[b.id] / 100) * usable;
                outer.push({ innerIdx: ri, outerIdx: bi, a0: bc + GAP2 / 2, a1: bc + bs - GAP2 / 2, fill: `url(#msg-${b.id})` });
                bc += bs;
            });
            cum += span;
        });
        return { inner, outer };
    }

    function computeCompanyFirst() {
        const inner = [], outer = [];
        let cum = -Math.PI / 2;
        MS_BRANDS.forEach((b, bi) => {
            const gShare = msGlobalShares[b.id] / 100;
            const span = gShare * TAU;
            const a0 = cum + GAP1 / 2, a1 = cum + span - GAP1 / 2;
            inner.push({ idx: bi, a0, a1, fill: `url(#msg-${b.id})`, label: b.name });
            // Subdivide by regions proportional to brand's regional contributions
            const total = msBrandRegionWeight[bi].reduce((s,v) => s+v, 0);
            let rc = a0;
            const usable = a1 - a0;
            MS_REGIONS.forEach((r, ri) => {
                const rs = (msBrandRegionWeight[bi][ri] / total) * usable;
                outer.push({ innerIdx: bi, outerIdx: ri, a0: rc + GAP2 / 2, a1: rc + rs - GAP2 / 2, fill: r.tint });
                rc += rs;
            });
            cum += span;
        });
        return { inner, outer };
    }

    // ── SVG setup (once) ──
    const svg = document.getElementById('msSvg');
    svg.innerHTML = '';

    const defs = document.createElementNS(NS, 'defs');
    MS_BRANDS.forEach(b => {
        const lg = document.createElementNS(NS, 'linearGradient');
        lg.id = `msg-${b.id}`;
        lg.setAttribute('x1','0'); lg.setAttribute('y1','0');
        lg.setAttribute('x2','1'); lg.setAttribute('y2','1');
        [0,100].forEach((o, i) => {
            const st = document.createElementNS(NS, 'stop');
            st.setAttribute('offset', o + '%');
            st.setAttribute('stop-color', b.grad[i]);
            lg.appendChild(st);
        });
        defs.appendChild(lg);
    });
    svg.appendChild(defs);

    // Create max number of path elements we'll ever need
    // Inner: max(5 regions, 5 brands) = 5
    // Outer: 5 x 5 = 25
    const MAX_INNER = 5, MAX_OUTER = 25;

    const innerPaths = Array.from({ length: MAX_INNER }, () => {
        const p = document.createElementNS(NS, 'path');
        p.style.transition = 'opacity .3s, filter .3s';
        p.style.cursor = 'pointer';
        svg.appendChild(p);
        return p;
    });

    const outerPaths = Array.from({ length: MAX_OUTER }, () => {
        const p = document.createElementNS(NS, 'path');
        p.style.transition = 'opacity .3s, filter .3s';
        p.style.cursor = 'pointer';
        svg.appendChild(p);
        return p;
    });

    const innerLabels = Array.from({ length: MAX_INNER }, () => {
        const t = document.createElementNS(NS, 'text');
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('dominant-baseline', 'central');
        t.setAttribute('fill', '#fff');
        t.setAttribute('font-size', '0.06');
        t.setAttribute('font-weight', '700');
        t.setAttribute('font-family', 'Inter, sans-serif');
        t.setAttribute('pointer-events', 'none');
        svg.appendChild(t);
        return t;
    });

    // ── Animation state ──
    let currentInner = [], currentOuter = [];
    let targetInner = [], targetOuter = [];
    let animId = null;

    function lerpAngle(a, b, t) { return a + (b - a) * t; }

    function setTargets(mode) {
        const data = mode === 'regions' ? computeRegionFirst() : computeCompanyFirst();
        targetInner = data.inner;
        targetOuter = data.outer;

        // Initialize current if first time
        if (currentInner.length === 0) {
            currentInner = targetInner.map(s => ({ ...s, a0: -Math.PI / 2, a1: -Math.PI / 2 }));
            currentOuter = targetOuter.map(s => ({ ...s, a0: -Math.PI / 2, a1: -Math.PI / 2 }));
        } else {
            // Keep current positions, just update metadata (fill, label, idx)
            while (currentInner.length < targetInner.length) currentInner.push({ ...targetInner[currentInner.length], a0: -Math.PI/2, a1: -Math.PI/2 });
            while (currentOuter.length < targetOuter.length) currentOuter.push({ ...targetOuter[currentOuter.length], a0: -Math.PI/2, a1: -Math.PI/2 });
            currentInner.forEach((c, i) => { if (targetInner[i]) { c.fill = targetInner[i].fill; c.label = targetInner[i].label; c.idx = targetInner[i].idx; c.innerIdx = targetInner[i].innerIdx; c.outerIdx = targetInner[i].outerIdx; } });
            currentOuter.forEach((c, i) => { if (targetOuter[i]) { c.fill = targetOuter[i].fill; c.innerIdx = targetOuter[i].innerIdx; c.outerIdx = targetOuter[i].outerIdx; } });
        }

        startAnim();
    }

    function startAnim() {
        if (animId) cancelAnimationFrame(animId);
        const speed = 0.06;
        function tick() {
            let done = true;
            currentInner.forEach((c, i) => {
                if (!targetInner[i]) return;
                c.a0 = lerpAngle(c.a0, targetInner[i].a0, speed);
                c.a1 = lerpAngle(c.a1, targetInner[i].a1, speed);
                if (Math.abs(c.a0 - targetInner[i].a0) > 0.0005 || Math.abs(c.a1 - targetInner[i].a1) > 0.0005) done = false;
            });
            currentOuter.forEach((c, i) => {
                if (!targetOuter[i]) return;
                c.a0 = lerpAngle(c.a0, targetOuter[i].a0, speed);
                c.a1 = lerpAngle(c.a1, targetOuter[i].a1, speed);
                if (Math.abs(c.a0 - targetOuter[i].a0) > 0.0005 || Math.abs(c.a1 - targetOuter[i].a1) > 0.0005) done = false;
            });
            drawChart();
            if (!done) animId = requestAnimationFrame(tick);
        }
        animId = requestAnimationFrame(tick);
    }

    function drawChart() {
        innerPaths.forEach((p, i) => {
            if (i < currentInner.length && currentInner[i].a1 - currentInner[i].a0 > 0.001) {
                const c = currentInner[i];
                p.setAttribute('d', arcPath(0, 0, OR1, IR1, c.a0, c.a1));
                p.setAttribute('fill', c.fill);
                p.style.opacity = msMode === 'regions' ? '0.35' : '1';
                p.style.display = '';
            } else {
                p.style.display = 'none';
            }
        });

        outerPaths.forEach((p, i) => {
            if (i < currentOuter.length && currentOuter[i].a1 - currentOuter[i].a0 > 0.001) {
                const c = currentOuter[i];
                p.setAttribute('d', arcPath(0, 0, OR2, IR2, c.a0, c.a1));
                p.setAttribute('fill', c.fill);
                p.style.opacity = msMode === 'companies' ? '0.55' : '1';
                p.style.display = '';
            } else {
                p.style.display = 'none';
            }
        });

        innerLabels.forEach((t, i) => {
            if (i < currentInner.length && currentInner[i].a1 - currentInner[i].a0 > 0.15) {
                const c = currentInner[i];
                const mid = (c.a0 + c.a1) / 2;
                const pos = polar(0, 0, (IR1 + OR1) / 2, mid);
                t.setAttribute('x', pos.x);
                t.setAttribute('y', pos.y);
                t.textContent = c.label;
                t.style.display = '';
            } else {
                t.style.display = 'none';
            }
        });
    }

    // ── Hover logic ──
    let hlInner = null, hlOuter = null;
    const tip = document.getElementById('msTip');

    function applyHL() {
        innerPaths.forEach((p, i) => {
            if (i >= currentInner.length) return;
            const baseOp = msMode === 'regions' ? 0.35 : 1;
            if (hlInner === null && hlOuter === null) {
                p.style.opacity = baseOp; p.style.filter = '';
            } else if (hlInner === i) {
                p.style.opacity = msMode === 'regions' ? '0.55' : '1';
                const tint = msMode === 'regions' ? MS_REGIONS[i].tint : MS_BRANDS[i].color;
                p.style.filter = `drop-shadow(0 0 8px ${tint}60)`;
            } else {
                p.style.opacity = msMode === 'regions' ? '0.15' : '0.25'; p.style.filter = '';
            }
        });

        outerPaths.forEach((p, idx) => {
            if (idx >= currentOuter.length) return;
            const s = currentOuter[idx];
            const baseOp = msMode === 'companies' ? 0.55 : 1;
            if (hlInner === null && hlOuter === null) {
                p.style.opacity = baseOp; p.style.filter = '';
            } else if (hlOuter !== null && hlOuter === s.outerIdx) {
                p.style.opacity = '1';
                const tint = msMode === 'regions' ? MS_BRANDS[s.outerIdx].color : MS_REGIONS[s.outerIdx].tint;
                p.style.filter = `drop-shadow(0 0 8px ${tint}70)`;
            } else if (hlInner !== null && hlInner === s.innerIdx) {
                p.style.opacity = '1'; p.style.filter = '';
            } else {
                p.style.opacity = '0.2'; p.style.filter = '';
            }
        });

        // Center label
        const center = document.getElementById('msCenter');
        if (hlInner !== null) {
            if (msMode === 'regions') {
                const r = MS_REGIONS[hlInner];
                center.querySelector('.ms-cl-title').textContent = r.name;
                document.getElementById('msClBig').textContent = r.weight + '% of market';
                center.querySelector('.ms-cl-sub').textContent = 'regional share';
            } else {
                const b = MS_BRANDS[hlInner];
                center.querySelector('.ms-cl-title').textContent = b.name;
                document.getElementById('msClBig').textContent = msGlobalShares[b.id].toFixed(1) + '%';
                center.querySelector('.ms-cl-sub').textContent = 'global share';
            }
        } else if (hlOuter !== null) {
            if (msMode === 'regions') {
                const b = MS_BRANDS[hlOuter];
                center.querySelector('.ms-cl-title').textContent = b.name;
                document.getElementById('msClBig').textContent = msGlobalShares[b.id].toFixed(1) + '%';
                center.querySelector('.ms-cl-sub').textContent = 'global share';
            } else {
                const r = MS_REGIONS[hlOuter];
                center.querySelector('.ms-cl-title').textContent = r.name;
                document.getElementById('msClBig').textContent = r.weight + '% of market';
                center.querySelector('.ms-cl-sub').textContent = 'regional share';
            }
        } else {
            center.querySelector('.ms-cl-title').textContent = 'Global';
            document.getElementById('msClBig').textContent = msMode === 'regions' ? '5 Regions' : '5 Companies';
            center.querySelector('.ms-cl-sub').textContent = 'hover for details';
        }
    }

    // Inner ring events
    innerPaths.forEach((p, i) => {
        p.addEventListener('mouseenter', () => { if (i < currentInner.length) { hlInner = i; hlOuter = null; applyHL(); } });
        p.addEventListener('mouseleave', () => { hlInner = null; applyHL(); tip.classList.remove('show'); });
        p.addEventListener('mousemove', e => {
            if (i >= currentInner.length) return;
            let html = '';
            if (msMode === 'regions') {
                const r = MS_REGIONS[i];
                html = `<strong style="color:${r.tint}">${r.name}</strong> — ${r.weight}% of global market<br><br>`;
                MS_BRANDS.forEach(b => { html += `<span style="color:${b.grad[1]}">&#9679;</span> ${b.name}: <b>${r.shares[b.id]}%</b><br>`; });
            } else {
                const b = MS_BRANDS[i];
                html = `<strong style="color:${b.grad[1]}">${b.name}</strong> — ${msGlobalShares[b.id].toFixed(1)}% global<br><br>`;
                MS_REGIONS.forEach((r, ri) => {
                    const pct = (msBrandRegionWeight[i][ri] / msGlobalShares[b.id] * 100).toFixed(1);
                    html += `<span style="color:${r.tint}">&#9679;</span> ${r.name}: <b>${pct}%</b><br>`;
                });
            }
            tip.innerHTML = html;
            tip.style.left = (e.clientX + 18) + 'px';
            tip.style.top = (e.clientY - 12) + 'px';
            tip.classList.add('show');
        });
    });

    // Outer ring events
    outerPaths.forEach((p, idx) => {
        p.addEventListener('mouseenter', () => {
            if (idx >= currentOuter.length) return;
            hlOuter = currentOuter[idx].outerIdx; hlInner = null; applyHL();
        });
        p.addEventListener('mouseleave', () => { hlOuter = null; applyHL(); tip.classList.remove('show'); });
        p.addEventListener('mousemove', e => {
            if (idx >= currentOuter.length) return;
            const s = currentOuter[idx];
            let html = '';
            if (msMode === 'regions') {
                const b = MS_BRANDS[s.outerIdx], r = MS_REGIONS[s.innerIdx];
                html = `<strong style="color:${b.grad[1]}">${b.name}</strong><br>${r.name}: <b>${r.shares[b.id]}%</b><br><span style="color:var(--text-dim)">Global: ${msGlobalShares[b.id].toFixed(1)}%</span>`;
            } else {
                const r = MS_REGIONS[s.outerIdx], b = MS_BRANDS[s.innerIdx];
                html = `<strong style="color:${r.tint}">${r.name}</strong><br>${b.name}: <b>${r.shares[b.id]}%</b> in ${r.name}`;
            }
            tip.innerHTML = html;
            tip.style.left = (e.clientX + 18) + 'px';
            tip.style.top = (e.clientY - 12) + 'px';
            tip.classList.add('show');
        });
    });

    marketshareView.addEventListener('mousemove', e => {
        if (!e.target.closest('.ms-chart-box') && !e.target.closest('.ms-sidebar')) {
            tip.classList.remove('show');
            hlInner = null; hlOuter = null; applyHL();
        }
    });

    // ── Sidebar ──
    function buildSidebar() {
        const sb = document.getElementById('msSidebar');
        sb.innerHTML = '';

        const bTitle = document.createElement('h3');
        bTitle.textContent = 'Companies';
        sb.appendChild(bTitle);

        MS_BRANDS.forEach((b, i) => {
            const row = document.createElement('div');
            row.className = 'ms-brand-row';
            row.innerHTML = `
                <div class="ms-brand-swatch" style="background:linear-gradient(135deg,${b.grad[0]},${b.grad[1]})"></div>
                <div class="ms-brand-name">${b.name}</div>
                <div class="ms-brand-pct" style="color:${b.grad[1]}">${msGlobalShares[b.id].toFixed(1)}%</div>
            `;
            row.addEventListener('mouseenter', () => {
                if (msMode === 'companies') { hlInner = i; hlOuter = null; }
                else { hlOuter = i; hlInner = null; }
                applyHL();
            });
            row.addEventListener('mouseleave', () => { hlInner = null; hlOuter = null; applyHL(); });
            sb.appendChild(row);
        });

        const rTitle = document.createElement('h3');
        rTitle.textContent = 'Regions';
        rTitle.style.marginTop = '12px';
        sb.appendChild(rTitle);

        MS_REGIONS.forEach((r, i) => {
            const row = document.createElement('div');
            row.className = 'ms-region-row';
            row.innerHTML = `
                <div class="ms-region-swatch" style="background:${r.tint}"></div>
                <div class="ms-region-name">${r.name}</div>
                <div class="ms-region-pct">${r.weight}%</div>
            `;
            row.addEventListener('mouseenter', () => {
                if (msMode === 'regions') { hlInner = i; hlOuter = null; }
                else { hlOuter = i; hlInner = null; }
                applyHL();
            });
            row.addEventListener('mouseleave', () => { hlInner = null; hlOuter = null; applyHL(); });
            sb.appendChild(row);
        });
    }

    // ── Toggle wiring ──
    document.querySelectorAll('.ms-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newMode = btn.dataset.mode;
            if (newMode === msMode) return;
            msMode = newMode;
            document.querySelectorAll('.ms-toggle-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === msMode));
            hlInner = null; hlOuter = null;
            setTargets(msMode);
            applyHL();
        });
    });

    // ── Init ──
    setTargets(msMode);
    buildSidebar();

    msBuilt = true;
}
