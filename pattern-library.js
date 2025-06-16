/**
 * Common Patterns Library
 * Provides a collection of common regex patterns with one-click access
 */

class PatternLibrary {
  constructor() {
    this.container = null;
    this.searchInput = null;
    this.patternList = null;
    this.selectedCategory = 'all';
    this.customPatterns = this.loadCustomPatterns();
    this.isExpanded = false;
    this.onPatternSelect = null;
  }
  
  /**
   * Common patterns database
   */
  commonPatterns = {
    validation: {
      name: 'Validation',
      patterns: [
        {
          id: 'email',
          name: 'Email Address',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'Validates standard email addresses',
          examples: ['user@example.com', 'john.doe+tag@company.co.uk'],
          flags: ''
        },
        {
          id: 'email-simple',
          name: 'Email (Simple)',
          pattern: '\\S+@\\S+\\.\\S+',
          description: 'Simple email pattern for basic matching',
          examples: ['test@example.com'],
          flags: ''
        },
        {
          id: 'url',
          name: 'URL (Web Address)',
          pattern: 'https?://(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&/=]*)',
          description: 'Matches HTTP and HTTPS URLs',
          examples: ['https://example.com', 'http://www.example.com/path?query=1'],
          flags: 'i'
        },
        {
          id: 'ipv4',
          name: 'IPv4 Address',
          pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
          description: 'Validates IPv4 addresses',
          examples: ['192.168.1.1', '10.0.0.0', '255.255.255.255'],
          flags: ''
        },
        {
          id: 'ipv6',
          name: 'IPv6 Address',
          pattern: '^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$',
          description: 'Simple IPv6 address validation',
          examples: ['2001:0db8:85a3:0000:0000:8a2e:0370:7334'],
          flags: 'i'
        }
      ]
    },
    
    phone: {
      name: 'Phone Numbers',
      patterns: [
        {
          id: 'phone-us',
          name: 'US Phone Number',
          pattern: '^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$',
          description: 'Matches US phone numbers in various formats',
          examples: ['(123) 456-7890', '123-456-7890', '123.456.7890', '1234567890'],
          flags: ''
        },
        {
          id: 'phone-intl',
          name: 'International Phone',
          pattern: '^\\+?[1-9]\\d{1,14}$',
          description: 'E.164 international phone format',
          examples: ['+14155552671', '+442071838750'],
          flags: ''
        },
        {
          id: 'phone-uk',
          name: 'UK Phone Number',
          pattern: '^(?:(?:\\+44)|(?:0))(?:\\d{10}|\\d{4}\\s\\d{6}|\\d{5}\\s\\d{5})$',
          description: 'Matches UK phone numbers',
          examples: ['+447911123456', '07911 123456', '01234 567890'],
          flags: ''
        }
      ]
    },
    
    dates: {
      name: 'Dates & Times',
      patterns: [
        {
          id: 'date-iso',
          name: 'ISO Date (YYYY-MM-DD)',
          pattern: '^\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])$',
          description: 'Matches dates in ISO format',
          examples: ['2024-12-25', '2023-01-01'],
          flags: ''
        },
        {
          id: 'date-us',
          name: 'US Date (MM/DD/YYYY)',
          pattern: '^(?:0?[1-9]|1[0-2])/(?:0?[1-9]|[12]\\d|3[01])/\\d{4}$',
          description: 'Matches US format dates',
          examples: ['12/25/2024', '1/1/2023', '01/01/2023'],
          flags: ''
        },
        {
          id: 'date-eu',
          name: 'EU Date (DD/MM/YYYY)',
          pattern: '^(?:0?[1-9]|[12]\\d|3[01])/(?:0?[1-9]|1[0-2])/\\d{4}$',
          description: 'Matches European format dates',
          examples: ['25/12/2024', '1/1/2023', '01/01/2023'],
          flags: ''
        },
        {
          id: 'time-24h',
          name: '24-Hour Time',
          pattern: '^(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?$',
          description: 'Matches 24-hour time format',
          examples: ['14:30', '23:59:59', '00:00'],
          flags: ''
        },
        {
          id: 'time-12h',
          name: '12-Hour Time',
          pattern: '^(?:1[0-2]|0?[1-9]):[0-5]\\d(?::[0-5]\\d)? ?(?:AM|PM|am|pm)$',
          description: 'Matches 12-hour time with AM/PM',
          examples: ['2:30 PM', '11:59:59 pm', '12:00 AM'],
          flags: ''
        }
      ]
    },
    
    numbers: {
      name: 'Numbers & Currency',
      patterns: [
        {
          id: 'integer',
          name: 'Integer',
          pattern: '^-?\\d+$',
          description: 'Matches whole numbers (positive or negative)',
          examples: ['123', '-456', '0'],
          flags: ''
        },
        {
          id: 'decimal',
          name: 'Decimal Number',
          pattern: '^-?\\d+\\.\\d+$',
          description: 'Matches decimal numbers',
          examples: ['123.45', '-67.89', '0.5'],
          flags: ''
        },
        {
          id: 'currency-usd',
          name: 'US Currency',
          pattern: '^\\$?\\d{1,3}(?:,\\d{3})*(?:\\.\\d{2})?$',
          description: 'Matches US dollar amounts',
          examples: ['$1,234.56', '1234.56', '$100'],
          flags: ''
        },
        {
          id: 'percentage',
          name: 'Percentage',
          pattern: '^\\d+(?:\\.\\d+)?%$',
          description: 'Matches percentage values',
          examples: ['100%', '45.5%', '0.1%'],
          flags: ''
        },
        {
          id: 'hex-color',
          name: 'Hex Color Code',
          pattern: '^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Matches hex color codes',
          examples: ['#FF5733', '#abc', 'FF5733'],
          flags: ''
        }
      ]
    },
    
    text: {
      name: 'Text Patterns',
      patterns: [
        {
          id: 'word',
          name: 'Whole Word',
          pattern: '\\b\\w+\\b',
          description: 'Matches whole words',
          examples: ['hello', 'world', 'test123'],
          flags: 'g'
        },
        {
          id: 'sentence',
          name: 'Sentence',
          pattern: '[A-Z][^.!?]*[.!?]',
          description: 'Matches sentences (simple)',
          examples: ['This is a sentence.', 'Hello world!'],
          flags: 'g'
        },
        {
          id: 'whitespace',
          name: 'Whitespace',
          pattern: '\\s+',
          description: 'Matches one or more whitespace characters',
          examples: [' ', '\\t', '\\n'],
          flags: 'g'
        },
        {
          id: 'non-whitespace',
          name: 'Non-whitespace',
          pattern: '\\S+',
          description: 'Matches sequences of non-whitespace',
          examples: ['hello', '123', 'test@example'],
          flags: 'g'
        },
        {
          id: 'alphanumeric',
          name: 'Alphanumeric Only',
          pattern: '^[a-zA-Z0-9]+$',
          description: 'Matches only letters and numbers',
          examples: ['abc123', 'Test', '123'],
          flags: ''
        }
      ]
    },
    
    web: {
      name: 'Web & Programming',
      patterns: [
        {
          id: 'html-tag',
          name: 'HTML Tag',
          pattern: '<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)',
          description: 'Matches HTML tags',
          examples: ['<div>content</div>', '<img src="..." />'],
          flags: 'gi'
        },
        {
          id: 'css-hex',
          name: 'CSS Hex Color',
          pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b',
          description: 'Matches CSS hex color values',
          examples: ['#FF5733', '#abc'],
          flags: 'gi'
        },
        {
          id: 'js-comment',
          name: 'JavaScript Comment',
          pattern: '(?:\\/\\/.*$|\\/\\*[\\s\\S]*?\\*\\/)',
          description: 'Matches JS single and multi-line comments',
          examples: ['// comment', '/* multi\\nline */'],
          flags: 'gm'
        },
        {
          id: 'variable-name',
          name: 'Variable Name',
          pattern: '^[a-zA-Z_$][a-zA-Z0-9_$]*$',
          description: 'Valid JavaScript/Python variable name',
          examples: ['myVariable', '_private', '$jquery'],
          flags: ''
        }
      ]
    }
  };
  
