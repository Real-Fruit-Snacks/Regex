/**
 * Regex Parser and Tokenizer
 * Provides tokenization and AST generation for regex patterns across different modes
 */

// Token types for all regex constructs
const TokenType = {
  // Literals and basics
  LITERAL: 'LITERAL',
  DOT: 'DOT',
  
  // Anchors
  ANCHOR_START: 'ANCHOR_START',
  ANCHOR_END: 'ANCHOR_END',
  WORD_BOUNDARY: 'WORD_BOUNDARY',
  NON_WORD_BOUNDARY: 'NON_WORD_BOUNDARY',
  
  // Character classes
  CHAR_CLASS_START: 'CHAR_CLASS_START',
  CHAR_CLASS_END: 'CHAR_CLASS_END',
  CHAR_CLASS_NEGATED: 'CHAR_CLASS_NEGATED',
  CHAR_RANGE: 'CHAR_RANGE',
  
  // Groups
  GROUP_START: 'GROUP_START',
  GROUP_END: 'GROUP_END',
  NON_CAPTURING_GROUP: 'NON_CAPTURING_GROUP',
  NAMED_GROUP_START: 'NAMED_GROUP_START',
  
  // Lookarounds
  LOOKAHEAD_POS: 'LOOKAHEAD_POS',
  LOOKAHEAD_NEG: 'LOOKAHEAD_NEG',
  LOOKBEHIND_POS: 'LOOKBEHIND_POS',
  LOOKBEHIND_NEG: 'LOOKBEHIND_NEG',
  
  // Quantifiers
  QUANT_STAR: 'QUANT_STAR',
  QUANT_PLUS: 'QUANT_PLUS',
  QUANT_QUESTION: 'QUANT_QUESTION',
  QUANT_EXACT: 'QUANT_EXACT',
  QUANT_MIN: 'QUANT_MIN',
  QUANT_RANGE: 'QUANT_RANGE',
  QUANT_LAZY: 'QUANT_LAZY',
  
  // Escapes
  ESCAPE: 'ESCAPE',
  ESCAPE_DIGIT: 'ESCAPE_DIGIT',
  ESCAPE_NON_DIGIT: 'ESCAPE_NON_DIGIT',
  ESCAPE_WORD: 'ESCAPE_WORD',
  ESCAPE_NON_WORD: 'ESCAPE_NON_WORD',
  ESCAPE_SPACE: 'ESCAPE_SPACE',
  ESCAPE_NON_SPACE: 'ESCAPE_NON_SPACE',
  ESCAPE_TAB: 'ESCAPE_TAB',
  ESCAPE_NEWLINE: 'ESCAPE_NEWLINE',
  ESCAPE_RETURN: 'ESCAPE_RETURN',
  ESCAPE_FORM_FEED: 'ESCAPE_FORM_FEED',
  ESCAPE_VERTICAL_TAB: 'ESCAPE_VERTICAL_TAB',
  ESCAPE_NULL: 'ESCAPE_NULL',
  ESCAPE_HEX: 'ESCAPE_HEX',
  ESCAPE_UNICODE: 'ESCAPE_UNICODE',
  ESCAPE_CONTROL: 'ESCAPE_CONTROL',
  
  // Backreferences
  BACKREF_NUMBER: 'BACKREF_NUMBER',
  BACKREF_NAMED: 'BACKREF_NAMED',
  
  // Other
  ALTERNATION: 'ALTERNATION',
  
  // Mode-specific
  MODE_MODIFIER: 'MODE_MODIFIER',
  INLINE_MODIFIER: 'INLINE_MODIFIER',
  
  // Error token
  INVALID: 'INVALID'
};

// Node types for AST
const NodeType = {
  ROOT: 'ROOT',
  SEQUENCE: 'SEQUENCE',
  ALTERNATION: 'ALTERNATION',
  GROUP: 'GROUP',
  CHAR_CLASS: 'CHAR_CLASS',
  QUANTIFIER: 'QUANTIFIER',
  ASSERTION: 'ASSERTION',
  LITERAL: 'LITERAL',
  ESCAPE: 'ESCAPE',
  BACKREF: 'BACKREF',
  ANCHOR: 'ANCHOR',
  DOT: 'DOT'
};

