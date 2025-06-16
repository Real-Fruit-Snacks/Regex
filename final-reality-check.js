// FINAL REALITY CHECK - Simulates real user experience
// This is the most thorough test - checks EVERYTHING a user would do

console.clear();
console.log('%c🎯 FINAL REALITY CHECK - COMPLETE USER EXPERIENCE TEST', 'font-size: 24px; color: #ff6600; font-weight: bold');
console.log('%cTesting every single feature a user would actually use...', 'color: #ffaa00');
console.log('='.repeat(100));

let testResults = {
    userScenarios: [],
    functionalityTests: [],
    issues: [],
    recommendations: []
};

// Scenario 1: New User First Visit
async function scenario1_NewUserFirstVisit() {
    console.log('\n👤 SCENARIO 1: New User First Visit');
    console.log('-'.repeat(50));
    
    // Check if page loads cleanly
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    if (loadTime < 3000) {
        testResults.userScenarios.push('✅ Page loads quickly');
        console.log('✅ Page loads in', loadTime + 'ms');
    } else {
        testResults.issues.push('⚠️ Page load is slow: ' + loadTime + 'ms');
    }
    
    // Check if user sees the right branding
    const title = document.title;
    const h1 = document.querySelector('h1');
    if (title.includes('RegexPro') && h1?.textContent.includes('RegexPro')) {
        testResults.userScenarios.push('✅ Clear branding visible');
        console.log('✅ User sees RegexPro branding');
    } else {
        testResults.issues.push('❌ Branding not clear');
    }
    
    // Check if cyber theme is active (what user expects)
    const themeLink = document.getElementById('theme-stylesheet');
    if (themeLink?.href.includes('cyber-pro')) {
        testResults.userScenarios.push('✅ Professional cyber theme active');
        console.log('✅ Professional cyber theme active');
    } else {
        testResults.issues.push('❌ Wrong default theme');
    }
    
    // Check if pattern library is immediately visible
    const sidebar = document.querySelector('.sidebar');
    const patternCategories = document.querySelectorAll('.category-chip');
    if (sidebar && patternCategories.length > 0) {
        testResults.userScenarios.push('✅ Pattern library immediately visible');
        console.log('✅ User can see', patternCategories.length, 'pattern categories');
    } else {
        testResults.issues.push('❌ Pattern library not visible on load');
    }
}

// Scenario 2: Cybersecurity Professional Use Case
async function scenario2_CyberSecurityUse() {
    console.log('\n🛡️ SCENARIO 2: Cybersecurity Professional Use Case');
    console.log('-'.repeat(50));
    
    const regexInput = document.getElementById('regex-input');
    const testInput = document.getElementById('test-input');
    
    // Test 1: Look for IP addresses in log data
    console.log('Testing: IP address detection in logs...');
    
    // Click Network category
    const networkCategory = Array.from(document.querySelectorAll('.category-chip')).find(c => c.textContent === 'Network');
    if (networkCategory) {
        networkCategory.click();
        await wait(100);
        
        // Find IPv4 pattern
        const ipPattern = Array.from(document.querySelectorAll('.pattern-card')).find(p => p.dataset.name?.includes('IPv4'));
        if (ipPattern) {
            ipPattern.click();
            await wait(100);
            
            // Add sample log data
            testInput.value = `
[2024-01-15 14:23:45] INFO: Connection from 192.168.1.100
[2024-01-15 14:23:46] WARN: Failed login from 10.0.0.5
[2024-01-15 14:23:47] ERROR: Blocked access from 172.16.0.10
            `;
            testInput.dispatchEvent(new Event('input', { bubbles: true }));
            await wait(200);
            
            const matches = document.querySelectorAll('mark.highlight');
            if (matches.length === 3) {
                testResults.functionalityTests.push('✅ IP detection in logs works perfectly');
                console.log('✅ Found all 3 IP addresses in log data');
            } else {
                testResults.issues.push(`❌ IP detection failed: found ${matches.length} instead of 3`);
            }
        } else {
            testResults.issues.push('❌ IPv4 pattern not found in library');
        }
    } else {
        testResults.issues.push('❌ Network category not found');
    }
    
    // Test 2: Hash detection for malware analysis
    console.log('Testing: Hash detection for malware analysis...');
    
    const securityCategory = Array.from(document.querySelectorAll('.category-chip')).find(c => c.textContent === 'Security');
    if (securityCategory) {
        securityCategory.click();
        await wait(100);
        
        const hashPattern = Array.from(document.querySelectorAll('.pattern-card')).find(p => p.dataset.name?.includes('MD5'));
        if (hashPattern) {
            hashPattern.click();
            await wait(100);
            
            testInput.value = `
File hashes:
malware.exe: 5d41402abc4b2a76b9719d911017c592
clean.exe: 098f6bcd4621d373cade4e832627b4f6
suspicious.dll: a1b2c3d4e5f6789012345678901234567890
            `;
            testInput.dispatchEvent(new Event('input', { bubbles: true }));
            await wait(200);
            
            const hashMatches = document.querySelectorAll('mark.highlight');
            if (hashMatches.length >= 2) {
                testResults.functionalityTests.push('✅ Hash detection works for malware analysis');
                console.log('✅ Found', hashMatches.length, 'MD5 hashes');
            } else {
                testResults.issues.push(`❌ Hash detection failed: found ${hashMatches.length} hashes`);
            }
        }
    }
}

