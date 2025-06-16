// Comprehensive RegexPro Test Suite
// This script performs an exhaustive check of all functionality

const ComprehensiveTest = {
    results: {
        passed: [],
        failed: [],
        warnings: []
    },
    
    async runAllTests() {
        console.clear();
        console.log('🔬 COMPREHENSIVE REGEXPRO TEST SUITE');
        console.log('====================================\n');
        
        // Phase 1: Environment & Loading
        await this.testPhase1_Environment();
        
        // Phase 2: DOM Structure
        await this.testPhase2_DOM();
        
        // Phase 3: Core Functionality
        await this.testPhase3_CoreFunctionality();
        
        // Phase 4: Pattern Library
        await this.testPhase4_PatternLibrary();
        
        // Phase 5: UI Interactions
        await this.testPhase5_UIInteractions();
        
        // Phase 6: Keyboard Shortcuts
        await this.testPhase6_KeyboardShortcuts();
        
        // Phase 7: Data Persistence
        await this.testPhase7_DataPersistence();
        
        // Phase 8: Theme System
        await this.testPhase8_ThemeSystem();
        
        // Phase 9: Error Handling
        await this.testPhase9_ErrorHandling();
        
        // Phase 10: Performance
        await this.testPhase10_Performance();
        
        // Final Report
        this.generateReport();
    },
    
    // Test Utilities
    test(name, condition, details = '') {
        if (condition) {
            this.results.passed.push({ name, details });
            console.log(`✅ ${name} ${details ? `(${details})` : ''}`);
        } else {
            this.results.failed.push({ name, details });
            console.log(`❌ ${name} ${details ? `(${details})` : ''}`);
        }
    },
    
    warn(name, details) {
        this.results.warnings.push({ name, details });
        console.log(`⚠️  ${name} (${details})`);
    },
    
    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // PHASE 1: Environment & Loading
    async testPhase1_Environment() {
        console.log('\n📦 PHASE 1: ENVIRONMENT & LOADING\n');
        
        // Check window errors
        const hasErrors = window.__errorCount || 0;
        this.test('No JavaScript errors on load', hasErrors === 0, `${hasErrors} errors found`);
        
        // Check critical scripts loaded
        this.test('RegexTester class loaded', typeof RegexTester !== 'undefined');
        this.test('EnhancedPatternLibrary loaded', typeof EnhancedPatternLibrary !== 'undefined');
        this.test('KeyboardShortcuts loaded', typeof KeyboardShortcuts !== 'undefined');
        this.test('CyberPatterns loaded', typeof CyberPatterns !== 'undefined');
        
        // Check instances
        this.test('regexTester instance created', typeof regexTester !== 'undefined');
        this.test('enhancedPatternLibrary instance', typeof enhancedPatternLibrary !== 'undefined');
        this.test('keyboardShortcuts instance', typeof keyboardShortcuts !== 'undefined');
        
        // Check theme
        const themeLink = document.getElementById('theme-stylesheet');
        this.test('Theme stylesheet loaded', themeLink !== null);
        this.test('Cyber Pro theme active', themeLink?.href.includes('cyber-pro.css'));
        
        // Check fonts
        const fontLink = document.querySelector('link[href*="fonts.googleapis"]');
        this.test('Google Fonts link present', fontLink !== null);
    },
    
    // PHASE 2: DOM Structure
    async testPhase2_DOM() {
        console.log('\n🏗️ PHASE 2: DOM STRUCTURE\n');
        
        const elements = {
            // Header
            'Header logo': 'h1',
            'Version badge': '.version-badge',
            'Theme dropdown': '#theme-dropdown',
            'Shortcuts button': '#shortcuts-button',
            'Help button': '#help-button',
            
            // Sidebar
            'Pattern library container': '#pattern-library-container',
            'Pattern categories': '.pattern-categories',
            'Pattern search': '#pattern-search',
            'Recent patterns': '#recent-patterns',
            'Export button': '#export-pattern',
            'Share button': '#share-pattern',
            
            // Main content
            'Regex input': '#regex-input',
            'Regex flags': '#regex-flags',
            'Test input': '#test-input',
            'Match count': '#match-count',
            'Match details': '#match-details',
            'Mode dropdown': '#regex-mode-dropdown',
            'Mode info': '#mode-info',
            'Flags info': '#flags-info',
            
            // Modals & panels
            'Help panel': '#help-panel',
            'Shortcuts modal': '#shortcuts-modal',
            'Modal overlay': '#modal-overlay',
            
            // Status bar
            'Status bar': '.status-bar',
            'Character count': '#char-count',
            'Current mode': '#current-mode'
        };
        
        for (const [name, selector] of Object.entries(elements)) {
            const element = document.querySelector(selector);
            this.test(`DOM: ${name}`, element !== null, selector);
        }
    },
    
    // PHASE 3: Core Functionality
    async testPhase3_CoreFunctionality() {
        console.log('\n⚡ PHASE 3: CORE REGEX FUNCTIONALITY\n');
        
        const regexInput = document.getElementById('regex-input');
        const flagsInput = document.getElementById('regex-flags');
        const testInput = document.getElementById('test-input');
        const matchCount = document.getElementById('match-count');
        
        // Clear inputs
        regexInput.value = '';
        flagsInput.value = '';
        testInput.value = '';
        
        // Test 1: Simple pattern
        console.log('Testing simple pattern...');
        regexInput.value = '\\d+';
        regexInput.dispatchEvent(new Event('input', { bubbles: true }));
        testInput.value = 'Test 123 and 456';
        testInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        await this.wait(100);
        
        const matches = document.querySelectorAll('mark.highlight');
        this.test('Simple pattern matching', matches.length === 2, `${matches.length} matches`);
        this.test('Match count updated', matchCount.textContent.includes('2'));
        
        // Test 2: Pattern with flags
        console.log('Testing pattern with flags...');
        regexInput.value = 'test';
        flagsInput.value = 'gi';
        regexInput.dispatchEvent(new Event('input', { bubbles: true }));
        testInput.value = 'Test TEST test';
        testInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        await this.wait(100);
        
        const caseMatches = document.querySelectorAll('mark.highlight');
        this.test('Case-insensitive matching', caseMatches.length === 3, `${caseMatches.length} matches`);
        
        // Test 3: Groups
        console.log('Testing capture groups...');
        regexInput.value = '(\\w+)@(\\w+\\.\\w+)';
        flagsInput.value = 'g';
        regexInput.dispatchEvent(new Event('input', { bubbles: true }));
        testInput.value = 'Contact: john@example.com and jane@test.org';
        testInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        await this.wait(100);
        
        const details = document.querySelectorAll('.match-item');
        this.test('Match details shown', details.length > 0);
        const hasGroups = Array.from(details).some(d => d.textContent.includes('Group'));
        this.test('Capture groups displayed', hasGroups);
    },
    
    // PHASE 4: Pattern Library
    async testPhase4_PatternLibrary() {
        console.log('\n📚 PHASE 4: PATTERN LIBRARY\n');
        
        // Check categories
        const categories = document.querySelectorAll('.category-chip');
        this.test('Pattern categories loaded', categories.length === 7, `${categories.length} categories`);
        
        // Check if CyberPatterns categories match
        if (typeof CyberPatterns !== 'undefined') {
            const expectedCategories = CyberPatterns.getAllCategories();
            this.test('Categories match CyberPatterns', categories.length === expectedCategories.length);
        }
        
        // Test category switching
        const networkCategory = Array.from(categories).find(c => c.textContent === 'Network');
        if (networkCategory) {
            networkCategory.click();
            await this.wait(100);
            
            const patterns = document.querySelectorAll('.pattern-card');
            this.test('Network patterns loaded', patterns.length > 0, `${patterns.length} patterns`);
            
            // Click a pattern
            if (patterns.length > 0) {
                const firstPattern = patterns[0];
                const patternValue = firstPattern.dataset.pattern;
                firstPattern.click();
                await this.wait(100);
                
                const regexInput = document.getElementById('regex-input');
                this.test('Pattern loads on click', regexInput.value === patternValue);
            }
        }
        
        // Test search
        const searchInput = document.getElementById('pattern-search');
        if (searchInput) {
            searchInput.value = 'IP';
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            await this.wait(100);
            
            const visiblePatterns = document.querySelectorAll('.pattern-card');
            this.test('Pattern search works', visiblePatterns.length > 0);
            
            // Clear search
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
    },
    
    // PHASE 5: UI Interactions
    async testPhase5_UIInteractions() {
        console.log('\n🖱️ PHASE 5: UI INTERACTIONS\n');
        
        // Test mode dropdown
        const modeDropdown = document.getElementById('dropdown-selected');
        if (modeDropdown) {
            modeDropdown.click();
            await this.wait(100);
            
            const dropdownOpen = modeDropdown.classList.contains('open');
            this.test('Mode dropdown opens', dropdownOpen);
            
            // Click outside to close
            document.body.click();
            await this.wait(100);
            
            const dropdownClosed = !modeDropdown.classList.contains('open');
            this.test('Mode dropdown closes', dropdownClosed);
        }
        
        // Test theme dropdown
        const themeDropdown = document.getElementById('theme-dropdown-selected');
        if (themeDropdown) {
            themeDropdown.click();
            await this.wait(100);
            
            const themeOpen = themeDropdown.classList.contains('open');
            this.test('Theme dropdown opens', themeOpen);
            
            document.body.click();
            await this.wait(100);
        }
        
        // Test info buttons
        const modeInfo = document.getElementById('mode-info');
        if (modeInfo) {
            modeInfo.click();
            await this.wait(100);
            
            const modal = document.getElementById('modal-overlay');
            const modalVisible = modal && modal.style.display === 'flex';
            this.test('Mode info modal opens', modalVisible);
            
            if (modalVisible) {
                modal.click();
                await this.wait(100);
                this.test('Modal closes on overlay click', modal.style.display !== 'flex');
            }
        }
        
        // Test sample data button
        const loadSample = document.getElementById('load-sample');
        if (loadSample) {
            loadSample.click();
            await this.wait(100);
            
            const testInput = document.getElementById('test-input');
            this.test('Sample data loads', testInput.value.length > 0);
        }
        
        // Test clear button
        const clearTest = document.getElementById('clear-test');
        if (clearTest) {
            clearTest.click();
            await this.wait(100);
            
            const testInput = document.getElementById('test-input');
            this.test('Clear button works', testInput.value === '');
        }
    },
    
    // PHASE 6: Keyboard Shortcuts
    async testPhase6_KeyboardShortcuts() {
        console.log('\n⌨️ PHASE 6: KEYBOARD SHORTCUTS\n');
        
        // Test shortcuts modal
        const shortcutsModal = document.getElementById('shortcuts-modal');
        this.test('Shortcuts modal exists', shortcutsModal !== null);
        
        // Test help panel
        const helpPanel = document.getElementById('help-panel');
        this.test('Help panel exists', helpPanel !== null);
        
        // Test focus functionality
        const regexInput = document.getElementById('regex-input');
        const testInput = document.getElementById('test-input');
        
        // Simulate Ctrl+P
        testInput.focus();
        const ctrlP = new KeyboardEvent('keydown', {
            key: 'p',
            ctrlKey: true,
            bubbles: true
        });
        document.dispatchEvent(ctrlP);
        await this.wait(100);
        
        this.test('Ctrl+P focuses pattern input', document.activeElement === regexInput);
        
        // Character count
        const charCount = document.getElementById('char-count');
        testInput.value = 'Test';
        testInput.dispatchEvent(new Event('input', { bubbles: true }));
        await this.wait(100);
        
        this.test('Character count updates', charCount && charCount.textContent.includes('4'));
    },
    
    // PHASE 7: Data Persistence
    async testPhase7_DataPersistence() {
        console.log('\n💾 PHASE 7: DATA PERSISTENCE\n');
        
        // Test localStorage
        try {
            localStorage.setItem('test-key', 'test-value');
            const value = localStorage.getItem('test-key');
            localStorage.removeItem('test-key');
            this.test('localStorage available', value === 'test-value');
        } catch (e) {
            this.test('localStorage available', false, e.message);
        }
        
        // Check saved preferences
        const savedTheme = localStorage.getItem('selectedTheme');
        const savedMode = localStorage.getItem('selectedMode');
        this.test('Theme preference saved', savedTheme !== null, savedTheme || 'none');
        this.test('Mode preference saved', savedMode !== null, savedMode || 'none');
        
        // Test recent patterns
        const recentPatterns = localStorage.getItem('recentRegexPatterns');
        if (recentPatterns) {
            try {
                const patterns = JSON.parse(recentPatterns);
                this.test('Recent patterns valid JSON', Array.isArray(patterns));
            } catch (e) {
                this.test('Recent patterns valid JSON', false, 'Parse error');
            }
        }
    },
    
    // PHASE 8: Theme System
    async testPhase8_ThemeSystem() {
        console.log('\n🎨 PHASE 8: THEME SYSTEM\n');
        
        const themeSelect = document.getElementById('theme-select');
        const themeLink = document.getElementById('theme-stylesheet');
        
        this.test('Theme select exists', themeSelect !== null);
        this.test('Current theme is cyber-pro', themeSelect?.value === 'cyber-pro');
        
        // Check CSS variables
        const computedStyle = getComputedStyle(document.documentElement);
        const bgPrimary = computedStyle.getPropertyValue('--bg-primary').trim();
        this.test('CSS variables defined', bgPrimary !== '', `--bg-primary: ${bgPrimary}`);
        
        // Test theme switching
        if (themeSelect && themeLink) {
            const originalTheme = themeSelect.value;
            
            // Try switching to dracula
            themeSelect.value = 'dracula';
            const changeEvent = new Event('change', { bubbles: true });
            themeSelect.dispatchEvent(changeEvent);
            
            // Trigger theme change manually if needed
            if (typeof regexTester !== 'undefined' && regexTester.changeTheme) {
                regexTester.changeTheme('dracula');
                await this.wait(100);
                this.test('Theme switch works', themeLink.href.includes('dracula'));
                
                // Switch back
                regexTester.changeTheme(originalTheme);
            }
        }
    },
    
    // PHASE 9: Error Handling
    async testPhase9_ErrorHandling() {
        console.log('\n🛡️ PHASE 9: ERROR HANDLING\n');
        
        const regexInput = document.getElementById('regex-input');
        const flagsInput = document.getElementById('regex-flags');
        const errorDiv = document.getElementById('regex-error');
        
        // Test invalid regex
        regexInput.value = '[';
        regexInput.dispatchEvent(new Event('input', { bubbles: true }));
        await this.wait(100);
        
        this.test('Invalid regex shows error', errorDiv && errorDiv.textContent.length > 0);
        
        // Test invalid flags
        regexInput.value = 'test';
        flagsInput.value = 'xyz';
        flagsInput.dispatchEvent(new Event('input', { bubbles: true }));
        await this.wait(100);
        
        const hasError = errorDiv && errorDiv.textContent.length > 0;
        this.test('Invalid flags show error', hasError);
        
        // Clear errors
        regexInput.value = '';
        flagsInput.value = '';
        regexInput.dispatchEvent(new Event('input', { bubbles: true }));
    },
    
    // PHASE 10: Performance
    async testPhase10_Performance() {
        console.log('\n🚀 PHASE 10: PERFORMANCE\n');
        
        const testInput = document.getElementById('test-input');
        const regexInput = document.getElementById('regex-input');
        
        // Generate large text
        const largeText = 'Test 123 '.repeat(1000);
        
        // Measure update time
        const startTime = performance.now();
        
        regexInput.value = '\\d+';
        regexInput.dispatchEvent(new Event('input', { bubbles: true }));
        testInput.value = largeText;
        testInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        await this.wait(200);
        
        const endTime = performance.now();
        const updateTime = endTime - startTime;
        
        this.test('Large text handling', updateTime < 1000, `${updateTime.toFixed(0)}ms`);
        
        // Check if matches were found
        const matches = document.querySelectorAll('mark.highlight');
        this.test('Large text matches found', matches.length > 0, `${matches.length} matches`);
        
        // Clear large text
        testInput.value = '';
        testInput.dispatchEvent(new Event('input', { bubbles: true }));
    },
    
    // Generate Final Report
    generateReport() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 FINAL TEST REPORT');
        console.log('='.repeat(50) + '\n');
        
        const total = this.results.passed.length + this.results.failed.length;
        const passRate = ((this.results.passed.length / total) * 100).toFixed(1);
        
        console.log(`✅ Passed: ${this.results.passed.length}`);
        console.log(`❌ Failed: ${this.results.failed.length}`);
        console.log(`⚠️  Warnings: ${this.results.warnings.length}`);
        console.log(`📈 Pass Rate: ${passRate}%`);
        
        if (this.results.failed.length > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.results.failed.forEach(test => {
                console.log(`  - ${test.name} ${test.details ? `(${test.details})` : ''}`);
            });
        }
        
        if (this.results.warnings.length > 0) {
            console.log('\n⚠️  WARNINGS:');
            this.results.warnings.forEach(warning => {
                console.log(`  - ${warning.name}: ${warning.details}`);
            });
        }
        
        console.log('\n💡 RECOMMENDATIONS:');
        if (this.results.failed.length === 0) {
            console.log('  ✨ All tests passed! The application is functioning correctly.');
        } else {
            console.log('  🔧 Address the failed tests above to ensure full functionality.');
        }
        
        console.log('\nTest completed at:', new Date().toLocaleTimeString());
        
        return {
            passed: this.results.passed.length,
            failed: this.results.failed.length,
            warnings: this.results.warnings.length,
            passRate: passRate
        };
    }
};

// Error tracking
window.__errorCount = 0;
window.addEventListener('error', () => window.__errorCount++);

// Run the tests
console.log('Starting comprehensive test in 1 second...');
setTimeout(() => ComprehensiveTest.runAllTests(), 1000);