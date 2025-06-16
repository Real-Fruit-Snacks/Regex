/**
 * Keyboard Shortcuts Module
 * Provides power-user keyboard shortcuts for the regex tester
 */

class KeyboardShortcuts {
    constructor(regexTester) {
        this.regexTester = regexTester;
        this.shortcuts = {
            // General
            'ctrl+/': () => this.toggleShortcutsModal(),
            'cmd+/': () => this.toggleShortcutsModal(),
            'f1': () => this.toggleHelpPanel(),
            'ctrl+p': () => this.focusPatternInput(),
            'cmd+p': () => this.focusPatternInput(),
            'ctrl+t': () => this.focusTestInput(),
            'cmd+t': () => this.focusTestInput(),
            
            // Pattern Actions
            'ctrl+shift+c': () => this.clearPattern(),
            'cmd+shift+c': () => this.clearPattern(),
            'ctrl+e': () => this.exportPattern(),
            'cmd+e': () => this.exportPattern(),
            'ctrl+s': (e) => { e.preventDefault(); this.sharePattern(); },
            'cmd+s': (e) => { e.preventDefault(); this.sharePattern(); },
            
            // Navigation
            'f3': () => this.nextMatch(),
            'shift+f3': () => this.previousMatch(),
            
            // Mode switching
            'alt+1': () => this.setMode('javascript'),
            'alt+2': () => this.setMode('pcre'),
            'alt+3': () => this.setMode('python'),
            'alt+4': () => this.setMode('grep'),
            
            // Quick actions
            'escape': () => this.closeModals()
        };
        
        this.currentMatchIndex = -1;
        this.init();
    }
    
    init() {
        // Set up keyboard event listener
        document.addEventListener('keydown', (e) => {
            const key = this.getKeyString(e);
            const handler = this.shortcuts[key];
            
            if (handler) {
                handler(e);
            }
        });
        
        // Set up UI event listeners
        this.setupUIListeners();
        
        // Load URL parameters if present
        this.loadFromURL();
    }
    