// Scenario 3: CTF Competition Use
async function scenario3_CTFCompetition() {
    console.log('\n🏆 SCENARIO 3: CTF Competition Use');
    console.log('-'.repeat(50));
    
    const regexInput = document.getElementById('regex-input');
    const testInput = document.getElementById('test-input');
    
    // Test flag extraction
    const ctfCategory = Array.from(document.querySelectorAll('.category-chip')).find(c => c.textContent === 'CTF');
    if (ctfCategory) {
        ctfCategory.click();
        await wait(100);
        
        const flagPattern = Array.from(document.querySelectorAll('.pattern-card')).find(p => p.dataset.name?.includes('Flag'));
        if (flagPattern) {
            flagPattern.click();
            await wait(100);
            
            testInput.value = `
Some random text here
flag{this_is_the_secret_flag}
More text and distractors
another_flag{hidden_in_here}
flag{final_answer}
            `;
            testInput.dispatchEvent(new Event('input', { bubbles: true }));
            await wait(200);
            
            const flagMatches = document.querySelectorAll('mark.highlight');
            if (flagMatches.length >= 2) {
                testResults.functionalityTests.push('✅ CTF flag detection works');
                console.log('✅ Found', flagMatches.length, 'CTF flags');
            } else {
                testResults.issues.push(`❌ CTF flag detection failed: found ${flagMatches.length} flags`);
            }
        }
    }
}

// Scenario 4: Power User Features
async function scenario4_PowerUserFeatures() {
    console.log('\n⚡ SCENARIO 4: Power User Features');
    console.log('-'.repeat(50));
    
    // Test keyboard shortcuts
    console.log('Testing keyboard shortcuts...');
    
    // Test Ctrl+/ for shortcuts
    const shortcutsModal = document.getElementById('shortcuts-modal');
    if (shortcutsModal) {
        // Simulate Ctrl+/
        const ctrlSlash = new KeyboardEvent('keydown', {
            key: '/',
            ctrlKey: true,
            bubbles: true
        });
        document.dispatchEvent(ctrlSlash);
        await wait(100);
        
        if (shortcutsModal.style.display === 'block') {
            testResults.functionalityTests.push('✅ Ctrl+/ opens shortcuts modal');
            console.log('✅ Shortcuts modal opens with Ctrl+/');
            
            // Close it
            shortcutsModal.style.display = 'none';
        } else {
            testResults.issues.push('❌ Ctrl+/ shortcut not working');
        }
    }
    
    // Test F1 for help
    const helpPanel = document.getElementById('help-panel');
    if (helpPanel) {
        const f1Key = new KeyboardEvent('keydown', {
            key: 'F1',
            bubbles: true
        });
        document.dispatchEvent(f1Key);
        await wait(100);
        
        if (helpPanel.classList.contains('open')) {
            testResults.functionalityTests.push('✅ F1 opens help panel');
            console.log('✅ Help panel opens with F1');
            
            // Close it
            helpPanel.classList.remove('open');
        } else {
            testResults.issues.push('❌ F1 help shortcut not working');
        }
    }
    
    // Test export functionality
    console.log('Testing export functionality...');
    const exportButton = document.getElementById('export-pattern');
    if (exportButton) {
        const regexInput = document.getElementById('regex-input');
        regexInput.value = '\\d+';
        
        // Mock export functionality
        try {
            exportButton.click();
            testResults.functionalityTests.push('✅ Export button clickable');
            console.log('✅ Export button responds to clicks');
        } catch (e) {
            testResults.issues.push('❌ Export functionality error: ' + e.message);
        }
    }
    
    // Test share functionality
    const shareButton = document.getElementById('share-pattern');
    if (shareButton) {
        try {
            shareButton.click();
            testResults.functionalityTests.push('✅ Share button clickable');
            console.log('✅ Share button responds to clicks');
        } catch (e) {
            testResults.issues.push('❌ Share functionality error: ' + e.message);
        }
    }
}

