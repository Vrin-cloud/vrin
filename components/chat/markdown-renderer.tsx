'use client'

import React, { useMemo, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

// Dynamically import syntax highlighter to avoid SSR issues
const CodeBlock = ({ language, children }: { language: string; children: string }) => {
  const [SyntaxHighlighter, setSyntaxHighlighter] = React.useState<any>(null)
  const [style, setStyle] = React.useState<any>(null)

  React.useEffect(() => {
    import('react-syntax-highlighter').then((mod) => {
      setSyntaxHighlighter(() => mod.Prism)
    })
    import('react-syntax-highlighter/dist/esm/styles/prism').then((mod) => {
      setStyle(mod.vscDarkPlus)
    })
  }, [])

  if (!SyntaxHighlighter || !style) {
    return (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{children}</code>
      </pre>
    )
  }

  return (
    <SyntaxHighlighter style={style} language={language} PreTag="div">
      {children}
    </SyntaxHighlighter>
  )
}

interface MarkdownRendererProps {
  content: string
  className?: string
  isStreaming?: boolean
}

export function MarkdownRenderer({ content, className = '', isStreaming = false }: MarkdownRendererProps) {
  // Throttle markdown rendering during streaming to improve performance
  // Similar to Karpathy's approach - only render every ~100ms during streaming
  const [throttledContent, setThrottledContent] = React.useState(content);
  const lastUpdateRef = useRef(Date.now());
  const pendingContentRef = useRef(content);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!isStreaming) {
      // Not streaming - update immediately
      console.log(`[MarkdownRenderer] Not streaming, updating immediately: ${content.length} chars`);
      setThrottledContent(content);
      return;
    }

    // Streaming - throttle updates to every 100ms
    pendingContentRef.current = content;
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    if (timeSinceLastUpdate >= 100) {
      // Update immediately if enough time has passed
      console.log(`[MarkdownRenderer] Throttle: Updating (${timeSinceLastUpdate}ms since last): ${content.length} chars`);
      setThrottledContent(content);
      lastUpdateRef.current = now;
    } else {
      // Schedule update
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      console.log(`[MarkdownRenderer] Throttle: Scheduling update in ${100 - timeSinceLastUpdate}ms`);
      timeoutRef.current = setTimeout(() => {
        console.log(`[MarkdownRenderer] Throttle: Delayed update firing: ${pendingContentRef.current.length} chars`);
        setThrottledContent(pendingContentRef.current);
        lastUpdateRef.current = Date.now();
      }, 100 - timeSinceLastUpdate);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, isStreaming]);

  // Memoize the expensive markdown rendering
  const renderedMarkdown = useMemo(() => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
          // Headings
          h1(props) {
            const { node, ...rest } = props
            return <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900" {...rest} />
          },
          h2(props) {
            const { node, ...rest } = props
            return <h2 className="text-xl font-bold mt-5 mb-3 text-gray-900" {...rest} />
          },
          h3(props) {
            const { node, ...rest } = props
            return <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900" {...rest} />
          },
          h4(props) {
            const { node, ...rest } = props
            return <h4 className="text-base font-semibold mt-3 mb-2 text-gray-900" {...rest} />
          },

          // Paragraphs
          p(props) {
            const { node, ...rest } = props
            return <p className="mb-3 leading-relaxed text-gray-800" {...rest} />
          },

          // Lists
          ul(props) {
            const { node, ...rest } = props
            return <ul className="list-disc list-outside ml-6 mb-3 space-y-1 text-gray-800" {...rest} />
          },
          ol(props) {
            const { node, ...rest } = props
            return <ol className="list-decimal list-outside ml-6 mb-3 space-y-1 text-gray-800" {...rest} />
          },
          li(props) {
            const { node, ...rest } = props
            return <li className="leading-relaxed" {...rest} />
          },

          // Code blocks
          code(props) {
            const { node, className, children, ...rest } = props
            const inline = 'inline' in props ? props.inline : false
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            const codeString = String(children).replace(/\n$/, '')

            if (!inline && language) {
              return (
                <div className="my-3 rounded-lg overflow-hidden">
                  <CodeBlock language={language}>
                    {codeString}
                  </CodeBlock>
                </div>
              )
            }

            return (
              <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            )
          },

          // Blockquotes
          blockquote(props) {
            const { node, ...rest } = props
            return (
              <blockquote
                className="border-l-4 border-blue-500 pl-4 py-2 my-3 italic text-gray-700 bg-blue-50 rounded-r"
                {...rest}
              />
            )
          },

          // Links
          a(props) {
            const { node, ...rest } = props
            return (
              <a
                className="text-blue-600 hover:text-blue-800 underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                {...rest}
              />
            )
          },

          // Tables
          table(props) {
            const { node, ...rest } = props
            return (
              <div className="overflow-x-auto my-3">
                <table className="min-w-full border border-gray-300 rounded-lg" {...rest} />
              </div>
            )
          },
          thead(props) {
            const { node, ...rest } = props
            return <thead className="bg-gray-100" {...rest} />
          },
          tbody(props) {
            const { node, ...rest } = props
            return <tbody {...rest} />
          },
          tr(props) {
            const { node, ...rest } = props
            return <tr {...rest} />
          },
          th(props) {
            const { node, ...rest } = props
            return <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900" {...rest} />
          },
          td(props) {
            const { node, ...rest } = props
            return <td className="border border-gray-300 px-4 py-2 text-gray-800" {...rest} />
          },

          // Horizontal rule
          hr(props) {
            const { node, ...rest } = props
            return <hr className="my-6 border-gray-300" {...rest} />
          },

          // Strong/Bold
          strong(props) {
            const { node, ...rest } = props
            return <strong className="font-bold text-gray-900" {...rest} />
          },

          // Emphasis/Italic
          em(props) {
            const { node, ...rest } = props
            return <em className="italic" {...rest} />
          },

          // Delete/Strikethrough (GFM)
          del(props) {
            const { node, ...rest } = props
            return <del className="line-through" {...rest} />
          },
        }}
      >
        {throttledContent}
      </ReactMarkdown>
  ), [throttledContent]);

  return (
    <div className={`markdown-content ${className}`}>
      {renderedMarkdown}
    </div>
  )
}
