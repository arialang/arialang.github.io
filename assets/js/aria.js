// assets/js/aria.js
/** @typedef {import('highlight.js').HLJSApi} HLJSApi */
/** @param {HLJSApi} hljs */
export default function (hljs) {
    // ---------- Lexical ----------

    const LINE_COMMENT = hljs.COMMENT('#', '$');
    const SHEBANG = hljs.SHEBANG({ binary: '' });

    // escapes: \n \t \\ \xNN \u{...}
    const ESCAPE = {
        className: 'subst',
        begin: /\\(?:[nt\\]|x[0-9A-Fa-f]{2}|u\{[0-9A-Fa-f]+\})/
    };
    const SQ_STRING = { className: 'string', begin: /'/, end: /'/, contains: [ESCAPE] };
    const DQ_STRING = { className: 'string', begin: /"/, end: /"/, contains: [ESCAPE] };

    // numbers
    const HEX_INT = { className: 'number', begin: /0x[0-9A-Fa-f]+(?:_[0-9A-Fa-f]+)*/ };
    const OCT_INT = { className: 'number', begin: /0o[0-7]+(?:_[0-7]+)*/ };
    const BIN_INT = { className: 'number', begin: /0b[01]+(?:_[01]+)*/ };
    const DEC_INT = { className: 'number', begin: /-?(?:0|[1-9][0-9]*)(?:_[0-9]+)*/ };
    const DEC_FLOAT = {
        className: 'number',
        // -? DIGITS '.' DIGITS (exp)?
        begin: /-?(?:0|[1-9][0-9]*)\.[0-9]+(?:[eE][+-]?[0-9]+)?/,
        illegal: /_/ // no underscores in floats
    };

    // identifiers (approx)
    const IDENT = /[A-Za-z_$][\w$]*/u;

    // ---------- Keywords ----------

    const KEYWORDS = {
        keyword: [
            'assert', 'else', 'elsif', 'extension', 'if', 'include', 'match', 'return', 'throw', 'while',
            'val', 'var', 'type', 'func', 'operator', 'struct', 'enum', 'mixin', 'import', 'from', 'in',
            'and', 'case', 'isa', 'instance', 'reverse', 'try', 'catch', 'break', 'continue', 'for'
        ].join(' '),
        literal: 'true false',
        built_in: 'alloc arity exit getenv hasattr listattrs print println readattr readln setenv sleep system writeattr',
        type: 'Int Float String Bool Result Maybe Any'
    };

    // ---------- Declarations & titles ----------

    const FUNC_DEF = {
        className: 'function',
        begin: new RegExp(`\\bfunc\\s+(${IDENT.source})\\s*\\(`),
        beginScope: { 1: 'title.function' },
        end: /\)/,
        excludeEnd: true,
        keywords: KEYWORDS,
        contains: [LINE_COMMENT, DQ_STRING, SQ_STRING, DEC_FLOAT, HEX_INT, OCT_INT, BIN_INT, DEC_INT]
    };

    const METHOD_DEF = {
        className: 'function',
        begin: new RegExp(`\\b(?:instance|type)\\s+func\\s+(${IDENT.source})\\s*\\(`),
        beginScope: { 1: 'title.function' },
        end: /\)/,
        excludeEnd: true,
        keywords: KEYWORDS,
        contains: [LINE_COMMENT, DQ_STRING, SQ_STRING, DEC_FLOAT, HEX_INT, OCT_INT, BIN_INT, DEC_INT]
    };

    // operator symbols from grammar
    const OP_SYM = /\+\-|u\-|\+|\-|\*|\/|%|<<|>>|==|<=|>=|<|>|\&|\||\^|\(\)|\[\]=|\[\]/;
    const OP_DEF = {
        className: 'function',
        keywords: KEYWORDS,
        begin: new RegExp(`\\b(?:reverse\\s+)?operator\\s+(${OP_SYM.source})\\s*\\(`),
        beginScope: { 1: 'title.function' },
        end: /\)/,
        excludeEnd: true,
        contains: [LINE_COMMENT]
    };

    const TYPE_LIKE_DEF = {
        className: 'class',
        keywords: KEYWORDS,
        variants: [
            { begin: new RegExp(`\\bstruct\\s+(${IDENT.source})\\b`) },
            { begin: new RegExp(`\\benum\\s+(${IDENT.source})\\b`) },
            { begin: new RegExp(`\\bmixin\\s+(${IDENT.source})\\b`) },
            { begin: new RegExp(`\\bextension\\s+(${IDENT.source})\\b`) }
        ],
        beginScope: { 1: 'title.class' }
    };

    const ENUM_CASE_DECL = {
        keywords: KEYWORDS,
        match: new RegExp(`\\b(case)\\s+(${IDENT.source})\\b`),
        scope: { 1: 'keyword', 2: 'constant' },
        relevance: 0
    };

    const ENUM_CASE_USE = {
        className: 'constant',
        begin: new RegExp(`::\\s*(${IDENT.source})`),
        beginScope: { 1: 'constant' }
    };

    // lambdas: |args| => ...
    const LAMBDA_HEAD = {
        begin: /\|/,
        end: /\|\s*=>/,
        excludeEnd: true,
        contains: [LINE_COMMENT, { className: 'params', begin: /[^|]+/ }],
        relevance: 1
    };

    // postfix try-protocol
    const TRY_PROTOCOL = { className: 'operator', begin: /\?\?|\!\!/ };

    // compound assign ops used in statements
    const ASSIGN_OP = { className: 'operator', begin: /\+=|-=|\*=|\/=|%=/, relevance: 0 };

    const INDEXING = {
        begin: /\[/, end: /\]/,
        contains: [LINE_COMMENT, DQ_STRING, SQ_STRING, DEC_FLOAT, HEX_INT, OCT_INT, BIN_INT, DEC_INT],
        relevance: 0
    };

    const IMPORTS = {
        begin: /\bimport\b/, end: /;/,
        keywords: KEYWORDS,
        contains: [LINE_COMMENT, { begin: /\bfrom\b/, className: 'keyword' }],
        relevance: 0
    };

    // ---------- REPL transcript support ----------
    // Prompt line: 〉...
    const REPL_PROMPT = { className: 'meta', begin: /^〉\s?/m, relevance: 0 };
    // Continuation lines: ::: ...
    const REPL_CONT = { className: 'meta', begin: /^:::\s?/m, relevance: 0 };

    const BLOCK = {
        begin: /\{/,
        end: /\}/,
        keywords: KEYWORDS,
        contains: [
            'self',
            LINE_COMMENT,
            DQ_STRING, SQ_STRING,
            DEC_FLOAT, HEX_INT, OCT_INT, BIN_INT, DEC_INT,
            LAMBDA_HEAD, TRY_PROTOCOL, ASSIGN_OP, INDEXING,
            FUNC_DEF, METHOD_DEF, OP_DEF,
            TYPE_LIKE_DEF,
            ENUM_CASE_DECL, ENUM_CASE_USE,
            IMPORTS
        ],
        relevance: 0
    };

    return {
        name: 'Aria',
        aliases: ['aria'],
        keywords: KEYWORDS,
        contains: [
            SHEBANG, REPL_PROMPT, REPL_CONT,
            LINE_COMMENT, DQ_STRING, SQ_STRING,
            DEC_FLOAT, HEX_INT, OCT_INT, BIN_INT, DEC_INT,
            FUNC_DEF, METHOD_DEF, OP_DEF,
            TYPE_LIKE_DEF,
            ENUM_CASE_DECL, ENUM_CASE_USE,
            LAMBDA_HEAD, TRY_PROTOCOL, ASSIGN_OP, INDEXING,
            BLOCK,
            IMPORTS
        ]
    };
}
