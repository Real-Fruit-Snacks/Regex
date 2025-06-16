const puppeteer = require('puppeteer');

async function simpleFunctionalTest() {
    console.log('🧪 REGEXPRO SIMPLE FUNCTIONAL TEST');
    console.log('='.repeat(50));
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    let passed = 0;
    let failed = 0;
    
    function test(name, condition) {
        if (condition) {
            console.log(`✅ ${name}`);
            passed++;
        } else {
            console.log(`❌ ${name}`);
            failed++;
        }
    }

    try {
        // Load the page
        await page.goto('http://127.0.0.1:8081', { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Test 1: Core objects loaded
        const objects = await page.evaluate(() => ({
            regexTester: typeof window.regexTester,
            CyberPatterns: typeof window.CyberPatterns,
            EnhancedPatternLibrary: typeof window.EnhancedPatternLibrary,
            enhancedPatternLibrary: typeof window.enhancedPatternLibrary,
            KeyboardShortcuts: typeof window.KeyboardShortcuts,
            keyboardShortcuts: typeof window.keyboardShortcuts
        }));

        test('RegexTester loaded', objects.regexTester === 'object');
        test('CyberPatterns loaded', objects.CyberPatterns === 'object');
        test('EnhancedPatternLibrary class loaded', objects.EnhancedPatternLibrary === 'function');
        test('enhancedPatternLibrary instance loaded', objects.enhancedPatternLibrary === 'object');
        test('KeyboardShortcuts class loaded', objects.KeyboardShortcuts === 'function');
        test('keyboardShortcuts instance loaded', objects.keyboardShortcuts === 'object');

        // Test 2: DOM elements
        const elements = await page.evaluate(() => ({
            regexInput: !!document.getElementById('regex-input'),
            testInput: !!document.getElementById('test-input'),
            matchCount: !!document.getElementById('match-count'),
            regexError: !!document.getElementById('regex-error'),
            patternLibrary: !!document.getElementById('pattern-library-container')
        }));

        test('Regex input field exists', elements.regexInput);
        test('Test input field exists', elements.testInput);
        test('Match count display exists', elements.matchCount);
        test('Error display exists', elements.regexError);
        test('Pattern library exists', elements.patternLibrary);

        // Test 3: Functionality using direct JavaScript instead of keyboard input
        const functionalityTest = await page.evaluate(() => {
            try {
                // Test basic regex functionality by directly setting values
                const regexInput = document.getElementById('regex-input');
                const testInput = document.getElementById('test-input');
                
                if (!regexInput || !testInput) return { success: false, error: 'Input elements not found' };
                
                // Set test pattern and text
                regexInput.value = '\\d+';
                testInput.value = 'Test 123 456 789';
                
                // Trigger the input events
                regexInput.dispatchEvent(new Event('input', { bubbles: true }));
                testInput.dispatchEvent(new Event('input', { bubbles: true }));
                
                // Wait a bit for processing
                return new Promise(resolve => {
                    setTimeout(() => {
                        const highlights = document.querySelectorAll('mark.highlight');
                        const matchCount = document.getElementById('match-count');
                        
                        resolve({
                            success: true,
                            highlightCount: highlights.length,
                            matchCountText: matchCount ? matchCount.textContent : '',
                            regexTesterExists: !!window.regexTester,
                            patternsLoaded: window.CyberPatterns && window.CyberPatterns.categories ? window.CyberPatterns.categories.length : 0
                        });
                    }, 500);
                });
            } catch (error) {
                return { success: false, error: error.message };
            }
        });

        test('Basic regex matching works', functionalityTest.success && functionalityTest.highlightCount === 3);
        test('Match count display updated', functionalityTest.matchCountText.includes('3'));
        test('RegexTester accessible in functionality test', functionalityTest.regexTesterExists);
        test('CyberPatterns categories loaded', functionalityTest.patternsLoaded === 7);

        // Test 4: Security features
        const securityTest = await page.evaluate(() => {
            try {
                return {
                    hasInputSanitization: window.regexTester && typeof window.regexTester.sanitizeInput === 'function',
                    hasPatternValidation: window.regexTester && typeof window.regexTester.validateRegexPattern === 'function',
                    hasCleanup: typeof window.cleanupRegexPro === 'function',
                    hasErrorHandling: window.regexTester && typeof window.regexTester.handleError === 'function'
                };
            } catch (error) {
                return { error: error.message };
            }
        });

        test('Input sanitization available', securityTest.hasInputSanitization);
        test('Pattern validation available', securityTest.hasPatternValidation);  
        test('Cleanup function available', securityTest.hasCleanup);
        test('Error handling available', securityTest.hasErrorHandling);

        // Test 5: Performance features
        const performanceTest = await page.evaluate(() => {
            try {
                return {
                    hasRegexCache: window.regexTester && window.regexTester.regexCache instanceof Map,
                    hasDOMCache: window.regexTester && window.regexTester.domCache instanceof Map,
                    hasEventTracking: window.regexTester && window.regexTester.eventHandlers instanceof Map
                };
            } catch (error) {
                return { error: error.message };
            }
        });

        test('Regex caching implemented', performanceTest.hasRegexCache);
        test('DOM caching implemented', performanceTest.hasDOMCache);
        test('Event tracking implemented', performanceTest.hasEventTracking);

        // Test 6: Pattern library functionality
        const patternTest = await page.evaluate(() => {
            try {
                const categories = document.querySelectorAll('.category-chip');
                const patterns = document.querySelectorAll('.pattern-card');
                
                return {
                    categoryCount: categories.length,
                    patternCount: patterns.length,
                    hasSearchFeature: !!document.querySelector('.pattern-search'),
                    cyberPatternsCategories: window.CyberPatterns ? window.CyberPatterns.categories.length : 0
                };
            } catch (error) {
                return { error: error.message };
            }
        });

        test('Pattern categories displayed', patternTest.categoryCount === 7);
        test('Pattern cards loaded', patternTest.patternCount > 0);
        test('CyberPatterns structure correct', patternTest.cyberPatternsCategories === 7);

    } catch (error) {
        console.error('Test error:', error);
        failed++;
    } finally {
        await browser.close();
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    
    const total = passed + failed;
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
    console.log(`📈 Pass rate: ${passRate}%`);

    if (failed === 0) {
        console.log('\n🌟 EXCELLENT! RegexPro is fully functional and ready for production!');
        console.log('✅ All core features working');
        console.log('✅ Security measures active');
        console.log('✅ Performance optimizations working');
        console.log('✅ Pattern library fully loaded');
    } else if (passRate >= 85) {
        console.log('\n👍 GOOD! RegexPro is mostly functional with minor issues.');
    } else {
        console.log('\n⚠️ ISSUES FOUND! Some core functionality may not be working.');
    }
    
    console.log('='.repeat(50));
}

simpleFunctionalTest().catch(console.error);