// EXHAUSTIVE REGEXPRO CHECK
// This simulates every possible user interaction and checks every component

class ExhaustiveChecker {
    constructor() {
        this.results = {
            critical: [],
            major: [],
            minor: [],
            passed: []
        };
        this.userActions = [];
    }

    log(level, message, details = '') {
        this.results[level].push({ message, details, timestamp: Date.now() });
        const icons = { critical: '🔥', major: '⚠️', minor: '💭', passed: '✅' };
        console.log(`${icons[level]} ${message} ${details ? `(${details})` : ''}`);
    }

    async runExhaustiveCheck() {
        console.clear();
        console.log('%c🔬 EXHAUSTIVE REGEXPRO CHECK', 'font-size: 24px; color: #ff0000; font-weight: bold');
        console.log('%cChecking EVERYTHING methodically...', 'color: #ffff00');
        console.log('='.repeat(80));

        // Phase 1: File Integrity
        await this.checkPhase1_FileIntegrity();
        
        // Phase 2: HTML Structure Deep Dive
        await this.checkPhase2_HTMLStructure();
        
        // Phase 3: JavaScript Object Inspection
        await this.checkPhase3_JavaScriptObjects();
        
        // Phase 4: CSS and Theming
        await this.checkPhase4_CSSTheming();
        
        // Phase 5: Pattern Library Deep Test
        await this.checkPhase5_PatternLibrary();
        
        // Phase 6: User Interaction Simulation
        await this.checkPhase6_UserInteractions();
        
        // Phase 7: Edge Cases and Error Scenarios
        await this.checkPhase7_EdgeCases();
        
        // Phase 8: Performance Under Load
        await this.checkPhase8_Performance();
        
        // Phase 9: Cross-browser Compatibility
        await this.checkPhase9_Compatibility();
        
        // Phase 10: Security and Privacy
        await this.checkPhase10_Security();

        this.generateFinalReport();
    }

    async checkPhase1_FileIntegrity() {
        console.log('\n📁 PHASE 1: FILE INTEGRITY CHECK');
        console.log('-'.repeat(40));

        // Check all required files exist and are accessible
        const requiredFiles = [
            'index.html',
            'app.js',
            'cyber-patterns.js',
            'enhanced-pattern-library.js',
            'keyboard-shortcuts.js',
            'mode-help.js',
            'regex-parser.js',
            'syntax-highlighter.js',
            'pattern-explainer.js',
            'enhanced-tooltips.js',
            'replacement-preview.js',
            'themes/cyber-pro.css',
            'manifest.json'
        ];

        for (const file of requiredFiles) {
            try {
                const response = await fetch(file);
                if (response.ok) {
                    const size = response.headers.get('content-length');
                    this.log('passed', `File ${file}`, `${size} bytes`);
                } else {
                    this.log('critical', `File ${file} not accessible`, `HTTP ${response.status}`);
                }
            } catch (e) {
                this.log('critical', `File ${file} failed to load`, e.message);
            }
        }

        // Check file sizes are reasonable
        const mainFiles = ['app.js', 'cyber-patterns.js', 'enhanced-pattern-library.js'];
        for (const file of mainFiles) {
            try {
                const response = await fetch(file);
                const text = await response.text();
                if (text.length < 1000) {
                    this.log('major', `File ${file} seems too small`, `${text.length} chars`);
                } else if (text.length > 100000) {
                    this.log('minor', `File ${file} is quite large`, `${text.length} chars`);
                } else {
                    this.log('passed', `File ${file} size OK`, `${text.length} chars`);
                }
            } catch (e) {
                this.log('critical', `Could not check size of ${file}`, e.message);
            }
        }
    }

    async checkPhase2_HTMLStructure() {
        console.log('\n🏗️ PHASE 2: HTML STRUCTURE DEEP DIVE');
        console.log('-'.repeat(40));

        // Check document structure
        const doctype = document.doctype;
        if (doctype && doctype.name === 'html') {
            this.log('passed', 'HTML5 doctype present');
        } else {
            this.log('major', 'Missing or incorrect doctype');
        }

        // Check meta tags
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            this.log('passed', 'Viewport meta tag present', viewport.content);
        } else {
            this.log('major', 'Missing viewport meta tag');
        }

