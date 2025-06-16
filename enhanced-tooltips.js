/**
 * Enhanced Tooltips for Regex Components
 * Provides detailed, context-aware tooltips with examples
 */

class EnhancedTooltips {
  constructor() {
    this.tooltip = null;
    this.currentTarget = null;
    this.hideTimeout = null;
    this.showTimeout = null;
    this.isHovering = false;
    
    this.initialize();
  }
  
  /**
   * Initialize the tooltip system
   */
  initialize() {
    // Create tooltip element
    this.tooltip = this.createTooltip();
    document.body.appendChild(this.tooltip);
    
    // Set up global event delegation
    this.setupEventDelegation();
  }
  
  /**
   * Create the tooltip element
   */
  createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'enhanced-tooltip';
    tooltip.style.display = 'none';
    tooltip.innerHTML = `
      <div class="tooltip-content">
        <div class="tooltip-header">
          <span class="tooltip-title"></span>
          <span class="tooltip-mode"></span>
        </div>
        <div class="tooltip-description"></div>
        <div class="tooltip-examples"></div>
        <div class="tooltip-notes"></div>
      </div>
      <div class="tooltip-arrow"></div>
    `;
    
    // Prevent tooltip from closing when hovering over it
    tooltip.addEventListener('mouseenter', () => {
      this.isHovering = true;
      this.cancelHide();
    });
    
    tooltip.addEventListener('mouseleave', () => {
      this.isHovering = false;
      this.scheduleHide();
    });
    
