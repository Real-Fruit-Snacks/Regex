const modeHelpContent = {
    javascript: {
        basics: {
            title: "JavaScript Regex Basics",
            items: [
                {
                    title: "Literal Characters",
                    description: "Most characters match themselves literally.",
                    pattern: "hello",
                    text: "hello world",
                    explanation: "Matches 'hello' in 'hello world'"
                },
                {
                    title: "Case Sensitivity",
                    description: "Use the 'i' flag for case-insensitive matching.",
                    pattern: "Hello",
                    text: "hello world",
                    flags: "i",
                    explanation: "/Hello/i matches 'hello' (case-insensitive)"
                },
                {
                    title: "Global Matching",
                    description: "Use the 'g' flag to find all matches.",
                    pattern: "\\d+",
                    text: "Age: 25, Score: 100, ID: 42",
                    flags: "g",
                    explanation: "Finds all number sequences: 25, 100, 42"
                }
            ]
        },
        metacharacters: {
            title: "Metacharacters",
            items: [
                {
                    title: ". (Dot)",
                    description: "Matches any single character except newline.",
                    pattern: "h.llo",
                    text: "hello hallo hullo",
                    explanation: "Matches 'hello', 'hallo', 'hullo'"
                },
                {
                    title: "\\d (Digit)",
                    description: "Matches any digit 0-9.",
                    pattern: "\\d{3}",
                    text: "Call 555-1234 or 911",
                    flags: "g",
                    explanation: "Matches '555' and '911'"
                },
                {
                    title: "\\w (Word Character)",
                    description: "Matches letters, digits, and underscores.",
                    pattern: "\\w+",
                    text: "hello_world 123",
                    flags: "g",
                    explanation: "Matches 'hello_world' and '123'"
                },
                {
                    title: "| (Alternation)",
                    description: "Acts like OR - matches either pattern.",
                    pattern: "cat|dog",
                    text: "I have a cat and a dog",
                    flags: "g",
                    explanation: "Matches 'cat' and 'dog'"
                }
            ]
        },
        quantifiers: {
            title: "Quantifiers",
            items: [
                {
                    title: "* (Zero or more)",
                    description: "Matches 0 or more occurrences.",
                    pattern: "ab*c",
                    text: "ac abc abbc abbbc",
                    flags: "g",
                    explanation: "Matches 'ac', 'abc', 'abbc', etc."
                },
                {
                    title: "+ (One or more)",
                    description: "Matches 1 or more occurrences.",
                    pattern: "ab+c",
                    text: "ac abc abbc abbbc",
                    flags: "g",
                    explanation: "Matches 'abc', 'abbc', but not 'ac'"
                },
                {
                    title: "? (Zero or one)",
                    description: "Matches 0 or 1 occurrence.",
                    pattern: "colou?r",
                    text: "color colour",
                    flags: "g",
                    explanation: "Matches both 'color' and 'colour'"
                },
                {
                    title: "{n,m} (Range)",
                    description: "Matches between n and m occurrences.",
                    pattern: "a{2,4}",
                    text: "a aa aaa aaaa aaaaa",
                    flags: "g",
                    explanation: "Matches 'aa', 'aaa', 'aaaa'"
                }
            ]
        },
        advanced: {
            title: "Advanced Features",
            items: [
                {
                    title: "Lookahead (?=...)",
                    description: "Positive lookahead - matches if followed by pattern.",
                    pattern: "\\d+(?=\\$)",
                    text: "Price: 100$ not 100€",
                    flags: "g",
                    explanation: "Matches digits only if followed by $"
                },
                {
                    title: "Named Groups (?<name>...)",
                    description: "Capture groups with names for easier access.",
                    pattern: "(?<year>\\d{4})-(?<month>\\d{2})",
                    text: "2023-12-25",
                    explanation: "Creates named groups 'year' and 'month'"
                }
            ]
        }
    },
    pcre: {
        basics: {
            title: "PCRE Basics",
            items: [
                {
                    title: "Basic Matching",
                    description: "PCRE supports standard regex features plus extensions.",
                    pattern: "hello",
                    text: "hello world",
                    explanation: "Basic matching works like JavaScript"
                },
                {
                    title: "Inline Case Modifier",
                    description: "Use (?i) for case-insensitive matching.",
                    pattern: "(?i)hello",
                    text: "Hello HELLO hello",
                    flags: "g",
                    explanation: "(?i) makes the pattern case-insensitive"
                },
                {
                    title: "Inline Multiline Modifier",
                    description: "Use (?m) for multiline mode.",
                    pattern: "(?m)^start",
                    text: "line1\\nstart here\\nend",
                    flags: "g",
                    explanation: "(?m) makes ^ match line boundaries"
                }
            ]
        },
        metacharacters: {
            title: "PCRE Metacharacters",
            items: [
                {
                    title: "Word Boundaries",
                    description: "\\b matches word boundaries.",
                    pattern: "\\bword\\b",
                    text: "word sword words",
                    flags: "g",
                    explanation: "Matches only complete 'word', not parts"
                },
                {
                    title: "Unicode Categories",
                    description: "\\p{L} matches any Unicode letter.",
                    pattern: "\\p{L}+",
                    text: "café naïve résumé",
                    flags: "g",
                    explanation: "Matches Unicode letters including accented chars"
                }
            ]
        },
        advanced: {
            title: "PCRE Advanced Features",
            items: [
                {
                    title: "Possessive Quantifiers",
                    description: "Use ++ for possessive (no backtracking) quantifiers.",
                    pattern: "a++b",
                    text: "aaab aaac",
                    explanation: "Warning: Possessive quantifiers not fully supported in JS simulation"
                },
                {
                    title: "Named Groups",
                    description: "Use (?P<name>...) or (?<name>...) for named groups.",
                    pattern: "(?P<word>\\w+)",
                    text: "hello world",
                    flags: "g",
                    explanation: "Creates named group 'word'"
                }
            ]
        }
    },
    grep: {
        basics: {
            title: "grep (BRE) Basics",
            items: [
                {
                    title: "Literal Characters",
                    description: "Most characters match literally in BRE.",
                    pattern: "hello",
                    text: "hello world",
                    explanation: "Simple literal matching"
                },
                {
                    title: "Escaped Groups",
                    description: "Use \\( \\) for capturing groups in BRE.",
                    pattern: "\\(hello\\)",
                    text: "hello world",
                    explanation: "Creates a capturing group"
                },
                {
                    title: "Literal Parentheses",
                    description: "Unescaped ( ) are literal characters in BRE.",
                    pattern: "(test)",
                    text: "This is a (test) case",
                    explanation: "Matches literal '(test)' including parentheses"
                }
            ]
        },
        metacharacters: {
            title: "BRE Metacharacters",
            items: [
                {
                    title: "Character Classes",
                    description: "Use [0-9] instead of \\d in BRE.",
                    pattern: "[0-9]\\+",
                    text: "Age: 25, Score: 100",
                    flags: "g",
                    explanation: "Matches number sequences (note: \\+ for one-or-more)"
                },
                {
                    title: "Word Characters",
                    description: "Use [a-zA-Z_] instead of \\w in BRE.",
                    pattern: "[a-zA-Z_]\\+",
                    text: "hello_world 123",
                    flags: "g",
                    explanation: "Matches word characters (letters and underscore)"
                },
                {
                    title: "Escaped Quantifiers",
                    description: "Quantifiers + ? must be escaped in BRE.",
                    pattern: "ab\\+",
                    text: "a ab abb abbb",
                    flags: "g",
                    explanation: "\\+ means one-or-more in BRE"
                }
            ]
        },
        advanced: {
            title: "BRE Advanced",
            items: [
                {
                    title: "Range Quantifiers",
                    description: "Use \\{n,m\\} for range quantifiers.",
                    pattern: "a\\{2,4\\}",
                    text: "a aa aaa aaaa aaaaa",
                    flags: "g",
                    explanation: "Matches 2-4 consecutive 'a' characters"
                },
                {
                    title: "Escaped Alternation",
                    description: "Use \\| for alternation in BRE.",
                    pattern: "cat\\|dog",
                    text: "I have a cat and a dog",
                    flags: "g",
                    explanation: "Matches either 'cat' or 'dog'"
                }
            ]
        },
        warnings: {
            title: "BRE Limitations",
            items: [
                {
                    title: "No Modern Shortcuts",
                    description: "BRE doesn't support \\d, \\w, \\s shortcuts.",
                    pattern: "\\d+",
                    text: "This will cause an error",
                    explanation: "Error: Use [0-9] instead of \\d in BRE"
                },
                {
                    title: "No Lookaheads",
                    description: "BRE doesn't support modern features like lookaheads.",
                    pattern: "(?=test)",
                    text: "This will cause an error",
                    explanation: "Error: BRE doesn't support lookaheads"
                }
            ]
        }
    },
    egrep: {
        basics: {
            title: "egrep (ERE) Basics",
            items: [
                {
                    title: "Literal Characters",
                    description: "Basic matching works like BRE.",
                    pattern: "hello",
                    text: "hello world",
                    explanation: "Simple literal matching"
                },
                {
                    title: "Unescaped Groups",
                    description: "Use ( ) for groups in ERE - no escaping needed.",
                    pattern: "(hello)",
                    text: "hello world",
                    explanation: "Creates a capturing group"
                },
                {
                    title: "Unescaped Quantifiers",
                    description: "Quantifiers + ? work without escaping in ERE.",
                    pattern: "ab+",
                    text: "a ab abb abbb",
                    flags: "g",
                    explanation: "+ means one-or-more (no escaping needed)"
                }
            ]
        },
        metacharacters: {
            title: "ERE Metacharacters",
            items: [
                {
                    title: "Character Classes",
                    description: "Use [0-9] for digits - no \\d shortcut in ERE.",
                    pattern: "[0-9]+",
                    text: "Age: 25, Score: 100",
                    flags: "g",
                    explanation: "Matches number sequences"
                },
                {
                    title: "Alternation",
                    description: "Use | for alternation - no escaping needed.",
                    pattern: "cat|dog",
                    text: "I have a cat and a dog",
                    flags: "g",
                    explanation: "Matches either 'cat' or 'dog'"
                },
                {
                    title: "Range Quantifiers",
                    description: "Use {n,m} for range quantifiers - no escaping needed.",
                    pattern: "a{2,4}",
                    text: "a aa aaa aaaa aaaaa",
                    flags: "g",
                    explanation: "Matches 2-4 consecutive 'a' characters"
                }
            ]
        },
        advanced: {
            title: "ERE Features",
            items: [
                {
                    title: "Complex Alternation",
                    description: "ERE makes complex patterns more readable.",
                    pattern: "(http|https|ftp)://[a-zA-Z0-9.-]+",
                    text: "Visit http://example.com or https://secure.net",
                    flags: "g",
                    explanation: "Matches URLs with different protocols"
                }
            ]
        },
        warnings: {
            title: "ERE Limitations",
            items: [
                {
                    title: "No Modern Shortcuts",
                    description: "ERE still doesn't support \\d, \\w, \\s shortcuts.",
                    pattern: "\\d+",
                    text: "This will cause an error",
                    explanation: "Error: Use [0-9] instead of \\d in ERE"
                },
                {
                    title: "No Lookaheads",
                    description: "ERE doesn't support modern features like lookaheads.",
                    pattern: "(?=test)",
                    text: "This will cause an error",
                    explanation: "Error: ERE doesn't support lookaheads"
                }
            ]
        }
    },
    vim: {
        basics: {
            title: "Vim Regex Basics",
            items: [
                {
                    title: "Default Magic Mode",
                    description: "Vim uses 'magic' mode by default - some escaping needed.",
                    pattern: "hello",
                    text: "hello world",
                    explanation: "Literal characters work normally"
                },
                {
                    title: "Escaped Groups",
                    description: "Use \\( \\) for groups in default magic mode.",
                    pattern: "\\(test\\)",
                    text: "This is a test case",
                    explanation: "Creates a capturing group in default mode"
                },
                {
                    title: "Very Magic Mode",
                    description: "Use \\v prefix for ERE-like syntax.",
                    pattern: "\\v(test)+",
                    text: "testtest case",
                    explanation: "\\v enables very magic - no escaping needed for ( ) +"
                }
            ]
        },
        metacharacters: {
            title: "Vim Magic Modes",
            items: [
                {
                    title: "Case Insensitive",
                    description: "Use \\c anywhere for case-insensitive matching.",
                    pattern: "\\chello",
                    text: "Hello HELLO hello",
                    flags: "g",
                    explanation: "\\c makes pattern case-insensitive"
                },
                {
                    title: "Very Nomagic Mode",
                    description: "Use \\V for very nomagic - almost everything literal.",
                    pattern: "\\V(test)",
                    text: "This is a (test) case",
                    explanation: "\\V makes ( ) literal - matches parentheses"
                },
                {
                    title: "Case Sensitive Override",
                    description: "Use \\C to force case sensitivity.",
                    pattern: "\\Chello",
                    text: "Hello hello",
                    flags: "g",
                    explanation: "\\C forces case-sensitive matching"
                }
            ]
        },
        advanced: {
            title: "Vim Advanced Features",
            items: [
                {
                    title: "Very Magic Grouping",
                    description: "\\v mode makes complex patterns cleaner.",
                    pattern: "\\v(http|https)://([a-zA-Z0-9.-]+)",
                    text: "Visit http://example.com",
                    explanation: "\\v allows ( ) | without escaping"
                },
                {
                    title: "Lazy Quantifiers",
                    description: "Use \\{-} for lazy (non-greedy) quantifiers.",
                    pattern: "<.\\{-}>",
                    text: "<tag>content</tag>",
                    flags: "g",
                    explanation: "\\{-} is lazy version of * quantifier"
                }
            ]
        },
        warnings: {
            title: "Vim Magic Confusion",
            items: [
                {
                    title: "Magic Mode Dependencies",
                    description: "Pattern behavior changes based on magic mode.",
                    pattern: "(test) vs \\(test\\) vs \\v(test)",
                    text: "Different behaviors in different modes",
                    explanation: "Always be aware of current magic mode setting"
                }
            ]
        }
    },
    python: {
        basics: {
            title: "Python re Module Basics",
            items: [
                {
                    title: "Basic Matching",
                    description: "Python regex syntax is similar to JavaScript.",
                    pattern: "hello",
                    text: "hello world",
                    explanation: "Simple literal matching with re.search()"
                },
                {
                    title: "Raw Strings",
                    description: "Always use raw strings for regex patterns in Python.",
                    pattern: "r'\\d+'",
                    text: "Age: 25, Score: 100",
                    explanation: "Raw strings prevent double-escaping issues"
                },
                {
                    title: "Multiple Matches",
                    description: "Use findall() or finditer() for multiple matches.",
                    pattern: "\\d+",
                    text: "Age: 25, Score: 100",
                    flags: "g",
                    explanation: "Python uses re.findall() not 'g' flag"
                }
            ]
        },
        metacharacters: {
            title: "Python Regex Features",
            items: [
                {
                    title: "Standard Metacharacters",
                    description: "All standard regex features work in Python.",
                    pattern: "\\d+",
                    text: "Age: 25",
                    explanation: "\\d matches digits like in JavaScript"
                },
                {
                    title: "Named Groups",
                    description: "Python uses (?P<name>...) syntax for named groups.",
                    pattern: "(?P<year>\\d{4})-(?P<month>\\d{2})",
                    text: "Date: 2023-12",
                    explanation: "Access with match.group('year')"
                },
                {
                    title: "Unicode Support",
                    description: "Python 3 has excellent Unicode support.",
                    pattern: "[\\u0100-\\u017F]+",
                    text: "Café naïve résumé",
                    flags: "g",
                    explanation: "Matches Latin Extended-A characters"
                }
            ]
        },
        advanced: {
            title: "Python Advanced Features",
            items: [
                {
                    title: "Verbose Mode",
                    description: "Use re.VERBOSE for readable patterns.",
                    pattern: "\\d{3}  # area code\\n-\\d{3}  # exchange\\n-\\d{4}  # number",
                    text: "555-123-4567",
                    explanation: "re.VERBOSE allows comments and whitespace"
                },
                {
                    title: "Compiled Patterns",
                    description: "Compile patterns for better performance.",
                    pattern: "\\w+@\\w+\\.\\w+",
                    text: "Contact: user@example.com",
                    explanation: "Use re.compile() for repeated use"
                }
            ]
        },
        warnings: {
            title: "Python-Specific Notes",
            items: [
                {
                    title: "Flag Usage",
                    description: "Python uses constants, not inline flags.",
                    pattern: "hello",
                    text: "Use re.I, re.M, re.S as function arguments",
                    explanation: "re.search(pattern, text, re.I | re.M)"
                }
            ]
        }
    },
    sed: {
        basics: {
            title: "sed Regex Basics",
            items: [
                {
                    title: "Basic Substitution",
                    description: "sed is primarily used for text substitution.",
                    pattern: "s/old/new/",
                    text: "This is old text",
                    explanation: "Replaces first occurrence of 'old' with 'new'"
                },
                {
                    title: "Global Substitution",
                    description: "Use g flag for global replacement.",
                    pattern: "s/old/new/g",
                    text: "old text with old values",
                    explanation: "Replaces all occurrences in each line"
                },
                {
                    title: "BRE Syntax",
                    description: "sed uses BRE syntax like grep.",
                    pattern: "\\(.*\\)",
                    text: "content",
                    explanation: "Groups must be escaped: \\( \\)"
                }
            ]
        },
        metacharacters: {
            title: "sed BRE Features",
            items: [
                {
                    title: "Escaped Groups and Backreferences",
                    description: "Use \\( \\) for groups and \\1 for backreferences.",
                    pattern: "s/\\(.*\\)/[\\1]/",
                    text: "content",
                    explanation: "Wraps content in brackets using backreference"
                },
                {
                    title: "Character Classes",
                    description: "Use [0-9] instead of \\d in sed.",
                    pattern: "s/[0-9]\\+/NUMBER/g",
                    text: "Age: 25, Score: 100",
                    explanation: "Replaces all numbers with 'NUMBER'"
                },
                {
                    title: "Line Anchors",
                    description: "Use ^ and $ for line boundaries.",
                    pattern: "s/^/> /",
                    text: "line of text",
                    explanation: "Adds '> ' to beginning of line"
                }
            ]
        },
        advanced: {
            title: "sed Advanced Features",
            items: [
                {
                    title: "Address Ranges",
                    description: "Apply patterns to specific lines.",
                    pattern: "1,5s/old/new/g",
                    text: "Process only lines 1-5",
                    explanation: "Substitution only on specified line range"
                },
                {
                    title: "Delete Patterns",
                    description: "Use /pattern/d to delete matching lines.",
                    pattern: "/^$/d",
                    text: "line1\\n\\nline3",
                    explanation: "Deletes empty lines"
                }
            ]
        },
        warnings: {
            title: "sed Limitations",
            items: [
                {
                    title: "BRE Only",
                    description: "sed uses BRE syntax by default.",
                    pattern: "\\d+",
                    text: "This will cause an error",
                    explanation: "Error: Use [0-9]\\+ instead of \\d+ in sed"
                },
                {
                    title: "Line-Based Processing",
                    description: "sed processes one line at a time.",
                    pattern: "s/pattern/replacement/",
                    text: "Each line processed separately",
                    explanation: "Patterns don't cross line boundaries by default"
                }
            ]
        }
    }
};