    setupUIListeners() {
        // Shortcuts button
        document.getElementById('shortcuts-button')?.addEventListener('click', () => {
            this.toggleShortcutsModal();
        });
        
        // Help button
        document.getElementById('help-button')?.addEventListener('click', () => {
            this.toggleHelpPanel();
        });
        
        // Close buttons
        document.getElementById('close-shortcuts')?.addEventListener('click', () => {
            this.closeShortcutsModal();
        });
        
        document.getElementById('close-help')?.addEventListener('click', () => {
            this.closeHelpPanel();
        });
        
        // Modal overlay clicks
        document.getElementById('shortcuts-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'shortcuts-modal') {
                this.closeShortcutsModal();
            }
        });
        
        // Test input actions
        document.getElementById('load-sample')?.addEventListener('click', () => {
            this.loadSampleText();
        });
        
        document.getElementById('clear-test')?.addEventListener('click', () => {
            this.clearTestInput();
        });
        
        // Character count
        document.getElementById('test-input')?.addEventListener('input', (e) => {
            this.updateCharCount(e.target.value);
        });
    }
    
    getKeyString(e) {
        const parts = [];
        
        if (e.ctrlKey || e.metaKey) parts.push(e.metaKey ? 'cmd' : 'ctrl');
        if (e.altKey) parts.push('alt');
        if (e.shiftKey) parts.push('shift');
        
        // Special keys
        const key = e.key.toLowerCase();
        const specialKeys = {
            ' ': 'space',
            'escape': 'escape',
            'enter': 'enter',
            'arrowup': 'up',
            'arrowdown': 'down',
            'arrowleft': 'left',
            'arrowright': 'right'
        };
        
        parts.push(specialKeys[key] || key);
        
        return parts.join('+');
    }
    
    // Shortcut Actions
    toggleShortcutsModal() {
        const modal = document.getElementById('shortcuts-modal');
        if (modal) {
            modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
        }
    }
    
    closeShortcutsModal() {
        const modal = document.getElementById('shortcuts-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    toggleHelpPanel() {
        const panel = document.getElementById('help-panel');
        if (panel) {
            panel.classList.toggle('open');
        }
    }
    
    closeHelpPanel() {
        const panel = document.getElementById('help-panel');
        if (panel) {
            panel.classList.remove('open');
        }
    }
    
    focusPatternInput() {
        const input = document.getElementById('regex-input');
        if (input) {
            input.focus();
            input.select();
        }
    }
    
    focusTestInput() {
        const input = document.getElementById('test-input');
        if (input) {
            input.focus();
        }
    }
    
    clearPattern() {
        const regexInput = document.getElementById('regex-input');
        const regexFlags = document.getElementById('regex-flags');
        
        if (regexInput) {
            regexInput.value = '';
            regexInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        if (regexFlags) {
            regexFlags.value = '';
            regexFlags.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
    
    exportPattern() {
        // Trigger export from pattern library
        document.getElementById('export-pattern')?.click();
    }
    
    sharePattern() {
        // Trigger share from pattern library
        document.getElementById('share-pattern')?.click();
    }
    
    nextMatch() {
        const matches = document.querySelectorAll('mark.highlight');
        if (matches.length === 0) return;
        
        this.currentMatchIndex = (this.currentMatchIndex + 1) % matches.length;
        this.scrollToMatch(matches[this.currentMatchIndex]);
    }
    
    previousMatch() {
        const matches = document.querySelectorAll('mark.highlight');
        if (matches.length === 0) return;
        
        this.currentMatchIndex = this.currentMatchIndex <= 0 ? matches.length - 1 : this.currentMatchIndex - 1;
        this.scrollToMatch(matches[this.currentMatchIndex]);
    }
    
    scrollToMatch(element) {
        if (!element) return;
        
        // Remove previous focus
        document.querySelectorAll('mark.highlight.focused').forEach(el => {
            el.classList.remove('focused');
        });
        
        // Add focus to current
        element.classList.add('focused');
        
        // Scroll into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    setMode(mode) {
        const modeSelect = document.getElementById('regex-mode');
        if (modeSelect) {
            modeSelect.value = mode;
            modeSelect.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Update dropdown UI
            const dropdown = document.querySelector('#dropdown-selected .selected-text');
            const option = document.querySelector(`[data-value="${mode}"] .option-name`);
            if (dropdown && option) {
                dropdown.textContent = option.textContent;
            }
        }
    }
    
    closeModals() {
        this.closeShortcutsModal();
        this.closeHelpPanel();
        
        // Close any other modals
        document.getElementById('modal-overlay').style.display = 'none';
    }
    
    loadSampleText() {
        const samples = {
            'Network': `192.168.1.1 - Server IP
10.0.0.0/24 - Internal subnet
fe80::1%lo0 - IPv6 link-local
00:1B:44:11:3A:B7 - MAC address
https://example.com:8080/api/v1/users
user@example.com
admin@192.168.1.1`,
            
            'Security': `Password123!
5d41402abc4b2a76b9719d911017c592 (MD5)
aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d (SHA-1)
2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae (SHA-256)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
            
            'Logs': `[2024-01-15 14:23:45] ERROR: Connection refused to 192.168.1.100:3306
[2024-01-15 14:23:46] INFO: Attempting reconnection...
[2024-01-15 14:23:47] DEBUG: Using credentials from /etc/mysql/conf.d
[2024-01-15 14:23:48] WARN: SSL certificate expires in 30 days
127.0.0.1 - - [15/Jan/2024:14:23:49 -0500] "GET /api/status HTTP/1.1" 200 256`,
            
            'Web': `<script>alert('XSS')</script>
<img src="x" onerror="alert('XSS')">
SELECT * FROM users WHERE id = '1' OR '1'='1'
../../../etc/passwd
Cookie: session_id=abc123; user_token=xyz789
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
        };
        
        const testInput = document.getElementById('test-input');
        const currentMode = document.querySelector('.category-chip.active')?.textContent || 'Network';
        
        if (testInput) {
            testInput.value = samples[currentMode] || samples['Network'];
            testInput.dispatchEvent(new Event('input', { bubbles: true }));
            this.updateCharCount(testInput.value);
        }
    }
    
    clearTestInput() {
        const testInput = document.getElementById('test-input');
        if (testInput) {
            testInput.value = '';
            testInput.dispatchEvent(new Event('input', { bubbles: true }));
            this.updateCharCount('');
        }
    }
    
    updateCharCount(text) {
        const counter = document.getElementById('char-count');
        if (counter) {
            const count = text.length;
            const lines = text.split('\n').length;
            counter.textContent = `${count} chars, ${lines} lines`;
        }
    }
    
    loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        const pattern = params.get('pattern');
        const flags = params.get('flags');
        const mode = params.get('mode');
        const test = params.get('test');
        
        if (pattern) {
            const regexInput = document.getElementById('regex-input');
            if (regexInput) {
                regexInput.value = pattern;
                regexInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
        
        if (flags) {
            const flagsInput = document.getElementById('regex-flags');
            if (flagsInput) {
                flagsInput.value = flags;
                flagsInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
        
        if (mode) {
            this.setMode(mode);
        }
        
        if (test) {
            const testInput = document.getElementById('test-input');
            if (testInput) {
                testInput.value = decodeURIComponent(test);
                testInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    }
}

// Additional styles for keyboard shortcuts
const shortcutStyles = `
<style>
mark.highlight.focused {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.5), rgba(255, 140, 0, 0.5));
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
    animation: focusPulse 1s ease-in-out infinite;
}

@keyframes focusPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.test-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.test-actions {
    display: flex;
    gap: 8px;
}
</style>
`;

// Inject shortcut styles
if (!document.getElementById('keyboard-shortcut-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'keyboard-shortcut-styles';
    styleElement.innerHTML = shortcutStyles;
    document.head.appendChild(styleElement.firstChild);
}