// Scenario 5: Mobile/Responsive Experience
async function scenario5_ResponsiveExperience() {
    console.log('\n📱 SCENARIO 5: Responsive/Mobile Experience');
    console.log('-'.repeat(50));
    
    // Check current viewport
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    console.log('Current viewport width:', vw + 'px');
    
    // Check responsive elements
    const sidebar = document.querySelector('.sidebar');
    const sidebarStyles = getComputedStyle(sidebar);
    
    if (vw < 768) {
        if (sidebarStyles.display === 'none') {
            testResults.functionalityTests.push('✅ Sidebar hidden on mobile viewport');
            console.log('✅ Responsive design: sidebar properly hidden');
        } else {
            testResults.issues.push('❌ Sidebar not hidden on mobile');
        }
    } else {
        if (sidebarStyles.display !== 'none') {
            testResults.functionalityTests.push('✅ Sidebar visible on desktop viewport');
            console.log('✅ Sidebar properly visible on desktop');
        } else {
            testResults.issues.push('❌ Sidebar hidden on desktop');
        }
    }
    
    // Check if inputs are properly sized
    const regexInput = document.getElementById('regex-input');
    const testInput = document.getElementById('test-input');
    
    if (regexInput && testInput) {
        const regexWidth = regexInput.offsetWidth;
        const testWidth = testInput.offsetWidth;
        
        if (regexWidth > 200 && testWidth > 200) {
            testResults.functionalityTests.push('✅ Inputs properly sized for interaction');
            console.log('✅ Input fields are appropriately sized');
        } else {
            testResults.issues.push('❌ Input fields too small for comfortable use');
        }
    }
}

// Scenario 6: Error Handling and Edge Cases
async function scenario6_ErrorHandling() {
    console.log('\n🛡️ SCENARIO 6: Error Handling');
    console.log('-'.repeat(50));
    
    const regexInput = document.getElementById('regex-input');
    const errorDiv = document.getElementById('regex-error');
    
    // Test invalid regex
    console.log('Testing invalid regex handling...');
    regexInput.value = '[invalid';
    regexInput.dispatchEvent(new Event('input', { bubbles: true }));
    await wait(200);
    
    if (errorDiv && errorDiv.textContent.length > 0) {
        testResults.functionalityTests.push('✅ Invalid regex shows error message');
        console.log('✅ Error message shown for invalid regex');
    } else {
        testResults.issues.push('❌ No error message for invalid regex');
    }
    
    // Test recovery from error
    regexInput.value = '\\d+';
    regexInput.dispatchEvent(new Event('input', { bubbles: true }));
    await wait(200);
    
    if (!errorDiv.textContent || errorDiv.textContent.length === 0) {
        testResults.functionalityTests.push('✅ Error clears when valid regex entered');
        console.log('✅ Error message clears with valid regex');
    } else {
        testResults.issues.push('❌ Error message persists after fix');
    }
}

