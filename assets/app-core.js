// ======================================
// OPTIMIZED APPLICATION ARCHITECTURE
// ======================================

// URL helper function for GitHub Pages compatibility
const getRelativeUrl = (path) => {
    const baseurl = window.SITE_CONFIG?.baseurl || '';
    return baseurl + path;
};

const App = (() => {
    // Consolidated configuration
    const config = {
        sel: {
            settings: '#settings-btn', settingsPanel: '#settings-panel', settingsOverlay: '#settings-overlay',
            closeSettings: '#close-settings', themeToggle: '#theme-toggle', themeSlider: '#theme-slider',
            miniThemeToggle: '#mini-theme-toggle', miniThemeSlider: '#mini-theme-slider',
            currentDate: '#current-date', readingProgress: '#reading-progress',
            chapterDropdown: '#chapter-dropdown', chapterDropdownBtn: '#chapter-dropdown-btn',
            chapterDropdownBackdrop: '.chapter-dropdown-backdrop',
            infinityBar: '#infinity-bar', infinityProgressBar: '#infinity-progress-bar',
            infinityBookmarkBtn: '#infinity-bookmark-btn', infinityShareBtn: '#infinity-share-btn',
            infinityExpandBtn: '#infinity-expand-btn',
            fontSizeSlider: '#font-size-slider', fontSizeValue: '#font-size-value',
            lineHeightSlider: '#line-height-slider', lineHeightValue: '#line-height-value',
            readingWidthSelect: '#reading-width-select'
        },
        cls: { 
            open: 'open', visible: 'visible', light: 'light', auto: 'auto', 
            navHidden: 'nav-hidden', hidden: 'hidden', rotating: 'rotating', active: 'active' 
        },
        store: { 
            theme: 'theme', bookmarks: 'bookmarks', fontSize: 'fontSize', 
            lineHeight: 'lineHeight', readingWidth: 'readingWidth' 
        },
        themes: {
            dark: { 
                n: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>', 
                m: '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' 
            },
            light: { 
                n: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>', 
                m: '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>' 
            },
            auto: { 
                n: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 0 1 0-16v16z"/></svg>', 
                m: '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 0 1 0-16v16z"/></svg>' 
            }
        }
    };

    // Unified utilities with better performance
    const u = {
        $: (sel, ctx = document) => ctx.querySelector(sel),
        $$: (sel, ctx = document) => [...ctx.querySelectorAll(sel)],
        el: (tag, cls, content) => Object.assign(document.createElement(tag), { 
            className: cls || '', innerHTML: content || '' 
        }),
        store: {
            get: (k, def = null) => { 
                try { return localStorage.getItem(k) || def; } catch { return def; } 
            },
            set: (k, v) => { try { localStorage.setItem(k, v); } catch {} }
        },
        on: (el, evt, fn, opts = false) => el?.addEventListener(evt, fn, opts),
        throttle: (fn, ms = 16) => {
            let timeout, lastRun = 0;
            return function(...args) {
                if (Date.now() - lastRun > ms) {
                    fn.apply(this, args);
                    lastRun = Date.now();
                } else {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        fn.apply(this, args);
                        lastRun = Date.now();
                    }, ms - (Date.now() - lastRun));
                }
            };
        },
        toggle: (el, cls, force) => el?.classList.toggle(cls, force),
        cap: s => s[0].toUpperCase() + s.slice(1)
    };

    // Element cache
    let els = {};
    const cache = () => {
        Object.entries(config.sel).forEach(([k, sel]) => {
            els[k] = u.$(sel);
        });
        Object.assign(els, { 
            nav: u.$('header'), 
            body: document.body, 
            chapterContent: u.$('.chapter-content'), 
            chapterContainer: u.$('.chapter-container'),
            infinityBar: u.$('.infinity-bar')
        });
        
        // Mobile performance optimization
        if ('ontouchstart' in window && els.infinityBar) {
            els.infinityBar.style.transform = 'translateY(100%)';
            els.infinityBar.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => {
                if (els.infinityBar) {
                    els.infinityBar.style.transform = 'translateY(0)';
                }
            }, 100);
        }
    };

    // Unified theme system
    const theme = (() => {
        let mode = u.store.get(config.store.theme, 'auto');
        const sys = matchMedia('(prefers-color-scheme: dark)');
        
        const shouldBeDark = () => mode === 'dark' || (mode === 'auto' && (
            sys.matches || (() => { 
                const h = new Date().getHours(); 
                return h < 7 || h >= 19; 
            })()
        ));
        
        const apply = (skipInitial = false) => {
            const isDark = shouldBeDark();
            if (!skipInitial) {
                document.documentElement[isDark ? 'removeAttribute' : 'setAttribute']('data-theme', 'light');
            }
            [els.themeSlider, els.miniThemeSlider].forEach((slider, i) => {
                if (!slider) return;
                slider.className = slider.className.replace(/\b(light|auto)\b/g, '');
                if (mode !== 'dark') slider.classList.add(config.cls[mode]);
                slider.innerHTML = config.themes[mode][i ? 'm' : 'n'];
            });
        };
        
        const toggle = () => {
            const modes = ['dark', 'auto', 'light'];
            mode = modes[(modes.indexOf(mode) + 1) % 3];
            u.store.set(config.store.theme, mode);
            apply();
        };
        
        const init = () => {
            apply(true);
            u.on(sys, 'change', () => mode === 'auto' && apply());
            setInterval(() => mode === 'auto' && apply(), 3600000);
        };
        
        return { init, toggle };
    })();

    // Optimized visibility system
    const visibility = (() => {
        let lastY = scrollY, navHidden = false, barHidden = false, ticking = false;
        let touchTimeout = null;
        
        const updateElement = (element, className, shouldHide, currentState, setState) => {
            if (!element || shouldHide === currentState) return;
            
            if (className === config.cls.navHidden) {
                element.style.transform = shouldHide ? 'translateY(-100%)' : 'translateY(0)';
                element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            } else if (className === config.cls.hidden) {
                element.style.transform = shouldHide ? 'translateY(100%)' : 'translateY(0)';
                element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                
                if (shouldHide && els.chapterDropdown) {
                    u.toggle(els.chapterDropdown, config.cls.open, false);
                    if (els.chapterDropdownBtn) {
                        els.chapterDropdownBtn.setAttribute('aria-expanded', 'false');
                    }
                }
            } else {
                u.toggle(element, className, shouldHide);
            }
            setState(shouldHide);
        };
        
        const update = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Check if we're on a chapter page (has chapter navigation or chapter content)
                    const isChapterPage = document.querySelector('.chapter-nav') ||
                                        document.title.toLowerCase().includes('chapter');
                    
                    // Don't hide navigation on non-chapter pages
                    if (!isChapterPage) {
                        ticking = false;
                        return;
                    }
                    
                    if (window.autoScrollActive || 
                        (els.infinityBar && els.infinityBar.hasAttribute('data-text-size-active'))) {
                        ticking = false;
                        return;
                    }
                    
                    const y = scrollY;
                    const diff = y - lastY;
                    const scrollThreshold = 80;
                    const nearEnd = y >= document.documentElement.scrollHeight - innerHeight - 150;
                    
                    if (Math.abs(diff) > 5) {
                        const shouldHide = y > scrollThreshold && !nearEnd && diff > 15;
                        const shouldShow = y <= scrollThreshold || nearEnd || diff < -10;
                        
                        if (shouldHide || shouldShow) {
                            const hide = shouldHide && !shouldShow;
                            updateElement(els.nav, config.cls.navHidden, hide, navHidden, v => navHidden = v);
                            updateElement(els.infinityBar, config.cls.hidden, hide, barHidden, v => barHidden = v);
                        }
                    }
                    
                    lastY = y;
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        const handleTouch = (e) => {
            // Check if we're on a chapter page
            const isChapterPage = document.querySelector('.chapter-content') || 
                                document.querySelector('.chapter-nav') ||
                                document.title.toLowerCase().includes('chapter');
            
            // Don't handle touch for showing navigation on non-chapter pages
            if (!isChapterPage) return;
            
            clearTimeout(touchTimeout);
            touchTimeout = setTimeout(() => {
                if (e.touches && e.touches[0] && e.touches[0].clientY > innerHeight - 100) {
                    updateElement(els.nav, config.cls.navHidden, false, navHidden, v => navHidden = v);
                    updateElement(els.infinityBar, config.cls.hidden, false, barHidden, v => barHidden = v);
                }
            }, 50);
        };
        
        const init = () => {
            u.on(window, 'scroll', update, { passive: true });
            
            if ('ontouchstart' in window) {
                u.on(document, 'touchstart', handleTouch, { passive: true });
                u.on(document, 'touchend', () => clearTimeout(touchTimeout), { passive: true });
            } else {
                u.on(document, 'mousemove', u.throttle(e => {
                    if (e.clientY > innerHeight - 80) {
                        updateElement(els.nav, config.cls.navHidden, false, navHidden, v => navHidden = v);
                        updateElement(els.infinityBar, config.cls.hidden, false, barHidden, v => barHidden = v);
                    }
                }, 100));
            }
        };
        
        return { init };
    })();

    // Optimized progress system
    const progress = (() => {
        let ticking = false, lastProgress = -1;
        
        const update = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollHeight = document.documentElement.scrollHeight - innerHeight;
                    if (scrollHeight > 0) {
                        const p = Math.min((scrollY / scrollHeight) * 100, 100);
                        if (Math.abs(p - lastProgress) > 0.5) {
                            [els.readingProgress, els.infinityProgressBar].forEach(bar => {
                                if (bar) {
                                    bar.style.transform = `scaleX(${p / 100})`;
                                }
                            });
                            lastProgress = p;
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        const init = () => {
            if (els.readingProgress || els.infinityProgressBar) {
                update();
                u.on(window, 'scroll', update, { passive: true });
                u.on(window, 'resize', u.throttle(update, 250));
            }
        };
        
        return { init };
    })();

    // Consolidated interactions
    const interactions = (() => {
        const toggleSettings = open => {
            [els.settingsPanel, els.settingsOverlay].forEach((el, i) => 
                u.toggle(el, [config.cls.open, config.cls.visible][i], open)
            );
            if (els.body) els.body.style.overflow = open ? 'hidden' : 'auto';
            u.toggle(els.settings, config.cls.rotating, open);
        };
        
        const toggleDropdown = () => {
            const open = els.chapterDropdown?.classList.contains(config.cls.open);
            u.toggle(els.chapterDropdown, config.cls.open, !open);
            els.chapterDropdownBtn?.setAttribute('aria-expanded', (!open).toString());
            
            if (els.chapterDropdownBtn) {
                els.chapterDropdownBtn.style.backgroundColor = !open ? 'rgba(255, 255, 255, 0.2)' : '';
            }
        };
        
        const init = () => {
            const events = [
                [els.settings, 'click', () => toggleSettings(true)],
                [els.closeSettings, 'click', () => toggleSettings(false)],
                [els.settingsOverlay, 'click', () => toggleSettings(false)],
                [els.themeToggle, 'click', theme.toggle],
                [els.miniThemeToggle, 'click', theme.toggle],
                [els.chapterDropdownBtn, 'click', e => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    toggleDropdown(); 
                }],
                [els.chapterDropdownBackdrop, 'click', () => {
                    u.toggle(els.chapterDropdown, config.cls.open, false);
                }],
                [document, 'click', e => {
                    if (!els.chapterDropdown?.contains(e.target)) {
                        u.toggle(els.chapterDropdown, config.cls.open, false);
                    }
                }],
                [document, 'keydown', e => {
                    if (e.key === 'Escape') {
                        toggleSettings(false);
                        u.toggle(els.chapterDropdown, config.cls.open, false);
                    }
                }]
            ];
            
            events.forEach(([el, evt, fn]) => el && u.on(el, evt, fn));
        };
        
        return { init };
    })();

    // Reading preferences
    const reading = (() => {
        const isChapterPage = () => !!(els.chapterContainer && els.chapterContent && 
            !els.body.classList.contains('book-list') && 
            document.title.toLowerCase().includes('chapter'));
        
        let fontSize = parseFloat(u.store.get(config.store.fontSize, '100'));
        let lineHeight = parseFloat(u.store.get(config.store.lineHeight, '1.7'));
        let readingWidth = u.store.get(config.store.readingWidth, '65ch');
        
        const apply = () => {
            if (!isChapterPage()) return;
            
            els.chapterContent.style.setProperty('--reading-line-height', lineHeight.toString());
            els.chapterContainer?.style.setProperty('--reading-width', readingWidth);
            
            u.$('#reading-preferences-style')?.remove();
            document.head.appendChild(u.el('style', '', `
                .chapter-container { max-width: ${readingWidth} !important; }
            `)).id = 'reading-preferences-style';
        };
        
        const createControl = (slider, display, getter, setter, suffix, storeKey) => {
            if (!slider || !display) return;
            
            const updateValue = () => {
                const val = getter();
                display.textContent = val + suffix;
                setter(val);
                u.store.set(storeKey, val);
                apply();
            };
            
            slider.value = getter();
            updateValue();
            u.on(slider, 'input', updateValue);
        };
        
        const init = () => {
            if (!isChapterPage()) return;
            
            apply();
            
            const controls = [
                [els.fontSizeSlider, els.fontSizeValue, () => fontSize, v => fontSize = parseFloat(v), '%', config.store.fontSize],
                [els.lineHeightSlider, els.lineHeightValue, () => lineHeight, v => lineHeight = parseFloat(v), '', config.store.lineHeight]
            ];
            
            controls.forEach(control => createControl(...control));
            
            if (els.readingWidthSelect) {
                els.readingWidthSelect.value = readingWidth;
                u.on(els.readingWidthSelect, 'change', e => {
                    readingWidth = e.target.value;
                    u.store.set(config.store.readingWidth, readingWidth);
                    apply();
                });
            }
        };
        
        return { init };
    })();

    // Main initialization
    const init = () => {
        cache();
        
        if ('ontouchstart' in window) {
            document.body.style.touchAction = 'manipulation';
        }
        
        const isChapter = !!u.$('.chapter-container');
        const isBookList = document.title.toLowerCase().includes('unfiltered') || !!u.$('.card--book, .book-preview');
        
        if (isChapter) els.body.classList.add('chapter-page');
        if (isBookList) els.body.classList.add('book-list');
        
        theme.init();
        visibility.init();
        progress.init();
        interactions.init();
        reading.init();
        
        // Initialize reading progress system
        ReadingProgress.init();
        
        // Initialize bookmarks display
        BookmarksDisplay.init();
        
        if (els.currentDate) {
            els.currentDate.textContent = new Date().toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        }
        
        if (IntersectionObserver && !('ontouchstart' in window)) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });
            
            u.$$('.fade-in').forEach(el => observer.observe(el));
        }
    };

    return { init };
})();

