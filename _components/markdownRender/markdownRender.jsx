"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import './markdownRender.css';

/**
 * En chat fintech, "$3.000.000" activaba remark-math/KaTeX y partía el texto letra por letra.
 * Escapamos $ cuando va seguido de dígito (montos COP/USD), no fórmulas.
 */
function sanitizeMarkdownContent(content, isChat) {
  if (typeof content !== 'string') return '';

  let text = content;

  if (isChat) {
    text = text.replace(/\$(?=\d)/g, '\\$');
  }

  return text;
}

export default function MarkdownRenderer({ content, isStreaming = false, variant = 'default' }) {
  const isChat = variant === 'chat';
  const safeContent = sanitizeMarkdownContent(content, isChat);

  const remarkPlugins = isChat ? [remarkGfm] : [remarkGfm, remarkMath];
  const rehypePlugins = isChat
    ? [...(isStreaming ? [] : [rehypeHighlight])]
    : [rehypeKatex, ...(isStreaming ? [] : [rehypeHighlight])];

  return (
    <div className={`markdown-body${isChat ? ' markdown-body--chat' : ''}`}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : null;
            const isInline = !language && !String(className || "").includes("language-");

            if (!isInline && language) {
              return (
                <div className="code-block">
                  <div className="code-header">
                    <span className="code-language">{language}</span>
                    <button
                      className="copy-btn"
                      type="button"
                      onClick={() => navigator.clipboard.writeText(String(children))}
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

          table({ children, ...props }) {
            return (
              <div className="table-wrapper">
                <table {...props}>{children}</table>
              </div>
            );
          },

          a({ children, href, ...props }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            );
          },

          blockquote({ children, ...props }) {
            return (
              <blockquote className="blockquote" {...props}>
                {children}
              </blockquote>
            );
          },
        }}
      >
        {safeContent}
      </ReactMarkdown>
    </div>
  );
}