    return tooltip;
  }
  
  /**
   * Set up event delegation for regex tokens
   */
  setupEventDelegation() {
    // Listen for mouseover/mouseout on the document
    document.addEventListener('mouseover', (e) => {
      const token = e.target.closest('.regex');
      if (token && token.hasAttribute('data-token-type')) {
        this.scheduleShow(token);
      }
    });
    
    document.addEventListener('mouseout', (e) => {
      const token = e.target.closest('.regex');
      if (token === this.currentTarget && !this.isHovering) {
        this.scheduleHide();
      }
    });
    
    // Hide on scroll
    document.addEventListener('scroll', () => {
      this.hide();
    }, true);
  }
  
  /**
   * Schedule showing the tooltip
   */
  scheduleShow(element) {
    this.cancelHide();
    this.cancelShow();
    
    this.showTimeout = setTimeout(() => {
      this.show(element);
    }, 500); // 500ms delay before showing
  }
  
  /**
   * Schedule hiding the tooltip
   */
  scheduleHide() {
    this.cancelShow();
    
    this.hideTimeout = setTimeout(() => {
      if (!this.isHovering) {
        this.hide();
      }
    }, 300); // 300ms delay before hiding
  }
  
  /**
   * Cancel scheduled show
   */
  cancelShow() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
  }
  
  /**
   * Cancel scheduled hide
   */
  cancelHide() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
  
  /**
   * Show tooltip for an element
   */
  show(element) {
    this.currentTarget = element;
    
    const tokenType = element.getAttribute('data-token-type');
    const tokenValue = element.textContent;
    const mode = document.getElementById('regex-mode')?.value || 'javascript';
    
    // Get tooltip content
    const content = this.getTooltipContent(tokenType, tokenValue, mode);
    
    // Update tooltip content
    this.updateTooltipContent(content);
    
    // Position and show tooltip
    this.positionTooltip(element);
    this.tooltip.style.display = 'block';
    
    // Add active class after a frame for animation
    requestAnimationFrame(() => {
      this.tooltip.classList.add('active');
    });
  }
  
  /**
   * Hide the tooltip
   */
  hide() {
    this.tooltip.classList.remove('active');
    
    setTimeout(() => {
      this.tooltip.style.display = 'none';
      this.currentTarget = null;
    }, 200); // Match CSS transition duration
  }
  
  /**
   * Get tooltip content based on token type
   */
  getTooltipContent(tokenType, tokenValue, mode) {
    const content = {
      title: '',
      description: '',
      examples: [],
      notes: []
    };
    
    // Get basic description
    const basicDesc = RegexParser.getTokenDescription({ type: tokenType, value: tokenValue });
    
    // Enhance based on token type
    switch (tokenType) {
      case TokenType.LITERAL:
        content.title = 'Literal Character';
        content.description = `Matches the exact character "${tokenValue}"`;
        content.examples = [
          { pattern: 'a', matches: ['a'], text: 'apple' },
          { pattern: 'hello', matches: ['hello'], text: 'hello world' }
        ];
        content.notes.push('Case-sensitive by default (use i flag for case-insensitive)');
        break;
        
      case TokenType.DOT:
        content.title = 'Dot (Any Character)';
        content.description = 'Matches any single character except newline';
        content.examples = [
          { pattern: 'a.c', matches: ['abc', 'a@c', 'a c'], text: 'abc a@c a\nc' },
          { pattern: '.+', matches: ['hello'], text: 'hello\nworld' }
        ];
        content.notes.push('Use the s flag to include newlines');
        content.notes.push('Use \\. to match a literal dot');
        break;
        
      case TokenType.ESCAPE_DIGIT:
        content.title = 'Digit Character Class';
        content.description = 'Matches any digit (0-9)';
        content.examples = [
          { pattern: '\\d', matches: ['1', '2', '3'], text: '123' },
          { pattern: '\\d+', matches: ['123', '456'], text: 'abc123def456' }
        ];
        content.notes.push('Equivalent to [0-9]');
        if (mode === 'grep') content.notes.push('⚠️ Not supported in grep - use [0-9]');
        break;
        
      case TokenType.ESCAPE_WORD:
        content.title = 'Word Character Class';
        content.description = 'Matches letters, digits, and underscore';
        content.examples = [
          { pattern: '\\w+', matches: ['hello', 'world_123'], text: 'hello world_123!' }
        ];
        content.notes.push('Equivalent to [a-zA-Z0-9_]');
        if (mode === 'grep') content.notes.push('⚠️ Not supported in grep - use [a-zA-Z0-9_]');
        break;
        
      case TokenType.QUANT_STAR:
        content.title = 'Star Quantifier';
        content.description = 'Matches 0 or more of the preceding element';
        content.examples = [
          { pattern: 'a*', matches: ['', 'a', 'aaa'], text: 'b a aaa' },
          { pattern: 'ab*c', matches: ['ac', 'abc', 'abbbbc'], text: 'ac abc abbbbc' }
        ];
        content.notes.push('Greedy by default - use *? for lazy matching');
        content.notes.push('Always succeeds (can match empty string)');
        break;
        
      case TokenType.QUANT_PLUS:
        content.title = 'Plus Quantifier';
        content.description = 'Matches 1 or more of the preceding element';
        content.examples = [
          { pattern: 'a+', matches: ['a', 'aaa'], text: 'b a aaa' },
          { pattern: 'ab+c', matches: ['abc', 'abbbbc'], text: 'ac abc abbbbc' }
        ];
        content.notes.push('Greedy by default - use +? for lazy matching');
        if (mode === 'grep') content.notes.push('⚠️ In grep, must escape as \\+');
        break;
        
      case TokenType.QUANT_QUESTION:
        content.title = 'Optional Quantifier';
        content.description = 'Matches 0 or 1 of the preceding element';
        content.examples = [
          { pattern: 'colou?r', matches: ['color', 'colour'], text: 'color colour' },
          { pattern: 'ab?c', matches: ['ac', 'abc'], text: 'ac abc abbc' }
        ];
        if (mode === 'grep') content.notes.push('⚠️ In grep, must escape as \\?');
        break;
        
      case TokenType.GROUP_START:
        content.title = 'Capturing Group';
        content.description = 'Groups elements and captures matched text';
        content.examples = [
          { pattern: '(\\d+)', matches: ['123'], captures: ['123'], text: 'abc123def' },
          { pattern: '(\\w+)@(\\w+)', matches: ['test@example'], captures: ['test', 'example'], text: 'test@example' }
        ];
        content.notes.push('Access captures with $1, $2, etc. in replacements');
        content.notes.push('Use (?:...) for non-capturing groups');
        if (mode === 'grep') content.notes.push('⚠️ In grep, must escape as \\( \\)');
        break;
        
      case TokenType.CHAR_CLASS_START:
        content.title = 'Character Class';
        content.description = 'Matches any one character from the set';
        content.examples = [
          { pattern: '[aeiou]', matches: ['a', 'e', 'i'], text: 'hello' },
          { pattern: '[a-z]', matches: ['h', 'e', 'l', 'l', 'o'], text: 'Hello' }
        ];
        content.notes.push('Use ^ at start to negate: [^aeiou]');
        content.notes.push('- is literal at start or end: [-a] or [a-]');
        break;
        
      case TokenType.ANCHOR_START:
        content.title = 'Start Anchor';
        content.description = 'Matches the start of string (or line with m flag)';
        content.examples = [
          { pattern: '^hello', matches: ['hello'], text: 'hello world' },
          { pattern: '^\\d+', matches: [], text: 'abc 123' }
        ];
        content.notes.push('Use m flag for multiline mode');
        content.notes.push('^ inside [...] means negation, not anchor');
        break;
        
      case TokenType.ANCHOR_END:
        content.title = 'End Anchor';
        content.description = 'Matches the end of string (or line with m flag)';
        content.examples = [
          { pattern: 'world$', matches: ['world'], text: 'hello world' },
          { pattern: '\\d+$', matches: ['123'], text: 'test 123' }
        ];
        content.notes.push('Use m flag for multiline mode');
        break;
        
      case TokenType.ALTERNATION:
        content.title = 'Alternation (OR)';
        content.description = 'Matches either the left or right side';
        content.examples = [
          { pattern: 'cat|dog', matches: ['cat', 'dog'], text: 'cat and dog' },
          { pattern: '(mon|tues)day', matches: ['monday', 'tuesday'], text: 'monday tuesday' }
        ];
        content.notes.push('Use groups to limit scope: a(b|c)d');
        if (mode === 'grep') content.notes.push('⚠️ In grep, must escape as \\|');
        break;
        
      case TokenType.LOOKAHEAD_POS:
        content.title = 'Positive Lookahead';
        content.description = 'Asserts that what follows matches';
        content.examples = [
          { pattern: 'foo(?=bar)', matches: ['foo'], text: 'foobar foobaz' },
          { pattern: '\\d+(?=px)', matches: ['100'], text: '100px 200em' }
        ];
        content.notes.push('Does not consume characters');
        content.notes.push('Not supported in all regex flavors');
        break;
        
      case TokenType.NAMED_GROUP_START:
        content.title = 'Named Capturing Group';
        content.description = 'Captures with a name for easier reference';
        content.examples = [
          { pattern: '(?<year>\\d{4})', matches: ['2024'], captures: { year: '2024' }, text: '2024-01-01' }
        ];
        content.notes.push('Reference with \\k<name> or $<name>');
        if (mode === 'python') content.notes.push('Python uses (?P<name>...)');
        break;
        
      default:
        content.title = 'Regex Token';
        content.description = basicDesc;
    }
    
    return content;
  }
  
  /**
   * Update tooltip content
   */
  updateTooltipContent(content) {
    const titleEl = this.tooltip.querySelector('.tooltip-title');
    const descEl = this.tooltip.querySelector('.tooltip-description');
    const examplesEl = this.tooltip.querySelector('.tooltip-examples');
    const notesEl = this.tooltip.querySelector('.tooltip-notes');
    
    titleEl.textContent = content.title;
    descEl.textContent = content.description;
    
    // Render examples
    if (content.examples && content.examples.length > 0) {
      examplesEl.style.display = 'block';
      examplesEl.innerHTML = '<div class="examples-label">Examples:</div>' +
        content.examples.map(ex => `
          <div class="tooltip-example">
            <code class="example-pattern">${this.escapeHtml(ex.pattern)}</code>
            <span class="example-arrow">→</span>
            <span class="example-matches">${ex.matches.map(m => `<mark>${this.escapeHtml(m)}</mark>`).join(', ')}</span>
            ${ex.text ? `<span class="example-text">in "${this.escapeHtml(ex.text)}"</span>` : ''}
          </div>
        `).join('');
    } else {
      examplesEl.style.display = 'none';
    }
    
    // Render notes
    if (content.notes && content.notes.length > 0) {
      notesEl.style.display = 'block';
      notesEl.innerHTML = content.notes.map(note => 
        `<div class="tooltip-note">${note}</div>`
      ).join('');
    } else {
      notesEl.style.display = 'none';
    }
  }
  
  /**
   * Position tooltip relative to element
   */
  positionTooltip(element) {
    const rect = element.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();
    
    // Calculate position
    let top = rect.bottom + 10;
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    
    // Adjust if tooltip would go off screen
    const padding = 10;
    
    // Check right edge
    if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding;
    }
    
    // Check left edge
    if (left < padding) {
      left = padding;
    }
    
    // Check bottom edge - show above if needed
    if (top + tooltipRect.height > window.innerHeight - padding) {
      top = rect.top - tooltipRect.height - 10;
      this.tooltip.classList.add('above');
    } else {
      this.tooltip.classList.remove('above');
    }
    
    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
    
    // Position arrow
    const arrow = this.tooltip.querySelector('.tooltip-arrow');
    const arrowLeft = rect.left + (rect.width / 2) - left;
    arrow.style.left = `${arrowLeft}px`;
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

