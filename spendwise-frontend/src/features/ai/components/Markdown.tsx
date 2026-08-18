import React from 'react'

interface MarkdownProps {
  content: string
}

export const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  // Normalize line endings
  const normalized = content.replace(/\r\n/g, '\n')
  
  // Split into blocks by double newlines
  const blocks = normalized.split(/\n{2,}/)

  const parseInline = (text: string): React.ReactNode => {
    // Split text by bold (**bold**), italic (*italic*), and inline code (`code`)
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|₹\d+(?:,\d+)*(?:\.\d+)?)/g)
    
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-bold text-slate-800">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={idx} className="italic text-slate-600">{part.slice(1, -1)}</em>
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-mono text-primary">{part.slice(1, -1)}</code>
      }
      if (part.startsWith('₹')) {
        return <span key={idx} className="font-semibold text-slate-700">{part}</span>
      }
      return part
    })
  }

  const tryRenderTable = (block: string, blockIdx: number): React.ReactNode | null => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
    if (lines.length > 0 && lines[0].startsWith('|') && lines[0].endsWith('|')) {
      const rows = lines.map(line => {
        return line
          .split('|')
          .slice(1, -1)
          .map(cell => cell.trim())
      })

      const cleanRows = rows.filter(row => !row.every(cell => /^[-:\s]+$/.test(cell)))
      if (cleanRows.length === 0) return null

      const headers = cleanRows[0]
      const bodyRows = cleanRows.slice(1)

      return (
        <div key={blockIdx} className="overflow-x-auto my-3 border border-slate-100 rounded-xl bg-white shadow-sm max-w-full">
          <table className="min-w-full divide-y divide-slate-100 text-xs md:text-sm">
            <thead className="bg-slate-50">
              <tr>
                {headers.map((header, hIdx) => (
                  <th key={hIdx} className="px-4 py-2.5 text-left font-bold text-slate-700 tracking-wider">
                    {parseInline(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/55 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-2.5 text-slate-600">
                      {parseInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4 text-sm text-slate-600 leading-relaxed max-w-full overflow-hidden block">
      {blocks.map((block, blockIdx) => {
        const trimmedBlock = block.trim()
        if (!trimmedBlock) return null

        // 1. Check if block is a Table
        const tableElement = tryRenderTable(trimmedBlock, blockIdx)
        if (tableElement) return tableElement

        // 2. Check if block is a Horizontal Rule
        if (trimmedBlock === '---') {
          return <hr key={blockIdx} className="my-4 border-slate-100 block" />
        }

        // 3. Check if block is a Heading
        if (trimmedBlock.startsWith('### ')) {
          const rawText = trimmedBlock.slice(4)
          const cleanText = rawText.replace(/^\d+\.\s*/, '') // remove numerical prefixes like "1. "
          return (
            <h4 key={blockIdx} className="text-sm font-bold text-slate-800 tracking-tight mt-5 mb-2 block">
              {parseInline(cleanText)}
            </h4>
          )
        }
        if (trimmedBlock.startsWith('## ')) {
          const rawText = trimmedBlock.slice(3)
          const cleanText = rawText.replace(/^\d+\.\s*/, '')
          return (
            <h3 key={blockIdx} className="text-sm font-bold text-slate-800 tracking-tight mt-5 mb-2 block">
              {parseInline(cleanText)}
            </h3>
          )
        }
        if (trimmedBlock.startsWith('# ')) {
          const rawText = trimmedBlock.slice(2)
          const cleanText = rawText.replace(/^\d+\.\s*/, '')
          return (
            <h2 key={blockIdx} className="text-base font-bold text-slate-900 tracking-tight mt-6 mb-3 block">
              {parseInline(cleanText)}
            </h2>
          )
        }

        const lines = trimmedBlock.split('\n')

        // 4. Check if block is an Unordered List
        if (trimmedBlock.startsWith('- ') || trimmedBlock.startsWith('* ')) {
          return (
            <ul key={blockIdx} className="list-none space-y-2.5 my-3 pl-1 block">
              {lines.map((line, itemIdx) => {
                const cleanLine = line.replace(/^[-*]\s+/, '')
                return (
                  <li key={itemIdx} className="flex items-start gap-2 text-slate-600 leading-relaxed block">
                    <span className="text-primary/70 mt-1.5 shrink-0 select-none text-[10px]">•</span>
                    <span className="flex-1">{parseInline(cleanLine)}</span>
                  </li>
                )
              })}
            </ul>
          )
        }

        // 5. Check if block is an Ordered List
        if (/^\d+\.\s+/.test(trimmedBlock)) {
          return (
            <ol key={blockIdx} className="space-y-2.5 my-3 pl-1 block">
              {lines.map((line, itemIdx) => {
                const cleanLine = line.replace(/^\d+\.\s+/, '')
                return (
                  <li key={itemIdx} className="flex items-start gap-2 text-slate-600 leading-relaxed block">
                    <span className="text-[11px] font-bold text-slate-400 select-none shrink-0 w-4 text-right mr-1.5 mt-0.5">
                      {itemIdx + 1}.
                    </span>
                    <span className="flex-1">{parseInline(cleanLine)}</span>
                  </li>
                )
              })}
            </ol>
          )
        }

        // 6. Default: Block Paragraph
        return (
          <p key={blockIdx} className="text-slate-600 leading-relaxed block">
            {lines.map((line, lineIdx) => (
              <React.Fragment key={lineIdx}>
                {lineIdx > 0 && <br />}
                {parseInline(line)}
              </React.Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}

export default Markdown