// Reading Progress Tracking System
const ReadingProgress = (() => {
    const STORAGE_KEY = 'unfiltered_reading_progress';
    const CHAPTERS = ['chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5', 'chapter6'];
    const CHAPTER_TITLES = {
        'chapter1': 'The Morning Routine',
        'chapter2': 'You\'re a lifesaver! Minseo!',
        'chapter3': 'After Hours',
        'chapter4': 'Small Luxuries',
        'chapter5': 'Team Leader...Minseo?',
        'chapter6': 'Evening Light'
    };
    
    // Get current progress from localStorage
    const getProgress = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : {
                currentChapter: null,
                currentPosition: 0,
                chaptersRead: [],
                lastReadTime: null
            };
        } catch (e) {
            console.warn('Failed to parse reading progress:', e);
            return {
                currentChapter: null,
                currentPosition: 0,
                chaptersRead: [],
                lastReadTime: null
            };
        }
    };
    
    // Save progress to localStorage
    const saveProgress = (progress) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (e) {
            console.warn('Failed to save reading progress:', e);
        }
    };
    
    // Simple throttle function for ReadingProgress module
    const throttle = (fn, ms = 16) => {
        let timeout, lastRun = 0;
        return function(...args) {
            if (Date.now() - lastRun > ms) {
                fn.apply(this, args);
                lastRun = Date.now();
            } else {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    fn.apply(this, args);
                    lastRun = Date.now();
                }, ms - (Date.now() - lastRun));
            }
        };
    };
    
    // Track reading progress on chapter pages
    const trackChapterProgress = () => {
        const currentPath = window.location.pathname;
        const chapterMatch = currentPath.match(/\/chapter(\d+)/);
        
        if (!chapterMatch) return;
        
        const chapterNum = parseInt(chapterMatch[1]);
        const chapterKey = `chapter${chapterNum}`;
        
        if (!CHAPTERS.includes(chapterKey)) return;
        
        const progress = getProgress();
        const chapterContent = document.querySelector('.chapter-content');
        
        if (!chapterContent) return;
        
        // Update current chapter
        progress.currentChapter = chapterKey;
        progress.lastReadTime = Date.now();
        
        // Add to chapters read if not already included
        if (!progress.chaptersRead.includes(chapterKey)) {
            progress.chaptersRead.push(chapterKey);
        }
        
        // Function to update scroll position
        const updateScrollPosition = throttle(() => {
            const scrollPercent = Math.min(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
                100
            );
            
            progress.currentPosition = scrollPercent;
            saveProgress(progress);
        }, 1000);
        
        // Track scroll position
        window.addEventListener('scroll', updateScrollPosition, { passive: true });
        
        // Mark chapter as read when reaching 90% scroll
        const markChapterComplete = throttle(() => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercent >= 90 && !progress.chaptersRead.includes(chapterKey + '_complete')) {
                progress.chaptersRead.push(chapterKey + '_complete');
                saveProgress(progress);
            }
        }, 2000);
        
        window.addEventListener('scroll', markChapterComplete, { passive: true });
        
        // Save initial progress
        saveProgress(progress);
    };
    
    // Update continue reading button AND infinity bar pill
    const updateContinueButton = () => {
        const continueBtn = document.getElementById('continue-reading-btn');
        const locationText = document.getElementById('continue-reading-location');
        const progressBar = document.getElementById('continue-reading-progress-bar');
        
        // Infinity bar pill elements
        const pillNav = document.getElementById('continue-reading-pill-nav');
        const pillTextNav = document.getElementById('continue-reading-pill-text-nav');
        const pillProgressNav = document.getElementById('continue-reading-pill-progress-nav');
        
        // Smart text truncation for pill
        const formatPillText = (text) => {
            // Mobile-specific truncation
            const isMobile = window.innerWidth <= 480;
            const isTablet = window.innerWidth <= 768;
            
            if (isMobile && text.length > 25) {
                // Very aggressive truncation for mobile
                if (text.includes('Chapter') && text.includes(':')) {
                    const chapterMatch = text.match(/Chapter (\d+):/);
                    const progressMatch = text.match(/\((\d+)%\)/);
                    if (chapterMatch && progressMatch) {
                        return `Ch${chapterMatch[1]} (${progressMatch[1]}%)`;
                    }
                }
                if (text.includes('Continue to Chapter')) {
                    const chapterMatch = text.match(/Continue to Chapter (\d+)/);
                    if (chapterMatch) {
                        return `→ Ch${chapterMatch[1]}`;
                    }
                }
                if (text.includes('Start Reading')) {
                    return 'Start Reading';
                }
                return text.substring(0, 22) + '...';
            } else if (isTablet && text.length > 35) {
                // Moderate truncation for tablet
                if (text.includes('Chapter') && text.includes(':')) {
                    const chapterMatch = text.match(/Chapter (\d+): (.+?) \((\d+)%\)/);
                    if (chapterMatch) {
                        const [, chapterNum, title, progress] = chapterMatch;
                        const shortTitle = title.length > 12 ? title.substring(0, 12) + '...' : title;
                        return `Ch${chapterNum}: ${shortTitle} (${progress}%)`;
                    }
                }
                return text.length > 32 ? text.substring(0, 32) + '...' : text;
            } else if (text.length > 45) {
                // Desktop truncation
                if (text.includes('Chapter') && text.includes(':')) {
                    const chapterMatch = text.match(/Chapter (\d+): (.+?) \((\d+)%\)/);
                    if (chapterMatch) {
                        const [, chapterNum, title, progress] = chapterMatch;
                        const shortTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;
                        return `Chapter ${chapterNum}: ${shortTitle} (${progress}%)`;
                    }
                }
                return text.substring(0, 42) + '...';
            }
            
            return text;
        };
        
        // If we don't have the main continue button but have the pill, we can still proceed
        if (!continueBtn && !pillNav) return;
        
        const progress = getProgress();
        
        // Get or create progress text element (only if we have the main continue button)
        let progressText = document.getElementById('continue-reading-progress-text');
        if (!progressText && continueBtn) {
            progressText = document.createElement('div');
            progressText.id = 'continue-reading-progress-text';
            // Insert after the continue reading button
            const continueSection = document.getElementById('continue-reading-section');
            if (continueSection) {
                continueSection.appendChild(progressText);
            }
        }
        
        if (!progress.currentChapter) {
            // First time reader
            if (locationText) locationText.textContent = 'Start from Chapter 1';
            if (progressBar) progressBar.style.width = '0%';
            if (progressText) progressText.textContent = '0% read of Unfiltered • ~30 min remaining';
            if (continueBtn) {
                continueBtn.onclick = () => {
                    window.location.href = getRelativeUrl('/books/unfiltered/chapter1');
                };
            }
            
            // Update infinity bar pill
            if (pillNav && pillTextNav && pillProgressNav) {
                const pillText = formatPillText('Start Reading: Unfiltered');
                pillTextNav.textContent = pillText;
                pillProgressNav.style.width = '0%';
                pillNav.style.display = 'inline-flex';
                pillNav.onclick = () => {
                    window.location.href = getRelativeUrl('/books/unfiltered/chapter1');
                };
            }
        } else {
            // Use current chapter progress only (much simpler)
            const chapterNum = progress.currentChapter.replace('chapter', '');
            const chapterTitle = CHAPTER_TITLES[progress.currentChapter];
            const chapterProgress = Math.round(progress.currentPosition);
            
            if (progress.currentPosition >= 95) {
                // Chapter completed, go to next
                const nextChapterNum = parseInt(chapterNum) + 1;
                if (nextChapterNum <= CHAPTERS.length) {
                    if (locationText) locationText.textContent = `Continue to Chapter ${nextChapterNum}`;
                    if (continueBtn) {
                        continueBtn.onclick = () => {
                            window.location.href = getRelativeUrl(`/books/unfiltered/chapter${nextChapterNum}`);
                        };
                    }
                    
                    // Update infinity bar pill
                    if (pillNav && pillTextNav && pillProgressNav) {
                        const pillText = formatPillText(`Continue to Chapter ${nextChapterNum}`);
                        pillTextNav.textContent = pillText;
                        pillNav.onclick = () => {
                            window.location.href = getRelativeUrl(`/books/unfiltered/chapter${nextChapterNum}`);
                        };
                    }
                    
                    // Show 100% for completed chapter
                    if (progressBar) progressBar.style.width = '100%';
                    if (pillProgressNav) pillProgressNav.style.width = '100%';
                } else {
                    if (locationText) locationText.textContent = 'Story complete! 🎉';
                    if (continueBtn) {
                        continueBtn.onclick = () => {
                            window.location.href = getRelativeUrl('/books/unfiltered/unfiltered');
                        };
                    }
                    
                    // Update infinity bar pill
                    if (pillNav && pillTextNav && pillProgressNav) {
                        const pillText = formatPillText('Story complete! 🎉');
                        pillTextNav.textContent = pillText;
                        pillNav.onclick = () => {
                            window.location.href = getRelativeUrl('/books/unfiltered/unfiltered');
                        };
                    }
                    
                    // Show 100% for story complete
                    if (progressBar) progressBar.style.width = '100%';
                    if (pillProgressNav) pillProgressNav.style.width = '100%';
                }
            } else {
                // Continue current chapter
                if (locationText) locationText.textContent = `Chapter ${chapterNum}: ${chapterTitle} (${chapterProgress}%)`;
                if (continueBtn) {
                    continueBtn.onclick = () => {
                        const url = getRelativeUrl(`/books/unfiltered/chapter${chapterNum}`);
                        sessionStorage.setItem('continueFromPosition', progress.currentPosition.toString());
                        window.location.href = url;
                    };
                }
                
                // Update infinity bar pill
                if (pillNav && pillTextNav && pillProgressNav) {
                    const fullText = `Chapter ${chapterNum}: ${chapterTitle} (${chapterProgress}%)`;
                    const pillText = formatPillText(fullText);
                    pillTextNav.textContent = pillText;
                    pillNav.onclick = () => {
                        const url = getRelativeUrl(`/books/unfiltered/chapter${chapterNum}`);
                        sessionStorage.setItem('continueFromPosition', progress.currentPosition.toString());
                        window.location.href = url;
                    };
                }
                
                // Show current chapter progress
                if (progressBar) progressBar.style.width = `${chapterProgress}%`;
                if (pillProgressNav) pillProgressNav.style.width = `${chapterProgress}%`;
            }
            
            // Update infinity bar pill display
            if (pillNav) {
                pillNav.style.display = 'inline-flex';
            }
            
            // Update progress text with current chapter info
            if (progressText) {
                progressText.textContent = `Chapter ${chapterNum} • ${chapterProgress}% complete`;
            }
        }
    };
    
    // Restore scroll position when continuing reading
    const restoreScrollPosition = () => {
        const savedPosition = sessionStorage.getItem('continueFromPosition');
        if (savedPosition && document.querySelector('.chapter-content')) {
            sessionStorage.removeItem('continueFromPosition');
            
            const targetPercent = parseFloat(savedPosition);
            requestAnimationFrame(() => {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                const targetScroll = (targetPercent / 100) * maxScroll;
                window.scrollTo(0, targetScroll);
                
                // Also save this position in the smart scroll system
                const currentChapter = window.location.pathname.match(/\/chapter(\d+)/)?.[0];
                if (currentChapter) {
                    const positions = JSON.parse(sessionStorage.getItem('chapter_scroll_positions') || '{}');
                    positions[currentChapter.replace('/', '').replace('chapter', 'chapter')] = {
                        scrollY: targetScroll,
                        timestamp: Date.now(),
                        url: window.location.href
                    };
                    sessionStorage.setItem('chapter_scroll_positions', JSON.stringify(positions));
                }
            });
        }
    };
    
    // Reset progress functionality
    const resetProgress = () => {
        if (confirm('Are you sure you want to reset your reading progress? This cannot be undone.')) {
            localStorage.removeItem(STORAGE_KEY);
            updateContinueButton();
        }
    };
    
    // Initialize
    const init = () => {
        // Set up continue reading button
        if (document.getElementById('continue-reading-btn')) {
            updateContinueButton();
            
            // Set up reset button
            const resetBtn = document.getElementById('reset-progress-btn');
            if (resetBtn) {
                resetBtn.addEventListener('click', resetProgress);
            }
        }
        
        // Set up continue reading pill in infinity bar for non-chapter pages
        if (document.getElementById('continue-reading-pill-nav')) {
            updateContinueButton();
            
            // Re-format pill text on window resize for responsive text management
            window.addEventListener('resize', throttle(() => {
                updateContinueButton();
            }, 250));
        }
        
        // Track progress on chapter pages
        if (document.querySelector('.chapter-content')) {
            trackChapterProgress();
            restoreScrollPosition();
        }
    };
    
    return { init, getProgress, resetProgress };
})();

