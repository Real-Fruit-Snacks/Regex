const puppeteer = require('puppeteer');

async function quickRegexTest() {
    console.log('🔍 QUICK REGEX FUNCTIONALITY TEST');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://127.0.0.1:8081', { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait longer for full initialization
        
        const result = await page.evaluate(async () => {
            try {
                const regexInput = document.getElementById('regex-input');
                const testInput = document.getElementById('test-input');
                const matchCount = document.getElementById('match-count');
                
                if (!regexInput || !testInput || !matchCount) {
                    return { success: false, error: 'Elements not found' };
                }
                
                // Clear first
                regexInput.value = '';
                testInput.value = '';
                
                // Set values
                regexInput.value = '\\d+';
                testInput.value = 'Numbers: 123, 456, 789';
                
                // Trigger events
                regexInput.dispatchEvent(new Event('input', { bubbles: true }));
                testInput.dispatchEvent(new Event('input', { bubbles: true }));
                
                // Wait for processing with multiple checks
                return new Promise(resolve => {
                    let attempts = 0;
                    const maxAttempts = 10;
                    
                    const checkInterval = setInterval(() => {
                        attempts++;
                        const highlights = document.querySelectorAll('mark.highlight');
                        const matchText = matchCount.textContent;
                        
                        console.log(`Attempt ${attempts}: ${highlights.length} highlights, match text: "${matchText}"`);
                        
                        if (highlights.length === 3 || attempts >= maxAttempts) {
                            clearInterval(checkInterval);
                            resolve({
                                success: highlights.length === 3,
                                highlightCount: highlights.length,
                                matchText: matchText,
                                attempts: attempts,
                                regexValue: regexInput.value,
                                testValue: testInput.value,
                                hasRegexTester: !!window.regexTester
                            });
                        }
                    }, 200);
                });
            } catch (error) {
                return { success: false, error: error.message, stack: error.stack };
            }
        });
        
        console.log('Result:', result);
        
        if (result.success) {
            console.log('✅ Regex matching is working correctly!');
        } else {
            console.log('❌ Regex matching issue detected');
            console.log('Details:', result);
        }
        
    } catch (error) {
        console.error('Test error:', error);
    } finally {
        await browser.close();
    }
}

quickRegexTest().catch(console.error);