class RegexToken {
  constructor(type, value, position, length = null) {
    this.type = type;
    this.value = value;
    this.position = position;
    this.length = length || value.length;
  }
}

class RegexNode {
  constructor(type, value = null) {
    this.type = type;
    this.value = value;
    this.children = [];
    this.parent = null;
    this.quantifier = null;
    this.metadata = {};
  }
  
  addChild(node) {
    node.parent = this;
    this.children.push(node);
    return node;
  }
}

class RegexParser {
  constructor() {
    this.pattern = '';
    this.position = 0;
    this.tokens = [];
    this.mode = 'javascript';
    this.errors = [];
    this.warnings = [];
  }
  
  /**
   * Parse a regex pattern and return an AST
   * @param {string} pattern - The regex pattern to parse
   * @param {string} mode - The regex mode (javascript, pcre, grep, etc.)
   * @returns {Object} - Parse result with AST, tokens, and any errors/warnings
   */
  parse(pattern, mode = 'javascript') {
    this.pattern = pattern;
    this.mode = mode;
    this.position = 0;
    this.tokens = [];
    this.errors = [];
    this.warnings = [];
    
    try {
      // Tokenize the pattern
      this.tokenize();
      
      // Build AST from tokens
      const ast = this.buildAST();
      
      return {
        success: this.errors.length === 0,
        ast,
        tokens: this.tokens,
        errors: this.errors,
        warnings: this.warnings
      };
    } catch (error) {
      this.errors.push({
        message: error.message,
        position: this.position
      });
      
      return {
        success: false,
        ast: null,
        tokens: this.tokens,
        errors: this.errors,
        warnings: this.warnings
      };
    }
  }
  
  /**
   * Tokenize the regex pattern
   */
  tokenize() {
    while (this.position < this.pattern.length) {
      const char = this.pattern[this.position];
      
      switch (char) {
        case '.':
          this.addToken(TokenType.DOT, char);
          break;
          
        case '^':
          this.addToken(TokenType.ANCHOR_START, char);
          break;
          
        case '$':
          this.addToken(TokenType.ANCHOR_END, char);
          break;
          
        case '*':
          this.addToken(TokenType.QUANT_STAR, char);
          break;
          
        case '+':
          this.addToken(TokenType.QUANT_PLUS, char);
          break;
          
        case '?':
          // Check if it's a lazy quantifier or just optional
          if (this.isLazyQuantifier()) {
            this.addToken(TokenType.QUANT_LAZY, char);
          } else {
            this.addToken(TokenType.QUANT_QUESTION, char);
          }
          break;
          
        case '{':
          this.parseQuantifierBraces();
          break;
          
        case '(':
          this.parseGroupStart();
          break;
          
        case ')':
          this.addToken(TokenType.GROUP_END, char);
          break;
          
        case '[':
          this.parseCharClassStart();
          break;
          
        case ']':
          this.addToken(TokenType.CHAR_CLASS_END, char);
          break;
          
        case '|':
          this.addToken(TokenType.ALTERNATION, char);
          break;
          
        case '\\':
          this.parseEscape();
          break;
          
        default:
          // In BRE mode, some characters have different meanings
          if (this.mode === 'grep' || this.mode === 'sed') {
            this.parseBRESpecial(char);
          } else {
            this.addToken(TokenType.LITERAL, char);
          }
      }
      
      this.position++;
    }
  }
  
  /**
   * Check if current ? is a lazy quantifier
   */
  isLazyQuantifier() {
    if (this.tokens.length === 0) return false;
    
    const lastToken = this.tokens[this.tokens.length - 1];
    return [
      TokenType.QUANT_STAR,
      TokenType.QUANT_PLUS,
      TokenType.QUANT_EXACT,
      TokenType.QUANT_MIN,
      TokenType.QUANT_RANGE
    ].includes(lastToken.type);
  }
  
