"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import './markdownRender.css';



export default function MarkdownRenderer({ content, isStreaming = false, variant = 'default' }) {
    const isChat = variant === 'chat';

    return (
        <div className={`markdown-body${isChat ? ' markdown-body--chat' : ''}`}>
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
        </div>
    );
}