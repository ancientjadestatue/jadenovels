---
layout: default
title: Continue Reading
---

<style>
/* Continue Reading Button Styles */
:root {
    /* Dark theme gradient colors */
    --continue-reading-gradient-start:rgba(142, 118, 88, 0.83);
    --continue-reading-gradient-end: rgba(19, 78, 86, 0.77);
    --continue-reading-text: white;
    --continue-reading-text-secondary: rgba(255, 255, 255, 0.85);
    --continue-reading-text-muted: rgba(255, 255, 255, 0.8);
    --continue-reading-bg-overlay: rgba(255, 255, 255, 0.15);
    --continue-reading-bg-glass: rgba(255, 255, 255, 0.2);
    --continue-reading-bg-option: rgba(255, 255, 255, 0.1);
    --continue-reading-border-option: rgba(255, 255, 255, 0.2);
    --continue-reading-shadow: rgba(102, 126, 234, 0.25);
    --continue-reading-shadow-hover: rgba(102, 126, 234, 0.35);
    --continue-reading-progress-bg: rgba(255, 255, 255, 0.2);
    --continue-reading-progress-glow: rgba(79, 172, 254, 0.4);
}

/* Light theme overrides */
[data-theme="light"] {
    --continue-reading-text-muted: rgba(0, 0, 0, 0.85);
    --continue-reading-bg-overlay: rgba(255, 255, 255, 0.2);
    --continue-reading-bg-glass: rgba(255, 255, 255, 0.25);
    --continue-reading-bg-option: rgba(255, 255, 255, 0.15);
    --continue-reading-border-option: rgba(255, 255, 255, 0.3);
}

.continue-reading-btn {
    width: 100%;
    background: linear-gradient(135deg, var(--continue-reading-gradient-start) 0%, var(--continue-reading-gradient-end) 100%);
    border: none;
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    color: var(--continue-reading-text);
    cursor: pointer;
    box-shadow: 0 4px 20px var(--continue-reading-shadow);
    position: relative;
    overflow: hidden;
    font-family: inherit;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 100px;
}


.continue-reading-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.continue-reading-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    background: var(--continue-reading-bg-overlay);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
}

.continue-reading-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.continue-reading-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--continue-reading-text);
    margin: 0;
    line-height: 1.3;
}

.continue-reading-location {
    font-size: 0.9rem;
    color: var(--continue-reading-text-secondary);
    font-weight: 400;
    margin: 0;
    line-height: 1.4;
}


#continue-reading-progress-text {
    font-size: 0.8rem;
    color: var(--continue-reading-text-muted);
    text-align: center;
    margin-top: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.025em;
    line-height: 1.4;
}

.reading-options {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
    flex-wrap: wrap;
}

/* Pill-sized Continue Reading Button for Infinity Bar */
.continue-reading-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, var(--continue-reading-gradient-start) 0%, var(--continue-reading-gradient-end) 100%);
    border: none;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    color: var(--continue-reading-text);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 400;
    text-decoration: none;
    white-space: nowrap;
    box-shadow: 0 2px 8px var(--continue-reading-shadow);
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
}

.continue-reading-pill:hover {
    box-shadow: 0 4px 12px var(--continue-reading-shadow-hover);
    transform: translateY(-1px);
}

.continue-reading-pill-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

.continue-reading-pill-text {
    font-weight: 400;
    letter-spacing: 0.01em;
}

/* Progress indicator for pill button */
.continue-reading-pill-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background: var(--continue-reading-progress-glow);
    border-radius: 0 0 20px 20px;
    transition: width 0.3s ease;
}

/* Specific styles for infinity bar continue reading pill */
#continue-reading-pill-nav {
    font-size: 0.75rem;
    font-weight: 400;
}

#continue-reading-pill-text-nav {
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 0.01em;
}
</style>

<section class="book-hero">
    <div class="book-hero-content">
        <div class="grid grid--hero">
            <a href="{{ '/books/unfiltered/unfiltered.html' | relative_url }}">
                <img src="{{ '/assets/unfiltered.jpeg' | relative_url }}" alt="Unfiltered Book Cover" class="img-cover">
            </a>
            <div class="book-details">
                <h1 class="title title--book-hero">Unfiltered</h1>
                <p class="subtitle subtitle--book">A Raw, Emotional Journey Through Modern Love</p>
                <div class="book-stats">
                        <span class="badge badge--stat">Romance</span>
                        <span class="badge badge--stat">Contemporary</span>
                        <span class="badge badge--stat">Ongoing</span>
                    </div>
                <div class="continue-reading-section" id="continue-reading-section">     <button class="continue-reading-btn" id="continue-reading-btn">
                        <div class="continue-reading-content">
                            <div class="continue-reading-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                </svg>
                            </div>
                            <div class="continue-reading-text">
                                <span class="continue-reading-title">Continue Reading</span>
                                <span class="continue-reading-location" id="continue-reading-location">Start from Chapter 1</span>
                            </div>
                        </div>
                        <div class="continue-reading-progress">
                            <div class="continue-reading-progress-bar" id="continue-reading-progress-bar"></div>
                        </div>
                    </button>
                    <div class="reading-options">
                        <a href="{{ '/books/unfiltered/unfiltered' | relative_url }}" class="reading-option">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                            </svg>
                            All Chapters
                        </a>
                        <button class="reading-option" id="reset-progress-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                                <path d="M21 3v5h-5"/>
                                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                                <path d="M3 21v-5h5"/>
                            </svg>
                            Start Over
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Bookmarks Section -->
<section class="bookmarks-section" id="bookmarks-section" style="display: none;">
    <div class="container">
        <div class="bookmarks-header">
            <h2 class="bookmarks-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                Your Bookmarks
            </h2>
            <p class="bookmarks-subtitle">Here are your saved moments</p>
        </div>
        <div class="bookmarks-grid" id="bookmarks-grid">
            <!-- Bookmarks will be populated by JavaScript -->
        </div>
        <div class="bookmarks-empty" id="bookmarks-empty">
            <div class="bookmarks-empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
            </div>
            <h3>No bookmarks yet</h3>
            <p>Start reading and use the bookmark button in the reading interface to save special moments.</p>
        </div>
    </div>