// Quick reference data for each mode - Updated for accuracy
const quickReference = {
    javascript: [
        { pattern: ".", desc: "Any character except newline" },
        { pattern: "\\d", desc: "Any digit (0-9)" },
        { pattern: "\\w", desc: "Word character (a-z, A-Z, 0-9, _)" },
        { pattern: "\\s", desc: "Whitespace character" },
        { pattern: "*", desc: "Zero or more" },
        { pattern: "+", desc: "One or more" },
        { pattern: "?", desc: "Zero or one" },
        { pattern: "{n,m}", desc: "Between n and m occurrences" },
        { pattern: "^", desc: "Start of string/line" },
        { pattern: "$", desc: "End of string/line" },
        { pattern: "()", desc: "Capturing group" },
        { pattern: "(?:)", desc: "Non-capturing group" },
        { pattern: "(?=)", desc: "Positive lookahead" },
        { pattern: "(?!)", desc: "Negative lookahead" },
        { pattern: "|", desc: "Alternation (OR)" }
    ],
    pcre: [
        { pattern: ".", desc: "Any character except newline" },
        { pattern: "\\d", desc: "Any digit" },
        { pattern: "\\w", desc: "Word character" },
        { pattern: "\\b", desc: "Word boundary" },
        { pattern: "(?i)", desc: "Case insensitive modifier" },
        { pattern: "(?m)", desc: "Multiline modifier" },
        { pattern: "(?s)", desc: "Dotall modifier" },
        { pattern: "(?x)", desc: "Extended (ignore whitespace)" },
        { pattern: "*+", desc: "Possessive zero or more" },
        { pattern: "++", desc: "Possessive one or more" },
        { pattern: "?+", desc: "Possessive zero or one" },
        { pattern: "(?P<name>)", desc: "Named group" },
        { pattern: "(?<=)", desc: "Positive lookbehind" },
        { pattern: "(?<!)", desc: "Negative lookbehind" }
    ],
    grep: [
        { pattern: ".", desc: "Any character except newline" },
        { pattern: "*", desc: "Zero or more of preceding" },
        { pattern: "\\+", desc: "One or more (escaped)" },
        { pattern: "\\?", desc: "Zero or one (escaped)" },
        { pattern: "\\{n,m\\}", desc: "Range quantifier (escaped)" },
        { pattern: "^", desc: "Start of line" },
        { pattern: "$", desc: "End of line" },
        { pattern: "[abc]", desc: "Character class" },
        { pattern: "[^abc]", desc: "Negated character class" },
        { pattern: "[0-9]", desc: "Digits (use instead of \\d)" },
        { pattern: "[a-zA-Z_]", desc: "Word chars (use instead of \\w)" },
        { pattern: "\\(\\)", desc: "Grouping (escaped)" },
        { pattern: "\\|", desc: "Alternation (escaped)" },
        { pattern: "\\<", desc: "Start of word" },
        { pattern: "\\>", desc: "End of word" }
    ],
    egrep: [
        { pattern: ".", desc: "Any character except newline" },
        { pattern: "*", desc: "Zero or more" },
        { pattern: "+", desc: "One or more" },
        { pattern: "?", desc: "Zero or one" },
        { pattern: "{n,m}", desc: "Range quantifier" },
        { pattern: "^", desc: "Start of line" },
        { pattern: "$", desc: "End of line" },
        { pattern: "()", desc: "Grouping" },
        { pattern: "|", desc: "Alternation" },
        { pattern: "[abc]", desc: "Character class" },
        { pattern: "[^abc]", desc: "Negated character class" },
        { pattern: "[0-9]", desc: "Digits (use instead of \\d)" },
        { pattern: "[a-zA-Z_]", desc: "Word chars (use instead of \\w)" },
        { pattern: "\\<", desc: "Start of word" },
        { pattern: "\\>", desc: "End of word" }
    ],
    vim: [
        { pattern: ".", desc: "Any character except newline" },
        { pattern: "*", desc: "Zero or more" },
        { pattern: "\\+", desc: "One or more (in default magic)" },
        { pattern: "\\?", desc: "Zero or one (in default magic)" },
        { pattern: "\\{n,m}", desc: "Range quantifier (escaped)" },
        { pattern: "^", desc: "Start of line" },
        { pattern: "$", desc: "End of line" },
        { pattern: "\\(\\)", desc: "Grouping (in default magic)" },
        { pattern: "\\|", desc: "Alternation (in default magic)" },
        { pattern: "\\c", desc: "Case insensitive (anywhere in pattern)" },
        { pattern: "\\C", desc: "Case sensitive (anywhere in pattern)" },
        { pattern: "\\v", desc: "Very magic mode prefix" },
        { pattern: "\\V", desc: "Very nomagic mode prefix" },
        { pattern: "\\{-}", desc: "Lazy quantifier (non-greedy)" }
    ],
    python: [
        { pattern: ".", desc: "Any character except newline" },
        { pattern: "\\d", desc: "Any digit" },
        { pattern: "\\w", desc: "Word character" },
        { pattern: "\\s", desc: "Whitespace" },
        { pattern: "\\b", desc: "Word boundary" },
        { pattern: "*", desc: "Zero or more" },
        { pattern: "+", desc: "One or more" },
        { pattern: "?", desc: "Zero or one" },
        { pattern: "{n,m}", desc: "Range quantifier" },
        { pattern: "^", desc: "Start of string/line" },
        { pattern: "$", desc: "End of string/line" },
        { pattern: "()", desc: "Capturing group" },
        { pattern: "(?P<name>)", desc: "Named group (Python syntax)" },
        { pattern: "(?=)", desc: "Positive lookahead" },
        { pattern: "(?!)", desc: "Negative lookahead" }
    ],
    sed: [
        { pattern: ".", desc: "Any character except newline" },
        { pattern: "*", desc: "Zero or more" },
        { pattern: "\\+", desc: "One or more (escaped)" },
        { pattern: "\\?", desc: "Zero or one (escaped)" },
        { pattern: "\\{n,m\\}", desc: "Range quantifier (escaped)" },
        { pattern: "^", desc: "Start of line" },
        { pattern: "$", desc: "End of line" },
        { pattern: "[abc]", desc: "Character class" },
        { pattern: "[^abc]", desc: "Negated character class" },
        { pattern: "[0-9]", desc: "Digits (use instead of \\d)" },
        { pattern: "\\(\\)", desc: "Grouping (escaped)" },
        { pattern: "\\|", desc: "Alternation (escaped)" },
        { pattern: "\\1", desc: "Backreference to group 1" },
        { pattern: "s///g", desc: "Global substitution" }
    ]
};

