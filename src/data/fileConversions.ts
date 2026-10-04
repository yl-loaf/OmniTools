/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRightLeft } from 'lucide-react';
import { ToolRequest } from '../types';

export interface FileConversionPair {
  id: string;
  from: string;
  to: string;
  name: string;
  shortLabel: string;
  desc: string;
  group: 'Image' | 'Document' | 'Data' | 'Spreadsheet' | 'Audio' | 'Video' | 'Encoding & Archive';
  badge?: string;
}

export const TOP_CONVERSION_PERMUTATIONS: FileConversionPair[] = [
  // Image Permutations
  { id: 'convert-png-to-jpg', from: 'PNG', to: 'JPG', name: 'PNG to JPG Image Converter', shortLabel: 'PNG to JPG', desc: 'Convert lossless PNG images to lightweight JPG with background color control and quality compression', group: 'Image', badge: 'Popular' },
  { id: 'convert-jpg-to-png', from: 'JPG', to: 'PNG', name: 'JPG to PNG Image Converter', shortLabel: 'JPG to PNG', desc: 'Convert JPG photos to lossless PNG format with transparent alpha channel support', group: 'Image', badge: 'Popular' },
  { id: 'convert-png-to-webp', from: 'PNG', to: 'WEBP', name: 'PNG to WEBP Modern Converter', shortLabel: 'PNG to WEBP', desc: 'Optimize PNG graphics into modern, high-compression Google WEBP format for fast web delivery', group: 'Image', badge: 'Fast' },
  { id: 'convert-webp-to-png', from: 'WEBP', to: 'PNG', name: 'WEBP to PNG Decoder', shortLabel: 'WEBP to PNG', desc: 'Decode Google WEBP graphics back into standard PNG format for universal photo editing', group: 'Image', badge: 'Popular' },
  { id: 'convert-jpg-to-webp', from: 'JPG', to: 'WEBP', name: 'JPG to WEBP Optimizer', shortLabel: 'JPG to WEBP', desc: 'Convert JPEG photos to WEBP saving up to 40% file size without visible fidelity loss', group: 'Image', badge: 'Popular' },
  { id: 'convert-webp-to-jpg', from: 'WEBP', to: 'JPG', name: 'WEBP to JPG Converter', shortLabel: 'WEBP to JPG', desc: 'Extract and convert WEBP web images into standard JPEG format for legacy applications', group: 'Image' },
  { id: 'convert-svg-to-png', from: 'SVG', to: 'PNG', name: 'SVG to High-Res PNG Rasterizer', shortLabel: 'SVG to PNG', desc: 'Render scalable vector SVG graphics into crisp, transparent PNG bitmap images at any dimension', group: 'Image', badge: 'Popular' },
  { id: 'convert-png-to-svg', from: 'PNG', to: 'SVG', name: 'PNG to Vector SVG Converter', shortLabel: 'PNG to SVG', desc: 'Trace bitmap PNG images and embed vectorized paths into standard SVG XML format', group: 'Image' },
  { id: 'convert-png-to-ico', from: 'PNG', to: 'ICO', name: 'PNG to Windows Favicon ICO Generator', shortLabel: 'PNG to ICO', desc: 'Generate multi-resolution 16x16, 32x32, and 48x48 ICO favicons from square PNG files', group: 'Image', badge: 'Utility' },
  { id: 'convert-ico-to-png', from: 'ICO', to: 'PNG', name: 'ICO to PNG Icon Extractor', shortLabel: 'ICO to PNG', desc: 'Extract high-resolution PNG images from Windows favicon ICO files', group: 'Image' },
  { id: 'convert-png-to-bmp', from: 'PNG', to: 'BMP', name: 'PNG to Bitmap BMP Converter', shortLabel: 'PNG to BMP', desc: 'Convert PNG images into uncompressed Windows Bitmap BMP graphics', group: 'Image' },
  { id: 'convert-bmp-to-png', from: 'BMP', to: 'PNG', name: 'BMP to PNG Image Converter', shortLabel: 'BMP to PNG', desc: 'Compress legacy BMP bitmaps into lossless PNG files', group: 'Image' },
  { id: 'convert-jpg-to-bmp', from: 'JPG', to: 'BMP', name: 'JPG to BMP Bitmap Converter', shortLabel: 'JPG to BMP', desc: 'Decode JPEG images to raw Windows BMP raster files', group: 'Image' },
  { id: 'convert-bmp-to-jpg', from: 'BMP', to: 'JPG', name: 'BMP to JPG Photo Converter', shortLabel: 'BMP to JPG', desc: 'Compress uncompressed BMP bitmap images into compact JPG photos', group: 'Image' },
  { id: 'convert-png-to-gif', from: 'PNG', to: 'GIF', name: 'PNG to GIF Graphic Converter', shortLabel: 'PNG to GIF', desc: 'Convert PNG images to 8-bit indexed GIF palettes with transparent background support', group: 'Image' },
  { id: 'convert-gif-to-png', from: 'GIF', to: 'PNG', name: 'GIF to PNG Frame Converter', shortLabel: 'GIF to PNG', desc: 'Extract full 24-bit color PNG images from GIF animations or static graphics', group: 'Image' },
  { id: 'convert-jpg-to-gif', from: 'JPG', to: 'GIF', name: 'JPG to GIF Image Converter', shortLabel: 'JPG to GIF', desc: 'Convert 24-bit JPEG photos into indexed 256-color GIF format', group: 'Image' },
  { id: 'convert-gif-to-jpg', from: 'GIF', to: 'JPG', name: 'GIF to JPG Photo Converter', shortLabel: 'GIF to JPG', desc: 'Convert GIF frames into smooth continuous-tone JPEG files', group: 'Image' },
  { id: 'convert-png-to-tiff', from: 'PNG', to: 'TIFF', name: 'PNG to TIFF Print Converter', shortLabel: 'PNG to TIFF', desc: 'Convert PNG graphics into uncompressed TIFF format for commercial publishing and printing', group: 'Image' },
  { id: 'convert-tiff-to-png', from: 'TIFF', to: 'PNG', name: 'TIFF to PNG Image Converter', shortLabel: 'TIFF to PNG', desc: 'Convert heavy TIFF print files into lightweight PNG images', group: 'Image' },
  { id: 'convert-jpg-to-tiff', from: 'JPG', to: 'TIFF', name: 'JPG to TIFF Converter', shortLabel: 'JPG to TIFF', desc: 'Prepare JPG photos for print layout by packaging into TIFF container', group: 'Image' },
  { id: 'convert-tiff-to-jpg', from: 'TIFF', to: 'JPG', name: 'TIFF to JPG Photo Converter', shortLabel: 'TIFF to JPG', desc: 'Convert heavyweight TIFF scans into web-friendly JPG images', group: 'Image' },
  { id: 'convert-heic-to-jpg', from: 'HEIC', to: 'JPG', name: 'HEIC to JPG iPhone Photo Converter', shortLabel: 'HEIC to JPG', desc: 'Convert Apple iPhone HEIC/HEIF live photos to standard JPEG for universal viewing', group: 'Image', badge: 'Popular' },
  { id: 'convert-heic-to-png', from: 'HEIC', to: 'PNG', name: 'HEIC to PNG Lossless Converter', shortLabel: 'HEIC to PNG', desc: 'Convert Apple HEIC photos into crisp transparent PNG graphics', group: 'Image' },
  { id: 'convert-avif-to-jpg', from: 'AVIF', to: 'JPG', name: 'AVIF to JPG Image Converter', shortLabel: 'AVIF to JPG', desc: 'Convert next-gen AV1 AVIF images into standard JPEG format', group: 'Image' },
  { id: 'convert-avif-to-png', from: 'AVIF', to: 'PNG', name: 'AVIF to PNG Image Converter', shortLabel: 'AVIF to PNG', desc: 'Extract transparent or lossless PNG graphics from AVIF files', group: 'Image' },
  { id: 'convert-psd-to-png', from: 'PSD', to: 'PNG', name: 'PSD to PNG Photoshop Extractor', shortLabel: 'PSD to PNG', desc: 'Extract full-resolution flattened PNG preview from Adobe Photoshop PSD files', group: 'Image' },
  { id: 'convert-psd-to-jpg', from: 'PSD', to: 'JPG', name: 'PSD to JPG Flattened Converter', shortLabel: 'PSD to JPG', desc: 'Render and flatten Adobe Photoshop PSD documents into compact JPG previews', group: 'Image' },
  { id: 'convert-eps-to-svg', from: 'EPS', to: 'SVG', name: 'EPS to SVG Vector Converter', shortLabel: 'EPS to SVG', desc: 'Convert encapsulated PostScript EPS vector drawings into modern SVG code', group: 'Image' },
  { id: 'convert-svg-to-jpg', from: 'SVG', to: 'JPG', name: 'SVG to JPG High-Quality Rasterizer', shortLabel: 'SVG to JPG', desc: 'Render vector SVG diagrams directly into crisp JPEG images with custom background fill', group: 'Image' },
  { id: 'convert-raw-to-jpg', from: 'RAW', to: 'JPG', name: 'Camera RAW to JPG Developer', shortLabel: 'RAW to JPG', desc: 'Process camera RAW digital negative files (CR2, NEF, ARW, DNG) into web JPGs', group: 'Image' },
  { id: 'convert-raw-to-png', from: 'RAW', to: 'PNG', name: 'Camera RAW to Lossless PNG', shortLabel: 'RAW to PNG', desc: 'Render high dynamic range camera RAW files into lossless 24-bit PNG images', group: 'Image' },

  // Document & PDF Permutations
  { id: 'convert-pdf-to-png', from: 'PDF', to: 'PNG', name: 'PDF to PNG High-Res Rasterizer', shortLabel: 'PDF to PNG', desc: 'Render PDF document pages into high-resolution transparent PNG images', group: 'Document', badge: 'Popular' },
  { id: 'convert-pdf-to-jpg', from: 'PDF', to: 'JPG', name: 'PDF to JPG Page Extractor', shortLabel: 'PDF to JPG', desc: 'Extract each page of a PDF document into standard JPEG photo files', group: 'Document', badge: 'Popular' },
  { id: 'convert-png-to-pdf', from: 'PNG', to: 'PDF', name: 'PNG to PDF Document Creator', shortLabel: 'PNG to PDF', desc: 'Assemble single or multiple PNG images into a clean, printable PDF document', group: 'Document', badge: 'Popular' },
  { id: 'convert-jpg-to-pdf', from: 'JPG', to: 'PDF', name: 'JPG to PDF Document Compiler', shortLabel: 'JPG to PDF', desc: 'Compile JPG photos and scanned receipts into a single organized PDF document', group: 'Document', badge: 'Popular' },
  { id: 'convert-pdf-to-docx', from: 'PDF', to: 'DOCX', name: 'PDF to Word DOCX Converter', shortLabel: 'PDF to DOCX', desc: 'Convert read-only PDF files into editable Microsoft Word DOCX documents', group: 'Document', badge: 'Essential' },
  { id: 'convert-docx-to-pdf', from: 'DOCX', to: 'PDF', name: 'Word DOCX to PDF Exporter', shortLabel: 'DOCX to PDF', desc: 'Export formatted Word documents into universal, lockable PDF format', group: 'Document', badge: 'Popular' },
  { id: 'convert-pdf-to-txt', from: 'PDF', to: 'TXT', name: 'PDF to Plain Text Extractor', shortLabel: 'PDF to TXT', desc: 'Extract all raw textual content, headers, and paragraphs from PDF documents into TXT', group: 'Document' },
  { id: 'convert-txt-to-pdf', from: 'TXT', to: 'PDF', name: 'Text TXT to PDF Formatter', shortLabel: 'TXT to PDF', desc: 'Format plain text logs or documentation into clean, paginated PDF documents', group: 'Document' },
  { id: 'convert-docx-to-txt', from: 'DOCX', to: 'TXT', name: 'Word DOCX to Plain Text Extractor', shortLabel: 'DOCX to TXT', desc: 'Strip Word styles and extract clean UTF-8 text from DOCX files', group: 'Document' },
  { id: 'convert-txt-to-docx', from: 'TXT', to: 'DOCX', name: 'TXT to Word DOCX Packager', shortLabel: 'TXT to DOCX', desc: 'Package plain text into Microsoft Word DOCX document with standard typography', group: 'Document' },
  { id: 'convert-docx-to-md', from: 'DOCX', to: 'MD', name: 'Word DOCX to Markdown Converter', shortLabel: 'DOCX to MD', desc: 'Transform Word headings, lists, tables, and bold styles into clean GitHub Flavored Markdown', group: 'Document', badge: 'Popular' },
  { id: 'convert-md-to-docx', from: 'MD', to: 'DOCX', name: 'Markdown to Word DOCX Converter', shortLabel: 'MD to DOCX', desc: 'Convert Markdown documentation into styled Microsoft Word documents with headers and tables', group: 'Document' },
  { id: 'convert-md-to-pdf', from: 'MD', to: 'PDF', name: 'Markdown to Styled PDF Generator', shortLabel: 'MD to PDF', desc: 'Render Markdown notes and README files with syntax highlighting into publication-ready PDF', group: 'Document', badge: 'Popular' },
  { id: 'convert-pdf-to-md', from: 'PDF', to: 'MD', name: 'PDF to Markdown Document Extractor', shortLabel: 'PDF to MD', desc: 'Extract text and structure from PDF into structured Markdown for documentation sites', group: 'Document' },
  { id: 'convert-md-to-html', from: 'MD', to: 'HTML', name: 'Markdown to Clean HTML5 Converter', shortLabel: 'MD to HTML', desc: 'Compile Markdown syntax into semantic, responsive HTML5 markup with table support', group: 'Document', badge: 'Popular' },
  { id: 'convert-html-to-md', from: 'HTML', to: 'MD', name: 'HTML to Clean Markdown Converter', shortLabel: 'HTML to MD', desc: 'Parse HTML tags and tables into tidy GitHub-flavored Markdown text', group: 'Document' },
  { id: 'convert-html-to-pdf', from: 'HTML', to: 'PDF', name: 'HTML5 Webpage to PDF Generator', shortLabel: 'HTML to PDF', desc: 'Render HTML code and CSS styles into clean vector PDF documents', group: 'Document' },
  { id: 'convert-pdf-to-html', from: 'PDF', to: 'HTML', name: 'PDF to Responsive HTML5 Converter', shortLabel: 'PDF to HTML', desc: 'Convert PDF layouts and text runs into structured HTML5 webpages', group: 'Document' },
  { id: 'convert-epub-to-pdf', from: 'EPUB', to: 'PDF', name: 'EPUB eBook to PDF Document Converter', shortLabel: 'EPUB to PDF', desc: 'Convert eBook EPUB publications into paginated PDF documents for printing or desktop reading', group: 'Document', badge: 'Popular' },
  { id: 'convert-pdf-to-epub', from: 'PDF', to: 'EPUB', name: 'PDF to Reflowable EPUB eBook', shortLabel: 'PDF to EPUB', desc: 'Convert PDF manuals and books into reflowable EPUB eBooks for Kindle and e-readers', group: 'Document' },
  { id: 'convert-epub-to-mobi', from: 'EPUB', to: 'MOBI', name: 'EPUB to Kindle MOBI Converter', shortLabel: 'EPUB to MOBI', desc: 'Convert open EPUB eBooks into Amazon Kindle compatible MOBI format', group: 'Document' },
  { id: 'convert-mobi-to-epub', from: 'MOBI', to: 'EPUB', name: 'Kindle MOBI to EPUB Converter', shortLabel: 'MOBI to EPUB', desc: 'Convert legacy Kindle MOBI files into modern universal EPUB format', group: 'Document' },
  { id: 'convert-rtf-to-pdf', from: 'RTF', to: 'PDF', name: 'Rich Text RTF to PDF Exporter', shortLabel: 'RTF to PDF', desc: 'Convert Rich Text Format documents into clean locked PDF files', group: 'Document' },
  { id: 'convert-pdf-to-rtf', from: 'PDF', to: 'RTF', name: 'PDF to Rich Text RTF Extractor', shortLabel: 'PDF to RTF', desc: 'Extract styled text, bolding, and paragraphs from PDF into RTF format', group: 'Document' },
  { id: 'convert-odt-to-pdf', from: 'ODT', to: 'PDF', name: 'OpenDocument ODT to PDF Converter', shortLabel: 'ODT to PDF', desc: 'Convert LibreOffice / OpenOffice ODT documents into standard PDF format', group: 'Document' },
  { id: 'convert-pdf-to-odt', from: 'PDF', to: 'ODT', name: 'PDF to OpenDocument ODT Writer', shortLabel: 'PDF to ODT', desc: 'Convert PDF documents into open-source LibreOffice ODT word processor format', group: 'Document' },
  { id: 'convert-pages-to-pdf', from: 'PAGES', to: 'PDF', name: 'Apple Pages to PDF Converter', shortLabel: 'PAGES to PDF', desc: 'Convert Apple Pages files into universal PDF format viewable on Windows & Android', group: 'Document' },
  { id: 'convert-tex-to-pdf', from: 'TEX', to: 'PDF', name: 'LaTeX TEX to Academic PDF Compiler', shortLabel: 'TEX to PDF', desc: 'Compile LaTeX formulas, equations, and documents into academic PDF papers', group: 'Document' },

  // Data & Code Permutations
  { id: 'convert-csv-to-json', from: 'CSV', to: 'JSON', name: 'CSV to JSON Array & Object Converter', shortLabel: 'CSV to JSON', desc: 'Parse comma-separated values into formatted JSON objects with automatic type parsing', group: 'Data', badge: 'Essential' },
  { id: 'convert-json-to-csv', from: 'JSON', to: 'CSV', name: 'JSON to CSV Spreadsheet Exporter', shortLabel: 'JSON to CSV', desc: 'Flatten nested JSON objects or arrays into standard tabular CSV data for Excel and Sheets', group: 'Data', badge: 'Essential' },
  { id: 'convert-csv-to-tsv', from: 'CSV', to: 'TSV', name: 'CSV to Tab-Separated TSV Converter', shortLabel: 'CSV to TSV', desc: 'Convert comma-delimited rows into tab-delimited TSV clipboard-friendly format', group: 'Data' },
  { id: 'convert-tsv-to-csv', from: 'TSV', to: 'CSV', name: 'TSV to Comma-Separated CSV Converter', shortLabel: 'TSV to CSV', desc: 'Convert tab-delimited files into standard RFC 4180 comma-separated CSV', group: 'Data' },
  { id: 'convert-json-to-yaml', from: 'JSON', to: 'YAML', name: 'JSON to YAML Configuration Converter', shortLabel: 'JSON to YAML', desc: 'Convert JSON payloads into clean, readable YAML for Docker, Kubernetes, and CI/CD pipelines', group: 'Data', badge: 'Popular' },
  { id: 'convert-yaml-to-json', from: 'YAML', to: 'JSON', name: 'YAML to JSON Data Parser', shortLabel: 'YAML to JSON', desc: 'Parse YAML configs and schemas into valid, minified or formatted JSON structures', group: 'Data', badge: 'Popular' },
  { id: 'convert-json-to-xml', from: 'JSON', to: 'XML', name: 'JSON to XML Document Serializer', shortLabel: 'JSON to XML', desc: 'Convert JSON objects and arrays into structured XML nodes with custom root tags', group: 'Data' },
  { id: 'convert-xml-to-json', from: 'XML', to: 'JSON', name: 'XML to JSON Structure Parser', shortLabel: 'XML to JSON', desc: 'Parse complex XML documents and attributes into clean JSON objects', group: 'Data' },
  { id: 'convert-csv-to-xml', from: 'CSV', to: 'XML', name: 'CSV to XML Dataset Converter', shortLabel: 'CSV to XML', desc: 'Transform CSV table rows into well-formed hierarchical XML records', group: 'Data' },
  { id: 'convert-xml-to-csv', from: 'XML', to: 'CSV', name: 'XML to CSV Flat Table Converter', shortLabel: 'XML to CSV', desc: 'Flatten structured XML node trees into tabular CSV format for spreadsheets', group: 'Data' },
  { id: 'convert-csv-to-sql', from: 'CSV', to: 'SQL', name: 'CSV to SQL INSERT Query Generator', shortLabel: 'CSV to SQL', desc: 'Generate SQL table schemas and bulk INSERT statements from CSV spreadsheet data', group: 'Data', badge: 'Popular' },
  { id: 'convert-sql-to-csv', from: 'SQL', to: 'CSV', name: 'SQL Query Results to CSV Extractor', shortLabel: 'SQL to CSV', desc: 'Extract and format SQL dump rows and table data into clean CSV files', group: 'Data' },
  { id: 'convert-json-to-sql', from: 'JSON', to: 'SQL', name: 'JSON to SQL Schema & INSERT Generator', shortLabel: 'JSON to SQL', desc: 'Create relational PostgreSQL/MySQL table DDL and INSERT statements from JSON arrays', group: 'Data' },
  { id: 'convert-sql-to-json', from: 'SQL', to: 'JSON', name: 'SQL Schema to JSON Model Generator', shortLabel: 'SQL to JSON', desc: 'Parse SQL CREATE TABLE statements into JSON schema model definitions', group: 'Data' },
  { id: 'convert-json-to-toml', from: 'JSON', to: 'TOML', name: 'JSON to TOML Configuration Converter', shortLabel: 'JSON to TOML', desc: 'Convert JSON data into clean TOML format for Cargo, PyProject, and Hugo configurations', group: 'Data' },
  { id: 'convert-toml-to-json', from: 'TOML', to: 'JSON', name: 'TOML to JSON Config Parser', shortLabel: 'TOML to JSON', desc: 'Parse TOML configurations into standard JSON trees', group: 'Data' },
  { id: 'convert-yaml-to-toml', from: 'YAML', to: 'TOML', name: 'YAML to TOML Config Bridge', shortLabel: 'YAML to TOML', desc: 'Convert YAML configs directly into TOML config syntax', group: 'Data' },
  { id: 'convert-toml-to-yaml', from: 'TOML', to: 'YAML', name: 'TOML to YAML Config Bridge', shortLabel: 'TOML to YAML', desc: 'Convert TOML config files into human-friendly YAML structures', group: 'Data' },

  // Spreadsheet Permutations
  { id: 'convert-csv-to-xlsx', from: 'CSV', to: 'XLSX', name: 'CSV to Excel XLSX Workbook Creator', shortLabel: 'CSV to XLSX', desc: 'Convert flat CSV files into native Microsoft Excel XLSX spreadsheet workbooks', group: 'Spreadsheet', badge: 'Popular' },
  { id: 'convert-xlsx-to-csv', from: 'XLSX', to: 'CSV', name: 'Excel XLSX to Clean CSV Exporter', shortLabel: 'XLSX to CSV', desc: 'Extract worksheets from Microsoft Excel XLSX files into standard comma-separated CSV', group: 'Spreadsheet', badge: 'Popular' },
  { id: 'convert-xls-to-xlsx', from: 'XLS', to: 'XLSX', name: 'Legacy Excel XLS to XLSX Converter', shortLabel: 'XLS to XLSX', desc: 'Upgrade legacy 97-2003 Excel XLS spreadsheets to modern XML-based XLSX format', group: 'Spreadsheet' },
  { id: 'convert-xlsx-to-json', from: 'XLSX', to: 'JSON', name: 'Excel XLSX to JSON Dataset Extractor', shortLabel: 'XLSX to JSON', desc: 'Convert Excel workbook rows and headers directly into structured JSON arrays', group: 'Spreadsheet', badge: 'Popular' },
  { id: 'convert-json-to-xlsx', from: 'JSON', to: 'XLSX', name: 'JSON to Excel XLSX Workbook Exporter', shortLabel: 'JSON to XLSX', desc: 'Export API JSON array objects directly into a styled Microsoft Excel XLSX spreadsheet', group: 'Spreadsheet' },
  { id: 'convert-xlsx-to-pdf', from: 'XLSX', to: 'PDF', name: 'Excel XLSX to Formatted PDF Table', shortLabel: 'XLSX to PDF', desc: 'Export Excel financial models and spreadsheets into paginated PDF reports', group: 'Spreadsheet' },
  { id: 'convert-ods-to-xlsx', from: 'ODS', to: 'XLSX', name: 'OpenDocument ODS to Excel XLSX Converter', shortLabel: 'ODS to XLSX', desc: 'Convert LibreOffice Calc ODS spreadsheets into Microsoft Excel XLSX workbooks', group: 'Spreadsheet' },
  { id: 'convert-numbers-to-xlsx', from: 'NUMBERS', to: 'XLSX', name: 'Apple Numbers to Excel XLSX Converter', shortLabel: 'NUMBERS to XLSX', desc: 'Convert Apple Numbers macOS spreadsheets into universal Microsoft Excel XLSX files', group: 'Spreadsheet' },

  // Audio Permutations
  { id: 'convert-mp3-to-wav', from: 'MP3', to: 'WAV', name: 'MP3 to Uncompressed WAV Audio Converter', shortLabel: 'MP3 to WAV', desc: 'Decode compressed MP3 audio into 16-bit 44.1kHz uncompressed PCM WAV audio files', group: 'Audio', badge: 'Popular' },
  { id: 'convert-wav-to-mp3', from: 'WAV', to: 'MP3', name: 'WAV to High-Bitrate MP3 Audio Encoder', shortLabel: 'WAV to MP3', desc: 'Compress raw WAV studio audio into compact 320kbps MP3 audio with metadata tags', group: 'Audio', badge: 'Popular' },
  { id: 'convert-mp3-to-ogg', from: 'MP3', to: 'OGG', name: 'MP3 to OGG Vorbis Audio Converter', shortLabel: 'MP3 to OGG', desc: 'Convert MP3 songs into open-source OGG Vorbis format for gaming engines and web audio', group: 'Audio' },
  { id: 'convert-ogg-to-mp3', from: 'OGG', to: 'MP3', name: 'OGG Vorbis to MP3 Audio Converter', shortLabel: 'OGG to MP3', desc: 'Convert open OGG audio tracks into universal MP3 format compatible with all players', group: 'Audio' },
  { id: 'convert-mp3-to-m4a', from: 'MP3', to: 'M4A', name: 'MP3 to Apple AAC M4A Audio Converter', shortLabel: 'MP3 to M4A', desc: 'Convert MP3 files into high-efficiency Apple M4A/AAC audio tracks', group: 'Audio' },
  { id: 'convert-m4a-to-mp3', from: 'M4A', to: 'MP3', name: 'Apple M4A to MP3 Audio Converter', shortLabel: 'M4A to MP3', desc: 'Convert Apple Voice Memos and iTunes M4A tracks into universal MP3 audio', group: 'Audio', badge: 'Popular' },
  { id: 'convert-mp3-to-flac', from: 'MP3', to: 'FLAC', name: 'MP3 to FLAC Audio Transcoder', shortLabel: 'MP3 to FLAC', desc: 'Package MP3 recordings into FLAC lossless audio container for archival playlists', group: 'Audio' },
  { id: 'convert-flac-to-mp3', from: 'FLAC', to: 'MP3', name: 'FLAC Lossless to MP3 320kbps Converter', shortLabel: 'FLAC to MP3', desc: 'Convert high-resolution FLAC audio tracks into compact 320kbps MP3 files for mobile devices', group: 'Audio', badge: 'Popular' },
  { id: 'convert-wav-to-flac', from: 'WAV', to: 'FLAC', name: 'WAV to Lossless FLAC Compressor', shortLabel: 'WAV to FLAC', desc: 'Compress studio master WAV recordings into lossless FLAC saving 50% space with zero loss', group: 'Audio' },
  { id: 'convert-flac-to-wav', from: 'FLAC', to: 'WAV', name: 'FLAC to Studio Master WAV Audio', shortLabel: 'FLAC to WAV', desc: 'Decompress FLAC lossless audio files into pure uncompressed PCM WAV format', group: 'Audio' },
  { id: 'convert-aac-to-mp3', from: 'AAC', to: 'MP3', name: 'AAC Stream to MP3 Audio Converter', shortLabel: 'AAC to MP3', desc: 'Convert raw AAC audio streams into standard ID3-tagged MP3 tracks', group: 'Audio' },
  { id: 'convert-mp3-to-aac', from: 'MP3', to: 'AAC', name: 'MP3 to Advanced AAC Audio Encoder', shortLabel: 'MP3 to AAC', desc: 'Encode MP3 audio into high-fidelity AAC format for streaming and mobile playback', group: 'Audio' },
  { id: 'convert-wma-to-mp3', from: 'WMA', to: 'MP3', name: 'Windows WMA to MP3 Audio Converter', shortLabel: 'WMA to MP3', desc: 'Convert legacy Microsoft Windows Media Audio WMA tracks into universal MP3 files', group: 'Audio' },
  { id: 'convert-mp3-to-opus', from: 'MP3', to: 'OPUS', name: 'MP3 to OPUS Low-Latency Voice/Audio', shortLabel: 'MP3 to OPUS', desc: 'Convert MP3 voice notes and audio into ultra-low-bandwidth modern OPUS codec', group: 'Audio' },
  { id: 'convert-opus-to-mp3', from: 'OPUS', to: 'MP3', name: 'OPUS Voice Recording to MP3 Converter', shortLabel: 'OPUS to MP3', desc: 'Convert WhatsApp and Discord OPUS voice notes into universal MP3 files', group: 'Audio', badge: 'Utility' },
  { id: 'convert-aiff-to-mp3', from: 'AIFF', to: 'MP3', name: 'Apple AIFF Studio to MP3 Audio', shortLabel: 'AIFF to MP3', desc: 'Convert Apple Logic and macOS AIFF audio files into MP3 format', group: 'Audio' },

  // Video & Motion Permutations
  { id: 'convert-mp4-to-mp3', from: 'MP4', to: 'MP3', name: 'MP4 Video to MP3 Audio Extractor', shortLabel: 'MP4 to MP3', desc: 'Extract pristine soundtrack, vocals, and speech audio from MP4 video files into 320kbps MP3', group: 'Video', badge: 'Popular' },
  { id: 'convert-mp4-to-gif', from: 'MP4', to: 'GIF', name: 'MP4 Video to Animated GIF Converter', shortLabel: 'MP4 to GIF', desc: 'Convert short MP4 video clips into looping animated GIF images with FPS control', group: 'Video', badge: 'Popular' },
  { id: 'convert-gif-to-mp4', from: 'GIF', to: 'MP4', name: 'Animated GIF to Lightweight MP4 Video', shortLabel: 'GIF to MP4', desc: 'Convert heavy animated GIFs into smooth H.264 MP4 video reducing file size by up to 90%', group: 'Video', badge: 'Fast' },
  { id: 'convert-mp4-to-webm', from: 'MP4', to: 'WEBM', name: 'MP4 to HTML5 WebM Video Converter', shortLabel: 'MP4 to WEBM', desc: 'Convert H.264 MP4 videos into open VP9/AV1 WebM video format for responsive web playback', group: 'Video' },
  { id: 'convert-webm-to-mp4', from: 'WEBM', to: 'MP4', name: 'WebM to Universal MP4 Video Converter', shortLabel: 'WEBM to MP4', desc: 'Convert web-recorded WebM browser screen captures into universal MP4 video', group: 'Video', badge: 'Popular' },
  { id: 'convert-mov-to-mp4', from: 'MOV', to: 'MP4', name: 'Apple QuickTime MOV to MP4 Converter', shortLabel: 'MOV to MP4', desc: 'Convert Apple iPhone and QuickTime MOV recordings into standard H.264 MP4 video', group: 'Video', badge: 'Popular' },
  { id: 'convert-avi-to-mp4', from: 'AVI', to: 'MP4', name: 'Legacy AVI to Modern MP4 Converter', shortLabel: 'AVI to MP4', desc: 'Convert legacy Windows AVI video files into web-friendly MP4 format', group: 'Video' },
  { id: 'convert-mkv-to-mp4', from: 'MKV', to: 'MP4', name: 'MKV Matroska to MP4 Video Transcoder', shortLabel: 'MKV to MP4', desc: 'Remux and convert MKV video containers into standard MP4 for TV and phone compatibility', group: 'Video', badge: 'Popular' },

  // Encoding, Binary & Archive Permutations
  { id: 'convert-image-to-base64', from: 'IMAGE', to: 'BASE64', name: 'Image to Base64 Data URI Encoder', shortLabel: 'Image to Base64', desc: 'Convert PNG, JPG, or SVG images into inline HTML/CSS Base64 Data URI strings', group: 'Encoding & Archive', badge: 'Popular' },
  { id: 'convert-base64-to-image', from: 'BASE64', to: 'IMAGE', name: 'Base64 Data URI to Image Decoder', shortLabel: 'Base64 to Image', desc: 'Decode Base64 data strings into downloadable PNG or JPEG image files with live preview', group: 'Encoding & Archive', badge: 'Popular' },
  { id: 'convert-text-to-base64', from: 'TEXT', to: 'BASE64', name: 'Plain Text to Base64 String Encoder', shortLabel: 'Text to Base64', desc: 'Encode UTF-8 plain text, tokens, and credentials into Base64 format', group: 'Encoding & Archive' },
  { id: 'convert-base64-to-text', from: 'BASE64', to: 'TEXT', name: 'Base64 String to Plain Text Decoder', shortLabel: 'Base64 to Text', desc: 'Decode Base64 encoded payload strings back into human-readable UTF-8 plain text', group: 'Encoding & Archive' },
  { id: 'convert-hex-to-text', from: 'HEX', to: 'TEXT', name: 'Hexadecimal to Plain Text Decoder', shortLabel: 'Hex to Text', desc: 'Convert raw hexadecimal byte strings into ASCII and UTF-8 plain text characters', group: 'Encoding & Archive' },
  { id: 'convert-text-to-hex', from: 'TEXT', to: 'HEX', name: 'Plain Text to Hexadecimal Byte Encoder', shortLabel: 'Text to Hex', desc: 'Convert UTF-8 string characters into hexadecimal byte sequences with space formatting', group: 'Encoding & Archive' },
  { id: 'convert-binary-to-text', from: 'BINARY', to: 'TEXT', name: '8-Bit Binary to ASCII Text Decoder', shortLabel: 'Binary to Text', desc: 'Convert 8-bit binary 0s and 1s sequences into readable ASCII characters and text', group: 'Encoding & Archive' },
  { id: 'convert-text-to-binary', from: 'TEXT', to: 'BINARY', name: 'Text to 8-Bit Binary ASCII Encoder', shortLabel: 'Text to Binary', desc: 'Convert plain text sentences into 8-bit binary 01001000 byte representations', group: 'Encoding & Archive' },
  { id: 'convert-zip-to-tar', from: 'ZIP', to: 'TAR', name: 'ZIP Archive to Unix TAR Converter', shortLabel: 'ZIP to TAR', desc: 'Repackage standard ZIP compressed archives into Unix/Linux TAR uncompressed archive format', group: 'Encoding & Archive' },
  { id: 'convert-tar-to-gz', from: 'TAR', to: 'GZ', name: 'TAR Archive to GZIP (.tar.gz) Compressor', shortLabel: 'TAR to GZ', desc: 'Compress Unix TAR archive files into lightweight .tar.gz / .tgz files', group: 'Encoding & Archive' },
  { id: 'convert-gz-to-tar', from: 'GZ', to: 'TAR', name: 'GZIP (.tar.gz) to Uncompressed TAR Extractor', shortLabel: 'GZ to TAR', desc: 'Decompress .tar.gz archives into standard uncompressed TAR ball containers', group: 'Encoding & Archive' },
  { id: 'convert-7z-to-zip', from: '7Z', to: 'ZIP', name: '7-Zip 7Z to Universal ZIP Converter', shortLabel: '7Z to ZIP', desc: 'Repackage high-compression 7Z archives into universally openable ZIP folders', group: 'Encoding & Archive' },
];

