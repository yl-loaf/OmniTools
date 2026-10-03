import React, { useState, useMemo } from 'react';
import { Globe, Copy, Check, Eye, Sparkles, Share2, Search } from 'lucide-react';

export const MetaTagGenerator: React.FC = () => {
  const [title, setTitle] = useState('OmniTools - Free Community Web Utilities');
  const [description, setDescription] = useState('Explore 25+ free, high-performance browser utilities including calculators, converters, regex labs, and code formatters.');
  const [url, setUrl] = useState('https://omnitools.dev');
  const [imageUrl, setImageUrl] = useState('https://omnitools.dev/og-cover.png');
  const [siteName, setSiteName] = useState('OmniTools Hub');
  const [author, setAuthor] = useState('OmniTools Community');
  const [twitterHandle, setTwitterHandle] = useState('@omnitools');
  const [copied, setCopied] = useState(false);

  const metaHtml = useMemo(() => {
    return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">
<meta name="author" content="${author}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:site_name" content="${siteName}">

<!-- Twitter Card -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${imageUrl}">
<meta name="twitter:site" content="${twitterHandle}">`;
  }, [title, description, url, imageUrl, siteName, author, twitterHandle]);

  const handleCopy = () => {
    navigator.clipboard.writeText(metaHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>SEO Meta Tag & Social Share Card Studio</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                OpenGraph & Twitter
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Generate metadata headers, search engine previews, and social sharing cards.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-md"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'HTML Copied!' : 'Copy Meta Tags'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Form Inputs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Metadata Parameters</h3>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Website Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Meta Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Canonical URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Twitter Handle</label>
              <input
                type="text"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Social Share Image URL (OG Image)</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-cyan-300 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Live Social Card Preview */}
        <div className="space-y-4">
          {/* Google Search Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
            <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
              <Search className="w-3 h-3 text-cyan-400" /> Google Search Result Preview
            </div>
            <div className="text-xs text-slate-400 truncate">{url}</div>
            <div className="text-sm font-bold text-blue-400 hover:underline cursor-pointer truncate">{title}</div>
            <div className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{description}</div>
          </div>

          {/* Social Card Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="h-40 bg-gradient-to-tr from-blue-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 text-center border-b border-slate-800 relative">
              <Share2 className="w-8 h-8 text-cyan-400 mb-1" />
              <span className="text-xs font-bold text-white/80 absolute bottom-3">Social Share Cover</span>
            </div>
            <div className="p-4 space-y-1 bg-slate-950">
              <div className="text-[10px] text-slate-400 font-mono uppercase">{new URL(url || 'https://example.com').hostname}</div>
              <div className="text-sm font-bold text-white truncate">{title}</div>
              <div className="text-xs text-slate-400 line-clamp-2">{description}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
