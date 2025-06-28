// ======================================
// INFINITY BAR BUTTONS FUNCTIONALITY
// ======================================

const InfinityBarButtons = (() => {
    // Configuration
    const config = {
        cls: { active: 'active', open: 'open', rotating: 'rotating', navHidden: 'nav-hidden', hidden: 'hidden' },
        store: { bookmarks: 'bookmarks', fontSize: 'fontSize', lineHeight: 'lineHeight', readingWidth: 'readingWidth' },
        speeds: { slow: 30, normal: 50, fast: 80, turbo: 120 },
        fontSizes: [80, 100, 120, 150],
        timings: { longPress: 500, feedbackDuration: 300, pauseDuration: 3000, speedIndicator: 1500 },
        // Consolidated style classes for dynamic elements
        overlayStyles: 'auto-scroll-overlay',
        menuStyles: 'auto-scroll-menu',
        speedOptionStyles: 'speed-option'
    };

    // Utilities
    const u = {
        $: (sel, ctx = document) => ctx.querySelector(sel),
        $$: (sel, ctx = document) => [...ctx.querySelectorAll(sel)],
        el: (tag, cls, content) => Object.assign(document.createElement(tag), { className: cls || '', innerHTML: content || '' }),
        store: {
            get: (k, def = null) => { try { return localStorage.getItem(k) || def; } catch { return def; } },
            set: (k, v) => { try { localStorage.setItem(k, v); } catch {} }
        },
        on: (el, evt, fn, opts = false) => el?.addEventListener(evt, fn, opts),
        off: (el, evt, fn) => el?.removeEventListener(evt, fn),
        toggle: (el, cls, force) => el?.classList.toggle(cls, force),
        throttle: (fn, ms = 16) => {
            let timeout, lastRun = 0;
            return function(...args) {
                const now = Date.now();
                if (now - lastRun > ms) {
                    fn.apply(this, args);
                    lastRun = now;
                } else {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => fn.apply(this, args), ms - (now - lastRun));
                }
            };
        },
        // Essential DOM operations only
        removeEl: (el) => el?.parentNode?.removeChild(el),
        showFeedback: (el, text, duration = 2000) => {
            if (!el) return;
            const span = el.querySelector('span');
            if (!span) return;
            const orig = span.textContent;
            span.textContent = text;
            setTimeout(() => span.textContent = orig, duration);
        }
    };

    // Auto-scroll system
    const autoScroll = (() => {
        let state = { isScrolling: false, timer: null, speed: 1, lastUserScroll: 0, resumeTimer: null, listeners: null };
        
        const getSpeed = () => Object.values(config.speeds)[Math.max(0, Math.min(3, state.speed))];
        
        const updateButton = (active, text = null) => {
            const btn = u.$('#infinity-auto-scroll-btn');
            if (!btn) return;
            u.toggle(btn, config.cls.active, active);
            if (active) {
                btn.style.background = 'var(--accent)';
                btn.style.color = 'var(--bg-primary)';
            } else {
                btn.style.background = '';
                btn.style.color = '';
            }
            if (text) u.showFeedback(btn, text, 0);
        };

        const createIndicator = (content) => {
            const indicator = u.el('div', 'auto-scroll-speed-indicator', content);
            indicator.id = 'auto-scroll-speed-indicator';
            document.body.appendChild(indicator);
            requestAnimationFrame(() => indicator.style.opacity = '1');
            setTimeout(() => {
                indicator.style.opacity = '0';
                setTimeout(() => u.removeEl(indicator), 300);
            }, config.timings.speedIndicator);
        };

        const scroll = () => {
            if (!state.isScrolling) return;
            const increment = getSpeed() / 60;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            
            if (window.scrollY >= maxScroll - 100) return stop();
            
            state.lastUserScroll = Date.now();
            window.scrollBy({ top: increment, behavior: 'instant' });
            state.timer = requestAnimationFrame(scroll);
        };

        const start = () => {
            if (state.isScrolling) return;
            state.isScrolling = true;
            window.autoScrollActive = true;
            updateButton(true, 'Stop Scroll');
            scroll();
            setupInteractionListeners();
        };

        const stop = () => {
            if (!state.isScrolling) return;
            state.isScrolling = false;
            window.autoScrollActive = false;
            [state.timer, state.resumeTimer].forEach(t => t && clearTimeout(t));
            state.timer = state.resumeTimer = null;
            updateButton(false, 'Auto Scroll');
            removeInteractionListeners();
        };

        const pause = (duration = config.timings.pauseDuration) => {
            if (!state.isScrolling) return;
            if (state.timer) cancelAnimationFrame(state.timer);
            state.timer = null;
            
            const btn = u.$('#infinity-auto-scroll-btn');
            if (btn) btn.style.opacity = '0.6';
            
            state.resumeTimer = setTimeout(() => {
                if (state.isScrolling && btn) {
                    btn.style.opacity = '';
                    scroll();
                }
            }, duration);
        };

        const adjustSpeed = (direction) => {
            const speedKeys = Object.keys(config.speeds);
            const newSpeed = Math.max(0, Math.min(speedKeys.length - 1, state.speed + direction));
            if (newSpeed !== state.speed) {
                state.speed = newSpeed;
                u.store.set('autoScrollSpeed', state.speed.toString());
                const speedName = speedKeys[state.speed];
                createIndicator(`Auto Scroll: ${speedName.charAt(0).toUpperCase() + speedName.slice(1)}`);
            }
        };

        const setupInteractionListeners = () => {
            const handleUserScroll = u.throttle((e) => {
                if (e?.isTrusted !== false && Date.now() - state.lastUserScroll > 200) {
                    state.lastUserScroll = Date.now();
                    pause(2000);
                }
            }, 150);
            
            const handleUserInteraction = (e) => e?.isTrusted !== false && pause();
            
            state.listeners = { scroll: handleUserScroll, touch: handleUserInteraction, mouse: handleUserInteraction };
            u.on(window, 'wheel', state.listeners.scroll, { passive: true });
            u.on(window, 'touchstart', state.listeners.touch, { passive: true });
            u.on(document, 'mousedown', state.listeners.mouse);
        };

        const removeInteractionListeners = () => {
            if (!state.listeners) return;
            u.off(window, 'wheel', state.listeners.scroll);
            u.off(window, 'touchstart', state.listeners.touch);
            u.off(document, 'mousedown', state.listeners.mouse);
            state.listeners = null;
        };

        const setupKeyboardControls = () => {
            u.on(document, 'keydown', (e) => {
                if (!state.isScrolling || document.activeElement?.tagName.match(/INPUT|TEXTAREA|SELECT/)) return;
                
                const actions = {
                    'ArrowUp': () => adjustSpeed(1),
                    '+': () => adjustSpeed(1),
                    'ArrowDown': () => adjustSpeed(-1),
                    '-': () => adjustSpeed(-1),
                    ' ': stop,
                    'Escape': stop
                };
                
                if (actions[e.key]) {
                    e.preventDefault();
                    actions[e.key]();
                    if (['Escape', ' '].includes(e.key)) updateButton(false, 'Auto Scroll');
                }
            });
        };

        const showSpeedMenu = () => {
            const overlay = u.el('div', config.overlayStyles);
            
            const speedKeys = Object.keys(config.speeds);
            const descriptions = ['~150 WPM', '~200 WPM', '~300 WPM', '~400 WPM'];
            
            const menu = u.el('div', config.menuStyles, `
                <h3>Auto Scroll Speed</h3>
                ${speedKeys.map((speed, i) => `
                    <button class="${config.speedOptionStyles} ${i === state.speed ? 'active' : ''}" data-speed="${i}">
                        <span>${speed}</span>
                        <span class="description">${descriptions[i]}</span>
                    </button>
                `).join('')}
                <button class="cancel-speed-menu">Cancel</button>
            `);

            overlay.appendChild(menu);
            document.body.appendChild(overlay);
            requestAnimationFrame(() => overlay.style.opacity = '1');

            const closeMenu = () => {
                overlay.style.opacity = '0';
                setTimeout(() => u.removeEl(overlay), 300);
                u.off(document, 'keydown', handleEscape);
            };

            const handleEscape = (e) => e.key === 'Escape' && closeMenu();
            u.on(document, 'keydown', handleEscape);
            u.on(overlay, 'click', (e) => e.target === overlay && closeMenu());
            u.on(menu, 'click', (e) => {
                const speedBtn = e.target.closest(`.${config.speedOptionStyles}`);
                if (speedBtn) {
                    state.speed = parseInt(speedBtn.dataset.speed);
                    u.store.set('autoScrollSpeed', state.speed.toString());
                    closeMenu();
                } else if (e.target.closest('.cancel-speed-menu')) {
                    closeMenu();
                }
            });
        };

        const init = () => {
            setupKeyboardControls();
            state.speed = parseInt(u.store.get('autoScrollSpeed', '1'));
        };

        return { start, stop, pause, adjustSpeed, showSpeedMenu, init, isActive: () => state.isScrolling };
    })();

    // Button handlers
    const handlers = {
        bookmark: () => {
            const url = location.pathname;
            const bookmarks = JSON.parse(u.store.get(config.store.bookmarks, '[]'));
            
            // Find existing bookmark by URL
            const existingIndex = bookmarks.findIndex(b => (typeof b === 'string' ? b : b.url) === url);
            const isBookmarked = existingIndex === -1;
            
            if (isBookmarked) {
                // Create detailed bookmark object
                const bookmark = {
                    url: url,
                    title: document.title,
                    chapter: (() => {
                        const match = url.match(/\/chapter(\d+)/);
                        return match ? `Chapter ${match[1]}` : 'Unknown Chapter';
                    })(),
                    chapterTitle: (() => {
                        const heading = u.$('h1, .chapter-title, .title--chapter');
                        return heading ? heading.textContent.trim() : document.title;
                    })(),
                    scrollPosition: window.scrollY,
                    scrollPercent: Math.min((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100),
                    timestamp: Date.now(),
                    preview: (() => {
                        // Get text content around current scroll position
                        const chapterContent = u.$('.chapter-content, .content, main');
                        if (!chapterContent) return '';
                        
                        const textContent = chapterContent.textContent || '';
                        const words = textContent.trim().split(/\s+/);
                        const maxWords = 20;
                        
                        if (words.length <= maxWords) return textContent.trim();
                        
                        // Try to get text near scroll position
                        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
                        const startIndex = Math.floor(words.length * scrollPercent * 0.8);
                        const endIndex = Math.min(startIndex + maxWords, words.length);
                        
                        return words.slice(startIndex, endIndex).join(' ') + '...';
                    })()
                };
                
                bookmarks.push(bookmark);
            } else {
                bookmarks.splice(existingIndex, 1);
            }
            
            u.store.set(config.store.bookmarks, JSON.stringify(bookmarks));
            
            const btn = u.$('#infinity-bookmark-btn');
            u.toggle(btn, config.cls.active, isBookmarked);
            const svg = btn?.querySelector('svg');
            if (svg) svg.style.fill = isBookmarked ? 'currentColor' : 'none';
            
            // Show feedback
            u.showFeedback(btn, isBookmarked ? 'Bookmarked!' : 'Removed', 1500);
        },

        share: () => {
            const btn = u.$('#infinity-share-btn');
            if (navigator.share) {
                navigator.share({ title: document.title, url: location.href });
            } else {
                navigator.clipboard.writeText(location.href).then(() => {
                    u.showFeedback(btn, 'Copied!');
                });
            }
        },

        expand: () => {
            const bar = u.$('#infinity-bar');
            const btn = u.$('#infinity-expand-btn');
            const isExpanded = bar?.classList.contains('expanded');
            
            u.toggle(bar, 'expanded', !isExpanded);
            u.toggle(document.body, 'infinity-bar-expanded', !isExpanded);
            btn?.setAttribute('aria-label', isExpanded ? 'Expand options' : 'Collapse options');
        },

        textSize: (e) => {
            e?.preventDefault();
            e?.stopPropagation();
            
            const currentSize = parseFloat(u.store.get(config.store.fontSize, '100'));
            const currentIndex = config.fontSizes.indexOf(currentSize);
            const newSize = config.fontSizes[(currentIndex + 1) % config.fontSizes.length];
            
            u.store.set(config.store.fontSize, newSize.toString());
            
            const chapterContent = u.$('.chapter-content');
            if (chapterContent) {
                const fontScale = newSize / 100;
                u.removeEl(u.$('#reading-preferences-style'));
                document.body.setAttribute('data-reading-font-scale', newSize.toString());
                
                const style = u.el('style', '', `
                    .chapter-container .chapter-content p { font-size: calc(clamp(1rem, 2vw, 1.1rem) * ${fontScale}) !important; }
                    .chapter-container .chapter-content p:first-of-type { font-size: calc(clamp(1.1rem, 2.5vw, 1.2rem) * ${fontScale}) !important; }
                    .chapter-container .chapter-content h1 { font-size: calc(clamp(1.8rem, 5vw, 2.8rem) * ${fontScale}) !important; }
                `);
                style.id = 'reading-preferences-style';
                document.head.appendChild(style);
                
                ['#font-size-slider', '#font-size-value'].forEach((sel, i) => {
                    const el = u.$(sel);
                    if (el) el[i ? 'textContent' : 'value'] = i ? `${newSize}%` : newSize;
                });
            }
            
            const btn = u.$('#infinity-text-size-btn');
            if (btn) {
                const span = btn.querySelector('span');
                if (span) span.textContent = `${newSize}%`;
                btn.style.background = 'var(--accent)';
                btn.style.color = 'var(--bg-primary)';
                setTimeout(() => {
                    btn.style.background = '';
                    btn.style.color = '';
                }, config.timings.feedbackDuration);
            }
            
            // Keep infinity bar expanded
            const bar = u.$('#infinity-bar');
            if (bar?.classList.contains('expanded')) {
                setTimeout(() => bar.classList.add('expanded'), 50);
            }
        },

        textSizeLongPress: (e) => {
            e?.preventDefault();
            e?.stopPropagation();
            
            const panel = u.$('#settings-panel');
            const overlay = u.$('#settings-overlay');
            const btn = u.$('#settings-btn');
            
            if (panel && overlay) {
                [panel, overlay].forEach(el => u.toggle(el, el === panel ? config.cls.open : 'visible', true));
                document.body.style.overflow = 'hidden';
                u.toggle(btn, config.cls.rotating, true);
            }
            
            setTimeout(() => {
                const section = u.$('.settings-section.chapter-only');
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    section.style.animation = 'highlight-pulse 1s ease-out';
                }
            }, 300);
        },

        focus: () => console.log('Focus mode toggled'),
        notes: () => console.log('Notes toggled'),
        
        autoScroll: () => {
            const btn = u.$('#infinity-auto-scroll-btn');
            if (!btn) return;
            
            const isActive = btn.classList.contains(config.cls.active);
            isActive ? autoScroll.stop() : autoScroll.start();
        },

        progress: () => console.log('Progress toggled')
    };

    // Long press handler
    const createLongPressHandler = (element, shortCallback, longCallback) => {
        if (!element) return;
        
        let state = { timer: null, isLongPress: false, isPressing: false, startCoords: null };
        
        const startPress = (e) => {
            if (state.isPressing) return;
            
            if (element.id === 'infinity-text-size-btn') {
                e.preventDefault();
                e.stopPropagation();
            }
            
            state.isPressing = true;
            state.isLongPress = false;
            state.startCoords = e.touches?.[0] ? 
                { x: e.touches[0].clientX, y: e.touches[0].clientY } : 
                { x: e.clientX, y: e.clientY };
            
            state.timer = setTimeout(() => {
                if (state.isPressing) {
                    state.isLongPress = true;
                    longCallback(e);
                    element.style.transform = 'scale(0.95)';
                    navigator.vibrate?.(50);
                }
            }, config.timings.longPress);
        };
        
        const endPress = (e) => {
            if (!state.isPressing) return;
            
            if (element.id === 'infinity-text-size-btn') {
                e.preventDefault();
                e.stopPropagation();
            }
            
            clearTimeout(state.timer);
            element.style.transform = '';
            
            let moved = false;
            if (state.startCoords) {
                const current = e.changedTouches?.[0] || e;
                const distance = Math.sqrt(
                    Math.pow(current.clientX - state.startCoords.x, 2) + 
                    Math.pow(current.clientY - state.startCoords.y, 2)
                );
                moved = distance > 10;
            }
            
            if (!state.isLongPress && !moved && state.isPressing) {
                shortCallback(e);
            }
            
            Object.assign(state, { isPressing: false, isLongPress: false, startCoords: null });
        };
        
        const cancelPress = () => {
            clearTimeout(state.timer);
            element.style.transform = '';
            Object.assign(state, { isPressing: false, isLongPress: false, startCoords: null });
        };
        
        ['pointerdown', 'pointerup', 'pointerleave', 'pointercancel'].forEach((evt, i) => {
            const handler = i === 0 ? startPress : i === 1 ? endPress : cancelPress;
            u.on(element, evt, handler);
        });
        
        u.on(element, 'contextmenu', e => {
            if (e.pointerType === 'touch' || 'ontouchstart' in window) e.preventDefault();
        });
    };

    // Initialize
    const init = () => {
        autoScroll.init();
        
        // Button event bindings
        const buttonMap = {
            '#infinity-bookmark-btn': 'bookmark',
            '#infinity-share-btn': 'share', 
            '#infinity-expand-btn': 'expand',
            '#infinity-focus-btn': 'focus',
            '#infinity-notes-btn': 'notes',
            '#infinity-auto-scroll-btn': 'autoScroll',
            '#infinity-progress-btn': 'progress'
        };
        
        Object.entries(buttonMap).forEach(([selector, handler]) => {
            const btn = u.$(selector);
            if (btn) u.on(btn, 'click', handlers[handler]);
        });
        
        // Special handlers
        createLongPressHandler(u.$('#infinity-text-size-btn'), handlers.textSize, handlers.textSizeLongPress);
        
        // Auto-scroll long press for speed menu
        const autoScrollBtn = u.$('#infinity-auto-scroll-btn');
        if (autoScrollBtn) {
            let pressState = { timer: null, isLongPress: false };
            
            u.on(autoScrollBtn, 'pointerdown', () => {
                pressState.timer = setTimeout(() => {
                    pressState.isLongPress = true;
                    autoScroll.showSpeedMenu();
                    navigator.vibrate?.(50);
                }, config.timings.longPress);
            });
            
            ['pointerup', 'pointerleave', 'pointercancel'].forEach(evt => {
                u.on(autoScrollBtn, evt, () => {
                    clearTimeout(pressState.timer);
                    pressState.isLongPress = false;
                });
            });
        }
        
        // Initialize states
        const initBookmarkState = () => {
            const btn = u.$('#infinity-bookmark-btn');
            if (!btn) return;
            const bookmarks = JSON.parse(u.store.get(config.store.bookmarks, '[]'));
            
            // Check for bookmark (handle both old string format and new object format)
            const isBookmarked = bookmarks.some(b => 
                (typeof b === 'string' ? b : b.url) === location.pathname
            );
            
            u.toggle(btn, config.cls.active, isBookmarked);
            const svg = btn.querySelector('svg');
            if (svg) svg.style.fill = isBookmarked ? 'currentColor' : 'none';
        };
        
        const initTextSizeState = () => {
            const btn = u.$('#infinity-text-size-btn');
            if (!btn) return;
            const currentSize = parseFloat(u.store.get(config.store.fontSize, '100'));
            const span = btn.querySelector('span');
            if (span) span.textContent = `${currentSize}%`;
            
            if (u.$('.chapter-content')) {
                document.body.setAttribute('data-reading-font-scale', currentSize.toString());
            }
            
            // Prevent bar hiding during text size interactions
            const preventBarHiding = (e) => {
                e.stopPropagation();
                const bar = u.$('#infinity-bar');
                if (bar) {
                    bar.setAttribute('data-text-size-active', 'true');
                    setTimeout(() => bar.removeAttribute('data-text-size-active'), 1000);
                }
            };
            
            ['pointerdown', 'touchstart', 'mousedown'].forEach(evt => {
                u.on(btn, evt, preventBarHiding);
            });
        };
        
        // Prevent context menus on all infinity bar buttons
        const preventContextMenus = () => {
            const selectors = ['.infinity-bar button', '.infinity-bar-primary button', 
                             '.infinity-bar-secondary button', '.infinity-bar-secondary-btn'];
            u.$$(selectors.join(', ')).forEach(btn => {
                ['contextmenu', 'selectstart', 'dragstart'].forEach(evt => {
                    u.on(btn, evt, e => e.preventDefault());
                });
            });
        };
        
        initBookmarkState();
        initTextSizeState();
        preventContextMenus();
    };

    return { init, handlers, autoScroll };
})();

// Export and initialize
window.InfinityBarButtons = InfinityBarButtons;

(function() {
    const onReady = (fn) => {
        document.readyState === 'loading' ? 
            document.addEventListener('DOMContentLoaded', fn) : fn();
    };
    onReady(() => InfinityBarButtons.init());
})();