  /**
   * Parse quantifier in braces {n}, {n,}, {n,m}
   */
  parseQuantifierBraces() {
    const start = this.position;
    let content = '';
    
    this.position++; // Skip {
    
    while (this.position < this.pattern.length && this.pattern[this.position] !== '}') {
      content += this.pattern[this.position];
      this.position++;
    }
    
    if (this.position >= this.pattern.length) {
      // No closing brace, treat as literal
      this.position = start;
      this.addToken(TokenType.LITERAL, '{');
      return;
    }
    
    // Parse the content
    const parts = content.split(',');
    
    if (parts.length === 1 && /^\d+$/.test(parts[0])) {
      // {n} - exact count
      this.addToken(TokenType.QUANT_EXACT, `{${content}}`, start, this.position - start + 1);
    } else if (parts.length === 2 && /^\d+$/.test(parts[0]) && parts[1] === '') {
      // {n,} - minimum count
      this.addToken(TokenType.QUANT_MIN, `{${content}}`, start, this.position - start + 1);
    } else if (parts.length === 2 && /^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])) {
      // {n,m} - range
      this.addToken(TokenType.QUANT_RANGE, `{${content}}`, start, this.position - start + 1);
    } else {
      // Invalid quantifier, treat as literal
      this.position = start;
      this.addToken(TokenType.LITERAL, '{');
      this.position--; // Will be incremented in main loop
    }
  }
  
  /**
   * Parse group start and detect group type
   */
  parseGroupStart() {
    const start = this.position;
    
    if (this.position + 1 < this.pattern.length && this.pattern[this.position + 1] === '?') {
      this.position += 2; // Skip (?
      
      const next = this.pattern[this.position];
      
      switch (next) {
        case ':':
          this.addToken(TokenType.NON_CAPTURING_GROUP, '(?:', start, 3);
          break;
          
        case '=':
          this.addToken(TokenType.LOOKAHEAD_POS, '(?=', start, 3);
          break;
          
        case '!':
          this.addToken(TokenType.LOOKAHEAD_NEG, '(?!', start, 3);
          break;
          
        case '<':
          this.position++;
          if (this.pattern[this.position] === '=') {
            this.addToken(TokenType.LOOKBEHIND_POS, '(?<=', start, 4);
          } else if (this.pattern[this.position] === '!') {
            this.addToken(TokenType.LOOKBEHIND_NEG, '(?<!', start, 4);
          } else {
            // Named group (?<name>
            this.position--;
            this.parseNamedGroup(start);
          }
          break;
          
        case 'P':
          // Python-style named group (?P<name>
          if (this.mode === 'python' || this.mode === 'pcre') {
            this.position++;
            if (this.pattern[this.position] === '<') {
              this.parsePythonNamedGroup(start);
            } else {
              this.addToken(TokenType.INVALID, this.pattern.substring(start, this.position + 1));
            }
          }
          break;
          
        default:
          // Could be inline modifiers or other constructs
          this.parseInlineModifier(start);
          this.position--;
      }
    } else {
      this.addToken(TokenType.GROUP_START, '(');
      this.position--; // Will be incremented in main loop
    }
  }
  
  /**
   * Parse named group (?<name>...)
   */
  parseNamedGroup(start) {
    let name = '';
    this.position += 2; // Skip ?<
    
    while (this.position < this.pattern.length && this.pattern[this.position] !== '>') {
      name += this.pattern[this.position];
      this.position++;
    }
    
    if (this.position < this.pattern.length) {
      this.addToken(TokenType.NAMED_GROUP_START, `(?<${name}>`, start, this.position - start + 1);
    } else {
      this.addToken(TokenType.INVALID, this.pattern.substring(start));
      this.position = this.pattern.length - 1;
    }
  }
  
  /**
   * Parse Python-style named group (?P<name>...)
   */
  parsePythonNamedGroup(start) {
    let name = '';
    this.position++; // Skip <
    
    while (this.position < this.pattern.length && this.pattern[this.position] !== '>') {
      name += this.pattern[this.position];
      this.position++;
    }
    
    if (this.position < this.pattern.length) {
      this.addToken(TokenType.NAMED_GROUP_START, `(?P<${name}>`, start, this.position - start + 1);
    } else {
      this.addToken(TokenType.INVALID, this.pattern.substring(start));
      this.position = this.pattern.length - 1;
    }
  }
  
  /**
   * Parse inline modifiers like (?i) (?m) (?s)
   */
  parseInlineModifier(start) {
    let modifiers = '';
    
    while (this.position < this.pattern.length && this.pattern[this.position] !== ')') {
      modifiers += this.pattern[this.position];
      this.position++;
    }
    
    if (this.position < this.pattern.length) {
      this.addToken(TokenType.INLINE_MODIFIER, `(?${modifiers})`, start, this.position - start + 1);
    } else {
      this.addToken(TokenType.INVALID, this.pattern.substring(start));
      this.position = this.pattern.length - 1;
    }
  }
  
  /**
   * Parse character class start [
   */
  parseCharClassStart() {
    if (this.position + 1 < this.pattern.length && this.pattern[this.position + 1] === '^') {
      this.addToken(TokenType.CHAR_CLASS_NEGATED, '[^', this.position, 2);
      this.position++; // Skip the ^
    } else {
      this.addToken(TokenType.CHAR_CLASS_START, '[');
    }
  }
  
  /**
   * Parse escape sequences
   */
  parseEscape() {
    const start = this.position;
    this.position++; // Skip backslash
    
    if (this.position >= this.pattern.length) {
      this.addToken(TokenType.INVALID, '\\');
      return;
    }
    
    const next = this.pattern[this.position];
    
    switch (next) {
      // Character class shortcuts
      case 'd':
        this.addToken(TokenType.ESCAPE_DIGIT, '\\d', start, 2);
        break;
      case 'D':
        this.addToken(TokenType.ESCAPE_NON_DIGIT, '\\D', start, 2);
        break;
      case 'w':
        this.addToken(TokenType.ESCAPE_WORD, '\\w', start, 2);
        break;
      case 'W':
        this.addToken(TokenType.ESCAPE_NON_WORD, '\\W', start, 2);
        break;
      case 's':
        this.addToken(TokenType.ESCAPE_SPACE, '\\s', start, 2);
        break;
      case 'S':
        this.addToken(TokenType.ESCAPE_NON_SPACE, '\\S', start, 2);
        break;
        
      // Whitespace
      case 't':
        this.addToken(TokenType.ESCAPE_TAB, '\\t', start, 2);
        break;
      case 'n':
        this.addToken(TokenType.ESCAPE_NEWLINE, '\\n', start, 2);
        break;
      case 'r':
        this.addToken(TokenType.ESCAPE_RETURN, '\\r', start, 2);
        break;
      case 'f':
        this.addToken(TokenType.ESCAPE_FORM_FEED, '\\f', start, 2);
        break;
      case 'v':
        this.addToken(TokenType.ESCAPE_VERTICAL_TAB, '\\v', start, 2);
        break;
      case '0':
        this.addToken(TokenType.ESCAPE_NULL, '\\0', start, 2);
        break;
        
      // Boundaries
      case 'b':
        this.addToken(TokenType.WORD_BOUNDARY, '\\b', start, 2);
        break;
      case 'B':
        this.addToken(TokenType.NON_WORD_BOUNDARY, '\\B', start, 2);
        break;
        
      // Backreferences
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        this.addToken(TokenType.BACKREF_NUMBER, `\\${next}`, start, 2);
        break;
        
      // Named backreference \k<name>
      case 'k':
        if (this.position + 1 < this.pattern.length && this.pattern[this.position + 1] === '<') {
          this.parseNamedBackref(start);
        } else {
          this.addToken(TokenType.ESCAPE, `\\${next}`, start, 2);
        }
        break;
        
      // Hex escape \xHH
      case 'x':
        this.parseHexEscape(start);
        break;
        
      // Unicode escape \uHHHH or \u{HHHHHH}
      case 'u':
        this.parseUnicodeEscape(start);
        break;
        
      // Control character \cX
      case 'c':
        this.parseControlEscape(start);
        break;
        
      // Mode-specific escapes
      default:
        if (this.mode === 'vim') {
          this.parseVimEscape(next, start);
        } else if (this.mode === 'grep' || this.mode === 'sed') {
          this.parseBREEscape(next, start);
        } else {
          // Generic escape - escapes the character
          this.addToken(TokenType.ESCAPE, `\\${next}`, start, 2);
        }
    }
  }
  
  /**
   * Parse named backreference \k<name>
   */
  parseNamedBackref(start) {
    let name = '';
    this.position += 2; // Skip k<
    
    while (this.position < this.pattern.length && this.pattern[this.position] !== '>') {
      name += this.pattern[this.position];
      this.position++;
    }
    
    if (this.position < this.pattern.length) {
      this.addToken(TokenType.BACKREF_NAMED, `\\k<${name}>`, start, this.position - start + 1);
    } else {
      this.addToken(TokenType.INVALID, this.pattern.substring(start));
      this.position = this.pattern.length - 1;
    }
  }
  
  /**
   * Parse hex escape \xHH
   */
  parseHexEscape(start) {
    const hex = this.pattern.substr(this.position + 1, 2);
    if (/^[0-9a-fA-F]{2}$/.test(hex)) {
      this.position += 2;
      this.addToken(TokenType.ESCAPE_HEX, `\\x${hex}`, start, 4);
    } else {
      this.addToken(TokenType.ESCAPE, `\\x`, start, 2);
    }
  }
  
  /**
   * Parse unicode escape \uHHHH or \u{H+}
   */
  parseUnicodeEscape(start) {
    if (this.position + 1 < this.pattern.length && this.pattern[this.position + 1] === '{') {
      // Extended unicode \u{H+}
      let hex = '';
      this.position += 2; // Skip u{
      
      while (this.position < this.pattern.length && this.pattern[this.position] !== '}') {
        hex += this.pattern[this.position];
        this.position++;
      }
      
      if (this.position < this.pattern.length && /^[0-9a-fA-F]+$/.test(hex)) {
        this.addToken(TokenType.ESCAPE_UNICODE, `\\u{${hex}}`, start, this.position - start + 1);
      } else {
        this.position = start + 1;
        this.addToken(TokenType.ESCAPE, '\\u', start, 2);
      }
    } else {
      // Standard unicode \uHHHH
      const hex = this.pattern.substr(this.position + 1, 4);
      if (/^[0-9a-fA-F]{4}$/.test(hex)) {
        this.position += 4;
        this.addToken(TokenType.ESCAPE_UNICODE, `\\u${hex}`, start, 6);
      } else {
        this.addToken(TokenType.ESCAPE, '\\u', start, 2);
      }
    }
  }
  
  /**
   * Parse control escape \cX
   */
  parseControlEscape(start) {
    if (this.position + 1 < this.pattern.length) {
      const control = this.pattern[this.position + 1];
      if (/[A-Za-z]/.test(control)) {
        this.position++;
        this.addToken(TokenType.ESCAPE_CONTROL, `\\c${control}`, start, 3);
      } else {
        this.addToken(TokenType.ESCAPE, '\\c', start, 2);
      }
    } else {
      this.addToken(TokenType.ESCAPE, '\\c', start, 2);
    }
  }
  
  /**
   * Parse Vim-specific escapes
   */
  parseVimEscape(char, start) {
    switch (char) {
      case 'v':
        this.addToken(TokenType.MODE_MODIFIER, '\\v', start, 2);
        this.warnings.push({ message: 'Vim very magic mode', position: start });
        break;
      case 'V':
        this.addToken(TokenType.MODE_MODIFIER, '\\V', start, 2);
        this.warnings.push({ message: 'Vim very nomagic mode', position: start });
        break;
      case 'm':
        this.addToken(TokenType.MODE_MODIFIER, '\\m', start, 2);
        this.warnings.push({ message: 'Vim magic mode', position: start });
        break;
      case 'M':
        this.addToken(TokenType.MODE_MODIFIER, '\\M', start, 2);
        this.warnings.push({ message: 'Vim nomagic mode', position: start });
        break;
      case 'c':
        this.addToken(TokenType.MODE_MODIFIER, '\\c', start, 2);
        this.warnings.push({ message: 'Vim case insensitive', position: start });
        break;
      case 'C':
        this.addToken(TokenType.MODE_MODIFIER, '\\C', start, 2);
        this.warnings.push({ message: 'Vim case sensitive', position: start });
        break;
      case '<':
      case '>':
        this.addToken(TokenType.WORD_BOUNDARY, `\\${char}`, start, 2);
        break;
      default:
        this.addToken(TokenType.ESCAPE, `\\${char}`, start, 2);
    }
  }
  
  /**
   * Parse BRE-specific escapes
   */
  parseBREEscape(char, start) {
    switch (char) {
      case '(':
      case ')':
      case '+':
      case '?':
      case '{':
      case '}':
      case '|':
        // In BRE, these are special when escaped
        this.addToken(this.getBRETokenType(char), `\\${char}`, start, 2);
        break;
      default:
        this.addToken(TokenType.ESCAPE, `\\${char}`, start, 2);
    }
  }
  
  /**
   * Get BRE token type for escaped characters
   */
  getBRETokenType(char) {
    switch (char) {
      case '(': return TokenType.GROUP_START;
      case ')': return TokenType.GROUP_END;
      case '+': return TokenType.QUANT_PLUS;
      case '?': return TokenType.QUANT_QUESTION;
      case '{': return TokenType.QUANT_EXACT; // Will be refined
      case '}': return TokenType.LITERAL; // Handled in quantifier parsing
      case '|': return TokenType.ALTERNATION;
      default: return TokenType.LITERAL;
    }
  }
  
  /**
   * Parse BRE special characters (when not escaped, they're literals)
   */
  parseBRESpecial(char) {
    switch (char) {
      case '(':
      case ')':
      case '+':
      case '?':
      case '{':
      case '}':
      case '|':
        // In BRE, these are literals when not escaped
        this.addToken(TokenType.LITERAL, char);
        break;
      default:
        this.addToken(TokenType.LITERAL, char);
    }
  }
  
  /**
   * Add a token to the tokens array
   */
  addToken(type, value, position = null, length = null) {
    const token = new RegexToken(
      type,
      value,
      position !== null ? position : this.position,
      length
    );
    this.tokens.push(token);
  }
  
  /**
   * Build AST from tokens
   */
  buildAST() {
    const root = new RegexNode(NodeType.ROOT);
    this.tokenIndex = 0;
    
    const sequence = this.parseSequence();
    if (sequence) {
      root.addChild(sequence);
    }
    
    return root;
  }
  
  /**
   * Parse a sequence of tokens
   */
  parseSequence() {
    const sequence = new RegexNode(NodeType.SEQUENCE);
    
    while (this.tokenIndex < this.tokens.length) {
      const token = this.tokens[this.tokenIndex];
      
      // Check for sequence terminators
      if (token.type === TokenType.GROUP_END || 
          token.type === TokenType.ALTERNATION) {
        break;
      }
      
      const element = this.parseElement();
      if (element) {
        sequence.addChild(element);
      }
    }
    
    // Handle alternation
    if (this.tokenIndex < this.tokens.length && 
        this.tokens[this.tokenIndex].type === TokenType.ALTERNATION) {
      return this.parseAlternation(sequence);
    }
    
    return sequence.children.length > 0 ? sequence : null;
  }
  
  /**
   * Parse a single element (atom + optional quantifier)
   */
  parseElement() {
    const atom = this.parseAtom();
    if (!atom) return null;
    
    // Check for quantifier
    if (this.tokenIndex < this.tokens.length) {
      const quantifier = this.parseQuantifier();
      if (quantifier) {
        atom.quantifier = quantifier;
      }
    }
    
    return atom;
  }
  
  /**
   * Parse an atom (basic unit)
   */
  parseAtom() {
    if (this.tokenIndex >= this.tokens.length) return null;
    
    const token = this.tokens[this.tokenIndex];
    this.tokenIndex++;
    
    switch (token.type) {
      case TokenType.LITERAL:
        return new RegexNode(NodeType.LITERAL, token.value);
        
      case TokenType.DOT:
        return new RegexNode(NodeType.DOT, '.');
        
      case TokenType.ANCHOR_START:
      case TokenType.ANCHOR_END:
      case TokenType.WORD_BOUNDARY:
      case TokenType.NON_WORD_BOUNDARY:
        const anchor = new RegexNode(NodeType.ANCHOR, token.value);
        anchor.metadata.type = token.type;
        return anchor;
        
      case TokenType.ESCAPE_DIGIT:
      case TokenType.ESCAPE_NON_DIGIT:
      case TokenType.ESCAPE_WORD:
      case TokenType.ESCAPE_NON_WORD:
      case TokenType.ESCAPE_SPACE:
      case TokenType.ESCAPE_NON_SPACE:
      case TokenType.ESCAPE_TAB:
      case TokenType.ESCAPE_NEWLINE:
      case TokenType.ESCAPE_RETURN:
      case TokenType.ESCAPE_HEX:
      case TokenType.ESCAPE_UNICODE:
      case TokenType.ESCAPE_CONTROL:
      case TokenType.ESCAPE:
        const escape = new RegexNode(NodeType.ESCAPE, token.value);
        escape.metadata.type = token.type;
        return escape;
        
      case TokenType.GROUP_START:
      case TokenType.NON_CAPTURING_GROUP:
      case TokenType.NAMED_GROUP_START:
      case TokenType.LOOKAHEAD_POS:
      case TokenType.LOOKAHEAD_NEG:
      case TokenType.LOOKBEHIND_POS:
      case TokenType.LOOKBEHIND_NEG:
        return this.parseGroup(token);
        
      case TokenType.CHAR_CLASS_START:
      case TokenType.CHAR_CLASS_NEGATED:
        return this.parseCharClass(token);
        
      case TokenType.BACKREF_NUMBER:
      case TokenType.BACKREF_NAMED:
        const backref = new RegexNode(NodeType.BACKREF, token.value);
        backref.metadata.type = token.type;
        return backref;
        
      default:
        this.tokenIndex--;
        return null;
    }
  }
  
  /**
   * Parse a group
   */
  parseGroup(startToken) {
    const group = new RegexNode(NodeType.GROUP);
    group.metadata.type = startToken.type;
    group.metadata.startToken = startToken.value;
    
    // Handle assertions differently (they don't capture)
    if ([TokenType.LOOKAHEAD_POS, TokenType.LOOKAHEAD_NEG, 
         TokenType.LOOKBEHIND_POS, TokenType.LOOKBEHIND_NEG].includes(startToken.type)) {
      group.type = NodeType.ASSERTION;
    }
    
    // Parse group contents
    const sequence = this.parseSequence();
    if (sequence) {
      group.addChild(sequence);
    }
    
    // Expect closing parenthesis
    if (this.tokenIndex < this.tokens.length && 
        this.tokens[this.tokenIndex].type === TokenType.GROUP_END) {
      this.tokenIndex++;
    } else {
      this.errors.push({
        message: 'Unclosed group',
        position: startToken.position
      });
    }
    
    return group;
  }
  
  /**
   * Parse a character class
   */
  parseCharClass(startToken) {
    const charClass = new RegexNode(NodeType.CHAR_CLASS);
    charClass.metadata.negated = startToken.type === TokenType.CHAR_CLASS_NEGATED;
    
    let content = '';
    let inRange = false;
    
    while (this.tokenIndex < this.tokens.length) {
      const token = this.tokens[this.tokenIndex];
      
      if (token.type === TokenType.CHAR_CLASS_END) {
        this.tokenIndex++;
        break;
      }
      
      content += token.value;
      
      // Check for range
      if (this.tokenIndex + 2 < this.tokens.length &&
          this.tokens[this.tokenIndex + 1].type === TokenType.LITERAL &&
          this.tokens[this.tokenIndex + 1].value === '-' &&
          this.tokens[this.tokenIndex + 2].type === TokenType.LITERAL) {
        // This is a range
        const rangeNode = new RegexNode(NodeType.LITERAL);
        rangeNode.metadata.isRange = true;
        rangeNode.metadata.from = token.value;
        rangeNode.metadata.to = this.tokens[this.tokenIndex + 2].value;
        rangeNode.value = `${token.value}-${this.tokens[this.tokenIndex + 2].value}`;
        charClass.addChild(rangeNode);
        this.tokenIndex += 3;
      } else {
        charClass.addChild(new RegexNode(NodeType.LITERAL, token.value));
        this.tokenIndex++;
      }
    }
    
    charClass.value = content;
    return charClass;
  }
  
  /**
   * Parse a quantifier
   */
  parseQuantifier() {
    if (this.tokenIndex >= this.tokens.length) return null;
    
    const token = this.tokens[this.tokenIndex];
    
    switch (token.type) {
      case TokenType.QUANT_STAR:
      case TokenType.QUANT_PLUS:
      case TokenType.QUANT_QUESTION:
      case TokenType.QUANT_EXACT:
      case TokenType.QUANT_MIN:
      case TokenType.QUANT_RANGE:
        this.tokenIndex++;
        
        const quantifier = {
          type: token.type,
          value: token.value,
          lazy: false
        };
        
        // Check for lazy modifier
        if (this.tokenIndex < this.tokens.length &&
            this.tokens[this.tokenIndex].type === TokenType.QUANT_LAZY) {
          quantifier.lazy = true;
          this.tokenIndex++;
        }
        
        return quantifier;
        
      default:
        return null;
    }
  }
  
  /**
   * Parse alternation
   */
  parseAlternation(leftSequence) {
    const alternation = new RegexNode(NodeType.ALTERNATION);
    alternation.addChild(leftSequence);
    
    while (this.tokenIndex < this.tokens.length &&
           this.tokens[this.tokenIndex].type === TokenType.ALTERNATION) {
      this.tokenIndex++; // Skip |
      
      const rightSequence = this.parseSequence();
      if (rightSequence) {
        alternation.addChild(rightSequence);
      }
    }
    
    return alternation;
  }
  
  /**
   * Get human-readable description of a token
   */
  static getTokenDescription(token) {
    const descriptions = {
      [TokenType.LITERAL]: 'Literal character',
      [TokenType.DOT]: 'Any character (except newline)',
      [TokenType.ANCHOR_START]: 'Start of string/line',
      [TokenType.ANCHOR_END]: 'End of string/line',
      [TokenType.WORD_BOUNDARY]: 'Word boundary',
      [TokenType.NON_WORD_BOUNDARY]: 'Non-word boundary',
      [TokenType.CHAR_CLASS_START]: 'Character class start',
      [TokenType.CHAR_CLASS_END]: 'Character class end',
      [TokenType.CHAR_CLASS_NEGATED]: 'Negated character class',
      [TokenType.GROUP_START]: 'Capturing group start',
      [TokenType.GROUP_END]: 'Group end',
      [TokenType.NON_CAPTURING_GROUP]: 'Non-capturing group',
      [TokenType.NAMED_GROUP_START]: 'Named capturing group',
      [TokenType.LOOKAHEAD_POS]: 'Positive lookahead',
      [TokenType.LOOKAHEAD_NEG]: 'Negative lookahead',
      [TokenType.LOOKBEHIND_POS]: 'Positive lookbehind',
      [TokenType.LOOKBEHIND_NEG]: 'Negative lookbehind',
      [TokenType.QUANT_STAR]: 'Zero or more',
      [TokenType.QUANT_PLUS]: 'One or more',
      [TokenType.QUANT_QUESTION]: 'Zero or one (optional)',
      [TokenType.QUANT_EXACT]: 'Exactly n times',
      [TokenType.QUANT_MIN]: 'At least n times',
      [TokenType.QUANT_RANGE]: 'Between n and m times',
      [TokenType.QUANT_LAZY]: 'Lazy (non-greedy) modifier',
      [TokenType.ESCAPE_DIGIT]: 'Any digit (0-9)',
      [TokenType.ESCAPE_NON_DIGIT]: 'Any non-digit',
      [TokenType.ESCAPE_WORD]: 'Word character (letters, digits, underscore)',
      [TokenType.ESCAPE_NON_WORD]: 'Non-word character',
      [TokenType.ESCAPE_SPACE]: 'Whitespace character',
      [TokenType.ESCAPE_NON_SPACE]: 'Non-whitespace character',
      [TokenType.ESCAPE_TAB]: 'Tab character',
      [TokenType.ESCAPE_NEWLINE]: 'Newline character',
      [TokenType.ESCAPE_RETURN]: 'Carriage return',
      [TokenType.BACKREF_NUMBER]: 'Numbered backreference',
      [TokenType.BACKREF_NAMED]: 'Named backreference',
      [TokenType.ALTERNATION]: 'Alternation (OR)',
      [TokenType.ESCAPE]: 'Escaped character',
      [TokenType.INVALID]: 'Invalid syntax'
    };
    
    return descriptions[token.type] || token.type;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RegexParser, TokenType, NodeType };
}