// Bookmarks Display System
const BookmarksDisplay = (() => {
    const BOOKMARKS_KEY = 'bookmarks';
    
    // Get bookmarks from localStorage
    const getBookmarks = () => {
        try {
            const stored = localStorage.getItem(BOOKMARKS_KEY);
            const bookmarks = stored ? JSON.parse(stored) : [];
            
            // Migrate old string-based bookmarks to new object format
            let hasLegacyBookmarks = false;
            const migratedBookmarks = bookmarks.map(bookmark => {
                if (typeof bookmark === 'string') {
                    hasLegacyBookmarks = true;
                    return {
                        url: bookmark,
                        title: 'Legacy Bookmark',
                        chapter: (() => {
                            const match = bookmark.match(/\/chapter(\d+)/);
                            return match ? `Chapter ${match[1]}` : 'Unknown Chapter';
                        })(),
                        chapterTitle: 'Bookmarked Page',
                        scrollPosition: 0,
                        scrollPercent: 0,
                        timestamp: Date.now() - Math.random() * 86400000, // Random time in last 24h
                        preview: ''
                    };
                }
                return bookmark;
            });
            
            // Save migrated bookmarks back to storage
            if (hasLegacyBookmarks) {
                saveBookmarks(migratedBookmarks);
            }
            
            return migratedBookmarks;
        } catch (e) {
            console.warn('Failed to parse bookmarks:', e);
            return [];
        }
    };
    
    // Save bookmarks to localStorage
    const saveBookmarks = (bookmarks) => {
        try {
            localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
        } catch (e) {
            console.warn('Failed to save bookmarks:', e);
        }
    };
    
    // Remove a bookmark
    const removeBookmark = (url) => {
        const bookmarks = getBookmarks();
        const filteredBookmarks = bookmarks.filter(b => 
            (typeof b === 'string' ? b : b.url) !== url
        );
        saveBookmarks(filteredBookmarks);
        displayBookmarks(); // Refresh display
    };
    
    // Format date for display
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        // Less than 24 hours
        if (diff < 24 * 60 * 60 * 1000) {
            const hours = Math.floor(diff / (60 * 60 * 1000));
            if (hours < 1) {
                const minutes = Math.floor(diff / (60 * 1000));
                return minutes <= 1 ? 'Just now' : `${minutes}m ago`;
            }
            return `${hours}h ago`;
        }
        
        // Less than 7 days
        if (diff < 7 * 24 * 60 * 60 * 1000) {
            const days = Math.floor(diff / (24 * 60 * 60 * 1000));
            return `${days}d ago`;
        }
        
        // Older than 7 days
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };
    
    // Create bookmark card HTML
    const createBookmarkCard = (bookmark) => {
        // Handle both old string format and new object format
        if (typeof bookmark === 'string') {
            bookmark = {
                url: bookmark,
                title: 'Bookmarked Page',
                chapter: 'Unknown Chapter',
                chapterTitle: '',
                scrollPosition: 0,
                scrollPercent: 0,
                timestamp: Date.now(),
                preview: ''
            };
        }
        
        const card = document.createElement('div');
        card.className = 'bookmark-card';
        card.onclick = () => {
            // Navigate to bookmarked page and restore scroll position
            const url = getRelativeUrl(bookmark.url);
            if (bookmark.scrollPosition > 0) {
                sessionStorage.setItem('bookmarkScrollPosition', bookmark.scrollPosition.toString());
            }
            window.location.href = url;
        };
        
        card.innerHTML = `
            <div class="bookmark-card-header">
                <div class="bookmark-chapter">${bookmark.chapter}</div>
                <button class="bookmark-remove" onclick="event.stopPropagation(); BookmarksDisplay.removeBookmark('${bookmark.url}');">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="bookmark-title">${bookmark.chapterTitle || bookmark.title}</div>
            <div class="bookmark-meta">
                <div class="bookmark-progress">
                    <span>${Math.round(bookmark.scrollPercent || 0)}% read</span>
                    <div class="bookmark-progress-bar">
                        <div class="bookmark-progress-fill" style="width: ${bookmark.scrollPercent || 0}%"></div>
                    </div>
                </div>
                <div class="bookmark-date">${formatDate(bookmark.timestamp)}</div>
            </div>
            ${bookmark.preview ? `<div class="bookmark-preview">"${bookmark.preview}"</div>` : ''}
        `;
        
        return card;
    };
    
    // Display all bookmarks
    const displayBookmarks = () => {
        const bookmarksSection = document.getElementById('bookmarks-section');
        const bookmarksGrid = document.getElementById('bookmarks-grid');
        const bookmarksEmpty = document.getElementById('bookmarks-empty');
        
        if (!bookmarksSection || !bookmarksGrid || !bookmarksEmpty) return;
        
        const bookmarks = getBookmarks();
        
        // Clear existing bookmarks
        bookmarksGrid.innerHTML = '';
        
        if (bookmarks.length === 0) {
            bookmarksSection.style.display = 'none';
            return;
        }
        
        // Sort bookmarks by timestamp (newest first)
        const sortedBookmarks = bookmarks.sort((a, b) => {
            const aTime = (typeof a === 'string') ? 0 : (a.timestamp || 0);
            const bTime = (typeof b === 'string') ? 0 : (b.timestamp || 0);
            return bTime - aTime;
        });
        
        // Create bookmark cards
        sortedBookmarks.forEach(bookmark => {
            const card = createBookmarkCard(bookmark);
            bookmarksGrid.appendChild(card);
        });
        
        // Show/hide sections
        bookmarksSection.style.display = 'block';
        bookmarksEmpty.style.display = 'none';
    };
    
    // Restore scroll position from bookmark
    const restoreBookmarkPosition = () => {
        const savedPosition = sessionStorage.getItem('bookmarkScrollPosition');
        if (savedPosition && document.querySelector('.chapter-content')) {
            sessionStorage.removeItem('bookmarkScrollPosition');
            
            const targetScroll = parseFloat(savedPosition);
            requestAnimationFrame(() => {
                window.scrollTo(0, targetScroll);
            });
        }
    };
    
    // Initialize bookmarks display
    const init = () => {
        // Only run on books page
        if (document.getElementById('bookmarks-section')) {
            displayBookmarks();
        }
        
        // Restore bookmark position on chapter pages
        if (document.querySelector('.chapter-content')) {
            restoreBookmarkPosition();
        }
    };
    
    // Public API
    return { 
        init, 
        displayBookmarks, 
        removeBookmark,
        getBookmarks 
    };
})();