// Updated common pitfalls for each mode
const commonPitfalls = {
    javascript: [
        {
            title: "Catastrophic Backtracking",
            problem: "Nested quantifiers can cause exponential time complexity",
            bad: "(a+)+b",
            good: "a+b",
            explanation: "Avoid nested quantifiers that can cause the regex engine to try exponential combinations"
        },
        {
            title: "Greedy vs Lazy Quantifiers",
            problem: "Greedy quantifiers match as much as possible",
            bad: "<.*>",
            good: "<.*?>",
            explanation: "Use lazy quantifiers (?) to match as little as possible"
        }
    ],
    pcre: [
        {
            title: "Inline Modifier Placement",
            problem: "Inline modifiers affect the entire pattern",
            bad: "test(?i)PATTERN",
            good: "(?i)testPATTERN",
            explanation: "Place inline modifiers at the beginning for clarity"
        },
        {
            title: "Possessive Quantifier Simulation",
            problem: "JavaScript cannot fully simulate possessive quantifiers",
            bad: "a*+b (expecting true possessive behavior)",
            good: "a*b (understand it's not truly possessive)",
            explanation: "This simulation warns about possessive quantifiers but can't replicate the exact behavior"
        }
    ],
    grep: [
        {
            title: "Metacharacter Escaping",
            problem: "BRE requires escaping for extended features",
            bad: "(group)+",
            good: "\\(group\\)\\+",
            explanation: "In BRE, parentheses and + must be escaped to be special"
        },
        {
            title: "Modern Shortcuts",
            problem: "BRE doesn't support \\d, \\w, \\s",
            bad: "\\d+",
            good: "[0-9]\\+",
            explanation: "Use POSIX character classes instead of modern shortcuts"
        }
    ],
    egrep: [
        {
            title: "Character Class Shortcuts",
            problem: "ERE doesn't support \\d, \\w, \\s shortcuts",
            bad: "\\d+",
            good: "[0-9]+",
            explanation: "Use explicit character classes instead of shortcuts"
        },
        {
            title: "Advanced Features",
            problem: "ERE lacks modern regex features",
            bad: "(?=lookahead)",
            good: "Use basic patterns only",
            explanation: "ERE doesn't support lookaheads, named groups, etc."
        }
    ],
    vim: [
        {
            title: "Magic Mode Confusion",
            problem: "Different magic levels change metacharacter behavior",
            bad: "Assuming consistent behavior across modes",
            good: "\\v for very magic or \\V for very nomagic",
            explanation: "Explicitly set magic mode to avoid confusion about escaping"
        },
        {
            title: "Case Modifier Placement",
            problem: "\\c and \\C can appear anywhere in the pattern",
            bad: "Placing case modifiers inconsistently",
            good: "\\chello or hello\\c",
            explanation: "Case modifiers affect the entire pattern regardless of position"
        }
    ],
    python: [
        {
            title: "String Escaping",
            problem: "Without raw strings, backslashes need double escaping",
            bad: "\"\\\\d+\"",
            good: "r'\\d+'",
            explanation: "Always use raw strings (r'') for regex patterns in Python"
        },
        {
            title: "Flag Usage",
            problem: "Python doesn't use inline flags like JavaScript",
            bad: "Using 'g' flag or inline flags",
            good: "re.findall() and re.I, re.M constants",
            explanation: "Use findall() for multiple matches and constants for flags"
        }
    ],
    sed: [
        {
            title: "BRE Limitations",
            problem: "sed uses BRE which has limited features",
            bad: "word+",
            good: "word\\+",
            explanation: "Use escaped quantifiers in BRE or switch to ERE with -E"
        },
        {
            title: "Substitution Context",
            problem: "sed is designed for substitution, not just matching",
            bad: "Using complex matching patterns",
            good: "s/pattern/replacement/g",
            explanation: "Focus on substitution patterns rather than complex matching"
        }
    ]
};

