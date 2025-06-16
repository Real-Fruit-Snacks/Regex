const puppeteer = require('puppeteer');

async function debugTest() {
    console.log('🔍 DEBUG: Starting EnhancedPatternLibrary investigation');
    
    const browser = await puppeteer.launch({
        headless: true,
        devtools: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Capture all console logs and errors
    const logs = [];
    const errors = [];
    
    page.on('console', msg => {
        logs.push({ type: msg.type(), text: msg.text() });
        console.log(`CONSOLE [${msg.type()}]:`, msg.text());
    });

    page.on('pageerror', error => {
        errors.push(error.message);
        console.log('PAGE ERROR:', error.message);
    });

    try {
        console.log('🌐 Loading page...');
        await page.goto('http://127.0.0.1:8081', { waitUntil: 'networkidle2' });
        
        console.log('⏳ Waiting for initialization...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('🧪 Checking objects...');
        const objects = await page.evaluate(() => {
            return {
                regexTester: typeof window.regexTester,
                CyberPatterns: typeof window.CyberPatterns,
                EnhancedPatternLibrary: typeof window.EnhancedPatternLibrary,
                enhancedPatternLibrary: typeof window.enhancedPatternLibrary,
                KeyboardShortcuts: typeof window.KeyboardShortcuts,
                keyboardShortcuts: typeof window.keyboardShortcuts,
                document: typeof document,
                containerExists: !!document.getElementById('pattern-library-container')
            };
        });
        
        console.log('📊 Object status:', objects);
        
        // Try to manually create EnhancedPatternLibrary
        console.log('🧪 Testing EnhancedPatternLibrary creation...');
        const testResult = await page.evaluate(() => {
            try {
                if (typeof EnhancedPatternLibrary === 'undefined') {
                    return { success: false, error: 'EnhancedPatternLibrary class not found' };
                }
                
                if (!window.regexTester) {
                    return { success: false, error: 'regexTester not found' };
                }
                
                const testInstance = new EnhancedPatternLibrary(window.regexTester);
                return { success: true, instance: !!testInstance };
            } catch (error) {
                return { 
                    success: false, 
                    error: error.message,
                    stack: error.stack 
                };
            }
        });
        
        console.log('🧪 Manual creation result:', testResult);
        
        // Check DOM elements
        console.log('🧪 Checking DOM elements...');
        const domStatus = await page.evaluate(() => {
            const elements = {
                'pattern-library-container': !!document.getElementById('pattern-library-container'),
                'regex-input': !!document.getElementById('regex-input'),
                'test-input': !!document.getElementById('test-input'),
                'match-count': !!document.getElementById('match-count'),
                'regex-error': !!document.getElementById('regex-error')
            };
            
            return {
                elements,
                readyState: document.readyState,
                bodyExists: !!document.body
            };
        });
        
        console.log('📊 DOM status:', domStatus);
        
        // Get more detailed error if available
        console.log('🧪 Getting detailed error info...');
        const detailedError = await page.evaluate(() => {
            // Try to access the error details
            if (window.lastError) {
                return window.lastError;
            }
            
            // Check if there are any global error handlers
            return {
                windowErrors: window.errors || [],
                globalError: window.error || null
            };
        });
        
        console.log('📊 Detailed error info:', detailedError);
        
    } catch (error) {
        console.error('💥 Debug test error:', error);
    } finally {
        console.log('\n📋 SUMMARY:');
        console.log('Console logs:', logs.length);
        console.log('Errors:', errors.length);
        
        if (errors.length > 0) {
            console.log('\n🚨 ERRORS FOUND:');
            errors.forEach(error => console.log('  -', error));
        }
        
        await browser.close();
    }
}

debugTest().catch(console.error);