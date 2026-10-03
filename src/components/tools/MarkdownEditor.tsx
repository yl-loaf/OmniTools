import React, { useState, useMemo } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  Eye,
  Edit3,
  Columns,
  Code,
  List,
  ListOrdered,
  Heading,
  Bold,
  Italic,
  Link as LinkIcon,
  Table as TableIcon,
  HelpCircle,
  Sparkles
} from 'lucide-react';

const SAMPLE_MARKDOWN = `# 🚀 Welcome to Markdown Studio

Write beautiful documentation, notes, and blog posts with live formatting preview.

## ✨ Key Features
- **Real-time split-screen preview**
- GitHub Flavored Markdown (tables, checklists, code blocks)
- One-click HTML export & Markdown file download
- Live word, line, and character count statistics

---

### 📊 Markdown Table Example
| Feature | Supported | Export Formats |
| :--- | :---: | :--- |
| Live Rendering | ✅ | Raw Markdown (.md) |
| Syntax Highlighting | ✅ | Formatted HTML |
| Copy to Clipboard | ✅ | Plain text |

### 💻 Code Block Example
\`\`\`typescript
interface Contributor {
  id: string;
  name: string;
  contributionPoints: number;
  badges: string[];
}

const champion: Contributor = {
  id: 'usr-101',
  name: 'Alex Developer',
  contributionPoints: 42,
  badges: ['Master Architect', 'Streak Champion']
};
\`\`\`

### 📝 Checklist
- [x] Create useful community tools
- [x] Real-time reactive updates
- [ ] Share with the team

> *"Simplicity is the soul of efficiency."* — Austin Freeman
`;