// Add CSS for enhanced tooltips
const tooltipStyles = `
<style>
.enhanced-tooltip {
  position: fixed;
  z-index: 10000;
  pointer-events: all;
  opacity: 0;
  transform: translateY(5px);
  transition: opacity 0.2s, transform 0.2s;
}

.enhanced-tooltip.active {
  opacity: 1;
  transform: translateY(0);
}

.tooltip-content {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 12px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  font-size: 14px;
  line-height: 1.6;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #34495e;
}

.tooltip-title {
  font-weight: bold;
  color: #3498db;
  font-size: 15px;
}

.tooltip-mode {
  font-size: 12px;
  color: #7f8c8d;
}

.tooltip-description {
  margin-bottom: 12px;
  color: #bdc3c7;
}

.tooltip-examples {
  margin-bottom: 12px;
}

.examples-label {
  font-weight: bold;
  margin-bottom: 6px;
  color: #3498db;
  font-size: 13px;
}

.tooltip-example {
  margin: 6px 0;
  font-family: monospace;
  font-size: 13px;
}

.example-pattern {
  background: #34495e;
  padding: 2px 6px;
  border-radius: 4px;
  color: #3498db;
}

.example-arrow {
  color: #7f8c8d;
  margin: 0 8px;
}

.example-matches mark {
  background: #3498db;
  color: #ffffff;
  padding: 2px 4px;
  border-radius: 4px;
}

.example-text {
  color: #7f8c8d;
  font-size: 12px;
  margin-left: 8px;
}

.tooltip-notes {
  border-top: 1px solid #34495e;
  padding-top: 8px;
}

.tooltip-note {
  font-size: 13px;
  color: #7f8c8d;
  margin: 4px 0;
}

.tooltip-note:first-child {
  margin-top: 0;
}

/* Warning notes */
.tooltip-note:has(⚠️) {
  color: #f39c12;
}

/* Tooltip arrow */
.tooltip-arrow {
  position: absolute;
  bottom: -6px;
  width: 12px;
  height: 12px;
  background: #2c3e50;
  transform: rotate(45deg);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

/* Above positioning */
.enhanced-tooltip.above .tooltip-arrow {
  bottom: auto;
  top: -6px;
  box-shadow: -2px -2px 4px rgba(0, 0, 0, 0.2);
}

/* Light theme adjustments */
body:not(.dark-theme) .tooltip-content {
  background: #ffffff;
  color: #2c3e50;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

body:not(.dark-theme) .tooltip-header {
  border-bottom-color: #ecf0f1;
}

body:not(.dark-theme) .tooltip-title {
  color: #3498db;
}

body:not(.dark-theme) .tooltip-description {
  color: #7f8c8d;
}

body:not(.dark-theme) .example-pattern {
  background: #ecf0f1;
  color: #3498db;
  border: 1px solid #ddd;
}

body:not(.dark-theme) .example-matches mark {
  background: #3498db;
  color: white;
}

body:not(.dark-theme) .tooltip-notes {
  border-top-color: #ecf0f1;
}

body:not(.dark-theme) .tooltip-arrow {
  background: #ffffff;
  border: 1px solid #ddd;
  border-top: none;
  border-left: none;
}

body:not(.dark-theme) .enhanced-tooltip.above .tooltip-arrow {
  border: 1px solid #ddd;
  border-bottom: none;
  border-right: none;
}
</style>
`;

// Inject styles
if (!document.getElementById('enhanced-tooltip-styles')) {
  const styleElement = document.createElement('div');
  styleElement.id = 'enhanced-tooltip-styles';
  styleElement.innerHTML = tooltipStyles;
  document.head.appendChild(styleElement.firstChild);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedTooltips;
}