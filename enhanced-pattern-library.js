/**
 * Enhanced Pattern Library for Cybersecurity
 * Integrates with CyberPatterns for professional regex testing
 */

class EnhancedPatternLibrary {
    constructor(regexTester) {
        this.regexTester = regexTester;
        this.container = document.getElementById('pattern-library-container');
        this.selectedCategory = 'Network';
        this.domCache = new Map(); // Performance optimization
        this.recentPatterns = this.loadRecentPatterns();
        this.init();
    }

    init() {
        if (!this.container) return;
        
        // Load cyber patterns if available
        if (typeof CyberPatterns !== 'undefined') {
            this.patterns = CyberPatterns;
        } else {
            // Fallback to basic patterns
            this.patterns = {
                categories: ['Basic'],
                patterns: {
                    'Basic': [
                        {
                            name: 'Email',
                            pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
                            description: 'Matches email addresses',
                            example: 'user@example.com'
                        }
                    ]
                },
                getAllCategories: function() { return this.categories; },
                getPatternsByCategory: function(cat) { return this.patterns[cat] || []; }
            };
        }
        
        this.render();
        this.bindEvents();
        this.updateRecentPatterns();
    }
    
    render() {
        const categories = this.patterns.getAllCategories();
        const patterns = this.patterns.getPatternsByCategory(this.selectedCategory);
        
        this.container.innerHTML = `
            <div class="pattern-categories">
                ${categories.map(cat => `
                    <div class="category-chip ${cat === this.selectedCategory ? 'active' : ''}" 
                         data-category="${cat}">
                        ${cat}
                    </div>
                `).join('')}
            </div>
            <div class="pattern-search-wrapper">
                <input type="text" 
                       class="pattern-search" 
                       id="pattern-search" 
                       placeholder="Search patterns..." 
                       autocomplete="off">
            </div>
            <div class="pattern-grid" id="pattern-grid">
                ${this.renderPatterns(patterns)}
            </div>
        `;
        
        // Update pattern count
        const countElement = document.getElementById('pattern-count');
        if (countElement) {
            countElement.textContent = patterns.length;
        }
    }
    
    renderPatterns(patterns) {
        if (patterns.length === 0) {
            return '<div class="empty-state">No patterns found</div>';
        }
        
        return patterns.map(pattern => `
            <div class="pattern-card" 
                 data-pattern="${this.escapeHtml(pattern.pattern)}"
                 data-name="${this.escapeHtml(pattern.name)}"
                 title="${this.escapeHtml(pattern.description)}">
                <div class="pattern-name">${this.escapeHtml(pattern.name)}</div>
                <div class="pattern-value">${this.truncatePattern(pattern.pattern)}</div>
                ${pattern.example ? `
                    <div class="pattern-example">Ex: ${this.escapeHtml(pattern.example)}</div>
                ` : ''}
            </div>
        `).join('');
    }
    
    truncatePattern(pattern) {
        const escaped = this.escapeHtml(pattern);
        if (escaped.length > 40) {
            return escaped.substring(0, 37) + '...';
        }
        return escaped;
    }
    
    bindEvents() {
        // Category selection
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-chip')) {
                this.selectCategory(e.target.dataset.category);
            }
            
