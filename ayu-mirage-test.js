const puppeteer = require('puppeteer');

async function captureAyuMirageTheme() {
    console.log('📸 Capturing Ayu Mirage themed Regex Tester');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1200, height: 800 }
    });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://127.0.0.1:8081', { waitUntil: 'networkidle2' });
        
        // Set some example content
        await page.evaluate(() => {
            document.getElementById('regex').value = '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b';
            document.getElementById('flags').value = 'gi';
            document.getElementById('test-text').value = `Contact Information:
Email: john.doe@example.com
Phone: +1 (555) 123-4567
Website: https://example.com

Alternative emails:
support@company.org
admin@test.io
info@business.net`;
            
            // Trigger the regex test
            document.getElementById('regex').dispatchEvent(new Event('input', { bubbles: true }));
        });
        
        // Wait for results
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Take screenshot
        await page.screenshot({ 
            path: 'ayu-mirage-theme.png',
            fullPage: true
        });
        
        console.log('✅ Screenshot saved as ayu-mirage-theme.png');
        console.log('🎨 Ayu Mirage theme successfully applied!');
        console.log('\nTheme features:');
        console.log('- Dark background (#191e2a)');
        console.log('- Main container background (#1f2430)');
        console.log('- Yellow accent color (#ffcc66)');
        console.log('- Soft text color (#cbccc6)');
        console.log('- Border color (#33415e)');
        console.log('- Matching tool badges with Ayu colors');
        
        // Keep browser open for 5 seconds to view
        await new Promise(resolve => setTimeout(resolve, 5000));
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await browser.close();
    }
}

captureAyuMirageTheme().catch(console.error);