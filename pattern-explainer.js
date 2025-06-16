/**
 * Pattern Explainer
 * Generates human-readable explanations from regex AST
 */

class PatternExplainer {
  constructor() {
    this.parser = new RegexParser();
    this.container = null;
    this.isExpanded = true;
  }
  
  /**
   * Initialize the explanation panel
   */
  initialize() {
    // Create the explanation panel
    this.container = this.createExplanationPanel();
    
    // Insert after the regex section
    const regexSection = document.querySelector('.regex-section');
    if (regexSection && regexSection.parentNode) {
      regexSection.parentNode.insertBefore(this.container, regexSection.nextSibling);
    }
  }
  
  /**
   * Create the explanation panel UI
   */
  createExplanationPanel() {
    const panel = document.createElement('div');
    panel.className = 'explanation-panel';
    panel.innerHTML = `
      <div class="explanation-header">
        <h2>Pattern Explanation</h2>
        <button class="explanation-toggle" id="explanation-toggle">
          <span class="toggle-icon">▼</span>
        </button>
      </div>
      <div class="explanation-content" id="explanation-content">
        <div class="explanation-empty">
          Enter a regex pattern to see its explanation
        </div>
      </div>
    `;
    
    // Add event listener for toggle
    panel.querySelector('#explanation-toggle').addEventListener('click', () => {
      this.togglePanel();
    });
    
    return panel;
  }
  
  /**
   * Toggle panel visibility
   */
  togglePanel() {
    this.isExpanded = !this.isExpanded;
    const content = this.container.querySelector('#explanation-content');
    const icon = this.container.querySelector('.toggle-icon');
    
    if (this.isExpanded) {
      content.style.display = 'block';
      icon.textContent = '▼';
    } else {
      content.style.display = 'none';
      icon.textContent = '▶';
    }
  }
  
  /**
   * Explain a regex pattern
   */
  explain(pattern, mode = 'javascript') {
    const content = this.container.querySelector('#explanation-content');
    
    if (!pattern) {
      content.innerHTML = '<div class="explanation-empty">Enter a regex pattern to see its explanation</div>';
      return;
    }
    
    // Parse the pattern
    const result = this.parser.parse(pattern, mode);
    
    if (!result.success) {
      content.innerHTML = `
        <div class="explanation-error">
          <h4>Pattern Error</h4>
          ${result.errors.map(err => `<div class="error-item">${this.escapeHtml(err.message)}</div>`).join('')}
        </div>
      `;
      return;
    }
    
    // Generate explanation from AST
    const explanations = this.generateExplanations(result.ast, mode);
    
    // Render the explanations
    content.innerHTML = this.renderExplanations(explanations, pattern, mode);
  }
  
  /**
   * Generate explanations from AST
   */
  generateExplanations(ast, mode) {
    const explanations = [];
    
    // Add mode-specific header if not JavaScript
    if (mode !== 'javascript') {
      explanations.push({
        type: 'mode-info',
        mode: mode,
        description: this.getModeDescription(mode)
      });
    }
    
    // Process the AST
    if (ast && ast.children && ast.children.length > 0) {
      ast.children.forEach(child => {
        this.processNode(child, explanations, 0);
      });
    }
    
    return explanations;
  }
  