        const charset = document.querySelector('meta[charset]');
        if (charset && charset.getAttribute('charset').toLowerCase() === 'utf-8') {
            this.log('passed', 'UTF-8 charset specified');
        } else {
            this.log('major', 'Missing or incorrect charset');
        }

        // Check title
        const title = document.title;
        if (title && title.includes('RegexPro')) {
            this.log('passed', 'Page title correct', title);
        } else {
            this.log('minor', 'Page title issue', title);
        }

        // Check all required structural elements
        const requiredStructure = {
            'header': 'Header section',
            '.header-content': 'Header content wrapper',
            '.logo-section': 'Logo section',
            '.version-badge': 'Version badge',
            'main': 'Main content area',
            '.sidebar': 'Sidebar navigation',
            '.content-area': 'Main content area',
            '.status-bar': 'Status bar'
        };

        Object.entries(requiredStructure).forEach(([selector, description]) => {
            const element = document.querySelector(selector);
            if (element) {
                this.log('passed', `Structure: ${description}`);
            } else {
                this.log('major', `Missing: ${description}`, selector);
            }
        });

        // Check for accessibility features
        const altTags = document.querySelectorAll('img:not([alt])');
        if (altTags.length > 0) {
            this.log('minor', `${altTags.length} images missing alt text`);
        } else {
            this.log('passed', 'All images have alt text');
        }

