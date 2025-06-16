const puppeteer = require('puppeteer');

async function checkPageContent() {
    console.log('🔍 DEBUG: Checking page content and scripts');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    try {
        console.log('🌐 Loading page...');
        const response = await page.goto('http://127.0.0.1:8080', { waitUntil: 'networkidle2' });
        console.log('Response status:', response.status());
        
        // Get page title and basic info
        const pageInfo = await page.evaluate(() => {
            return {
                title: document.title,
                url: window.location.href,
                hasHead: !!document.head,
                hasBody: !!document.body,
                bodyHTML: document.body ? document.body.innerHTML.substring(0, 500) : 'No body'
            };
        });
        
        console.log('📄 Page info:', pageInfo);
        
        // Check for script tags
        const scripts = await page.evaluate(() => {
            const scriptTags = Array.from(document.querySelectorAll('script'));
            return scriptTags.map(script => ({
                src: script.src,
                hasContent: script.innerHTML.length > 0,
                contentPreview: script.innerHTML.substring(0, 100)
            }));
        });
        
        console.log('📜 Scripts found:', scripts.length);
        scripts.forEach((script, index) => {
            console.log(`  Script ${index + 1}:`, script);
        });
        
        // Check for CSS files
        const styles = await page.evaluate(() => {
            const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
            return linkTags.map(link => ({
                href: link.href,
                id: link.id
            }));
        });
        
        console.log('🎨 Stylesheets found:', styles.length);
        styles.forEach((style, index) => {
            console.log(`  Style ${index + 1}:`, style);
        });
        
        // Check what's actually in the page
        const fullHTML = await page.content();
        console.log('📝 Full HTML length:', fullHTML.length);
        
        // Save the HTML for inspection
        require('fs').writeFileSync('./debug-page-content.html', fullHTML);
        console.log('💾 Full page content saved to debug-page-content.html');
        
        // Check network requests
        const networkLogs = [];
        page.on('response', response => {
            networkLogs.push({
                url: response.url(),
                status: response.status(),
                contentType: response.headers()['content-type']
            });
        });
        
        // Reload to capture network
        console.log('🔄 Reloading to capture network requests...');
        await page.reload({ waitUntil: 'networkidle2' });
        
        console.log('🌐 Network requests:', networkLogs.length);
        networkLogs.forEach(req => {
            if (req.status !== 200) {
                console.log(`  ❌ ${req.status}: ${req.url}`);
            } else if (req.url.includes('.js') || req.url.includes('.css')) {
                console.log(`  ✅ ${req.status}: ${req.url}`);
            }
        });
        
    } catch (error) {
        console.error('💥 Debug error:', error);
    } finally {
        await browser.close();
    }
}

checkPageContent().catch(console.error);