</section>

<style>
/* Bookmarks Section Styles */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.bookmarks-section {
    padding: 3rem 0;
    background: var(--bg-secondary, #f8f9fa);
}

[data-theme="light"] .bookmarks-section {
    background: var(--bg-primary, #ffffff);
}

/* Dark theme support for bookmarks */
:root:not([data-theme="light"]) .bookmarks-section {
    background: var(--bg-secondary, #1a202c);
}

:root:not([data-theme="light"]) .bookmark-card {
    background: var(--bg-primary, #2d3748);
    border-color: var(--border-primary, #4a5568);
}

:root:not([data-theme="light"]) .bookmark-card:hover {
    border-color: var(--primary-color, #9f7aea);
}

:root:not([data-theme="light"]) .bookmark-progress-bar {
    background: var(--bg-secondary, #4a5568);
}

.bookmarks-header {
    text-align: center;
    margin-bottom: 2.5rem;
}

.bookmarks-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--text-primary, #2d3748);
    margin: 0 0 0.5rem 0;
    line-height: 1.2;
}

.bookmarks-subtitle {
    font-size: 1rem;
    color: var(--text-secondary, #718096);
    margin: 0;
    font-weight: 400;
}

.bookmarks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.bookmark-card {
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-primary, #e2e8f0);
    border-radius: 12px;
    padding: 1.25rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;
}

.bookmark-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    border-color: var(--primary-color, #4f46e5);
}

.bookmark-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.bookmark-chapter {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--accent);
    margin: 0;
    letter-spacing: 0.025em;
}

.bookmark-remove {
    background: none;
    border: none;
    color: var(--text-muted, #a0aec0);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: color 0.2s ease;
    flex-shrink: 0;
}

.bookmark-remove:hover {
    color: var(--danger-color, #e53e3e);
    background: var(--danger-bg, rgba(229, 62, 62, 0.1));
}

.bookmark-title {
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-primary, #2d3748);
    margin: 0 0 0.5rem 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.bookmark-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.bookmark-progress {
    font-size: 0.8rem;
    color: var(--text-secondary, #718096);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.bookmark-progress-bar {
    flex: 1;
    height: 3px;
    background: var(--bg-secondary, #f1f5f9);
    border-radius: 2px;
    overflow: hidden;
}

.bookmark-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent) 0%, #ff6b6b 100%);
    border-radius: 2px;
    transition: width 0.3s ease;
}

.bookmark-date {
    font-size: 0.75rem;
    color: var(--text-muted, #a0aec0);
    font-weight: 400;
}

.bookmark-preview {
    font-size: 0.85rem;
    color: var(--text-secondary, #718096);
    line-height: 1.5;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-secondary, #f1f5f9);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-style: italic;
}

.bookmarks-empty {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-secondary, #718096);
}

.bookmarks-empty-icon {
    margin: 0 auto 1.5rem;
    opacity: 0.5;
    color: var(--text-muted, #a0aec0);
}

.bookmarks-empty h3 {
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--text-primary, #2d3748);
    margin: 0 0 0.75rem 0;
}

.bookmarks-empty p {
    font-size: 0.95rem;
    line-height: 1.6;
    max-width: 400px;
    margin: 0 auto;
}

/* Responsive Design */
@media (max-width: 768px) {
    .bookmarks-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .bookmark-card {
        padding: 1rem;
    }
    
    .bookmarks-title {
        font-size: 1.5rem;
    }
    
    .bookmarks-section {
        padding: 2rem 0;
    }
}

@media (max-width: 480px) {
    .bookmarks-header {
        margin-bottom: 1.5rem;
    }
    
    .bookmarks-title {
        font-size: 1.25rem;
        gap: 0.5rem;
    }
    
    .bookmark-card {
        padding: 0.875rem;
    }
}

/* Extra small screens */
@media (max-width: 360px) {
    .bookmarks-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }
    
    .bookmark-card {
        padding: 0.75rem;
    }
    
    .bookmark-title {
        font-size: 0.9rem;
    }
    
    .bookmark-progress {
        font-size: 0.75rem;
    }
}
</style>
