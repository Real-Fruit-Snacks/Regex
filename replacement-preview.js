/**
 * Live Replacement Preview
 * Shows real-time preview of regex replacements
 */

class ReplacementPreview {
  constructor() {
    this.container = null;
    this.replaceInput = null;
    this.previewBefore = null;
    this.previewAfter = null;
    this.isEnabled = false;
    this.lastPattern = '';
    this.lastFlags = '';
    this.lastText = '';
    this.lastReplacement = '';
    
    this.initialize();
  }
  
  /**
   * Initialize the replacement preview
   */
  initialize() {
    // Create the replacement section
    this.container = this.createReplacementSection();
    
    // Insert after the test section
    const testSection = document.querySelector('.test-section');
    if (testSection && testSection.parentNode) {
      testSection.parentNode.insertBefore(this.container, testSection.nextSibling);
    }
    
    // Set up event listeners
    this.attachEventListeners();
  }
  
  /**
   * Create the replacement section UI
   */
  createReplacementSection() {
    const section = document.createElement('div');
    section.className = 'replacement-section';
    section.innerHTML = `
      <div class="replacement-header">
        <h2>Replace Pattern</h2>
        <label class="replacement-toggle">
          <input type="checkbox" id="enable-replacement">
          <span>Enable Replacement</span>
        </label>
      </div>
      
      <div class="replacement-content" id="replacement-content" style="display: none;">
        <div class="replacement-input-group">
          <label for="replacement-input">Replacement Pattern:</label>
          <input type="text" 
                 id="replacement-input" 
                 placeholder="Replace with... (use $1, $2 for groups, $<name> for named groups)"
                 autocomplete="off">
          <div class="replacement-help">
            <span class="help-icon" id="replacement-help-icon">?</span>
            <div class="help-tooltip" id="replacement-help-tooltip">
              <h4>Replacement Syntax</h4>
              <ul>
                <li><code>$1, $2, ...</code> - Numbered groups</li>
                <li><code>$&lt;name&gt;</code> - Named groups</li>
                <li><code>$&amp;</code> - Entire match</li>
                <li><code>$\`</code> - Text before match</li>
                <li><code>$'</code> - Text after match</li>
                <li><code>$$</code> - Literal $</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="replacement-options">
          <label>
            <input type="checkbox" id="replace-all" checked>
            Replace all matches (global)
          </label>
          <label>
            <input type="checkbox" id="replace-case-insensitive">
            Case insensitive
          </label>
          <label>
            <input type="checkbox" id="replace-multiline">
            Multiline mode
          </label>
        </div>
        
        <div class="replacement-preview">
          <div class="preview-pane preview-before">
            <h3>Original Text</h3>
            <div class="preview-content" id="preview-before"></div>
          </div>
          
          <div class="preview-arrow">→</div>
          
          <div class="preview-pane preview-after">
            <h3>After Replacement</h3>
            <div class="preview-content" id="preview-after"></div>
          </div>
        </div>
        
        <div class="replacement-stats" id="replacement-stats"></div>
      </div>
    `;
    
    return section;
  }
  
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Enable/disable toggle
    const enableToggle = document.getElementById('enable-replacement');
    enableToggle.addEventListener('change', (e) => {
      this.toggle(e.target.checked);
    });
    
    // Replacement input
    this.replaceInput = document.getElementById('replacement-input');
    this.replaceInput.addEventListener('input', () => this.updatePreview());
    
    // Options
    document.getElementById('replace-all').addEventListener('change', () => this.updatePreview());
    document.getElementById('replace-case-insensitive').addEventListener('change', () => this.updatePreview());
    document.getElementById('replace-multiline').addEventListener('change', () => this.updatePreview());
    
    // Help tooltip
    const helpIcon = document.getElementById('replacement-help-icon');
    const helpTooltip = document.getElementById('replacement-help-tooltip');
    
    helpIcon.addEventListener('mouseenter', () => {
      helpTooltip.style.display = 'block';
    });
    
    helpIcon.addEventListener('mouseleave', () => {
      helpTooltip.style.display = 'none';
    });
    
