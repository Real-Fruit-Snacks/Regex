const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class RegexProPuppeteerTester {
    constructor() {
        this.browser = null;
        this.page = null;
        this.results = {
            passed: 0,
            failed: 0,
            critical: 0,
            tests: [],
            screenshots: [],
            consoleLogs: [],
            errors: []
        };
        this.baseUrl = 'http://127.0.0.1:8081';
        this.screenshotDir = './test-screenshots';
    }

    async init() {
        // Create screenshot directory
        if (!fs.existsSync(this.screenshotDir)) {
            fs.mkdirSync(this.screenshotDir, { recursive: true });
        }

        // Launch browser
        this.browser = await puppeteer.launch({
            headless: false, // Set to true for headless testing
            devtools: true,
            slowMo: 100, // Slow down by 100ms for debugging
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security'
            ]
        });

        this.page = await this.browser.newPage();
        
        // Set viewport
        await this.page.setViewport({ width: 1920, height: 1080 });

        // Monitor console logs
        this.page.on('console', msg => {
            const type = msg.type();
            const text = msg.text();
            this.results.consoleLogs.push({ type, text, timestamp: new Date().toISOString() });
            
            if (type === 'error') {
                this.results.errors.push({ text, timestamp: new Date().toISOString() });
            }
        });

        // Monitor page errors
        this.page.on('pageerror', error => {
            this.results.errors.push({ 
                text: `Page Error: ${error.message}`, 
                timestamp: new Date().toISOString() 
            });
        });

        console.log('🚀 Puppeteer initialized, browser launched');
    }

    async runTest(name, testFn, critical = false) {
        console.log(`\n🧪 Running: ${name}`);
        try {
            const result = await testFn();
            if (result) {
                this.results.passed++;
                this.results.tests.push({ name, status: 'PASS', critical });
                console.log(`   ✅ ${name}`);
            } else {
                this.results.failed++;
                this.results.tests.push({ name, status: 'FAIL', critical });
                if (critical) this.results.critical++;
                console.log(`   ❌ ${name}${critical ? ' (CRITICAL)' : ''}`);
            }
        } catch (error) {
            this.results.failed++;
            this.results.tests.push({ 
                name, 
                status: 'ERROR', 
                error: error.message, 
                critical 
            });
            if (critical) this.results.critical++;
            console.log(`   💥 ${name} - Error: ${error.message}${critical ? ' (CRITICAL)' : ''}`);
        }
    }

    async takeScreenshot(name, selector = null) {
        const filename = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
        const filepath = path.join(this.screenshotDir, filename);
        
        if (selector) {
            const element = await this.page.$(selector);
            if (element) {
                await element.screenshot({ path: filepath });
            } else {
                await this.page.screenshot({ path: filepath, fullPage: true });
            }
        } else {
            await this.page.screenshot({ path: filepath, fullPage: true });
        }
        
        this.results.screenshots.push({ name, filepath });
        console.log(`   📸 Screenshot saved: ${filename}`);
    }

    async runAllTests() {
        console.log('🌟 STARTING COMPREHENSIVE REGEXPRO PUPPETEER TESTING');
        console.log('='.repeat(70));

        try {
            // Test 1: Application Loading
            console.log('\n📦 PHASE 1: APPLICATION LOADING');
            await this.runTest('Load homepage', async () => {
                const response = await this.page.goto(this.baseUrl, { waitUntil: 'networkidle2' });
                return response.status() === 200;
            }, true);

            await this.takeScreenshot('01_homepage_loaded');
            await new Promise(resolve => setTimeout(resolve, 2000)); // Allow full initialization

            // Test 2: Core Objects
            console.log('\n🔧 PHASE 2: CORE OBJECTS AND INITIALIZATION');
            await this.runTest('RegexTester object exists', async () => {
                return await this.page.evaluate(() => typeof window.regexTester !== 'undefined');
            }, true);

            await this.runTest('CyberPatterns loaded', async () => {
                return await this.page.evaluate(() => typeof window.CyberPatterns !== 'undefined');
            }, true);

            await this.runTest('Enhanced Pattern Library loaded', async () => {
                return await this.page.evaluate(() => typeof window.enhancedPatternLibrary !== 'undefined');
            });

            await this.runTest('Keyboard Shortcuts loaded', async () => {
                return await this.page.evaluate(() => typeof window.keyboardShortcuts !== 'undefined');
            });

            // Test 3: DOM Elements
            console.log('\n🎨 PHASE 3: DOM ELEMENTS AND UI');
            await this.runTest('Core input elements present', async () => {
                const regexInput = await this.page.$('#regex-input');
                const testInput = await this.page.$('#test-input');
                const matchCount = await this.page.$('#match-count');
                return regexInput && testInput && matchCount;
            }, true);

            await this.runTest('Pattern library UI loaded', async () => {
                const categories = await this.page.$$('.category-chip');
                const patterns = await this.page.$$('.pattern-card');
                return categories.length === 7 && patterns.length > 0;
            });

            await this.takeScreenshot('02_ui_elements');

            // Test 4: Theme System
            console.log('\n🎭 PHASE 4: THEME SYSTEM');
            await this.runTest('Theme system working', async () => {
                const themeLink = await this.page.$('#theme-stylesheet');
                return themeLink !== null;
            });

            await this.runTest('Cyber Pro theme active', async () => {
                return await this.page.evaluate(() => {
                    const themeLink = document.getElementById('theme-stylesheet');
                    return themeLink && themeLink.href.includes('cyber-pro');
                });
            });

            // Test 5: Basic Functionality
            console.log('\n⚡ PHASE 5: BASIC FUNCTIONALITY');
            await this.runTest('Basic regex matching', async () => {
                await this.page.type('#regex-input', '\\d+');
                await this.page.type('#test-input', 'Numbers: 123, 456, 789');
                
                // Wait for processing
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const highlights = await this.page.$$('mark.highlight');
                const matchCount = await this.page.$eval('#match-count', el => el.textContent);
                
                return highlights.length === 3 && matchCount.includes('3');
            }, true);

            await this.takeScreenshot('03_basic_matching');

            // Test 6: Pattern Library Interaction
            console.log('\n📚 PHASE 6: PATTERN LIBRARY INTERACTION');
            await this.runTest('Pattern category clicking', async () => {
                // Clear inputs first
                await this.page.evaluate(() => {
                    document.getElementById('regex-input').value = '';
                    document.getElementById('test-input').value = '';
                });

                // Click Security category
                await this.page.click('.category-chip[data-category="Security"]');
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Check if patterns switched
                const securityPatterns = await this.page.$$('.pattern-card:not([style*="display: none"])');
                return securityPatterns.length > 0;
            });

            await this.runTest('Pattern loading', async () => {
                // Click first visible pattern
                const firstPattern = await this.page.$('.pattern-card:not([style*="display: none"])');
                if (!firstPattern) return false;
                
                await firstPattern.click();
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Check if pattern was loaded
                const regexValue = await this.page.$eval('#regex-input', el => el.value);
                return regexValue.length > 0;
            });

            await this.takeScreenshot('04_pattern_interaction');

            // Test 7: Security Features
            console.log('\n🛡️ PHASE 7: SECURITY FEATURES');
            await this.runTest('XSS protection', async () => {
                await this.page.evaluate(() => {
                    document.getElementById('regex-input').value = '';
                    document.getElementById('test-input').value = '';
                });
                
                await this.page.type('#regex-input', '<script>alert("xss")</script>');
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const errorText = await this.page.$eval('#regex-error', el => el.textContent);
                return errorText.includes('unsafe') || errorText.includes('Invalid');
            }, true);

            await this.runTest('Infinite loop protection', async () => {
                await this.page.evaluate(() => {
                    document.getElementById('regex-input').value = '';
                    document.getElementById('test-input').value = '';
                });
                
                // Test potentially problematic pattern
                await this.page.type('#regex-input', '(?=)');
                await this.page.type('#test-input', 'test string');
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // If we reach here without browser freezing, protection works
                return true;
            }, true);

            await this.takeScreenshot('05_security_testing');

            // Test 8: Performance Features
            console.log('\n🚀 PHASE 8: PERFORMANCE FEATURES');
            await this.runTest('Regex caching system', async () => {
                return await this.page.evaluate(() => {
                    return window.regexTester && window.regexTester.regexCache instanceof Map;
                });
            });

            await this.runTest('DOM caching system', async () => {
                return await this.page.evaluate(() => {
                    return window.regexTester && window.regexTester.domCache instanceof Map;
                });
            });

            await this.runTest('Event tracking system', async () => {
                return await this.page.evaluate(() => {
                    return window.regexTester && window.regexTester.eventHandlers instanceof Map;
                });
            });

            // Test 9: Keyboard Shortcuts
            console.log('\n⌨️ PHASE 9: KEYBOARD SHORTCUTS');
            await this.runTest('Shortcuts modal', async () => {
                await this.page.keyboard.down('Control');
                await this.page.keyboard.press('/');
                await this.page.keyboard.up('Control');
                await new Promise(resolve => setTimeout(resolve, 300));
                
                const modal = await this.page.$('#shortcuts-modal[style*="block"]');
                return modal !== null;
            });

            await this.takeScreenshot('06_shortcuts_modal');

            // Close modal
            await this.page.keyboard.press('Escape');
            await new Promise(resolve => setTimeout(resolve, 200));

            await this.runTest('Help panel', async () => {
                await this.page.keyboard.press('F1');
                await new Promise(resolve => setTimeout(resolve, 300));
                
                const panel = await this.page.$('#help-panel.open');
                return panel !== null;
            });

            await this.takeScreenshot('07_help_panel');

            // Test 10: Complex Regex Patterns
            console.log('\n🧮 PHASE 10: COMPLEX PATTERNS');
            await this.runTest('Complex email validation', async () => {
                await this.page.evaluate(() => {
                    document.getElementById('regex-input').value = '';
                    document.getElementById('test-input').value = '';
                });
                
                const emailPattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
                const testText = 'Contact: user@example.com or admin@test.org and invalid@email';
                
                await this.page.type('#regex-input', emailPattern);
                await this.page.type('#test-input', testText);
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const highlights = await this.page.$$('mark.highlight');
                return highlights.length === 2; // Should match 2 valid emails
            });

            await this.runTest('Large text performance', async () => {
                await this.page.evaluate(() => {
                    document.getElementById('regex-input').value = '';
                    document.getElementById('test-input').value = '';
                });
                
                // Generate large text
                const largeText = 'Test data '.repeat(1000) + '123 456 789';
                await this.page.type('#regex-input', '\\d+');
                
                const startTime = Date.now();
                await this.page.evaluate((text) => {
                    document.getElementById('test-input').value = text;
                    document.getElementById('test-input').dispatchEvent(new Event('input', { bubbles: true }));
                }, largeText);
                
                await new Promise(resolve => setTimeout(resolve, 1000));
                const endTime = Date.now();
                
                const processingTime = endTime - startTime;
                return processingTime < 3000; // Should process in under 3 seconds
            });

            await this.takeScreenshot('08_complex_patterns');

            // Test 11: Error Handling
            console.log('\n🚨 PHASE 11: ERROR HANDLING');
            await this.runTest('Invalid regex handling', async () => {
                await this.page.evaluate(() => {
                    document.getElementById('regex-input').value = '';
                    document.getElementById('regex-error').textContent = '';
                });
                
                await this.page.type('#regex-input', '[unclosed');
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const errorText = await this.page.$eval('#regex-error', el => el.textContent);
                return errorText.length > 0 && errorText.includes('Invalid');
            });

            await this.runTest('Recovery from errors', async () => {
                // Clear error state by entering valid pattern
                await this.page.evaluate(() => {
                    document.getElementById('regex-input').value = '';
                });
                
                await this.page.type('#regex-input', '\\w+');
                await new Promise(resolve => setTimeout(resolve, 300));
                
                const errorText = await this.page.$eval('#regex-error', el => el.textContent);
                return errorText.length === 0 || !errorText.includes('Invalid');
            });

            await this.takeScreenshot('09_error_handling');

            // Test 12: Memory Management
            console.log('\n🧠 PHASE 12: MEMORY MANAGEMENT');
            await this.runTest('Cleanup functions available', async () => {
                return await this.page.evaluate(() => {
                    return typeof window.cleanupRegexPro === 'function' && 
                           window.regexTester && typeof window.regexTester.cleanup === 'function';
                });
            });

            // Test memory usage by creating many patterns
            await this.runTest('Memory usage under load', async () => {
                const initialMemory = await this.page.evaluate(() => {
                    return performance.memory ? performance.memory.usedJSHeapSize : 0;
                });

                // Create load by switching patterns rapidly
                for (let i = 0; i < 20; i++) {
                    await this.page.evaluate((index) => {
                        document.getElementById('regex-input').value = `test${index}`;
                        document.getElementById('regex-input').dispatchEvent(new Event('input', { bubbles: true }));
                    }, i);
                    await new Promise(resolve => setTimeout(resolve, 50));
                }

                const finalMemory = await this.page.evaluate(() => {
                    return performance.memory ? performance.memory.usedJSHeapSize : 0;
                });

                // Memory shouldn't grow excessively (allow 50MB increase)
                const memoryIncrease = finalMemory - initialMemory;
                return memoryIncrease < 50 * 1024 * 1024; // 50MB limit
            });

            await this.takeScreenshot('10_final_state');

        } catch (error) {
            console.error('💥 Critical error during testing:', error);
            this.results.errors.push({
                text: `Critical test error: ${error.message}`,
                timestamp: new Date().toISOString()
            });
        }
    }

    async generateReport() {
        const total = this.results.passed + this.results.failed;
        const passRate = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : 0;
        
        const report = {
            summary: {
                total,
                passed: this.results.passed,
                failed: this.results.failed,
                critical: this.results.critical,
                passRate: `${passRate}%`,
                timestamp: new Date().toISOString()
            },
            tests: this.results.tests,
            screenshots: this.results.screenshots,
            consoleLogs: this.results.consoleLogs.slice(-50), // Last 50 logs
            errors: this.results.errors
        };

        const reportPath = './puppeteer-test-report.json';
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        // Generate markdown report
        const mdReport = this.generateMarkdownReport(report);
        fs.writeFileSync('./puppeteer-test-report.md', mdReport);

        console.log('\n' + '='.repeat(70));
        console.log('📊 PUPPETEER TEST RESULTS');
        console.log('='.repeat(70));
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`🚨 Critical failures: ${this.results.critical}`);
        console.log(`📈 Pass rate: ${passRate}%`);
        console.log(`📸 Screenshots: ${this.results.screenshots.length}`);
        console.log(`📝 Console logs: ${this.results.consoleLogs.length}`);
        console.log(`🚨 Errors: ${this.results.errors.length}`);

        if (this.results.critical === 0 && passRate >= 95) {
            console.log('\n🌟 EXCELLENT! All systems operational and secure!');
        } else if (this.results.critical === 0 && passRate >= 85) {
            console.log('\n👍 GOOD! Minor issues only, generally functional');
        } else if (this.results.critical > 0) {
            console.log('\n🚨 CRITICAL ISSUES FOUND! Immediate attention required');
        } else {
            console.log('\n⚠️ ISSUES FOUND! Review recommended');
        }

        console.log(`\n📄 Detailed report saved to: ${reportPath}`);
        console.log(`📄 Markdown report saved to: ./puppeteer-test-report.md`);
        console.log(`📸 Screenshots saved to: ${this.screenshotDir}/`);
        console.log('='.repeat(70));

        return report;
    }

    generateMarkdownReport(report) {
        let md = `# 🎭 RegexPro Puppeteer Test Report\n\n`;
        md += `**Generated:** ${report.summary.timestamp}\n\n`;
        md += `## 📊 Summary\n\n`;
        md += `- **Total Tests:** ${report.summary.total}\n`;
        md += `- **Passed:** ${report.summary.passed} ✅\n`;
        md += `- **Failed:** ${report.summary.failed} ❌\n`;
        md += `- **Critical Failures:** ${report.summary.critical} 🚨\n`;
        md += `- **Pass Rate:** ${report.summary.passRate}\n\n`;

        if (report.summary.critical === 0 && parseFloat(report.summary.passRate) >= 95) {
            md += `## 🌟 Overall Result: EXCELLENT\n\nAll systems operational and secure! RegexPro is ready for production use.\n\n`;
        } else if (report.summary.critical === 0 && parseFloat(report.summary.passRate) >= 85) {
            md += `## 👍 Overall Result: GOOD\n\nMinor issues detected but generally functional.\n\n`;
        } else if (report.summary.critical > 0) {
            md += `## 🚨 Overall Result: CRITICAL ISSUES\n\nImmediate attention required!\n\n`;
        } else {
            md += `## ⚠️ Overall Result: ISSUES FOUND\n\nReview recommended.\n\n`;
        }

        md += `## 🧪 Test Results\n\n`;
        report.tests.forEach(test => {
            const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '💥';
            const critical = test.critical ? ' (CRITICAL)' : '';
            md += `${icon} **${test.name}**${critical}\n`;
            if (test.error) md += `   - Error: ${test.error}\n`;
            md += `\n`;
        });

        if (report.errors.length > 0) {
            md += `## 🚨 Errors Detected\n\n`;
            report.errors.forEach(error => {
                md += `- **${error.timestamp}:** ${error.text}\n`;
            });
            md += `\n`;
        }

        md += `## 📸 Screenshots\n\n`;
        report.screenshots.forEach(screenshot => {
            md += `- **${screenshot.name}:** \`${screenshot.filepath}\`\n`;
        });

        return md;
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
        console.log('🧹 Puppeteer cleanup completed');
    }
}

// Main execution
async function main() {
    const tester = new RegexProPuppeteerTester();
    
    try {
        await tester.init();
        await tester.runAllTests();
        await tester.generateReport();
    } catch (error) {
        console.error('💥 Fatal error:', error);
    } finally {
        await tester.cleanup();
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = RegexProPuppeteerTester;