// Mode-specific flag configurations
const modeFlagInfo = {
    javascript: {
        placeholder: "gimsu",
        flags: {
            g: { name: 'Global', desc: 'Find all matches, not just first' },
            i: { name: 'Case-insensitive', desc: 'Ignore case differences' },
            m: { name: 'Multiline', desc: '^ and $ match line breaks' },
            s: { name: 'Dotall', desc: '. matches newlines' },
            u: { name: 'Unicode', desc: 'Enable full Unicode support' }
        },
        example: "/pattern/gi"
    },
    pcre: {
        placeholder: "gimsx",
        flags: {
            g: { name: 'Global', desc: 'Find all matches' },
            i: { name: 'Case-insensitive', desc: 'Ignore case differences' },
            m: { name: 'Multiline', desc: '^ and $ match line breaks' },
            s: { name: 'Single-line/Dotall', desc: '. matches newlines' },
            x: { name: 'Extended', desc: 'Ignore whitespace, allow comments' }
        },
        note: "PCRE also supports inline modifiers:\n• (?i) case-insensitive\n• (?m) multiline\n• (?s) dotall\n• (?x) extended",
        example: "/pattern/imx or /(?i)pattern/"
    },
    grep: {
        placeholder: "(g for all matches)",
        flags: null,
        note: "grep shows LINES containing matches by default:\n• grep -i (case-insensitive)\n• grep -E (extended regex = egrep)\n• grep -o (show only matched parts)\n• Add 'g' flag here to find ALL matches",
        example: "grep 'pattern' file.txt"
    },
    egrep: {
        placeholder: "(g for all matches)",
        flags: null,
        note: "egrep shows LINES containing matches by default:\n• egrep -i (case-insensitive)\n• egrep -o (show only matched parts)\n• Same as grep -E\n• Add 'g' flag here to find ALL matches",
        example: "egrep 'pattern' file.txt"
    },
    vim: {
        placeholder: "(\\c \\C \\v \\V in pattern)",
        flags: null,
        note: "Vim uses modifiers IN the pattern:\n• \\c anywhere = case-insensitive\n• \\C anywhere = case-sensitive\n• \\v prefix = very magic mode\n• \\V prefix = very nomagic mode\n• Default: ( ) are literal, \\( \\) are groups",
        example: "/\\cpattern or /\\v(group)+"
    },
    python: {
        placeholder: "(use re.I, re.M etc.)",
        flags: null,
        note: "Python uses re module constants:\n• re.I or re.IGNORECASE\n• re.M or re.MULTILINE\n• re.S or re.DOTALL\n• re.X or re.VERBOSE\n• Use appropriate JS flags here (gim) for simulation",
        example: "re.findall(r'pattern', text, re.I | re.M)"
    },
    sed: {
        placeholder: "(g for substitution)",
        flags: null,
        note: "sed processes lines one at a time:\n• s///g (replace all in each line)\n• s///I (case-insensitive, GNU sed)\n• s///p (print matching lines)\n• Add 'g' flag here for ALL matches",
        example: "sed 's/pattern/replacement/g' file.txt"
    }
};