    // Preview elements
    this.previewBefore = document.getElementById('preview-before');
    this.previewAfter = document.getElementById('preview-after');
  }
  
  /**
   * Toggle replacement preview
   */
  toggle(enabled) {
    this.isEnabled = enabled;
    const content = document.getElementById('replacement-content');
    
    if (enabled) {
      content.style.display = 'block';
      this.updatePreview();
    } else {
      content.style.display = 'none';
    }
  }
  
  /**
   * Update the replacement preview
   */
  updatePreview(pattern = null, flags = null, text = null) {
    if (!this.isEnabled) return;
    
    // Get current values if not provided
    const regexInput = document.getElementById('regex-input');
    const regexFlags = document.getElementById('regex-flags');
    const testInput = document.getElementById('test-input');
    
    pattern = pattern !== null ? pattern : regexInput.value;
    flags = flags !== null ? flags : this.getReplacementFlags(regexFlags.value);
    text = text !== null ? text : testInput.value;
    const replacement = this.replaceInput.value;
    
    // Skip if nothing changed
    if (pattern === this.lastPattern && 
        flags === this.lastFlags && 
        text === this.lastText && 
        replacement === this.lastReplacement) {
      return;
    }
    
    this.lastPattern = pattern;
    this.lastFlags = flags;
    this.lastText = text;
    this.lastReplacement = replacement;
    
    if (!pattern || !text) {
      this.previewBefore.innerHTML = '<span class="preview-empty">Enter pattern and test text</span>';
      this.previewAfter.innerHTML = '<span class="preview-empty">No replacement</span>';
      document.getElementById('replacement-stats').innerHTML = '';
      return;
    }
    
    try {
      // Create regex
      const regex = new RegExp(pattern, flags);
      
      // Highlight matches in original
      const highlightedOriginal = this.highlightMatches(text, regex);
      this.previewBefore.innerHTML = highlightedOriginal;
      
      // Perform replacement
      let replacedText;
      let replacementCount = 0;
      
      if (flags.includes('g')) {
        // Global replacement with count
        replacedText = text.replace(regex, (match, ...args) => {
          replacementCount++;
          return this.processReplacement(replacement, match, args);
        });
      } else {
        // Single replacement
        const matched = regex.test(text);
        if (matched) {
          replacementCount = 1;
          // Reset lastIndex for the actual replacement
          regex.lastIndex = 0;
        }
        replacedText = text.replace(regex, (match, ...args) => {
          return this.processReplacement(replacement, match, args);
        });
      }
      
      // Highlight changes in result
      const highlightedResult = this.highlightChanges(text, replacedText);
      this.previewAfter.innerHTML = highlightedResult;
      
      // Update stats
      this.updateStats(replacementCount, text, replacedText);
      
    } catch (error) {
      this.previewBefore.innerHTML = `<span class="preview-error">Invalid pattern: ${this.escapeHtml(error.message)}</span>`;
      this.previewAfter.innerHTML = '<span class="preview-empty">Cannot perform replacement</span>';
      document.getElementById('replacement-stats').innerHTML = '';
    }
  }
  
  /**
   * Get replacement flags based on options
   */
  getReplacementFlags(baseFlags) {
    let flags = baseFlags || '';
    
    // Add flags based on checkboxes
    if (document.getElementById('replace-all').checked && !flags.includes('g')) {
      flags += 'g';
    }
    if (document.getElementById('replace-case-insensitive').checked && !flags.includes('i')) {
      flags += 'i';
    }
    if (document.getElementById('replace-multiline').checked && !flags.includes('m')) {
      flags += 'm';
    }
    
    return flags;
  }
  
  /**
   * Process replacement string with special sequences
   */
  processReplacement(replacement, match, args) {
    // Extract groups and other info from args
    const groups = [];
    let namedGroups = {};
    let offset = 0;
    let string = '';
    
    // Process arguments
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      
      if (typeof arg === 'number') {
        offset = arg;
        string = args[i + 1] || '';
        break;
      } else if (typeof arg === 'object' && arg !== null) {
        namedGroups = arg;
      } else if (typeof arg === 'string') {
        groups.push(arg);
      }
    }
    
    // Replace special sequences
    let result = replacement;
    
    // Named groups: $<name>
    result = result.replace(/\$<([^>]+)>/g, (_, name) => {
      return namedGroups[name] !== undefined ? namedGroups[name] : '';
    });
    
    // Numbered groups: $1, $2, etc.
    result = result.replace(/\$(\d+)/g, (_, num) => {
      const index = parseInt(num) - 1;
      return groups[index] !== undefined ? groups[index] : '';
    });
    
    // Special replacements
    result = result.replace(/\$&/g, match); // Entire match
    result = result.replace(/\$`/g, string.substring(0, offset)); // Before match
    result = result.replace(/\$'/g, string.substring(offset + match.length)); // After match
    result = result.replace(/\$\$/g, '$'); // Literal $
    
    return result;
  }
  
  /**
   * Highlight matches in text
   */
  highlightMatches(text, regex) {
    const matches = [];
    let match;
    
    // Reset regex state
    regex.lastIndex = 0;
    
    // Find all matches
    if (regex.global) {
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0]
        });
        
        // Prevent infinite loop on empty matches
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    } else {
      match = regex.exec(text);
      if (match) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0]
        });
      }
    }
    
    // Build highlighted HTML
    let html = '';
    let lastEnd = 0;
    
    matches.forEach(m => {
      html += this.escapeHtml(text.substring(lastEnd, m.start));
      html += `<mark class="match-highlight">${this.escapeHtml(m.text)}</mark>`;
      lastEnd = m.end;
    });
    
    html += this.escapeHtml(text.substring(lastEnd));
    
    return html || this.escapeHtml(text);
  }
  
  /**
   * Highlight changes between original and replaced text
   */
  highlightChanges(original, replaced) {
    if (original === replaced) {
      return this.escapeHtml(replaced);
    }
    
    // Simple diff - highlight all of replaced text if different
    // For a more sophisticated diff, we could use a proper diff algorithm
    return `<mark class="change-highlight">${this.escapeHtml(replaced)}</mark>`;
  }
  
  /**
   * Update replacement statistics
   */
  updateStats(count, original, replaced) {
    const stats = document.getElementById('replacement-stats');
    
    if (count === 0) {
      stats.innerHTML = '<span class="stat-item">No matches found</span>';
    } else {
      const lengthDiff = replaced.length - original.length;
      const lengthChange = lengthDiff > 0 ? `+${lengthDiff}` : lengthDiff.toString();
      
      stats.innerHTML = `
        <span class="stat-item">Replacements: <strong>${count}</strong></span>
        <span class="stat-item">Length change: <strong>${lengthChange}</strong> characters</span>
      `;
    }
  }
  
  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Add CSS for replacement preview
const replacementStyles = `
<style>
.replacement-section {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 20px 0;
  overflow: hidden;
}

.replacement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #ecf0f1;
  border-bottom: 1px solid #ddd;
}