// Scenario 7: Performance with Real Data
async function scenario7_RealWorldPerformance() {
    console.log('\n🚀 SCENARIO 7: Real-World Performance');
    console.log('-'.repeat(50));
    
    const regexInput = document.getElementById('regex-input');
    const testInput = document.getElementById('test-input');
    
    // Test with actual log file size data
    const largeLogData = `
[2024-01-15 14:23:45] INFO: Connection from 192.168.1.100
[2024-01-15 14:23:46] WARN: Failed login from 10.0.0.5
[2024-01-15 14:23:47] ERROR: Blocked access from 172.16.0.10
    `.repeat(500); // Simulate large log file
    
    const startTime = performance.now();
    
    regexInput.value = '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b';
    regexInput.dispatchEvent(new Event('input', { bubbles: true }));
    testInput.value = largeLogData;
    testInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    await wait(500);
    
    const endTime = performance.now();
    const processingTime = endTime - startTime;
    
    if (processingTime < 1000) {
        testResults.functionalityTests.push('✅ Good performance with large data');
        console.log('✅ Large data processed in', processingTime.toFixed(0) + 'ms');
    } else if (processingTime < 3000) {
        testResults.recommendations.push('⚠️ Performance acceptable but could be optimized');
        console.log('⚠️ Large data took', processingTime.toFixed(0) + 'ms (acceptable)');
    } else {
        testResults.issues.push('❌ Poor performance with large data: ' + processingTime.toFixed(0) + 'ms');
    }
    
    // Check if highlighting still works
    const matches = document.querySelectorAll('mark.highlight');
    if (matches.length > 1000) {
        testResults.functionalityTests.push('✅ Highlighting works with many matches');
        console.log('✅ Found', matches.length, 'matches in large dataset');
    }
}

// Utility function
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate final user experience report
function generateUserExperienceReport() {
    console.log('\n' + '='.repeat(100));
    console.log('%c🎯 FINAL USER EXPERIENCE REPORT', 'font-size: 24px; color: #00ff41; font-weight: bold');
    console.log('='.repeat(100));
    
    console.log('\n✅ USER SCENARIOS PASSED:');
    testResults.userScenarios.forEach(scenario => console.log('  ' + scenario));
    
    console.log('\n⚡ FUNCTIONALITY TESTS PASSED:');
    testResults.functionalityTests.forEach(test => console.log('  ' + test));
    
    if (testResults.issues.length > 0) {
        console.log('\n❌ ISSUES FOUND:');
        testResults.issues.forEach(issue => console.log('  ' + issue));
    }
    
    if (testResults.recommendations.length > 0) {
        console.log('\n💡 RECOMMENDATIONS:');
        testResults.recommendations.forEach(rec => console.log('  ' + rec));
    }
    
    // Calculate overall score
    const totalTests = testResults.userScenarios.length + testResults.functionalityTests.length;
    const issues = testResults.issues.length;
    const score = totalTests > 0 ? Math.max(0, ((totalTests - issues) / totalTests) * 100) : 0;
    
    console.log('\n📊 OVERALL USER EXPERIENCE SCORE:');
    console.log(`🎯 ${score.toFixed(1)}% (${totalTests - issues}/${totalTests} tests passed)`);
    
    if (score >= 90) {
        console.log('🌟 EXCELLENT: Ready for production use!');
    } else if (score >= 75) {
        console.log('👍 GOOD: Minor issues but fully functional');
    } else if (score >= 60) {
        console.log('⚠️ ACCEPTABLE: Some issues need attention');
    } else {
        console.log('🔧 NEEDS WORK: Major issues affect user experience');
    }
    
    console.log('\n🎬 TESTED SCENARIOS:');
    console.log('  1. ✓ New User First Visit');
    console.log('  2. ✓ Cybersecurity Professional Use');
    console.log('  3. ✓ CTF Competition Use');
    console.log('  4. ✓ Power User Features');
    console.log('  5. ✓ Responsive Experience');
    console.log('  6. ✓ Error Handling');
    console.log('  7. ✓ Real-World Performance');
    
    console.log('\n='.repeat(100));
    console.log('Reality check completed at:', new Date().toLocaleString());
    console.log('='.repeat(100));
    
    return { score, totalTests, issues: issues, recommendations: testResults.recommendations.length };
}

// Run all scenarios
async function runCompleteRealityCheck() {
    await scenario1_NewUserFirstVisit();
    await scenario2_CyberSecurityUse();
    await scenario3_CTFCompetition();
    await scenario4_PowerUserFeatures();
    await scenario5_ResponsiveExperience();
    await scenario6_ErrorHandling();
    await scenario7_RealWorldPerformance();
    
    generateUserExperienceReport();
}

// Start the complete reality check
console.log('Starting complete reality check in 2 seconds...');
setTimeout(runCompleteRealityCheck, 2000);