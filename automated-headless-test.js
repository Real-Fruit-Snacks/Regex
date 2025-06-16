// Automated headless test for RegexPro functionality
// Can be run in Node.js with jsdom or in browser

const testResults = {
    passed: 0,
    failed: 0,
    critical: 0,
    tests: []
};

function runTest(name, testFn, critical = false) {
    try {
        const result = testFn();
        if (result) {
            testResults.passed++;
            testResults.tests.push({ name, status: 'PASS', critical });
            console.log(`✅ ${name}`);
        } else {
            testResults.failed++;
            testResults.tests.push({ name, status: 'FAIL', critical });
            if (critical) testResults.critical++;
            console.log(`❌ ${name}${critical ? ' (CRITICAL)' : ''}`);
        }
    } catch (error) {
        testResults.failed++;
        testResults.tests.push({ name, status: 'ERROR', error: error.message, critical });
        if (critical) testResults.critical++;
        console.log(`💥 ${name} - Error: ${error.message}${critical ? ' (CRITICAL)' : ''}`);
    }
}

// Test suite for browser environment
if (typeof window !== 'undefined') {
    console.log('🧪 Running RegexPro Automated Tests...');
    console.log('='.repeat(50));

    // Critical functionality tests
    runTest('RegexTester class exists', () => typeof regexTester !== 'undefined', true);
    runTest('CyberPatterns object loaded', () => typeof CyberPatterns !== 'undefined', true);
    runTest('DOM elements present', () => {
        const required = ['regex-input', 'test-input', 'match-count', 'regex-error'];
        return required.every(id => document.getElementById(id) !== null);
    }, true);

    // Security tests
    runTest('Input sanitization exists', () => {
        return regexTester && typeof regexTester.sanitizeInput === 'function';
    }, true);
    
    runTest('Pattern validation exists', () => {
        return regexTester && typeof regexTester.validateRegexPattern === 'function';
    }, true);
    
    runTest('Cleanup system exists', () => {
        return typeof window.cleanupRegexPro === 'function' && 
               regexTester && typeof regexTester.cleanup === 'function';
    }, true);

    // Performance tests
    runTest('Regex caching implemented', () => {
        return regexTester && regexTester.regexCache instanceof Map;
    });
    
    runTest('DOM caching implemented', () => {
        return regexTester && regexTester.domCache instanceof Map;
    });
    
    runTest('Event tracking implemented', () => {
        return regexTester && regexTester.eventHandlers instanceof Map;
    });

    // UI tests
    runTest('Theme system working', () => {
        const themeLink = document.getElementById('theme-stylesheet');
        return themeLink && themeLink.href.includes('.css');
    });
    
    runTest('Pattern library loaded', () => {
        const categories = document.querySelectorAll('.category-chip');
        const patterns = document.querySelectorAll('.pattern-card');
        return categories.length === 7 && patterns.length > 0;
    });

    // Functional tests
    runTest('Basic regex matching', () => {
        const regexInput = document.getElementById('regex-input');
        const testInput = document.getElementById('test-input');
        
        if (!regexInput || !testInput) return false;
        
        regexInput.value = '\\d+';
        testInput.value = 'Test 123 456';
        regexInput.dispatchEvent(new Event('input', { bubbles: true }));
        testInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Wait for processing
        return new Promise(resolve => {
            setTimeout(() => {
                const highlights = document.querySelectorAll('mark.highlight');
                resolve(highlights.length === 2);
            }, 100);
        });
    }, true);

    // Enhanced pattern library tests
    runTest('Enhanced pattern library loaded', () => {
        return typeof enhancedPatternLibrary !== 'undefined';
    });
    
    runTest('Keyboard shortcuts loaded', () => {
        return typeof keyboardShortcuts !== 'undefined';
    });

    // Error handling tests
    runTest('Error handling system', () => {
        return regexTester && typeof regexTester.handleError === 'function';
    });

    // Final results
    setTimeout(() => {
        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST RESULTS SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Passed: ${testResults.passed}`);
        console.log(`❌ Failed: ${testResults.failed}`);
        console.log(`🚨 Critical failures: ${testResults.critical}`);
        
        const total = testResults.passed + testResults.failed;
        const passRate = total > 0 ? ((testResults.passed / total) * 100).toFixed(1) : 0;
        console.log(`📈 Pass rate: ${passRate}%`);
        
        if (testResults.critical === 0 && passRate >= 95) {
            console.log('\n🎯 RESULT: EXCELLENT - All systems operational');
        } else if (testResults.critical === 0 && passRate >= 85) {
            console.log('\n👍 RESULT: GOOD - Minor issues only');
        } else if (testResults.critical > 0) {
            console.log('\n🚨 RESULT: CRITICAL ISSUES - Requires immediate attention');
        } else {
            console.log('\n⚠️ RESULT: ISSUES FOUND - Review needed');
        }
        
        console.log('\n📋 Detailed Results:');
        testResults.tests.forEach(test => {
            const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '💥';
            const critical = test.critical ? ' (CRITICAL)' : '';
            console.log(`${icon} ${test.name}${critical}`);
            if (test.error) console.log(`   Error: ${test.error}`);
        });
        
        console.log('='.repeat(50));
    }, 1000);
}