.replacement-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.replacement-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.replacement-toggle input[type="checkbox"] {
  cursor: pointer;
}

.replacement-content {
  padding: 20px;
}

.replacement-input-group {
  position: relative;
  margin-bottom: 15px;
}

.replacement-input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #2c3e50;
}

#replacement-input {
  width: 100%;
  padding: 8px 35px 8px 12px;
  font-size: 14px;
  font-family: monospace;
  border: 2px solid #ddd;
  border-radius: 4px;
  background: white;
}

#replacement-input:focus {
  outline: none;
  border-color: #3498db;
}

.replacement-help {
  position: absolute;
  right: 10px;
  top: 35px;
}

.help-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #7f8c8d;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  cursor: help;
  user-select: none;
}

.help-tooltip {
  display: none;
  position: absolute;
  right: 0;
  top: 25px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: 250px;
  z-index: 100;
}

.help-tooltip h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #2c3e50;
}

.help-tooltip ul {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
}

.help-tooltip li {
  margin: 4px 0;
}

.help-tooltip code {
  background: #ffffff;
  padding: 1px 4px;
  border-radius: 2px;
  font-family: monospace;
  color: #e74c3c;
}

.replacement-options {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.replacement-options label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 14px;
  color: #2c3e50;
}

.replacement-preview {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: stretch;
  margin-bottom: 15px;
}

.preview-pane {
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.preview-pane h3 {
  margin: 0;
  padding: 10px 15px;
  background: #ffffff;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  color: #2c3e50;
}

.preview-content {
  padding: 15px;
  min-height: 80px;
  font-family: monospace;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-all;
  color: #2c3e50;
  line-height: 1.5;
}

.preview-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #7f8c8d;
}

.preview-empty {
  color: #7f8c8d;
  font-style: italic;
}

.preview-error {
  color: #e74c3c;
}

.match-highlight {
  background: rgba(243, 156, 18, 0.1);
  padding: 2px 0;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(243, 156, 18, 0.2);
}

.change-highlight {
  background: rgba(52, 152, 219, 0.1);
  padding: 2px 0;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(26, 188, 156, 0.1);
}

.replacement-stats {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #7f8c8d;
}

.stat-item strong {
  color: #2c3e50;
}

/* Dark theme adjustments */
body.dark-theme .replacement-section {
  background: #2b2b2b;
  border-color: #444;
}

body.dark-theme .replacement-header {
  background: #1e1e1e;
  border-color: #444;
}

body.dark-theme .replacement-header h2,
body.dark-theme .replacement-input-group label,
body.dark-theme .preview-pane h3 {
  color: #e0e0e0;
}

body.dark-theme #replacement-input {
  background: #1e1e1e;
  border-color: #444;
  color: #e0e0e0;
}

body.dark-theme #replacement-input:focus {
  border-color: #4fc3f7;
}

body.dark-theme .preview-pane {
  background: #1e1e1e;
  border-color: #444;
}

body.dark-theme .preview-content {
  color: #e0e0e0;
}

body.dark-theme .help-tooltip {
  background: #2b2b2b;
  border-color: #444;
}

body.dark-theme .help-tooltip h4 {
  color: #e0e0e0;
}

body.dark-theme .match-highlight {
  background: #3e3e2e;
  box-shadow: 0 0 0 1px #5e5e2e;
}

body.dark-theme .change-highlight {
  background: #2e3e3e;
  box-shadow: 0 0 0 1px #3e5e5e;
}

/* Responsive design */
@media (max-width: 768px) {
  .replacement-preview {
    grid-template-columns: 1fr;
  }
  
  .preview-arrow {
    transform: rotate(90deg);
    height: 40px;
  }
  
  .replacement-options {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
`;

// Inject styles
if (!document.getElementById('replacement-styles')) {
  const styleElement = document.createElement('div');
  styleElement.id = 'replacement-styles';
  styleElement.innerHTML = replacementStyles;
  document.head.appendChild(styleElement.firstChild);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ReplacementPreview;
}