// Make BookmarksDisplay available globally for HTML onclick handlers
window.BookmarksDisplay = BookmarksDisplay;

// Font loading optimization
document.documentElement.classList.add('fonts-loading');

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
        document.documentElement.classList.remove('fonts-loading');
        document.documentElement.classList.add('fonts-loaded');
    });
} else {
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.documentElement.classList.remove('fonts-loading');
            document.documentElement.classList.add('fonts-loaded');
        }, 100);
    });
}

// Smart scroll restoration - remembers position per chapter
const SmartScrollRestoration = (() => {
    const SCROLL_STORAGE_KEY = 'chapter_scroll_positions';
    
    // Get current chapter identifier from URL
    const getCurrentChapter = () => {
        const path = window.location.pathname;
        const chapterMatch = path.match(/\/chapter(\d+)/);
        return chapterMatch ? `chapter${chapterMatch[1]}` : null;
    };
    
    // Get all saved scroll positions
    const getScrollPositions = () => {
        try {
            const stored = sessionStorage.getItem(SCROLL_STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            return {};
        }
    };
    
    // Save scroll position for current chapter
    const saveScrollPosition = () => {
        const currentChapter = getCurrentChapter();
        if (!currentChapter || !document.querySelector('.chapter-content')) return;
        
        const positions = getScrollPositions();
        positions[currentChapter] = {
            scrollY: window.scrollY,
            timestamp: Date.now(),
            url: window.location.href
        };
        
        try {
            sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(positions));
        } catch (e) {
            console.warn('Failed to save scroll position:', e);
        }
    };
    
    // Restore scroll position for current chapter
    const restoreScrollPosition = () => {
        const currentChapter = getCurrentChapter();
        if (!currentChapter || !document.querySelector('.chapter-content')) return;
        
        const positions = getScrollPositions();
        const savedPosition = positions[currentChapter];
        
        if (savedPosition && savedPosition.url === window.location.href) {
            // Only restore if we're returning to the exact same chapter page
            requestAnimationFrame(() => {
                window.scrollTo(0, savedPosition.scrollY);
                console.log(`Restored scroll position for ${currentChapter}: ${savedPosition.scrollY}px`);
            });
        }
    };
    
    // Clean up old scroll positions (older than 24 hours)
    const cleanupOldPositions = () => {
        const positions = getScrollPositions();
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        let hasChanges = false;
        Object.keys(positions).forEach(chapter => {
            if (now - positions[chapter].timestamp > maxAge) {
                delete positions[chapter];
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            try {
                sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(positions));
            } catch (e) {
                console.warn('Failed to cleanup scroll positions:', e);
            }
        }
    };
    
    const init = () => {
        // Set manual scroll restoration
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        
        // Clean up old positions on init
        cleanupOldPositions();
        
        // Save scroll position before leaving the page
        window.addEventListener('beforeunload', saveScrollPosition);
        
        // Also save scroll position when navigating via JavaScript (for SPA-like behavior)
        window.addEventListener('pagehide', saveScrollPosition);
        
        // Restore scroll position when page loads
        window.addEventListener('load', restoreScrollPosition);
        
        // Handle case where DOM is already ready
        if (document.readyState === 'complete') {
            restoreScrollPosition();
        }
    };
    
    return { init };
})();

// Initialize smart scroll restoration
SmartScrollRestoration.init();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
} else {
    App.init();
}
