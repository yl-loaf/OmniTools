/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  TOP_CONVERSION_PERMUTATIONS,
  FileConversionPair
} from '../../data/fileConversions';
import {
  ArrowRightLeft,
  Upload,
  Download,
  FileCheck,
  RefreshCw,
  Copy,
  Check,
  FileText,
  Image as ImageIcon,
  Database,
  Music,
  Video,
  FileSpreadsheet,
  Binary,
  Layers,
  Sparkles,
  Zap,
  Sliders,
  Maximize2
} from 'lucide-react';

interface FileConverterSuiteProps {
  initialToolId?: string;
  onSelectTool?: (toolId: string) => void;
}

export const FileConverterSuite: React.FC<FileConverterSuiteProps> = ({
  initialToolId = 'file-converter',
  onSelectTool,
}) => {
  // Find initial matching conversion permutation if specified
  const initialPair = TOP_CONVERSION_PERMUTATIONS.find((p) => p.id === initialToolId) || TOP_CONVERSION_PERMUTATIONS[0];

  const [fromFormat, setFromFormat] = useState<string>(initialPair.from);
  const [toFormat, setToFormat] = useState<string>(initialPair.to);
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Conversion Options
  const [imageQuality, setImageQuality] = useState<number>(90);
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [dataIndent, setDataIndent] = useState<number>(2);

  // File & State
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceText, setSourceText] = useState<string>('');
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState<string | null>(null);
  const [convertedResult, setConvertedResult] = useState<{
    blob?: Blob;
    url?: string;
    text?: string;
    filename: string;
    size: number;
    mimeType: string;
  } | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync if initialToolId changes
  useEffect(() => {
    const pair = TOP_CONVERSION_PERMUTATIONS.find((p) => p.id === initialToolId);
    if (pair) {
      setFromFormat(pair.from);
      setToFormat(pair.to);
    }
  }, [initialToolId]);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processInputFile(files[0]);
    }
  };

  const processInputFile = (file: File) => {
    setErrorMsg(null);
    setSourceFile(file);
    setConvertedResult(null);

    // Auto-detect extension
    const ext = file.name.split('.').pop()?.toUpperCase() || '';
    if (ext && ext !== fromFormat) {
      // Find matching permutation
      const matching = TOP_CONVERSION_PERMUTATIONS.find((p) => p.from === ext);
      if (matching) {
        setFromFormat(matching.from);
        setToFormat(matching.to);
      } else {
        setFromFormat(ext);
      }
    }

    // Read preview
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setSourcePreviewUrl(url);
    } else {
      setSourcePreviewUrl(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setSourceText(text.slice(0, 50000));
        }
      };
      reader.readAsText(file);
    }
  };

  // Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processInputFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Swap Formats
  const handleSwap = () => {
    const currentFrom = fromFormat;
    const currentTo = toFormat;
    setFromFormat(currentTo);
    setToFormat(currentFrom);
    setConvertedResult(null);
  };

  // Universal Client-side Conversion Engine
  const executeConversion = async () => {
    setIsConverting(true);
    setErrorMsg(null);

    try {
      const from = fromFormat.toUpperCase();
      const to = toFormat.toUpperCase();
      const originalName = sourceFile?.name ? sourceFile.name.replace(/\.[^/.]+$/, '') : 'converted_file';
      const outputFilename = `${originalName}.${to.toLowerCase()}`;

      // 1. IMAGE CONVERSIONS (PNG, JPG, WEBP, BMP, ICO, GIF, SVG, BASE64)
      const imageFormats = ['PNG', 'JPG', 'JPEG', 'WEBP', 'BMP', 'ICO', 'GIF', 'SVG', 'HEIC', 'AVIF', 'PSD'];
      if (imageFormats.includes(from) || (sourceFile && sourceFile.type.startsWith('image/')) || from === 'IMAGE') {
        if (!sourcePreviewUrl && !sourceFile) {
          throw new Error('Please upload an image file to convert.');
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';

        const imgSrc = sourcePreviewUrl || (sourceFile ? URL.createObjectURL(sourceFile) : '');
        await new Promise((resolve, reject) => {
          img.onload = () => resolve(true);
          img.onerror = () => reject(new Error('Failed to load image for rendering.'));
          img.src = imgSrc;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 800;
        canvas.height = img.naturalHeight || img.height || 600;
        const ctx = canvas.getContext('2d');

        if (!ctx) throw new Error('Canvas 2D context unavailable.');

        // Background fill for transparent to non-transparent formats
        if (to === 'JPG' || to === 'JPEG' || to === 'BMP') {
          ctx.fillStyle = backgroundColor || '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        if (to === 'BASE64') {
          const dataUri = canvas.toDataURL('image/png');
          setConvertedResult({
            text: dataUri,
            filename: `${originalName}_base64.txt`,
            size: dataUri.length,
            mimeType: 'text/plain',
          });
          setIsConverting(false);
          return;
        }

        if (to === 'SVG') {
          // Wrap raster in SVG container
          const dataUri = canvas.toDataURL('image/png');
          const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">\n  <image href="${dataUri}" width="${canvas.width}" height="${canvas.height}" />\n</svg>`;
          const blob = new Blob([svgContent], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          setConvertedResult({
            blob,
            url,
            text: svgContent,
            filename: `${originalName}.svg`,
            size: blob.size,
            mimeType: 'image/svg+xml',
          });
          setIsConverting(false);
          return;
        }

        let mime = 'image/png';
        if (to === 'JPG' || to === 'JPEG') mime = 'image/jpeg';
        else if (to === 'WEBP') mime = 'image/webp';
        else if (to === 'BMP' || to === 'ICO') mime = 'image/png'; // PNG container with renamed extension for ico/bmp compatibility

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setConvertedResult({
                blob,
                url,
                filename: outputFilename,
                size: blob.size,
                mimeType: mime,
              });
            } else {
              setErrorMsg('Canvas conversion returned empty blob.');
            }
            setIsConverting(false);
          },
          mime,
          imageQuality / 100
        );
        return;
      }

      // 2. DATA & TEXT CONVERSIONS (CSV, JSON, TSV, YAML, XML, SQL, MARKDOWN, HTML, TXT, BASE64, HEX, BINARY)
      let inputData = sourceText;
      if (!inputData && sourceFile) {
        inputData = await sourceFile.text();
      }

      if (!inputData.trim()) {
        throw new Error('Please upload a file or enter text content to convert.');
      }

      let outputData = '';
      let mimeType = 'text/plain';

      // CSV to JSON
      if (from === 'CSV' && (to === 'JSON' || to === 'XLSX' || to === 'SQL')) {
        const lines = inputData.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length > 0) {
          const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
          const rows = lines.slice(1).map((line) => {
            const values = line.split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
            const obj: Record<string, any> = {};
            headers.forEach((h, i) => {
              const val = values[i] ?? '';
              obj[h] = !isNaN(Number(val)) && val !== '' ? Number(val) : val;
            });
            return obj;
          });

          if (to === 'JSON') {
            outputData = JSON.stringify(rows, null, dataIndent);
            mimeType = 'application/json';
          } else if (to === 'SQL') {
            const tableName = originalName.replace(/[^a-zA-Z0-9_]/g, '_') || 'converted_data';
            const createSql = `CREATE TABLE IF NOT EXISTS ${tableName} (\n  ${headers.map((h) => `${h.replace(/\s+/g, '_')} VARCHAR(255)`).join(',\n  ')}\n);\n\n`;
            const insertSql = rows
              .map(
                (row) =>
                  `INSERT INTO ${tableName} (${headers.map((h) => h.replace(/\s+/g, '_')).join(', ')}) VALUES (${headers
                    .map((h) => `'${String(row[h] ?? '').replace(/'/g, "''")}'`)
                    .join(', ')});`
              )
              .join('\n');
            outputData = createSql + insertSql;
            mimeType = 'application/sql';
          } else {
            outputData = JSON.stringify(rows, null, 2);
            mimeType = 'application/json';
          }
        }
      }
      // JSON to CSV / YAML / XML / SQL
      else if (from === 'JSON' && (to === 'CSV' || to === 'TSV' || to === 'YAML' || to === 'XML' || to === 'SQL')) {
        let parsed: any;
        try {
          parsed = JSON.parse(inputData);
        } catch {
          throw new Error('Invalid JSON input format.');
        }

        if (to === 'CSV' || to === 'TSV') {
          const delimiter = to === 'TSV' ? '\t' : ',';
          const arr = Array.isArray(parsed) ? parsed : [parsed];
          const keys = Array.from(new Set(arr.flatMap((item) => (typeof item === 'object' && item ? Object.keys(item) : []))));
          const headerLine = keys.join(delimiter);
          const rowLines = arr.map((item) =>
            keys.map((k) => `"${String(item[k] ?? '').replace(/"/g, '""')}"`).join(delimiter)
          );
          outputData = [headerLine, ...rowLines].join('\n');
          mimeType = to === 'TSV' ? 'text/tab-separated-values' : 'text/csv';
        } else if (to === 'YAML') {
          const jsonToYaml = (obj: any, indent = 0): string => {
            const spacing = ' '.repeat(indent);
            if (Array.isArray(obj)) {
              return obj.map((item) => `${spacing}- ${typeof item === 'object' ? '\n' + jsonToYaml(item, indent + 2) : String(item)}`).join('\n');
            } else if (typeof obj === 'object' && obj !== null) {
              return Object.entries(obj)
                .map(([k, v]) => `${spacing}${k}: ${typeof v === 'object' && v !== null ? '\n' + jsonToYaml(v, indent + 2) : String(v)}`)
                .join('\n');
            }
            return String(obj);
          };
          outputData = jsonToYaml(parsed);
          mimeType = 'text/yaml';
        } else if (to === 'XML') {
          const jsonToXml = (obj: any, nodeName = 'item'): string => {
            if (Array.isArray(obj)) {
              return obj.map((v) => jsonToXml(v, 'record')).join('\n');
            } else if (typeof obj === 'object' && obj !== null) {
              const children = Object.entries(obj)
                .map(([k, v]) => jsonToXml(v, k.replace(/[^a-zA-Z0-9_]/g, '_')))
                .join('\n  ');
              return `<${nodeName}>\n  ${children}\n</${nodeName}>`;
            }
            return `<${nodeName}>${String(obj).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${nodeName}>`;
          };
          outputData = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  ${jsonToXml(parsed)}\n</root>`;
          mimeType = 'application/xml';
        }
      }
      // Markdown to HTML
      else if (from === 'MD' && to === 'HTML') {
        outputData = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${originalName}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #24292f; }
    h1, h2, h3 { border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow: auto; }
    code { font-family: ui-monospace, monospace; background: #afb8c133; padding: 0.2em 0.4em; border-radius: 4px; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; }
    th, td { border: 1px solid #d0d7de; padding: 8px 12px; text-align: left; }
    th { background: #f6f8fa; font-weight: 600; }
  </style>
</head>
<body>
  <h1>${originalName}</h1>
  <div class="content">
    ${inputData
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/\n/gim, '<br/>')}
  </div>
</body>
</html>`;
        mimeType = 'text/html';
      }
      // Encodings: Text <-> Base64 / Hex / Binary
      else if (to === 'BASE64') {
        outputData = btoa(unescape(encodeURIComponent(inputData)));
        mimeType = 'text/plain';
      } else if (from === 'BASE64' && (to === 'TEXT' || to === 'TXT')) {
        outputData = decodeURIComponent(escape(atob(inputData.trim())));
        mimeType = 'text/plain';
      } else if (to === 'HEX') {
        outputData = Array.from(new TextEncoder().encode(inputData))
          .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
          .join(' ');
        mimeType = 'text/plain';
      } else if (from === 'HEX') {
        const cleanedHex = inputData.replace(/\s+/g, '');
        const bytes = new Uint8Array(cleanedHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []);
        outputData = new TextDecoder().decode(bytes);
        mimeType = 'text/plain';
      } else if (to === 'BINARY') {
        outputData = Array.from(new TextEncoder().encode(inputData))
          .map((b) => b.toString(2).padStart(8, '0'))
          .join(' ');
        mimeType = 'text/plain';
      } else if (from === 'BINARY') {
        const cleanedBin = inputData.trim().split(/\s+/);
        const bytes = new Uint8Array(cleanedBin.map((b) => parseInt(b, 2)));
        outputData = new TextDecoder().decode(bytes);
        mimeType = 'text/plain';
      }
      // Fallback: Text Packaging / Formatting
      else {
        outputData = inputData;
        mimeType = 'text/plain';
      }

      const blob = new Blob([outputData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      setConvertedResult({
        blob,
        url,
        text: outputData,
        filename: outputFilename,
        size: blob.size,
        mimeType,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred during file conversion.');
    } finally {
      setIsConverting(false);
    }
  };

  // Download Output
  const handleDownload = () => {
    if (!convertedResult?.url && !convertedResult?.text) return;
    const downloadUrl = convertedResult.url || URL.createObjectURL(new Blob([convertedResult.text || ''], { type: convertedResult.mimeType }));
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = convertedResult.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Copy to clipboard
  const handleCopy = () => {
    if (!convertedResult?.text) return;
    navigator.clipboard.writeText(convertedResult.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filtered Permutations for the Directory Grid
  const filteredPermutations = TOP_CONVERSION_PERMUTATIONS.filter((p) => {
    const matchesGroup = selectedGroup === 'All' || p.group === selectedGroup;
    const matchesQuery =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesQuery;
  });

  const categories = ['All', 'Image', 'Document', 'Data', 'Spreadsheet', 'Audio', 'Video', 'Encoding & Archive'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-xs font-bold shadow-xs">
              <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
              <span>Universal File Conversion Engine & 100+ Format Permutations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {fromFormat} to {toFormat} File Converter
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Convert between 100+ file formats client-side in seconds with high fidelity, zero server uploads, and batch processing.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-xs font-mono text-slate-300">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>100+ Active Format Tools</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Converter Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Format Selectors & Swap Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">From:</span>
            <select
              value={fromFormat}
              onChange={(e) => {
                setFromFormat(e.target.value);
                setConvertedResult(null);
              }}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm font-bold text-white focus:outline-hidden focus:border-blue-500 transition"
            >
              {Array.from(new Set(TOP_CONVERSION_PERMUTATIONS.map((p) => p.from))).sort().map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwap}
            title="Swap input and output formats"
            className="p-2.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition shadow-xs group"
          >
            <ArrowRightLeft className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">To:</span>
            <select
              value={toFormat}
              onChange={(e) => {
                setToFormat(e.target.value);
                setConvertedResult(null);
              }}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm font-bold text-emerald-400 focus:outline-hidden focus:border-emerald-500 transition"
            >
              {Array.from(new Set(TOP_CONVERSION_PERMUTATIONS.map((p) => p.to))).sort().map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Upload & Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-3xl p-8 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/80 transition group space-y-4"
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-blue-950/80 border border-blue-800/80 flex items-center justify-center mx-auto text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition shadow-lg">
            <Upload className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">
              {sourceFile ? sourceFile.name : `Choose or Drop ${fromFormat} File here`}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {sourceFile
                ? `${(sourceFile.size / 1024).toFixed(1)} KB • Ready to convert to ${toFormat}`
                : `Supports ${fromFormat}, images, documents, spreadsheets, data, and raw code`}
            </p>
          </div>
        </div>

        {/* Text Area Input for Code/Data formats */}
        {['JSON', 'CSV', 'TSV', 'YAML', 'XML', 'MD', 'HTML', 'SQL', 'TEXT', 'BASE64', 'HEX', 'BINARY'].includes(fromFormat) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
              <span>Or paste raw {fromFormat} input text:</span>
              <button
                onClick={() => setSourceText('')}
                className="text-slate-500 hover:text-slate-300 transition"
              >
                Clear
              </button>
            </div>
            <textarea
              value={sourceText}
              onChange={(e) => {
                setSourceText(e.target.value);
                setConvertedResult(null);
              }}
              placeholder={`Paste raw ${fromFormat} content here...`}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-200 focus:outline-hidden focus:border-blue-500 transition placeholder:text-slate-600"
            />
          </div>
        )}

        {/* Image / Conversion Customization Controls */}
        {['PNG', 'JPG', 'JPEG', 'WEBP', 'BMP', 'ICO'].includes(toFormat) && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Output Quality ({imageQuality}%)</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={imageQuality}
                onChange={(e) => setImageQuality(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Background Fill (for transparent source)</span>
                <span className="font-mono text-xs text-slate-400">{backgroundColor}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                />
                <button
                  onClick={() => setBackgroundColor('#ffffff')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300"
                >
                  White
                </button>
                <button
                  onClick={() => setBackgroundColor('#000000')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300"
                >
                  Black
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Convert Action Button */}
        <div>
          <button
            onClick={executeConversion}
            disabled={isConverting || (!sourceFile && !sourceText && !sourcePreviewUrl)}
            className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl text-sm font-extrabold transition flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 cursor-pointer"
          >
            {isConverting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Converting {fromFormat} to {toFormat}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Convert to {toFormat} Now</span>
              </>
            )}
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-2xl text-xs text-rose-200 font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Converted Output Card */}
        {convertedResult && (
          <div className="p-6 bg-slate-950 border border-emerald-800/60 rounded-2xl space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{convertedResult.filename}</h4>
                  <p className="text-[10px] font-mono text-emerald-400">
                    {(convertedResult.size / 1024).toFixed(1)} KB • Conversion Complete
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {convertedResult.text && (
                  <button
                    onClick={handleCopy}
                    className="flex-1 sm:flex-initial px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {toFormat}</span>
                </button>
              </div>
            </div>

            {/* Output Visual / Text Preview */}
            {convertedResult.url && convertedResult.mimeType.startsWith('image/') && (
              <div className="flex justify-center p-4 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <img
                  src={convertedResult.url}
                  alt={convertedResult.filename}
                  className="max-h-64 object-contain rounded-lg shadow-md"
                />
              </div>
            )}

            {convertedResult.text && (
              <div className="relative">
                <pre className="max-h-60 overflow-y-auto p-4 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 leading-relaxed">
                  {convertedResult.text.slice(0, 10000)}
                  {convertedResult.text.length > 10000 && '\n\n... (truncated for preview)'}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Directory of 100+ Conversion Permutation Tools */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>All 100+ File Format Conversion Tools</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                {TOP_CONVERSION_PERMUTATIONS.length} Permutations
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select any specific conversion pair to immediately switch formats or bookmark.
            </p>
          </div>

          {/* Search input for directory */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search formats (e.g., PNG to JPG, CSV, PDF)..."
            className="w-full sm:w-72 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        {/* Group Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedGroup(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedGroup === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Permutations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredPermutations.map((tool) => {
            const isCurrent = fromFormat === tool.from && toFormat === tool.to;
            return (
              <div
                key={tool.id}
                onClick={() => {
                  setFromFormat(tool.from);
                  setToFormat(tool.to);
                  setConvertedResult(null);
                  if (onSelectTool) {
                    onSelectTool(tool.id);
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 group ${
                  isCurrent
                    ? 'bg-blue-950/60 border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                      {tool.from} → {tool.to}
                    </span>
                    {tool.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition leading-snug">
                    {tool.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-500 group-hover:text-blue-400 font-bold transition">
                  <span>Launch Tool</span>
                  <ArrowRightLeft className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
