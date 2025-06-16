/**
 * Syntax Highlighter for Regex Patterns
 * Provides real-time syntax highlighting for regex input fields
 */

class PatternHighlighter {
  constructor(inputElement, mode = 'javascript') {
    this.input = inputElement;
    this.mode = mode;
    this.parser = new RegexParser();
    
    // Create the highlight overlay
    this.overlay = this.createOverlay();
    
    // State
    this.isHighlighting = false;
    this.lastPattern = '';
    
    // Bind event handlers
    this.handleInput = this.handleInput.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    
    // Initialize
    this.initialize();
  }
  
  /**
   * Initialize the highlighter
   */
  initialize() {
    // Insert overlay after input
    this.input.parentNode.insertBefore(this.overlay, this.input.nextSibling);
    
    // Make input transparent so overlay shows through
    this.input.style.position = 'relative';
    this.input.style.background = 'transparent';
    this.input.style.zIndex = '2';
    
    // Attach event listeners
    this.input.addEventListener('input', this.handleInput);
    this.input.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
    
    // Initial highlight
    this.highlight();
  }
  
  /**
   * Create the highlight overlay element
   */
  createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'pattern-highlight-overlay';
    
    // Copy input styles to overlay
    const inputStyles = window.getComputedStyle(this.input);
    const stylesToCopy = [
      'font', 'fontSize', 'fontFamily', 'fontWeight', 'fontStyle',
      'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent',
      'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
      'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth',
      'boxSizing', 'lineHeight'
    ];
    
    stylesToCopy.forEach(style => {
      overlay.style[style] = inputStyles[style];
    });
    
    // Position overlay exactly over input
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.overflow = 'hidden';
    overlay.style.pointerEvents = 'none';
    overlay.style.whiteSpace = 'pre';
    overlay.style.color = 'transparent';
    overlay.style.zIndex = '1';
    
    // Create inner content div for scrolling
    const content = document.createElement('div');
    content.className = 'highlight-content';
    content.style.position = 'relative';
    content.style.whiteSpace = 'pre';
    overlay.appendChild(content);
    
