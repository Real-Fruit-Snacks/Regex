// Quick diagnostics script - paste this in browser console
console.log('🔍 RegexPro Quick Diagnostics\n');

// Check for JavaScript errors
if (window.onerror) {
    console.log('❌ JavaScript errors detected - check console');
} else {
    console.log('✅ No JavaScript errors in window.onerror');
}

// Check critical objects
const checks = {
    'RegexTester': typeof RegexTester !== 'undefined',
    'EnhancedPatternLibrary': typeof EnhancedPatternLibrary !== 'undefined',
    'KeyboardShortcuts': typeof KeyboardShortcuts !== 'undefined',
    'CyberPatterns': typeof CyberPatterns !== 'undefined',
    'regexTester instance': typeof regexTester !== 'undefined',
    'enhancedPatternLibrary instance': typeof enhancedPatternLibrary !== 'undefined',
    'keyboardShortcuts instance': typeof keyboardShortcuts !== 'undefined'
};

console.log('\n📦 Object Availability:');
Object.entries(checks).forEach(([name, exists]) => {
    console.log(`${exists ? '✅' : '❌'} ${name}`);
});

// Check DOM elements
console.log('\n🏗️ Critical DOM Elements:');
const elements = [
    'regex-input',
    'test-input', 
    'pattern-library-container',
    'help-panel',
    'shortcuts-modal',
    'theme-dropdown',
    'regex-mode-dropdown'
];

elements.forEach(id => {
    const el = document.getElementById(id);
    console.log(`${el ? '✅' : '❌'} #${id} ${el ? '(found)' : '(missing)'}`);
});

// Check theme
console.log('\n🎨 Theme Status:');
const themeLink = document.getElementById('theme-stylesheet');
console.log('Current theme:', themeLink?.href.split('/').pop() || 'none');

// Check localStorage
console.log('\n💾 Storage:');
try {
    const theme = localStorage.getItem('selectedTheme');
    const mode = localStorage.getItem('selectedMode');
    console.log('Saved theme:', theme || 'none');
    console.log('Saved mode:', mode || 'none');
} catch (e) {
    console.log('❌ localStorage error:', e.message);
}

// Test basic functionality
console.log('\n⚡ Quick Functionality Test:');
try {
    const input = document.getElementById('regex-input');
    const testInput = document.getElementById('test-input');
    if (input && testInput) {
        input.value = '\\d+';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        testInput.value = 'Test 123';
        testInput.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('✅ Basic regex test triggered');
    } else {
        console.log('❌ Could not test - missing inputs');
    }
} catch (e) {
    console.log('❌ Test error:', e.message);
}

console.log('\n---\nDiagnostics complete. Check for ❌ marks above.');