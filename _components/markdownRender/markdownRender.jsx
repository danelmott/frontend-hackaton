"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import './markdownRender.css';



export default function MarkdownRenderer({content, isStreaming = false,}) {
    return (
        <div className="markdown-body">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[
                    rehypeKatex,
                    ...(isStreaming ? [] : [rehypeHighlight]),
                ]}
                components={{
                    // Bloques de código con label de lenguaje
                    code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const language = match ? match[1] : null;
                        
                        if (!inline && language) {
                            return (
                                <div className="code-block">
                                    <div className="code-header">
                                        <span className="code-language">{language}</span>
                                            <button
                                                className="copy-btn"
                                                onClick={() =>
                                                    navigator.clipboard.writeText(String(children))
                                                }
                                            >
                                                Copiar
                                            </button>
                                    </div>
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                </div>
                            );
                        }
                        
                        return (
                            <code className={`inline-code ${className || ""}`} {...props}>
                                {children}
                            </code>
                        );
                    },
                    
                    // Tablas con scroll horizontal en móvil
                    table({ children, ...props }) {
                        return (
                            <div className="table-wrapper">
                                <table {...props}>{children}</table>
                            </div>
                        );
                    },
                    
                    // Links que abren en nueva pestaña
                    a({ children, href, ...props }) {
                        return (
                            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                                {children}
                            </a>
                        );
                    },
                    
                    // Blockquotes con acento visual
                    blockquote({ children, ...props }) {
                        return (
                            <blockquote className="blockquote" {...props}>
                                {children}
                            </blockquote>
                        );
                    },
                }}
            >
                {content}
        </ReactMarkdown>

      <style>{`
        .markdown-body {
          font-family: 'Georgia', serif;
          font-size: 15px;
          line-height: 1.75;
          color: #1a1a1a;
          max-width: 100%;
          word-break: break-word;
        }

        /* Headings */
        .markdown-body h1,
        .markdown-body h2,
        .markdown-body h3,
        .markdown-body h4 {
          font-family: 'Georgia', serif;
          font-weight: 700;
          line-height: 1.3;
          margin: 1.6em 0 0.5em;
          color: #111;
        }
        .markdown-body h1 { font-size: 1.75em; border-bottom: 2px solid #e5e5e5; padding-bottom: 0.3em; }
        .markdown-body h2 { font-size: 1.4em; border-bottom: 1px solid #ebebeb; padding-bottom: 0.25em; }
        .markdown-body h3 { font-size: 1.15em; }
        .markdown-body h4 { font-size: 1em; color: #444; }

        /* Párrafos y listas */
        .markdown-body p { margin: 0.75em 0; }
        .markdown-body ul,
        .markdown-body ol { padding-left: 1.5em; margin: 0.75em 0; }
        .markdown-body li { margin: 0.3em 0; }
        .markdown-body li > p { margin: 0.2em 0; }

        /* Código inline */
        .inline-code {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 0.85em;
          background: #f0f0f0;
          color: #d63369;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
        }

        /* Bloque de código */
        .code-block {
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #2a2a2a;
          margin: 1.1em 0;
          background: #1a1a2e;
        }
        .code-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          background: #12121f;
          border-bottom: 1px solid #2a2a3e;
        }
        .code-language {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #7c85b0;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .copy-btn {
          font-size: 11px;
          color: #7c85b0;
          background: transparent;
          border: 1px solid #2a2a4a;
          border-radius: 4px;
          padding: 2px 10px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .copy-btn:hover {
          color: #aab0cc;
          border-color: #4a4a7a;
        }
        .code-block code {
          display: block;
          padding: 14px 16px;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 13px;
          line-height: 1.65;
          overflow-x: auto;
          background: transparent !important;
        }

        /* Blockquote */
        .blockquote {
          border-left: 3px solid #d63369;
          margin: 1em 0;
          padding: 0.4em 1em;
          background: #fdf5f7;
          border-radius: 0 6px 6px 0;
          color: #555;
          font-style: italic;
        }

        /* Tablas */
        .table-wrapper {
          overflow-x: auto;
          margin: 1em 0;
          border-radius: 8px;
          border: 1px solid #e5e5e5;
        }
        .markdown-body table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .markdown-body th {
          background: #f5f5f5;
          font-weight: 600;
          text-align: left;
          padding: 10px 14px;
          border-bottom: 2px solid #e0e0e0;
          color: #222;
        }
        .markdown-body td {
          padding: 9px 14px;
          border-bottom: 1px solid #f0f0f0;
          color: #333;
        }
        .markdown-body tr:last-child td { border-bottom: none; }
        .markdown-body tr:hover td { background: #fafafa; }

        /* Links */
        .markdown-body a {
          color: #d63369;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.15s ease;
        }
        .markdown-body a:hover {
          border-bottom-color: #d63369;
        }

        /* HR */
        .markdown-body hr {
          border: none;
          border-top: 1px solid #ebebeb;
          margin: 2em 0;
        }

        /* Imágenes */
        .markdown-body img {
          max-width: 100%;
          border-radius: 8px;
          margin: 0.5em 0;
        }

        /* KaTeX — hereda correctamente */
        .markdown-body .katex-display {
          overflow-x: auto;
          padding: 0.5em 0;
        }
      `}</style>
    </div>
  );
}