    return overlay;
  }
  
  /**
   * Handle input changes
   */
  handleInput() {
    this.highlight();
  }
  
  /**
   * Handle scroll events to sync overlay with input
   */
  handleScroll() {
    const content = this.overlay.querySelector('.highlight-content');
    content.style.transform = `translateX(-${this.input.scrollLeft}px)`;
  }
  
  /**
   * Handle window resize
   */
  handleResize() {
    this.updateOverlayPosition();
  }
  
  /**
   * Update overlay position and size
   */
  updateOverlayPosition() {
    const rect = this.input.getBoundingClientRect();
    const parentRect = this.input.parentNode.getBoundingClientRect();
    
    this.overlay.style.top = `${rect.top - parentRect.top}px`;
    this.overlay.style.left = `${rect.left - parentRect.left}px`;
    this.overlay.style.width = `${rect.width}px`;
    this.overlay.style.height = `${rect.height}px`;
  }
  
  /**
   * Highlight the current pattern
   */
  highlight() {
    const pattern = this.input.value;
    
    // Skip if pattern hasn't changed
    if (pattern === this.lastPattern) return;
    
    this.lastPattern = pattern;
    
    // Parse the pattern
    const parseResult = this.parser.parse(pattern, this.mode);
    
    // Generate highlighted HTML
    const html = this.generateHighlightedHTML(pattern, parseResult.tokens);
    
    // Update overlay content
    const content = this.overlay.querySelector('.highlight-content');
    content.innerHTML = html;
    
    // Sync scroll position
    this.handleScroll();
  }
  
  /**
   * Generate highlighted HTML from tokens
   */
  generateHighlightedHTML(pattern, tokens) {
    if (!tokens || tokens.length === 0) {
      return this.escapeHtml(pattern);
    }
    
    let html = '';
    let lastPosition = 0;
    
    tokens.forEach(token => {
      // Add any unhighlighted text before this token
      if (token.position > lastPosition) {
        html += this.escapeHtml(pattern.substring(lastPosition, token.position));
      }
      
      // Add the highlighted token
      const cssClass = this.getTokenClass(token);
      const tokenText = pattern.substring(token.position, token.position + token.length);
      
      // Special handling for hover tooltips
      const description = RegexParser.getTokenDescription(token);
      
      html += `<span class="${cssClass}" data-token-type="${token.type}" title="${this.escapeHtml(description)}">${this.escapeHtml(tokenText)}</span>`;
      
      lastPosition = token.position + token.length;
    });
    
    // Add any remaining text
    if (lastPosition < pattern.length) {
      html += this.escapeHtml(pattern.substring(lastPosition));
    }
    
    return html;
  }
  
  /**
   * Get CSS class for a token type
   */
  getTokenClass(token) {
    const baseClass = 'regex';
    
    // Map token types to CSS classes
    const classMap = {
      // Literals
      [TokenType.LITERAL]: 'literal',
      [TokenType.DOT]: 'metachar dot',
      
      // Anchors
      [TokenType.ANCHOR_START]: 'anchor start',
      [TokenType.ANCHOR_END]: 'anchor end',
      [TokenType.WORD_BOUNDARY]: 'anchor boundary',
      [TokenType.NON_WORD_BOUNDARY]: 'anchor boundary',
      
      // Character classes
      [TokenType.CHAR_CLASS_START]: 'char-class bracket',
      [TokenType.CHAR_CLASS_END]: 'char-class bracket',
      [TokenType.CHAR_CLASS_NEGATED]: 'char-class bracket negated',
      [TokenType.CHAR_RANGE]: 'char-class range',
      
      // Groups
      [TokenType.GROUP_START]: 'group paren',
      [TokenType.GROUP_END]: 'group paren',
      [TokenType.NON_CAPTURING_GROUP]: 'group non-capturing',
      [TokenType.NAMED_GROUP_START]: 'group named',
      
      // Lookarounds
      [TokenType.LOOKAHEAD_POS]: 'assertion lookahead positive',
      [TokenType.LOOKAHEAD_NEG]: 'assertion lookahead negative',
      [TokenType.LOOKBEHIND_POS]: 'assertion lookbehind positive',
      [TokenType.LOOKBEHIND_NEG]: 'assertion lookbehind negative',
      
      // Quantifiers
      [TokenType.QUANT_STAR]: 'quantifier star',
      [TokenType.QUANT_PLUS]: 'quantifier plus',
      [TokenType.QUANT_QUESTION]: 'quantifier question',
      [TokenType.QUANT_EXACT]: 'quantifier braces',
      [TokenType.QUANT_MIN]: 'quantifier braces',
      [TokenType.QUANT_RANGE]: 'quantifier braces',
      [TokenType.QUANT_LAZY]: 'quantifier lazy',
      
      // Escapes
      [TokenType.ESCAPE]: 'escape',
      [TokenType.ESCAPE_DIGIT]: 'escape char-class',
      [TokenType.ESCAPE_NON_DIGIT]: 'escape char-class',
      [TokenType.ESCAPE_WORD]: 'escape char-class',
      [TokenType.ESCAPE_NON_WORD]: 'escape char-class',
      [TokenType.ESCAPE_SPACE]: 'escape char-class',
      [TokenType.ESCAPE_NON_SPACE]: 'escape char-class',
      [TokenType.ESCAPE_TAB]: 'escape whitespace',
      [TokenType.ESCAPE_NEWLINE]: 'escape whitespace',
      [TokenType.ESCAPE_RETURN]: 'escape whitespace',
      [TokenType.ESCAPE_HEX]: 'escape hex',
      [TokenType.ESCAPE_UNICODE]: 'escape unicode',
      [TokenType.ESCAPE_CONTROL]: 'escape control',
      
      // Backreferences
      [TokenType.BACKREF_NUMBER]: 'backref number',
      [TokenType.BACKREF_NAMED]: 'backref named',
      
      // Other
      [TokenType.ALTERNATION]: 'alternation',
      [TokenType.MODE_MODIFIER]: 'modifier',
      [TokenType.INLINE_MODIFIER]: 'modifier inline',
      
      // Error
      [TokenType.INVALID]: 'error'
    };
    
    const specificClass = classMap[token.type] || 'unknown';
    return `${baseClass} ${specificClass}`;
  }
  
  /**
   * Escape HTML special characters
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  /**
   * Set the regex mode
   */
  setMode(mode) {
    this.mode = mode;
    this.lastPattern = ''; // Force re-highlight
    this.highlight();
  }
  
  /**
   * Destroy the highlighter
   */
  destroy() {
    // Remove event listeners
    this.input.removeEventListener('input', this.handleInput);
    this.input.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    
    // Remove overlay
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    
    // Reset input styles
    this.input.style.background = '';
    this.input.style.zIndex = '';
  }
}