/**
 * Generates community shipped proposals corresponding to all top conversion tools
 */
export function generateConversionShippedProposals(): ToolRequest[] {
  return TOP_CONVERSION_PERMUTATIONS.map((pair, index) => {
    const daysAgo = 5 + (index % 25);
    const voteCount = 85 + ((index * 13) % 190);
    return {
      id: `prop-${pair.id}`,
      title: `${pair.name}`,
      description: `Propose dedicated ${pair.from} to ${pair.to} file conversion utility. ${pair.desc}`,
      category: 'conversion',
      status: 'completed',
      completedVersion: `v1.${4 + Math.floor(index / 20)}.${(index % 9) + 1}`,
      authorId: `comm-user-${(index % 12) + 1}`,
      authorName: [
        'Alex Rivers', 'Sarah Jenkins', 'Elena Rostova', 'David Chen',
        'Chloe Bennett', 'Liam Thorne', 'Maya Lin', 'Carlos Vega',
        'Aria Stark', 'Kenji Sato', 'Amara Okafor', 'Devin Vance'
      ][index % 12],
      isGuest: false,
      pointsAwarded: 2,
      votes: voteCount,
      voters: ['u1', `u${(index % 5) + 2}`, `u${(index % 8) + 3}`],
      createdAt: new Date(Date.now() - 86400000 * (daysAgo + 6)).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * daysAgo).toISOString(),
      deployedAt: new Date(Date.now() - 86400000 * daysAgo).toISOString(),
    };
  });
}
