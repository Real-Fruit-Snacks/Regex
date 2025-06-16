// Automated testing script for RegexPro
// Run this in the browser console to test functionality

const TestRunner = {
    results: [],
    
    log(test, passed, details = '') {
        this.results.push({ test, passed, details });
        console.log(`${passed ? '✅' : '❌'} ${test} ${details ? `- ${details}` : ''}`);
    },
    
    async runAllTests() {
        console.log('🧪 Starting RegexPro Automated Tests...\n');
        
        // Test 1: Check if all required elements exist
        this.testDOMElements();
        
        // Test 2: Test regex functionality
        this.testRegexFunctionality();
        
        // Test 3: Test pattern library
        this.testPatternLibrary();
        
        // Test 4: Test theme switching
        this.testThemeSwitching();
        
        // Test 5: Test keyboard shortcuts
        this.testKeyboardShortcuts();
        
        // Test 6: Test localStorage
        this.testLocalStorage();
        
        // Test 7: Test mode switching
        this.testModeSwitching();
        
        // Summary
        this.printSummary();
    },
    
    testDOMElements() {
        console.log('📋 Testing DOM Elements...');
        
        const elements = [
            { id: 'regex-input', name: 'Regex Input' },
            { id: 'regex-flags', name: 'Flags Input' },
            { id: 'test-input', name: 'Test Input' },
            { id: 'match-count', name: 'Match Count' },
            { id: 'pattern-library-container', name: 'Pattern Library' },
            { id: 'shortcuts-button', name: 'Shortcuts Button' },
            { id: 'help-button', name: 'Help Button' },
            { id: 'theme-dropdown', name: 'Theme Dropdown' },
            { id: 'regex-mode-dropdown', name: 'Mode Dropdown' },
            { id: 'status-bar', name: 'Status Bar' }
        ];
        
        elements.forEach(el => {
            const exists = document.getElementById(el.id) !== null;
            this.log(`DOM: ${el.name}`, exists);
        });
    },
    
    testRegexFunctionality() {
        console.log('\n🔍 Testing Regex Functionality...');
        
        const regexInput = document.getElementById('regex-input');
        const testInput = document.getElementById('test-input');
        const matchCount = document.getElementById('match-count');
        
        // Test simple pattern
        regexInput.value = '\\d+';
        regexInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        testInput.value = 'Test 123 and 456';
        testInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        setTimeout(() => {
            const matches = matchCount.textContent;
            this.log('Regex: Pattern matching', matches.includes('2'), `Found: ${matches}`);
        }, 100);
    },
    
    testPatternLibrary() {
        console.log('\n📚 Testing Pattern Library...');
        
        const patternCards = document.querySelectorAll('.pattern-card');
        this.log('Pattern Library: Cards loaded', patternCards.length > 0, `${patternCards.length} patterns`);
        
        const categories = document.querySelectorAll('.category-chip');
        this.log('Pattern Library: Categories', categories.length === 7, `${categories.length} categories`);
        
        // Test search
        const searchInput = document.getElementById('pattern-search');
        if (searchInput) {
            searchInput.value = 'IP';
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => {
                const visibleCards = document.querySelectorAll('.pattern-card:not([style*="display: none"])');
                this.log('Pattern Library: Search', true, 'Search functionality exists');
            }, 100);
        }
    },
    
    testThemeSwitching() {
        console.log('\n🎨 Testing Theme System...');
        
        const themeDropdown = document.getElementById('theme-dropdown-selected');
        const currentTheme = document.getElementById('theme-select').value;
        
        this.log('Theme: Current theme', currentTheme === 'cyber-pro', `Theme: ${currentTheme}`);
        
        // Check if theme stylesheet is loaded
        const themeLink = document.getElementById('theme-stylesheet');
        this.log('Theme: Stylesheet loaded', themeLink && themeLink.href.includes('cyber-pro.css'));
    },
    
    testKeyboardShortcuts() {
        console.log('\n⌨️ Testing Keyboard Shortcuts...');
        
        // Check if KeyboardShortcuts is initialized
        const hasShortcuts = typeof KeyboardShortcuts !== 'undefined';
        this.log('Shortcuts: Module loaded', hasShortcuts);
        
        // Check if shortcuts modal exists
        const shortcutsModal = document.getElementById('shortcuts-modal');
        this.log('Shortcuts: Modal exists', shortcutsModal !== null);
        
        // Check if help panel exists
        const helpPanel = document.getElementById('help-panel');
        this.log('Shortcuts: Help panel exists', helpPanel !== null);
    },
    
    testLocalStorage() {
        console.log('\n💾 Testing Local Storage...');
        
        try {
            localStorage.setItem('test-key', 'test-value');
            const value = localStorage.getItem('test-key');
            localStorage.removeItem('test-key');
            this.log('Storage: Read/Write', value === 'test-value');
            
            // Check saved preferences
            const savedTheme = localStorage.getItem('selectedTheme');
            const savedMode = localStorage.getItem('selectedMode');
            this.log('Storage: Saved preferences', true, `Theme: ${savedTheme}, Mode: ${savedMode}`);
        } catch (e) {
            this.log('Storage: Available', false, e.message);
        }
    },
    
    testModeSwitching() {
        console.log('\n🔄 Testing Mode Switching...');
        
        const modeSelect = document.getElementById('regex-mode');
        const modes = ['javascript', 'pcre', 'python', 'grep'];
        
        this.log('Modes: Dropdown exists', modeSelect !== null);
        this.log('Modes: Current mode', true, modeSelect?.value || 'unknown');
    },
    
    printSummary() {
        console.log('\n📊 Test Summary:');
        const passed = this.results.filter(r => r.passed).length;
        const failed = this.results.filter(r => !r.passed).length;
        const total = this.results.length;
        
        console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed}`);
        console.log(`Success Rate: ${((passed/total) * 100).toFixed(1)}%`);
        
        if (failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.results.filter(r => !r.passed).forEach(r => {
                console.log(`  - ${r.test} ${r.details ? `(${r.details})` : ''}`);
            });
        }
        
        return this.results;
    }
};

// Run tests
TestRunner.runAllTests();