export const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const characters = markdown.length;
    const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
    const lines = markdown.split('\n').length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { characters, words, lines, readingTime };
  }, [markdown]);

  // Convert basic markdown to sanitized HTML representation
  const htmlOutput = useMemo(() => {
    let raw = markdown;

    // Escape HTML special chars first
    raw = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Fenced Code blocks
    raw = raw.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_match, lang, code) => {
      return `<pre class="bg-slate-950 border border-slate-800 text-cyan-300 p-4 rounded-xl font-mono text-xs overflow-x-auto my-3"><div class="text-[10px] text-slate-500 mb-1 uppercase font-semibold">${lang || 'code'}</div><code>${code.trim()}</code></pre>`;
    });

    // Inline code
    raw = raw.replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');

    // Headers
    raw = raw.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-white mt-4 mb-2">$1</h3>');
    raw = raw.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-white mt-5 mb-2 border-b border-slate-800 pb-1">$1</h2>');
    raw = raw.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-white mt-6 mb-3 border-b border-slate-800 pb-2">$1</h1>');

    // Blockquotes
    raw = raw.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 py-1.5 my-2 text-slate-300 italic bg-blue-950/20 rounded-r-lg">$1</blockquote>');

    // Horizontal Rule
    raw = raw.replace(/^---$/gim, '<hr class="border-slate-800 my-4" />');

    // Bold and Italic
    raw = raw.replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold"><em>$1</em></strong>');
    raw = raw.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-100">$1</strong>');
    raw = raw.replace(/\*(.*?)\*/g, '<em class="italic text-slate-200">$1</em>');

    // Checkboxes
    raw = raw.replace(/^- \[x\] (.*$)/gim, '<div class="flex items-center gap-2 text-xs text-slate-300 my-1"><span class="w-4 h-4 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">✓</span> <span class="line-through text-slate-400">$1</span></div>');
    raw = raw.replace(/^- \[ \] (.*$)/gim, '<div class="flex items-center gap-2 text-xs text-slate-300 my-1"><span class="w-4 h-4 rounded border border-slate-600 bg-slate-800 inline-block"></span> <span>$1</span></div>');

    // Lists
    raw = raw.replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-300 text-xs my-0.5">$1</li>');
    raw = raw.replace(/^[0-9]+\. (.*$)/gim, '<li class="ml-4 list-decimal text-slate-300 text-xs my-0.5">$1</li>');

    // Links [text](url)
    raw = raw.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline hover:text-blue-300">$1</a>');

    // Tables
    raw = raw.replace(/((?:\|.+?\|\r?\n)+)/g, (tableBlock) => {
      const rows = tableBlock.trim().split('\n');
      if (rows.length < 2) return tableBlock;
      
      const headerCols = rows[0].split('|').filter(c => c.trim() !== '');
      const dataRows = rows.slice(2); // skip header and delimiter row

      let tableHtml = '<div class="overflow-x-auto my-3"><table class="w-full text-xs text-left border border-slate-800 rounded-lg overflow-hidden">';
      tableHtml += '<thead class="bg-slate-800 text-slate-300"><tr>';
      headerCols.forEach(col => {
        tableHtml += `<th class="p-2 border-b border-slate-700 font-semibold">${col.trim()}</th>`;
      });
      tableHtml += '</tr></thead><tbody>';

      dataRows.forEach(row => {
        const cols = row.split('|').filter(c => c.trim() !== '');
        if (cols.length > 0) {
          tableHtml += '<tr class="border-b border-slate-800/60 hover:bg-slate-800/30">';
          cols.forEach(col => {
            tableHtml += `<td class="p-2 text-slate-300">${col.trim()}</td>`;
          });
          tableHtml += '</tr>';
        }
      });

      tableHtml += '</tbody></table></div>';
      return tableHtml;
    });

    // Paragraphs / line breaks
    raw = raw.replace(/\n\n/g, '<div class="h-3"></div>');

    return raw;
  }, [markdown]);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    setCopiedType('md');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlOutput);
    setCopiedType('html');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const insertSnippet = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.substring(start, end) || 'text';
    const updated = markdown.substring(0, start) + prefix + selected + suffix + markdown.substring(end);
    setMarkdown(updated);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 10);
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Markdown Studio & Live Previewer</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                GFM Ready
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Format, preview, and export documentation, READMEs, and formatted articles.
            </p>
          </div>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Toolbar for insertions */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => insertSnippet('**', '**')}
              title="Bold"
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertSnippet('*', '*')}
              title="Italic"
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertSnippet('### ')}
              title="Heading"
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
            >
              <Heading className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertSnippet('- ')}
              title="Bullet List"
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertSnippet('```typescript\n', '\n```')}
              title="Code Block"
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertSnippet('| Header 1 | Header 2 |\n| :--- | :--- |\n| Cell 1 | Cell 2 |')}
              title="Insert Table"
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* View Mode Selector */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                viewMode === 'edit' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                viewMode === 'split' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                viewMode === 'preview' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          <button
            onClick={() => setShowCheatSheet(!showCheatSheet)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
            title="Markdown Syntax Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cheat Sheet Drawer */}
      {showCheatSheet && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 grid grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in">
          <div>
            <div className="font-bold text-white mb-1">Headers</div>
            <code className="text-slate-400 block font-mono"># H1 | ## H2 | ### H3</code>
          </div>
          <div>
            <div className="font-bold text-white mb-1">Emphasis</div>
            <code className="text-slate-400 block font-mono">**bold** | *italic*</code>
          </div>
          <div>
            <div className="font-bold text-white mb-1">Links & Images</div>
            <code className="text-slate-400 block font-mono">[Title](url) | ![Alt](url)</code>
          </div>
          <div>
            <div className="font-bold text-white mb-1">Lists & Tasks</div>
            <code className="text-slate-400 block font-mono">- [x] Done | - [ ] Todo</code>
          </div>
        </div>
      )}

      {/* Main Split Editor / Preview Area */}
      <div className={`grid gap-4 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Editor Box */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-lg">
            <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-blue-400" /> Raw Markdown
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMarkdown('')}
                  className="text-[11px] text-slate-400 hover:text-rose-400 px-2 py-0.5 rounded transition"
                >
                  Clear
                </button>
                <button
                  onClick={() => setMarkdown(SAMPLE_MARKDOWN)}
                  className="text-[11px] text-slate-400 hover:text-blue-400 px-2 py-0.5 rounded transition"
                >
                  Reset Sample
                </button>
              </div>
            </div>
            <textarea
              id="markdown-textarea"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Type your markdown here..."
              rows={22}
              className="w-full flex-1 bg-slate-950 p-4 font-mono text-xs text-slate-200 resize-y focus:outline-hidden leading-relaxed"
            />
          </div>
        )}

        {/* Live Preview Box */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-lg">
            <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-400" /> Formatted Output
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyHtml}
                  className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                >
                  {copiedType === 'html' ? <Check className="w-3 h-3 text-emerald-400" /> : <Code className="w-3 h-3 text-cyan-400" />}
                  <span>{copiedType === 'html' ? 'HTML Copied!' : 'Copy HTML'}</span>
                </button>
                <button
                  onClick={handleCopyMarkdown}
                  className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                >
                  {copiedType === 'md' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-blue-400" />}
                  <span>{copiedType === 'md' ? 'Markdown Copied!' : 'Copy MD'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  title="Download .md file"
                  className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div
              className="p-6 bg-slate-950/70 overflow-y-auto max-h-[550px] leading-relaxed text-xs text-slate-300"
              dangerouslySetInnerHTML={{ __html: htmlOutput }}
            />
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <span><strong className="text-white font-mono">{stats.words}</strong> words</span>
          <span><strong className="text-white font-mono">{stats.characters}</strong> characters</span>
          <span><strong className="text-white font-mono">{stats.lines}</strong> lines</span>
          <span>~<strong className="text-cyan-400 font-mono">{stats.readingTime}</strong> min read</span>
        </div>
        <div className="text-[11px] text-slate-500">
          Auto-saves locally in memory • Markdown syntax compliant
        </div>
      </div>
    </div>
  );
};
