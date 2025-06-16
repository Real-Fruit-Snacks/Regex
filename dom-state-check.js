// DOM State Checker - paste this in the browser console

(function() {
    console.clear();
    console.log('🔍 REGEXPRO DOM STATE CHECK\n');
    
    const report = {
        critical: [],
        warnings: [],
        info: [],
        success: []
    };
    
    // 1. Check for console errors
    console.log('1️⃣ Checking for console errors...');
    if (window._consoleErrors && window._consoleErrors.length > 0) {
        report.critical.push(`${window._consoleErrors.length} console errors detected`);
    } else {
        report.success.push('No console errors');
    }
    
    // 2. Check critical objects
    console.log('2️⃣ Checking object initialization...');
    const criticalObjects = {
        'RegexTester class': typeof RegexTester,
        'regexTester instance': typeof regexTester,
        'CyberPatterns': typeof CyberPatterns,
        'EnhancedPatternLibrary': typeof EnhancedPatternLibrary,
        'KeyboardShortcuts': typeof KeyboardShortcuts,
        'enhancedPatternLibrary': typeof enhancedPatternLibrary,
        'keyboardShortcuts': typeof keyboardShortcuts
    };
    
    Object.entries(criticalObjects).forEach(([name, type]) => {
        if (type === 'undefined') {
            report.critical.push(`${name} is undefined`);
        } else {
            report.success.push(`${name} loaded (${type})`);
        }
    });
    
    // 3. Check DOM structure
    console.log('3️⃣ Checking DOM elements...');
    const requiredElements = {
        // Core inputs
        'regex-input': 'Pattern input field',
        'regex-flags': 'Flags input field',
        'test-input': 'Test string textarea',
        'match-count': 'Match counter',
        
        // UI elements
        'pattern-library-container': 'Pattern library',
        'theme-dropdown': 'Theme selector',
        'regex-mode-dropdown': 'Mode selector',
        'help-panel': 'Help panel',
        'shortcuts-modal': 'Shortcuts modal',
        
        // Buttons
        'help-button': 'Help button',
        'shortcuts-button': 'Shortcuts button',
        'export-pattern': 'Export button',
        'share-pattern': 'Share button'
    };
    
    Object.entries(requiredElements).forEach(([id, desc]) => {
        const element = document.getElementById(id);
        if (!element) {
            report.critical.push(`Missing element: #${id} (${desc})`);
        } else {
            report.success.push(`Found: ${desc}`);
        }
    });
    
    // 4. Check pattern library state
    console.log('4️⃣ Checking pattern library...');
    const categories = document.querySelectorAll('.category-chip');
    const patterns = document.querySelectorAll('.pattern-card');
    
    if (categories.length === 0) {
        report.critical.push('No pattern categories found');
    } else {
        report.info.push(`${categories.length} pattern categories loaded`);
    }
    
    if (patterns.length === 0) {
        report.warnings.push('No patterns visible (may need to select category)');
    } else {
        report.info.push(`${patterns.length} patterns currently displayed`);
    }
    
    // 5. Check theme
    console.log('5️⃣ Checking theme...');
    const themeLink = document.getElementById('theme-stylesheet');
    const currentTheme = themeLink ? themeLink.href.split('/').pop() : 'none';
    if (currentTheme !== 'cyber-pro.css') {
        report.warnings.push(`Wrong theme loaded: ${currentTheme} (expected cyber-pro.css)`);
    } else {
        report.success.push('Cyber Pro theme active');
    }
    
    // 6. Check event listeners
    console.log('6️⃣ Checking event bindings...');
    const regexInput = document.getElementById('regex-input');
    if (regexInput) {
        const hasListeners = regexInput._listeners || 
                           getEventListeners?.(regexInput)?.input?.length > 0 ||
                           regexInput.oninput !== null;
        if (!hasListeners) {
            report.warnings.push('Regex input may not have event listeners');
        } else {
            report.success.push('Regex input has event handlers');
        }
    }
    
    // 7. Quick functionality test
    console.log('7️⃣ Testing basic functionality...');
    try {
        const testRegex = document.getElementById('regex-input');
        const testString = document.getElementById('test-input');
        if (testRegex && testString) {
            testRegex.value = 'test';
            testRegex.dispatchEvent(new Event('input', { bubbles: true }));
            testString.value = 'This is a test';
            testString.dispatchEvent(new Event('input', { bubbles: true }));
            
            setTimeout(() => {
                const highlights = document.querySelectorAll('mark.highlight');
                if (highlights.length > 0) {
                    report.success.push('Pattern matching works');
                } else {
                    report.warnings.push('No matches highlighted (functionality issue?)');
                }
            }, 100);
        }
    } catch (e) {
        report.critical.push(`Functionality test error: ${e.message}`);
    }
    
    // Generate report
    setTimeout(() => {
        console.log('\n📊 REPORT SUMMARY\n' + '='.repeat(50));
        
        if (report.critical.length > 0) {
            console.log('\n❌ CRITICAL ISSUES:');
            report.critical.forEach(issue => console.log(`  • ${issue}`));
        }
        
        if (report.warnings.length > 0) {
            console.log('\n⚠️  WARNINGS:');
            report.warnings.forEach(warning => console.log(`  • ${warning}`));
        }
        
        if (report.info.length > 0) {
            console.log('\n📝 INFO:');
            report.info.forEach(info => console.log(`  • ${info}`));
        }
        
        if (report.success.length > 0) {
            console.log('\n✅ SUCCESS:');
            report.success.forEach(success => console.log(`  • ${success}`));
        }
        
        // Overall status
        console.log('\n🎯 OVERALL STATUS:');
        if (report.critical.length === 0) {
            console.log('  ✨ No critical issues found!');
            if (report.warnings.length === 0) {
                console.log('  🚀 Application appears to be working correctly!');
            } else {
                console.log('  ⚡ Minor issues detected but app should be functional.');
            }
        } else {
            console.log('  🔧 Critical issues need to be fixed for proper functionality.');
        }
        
        console.log('\n' + '='.repeat(50));
    }, 200);
})();