// Add CSS styles for highlighting
const highlightStyles = `
<style>
/* Base styles */
.pattern-highlight-overlay {
  font-family: monospace !important;
}

.pattern-highlight-overlay .regex {
  position: relative;
}

/* Literals */
.regex.literal {
  color: #333;
}

/* Meta characters */
.regex.metachar {
  color: #0066cc;
  font-weight: bold;
}

.regex.dot {
  color: #ff6b6b;
  font-weight: bold;
}

/* Anchors */
.regex.anchor {
  color: #95e1d3;
  font-weight: bold;
}

.regex.anchor.start::before,
.regex.anchor.end::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 100%;
  background: currentColor;
  opacity: 0.3;
}

.regex.anchor.start::before {
  left: -2px;
}

.regex.anchor.end::after {
  right: -2px;
}

/* Character classes */
.regex.char-class {
  background-color: rgba(78, 205, 196, 0.1);
  border-radius: 2px;
}

.regex.char-class.bracket {
  color: #4ecdc4;
  font-weight: bold;
}

.regex.char-class.negated {
  color: #ff6b6b;
}

/* Groups */
.regex.group {
  position: relative;
}

.regex.group.paren {
  color: #0066cc;
  font-weight: bold;
}

.regex.group.non-capturing {
  color: #666;
}

.regex.group.named {
  color: #9c88ff;
  background-color: rgba(156, 136, 255, 0.1);
  border-radius: 2px;
  padding: 0 2px;
}

/* Assertions */
.regex.assertion {
  color: #f39c12;
  background-color: rgba(243, 156, 18, 0.1);
  border-radius: 2px;
}

/* Quantifiers */
.regex.quantifier {
  color: #e74c3c;
  font-weight: bold;
}

.regex.quantifier.lazy {
  color: #e67e22;
}

/* Escapes */
.regex.escape {
  color: #8e44ad;
}

.regex.escape.char-class {
  color: #16a085;
  font-weight: bold;
}

.regex.escape.whitespace {
  background-color: rgba(52, 152, 219, 0.1);
  border-radius: 2px;
}

.regex.escape.hex,
.regex.escape.unicode {
  color: #2980b9;
  font-family: monospace;
  font-size: 0.9em;
}

/* Backreferences */
.regex.backref {
  color: #9b59b6;
  text-decoration: underline;
  text-decoration-style: dashed;
}

/* Alternation */
.regex.alternation {
  color: #e74c3c;
  font-weight: bold;
  padding: 0 4px;
}

/* Modifiers */
.regex.modifier {
  color: #7f8c8d;
  font-style: italic;
}

/* Errors */
.regex.error {
  color: #c0392b;
  background-color: rgba(192, 57, 43, 0.1);
  border-bottom: 2px wavy #c0392b;
}

/* Hover effects */
.regex:hover {
  background-color: rgba(0, 0, 0, 0.05);
  cursor: help;
}

/* Dark theme adjustments */
body.dark-theme .regex.literal {
  color: #ecf0f1;
}

body.dark-theme .regex:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
`;

// Inject styles if not already present
if (!document.getElementById('regex-highlight-styles')) {
  const styleElement = document.createElement('div');
  styleElement.id = 'regex-highlight-styles';
  styleElement.innerHTML = highlightStyles;
  document.head.appendChild(styleElement.firstChild);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PatternHighlighter;
}