  /**
   * Initialize the pattern library
   */
  init(containerId, onPatternSelectCallback) {
    this.onPatternSelect = onPatternSelectCallback;
    this.container = this.createLibraryUI();
    
    // Insert into specified container
    const targetContainer = document.getElementById(containerId);
    if (targetContainer) {
      targetContainer.appendChild(this.container);
    }
    
    // Set up event listeners
    this.attachEventListeners();
    
    // Initial render
    this.renderPatterns();
  }
  
  /**
   * Create the library UI
   */
  createLibraryUI() {
    const container = document.createElement('div');
    container.className = 'pattern-library-section';
    container.innerHTML = `
      <div class="library-header">
        <h2>Pattern Library</h2>
        <button class="library-toggle" id="library-toggle">
          <span class="toggle-text">Show Library</span>
          <span class="toggle-icon">▶</span>
        </button>
      </div>
      
      <div class="library-content" id="library-content" style="display: none;">
        <div class="library-controls">
          <div class="library-search">
            <input type="text" 
                   id="pattern-search" 
                   placeholder="Search patterns..."
                   autocomplete="off">
          </div>
          
          <div class="library-categories">
            <button class="category-btn active" data-category="all">All</button>
            <button class="category-btn" data-category="validation">Validation</button>
            <button class="category-btn" data-category="phone">Phone</button>
            <button class="category-btn" data-category="dates">Dates</button>
            <button class="category-btn" data-category="numbers">Numbers</button>
            <button class="category-btn" data-category="text">Text</button>
            <button class="category-btn" data-category="web">Web</button>
            <button class="category-btn" data-category="custom">My Patterns</button>
          </div>
        </div>
        
        <div class="pattern-list" id="pattern-list">
          <!-- Patterns will be rendered here -->
        </div>
        
        <div class="library-actions">
          <button class="btn-save-current" id="save-current-pattern">
            <span class="btn-icon">+</span>
            Save Current Pattern
          </button>
        </div>
      </div>
    `;
    
    return container;
  }
  
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Toggle library
    const toggleBtn = document.getElementById('library-toggle');
    toggleBtn.addEventListener('click', () => this.toggleLibrary());
    
