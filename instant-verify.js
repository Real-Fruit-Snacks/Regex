// INSTANT VERIFICATION - Copy and paste this into browser console
// This gives you immediate confirmation that RegexPro is working

(function() {
    console.clear();
    console.log('%c🎯 REGEXPRO INSTANT VERIFICATION', 'font-size: 20px; color: #00ff41; font-weight: bold; background: #000; padding: 10px;');
    console.log('='.repeat(50));
    
    let score = 0;
    let total = 0;
    
    function check(name, condition, fix = '') {
        total++;
        if (condition) {
            score++;
            console.log(`✅ ${name}`);
        } else {
            console.log(`❌ ${name} ${fix ? `- ${fix}` : ''}`);
        }
    }
    
    // Core checks
    check('Application loaded', typeof regexTester !== 'undefined');
    check('Pattern library loaded', typeof CyberPatterns !== 'undefined');
    check('Cyber Pro theme active', document.getElementById('theme-stylesheet')?.href.includes('cyber-pro'));
    check('Pattern categories visible', document.querySelectorAll('.category-chip').length === 7);
    check('Regex input field present', document.getElementById('regex-input') !== null);
    check('Test input field present', document.getElementById('test-input') !== null);
    
    // Quick functionality test
    const regexInput = document.getElementById('regex-input');
    const testInput = document.getElementById('test-input');
    
    if (regexInput && testInput) {
        regexInput.value = '\\d+';
        testInput.value = 'Test 123 and 456';
        regexInput.dispatchEvent(new Event('input', { bubbles: true }));
        testInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        setTimeout(() => {
            const matches = document.querySelectorAll('mark.highlight').length;
            check('Pattern matching works', matches === 2);
            
            // Final result
            setTimeout(() => {
                const percentage = Math.round((score / total) * 100);
                console.log('\n' + '='.repeat(50));
                console.log(`📊 SCORE: ${score}/${total} (${percentage}%)`);
                
                if (percentage === 100) {
                    console.log('%c🌟 PERFECT! RegexPro is working flawlessly!', 'color: #00ff41; font-size: 16px; font-weight: bold;');
                } else if (percentage >= 85) {
                    console.log('%c👍 GOOD! RegexPro is functional with minor issues.', 'color: #ffaa00; font-size: 16px;');
                } else {
                    console.log('%c⚠️ ISSUES FOUND! Some functionality may not work.', 'color: #ff3333; font-size: 16px;');
                }
                
                console.log('\n🎮 Try these actions:');
                console.log('• Click pattern categories on the left');
                console.log('• Click any pattern to load it');
                console.log('• Press Ctrl+/ for shortcuts');
                console.log('• Press F1 for help');
                console.log('='.repeat(50));
            }, 100);
        }, 100);
    }
    
    check('Keyboard shortcuts available', typeof keyboardShortcuts !== 'undefined');
    check('Help panel present', document.getElementById('help-panel') !== null);
    check('Export button present', document.getElementById('export-pattern') !== null);
})();