// Updated common patterns for each mode
const commonPatterns = {
    javascript: [
        { name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", desc: "Basic email validation" },
        { name: "URL", pattern: "https?://[\\w.-]+(?:/[\\w._~:/?#[\\]@!$&'()*+,;=-]*)?", desc: "HTTP/HTTPS URLs" },
        { name: "Phone", pattern: "\\(?\\d{3}\\)?[-\\s]?\\d{3}-?\\d{4}", desc: "US phone numbers" },
        { name: "Date", pattern: "\\d{4}-\\d{2}-\\d{2}", desc: "YYYY-MM-DD format" },
        { name: "Digits", pattern: "\\d+", desc: "One or more digits" },
        { name: "Word", pattern: "\\b\\w+\\b", desc: "Complete words" }
    ],
    pcre: [
        { name: "Password", pattern: "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}", desc: "Strong password with lookaheads" },
        { name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", desc: "Email validation" },
        { name: "Case insensitive", pattern: "(?i)hello", desc: "Inline case modifier" },
        { name: "Multiline", pattern: "(?m)^start", desc: "Inline multiline modifier" }
    ],
    grep: [
        { name: "Numbers", pattern: "[0-9]\\+", desc: "One or more digits (BRE syntax)" },
        { name: "Word", pattern: "\\<[a-zA-Z_]\\+\\>", desc: "Complete word (BRE syntax)" },
        { name: "Group", pattern: "\\(test\\)", desc: "Capturing group (escaped)" },
        { name: "Alternation", pattern: "cat\\|dog", desc: "Either cat or dog (escaped)" },
        { name: "Range", pattern: "a\\{2,4\\}", desc: "2-4 'a' characters (escaped)" },
        { name: "Line start", pattern: "^pattern", desc: "Line beginning" }
    ],
    egrep: [
        { name: "Numbers", pattern: "[0-9]+", desc: "One or more digits (ERE syntax)" },
        { name: "Word", pattern: "\\<[a-zA-Z_]+\\>", desc: "Complete word (ERE syntax)" },
        { name: "Group", pattern: "(test)", desc: "Capturing group (no escaping)" },
        { name: "Alternation", pattern: "cat|dog", desc: "Either cat or dog (no escaping)" },
        { name: "URL", pattern: "(http|https)://[a-zA-Z0-9.-]+", desc: "URLs with protocol" },
        { name: "Range", pattern: "a{2,4}", desc: "2-4 'a' characters (no escaping)" }
    ],
    vim: [
        { name: "Very magic", pattern: "\\v(group)+", desc: "ERE-like syntax with \\v" },
        { name: "Case insensitive", pattern: "\\cpattern", desc: "Case insensitive with \\c" },
        { name: "Very nomagic", pattern: "\\V(literal)", desc: "Everything literal with \\V" },
        { name: "Lazy quantifier", pattern: "a.\\{-}b", desc: "Non-greedy match" },
        { name: "Default magic", pattern: "\\(group\\)", desc: "Default escaping" }
    ],
    python: [
        { name: "Email", pattern: "r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'", desc: "Email with raw string" },
        { name: "Named group", pattern: "r'(?P<year>\\d{4})-(?P<month>\\d{2})'", desc: "Python named groups" },
        { name: "Digits", pattern: "r'\\d+'", desc: "One or more digits" },
        { name: "Word boundary", pattern: "r'\\bword\\b'", desc: "Complete word match" },
        { name: "Multiline", pattern: "r'^start'", desc: "Use with re.M flag" }
    ],
    sed: [
        { name: "Substitute", pattern: "s/old/new/g", desc: "Global replacement" },
        { name: "Group substitute", pattern: "s/\\(.*\\)/[\\1]/", desc: "Wrap in brackets with backreference" },
        { name: "Delete empty", pattern: "/^$/d", desc: "Delete blank lines" },
        { name: "Line range", pattern: "1,5s/old/new/", desc: "Replace in lines 1-5" },
        { name: "Numbers", pattern: "s/[0-9]\\+/NUM/g", desc: "Replace numbers with NUM" }
    ]
};