  /**
   * Process an AST node and generate explanations
   */
  processNode(node, explanations, depth = 0) {
    const explanation = this.getNodeExplanation(node, depth);
    
    if (explanation) {
      explanations.push(explanation);
    }
    
    // Process children
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        this.processNode(child, explanations, depth + 1);
      });
    }
  }
  
  /**
   * Get explanation for a specific node
   */
  getNodeExplanation(node, depth) {
    const explanation = {
      type: node.type,
      value: node.value,
      depth: depth,
      description: '',
      details: [],
      quantifier: node.quantifier
    };
    
    switch (node.type) {
      case NodeType.LITERAL:
        explanation.description = `Matches the literal character "${node.value}"`;
        if (node.metadata && node.metadata.isRange) {
          explanation.description = `Matches any character from '${node.metadata.from}' to '${node.metadata.to}'`;
        }
        break;
        
      case NodeType.DOT:
        explanation.description = 'Matches any single character except newline';
        explanation.details.push('Use the "s" flag to include newlines');
        break;
        
      case NodeType.SEQUENCE:
        explanation.description = 'Matches the following sequence in order';
        break;
        
      case NodeType.ALTERNATION:
        explanation.description = 'Matches any one of the alternatives';
        explanation.details.push('Tries each alternative from left to right');
        break;
        
      case NodeType.GROUP:
        explanation.description = this.getGroupDescription(node);
        if (node.metadata.type === TokenType.NAMED_GROUP_START) {
          const name = node.metadata.startToken.match(/\?<([^>]+)>/)?.[1] || 
                       node.metadata.startToken.match(/\?P<([^>]+)>/)?.[1];
          if (name) {
            explanation.details.push(`Captured as: "${name}"`);
          }
        }
        break;
        
      case NodeType.ASSERTION:
        explanation.description = this.getAssertionDescription(node);
        explanation.details.push('Does not consume characters');
        break;
        
      case NodeType.CHAR_CLASS:
        explanation.description = node.metadata.negated 
          ? `Matches any character NOT in the set: [${node.value}]`
          : `Matches any one character from the set: [${node.value}]`;
        break;
        
      case NodeType.ANCHOR:
        explanation.description = this.getAnchorDescription(node);
        break;
        
      case NodeType.ESCAPE:
        explanation.description = this.getEscapeDescription(node);
        break;
        
      case NodeType.BACKREF:
        explanation.description = this.getBackrefDescription(node);
        break;
        
      default:
        return null;
    }
    
    // Add quantifier explanation
    if (node.quantifier) {
      explanation.quantifierDesc = this.getQuantifierDescription(node.quantifier);
    }
    
    return explanation;
  }
  
  /**
   * Get group description
   */
  getGroupDescription(node) {
    switch (node.metadata.type) {
      case TokenType.GROUP_START:
        return 'Capturing group - captures matched text for later use';
      case TokenType.NON_CAPTURING_GROUP:
        return 'Non-capturing group - groups without capturing';
      case TokenType.NAMED_GROUP_START:
        return 'Named capturing group - captures with a name';
      default:
        return 'Group';
    }
  }
  
  /**
   * Get assertion description
   */
  getAssertionDescription(node) {
    switch (node.metadata.type) {
      case TokenType.LOOKAHEAD_POS:
        return 'Positive lookahead - asserts what follows';
      case TokenType.LOOKAHEAD_NEG:
        return 'Negative lookahead - asserts what does NOT follow';
      case TokenType.LOOKBEHIND_POS:
        return 'Positive lookbehind - asserts what precedes';
      case TokenType.LOOKBEHIND_NEG:
        return 'Negative lookbehind - asserts what does NOT precede';
      default:
        return 'Assertion';
    }
  }
  
  /**
   * Get anchor description
   */
  getAnchorDescription(node) {
    switch (node.metadata.type) {
      case TokenType.ANCHOR_START:
        return 'Matches the start of the string (or line with "m" flag)';
      case TokenType.ANCHOR_END:
        return 'Matches the end of the string (or line with "m" flag)';
      case TokenType.WORD_BOUNDARY:
        return 'Matches a word boundary (between \\w and \\W)';
      case TokenType.NON_WORD_BOUNDARY:
        return 'Matches a non-word boundary';
      default:
        return 'Anchor';
    }
  }
  
  /**
   * Get escape description
   */
  getEscapeDescription(node) {
    const escapeMap = {
      [TokenType.ESCAPE_DIGIT]: 'Matches any digit (0-9)',
      [TokenType.ESCAPE_NON_DIGIT]: 'Matches any non-digit',
      [TokenType.ESCAPE_WORD]: 'Matches any word character (a-z, A-Z, 0-9, _)',
      [TokenType.ESCAPE_NON_WORD]: 'Matches any non-word character',
      [TokenType.ESCAPE_SPACE]: 'Matches any whitespace character',
      [TokenType.ESCAPE_NON_SPACE]: 'Matches any non-whitespace character',
      [TokenType.ESCAPE_TAB]: 'Matches a tab character',
      [TokenType.ESCAPE_NEWLINE]: 'Matches a newline character',
      [TokenType.ESCAPE_RETURN]: 'Matches a carriage return',
      [TokenType.ESCAPE_HEX]: `Matches the character with hex code ${node.value.substring(2)}`,
      [TokenType.ESCAPE_UNICODE]: `Matches the Unicode character ${node.value}`,
      [TokenType.ESCAPE_CONTROL]: `Matches the control character ${node.value}`
    };
    
    return escapeMap[node.metadata.type] || `Escaped character: ${node.value}`;
  }
  
  /**
   * Get backreference description
   */
  getBackrefDescription(node) {
    if (node.metadata.type === TokenType.BACKREF_NUMBER) {
      const num = node.value.substring(1);
      return `Backreference to capturing group ${num}`;
    } else {
      const name = node.value.match(/\\k<([^>]+)>/)?.[1];
      return `Backreference to named group "${name}"`;
    }
  }
  
  /**
   * Get quantifier description
   */
  getQuantifierDescription(quantifier) {
    const lazy = quantifier.lazy ? ' (lazy/non-greedy)' : ' (greedy)';
    
    switch (quantifier.type) {
      case TokenType.QUANT_STAR:
        return `Matches 0 or more times${lazy}`;
      case TokenType.QUANT_PLUS:
        return `Matches 1 or more times${lazy}`;
      case TokenType.QUANT_QUESTION:
        return `Matches 0 or 1 time${lazy}`;
      case TokenType.QUANT_EXACT:
        const exact = quantifier.value.match(/\{(\d+)\}/)?.[1];
        return `Matches exactly ${exact} times`;
      case TokenType.QUANT_MIN:
        const min = quantifier.value.match(/\{(\d+),\}/)?.[1];
        return `Matches at least ${min} times${lazy}`;
      case TokenType.QUANT_RANGE:
        const range = quantifier.value.match(/\{(\d+),(\d+)\}/);
        if (range) {
          return `Matches between ${range[1]} and ${range[2]} times${lazy}`;
        }
        break;
    }
    
    return 'Quantifier';
  }
  
  /**
   * Get mode description
   */
  getModeDescription(mode) {
    const descriptions = {
      javascript: 'JavaScript (ECMAScript) regular expressions',
      pcre: 'Perl Compatible Regular Expressions - advanced features',
      grep: 'Basic Regular Expressions (BRE) - special chars need escaping',
      egrep: 'Extended Regular Expressions (ERE) - more intuitive syntax',
      vim: 'Vim editor regex - supports magic modes',
      python: 'Python re module - uses (?P<name>) for named groups',
      sed: 'Stream editor patterns - uses BRE syntax'
    };
    
    return descriptions[mode] || mode;
  }
  
  /**
   * Render explanations to HTML
   */
  renderExplanations(explanations, pattern, mode) {
    let html = '';
    
    // Add pattern overview
    html += `
      <div class="explanation-overview">
        <div class="pattern-display">${this.escapeHtml(pattern)}</div>
        <div class="pattern-mode">Mode: ${mode}</div>
      </div>
    `;
    
    // Add explanations
    html += '<div class="explanation-list">';
    
    explanations.forEach(exp => {
      if (exp.type === 'mode-info') {
        html += `
          <div class="explanation-mode-info">
            <strong>${exp.mode.toUpperCase()} Mode:</strong> ${exp.description}
          </div>
        `;
      } else {
        const indent = exp.depth * 20;
        html += `
          <div class="explanation-item" style="margin-left: ${indent}px">
            <div class="explanation-main">
              <span class="explanation-value">${this.formatValue(exp)}</span>
              <span class="explanation-desc">${exp.description}</span>
            </div>
        `;
        
        if (exp.quantifierDesc) {
          html += `
            <div class="explanation-quantifier">
              ${exp.quantifierDesc}
            </div>
          `;
        }
        
        if (exp.details && exp.details.length > 0) {
          html += '<div class="explanation-details">';
          exp.details.forEach(detail => {
            html += `<div class="detail-item">ℹ️ ${detail}</div>`;
          });
          html += '</div>';
        }
        
        html += '</div>';
      }
    });
    
    html += '</div>';
    
    // Add tips section
    html += this.renderTips(pattern, mode);
    
    return html;
  }
  
  /**
   * Format the value display
   */
  formatValue(explanation) {
    switch (explanation.type) {
      case NodeType.SEQUENCE:
      case NodeType.ROOT:
        return '';
      case NodeType.ALTERNATION:
        return '|';
      case NodeType.GROUP:
      case NodeType.ASSERTION:
        return '(...)';
      case NodeType.CHAR_CLASS:
        return `[${explanation.value}]`;
      default:
        return explanation.value || '';
    }
  }
  
  /**
   * Render tips based on the pattern
   */
  renderTips(pattern, mode) {
    const tips = [];
    
    // Check for common issues
    if (pattern.includes('*') && !pattern.includes('\\*')) {
      tips.push('The * quantifier matches 0 or more - use + for 1 or more');
    }
    
    if (pattern.includes('.') && !pattern.includes('\\.')) {
      tips.push('The . matches any character - escape it as \\. to match a literal dot');
    }
    
    if (pattern.includes('?') && pattern.match(/[*+?]\?/)) {
      tips.push('The ? after a quantifier makes it lazy (non-greedy)');
    }
    
    if (mode === 'grep' && pattern.match(/[+?(){}|]/)) {
      tips.push('In grep (BRE), special characters like +?(){}| must be escaped');
    }
    
    if (tips.length === 0) return '';
    
    return `
      <div class="explanation-tips">
        <h4>💡 Tips</h4>
        ${tips.map(tip => `<div class="tip-item">${tip}</div>`).join('')}
      </div>
    `;
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

// Add CSS for the explanation panel
const explanationStyles = `
<style>
.explanation-panel {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  margin: 20px 0;
  overflow: hidden;
}

.explanation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #e9ecef;
  border-bottom: 1px solid #dee2e6;
  cursor: pointer;
  user-select: none;
}

.explanation-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #495057;
}

.explanation-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #6c757d;
  font-size: 16px;
}

.explanation-content {
  padding: 20px;
  max-height: 600px;
  overflow-y: auto;
}

.explanation-empty {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 40px 20px;
}

.explanation-error {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.explanation-error h4 {
  margin: 0 0 10px 0;
}

.error-item {
  margin: 5px 0;
}

.explanation-overview {
  background: white;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #dee2e6;
}

.pattern-display {
  font-family: monospace;
  font-size: 1.2rem;
  color: #212529;
  margin-bottom: 10px;
  word-break: break-all;
}

.pattern-mode {
  font-size: 0.9rem;
  color: #6c757d;
}

.explanation-mode-info {
  background: #d1ecf1;
  color: #0c5460;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.explanation-list {
  background: white;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.explanation-item {
  margin: 10px 0;
  padding: 10px;
  border-left: 3px solid #007bff;
  background: #f8f9fa;
  border-radius: 0 4px 4px 0;
}

.explanation-main {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}

.explanation-value {
  font-family: monospace;
  font-weight: bold;
  color: #007bff;
  font-size: 1.1rem;
}

.explanation-desc {
  color: #495057;
  flex: 1;
}

.explanation-quantifier {
  margin-top: 5px;
  padding-left: 20px;
  color: #6c757d;
  font-size: 0.9rem;
  font-style: italic;
}

.explanation-details {
  margin-top: 10px;
  padding-left: 20px;
}

.detail-item {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 3px 0;
}

.explanation-tips {
  margin-top: 20px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  padding: 15px;
  border-radius: 4px;
}

.explanation-tips h4 {
  margin: 0 0 10px 0;
  color: #856404;
}

.tip-item {
  color: #856404;
  margin: 5px 0;
  padding-left: 20px;
}

/* Dark theme adjustments */
body.dark-theme .explanation-panel {
  background: #2b2b2b;
  border-color: #444;
}

body.dark-theme .explanation-header {
  background: #1e1e1e;
  border-color: #444;
}

body.dark-theme .explanation-header h2 {
  color: #e0e0e0;
}

body.dark-theme .explanation-content {
  color: #e0e0e0;
}

body.dark-theme .explanation-overview,
body.dark-theme .explanation-list {
  background: #1e1e1e;
  border-color: #444;
}

body.dark-theme .explanation-item {
  background: #2b2b2b;
  border-left-color: #4fc3f7;
}

body.dark-theme .pattern-display {
  color: #e0e0e0;
}

body.dark-theme .explanation-value {
  color: #4fc3f7;
}

body.dark-theme .explanation-desc {
  color: #b0b0b0;
}

body.dark-theme .explanation-tips {
  background: #3e3e2e;
  border-color: #5e5e2e;
}

body.dark-theme .tip-item {
  color: #d4d4a0;
}
</style>
`;

// Inject styles
if (!document.getElementById('explanation-styles')) {
  const styleElement = document.createElement('div');
  styleElement.id = 'explanation-styles';
  styleElement.innerHTML = explanationStyles;
  document.head.appendChild(styleElement.firstChild);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PatternExplainer;
}