        const labels = document.querySelectorAll('input:not([aria-label]):not([id])');
        labels.forEach((input, i) => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (!label && !input.getAttribute('aria-label')) {
                this.log('minor', `Input ${i} missing label or aria-label`);
            }
        });
    }

    async checkPhase3_JavaScriptObjects() {
        console.log('\n⚙️ PHASE 3: JAVASCRIPT OBJECTS INSPECTION');
        console.log('-'.repeat(40));

        // Check critical constructors
        const constructors = {
            'RegexTester': RegexTester,
            'EnhancedPatternLibrary': EnhancedPatternLibrary,
            'KeyboardShortcuts': KeyboardShortcuts,
            'CyberPatterns': CyberPatterns
        };

        Object.entries(constructors).forEach(([name, constructor]) => {
            if (typeof constructor === 'function') {
                this.log('passed', `Constructor ${name} available`);
                
                // Check if it has expected properties/methods
                const prototype = constructor.prototype;
                if (prototype) {
                    const methods = Object.getOwnPropertyNames(prototype).filter(p => typeof prototype[p] === 'function');
                    this.log('passed', `${name} has ${methods.length} methods`);
                }
            } else if (typeof constructor === 'object') {
                this.log('passed', `Object ${name} available`);
            } else {
                this.log('critical', `${name} is ${typeof constructor}`);
            }
        });

        // Check instances
        const instances = {
            'regexTester': regexTester,
            'enhancedPatternLibrary': enhancedPatternLibrary,
            'keyboardShortcuts': keyboardShortcuts
        };

        Object.entries(instances).forEach(([name, instance]) => {
            if (instance) {
                this.log('passed', `Instance ${name} created`);
                
                // Check if instance has expected properties
                const props = Object.getOwnPropertyNames(instance);
                this.log('passed', `${name} has ${props.length} properties`);
            } else {
                this.log('critical', `Instance ${name} is undefined`);
            }
        });

        // Check for errors in console
        const errors = window.console._errors || [];
        if (errors.length === 0) {
            this.log('passed', 'No console errors detected');
        } else {
            errors.forEach(error => {
                this.log('major', 'Console error detected', error);
            });
        }

        // Check event listener setup
        const regexInput = document.getElementById('regex-input');
        if (regexInput) {
            // Try to detect if event listeners are attached
            const listeners = getEventListeners ? getEventListeners(regexInput) : null;
            if (listeners && listeners.input && listeners.input.length > 0) {
                this.log('passed', 'Regex input has event listeners');
            } else {
                // Fallback check
                const hasOninput = regexInput.oninput !== null;
                if (hasOninput) {
                    this.log('passed', 'Regex input has oninput handler');
                } else {
                    this.log('major', 'Regex input may not have event listeners');
                }
            }
        }
    }

    async checkPhase4_CSSTheming() {
        console.log('\n🎨 PHASE 4: CSS AND THEMING');
        console.log('-'.repeat(40));

        // Check theme stylesheet
        const themeLink = document.getElementById('theme-stylesheet');
        if (themeLink) {
            this.log('passed', 'Theme stylesheet link present', themeLink.href);
            
            // Check if CSS loads
            if (themeLink.sheet) {
                const rules = themeLink.sheet.cssRules || themeLink.sheet.rules;
                this.log('passed', `Theme has ${rules.length} CSS rules`);
            } else {
                this.log('major', 'Theme stylesheet not loaded');
            }
        } else {
            this.log('critical', 'Theme stylesheet link missing');
        }

        // Check CSS variables
        const root = getComputedStyle(document.documentElement);
        const cssVars = [
            '--bg-primary',
            '--text-primary',
            '--accent-primary',
            '--font-mono',
            '--font-sans'
        ];

        cssVars.forEach(varName => {
            const value = root.getPropertyValue(varName).trim();
            if (value) {
                this.log('passed', `CSS var ${varName}`, value);
            } else {
                this.log('major', `CSS var ${varName} not defined`);
            }
        });

        // Check computed styles
        const body = document.body;
        const bodyStyles = getComputedStyle(body);
        const bgColor = bodyStyles.backgroundColor;
        const textColor = bodyStyles.color;
        const fontFamily = bodyStyles.fontFamily;

        this.log('passed', 'Body background color', bgColor);
        this.log('passed', 'Body text color', textColor);
        this.log('passed', 'Body font family', fontFamily);

        // Check if fonts loaded
        if (document.fonts) {
            const loadedFonts = [];
            document.fonts.forEach(font => loadedFonts.push(font.family));
            this.log('passed', `${loadedFonts.length} fonts loaded`, loadedFonts.join(', '));
        }

        // Check responsive design
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            const sidebarStyles = getComputedStyle(sidebar);
            this.log('passed', 'Sidebar display', sidebarStyles.display);
            this.log('passed', 'Sidebar width', sidebarStyles.width);
        }
    }

    async checkPhase5_PatternLibrary() {
        console.log('\n📚 PHASE 5: PATTERN LIBRARY DEEP TEST');
        console.log('-'.repeat(40));

        // Check CyberPatterns object
        if (typeof CyberPatterns !== 'undefined') {
            const categories = CyberPatterns.getAllCategories();
            this.log('passed', `CyberPatterns has ${categories.length} categories`, categories.join(', '));

            // Check each category
            categories.forEach(category => {
                const patterns = CyberPatterns.getPatternsByCategory(category);
                if (patterns.length > 0) {
                    this.log('passed', `Category ${category}`, `${patterns.length} patterns`);
                    
                    // Check pattern structure
                    const firstPattern = patterns[0];
                    const requiredProps = ['name', 'pattern', 'description'];
                    const hasAllProps = requiredProps.every(prop => firstPattern.hasOwnProperty(prop));
                    if (hasAllProps) {
                        this.log('passed', `Pattern structure for ${category} OK`);
                    } else {
                        this.log('major', `Pattern structure for ${category} incomplete`);
                    }
                } else {
                    this.log('major', `Category ${category} has no patterns`);
                }
            });

            // Test search functionality
            const searchResults = CyberPatterns.searchPatterns('ip');
            if (searchResults.length > 0) {
                this.log('passed', 'Pattern search works', `Found ${searchResults.length} results for "ip"`);
            } else {
                this.log('major', 'Pattern search not working');
            }
        } else {
            this.log('critical', 'CyberPatterns object not available');
        }

        // Check DOM pattern library
        const categories = document.querySelectorAll('.category-chip');
        if (categories.length === 7) {
            this.log('passed', 'All 7 pattern categories displayed');
        } else {
            this.log('major', `Wrong number of categories: ${categories.length} (expected 7)`);
        }

        const patterns = document.querySelectorAll('.pattern-card');
        if (patterns.length > 0) {
            this.log('passed', `${patterns.length} patterns currently visible`);
        } else {
            this.log('major', 'No patterns visible in DOM');
        }

        // Test pattern interaction
        if (patterns.length > 0) {
            const firstPattern = patterns[0];
            const patternValue = firstPattern.dataset.pattern;
            if (patternValue) {
                this.log('passed', 'Pattern cards have data attributes');
            } else {
                this.log('major', 'Pattern cards missing data attributes');
            }
        }
    }

    async checkPhase6_UserInteractions() {
        console.log('\n🖱️ PHASE 6: USER INTERACTION SIMULATION');
        console.log('-'.repeat(40));

        // Test 1: Basic pattern input
        const regexInput = document.getElementById('regex-input');
        const testInput = document.getElementById('test-input');
        
        if (regexInput && testInput) {
            // Clear inputs
            regexInput.value = '';
            testInput.value = '';
            regexInput.dispatchEvent(new Event('input', { bubbles: true }));
            testInput.dispatchEvent(new Event('input', { bubbles: true }));
            await this.wait(100);

            // Test simple pattern
            regexInput.value = '\\d+';
            regexInput.dispatchEvent(new Event('input', { bubbles: true }));
            testInput.value = 'Numbers: 123, 456, 789';
            testInput.dispatchEvent(new Event('input', { bubbles: true }));
            await this.wait(200);

            const highlights = document.querySelectorAll('mark.highlight');
            if (highlights.length === 3) {
                this.log('passed', 'Basic pattern matching works', '3 numbers highlighted');
            } else {
                this.log('major', `Pattern matching issue: ${highlights.length} highlights (expected 3)`);
            }

            const matchCount = document.getElementById('match-count');
            if (matchCount && matchCount.textContent.includes('3')) {
                this.log('passed', 'Match count display correct');
            } else {
                this.log('major', 'Match count display incorrect', matchCount?.textContent);
            }

            this.userActions.push('Basic pattern test completed');
        } else {
            this.log('critical', 'Missing regex or test inputs');
        }

        // Test 2: Dropdown interactions
        const modeDropdown = document.getElementById('dropdown-selected');
        if (modeDropdown) {
            const wasOpen = modeDropdown.classList.contains('open');
            modeDropdown.click();
            await this.wait(100);
            const isOpen = modeDropdown.classList.contains('open');
            if (isOpen !== wasOpen) {
                this.log('passed', 'Mode dropdown toggles correctly');
                // Close it
                document.body.click();
                await this.wait(100);
            } else {
                this.log('major', 'Mode dropdown not responding to clicks');
            }
        }

        // Test 3: Theme switching
        const themeDropdown = document.getElementById('theme-dropdown-selected');
        if (themeDropdown) {
            themeDropdown.click();
            await this.wait(100);
            
            const options = document.querySelectorAll('#theme-dropdown-options .dropdown-option');
            if (options.length >= 15) {
                this.log('passed', `Theme dropdown has ${options.length} options`);
            } else {
                this.log('major', `Theme dropdown has only ${options.length} options`);
            }
            
            document.body.click(); // Close dropdown
        }

        // Test 4: Pattern library interaction
        const firstCategory = document.querySelector('.category-chip');
        if (firstCategory) {
            firstCategory.click();
            await this.wait(100);
            
            const isActive = firstCategory.classList.contains('active');
            if (isActive) {
                this.log('passed', 'Category selection works');
            } else {
                this.log('major', 'Category selection not working');
            }

            // Click a pattern
            const firstPatternCard = document.querySelector('.pattern-card');
            if (firstPatternCard) {
                const patternValue = firstPatternCard.dataset.pattern;
                firstPatternCard.click();
                await this.wait(100);
                
                if (regexInput && regexInput.value === patternValue) {
                    this.log('passed', 'Pattern card click loads pattern');
                } else {
                    this.log('major', 'Pattern card click not working');
                }
            }
        }

        // Test 5: Button interactions
        const buttons = [
            { id: 'help-button', name: 'Help button' },
            { id: 'shortcuts-button', name: 'Shortcuts button' },
            { id: 'export-pattern', name: 'Export button' },
            { id: 'share-pattern', name: 'Share button' }
        ];

        for (const btn of buttons) {
            const element = document.getElementById(btn.id);
            if (element) {
                const isDisabled = element.disabled || element.classList.contains('disabled');
                if (!isDisabled) {
                    this.log('passed', `${btn.name} is clickable`);
                } else {
                    this.log('minor', `${btn.name} is disabled`);
                }
            } else {
                this.log('major', `${btn.name} not found`);
            }
        }
    }

    async checkPhase7_EdgeCases() {
        console.log('\n🔍 PHASE 7: EDGE CASES AND ERROR SCENARIOS');
        console.log('-'.repeat(40));

        const regexInput = document.getElementById('regex-input');
        const flagsInput = document.getElementById('regex-flags');
        const testInput = document.getElementById('test-input');
        const errorDiv = document.getElementById('regex-error');

        // Test 1: Invalid regex patterns
        const invalidPatterns = ['[', '(', '*', '+', '?', '{', '\\'];
        for (const pattern of invalidPatterns) {
            if (regexInput) {
                regexInput.value = pattern;
                regexInput.dispatchEvent(new Event('input', { bubbles: true }));
                await this.wait(100);
                
                if (errorDiv && errorDiv.textContent.length > 0) {
                    this.log('passed', `Invalid pattern "${pattern}" shows error`);
                } else {
                    this.log('minor', `Invalid pattern "${pattern}" no error shown`);
                }
            }
        }

        // Test 2: Invalid flags
        if (flagsInput) {
            flagsInput.value = 'xyz123';
            flagsInput.dispatchEvent(new Event('input', { bubbles: true }));
            await this.wait(100);
            
            if (errorDiv && errorDiv.textContent.length > 0) {
                this.log('passed', 'Invalid flags show error');
            } else {
                this.log('minor', 'Invalid flags no error shown');
            }
            
            // Clear flags
            flagsInput.value = '';
            flagsInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Test 3: Large input handling
        if (testInput) {
            const largeText = 'test '.repeat(10000);
            testInput.value = largeText;
            testInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Check if app still responds
            setTimeout(() => {
                if (testInput.value === largeText) {
                    this.log('passed', 'Handles large text input');
                } else {
                    this.log('major', 'Large text input causes issues');
                }
            }, 500);
        }

        // Test 4: Empty input handling
        if (regexInput && testInput) {
            regexInput.value = '';
            testInput.value = '';
            regexInput.dispatchEvent(new Event('input', { bubbles: true }));
            testInput.dispatchEvent(new Event('input', { bubbles: true }));
            await this.wait(100);
            
            const matchCount = document.getElementById('match-count');
            if (matchCount && matchCount.textContent.includes('No matches')) {
                this.log('passed', 'Empty inputs handled correctly');
            } else {
                this.log('minor', 'Empty input handling unclear');
            }
        }

        // Test 5: Unicode and special characters
        if (regexInput && testInput) {
            regexInput.value = '[\\u{1F600}-\\u{1F64F}]';
            testInput.value = 'Emoji test: 😀 😃 😄 😁';
            regexInput.dispatchEvent(new Event('input', { bubbles: true }));
            testInput.dispatchEvent(new Event('input', { bubbles: true }));
            await this.wait(200);
            
            const highlights = document.querySelectorAll('mark.highlight');
            if (highlights.length > 0) {
                this.log('passed', 'Unicode regex works', `${highlights.length} emoji matched`);
            } else {
                this.log('minor', 'Unicode regex may not work');
            }
        }
    }

    async checkPhase8_Performance() {
        console.log('\n🚀 PHASE 8: PERFORMANCE UNDER LOAD');
        console.log('-'.repeat(40));

        const regexInput = document.getElementById('regex-input');
        const testInput = document.getElementById('test-input');

        if (regexInput && testInput) {
            // Performance test 1: Many matches
            const startTime = performance.now();
            
            regexInput.value = '\\w+';
            testInput.value = 'word '.repeat(1000);
            regexInput.dispatchEvent(new Event('input', { bubbles: true }));
            testInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            await this.wait(300);
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            if (duration < 1000) {
                this.log('passed', 'Good performance with many matches', `${duration.toFixed(0)}ms`);
            } else if (duration < 3000) {
                this.log('minor', 'Acceptable performance', `${duration.toFixed(0)}ms`);
            } else {
                this.log('major', 'Poor performance detected', `${duration.toFixed(0)}ms`);
            }

            // Check memory usage if available
            if (performance.memory) {
                const memory = performance.memory;
                this.log('passed', 'Memory usage', `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`);
            }

            // Performance test 2: Complex regex
            const complexStart = performance.now();
            regexInput.value = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
            testInput.value = 'IPs: ' + Array.from({length: 100}, (_, i) => `192.168.1.${i}`).join(' ');
            regexInput.dispatchEvent(new Event('input', { bubbles: true }));
            testInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            await this.wait(200);
            
            const complexEnd = performance.now();
            const complexDuration = complexEnd - complexStart;
            
            if (complexDuration < 500) {
                this.log('passed', 'Complex regex performance good', `${complexDuration.toFixed(0)}ms`);
            } else {
                this.log('minor', 'Complex regex slower', `${complexDuration.toFixed(0)}ms`);
            }
        }

        // Check for memory leaks
        const initialMemory = performance.memory?.usedJSHeapSize || 0;
        
        // Perform intensive operations
        for (let i = 0; i < 10; i++) {
            const category = document.querySelector('.category-chip');
            if (category) {
                category.click();
                await this.wait(10);
            }
        }
        
        await this.wait(100);
        
        const finalMemory = performance.memory?.usedJSHeapSize || 0;
        const memoryIncrease = finalMemory - initialMemory;
        
        if (memoryIncrease < 1000000) { // Less than 1MB increase
            this.log('passed', 'No significant memory leaks detected');
        } else {
            this.log('minor', 'Potential memory increase', `${Math.round(memoryIncrease / 1024)}KB`);
        }
    }

    async checkPhase9_Compatibility() {
        console.log('\n🌐 PHASE 9: BROWSER COMPATIBILITY');
        console.log('-'.repeat(40));

        // Check browser features
        const features = {
            'localStorage': typeof localStorage !== 'undefined',
            'fetch': typeof fetch !== 'undefined',
            'Promise': typeof Promise !== 'undefined',
            'const/let': (() => { try { eval('const x = 1; let y = 2;'); return true; } catch(e) { return false; } })(),
            'arrow functions': (() => { try { eval('() => {}'); return true; } catch(e) { return false; } })(),
            'template literals': (() => { try { eval('`test`'); return true; } catch(e) { return false; } })(),
            'CSS Grid': CSS.supports('display', 'grid'),
            'CSS Flexbox': CSS.supports('display', 'flex'),
            'CSS Variables': CSS.supports('color', 'var(--test)'),
            'matchMedia': typeof window.matchMedia !== 'undefined'
        };

        Object.entries(features).forEach(([feature, supported]) => {
            if (supported) {
                this.log('passed', `Browser supports ${feature}`);
            } else {
                this.log('major', `Browser missing ${feature}`);
            }
        });

        // Check user agent
        const ua = navigator.userAgent;
        this.log('passed', 'User Agent', ua);

        // Check viewport
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        this.log('passed', 'Viewport size', `${vw}x${vh}`);

        // Check if responsive design works
        if (vw < 768) {
            const sidebar = document.querySelector('.sidebar');
            const sidebarDisplay = getComputedStyle(sidebar).display;
            if (sidebarDisplay === 'none') {
                this.log('passed', 'Responsive design: sidebar hidden on mobile');
            } else {
                this.log('minor', 'Responsive design: sidebar still visible on mobile');
            }
        }
    }

    async checkPhase10_Security() {
        console.log('\n🔒 PHASE 10: SECURITY AND PRIVACY');
        console.log('-'.repeat(40));

        // Check for external requests
        const externalLinks = document.querySelectorAll('link[href*="//"], script[src*="//"]');
        this.log('passed', `${externalLinks.length} external resources`, 
                Array.from(externalLinks).map(el => el.href || el.src).join(', '));

        // Check localStorage usage
        const lsKeys = Object.keys(localStorage);
        const regexKeys = lsKeys.filter(key => key.includes('regex') || key.includes('pattern'));
        this.log('passed', `${regexKeys.length} regex-related localStorage keys`, regexKeys.join(', '));

        // Check for potential XSS vectors
        const userInputs = document.querySelectorAll('input[type="text"], textarea');
        userInputs.forEach((input, i) => {
            const value = input.value;
            if (value.includes('<script') || value.includes('javascript:')) {
                this.log('major', `Potential XSS in input ${i}`, value.substring(0, 50));
            }
        });

        // Check CSP if present
        const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (csp) {
            this.log('passed', 'CSP header present', csp.content);
        } else {
            this.log('minor', 'No CSP header found');
        }

        // Check HTTPS (if available)
        if (location.protocol === 'https:') {
            this.log('passed', 'Running on HTTPS');
        } else {
            this.log('minor', 'Running on HTTP (development OK)');
        }

        // Check for sensitive data exposure
        const scripts = Array.from(document.scripts);
        let foundSensitiveData = false;
        scripts.forEach((script, i) => {
            if (script.innerHTML.includes('password') || script.innerHTML.includes('secret')) {
                this.log('major', `Potential sensitive data in script ${i}`);
                foundSensitiveData = true;
            }
        });
        
        if (!foundSensitiveData) {
            this.log('passed', 'No obvious sensitive data in scripts');
        }
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateFinalReport() {
        console.log('\n' + '='.repeat(80));
        console.log('%c📊 EXHAUSTIVE CHECK FINAL REPORT', 'font-size: 20px; color: #00ff41; font-weight: bold');
        console.log('='.repeat(80));

        const total = this.results.critical.length + this.results.major.length + 
                     this.results.minor.length + this.results.passed.length;

        console.log(`
🔥 Critical Issues: ${this.results.critical.length}
⚠️  Major Issues: ${this.results.major.length}  
💭 Minor Issues: ${this.results.minor.length}
✅ Passed Checks: ${this.results.passed.length}
📊 Total Checks: ${total}
        `);

        const passRate = total > 0 ? ((this.results.passed.length / total) * 100).toFixed(1) : 0;
        console.log(`📈 Pass Rate: ${passRate}%`);

        if (this.results.critical.length > 0) {
            console.log('\n🔥 CRITICAL ISSUES THAT MUST BE FIXED:');
            this.results.critical.forEach(issue => {
                console.log(`  • ${issue.message} ${issue.details ? `(${issue.details})` : ''}`);
            });
        }

        if (this.results.major.length > 0) {
            console.log('\n⚠️  MAJOR ISSUES (Impact Functionality):');
            this.results.major.forEach(issue => {
                console.log(`  • ${issue.message} ${issue.details ? `(${issue.details})` : ''}`);
            });
        }

        if (this.results.minor.length > 0) {
            console.log('\n💭 MINOR ISSUES (Polish & Optimization):');
            this.results.minor.forEach(issue => {
                console.log(`  • ${issue.message} ${issue.details ? `(${issue.details})` : ''}`);
            });
        }

        // Final verdict
        console.log('\n🎯 FINAL VERDICT:');
        if (this.results.critical.length === 0) {
            if (this.results.major.length === 0) {
                console.log('✨ EXCELLENT: No critical or major issues found!');
                console.log('🚀 RegexPro is ready for production use.');
            } else {
                console.log('👍 GOOD: No critical issues, but some major issues need attention.');
                console.log('🔧 Address major issues for optimal experience.');
            }
        } else {
            console.log('🛑 NEEDS WORK: Critical issues must be fixed before deployment.');
        }

        console.log('\n📋 User Actions Performed:');
        this.userActions.forEach(action => console.log(`  ✓ ${action}`));

        console.log('\n' + '='.repeat(80));
        console.log(`Check completed at: ${new Date().toLocaleString()}`);
        console.log('='.repeat(80));

        return {
            critical: this.results.critical.length,
            major: this.results.major.length,
            minor: this.results.minor.length,
            passed: this.results.passed.length,
            passRate: passRate
        };
    }
}

// Track console errors
window.console._errors = window.console._errors || [];
const originalError = window.console.error;
window.console.error = function(...args) {
    window.console._errors.push(args.join(' '));
    originalError.apply(window.console, args);
};

// Run the exhaustive check
const checker = new ExhaustiveChecker();
checker.runExhaustiveCheck();