            if (e.target.closest('.pattern-card')) {
                const card = e.target.closest('.pattern-card');
                this.usePattern(card.dataset.pattern, card.dataset.name);
            }
        });
        
        // Search functionality with caching
        this.searchInput = this.getCachedElement('pattern-search');
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.searchPatterns(e.target.value);
            });
        }
        
        // Recent patterns
        this.updateRecentPatternsUI();
        
        // Export/Share buttons
        document.getElementById('export-pattern')?.addEventListener('click', () => {
            this.exportPattern();
        });
        
        document.getElementById('share-pattern')?.addEventListener('click', () => {
            this.sharePattern();
        });
        
        document.getElementById('clear-recent')?.addEventListener('click', () => {
            this.clearRecentPatterns();
        });
    }
    
    selectCategory(category) {
        this.selectedCategory = category;
        
        // Update active state
        document.querySelectorAll('.category-chip').forEach(chip => {
            chip.classList.toggle('active', chip.dataset.category === category);
        });
        
        // Update patterns
        const patterns = this.patterns.getPatternsByCategory(category);
        const grid = document.getElementById('pattern-grid');
        if (grid) {
            grid.innerHTML = this.renderPatterns(patterns);
        }
        
        // Update count
        document.getElementById('pattern-count').textContent = patterns.length;
    }
    
    searchPatterns(query) {
        if (!query) {
            const patterns = this.patterns.getPatternsByCategory(this.selectedCategory);
            document.getElementById('pattern-grid').innerHTML = this.renderPatterns(patterns);
            return;
        }
        
        const results = this.patterns.searchPatterns(query);
        document.getElementById('pattern-grid').innerHTML = this.renderPatterns(results);
    }
    
    usePattern(pattern, name) {
        // Set the pattern in the input
        const regexInput = document.getElementById('regex-input');
        const regexFlags = document.getElementById('regex-flags');
        
        if (regexInput) {
            regexInput.value = pattern;
            regexInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Add to recent patterns
            this.addToRecentPatterns({ pattern, name });
            
            // Visual feedback
            regexInput.classList.add('pattern-applied');
            setTimeout(() => {
                regexInput.classList.remove('pattern-applied');
            }, 500);
            
            // Focus on test input
            document.getElementById('test-input')?.focus();
        }
    }
    
    addToRecentPatterns(patternData) {
        // Remove if already exists
        this.recentPatterns = this.recentPatterns.filter(p => p.pattern !== patternData.pattern);
        
        // Add to beginning
        this.recentPatterns.unshift({
            ...patternData,
            timestamp: Date.now()
        });
        
        // Keep only last 10
        this.recentPatterns = this.recentPatterns.slice(0, 10);
        
        // Save and update UI
        this.saveRecentPatterns();
        this.updateRecentPatternsUI();
    }
    
    updateRecentPatternsUI() {
        const container = document.getElementById('recent-patterns');
        if (!container) return;
        
        if (this.recentPatterns.length === 0) {
            container.innerHTML = '<div class="empty-state">No recent patterns</div>';
            return;
        }
        
        container.innerHTML = this.recentPatterns.map(pattern => `
            <div class="recent-pattern-item" 
                 data-pattern="${this.escapeHtml(pattern.pattern)}"
                 data-name="${this.escapeHtml(pattern.name)}">
                <div class="pattern-name">${this.escapeHtml(pattern.name)}</div>
                <div class="pattern-value">${this.truncatePattern(pattern.pattern)}</div>
            </div>
        `).join('');
        
        // Add click handlers
        container.querySelectorAll('.recent-pattern-item').forEach(item => {
            item.addEventListener('click', () => {
                this.usePattern(item.dataset.pattern, item.dataset.name);
            });
        });
    }
    
    clearRecentPatterns() {
        if (confirm('Clear all recent patterns?')) {
            this.recentPatterns = [];
            this.saveRecentPatterns();
            this.updateRecentPatternsUI();
        }
    }
    
    exportPattern() {
        const regexInput = document.getElementById('regex-input');
        const regexFlags = document.getElementById('regex-flags');
        const mode = document.getElementById('regex-mode');
        
        if (!regexInput?.value) {
            alert('No pattern to export');
            return;
        }
        
        const exportData = {
            pattern: regexInput.value,
            flags: regexFlags?.value || '',
            mode: mode?.value || 'javascript',
            timestamp: new Date().toISOString()
        };
        
        // Create download
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportName = `regex-pattern-${Date.now()}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportName);
        linkElement.click();
    }
    
    sharePattern() {
        const regexInput = document.getElementById('regex-input');
        const regexFlags = document.getElementById('regex-flags');
        
        if (!regexInput?.value) {
            alert('No pattern to share');
            return;
        }
        
        // Create shareable URL
        const params = new URLSearchParams({
            pattern: regexInput.value,
            flags: regexFlags?.value || '',
            mode: document.getElementById('regex-mode')?.value || 'javascript'
        });
        
        const shareUrl = window.location.origin + window.location.pathname + '?' + params.toString();
        
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            // Visual feedback
            const btn = document.getElementById('share-pattern');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
            btn.classList.add('success');
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('success');
            }, 2000);
        }).catch(() => {
            prompt('Copy this URL to share:', shareUrl);
        });
    }
    
    loadRecentPatterns() {
        try {
            const saved = localStorage.getItem('recentRegexPatterns');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }
    
    saveRecentPatterns() {
        try {
            localStorage.setItem('recentRegexPatterns', JSON.stringify(this.recentPatterns));
        } catch (e) {
            console.error('Failed to save recent patterns:', e);
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // DOM element caching for performance
    getCachedElement(id) {
        const selector = `#${id}`;
        if (this.domCache.has(selector)) {
            const cached = this.domCache.get(selector);
            if (cached && document.contains(cached)) {
                return cached;
            } else {
                this.domCache.delete(selector);
            }
        }
        
        const element = document.getElementById(id);
        if (element) {
            this.domCache.set(selector, element);
        }
        return element;
    }

    // Cleanup method for memory management
    cleanup() {
        // Clear any intervals or timeouts
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        // Clear references
        this.regexTester = null;
        this.patternContainer = null;
        this.searchInput = null;
        this.searchResults = null;
        this.recentPatterns = [];
        
        // Clear DOM cache
        if (this.domCache) {
            this.domCache.clear();
        }
        
        console.log('EnhancedPatternLibrary cleanup completed');
    }
}

// Additional styles for the enhanced pattern library
const enhancedStyles = `
<style>
.pattern-search-wrapper {
    margin: 12px 0;
}

.pattern-search {
    width: 100%;
    padding: 8px 12px;
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    border-radius: 6px;
    color: var(--text-primary);
    font-size: 13px;
    font-family: var(--font-mono);
}

.pattern-search:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 2px rgba(0, 255, 65, 0.1);
}

.recent-pattern-item {
    padding: 8px 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 6px;
}

.recent-pattern-item:hover {
    background: var(--bg-hover);
    border-color: var(--accent-primary);
}

.pattern-example {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 4px;
}

.pattern-applied {
    animation: patternPulse 0.5s ease;
}

@keyframes patternPulse {
    0% { box-shadow: 0 0 0 0 rgba(0, 255, 65, 0); }
    50% { box-shadow: 0 0 0 4px rgba(0, 255, 65, 0.3); }
    100% { box-shadow: 0 0 0 0 rgba(0, 255, 65, 0); }
}

.action-button.success {
    background: var(--accent-secondary) !important;
}
</style>
`;

// Inject enhanced styles
if (!document.getElementById('enhanced-pattern-library-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'enhanced-pattern-library-styles';
    styleElement.innerHTML = enhancedStyles;
    document.head.appendChild(styleElement.firstChild);
}