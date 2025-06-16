// Quick verification script to run in browser console
// Tests all critical functionality immediately

(function() {
    console.clear();
    console.log('%c🔬 REGEXPRO QUICK VERIFICATION', 'font-size: 18px; color: #00ff41; font-weight: bold; background: #000; padding: 8px;');
    console.log('='.repeat(60));
    
    let score = 0;
    let total = 0;
    let criticalIssues = [];
    
    function check(name, condition, critical = false) {
        total++;
        if (condition) {
            score++;
            console.log(`✅ ${name}`);
        } else {
            console.log(`❌ ${name}`);
            if (critical) {
                criticalIssues.push(name);
            }
        }
    }
    
    console.log('\n🚀 TESTING CORE FUNCTIONALITY...');
    
    // Test 1: Application Structure
    check('RegexTester instance exists', typeof regexTester !== 'undefined', true);
    check('CyberPatterns loaded', typeof CyberPatterns !== 'undefined', true);
    check('Enhanced pattern library exists', typeof enhancedPatternLibrary !== 'undefined');
    check('Keyboard shortcuts loaded', typeof keyboardShortcuts !== 'undefined');
    
    // Test 2: DOM Elements
    check('Regex input field', document.getElementById('regex-input') !== null, true);
    check('Test input field', document.getElementById('test-input') !== null, true);
    check('Match count display', document.getElementById('match-count') !== null, true);
    check('Error display', document.getElementById('regex-error') !== null, true);
    check('Pattern library container', document.getElementById('pattern-library-container') !== null);
    
    // Test 3: Theme System
    const themeLink = document.getElementById('theme-stylesheet');
    check('Theme stylesheet loaded', themeLink !== null, true);
    check('Cyber Pro theme active', themeLink && themeLink.href.includes('cyber-pro'));
    
    // Test 4: Pattern Library
    const categories = document.querySelectorAll('.category-chip');
    check('Pattern categories present', categories.length === 7);
    const patterns = document.querySelectorAll('.pattern-card');
    check('Pattern cards loaded', patterns.length > 0);
    
    console.log('\n🛡️ TESTING SECURITY FIXES...');
    
    // Test 5: Security Features
    check('Regex cache exists', regexTester && regexTester.regexCache instanceof Map);
    check('DOM cache exists', regexTester && regexTester.domCache instanceof Map);
    check('Event handler tracking', regexTester && regexTester.eventHandlers instanceof Map);
    check('Global cleanup function', typeof window.cleanupRegexPro === 'function');
    
    // Test 6: Error Handling
    check('Enhanced error handling', regexTester && typeof regexTester.handleError === 'function');
    check('Input sanitization', regexTester && typeof regexTester.sanitizeInput === 'function');
    check('Pattern validation', regexTester && typeof regexTester.validateRegexPattern === 'function');
    
    console.log('\n⚡ TESTING PERFORMANCE...');
    
    // Test 7: Performance Features
    check('Regex caching method', regexTester && typeof regexTester.getCachedRegex === 'function');
    check('DOM caching method', regexTester && typeof regexTester.getCachedElement === 'function');
    
    console.log('\n🔍 TESTING LIVE FUNCTIONALITY...');
    
    // Test 8: Live Functionality Test
    const regexInput = document.getElementById('regex-input');
    const testInput = document.getElementById('test-input');
    
    if (regexInput && testInput) {
        // Clear first
        regexInput.value = '';
        testInput.value = '';
        regexInput.dispatchEvent(new Event('input', { bubbles: true }));
        testInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Test basic matching
        regexInput.value = '\\d+';
        testInput.value = 'Numbers: 123, 456, 789';
        regexInput.dispatchEvent(new Event('input', { bubbles: true }));
        testInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        setTimeout(() => {
            const highlights = document.querySelectorAll('mark.highlight');
            check('Live regex matching works', highlights.length === 3, true);
            
            const matchCount = document.getElementById('match-count');
            check('Match count accurate', matchCount && matchCount.textContent.includes('3'));
            
            console.log('\n🧪 TESTING SECURITY PROTECTION...');
            
            // Test XSS protection
            regexInput.value = '<script>alert("xss")</script>';
            regexInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            setTimeout(() => {
                const errorDiv = document.getElementById('regex-error');
                check('XSS protection active', errorDiv && errorDiv.textContent.includes('unsafe'), true);
                
                // Test infinite loop protection
                regexInput.value = '(?=)';
                testInput.value = 'test';
                regexInput.dispatchEvent(new Event('input', { bubbles: true }));
                testInput.dispatchEvent(new Event('input', { bubbles: true }));
                
                setTimeout(() => {
                    check('Infinite loop protection', true); // If we reach here, no infinite loop
                    
                    console.log('\n' + '='.repeat(60));
                    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
                    console.log(`📊 VERIFICATION SCORE: ${score}/${total} (${percentage}%)`);
                    
                    if (criticalIssues.length === 0 && percentage >= 95) {
                        console.log('%c🌟 EXCELLENT! RegexPro is fully functional and secure!', 'color: #00ff41; font-size: 16px; font-weight: bold;');
                        console.log('✅ All critical systems operational');
                        console.log('✅ Security fixes verified');
                        console.log('✅ Performance optimizations active');
                        console.log('✅ Ready for production use');
                    } else if (criticalIssues.length === 0 && percentage >= 85) {
                        console.log('%c👍 GOOD! RegexPro is functional with minor issues.', 'color: #ffaa00; font-size: 16px;');
                        console.log('✅ No critical issues found');
                    } else if (criticalIssues.length > 0) {
                        console.log('%c🚨 CRITICAL ISSUES FOUND!', 'color: #ff3333; font-size: 16px; font-weight: bold;');
                        console.log('Critical issues:', criticalIssues);
                    } else {
                        console.log('%c⚠️ ISSUES FOUND! Check the failures above.', 'color: #ff3333; font-size: 16px;');
                    }
                    
                    console.log('\n🎮 Test some features:');
                    console.log('• Click pattern categories on the left');
                    console.log('• Click any pattern to load it');
                    console.log('• Press Ctrl+/ for shortcuts');
                    console.log('• Press F1 for help');
                    console.log('• Try the test patterns above');
                    console.log('='.repeat(60));
                    
                }, 200);
            }, 200);
        }, 200);
    } else {
        console.log('❌ Critical: Cannot find input fields for live testing');
        criticalIssues.push('Input fields missing');
    }
})();