    // Category buttons
    const categoryBtns = this.container.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedCategory = btn.dataset.category;
        
        // Update active state
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        this.renderPatterns();
      });
    });
    
    // Search
    this.searchInput = document.getElementById('pattern-search');
    this.searchInput.addEventListener('input', () => this.renderPatterns());
    
    // Save current pattern
    document.getElementById('save-current-pattern').addEventListener('click', () => {
      this.saveCurrentPattern();
    });
    
    // Pattern list container
    this.patternList = document.getElementById('pattern-list');
  }
  
  /**
   * Toggle library visibility
   */
  toggleLibrary() {
    this.isExpanded = !this.isExpanded;
    const content = document.getElementById('library-content');
    const toggleText = this.container.querySelector('.toggle-text');
    const toggleIcon = this.container.querySelector('.toggle-icon');
    
    if (this.isExpanded) {
      content.style.display = 'block';
      toggleText.textContent = 'Hide Library';
      toggleIcon.textContent = '▼';
    } else {
      content.style.display = 'none';
      toggleText.textContent = 'Show Library';
      toggleIcon.textContent = '▶';
    }
  }
  
  /**
   * Render patterns based on category and search
   */
  renderPatterns() {
    const searchTerm = this.searchInput.value.toLowerCase();
    let patterns = [];
    
    if (this.selectedCategory === 'all') {
      // Get all patterns
      Object.values(this.commonPatterns).forEach(category => {
        patterns = patterns.concat(category.patterns);
      });
    } else if (this.selectedCategory === 'custom') {
      // Get custom patterns
      patterns = this.customPatterns;
    } else {
      // Get specific category
      const category = this.commonPatterns[this.selectedCategory];
      if (category) {
        patterns = category.patterns;
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      patterns = patterns.filter(pattern => 
        pattern.name.toLowerCase().includes(searchTerm) ||
        pattern.description.toLowerCase().includes(searchTerm) ||
        pattern.pattern.toLowerCase().includes(searchTerm)
      );
    }
    
    // Render patterns
    this.patternList.innerHTML = patterns.length > 0 
      ? patterns.map(pattern => this.renderPattern(pattern)).join('')
      : '<div class="no-patterns">No patterns found</div>';
    
    // Attach pattern click handlers
    this.attachPatternHandlers();
  }
  
  /**
   * Render a single pattern
   */
  renderPattern(pattern) {
    const isCustom = pattern.custom === true;
    
    return `
      <div class="pattern-item" data-pattern-id="${pattern.id}">
        <div class="pattern-header">
          <h4 class="pattern-name">${this.escapeHtml(pattern.name)}</h4>
          ${isCustom ? '<span class="pattern-badge">Custom</span>' : ''}
        </div>
        
        <div class="pattern-description">
          ${this.escapeHtml(pattern.description)}
        </div>
        
        <div class="pattern-code">
          <code>${this.escapeHtml(pattern.pattern)}</code>
          ${pattern.flags ? `<span class="pattern-flags">/${pattern.flags}/</span>` : ''}
        </div>
        
        ${pattern.examples && pattern.examples.length > 0 ? `
          <div class="pattern-examples">
            <span class="examples-label">Examples:</span>
            ${pattern.examples.map(ex => 
              `<span class="example-item">${this.escapeHtml(ex)}</span>`
            ).join(', ')}
          </div>
        ` : ''}
        
        <div class="pattern-actions">
          <button class="btn-use-pattern" data-pattern="${this.escapeHtml(pattern.pattern)}" data-flags="${pattern.flags || ''}">
            Use Pattern
          </button>
          ${isCustom ? `
            <button class="btn-delete-pattern" data-id="${pattern.id}">
              Delete
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }
  
  /**
   * Attach handlers to pattern buttons
   */
  attachPatternHandlers() {
    // Use pattern buttons
    const useButtons = this.patternList.querySelectorAll('.btn-use-pattern');
    useButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const pattern = btn.dataset.pattern;
        const flags = btn.dataset.flags;
        this.usePattern(pattern, flags);
      });
    });
    
    // Delete buttons for custom patterns
    const deleteButtons = this.patternList.querySelectorAll('.btn-delete-pattern');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        this.deleteCustomPattern(id);
      });
    });
  }
  
  /**
   * Use a pattern - insert it into the regex input
   */
  usePattern(pattern, flags) {
    // Call the callback if provided
    if (this.onPatternSelect) {
      this.onPatternSelect(pattern, flags);
    } else {
      // Fallback to direct DOM manipulation
      const regexInput = document.getElementById('regex-input');
      const regexFlags = document.getElementById('regex-flags');
      
      if (regexInput && regexFlags) {
        regexInput.value = pattern;
        regexFlags.value = flags || '';
        
        // Trigger input events to update the app
        regexInput.dispatchEvent(new Event('input', { bubbles: true }));
        regexFlags.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Scroll to regex input
        regexInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Flash the input to show it was updated
        regexInput.classList.add('pattern-applied');
        setTimeout(() => {
          regexInput.classList.remove('pattern-applied');
        }, 1000);
      }
    }
  }
  
  /**
   * Save the current pattern to custom patterns
   */
  saveCurrentPattern() {
    const regexInput = document.getElementById('regex-input');
    const regexFlags = document.getElementById('regex-flags');
    const testInput = document.getElementById('test-input');
    
    if (!regexInput || !regexInput.value) {
      alert('Please enter a pattern first');
      return;
    }
    
    // Show save dialog
    const dialog = this.createSaveDialog();
    document.body.appendChild(dialog);
    
    // Handle save
    const saveBtn = dialog.querySelector('#save-pattern-btn');
    const cancelBtn = dialog.querySelector('#cancel-save-btn');
    const nameInput = dialog.querySelector('#pattern-name-input');
    const descInput = dialog.querySelector('#pattern-desc-input');
    
    saveBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      const description = descInput.value.trim();
      
      if (!name) {
        alert('Please enter a pattern name');
        return;
      }
      
      // Create custom pattern
      const customPattern = {
        id: 'custom-' + Date.now(),
        name: name,
        description: description || 'Custom pattern',
        pattern: regexInput.value,
        flags: regexFlags.value,
        examples: testInput.value ? [testInput.value.substring(0, 50)] : [],
        custom: true,
        created: new Date().toISOString()
      };
      
      // Save to custom patterns
      this.customPatterns.push(customPattern);
      this.saveCustomPatterns();
      
      // Close dialog
      document.body.removeChild(dialog);
      
      // Switch to custom category and refresh
      this.selectedCategory = 'custom';
      document.querySelector('[data-category="custom"]').click();
    });
    
    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(dialog);
    });
    
    // Focus name input
    nameInput.focus();
  }
  
  /**
   * Create save pattern dialog
   */
  createSaveDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'save-pattern-dialog-overlay';
    dialog.innerHTML = `
      <div class="save-pattern-dialog">
        <h3>Save Pattern to Library</h3>
        
        <div class="dialog-content">
          <div class="form-group">
            <label for="pattern-name-input">Pattern Name:</label>
            <input type="text" 
                   id="pattern-name-input" 
                   placeholder="e.g., Email Validation"
                   autocomplete="off">
          </div>
          
          <div class="form-group">
            <label for="pattern-desc-input">Description:</label>
            <textarea id="pattern-desc-input" 
                      rows="3" 
                      placeholder="What does this pattern match?"></textarea>
          </div>
        </div>
        
        <div class="dialog-actions">
          <button class="btn-secondary" id="cancel-save-btn">Cancel</button>
          <button class="btn-primary" id="save-pattern-btn">Save Pattern</button>
        </div>
      </div>
    `;
    
    return dialog;
  }
  
  /**
   * Delete a custom pattern
   */
  deleteCustomPattern(id) {
    if (confirm('Are you sure you want to delete this pattern?')) {
      this.customPatterns = this.customPatterns.filter(p => p.id !== id);
      this.saveCustomPatterns();
      this.renderPatterns();
    }
  }
  
  /**
   * Load custom patterns from localStorage
   */
  loadCustomPatterns() {
    try {
      const saved = localStorage.getItem('customRegexPatterns');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load custom patterns:', error);
      return [];
    }
  }
  
  /**
   * Save custom patterns to localStorage
   */
  saveCustomPatterns() {
    try {
      localStorage.setItem('customRegexPatterns', JSON.stringify(this.customPatterns));
    } catch (error) {
      console.error('Failed to save custom patterns:', error);
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

// Add CSS for pattern library
const libraryStyles = `
<style>
.pattern-library-section {
  background: #ecf0f1;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 20px 0;
  overflow: hidden;
}

.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #ecf0f1;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.library-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.library-toggle {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  color: #2c3e50;
  font-size: 14px;
}

.library-toggle:hover {
  color: #3498db;
}

.toggle-icon {
  font-size: 12px;
  transition: transform 0.2s;
}

.library-content {
  padding: 20px;
}

.library-controls {
  margin-bottom: 20px;
}

.library-search {
  margin-bottom: 15px;
}

#pattern-search {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 2px solid #ddd;
  border-radius: 4px;
  background: white;
}

#pattern-search:focus {
  outline: none;
  border-color: #3498db;
}

.library-categories {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.category-btn {
  padding: 6px 12px;
  font-size: 13px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn:hover {
  background: #ecf0f1;
  border-color: #95a5a6;
}

.category-btn.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.pattern-list {
  display: grid;
  gap: 15px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;
}

.pattern-item {
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  transition: box-shadow 0.2s;
}

.pattern-item:hover {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.pattern-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.pattern-name {
  margin: 0;
  font-size: 16px;
  color: #2c3e50;
}

.pattern-badge {
  font-size: 11px;
  padding: 2px 6px;
  background: #7f8c8d;
  color: white;
  border-radius: 3px;
}

.pattern-description {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 10px;
}

.pattern-code {
  background: #ecf0f1;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 10px;
  font-family: monospace;
  font-size: 13px;
  word-break: break-all;
}

.pattern-code code {
  color: #e74c3c;
}

.pattern-flags {
  color: #7f8c8d;
  margin-left: 5px;
}

.pattern-examples {
  font-size: 13px;
  margin-bottom: 10px;
  color: #2c3e50;
}

.examples-label {
  font-weight: 600;
  margin-right: 5px;
}

.example-item {
  background: #ecf0f1;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 12px;
}

.pattern-actions {
  display: flex;
  gap: 10px;
}

.btn-use-pattern,
.btn-delete-pattern {
  padding: 6px 12px;
  font-size: 13px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-use-pattern {
  background: #27ae60;
  color: white;
}

.btn-use-pattern:hover {
  background: #229954;
}

.btn-delete-pattern {
  background: #e74c3c;
  color: white;
}

.btn-delete-pattern:hover {
  background: #c0392b;
}

.no-patterns {
  text-align: center;
  color: #7f8c8d;
  padding: 40px 20px;
  font-style: italic;
}

.library-actions {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.btn-save-current {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-save-current:hover {
  background: #2980b9;
}

.btn-icon {
  font-size: 18px;
  font-weight: bold;
}

/* Pattern applied animation */
.pattern-applied {
  animation: patternFlash 1s ease;
}

@keyframes patternFlash {
  0%, 100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
  50% { box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.5); }
}

/* Save dialog */
.save-pattern-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.save-pattern-dialog {
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.save-pattern-dialog h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
}

.dialog-content {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 2px solid #ddd;
  border-radius: 4px;
  background: white;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
}

.dialog-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-secondary {
  background: #7f8c8d;
  color: white;
}

.btn-secondary:hover {
  background: #34495e;
}

/* Dark theme adjustments */
body.dark-theme .pattern-library-section {
  background: #2b2b2b;
  border-color: #444;
}

body.dark-theme .library-header {
  background: #1e1e1e;
  border-color: #444;
}

body.dark-theme .library-header h2,
body.dark-theme .library-toggle {
  color: #e0e0e0;
}

body.dark-theme #pattern-search {
  background: #1e1e1e;
  border-color: #444;
  color: #e0e0e0;
}

body.dark-theme .category-btn {
  background: #2b2b2b;
  border-color: #444;
  color: #e0e0e0;
}

body.dark-theme .category-btn:hover {
  background: #333;
}

body.dark-theme .category-btn.active {
  background: #3498db;
  color: white;
}

body.dark-theme .pattern-item {
  background: #1e1e1e;
  border-color: #444;
}

body.dark-theme .pattern-name {
  color: #e0e0e0;
}

body.dark-theme .pattern-code {
  background: #2b2b2b;
}

body.dark-theme .example-item {
  background: #2b2b2b;
}

body.dark-theme .save-pattern-dialog {
  background: #2b2b2b;
  color: #e0e0e0;
}

body.dark-theme .form-group input,
body.dark-theme .form-group textarea {
  background: #1e1e1e;
  border-color: #444;
  color: #e0e0e0;
}

/* Scrollbar styling */
.pattern-list::-webkit-scrollbar {
  width: 8px;
}

.pattern-list::-webkit-scrollbar-track {
  background: #ecf0f1;
  border-radius: 4px;
}

.pattern-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.pattern-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

body.dark-theme .pattern-list::-webkit-scrollbar-track {
  background: #2b2b2b;
}

body.dark-theme .pattern-list::-webkit-scrollbar-thumb {
  background: #555;
}

body.dark-theme .pattern-list::-webkit-scrollbar-thumb:hover {
  background: #777;
}
</style>
`;

// Inject styles
if (!document.getElementById('pattern-library-styles')) {
  const styleElement = document.createElement('div');
  styleElement.id = 'pattern-library-styles';
  styleElement.innerHTML = libraryStyles;
  document.head.appendChild(styleElement.firstChild);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PatternLibrary;
}