// RegexPro Status Verification
// Copy and paste this into the browser console

console.clear();
console.log('%c🚀 RegexPro Status Check', 'font-size: 20px; color: #00ff41; font-weight: bold');
console.log('='.repeat(50));

// Quick status checks
const status = {
    app: typeof regexTester !== 'undefined' ? '✅ Loaded' : '❌ Not loaded',
    patterns: typeof CyberPatterns !== 'undefined' ? '✅ Loaded' : '❌ Not loaded',
    theme: document.getElementById('theme-stylesheet')?.href.includes('cyber-pro') ? '✅ Cyber Pro' : '⚠️ Different theme',
    patternCount: document.querySelectorAll('.pattern-card').length,
    categories: document.querySelectorAll('.category-chip').length
};

console.log(`
Application: ${status.app}
Pattern Library: ${status.patterns}
Active Theme: ${status.theme}
Patterns Visible: ${status.patternCount}
Categories: ${status.categories}
`);

// Test basic functionality
const input = document.getElementById('regex-input');
const test = document.getElementById('test-input');

if (input && test) {
    input.value = '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b';
    test.value = 'Server IPs: 192.168.1.1 and 10.0.0.5';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    test.dispatchEvent(new Event('input', { bubbles: true }));
    
    setTimeout(() => {
        const matches = document.querySelectorAll('mark.highlight').length;
        console.log(`Pattern Test: ${matches === 2 ? '✅' : '❌'} Found ${matches} IP addresses`);
        console.log('\n✨ RegexPro is', matches === 2 ? 'working perfectly!' : 'having issues.');
    }, 100);
} else {
    console.log('❌ Could not test - missing inputs');
}

console.log('\nPress F1 for help, Ctrl+/ for shortcuts');
console.log('='.repeat(50));