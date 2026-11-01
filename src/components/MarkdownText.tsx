import React from 'react';

/** Minimal, safe Markdown renderer (no HTML injection): headings, lists, bold, italic, inline/fenced code. */
function inline(text: string, keyPrefix: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g;
  let last = 0; let m: RegExpExecArray | null; let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) out.push(<strong key={`${keyPrefix}-${i++}`}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith('`')) out.push(<code key={`${keyPrefix}-${i++}`} className="px-1 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700/70 font-mono text-[0.9em]">{tok.slice(1, -1)}</code>);
    else out.push(<em key={`${keyPrefix}-${i++}`}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function MarkdownText({ text, className = '' }: { text: string; className?: string }) {
  const lines = (text || '').replace(/\r/g, '').split('\n');
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let code: string[] | null = null;
  const flushList = () => {
    if (!list) return;
    const Tag: any = list.ordered ? 'ol' : 'ul';
    blocks.push(<Tag key={`l${blocks.length}`} className={`${list.ordered ? 'list-decimal' : 'list-disc'} pl-5 space-y-1 my-2`}>{list.items.map((it, i) => <li key={i}>{inline(it, `li${blocks.length}-${i}`)}</li>)}</Tag>);
    list = null;
  };
  lines.forEach((raw, idx) => {
    if (raw.trim().startsWith('```')) {
      if (code) { blocks.push(<pre key={`c${idx}`} className="my-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-x-auto font-mono text-xs">{code.join('\n')}</pre>); code = null; }
      else { flushList(); code = []; }
      return;
    }
    if (code) { code.push(raw); return; }
    const h = raw.match(/^(#{1,4})\s+(.*)$/);
    const ul = raw.match(/^\s*[-*•]\s+(.*)$/);
    const ol = raw.match(/^\s*\d+[.)]\s+(.*)$/);
    if (h) { flushList(); const lvl = h[1].length; blocks.push(<div key={`h${idx}`} className={`${lvl === 1 ? 'text-lg' : lvl === 2 ? 'text-base' : 'text-sm'} font-bold mt-3 mb-1`}>{inline(h[2], `h${idx}`)}</div>); }
    else if (ul || ol) {
      const ordered = Boolean(ol);
      if (!list || list.ordered !== ordered) { flushList(); list = { ordered, items: [] }; }
      list.items.push((ul || ol)![1]);
    } else if (!raw.trim()) { flushList(); }
    else { flushList(); blocks.push(<p key={`p${idx}`} className="my-1.5">{inline(raw, `p${idx}`)}</p>); }
  });
  flushList();
  if (code) blocks.push(<pre key="cend" className="my-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-x-auto font-mono text-xs">{(code as string[]).join('\n')}</pre>);
  return <div className={className}>{blocks}</div>;
}
