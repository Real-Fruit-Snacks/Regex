class RegexTester {
    constructor() {
        this.regexInput = document.getElementById('regex-input');
        this.regexFlags = document.getElementById('regex-flags');
        this.testInput = document.getElementById('test-input');
        this.highlightedText = document.getElementById('highlighted-text');
        this.regexError = document.getElementById('regex-error');
        this.matchCount = document.getElementById('match-count');
        this.matchDetails = document.getElementById('match-details');
        this.themeSelect = document.getElementById('theme-select');
        this.regexMode = document.getElementById('regex-mode');
        this.modeInfo = document.getElementById('mode-info');
        this.helpToggle = document.getElementById('help-button');
        this.helpContent = document.getElementById('help-tab-content');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.modalContent = document.getElementById('modal-content');
        this.modalClose = document.getElementById('modal-close');
        this.dropdownSelected = document.getElementById('dropdown-selected');
        this.dropdownOptions = document.getElementById('dropdown-options');
        this.flagsInfo = document.getElementById('flags-info');
        this.themeDropdownSelected = document.getElementById('theme-dropdown-selected');
        this.themeDropdownOptions = document.getElementById('theme-dropdown-options');
        
        // Store event handlers for cleanup
        this.eventHandlers = new Map();
        this.boundHandlers = [];
        
        // Performance optimizations
        this.regexCache = new Map();
        this.lastPattern = '';
        this.lastFlags = '';
        this.lastMode = '';
        this.cachedRegex = null;
        
        // DOM element cache
        this.domCache = new Map();
        
        this.initializeEventListeners();
        this.loadSavedTheme();
        this.loadSavedMode();
        this.initializeHelp();
        this.initializeSyntaxHighlighter();
    }

    initializeEventListeners() {
        this.regexInput.addEventListener('input', () => this.updateMatches());
        this.regexFlags.addEventListener('input', () => this.updateMatches());
        this.testInput.addEventListener('input', () => this.updateMatches());
        this.testInput.addEventListener('scroll', () => this.syncScroll());
        if (this.modeInfo) {
            this.modeInfo.addEventListener('click', () => this.showModeInfo());
        }
        if (this.flagsInfo) {
            this.flagsInfo.addEventListener('click', () => this.showFlagsInfo());
        }
        if (this.helpToggle) {
            this.helpToggle.addEventListener('click', () => this.toggleHelp());
        }
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.closeModal();
            }
        });
        
        // Custom dropdown functionality for regex mode
        this.dropdownSelected.addEventListener('click', () => this.toggleDropdown());
        
        // Handle regex mode dropdown option clicks
        const modeOptions = this.dropdownOptions.querySelectorAll('.dropdown-option');
        modeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                const name = option.querySelector('.option-name').textContent;
                const desc = option.querySelector('.option-desc').textContent;
                
                // Update displayed text
                this.dropdownSelected.querySelector('.selected-text').textContent = `${name} ${desc}`;
                
                // Update hidden input value
                this.regexMode.value = value;
                
                // Close dropdown
                this.closeDropdown();
                
                // Trigger mode change
                this.changeMode(value);
            });
        });
        
        // Custom dropdown functionality for theme
        this.themeDropdownSelected.addEventListener('click', () => this.toggleThemeDropdown());
        
        // Handle theme dropdown option clicks
        const themeOptions = this.themeDropdownOptions.querySelectorAll('.dropdown-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                const name = option.querySelector('.option-name').textContent;
                const desc = option.querySelector('.option-desc').textContent;
                
                // Update displayed text
                this.themeDropdownSelected.querySelector('.selected-text').textContent = `${name} ${desc}`;
                
                // Update hidden input value
                this.themeSelect.value = value;
                
                // Close dropdown
                this.closeThemeDropdown();
                
                // Trigger theme change
                this.changeTheme(value);
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#regex-mode-dropdown')) {
                this.closeDropdown();
            }
            if (!e.target.closest('#theme-dropdown')) {
                this.closeThemeDropdown();
            }
        });
    }

    toggleDropdown() {
        const isOpen = this.dropdownOptions.classList.contains('open');
        if (isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    openDropdown() {
        this.dropdownSelected.classList.add('open');
        this.dropdownOptions.classList.add('open');
    }

    closeDropdown() {
        this.dropdownSelected.classList.remove('open');
        this.dropdownOptions.classList.remove('open');
    }

    toggleThemeDropdown() {
        const isOpen = this.themeDropdownOptions.classList.contains('open');
        if (isOpen) {
            this.closeThemeDropdown();
        } else {
            this.openThemeDropdown();
        }
    }

    openThemeDropdown() {
        this.themeDropdownSelected.classList.add('open');
        this.themeDropdownOptions.classList.add('open');
    }

    closeThemeDropdown() {
        this.themeDropdownSelected.classList.remove('open');
        this.themeDropdownOptions.classList.remove('open');
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('selectedTheme') || 'cyber-pro';
        this.changeTheme(savedTheme);
        
        // Update dropdown to show current theme
        const themeOption = this.themeDropdownOptions.querySelector(`[data-value="${savedTheme}"]`);
        if (themeOption) {
            const name = themeOption.querySelector('.option-name').textContent;
            const desc = themeOption.querySelector('.option-desc').textContent;
            this.themeDropdownSelected.querySelector('.selected-text').textContent = `${name} ${desc}`;
        }
        this.themeSelect.value = savedTheme;
    }

    loadSavedMode() {
        const savedMode = localStorage.getItem('selectedMode') || 'javascript';
        this.changeMode(savedMode);
        
        // Update dropdown to show current mode
        const modeOption = this.dropdownOptions.querySelector(`[data-value="${savedMode}"]`);
        if (modeOption) {
            const name = modeOption.querySelector('.option-name').textContent;
            const desc = modeOption.querySelector('.option-desc').textContent;
            this.dropdownSelected.querySelector('.selected-text').textContent = `${name} ${desc}`;
        }
        this.regexMode.value = savedMode;
    }

    changeTheme(themeName) {
        const themeStylesheet = document.getElementById('theme-stylesheet');
        themeStylesheet.href = `themes/${themeName}.css`;
        localStorage.setItem('selectedTheme', themeName);
    }

    changeMode(mode) {
        localStorage.setItem('selectedMode', mode);
        this.updateFlagsPlaceholder();
        this.updateMatches();
        this.updateHelp();
        
        // Update syntax highlighter mode
        if (this.highlighter) {
            this.highlighter.setMode(mode);
        }
        
        // Update pattern explanation
        if (this.explainer) {
            this.explainer.updateExplanation(this.regexInput.value, mode);
        }
    }

    updateFlagsPlaceholder() {
        const mode = this.regexMode.value;
        const flagInfo = modeFlagInfo[mode];
        if (flagInfo && flagInfo.placeholder) {
            this.regexFlags.placeholder = flagInfo.placeholder;
        }
    }

    // NEW: Pattern transformation system for different regex modes
    transformPattern(pattern, mode) {
        switch (mode) {
            case 'javascript':
                return this.transformJavaScript(pattern);
            case 'pcre':
                return this.transformPCRE(pattern);
            case 'grep':
                return this.transformBRE(pattern);
            case 'egrep':
                return this.transformERE(pattern);
            case 'vim':
                return this.transformVim(pattern);
            case 'python':
                return this.transformPython(pattern);
            case 'sed':
                return this.transformSed(pattern);
            default:
                return { pattern, flags: '', error: null };
        }
    }

    transformJavaScript(pattern) {
        // JavaScript patterns work as-is
        return { pattern, flags: '', error: null };
    }

    transformPCRE(pattern) {
        // PCRE is mostly JavaScript-compatible, but we need to handle inline modifiers
        let transformedPattern = pattern;
        let extractedFlags = '';

        // Handle inline modifiers (?i), (?m), (?s), (?x)
        transformedPattern = transformedPattern.replace(/\(\?([imsx]+)\)/g, (match, flags) => {
            // Add each flag to extractedFlags
            for (let flag of flags) {
                if (!extractedFlags.includes(flag)) {
                    extractedFlags += flag;
                }
            }
            return ''; // Remove the inline modifier from pattern
        });

        // Handle possessive quantifiers - they're not supported in JavaScript
        // Convert them to greedy quantifiers with a warning
        if (transformedPattern.includes('++') || transformedPattern.includes('*+') || transformedPattern.includes('?+')) {
            transformedPattern = transformedPattern.replace(/\+\+/g, '+').replace(/\*\+/g, '*').replace(/\?\+/g, '?');
            return { pattern: transformedPattern, flags: extractedFlags, warning: 'Possessive quantifiers converted to greedy (JavaScript limitation)' };
        }

        // Handle atomic grouping (?>...) - not supported in JavaScript
        if (transformedPattern.includes('(?>')) {
            return { pattern: transformedPattern, flags: extractedFlags, error: 'PCRE atomic grouping (?>...) is not supported in JavaScript. Atomic groups prevent backtracking. Example: (?>a+)b matches "aaab" but (?>a+)ab would not match "aaab".' };
        }

        // Handle \K (reset match start) - not supported in JavaScript
        if (transformedPattern.includes('\\K')) {
            transformedPattern = transformedPattern.replace(/\\K/g, '');
            return { pattern: transformedPattern, flags: extractedFlags, warning: '\\K (reset match start) is not supported in JavaScript and has been removed. \\K resets the start of the match. Example: foo\\Kbar would match only "bar" in "foobar".' };
        }

        // Handle conditional patterns
        if (transformedPattern.includes('(?(')) {
            return { pattern: transformedPattern, flags: extractedFlags, error: 'PCRE conditional patterns (?(condition)yes|no) are not supported in JavaScript. These allow different matching based on conditions.' };
        }

        // Handle recursive patterns
        if (transformedPattern.includes('(?R)') || /\(\?[0-9]+\)/.test(transformedPattern)) {
            return { pattern: transformedPattern, flags: extractedFlags, error: 'PCRE recursive patterns (?R) and subroutine calls (?1) are not supported in JavaScript. These allow patterns to call themselves.' };
        }

        return { pattern: transformedPattern, flags: extractedFlags, error: null };
    }

    transformBRE(pattern) {
        // Basic Regular Expressions (grep) - very limited
        let transformedPattern = pattern;

        // Check for invalid BRE syntax and provide helpful errors
        if (transformedPattern.includes('\\d') || transformedPattern.includes('\\w') || transformedPattern.includes('\\s')) {
            return { pattern, flags: '', error: 'BRE does not support \\d, \\w, \\s shortcuts. Use [0-9], [a-zA-Z_], [ \\t] instead.' };
        }

        if (transformedPattern.includes('(?:') || transformedPattern.includes('(?=') || transformedPattern.includes('(?!')) {
            return { pattern, flags: '', error: 'BRE does not support lookaheads or non-capturing groups.' };
        }

        // Transform BRE syntax to JavaScript equivalent
        // Use completely unique placeholders to avoid conflicts
        transformedPattern = transformedPattern.replace(/\\\(/g, 'XYZGROUPOPENXYZ'); // \( -> unique placeholder
        transformedPattern = transformedPattern.replace(/\\\)/g, 'XYZGROUPCLOSEXYZ'); // \) -> unique placeholder  
        transformedPattern = transformedPattern.replace(/\\\+/g, 'XYZPLUSXYZ'); // \+ -> unique placeholder
        transformedPattern = transformedPattern.replace(/\\\?/g, 'XYZQUESTIONXYZ'); // \? -> unique placeholder
        transformedPattern = transformedPattern.replace(/\\\{/g, 'XYZOPENBRACEXY'); 
        transformedPattern = transformedPattern.replace(/\\\}/g, 'XYZCLOSEBRACEXY');
        transformedPattern = transformedPattern.replace(/\\\|/g, 'XYZALTXYZ'); // \| -> unique placeholder
        
        // Now escape literal characters that should be literal in JavaScript
        transformedPattern = transformedPattern.replace(/([()])/g, '\\$1'); // Escape literal parens
        transformedPattern = transformedPattern.replace(/([+?])/g, '\\$1'); // Escape literal quantifiers  
        transformedPattern = transformedPattern.replace(/\|/g, '\\|'); // Escape literal pipe
        
        // Convert placeholders back to JavaScript special characters
        transformedPattern = transformedPattern.replace(/XYZGROUPOPENXYZ/g, '('); // ( 
        transformedPattern = transformedPattern.replace(/XYZGROUPCLOSEXYZ/g, ')'); // )
        transformedPattern = transformedPattern.replace(/XYZPLUSXYZ/g, '+'); // +
        transformedPattern = transformedPattern.replace(/XYZQUESTIONXYZ/g, '?'); // ?
        transformedPattern = transformedPattern.replace(/XYZOPENBRACEXY/g, '{');
        transformedPattern = transformedPattern.replace(/XYZCLOSEBRACEXY/g, '}');
        transformedPattern = transformedPattern.replace(/XYZALTXYZ/g, '|'); // |

        return { pattern: transformedPattern, flags: '', error: null };
    }

    transformERE(pattern) {
        // Extended Regular Expressions (egrep)
        let transformedPattern = pattern;

        // ERE doesn't support modern shortcuts
        if (transformedPattern.includes('\\d') || transformedPattern.includes('\\w') || transformedPattern.includes('\\s')) {
            return { pattern, flags: '', error: 'ERE does not support \\d, \\w, \\s shortcuts. Use [0-9], [a-zA-Z_], [ \\t] instead.' };
        }

        if (transformedPattern.includes('(?:') || transformedPattern.includes('(?=') || transformedPattern.includes('(?!')) {
            return { pattern, flags: '', error: 'ERE does not support lookaheads or non-capturing groups.' };
        }

        // ERE syntax is closer to JavaScript, but still limited
        return { pattern: transformedPattern, flags: '', error: null };
    }

    transformVim(pattern) {
        let transformedPattern = pattern;
        let flags = '';
        let isVeryMagic = false;
        let isVeryNomagic = false;
        let isNomagic = false;

        // Handle Vim magic modes
        if (transformedPattern.startsWith('\\v')) {
            // Very magic mode - like ERE
            isVeryMagic = true;
            transformedPattern = transformedPattern.substring(2);
        } else if (transformedPattern.startsWith('\\V')) {
            // Very nomagic mode - everything literal except backslash
            isVeryNomagic = true;
            transformedPattern = transformedPattern.substring(2);
            transformedPattern = transformedPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        } else if (transformedPattern.startsWith('\\m')) {
            // Magic mode (default)
            transformedPattern = transformedPattern.substring(2);
        } else if (transformedPattern.startsWith('\\M')) {
            // Nomagic mode - most things are literal
            isNomagic = true;
            transformedPattern = transformedPattern.substring(2);
        }

        // Handle case modifiers (can appear anywhere in pattern)
        if (transformedPattern.includes('\\c')) {
            flags += 'i';
            transformedPattern = transformedPattern.replace(/\\c/g, '');
        }
        if (transformedPattern.includes('\\C')) {
            flags = flags.replace('i', ''); // Remove case-insensitive
            transformedPattern = transformedPattern.replace(/\\C/g, '');
        }

        // Handle Vim-specific lookbehinds with @<= and @<!
        if (transformedPattern.includes('@<=') || transformedPattern.includes('@<!')) {
            return { pattern: transformedPattern, flags, error: 'Vim lookbehinds (@<=, @<!) are not supported in JavaScript' };
        }

        // Handle \zs and \ze (match start/end markers)
        if (transformedPattern.includes('\\zs') || transformedPattern.includes('\\ze')) {
            return { pattern: transformedPattern, flags, error: 'Vim match markers (\\zs, \\ze) are not supported in JavaScript' };
        }

        // Handle lazy quantifiers \{-}
        if (transformedPattern.includes('\\{-')) {
            return { pattern: transformedPattern, flags, error: 'Vim lazy quantifiers (\\{-}) are not supported in JavaScript. Use *?, +?, ?? instead.' };
        }

        // Handle word boundaries
        transformedPattern = transformedPattern.replace(/\\</g, '\\b');
        transformedPattern = transformedPattern.replace(/\\>/g, '\\b');

        // Apply mode-specific transformations
        if (isVeryMagic) {
            // Very magic mode: everything is special except a-zA-Z0-9_
            // Already works like JavaScript regex
        } else if (isVeryNomagic) {
            // Very nomagic: everything literal (already handled above)
        } else if (isNomagic) {
            // Nomagic mode: only ^, $, and \ are special
            // Need to escape most special characters
            transformedPattern = transformedPattern.replace(/[.+*?{}()|[\]]/g, '\\$&');
        } else {
            // Default magic mode transformations
            // Use unique placeholders approach
            transformedPattern = transformedPattern.replace(/\\\(/g, 'VIMGROUPOPENXYZ');
            transformedPattern = transformedPattern.replace(/\\\)/g, 'VIMGROUPCLOSEXYZ');
            transformedPattern = transformedPattern.replace(/\\\+/g, 'VIMPLUSXYZ');
            transformedPattern = transformedPattern.replace(/\\\?/g, 'VIMQUESTIONXYZ');
            transformedPattern = transformedPattern.replace(/\\\|/g, 'VIMALTXYZ');
            transformedPattern = transformedPattern.replace(/\\\{/g, 'VIMBRACEOPEN');
            transformedPattern = transformedPattern.replace(/\\\}/g, 'VIMBRACECLOSE');
            
            // Escape literals
            transformedPattern = transformedPattern.replace(/([()])/g, '\\$1');
            transformedPattern = transformedPattern.replace(/([+?|])/g, '\\$1');
            
            // Convert placeholders back
            transformedPattern = transformedPattern.replace(/VIMGROUPOPENXYZ/g, '(');
            transformedPattern = transformedPattern.replace(/VIMGROUPCLOSEXYZ/g, ')');
            transformedPattern = transformedPattern.replace(/VIMPLUSXYZ/g, '+');
            transformedPattern = transformedPattern.replace(/VIMQUESTIONXYZ/g, '?');
            transformedPattern = transformedPattern.replace(/VIMALTXYZ/g, '|');
            transformedPattern = transformedPattern.replace(/VIMBRACEOPEN/g, '{');
            transformedPattern = transformedPattern.replace(/VIMBRACECLOSE/g, '}');
        }

        return { pattern: transformedPattern, flags, error: null };
    }

    transformPython(pattern) {
        let transformedPattern = pattern;
        let warnings = [];
        let extractedFlags = '';

        // Handle inline modifiers - extract them like PCRE
        transformedPattern = transformedPattern.replace(/\(\?([imsx]+)\)/g, (match, flags) => {
            warnings.push('Python does not support inline modifiers like (?i). Use re.IGNORECASE, re.MULTILINE, re.DOTALL, or re.VERBOSE as function arguments instead.');
            // Extract flags for JavaScript
            for (let flag of flags) {
                if (!extractedFlags.includes(flag)) {
                    extractedFlags += flag;
                }
            }
            return ''; // Remove the inline modifier
        });

        // Python named groups use (?P<name>) syntax
        // Transform to JavaScript (?<name>) syntax
        transformedPattern = transformedPattern.replace(/\(\?P<([^>]+)>/g, '(?<$1>');

        // Python named backreferences use (?P=name) syntax
        // Transform to JavaScript \k<name> syntax
        transformedPattern = transformedPattern.replace(/\(\?P=([^)]+)\)/g, '\\k<$1>');

        // Check for Python-specific syntax that won't work
        if (transformedPattern.includes('(?#')) {
            warnings.push('Python comments (?#...) are not supported in JavaScript.');
            // Remove comments
            transformedPattern = transformedPattern.replace(/\(\?#[^)]*\)/g, '');
        }

        if (warnings.length > 0) {
            return { pattern: transformedPattern, flags: extractedFlags, warning: warnings.join(' ') };
        }

        return { pattern: transformedPattern, flags: extractedFlags, error: null };
    }

    transformSed(pattern) {
        // sed uses BRE syntax like grep
        return this.transformBRE(pattern);
    }

    // NEW: Mode-specific flag validation and transformation
    validateAndTransformFlags(flags, mode) {
        switch (mode) {
            case 'javascript':
                return this.validateJavaScriptFlags(flags);
            case 'pcre':
                return this.validatePCREFlags(flags);
            case 'grep':
            case 'egrep':
            case 'sed':
                return this.validateBREFlags(flags);
            case 'vim':
                return this.validateVimFlags(flags);
            case 'python':
                return this.validatePythonFlags(flags);
            default:
                return { flags: '', error: null };
        }
    }

    validateJavaScriptFlags(flags) {
        const validFlags = 'gimsuyv';
        const invalidFlags = flags.split('').filter(f => !validFlags.includes(f));
        if (invalidFlags.length > 0) {
            return { flags: '', error: `Invalid JavaScript flags: ${invalidFlags.join(', ')}. Valid flags are: g (global), i (ignoreCase), m (multiline), s (dotAll), u (unicode), y (sticky), v (unicodeSets)` };
        }
        return { flags, error: null };
    }

    validatePCREFlags(flags) {
        const validFlags = 'gimsx';
        const invalidFlags = flags.split('').filter(f => !validFlags.includes(f));
        if (invalidFlags.length > 0) {
            return { flags: '', error: `Invalid PCRE flags: ${invalidFlags.join(', ')}` };
        }
        return { flags, error: null };
    }

    validateBREFlags(flags) {
        // BRE tools don't use inline flags in the same way
        if (flags === 'g') {
            return { flags: 'g', error: null }; // Allow 'g' for global matching simulation
        }
        if (flags && flags !== 'g') {
            return { flags: '', error: 'BRE tools use command-line options, not inline flags. Use g for global matching.' };
        }
        return { flags: '', error: null };
    }

    validateVimFlags(flags) {
        // Vim doesn't use traditional flags, but allow 'g' for global matching simulation
        if (flags === 'g') {
            return { flags: 'g', error: null };
        }
        if (flags && flags !== 'g') {
            return { flags: '', error: 'Vim uses inline modifiers (\\c, \\C, \\v, \\V) in the pattern, not flags.' };
        }
        return { flags: '', error: null };
    }

    validatePythonFlags(flags) {
        if (flags === 'g' || flags.includes('g')) {
            // Allow g for simulation, but explain Python doesn't work this way
            return { flags: flags, warning: 'Python uses findall() or finditer() for multiple matches, not a g flag.' };
        }
        const validFlags = 'imsx';
        const invalidFlags = flags.split('').filter(f => !validFlags.includes(f));
        if (invalidFlags.length > 0) {
            return { flags: '', error: `Python uses re.I, re.M, re.S, re.X constants, not inline flags like: ${invalidFlags.join(', ')}` };
        }
        return { flags, warning: 'Python uses re.I, re.M, re.S, re.X constants instead of inline flags.' };
    }

    initializeHelp() {
        this.updateHelp();
    }
    
    initializeSyntaxHighlighter() {
        // Initialize the pattern syntax highlighter
        this.highlighter = new PatternHighlighter(this.regexInput, this.regexMode.value);
        
        // Initialize the pattern explainer
        this.explainer = new PatternExplainer();
        this.explainer.init('pattern-explanation-container', () => this.regexMode.value);
        
        // Initialize enhanced tooltips
        this.tooltips = new EnhancedTooltips();
        this.tooltips.init();
        
        // Initialize replacement preview
        this.replacementPreview = new ReplacementPreview();
        this.replacementPreview.init('replacement-section-container');
        
        // Pattern library is now initialized separately as EnhancedPatternLibrary
    }

    updateHelp() {
        const mode = this.regexMode.value;
        const helpContent = modeHelpContent[mode];
        
        if (!helpContent) return;

        // Update mode notice
        const modeNotice = document.getElementById('mode-notice');
        if (modeNotice) {
            const modeNames = {
                javascript: 'JavaScript (ECMAScript)',
                pcre: 'PCRE (Perl Compatible)',
                grep: 'grep (Basic Regular Expressions)',
                egrep: 'egrep (Extended Regular Expressions)',
                vim: 'Vim/Vi Editor',
                python: 'Python re module',
                sed: 'sed Stream Editor'
            };
            modeNotice.textContent = `Help content for ${modeNames[mode]} regex mode`;
        }

        // Generate tabs
        this.generateHelpTabs(helpContent);
        
        // Show first tab by default
        this.showHelpTab('basics');
    }

    generateHelpTabs(helpContent) {
        const tabsContainer = document.getElementById('help-tabs');
        tabsContainer.innerHTML = '';

        Object.keys(helpContent).forEach(sectionKey => {
            const section = helpContent[sectionKey];
            const tab = document.createElement('button');
            tab.className = 'help-tab';
            tab.textContent = section.title;
            tab.addEventListener('click', () => this.showHelpTab(sectionKey));
            tabsContainer.appendChild(tab);
        });
    }

    showHelpTab(sectionKey) {
        const mode = this.regexMode.value;
        const helpContent = modeHelpContent[mode];
        
        // Update active tab
        document.querySelectorAll('.help-tab').forEach(tab => tab.classList.remove('active'));
        const activeTab = Array.from(document.querySelectorAll('.help-tab')).find(tab => 
            tab.textContent === helpContent[sectionKey].title
        );
        if (activeTab) activeTab.classList.add('active');

        // Generate content
        const contentContainer = document.getElementById('help-tab-content');
        
        if (sectionKey === 'examples' && commonPatterns[mode]) {
            this.generateCommonPatternsContent(contentContainer, mode);
        } else if (sectionKey === 'warnings' && commonPitfalls[mode]) {
            this.generatePitfallsContent(contentContainer, mode);
        } else if (sectionKey === 'reference') {
            this.generateQuickReferenceContent(contentContainer, mode);
        } else {
            this.generateRegularHelpContent(contentContainer, helpContent[sectionKey]);
        }
    }

    generateRegularHelpContent(container, section) {
        container.innerHTML = '';
        
        section.items.forEach(item => {
            const helpItem = document.createElement('div');
            helpItem.className = 'help-item';
            
            helpItem.innerHTML = `
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <div class="example">
                    <strong>Pattern:</strong> <code>${item.pattern}</code><br>
                    <strong>Text:</strong> "${item.text}"<br>
                    ${item.flags ? `<strong>Flags:</strong> ${item.flags}<br>` : ''}
                    <strong>Result:</strong> ${item.explanation}
                    <button class="try-it" onclick="regexTester.tryExample('${item.pattern}', '${item.text}', '${item.flags || ''}')">Try It</button>
                </div>
            `;
            
            container.appendChild(helpItem);
        });
    }

    generateQuickReferenceContent(container, mode) {
        container.innerHTML = '<div class="reference-section"><h4>Quick Reference</h4>';
        
        const patterns = quickReference[mode] || [];
        const table = document.createElement('table');
        table.className = 'reference-table';
        
        patterns.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="pattern-cell"><code>${item.pattern}</code></td>
                <td class="desc-cell">${item.desc}</td>
            `;
            table.appendChild(row);
        });
        
        container.appendChild(table);
        container.innerHTML += '</div>';
    }

    generateCommonPatternsContent(container, mode) {
        container.innerHTML = '<div class="reference-section"><h4>Common Patterns</h4>';
        
        const patterns = commonPatterns[mode] || [];
        const table = document.createElement('table');
        table.className = 'reference-table';
        
        patterns.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="pattern-cell"><code>${item.pattern}</code></td>
                <td class="desc-cell">${item.desc}</td>
            `;
            table.appendChild(row);
        });
        
        container.appendChild(table);
        container.innerHTML += '</div>';
    }

    generatePitfallsContent(container, mode) {
        container.innerHTML = '';
        
        const pitfalls = commonPitfalls[mode] || [];
        
        pitfalls.forEach(pitfall => {
            const pitfallItem = document.createElement('div');
            pitfallItem.className = 'pitfall-item';
            
            pitfallItem.innerHTML = `
                <h5>${pitfall.title}</h5>
                <div class="pitfall-example">${pitfall.problem}</div>
                <div class="pitfall-comparison">
                    <div class="pitfall-bad">
                        <span class="label">❌ Problematic:</span>
                        <code>${pitfall.bad}</code>
                    </div>
                    <div class="pitfall-good">
                        <span class="label">✅ Better:</span>
                        <code>${pitfall.good}</code>
                    </div>
                </div>
                <div class="pitfall-explanation">${pitfall.explanation}</div>
            `;
            
            container.appendChild(pitfallItem);
        });
    }

    tryExample(pattern, text, flags) {
        this.regexInput.value = pattern;
        this.regexFlags.value = flags;
        this.testInput.value = text;
        this.updateMatches();
        
        // Scroll to regex input
        this.regexInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    toggleHelp() {
        // Toggle the help panel (new sliding panel)
        const helpPanel = document.getElementById('help-panel');
        if (helpPanel) {
            helpPanel.classList.toggle('open');
        }
    }

    showModeInfo() {
        const mode = this.regexMode.value;
        const modeInfo = this.getModeInfo(mode);
        
        document.getElementById('modal-title').textContent = `${modeInfo.name} Information`;
        this.modalContent.innerHTML = modeInfo.content;
        this.modalOverlay.style.display = 'flex';
    }

    getModeInfo(mode) {
        const modeInfoContent = {
            javascript: {
                name: 'JavaScript (ECMAScript)',
                content: `
                    <h4>JavaScript Regular Expressions</h4>
                    <p>JavaScript uses ECMAScript regex standard with the following features:</p>
                    <ul>
                        <li>Unicode support with 'u' flag</li>
                        <li>Sticky matching with 'y' flag</li>
                        <li>Named capture groups</li>
                        <li>Lookbehind assertions (limited browser support)</li>
                    </ul>
                    <h4>Common Methods</h4>
                    <ul>
                        <li><code>string.match(regex)</code> - Find matches</li>
                        <li><code>regex.test(string)</code> - Test for match</li>
                        <li><code>string.replace(regex, replacement)</code> - Replace matches</li>
                    </ul>
                `
            },
            pcre: {
                name: 'PCRE (Perl Compatible)',
                content: `
                    <h4>Perl Compatible Regular Expressions</h4>
                    <p>PCRE is widely used and supports advanced features:</p>
                    <ul>
                        <li>Lookbehind assertions</li>
                        <li>Possessive quantifiers (++, *+, ?+)</li>
                        <li>Recursive patterns</li>
                        <li>Conditional expressions</li>
                    </ul>
                    <h4>Inline Modifiers</h4>
                    <ul>
                        <li><code>(?i)</code> - Case insensitive</li>
                        <li><code>(?m)</code> - Multiline mode</li>
                        <li><code>(?s)</code> - Dot matches newline</li>
                        <li><code>(?x)</code> - Extended (ignore whitespace)</li>
                    </ul>
                    <p><strong>Note:</strong> This simulation cannot fully replicate all PCRE features in JavaScript.</p>
                `
            },
            grep: {
                name: 'grep (Basic Regular Expressions)',
                content: `
                    <h4>grep - Basic Regular Expressions (BRE)</h4>
                    <p>Traditional Unix grep uses Basic Regular Expressions with limited syntax:</p>
                    <ul>
                        <li>Literal characters: most characters match themselves</li>
                        <li>Groups: \\( \\) (parentheses must be escaped)</li>
                        <li>Quantifiers: * (zero or more), \\+ (one or more, escaped), \\? (zero or one, escaped)</li>
                        <li>Character classes: [abc], [^abc], [a-z]</li>
                        <li>Anchors: ^ (start), $ (end)</li>
                        <li>No shortcuts: No \\d, \\w, \\s - use [0-9], [a-zA-Z_], [ \\t]</li>
                    </ul>
                    <h4>Important BRE Rules</h4>
                    <ul>
                        <li>( ) are literal characters</li>
                        <li>+ ? | { } are literal characters</li>
                        <li>Use \\ to make them special: \\( \\) \\+ \\? \\| \\{ \\}</li>
                    </ul>
                `
            },
            egrep: {
                name: 'egrep (Extended Regular Expressions)',
                content: `
                    <h4>egrep - Extended Regular Expressions (ERE)</h4>
                    <p>Extended grep with more intuitive syntax than BRE:</p>
                    <ul>
                        <li>Groups: ( ) (no escaping needed)</li>
                        <li>Quantifiers: * + ? {n,m} (no escaping needed)</li>
                        <li>Alternation: | (no escaping needed)</li>
                        <li>Character classes: [abc], [^abc], [a-z]</li>
                        <li>Anchors: ^ (start), $ (end)</li>
                        <li>No modern shortcuts: No \\d, \\w, \\s</li>
                    </ul>
                    <h4>Equivalent Commands</h4>
                    <ul>
                        <li><code>egrep 'pattern'</code> = <code>grep -E 'pattern'</code></li>
                        <li>More powerful than basic grep</li>
                        <li>Less powerful than PCRE</li>
                    </ul>
                `
            },
            vim: {
                name: 'Vim/Vi Editor',
                content: `
                    <h4>Vim Regular Expressions</h4>
                    <p>Vim has unique regex syntax with magic modes:</p>
                    <ul>
                        <li><strong>\\v (very magic)</strong>: ERE-like syntax - (, ), +, ?, |, {, } work without escaping</li>
                        <li><strong>\\m (magic)</strong>: Default mode - some chars need escaping</li>
                        <li><strong>\\M (nomagic)</strong>: Only ^ $ . * are special</li>
                        <li><strong>\\V (very nomagic)</strong>: Only \\ is special, everything else literal</li>
                    </ul>
                    <h4>Vim-Specific Features</h4>
                    <ul>
                        <li><code>\\c</code> - Force case insensitive (can appear anywhere)</li>
                        <li><code>\\C</code> - Force case sensitive (can appear anywhere)</li>
                        <li><code>\\{-}</code> - Lazy quantifier (non-greedy *)</li>
                        <li><code>\\%l</code> - Match at specific line number</li>
                    </ul>
                `
            },
            python: {
                name: 'Python re module',
                content: `
                    <h4>Python Regular Expressions</h4>
                    <p>Python's re module provides comprehensive regex support:</p>
                    <ul>
                        <li>Full Unicode support by default</li>
                        <li>Named groups: (?P&lt;name&gt;...)</li>
                        <li>Multiple matching methods</li>
                        <li>Compiled regex objects for performance</li>
                    </ul>
                    <h4>Common re Module Functions</h4>
                    <ul>
                        <li><code>re.search(pattern, string)</code> - Find first match</li>
                        <li><code>re.findall(pattern, string)</code> - Find all matches</li>
                        <li><code>re.finditer(pattern, string)</code> - Iterator over matches</li>
                        <li><code>re.sub(pattern, repl, string)</code> - Replace matches</li>
                    </ul>
                    <h4>Flags (used as function arguments)</h4>
                    <ul>
                        <li><code>re.I</code> or <code>re.IGNORECASE</code> - Case insensitive</li>
                        <li><code>re.M</code> or <code>re.MULTILINE</code> - ^ and $ match line boundaries</li>
                        <li><code>re.S</code> or <code>re.DOTALL</code> - . matches newlines</li>
                        <li><code>re.X</code> or <code>re.VERBOSE</code> - Ignore whitespace and comments</li>
                    </ul>
                `
            },
            sed: {
                name: 'sed Stream Editor',
                content: `
                    <h4>sed - Stream Editor</h4>
                    <p>sed processes text streams using BRE by default, with focus on substitution:</p>
                    <ul>
                        <li>Uses BRE syntax (like grep)</li>
                        <li>Primarily for substitution: s/pattern/replacement/flags</li>
                        <li>Line-based processing</li>
                        <li>Can use ERE with -E flag (GNU sed)</li>
                    </ul>
                    <h4>Common sed Operations</h4>
                    <ul>
                        <li><code>s/pattern/replacement/</code> - Substitute first match on each line</li>
                        <li><code>s/pattern/replacement/g</code> - Global substitution (all matches)</li>
                        <li><code>s/pattern/replacement/I</code> - Case-insensitive (GNU sed)</li>
                        <li><code>/pattern/d</code> - Delete matching lines</li>
                    </ul>
                    <h4>Backreferences</h4>
                    <ul>
                        <li>Groups: \\( ... \\) (escaped parentheses)</li>
                        <li>References: \\1, \\2, etc. in replacement</li>
                    </ul>
                `
            }
        };
        
        return modeInfoContent[mode] || { name: 'Unknown', content: 'No information available.' };
    }

    showFlagsInfo() {
        const mode = this.regexMode.value;
        const flagInfo = modeFlagInfo[mode];
        
        document.getElementById('modal-title').textContent = `${mode.toUpperCase()} Flags Information`;
        
        let content = '';
        
        if (flagInfo.flags) {
            content += '<h4>Available Flags</h4>';
            Object.entries(flagInfo.flags).forEach(([flag, info]) => {
                content += `<div class="flag-note"><strong>${flag}</strong> - ${info.name}<br>${info.desc}</div>`;
            });
        }
        
        if (flagInfo.note) {
            content += '<h4>Usage Notes</h4>';
            content += `<div class="flag-note">${flagInfo.note.replace(/\n/g, '<br>')}</div>`;
        }
        
        if (flagInfo.example) {
            content += '<h4>Example</h4>';
            content += `<div class="flag-note"><code>${flagInfo.example}</code></div>`;
        }
        
        this.modalContent.innerHTML = content;
        this.modalOverlay.style.display = 'flex';
    }

    closeModal() {
        this.modalOverlay.style.display = 'none';
    }

    // COMPLETELY REWRITTEN: Mode-aware pattern matching
    updateMatches() {
        const originalPattern = this.regexInput.value;
        const originalFlags = this.regexFlags.value;
        const text = this.testInput.value;
        const mode = this.regexMode.value;
        
        this.regexError.textContent = '';
        this.regexError.className = 'error-message';
        
        // Update pattern explanation
        if (this.explainer) {
            this.explainer.updateExplanation(originalPattern, mode);
        }
        
        // Update replacement preview
        if (this.replacementPreview) {
            this.replacementPreview.updatePreview(text, originalPattern, originalFlags, mode);
        }
        
        if (!originalPattern) {
            this.highlightedText.innerHTML = this.escapeHtml(text);
            this.matchCount.textContent = 'No pattern entered';
            this.matchDetails.innerHTML = '';
            return;
        }
        
        try {
            // Validate pattern for security
            if (!this.validateRegexPattern(originalPattern)) {
                this.regexError.textContent = 'Pattern contains potentially unsafe content';
                this.regexError.className = 'error-message';
                this.highlightedText.innerHTML = this.escapeHtml(text);
                this.matchCount.textContent = 'Invalid pattern';
                this.matchDetails.innerHTML = '';
                return;
            }

            // Transform pattern based on regex mode
            const patternResult = this.transformPattern(originalPattern, mode);
            if (patternResult.error) {
                this.regexError.textContent = `Pattern Error: ${patternResult.error}`;
                this.regexError.className = 'error-message';
                this.highlightedText.innerHTML = this.escapeHtml(text);
                this.matchCount.textContent = 'Invalid pattern for this mode';
                this.matchDetails.innerHTML = '';
                return;
            }

            // Validate and transform flags
            const flagsResult = this.validateAndTransformFlags(originalFlags, mode);
            if (flagsResult.error) {
                this.regexError.textContent = `Flags Error: ${flagsResult.error}`;
                this.regexError.className = 'error-message';
                this.highlightedText.innerHTML = this.escapeHtml(text);
                this.matchCount.textContent = 'Invalid flags for this mode';
                this.matchDetails.innerHTML = '';
                return;
            }

            // Show warnings if any
            if (patternResult.warning || flagsResult.warning) {
                const warnings = [patternResult.warning, flagsResult.warning].filter(Boolean);
                this.regexError.textContent = `Warning: ${warnings.join(' ')}`;
                this.regexError.className = 'error-message info';
            }

            // Use transformed pattern and flags
            const finalPattern = patternResult.pattern;
            // Combine flags from both pattern transformation and flag validation
            const patternFlags = patternResult.flags || '';
            const validatedFlags = flagsResult.flags || '';
            // Merge flags, avoiding duplicates
            const combinedFlags = [...new Set((patternFlags + validatedFlags).split(''))].join('');
            const finalFlags = combinedFlags;

            // Create regex with caching for performance
            const regex = this.getCachedRegex(finalPattern, finalFlags, mode);
            const matches = [];
            let match;
            
            if (finalFlags.includes('g')) {
                let iterationCount = 0;
                const maxIterations = 10000; // Safety limit
                
                while ((match = regex.exec(text)) !== null) {
                    // Safety check to prevent infinite loops
                    if (++iterationCount > maxIterations) {
                        this.showError('Pattern matching stopped: too many matches (limit: ' + maxIterations + ')');
                        break;
                    }
                    
                    matches.push({
                        match: match[0],
                        index: match.index,
                        groups: match.slice(1),
                        fullMatch: match
                    });
                    
                    // Robust protection against zero-width matches
                    if (match.index === regex.lastIndex) {
                        if (regex.lastIndex >= text.length) {
                            break; // End of string reached
                        }
                        regex.lastIndex++;
                    }
                    
                    // Additional safety: if lastIndex doesn't advance, break
                    const currentLastIndex = regex.lastIndex;
                    if (currentLastIndex <= match.index) {
                        regex.lastIndex = match.index + 1;
                        if (regex.lastIndex >= text.length) {
                            break;
                        }
                    }
                }
            } else {
                match = regex.exec(text);
                if (match) {
                    matches.push({
                        match: match[0],
                        index: match.index,
                        groups: match.slice(1),
                        fullMatch: match
                    });
                }
            }
            
            this.displayMatches(matches, text);
            this.displayMatchDetails(matches, mode);
            
        } catch (error) {
            this.handleError(error, 'regex-matching', 'Failed to process regular expression');
        }
    }

    displayMatches(matches, text) {
        return this.safeExecute(() => {
            if (matches.length === 0) {
                this.highlightedText.innerHTML = this.escapeHtml(text);
                this.matchCount.textContent = 'No matches found';
                return;
            }
        
            this.matchCount.textContent = `${matches.length} match${matches.length === 1 ? '' : 'es'} found`;
            
            let highlightedText = '';
            let lastIndex = 0;
            
            matches.forEach(match => {
                highlightedText += this.escapeHtml(text.slice(lastIndex, match.index));
                highlightedText += `<mark class="highlight">${this.escapeHtml(match.match)}</mark>`;
                lastIndex = match.index + match.match.length;
            });
            
            highlightedText += this.escapeHtml(text.slice(lastIndex));
            this.highlightedText.innerHTML = highlightedText;
        }, 'display-matches');
    }

    displayMatchDetails(matches, mode) {
        if (matches.length === 0) {
            this.matchDetails.innerHTML = '';
            return;
        }
        
        let detailsHtml = '<div class="match-list">';
        
        matches.forEach((match, index) => {
            detailsHtml += `
                <div class="match-item">
                    <div class="match-header">Match ${index + 1} (${mode} mode)</div>
                    <div class="match-content">${this.escapeHtml(match.match)}</div>
                    <div class="match-position">Position: ${match.index}-${match.index + match.match.length}</div>
            `;
            
            if (match.groups.length > 0) {
                detailsHtml += '<div class="match-groups">';
                match.groups.forEach((group, groupIndex) => {
                    if (group !== undefined) {
                        detailsHtml += `<div class="group">Group ${groupIndex + 1}: ${this.escapeHtml(group)}</div>`;
                    }
                });
                detailsHtml += '</div>';
            }
            
            detailsHtml += '</div>';
        });
        
        detailsHtml += '</div>';
        this.matchDetails.innerHTML = detailsHtml;
    }

    escapeHtml(text) {
        if (typeof text !== 'string') {
            text = String(text);
        }
        
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Enhanced sanitization for user inputs
    sanitizeInput(input) {
        if (typeof input !== 'string') {
            input = String(input);
        }
        
        // Remove any HTML tags completely
        const stripHtml = input.replace(/<[^>]*>/g, '');
        
        // Escape remaining special characters
        return this.escapeHtml(stripHtml);
    }

    // Validate regex pattern for safety
    validateRegexPattern(pattern) {
        if (typeof pattern !== 'string') {
            return false;
        }
        
        // Check for potentially dangerous patterns
        const dangerousPatterns = [
            /javascript:/i,
            /<script/i,
            /on\w+=/i,
            /eval\(/i,
            /document\./i,
            /window\./i
        ];
        
        for (const dangerous of dangerousPatterns) {
            if (dangerous.test(pattern)) {
                return false;
            }
        }
        
        // Check for excessive complexity (potential ReDoS)
        const complexityIndicators = [
            /(\*\+|\+\*)/,  // Catastrophic backtracking patterns
            /(\*\{|\+\{)/,  // Nested quantifiers
            /(.*){.*}/      // Complex alternation with quantifiers
        ];
        
        for (const indicator of complexityIndicators) {
            if (indicator.test(pattern)) {
                this.showError('Pattern may be too complex and could cause performance issues');
                return false;
            }
        }
        
        return true;
    }

    // Performance optimization: cached regex compilation
    getCachedRegex(pattern, flags, mode) {
        const cacheKey = `${pattern}|${flags}|${mode}`;
        
        // Check if we have a cached version
        if (this.regexCache.has(cacheKey)) {
            const cached = this.regexCache.get(cacheKey);
            // Create a new RegExp from the cached one to reset lastIndex
            return new RegExp(cached.source, cached.flags);
        }
        
        try {
            const regex = new RegExp(pattern, flags);
            
            // Cache the regex (limit cache size to prevent memory issues)
            if (this.regexCache.size >= 100) {
                // Remove oldest entries (simple LRU-like behavior)
                const firstKey = this.regexCache.keys().next().value;
                this.regexCache.delete(firstKey);
            }
            
            this.regexCache.set(cacheKey, {
                source: regex.source,
                flags: regex.flags,
                timestamp: Date.now()
            });
            
            return regex;
        } catch (error) {
            // Don't cache invalid regexes
            throw error;
        }
    }

    // Clear regex cache
    clearRegexCache() {
        this.regexCache.clear();
    }

    // DOM element caching for performance
    getCachedElement(selector) {
        if (this.domCache.has(selector)) {
            const cached = this.domCache.get(selector);
            // Verify element is still in DOM
            if (cached && document.contains(cached)) {
                return cached;
            } else {
                this.domCache.delete(selector);
            }
        }
        
        const element = document.querySelector(selector);
        if (element) {
            this.domCache.set(selector, element);
        }
        return element;
    }

    getCachedElementById(id) {
        const selector = `#${id}`;
        if (this.domCache.has(selector)) {
            const cached = this.domCache.get(selector);
            // Verify element is still in DOM
            if (cached && document.contains(cached)) {
                return cached;
            } else {
                this.domCache.delete(selector);
            }
        }
        
        const element = document.getElementById(id);
        if (element) {
            this.domCache.set(selector, element);
        }
        return element;
    }

    // Clear DOM cache
    clearDOMCache() {
        this.domCache.clear();
    }

    // Helper method to track event listeners for cleanup
    addEventListenerTracked(element, event, handler) {
        if (!element) return;
        
        element.addEventListener(event, handler);
        
        // Store for cleanup
        const key = `${element.constructor.name}_${event}`;
        if (!this.eventHandlers.has(key)) {
            this.eventHandlers.set(key, []);
        }
        this.eventHandlers.get(key).push({ element, event, handler });
    }

    // Cleanup method to remove all event listeners
    cleanup() {
        this.eventHandlers.forEach((handlers, key) => {
            handlers.forEach(({ element, event, handler }) => {
                try {
                    element.removeEventListener(event, handler);
                } catch (e) {
                    console.warn('Failed to remove event listener:', e);
                }
            });
        });
        
        this.eventHandlers.clear();
        if (this.boundMethods) {
            this.boundMethods = null;
        }
        
        // Clear caches
        this.clearRegexCache();
        this.clearDOMCache();
    }

    // Enhanced error handling with recovery
    handleError(error, context = 'Unknown', userFriendlyMessage = null) {
        console.error(`RegexPro Error in ${context}:`, error);
        
        // Log to a global error array for debugging
        if (!window.regexProErrors) {
            window.regexProErrors = [];
        }
        window.regexProErrors.push({
            error: error.message || error,
            context,
            timestamp: new Date().toISOString(),
            stack: error.stack
        });
        
        // Show user-friendly message
        const message = userFriendlyMessage || this.getErrorMessage(error, context);
        this.showError(message);
        
        // Attempt recovery based on error type
        this.attemptErrorRecovery(error, context);
    }

    getErrorMessage(error, context) {
        const errorType = error.name || 'Error';
        
        switch (errorType) {
            case 'SyntaxError':
                if (context.includes('regex')) {
                    return 'Invalid regular expression pattern. Please check your syntax.';
                }
                return 'Invalid syntax detected. Please review your input.';
                
            case 'TypeError':
                return 'An unexpected error occurred. The application will attempt to recover.';
                
            case 'RangeError':
                if (error.message.includes('quantifier')) {
                    return 'Regular expression is too complex. Please simplify your pattern.';
                }
                return 'Value is out of acceptable range.';
                
            default:
                return 'An error occurred while processing your request.';
        }
    }

    attemptErrorRecovery(error, context) {
        try {
            if (context.includes('regex')) {
                // Clear regex inputs and caches
                this.regexInput.value = '';
                this.clearRegexCache();
                this.highlightedText.innerHTML = this.escapeHtml(this.testInput.value);
                this.matchCount.textContent = 'No pattern';
                this.matchDetails.innerHTML = '';
            }
            
            if (context.includes('theme')) {
                // Reset to default theme
                this.changeTheme('cyber-pro');
            }
            
            if (context.includes('mode')) {
                // Reset to JavaScript mode
                this.changeMode('javascript');
            }
            
            // Clear any lingering error states
            setTimeout(() => {
                if (this.regexError.textContent) {
                    this.regexError.textContent = '';
                    this.regexError.className = '';
                }
            }, 5000);
            
        } catch (recoveryError) {
            console.error('Error recovery failed:', recoveryError);
        }
    }

    // Wrapper for safe DOM operations
    safeExecute(operation, context, fallback = null) {
        try {
            return operation();
        } catch (error) {
            this.handleError(error, context);
            return fallback;
        }
    }

    syncScroll() {
        this.highlightedText.scrollTop = this.testInput.scrollTop;
        this.highlightedText.scrollLeft = this.testInput.scrollLeft;
    }
}

// Global cleanup function
window.cleanupRegexPro = function() {
    if (regexTester && typeof regexTester.cleanup === 'function') {
        regexTester.cleanup();
    }
    if (enhancedPatternLibrary && typeof enhancedPatternLibrary.cleanup === 'function') {
        enhancedPatternLibrary.cleanup();
    }
    if (keyboardShortcuts && typeof keyboardShortcuts.cleanup === 'function') {
        keyboardShortcuts.cleanup();
    }
    console.log('RegexPro cleanup completed');
};

// Initialize the application
const regexTester = new RegexTester();
window.regexTester = regexTester;

// Enhanced module initialization with proper error handling
let enhancedPatternLibrary;
let keyboardShortcuts;

function initializeModules() {
    const maxRetries = 10;
    const retryDelay = 100; // ms
    let retryCount = 0;

    function attemptInitialization() {
        retryCount++;
        let modulesInitialized = 0;
        let totalModules = 2;

        // Initialize enhanced pattern library
        if (typeof EnhancedPatternLibrary !== 'undefined') {
            try {
                if (!enhancedPatternLibrary) {
                    enhancedPatternLibrary = new EnhancedPatternLibrary(regexTester);
                    window.enhancedPatternLibrary = enhancedPatternLibrary;
                    console.log('✅ EnhancedPatternLibrary initialized successfully');
                }
                modulesInitialized++;
            } catch (error) {
                console.warn('Failed to initialize EnhancedPatternLibrary:', error);
            }
        } else if (retryCount < maxRetries) {
            console.log(`Waiting for EnhancedPatternLibrary... (attempt ${retryCount})`);
        }

        // Initialize keyboard shortcuts
        if (typeof KeyboardShortcuts !== 'undefined') {
            try {
                if (!keyboardShortcuts) {
                    keyboardShortcuts = new KeyboardShortcuts(regexTester);
                    window.keyboardShortcuts = keyboardShortcuts;
                    console.log('✅ KeyboardShortcuts initialized successfully');
                }
                modulesInitialized++;
            } catch (error) {
                console.warn('Failed to initialize KeyboardShortcuts:', error);
            }
        } else if (retryCount < maxRetries) {
            console.log(`Waiting for KeyboardShortcuts... (attempt ${retryCount})`);
        }

        // Check if all modules are initialized
        if (modulesInitialized === totalModules) {
            console.log('🎯 All modules initialized successfully');
            return true;
        }

        // Retry if not all modules are loaded and we haven't exceeded max retries
        if (retryCount < maxRetries) {
            setTimeout(attemptInitialization, retryDelay);
        } else {
            console.warn(`⚠️ Failed to initialize all modules after ${maxRetries} attempts`);
            console.warn('Application will continue with basic functionality');
        }

        return false;
    }

    // Start initialization
    attemptInitialization();
}

// Wait for DOM to be ready, then initialize modules
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeModules);
} else {
    initializeModules();
}

// Update status bar current mode
const updateStatusMode = () => {
    const currentModeElement = document.getElementById('current-mode');
    const modeSelect = document.getElementById('regex-mode');
    if (currentModeElement && modeSelect) {
        const modeName = document.querySelector(`[data-value="${modeSelect.value}"] .option-name`)?.textContent || 'JavaScript';
        currentModeElement.textContent = modeName;
    }
};

// Listen for mode changes
if (regexTester.regexMode) {
    const originalChangeMode = regexTester.changeMode;
    regexTester.changeMode = function(mode) {
        originalChangeMode.call(this, mode);
        updateStatusMode();
    };
}

// Initialize status bar
updateStatusMode();

// Add cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (typeof window.cleanupRegexPro === 'function') {
        window.cleanupRegexPro();
    }
});

// Add cleanup on visibility change (for SPAs)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        if (typeof window.cleanupRegexPro === 'function') {
            window.cleanupRegexPro();
        }
    }
});

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    if (window.regexTester && typeof window.regexTester.handleError === 'function') {
        window.regexTester.handleError(event.error, 'global', 'An unexpected error occurred');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    if (window.regexTester && typeof window.regexTester.handleError === 'function') {
        window.regexTester.handleError(event.reason, 'promise', 'An asynchronous operation failed');
    }
});