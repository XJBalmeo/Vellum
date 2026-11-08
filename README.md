# Vellum — Editorial Markdown Viewer & Two-Way Editor

[![License: MIT](https://img.shields.io/badge/License-MIT-B84A27.svg)](https://opensource.org/licenses/MIT)
[![Stack: Vite + Vanilla JS](https://img.shields.io/badge/Stack-Vite%20%2B%20CodeMirror%206-1C1917.svg)](https://vitejs.dev/)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-2A6F4E.svg)](#privacy--security)

**Vellum** is a modern, client-side Markdown reader and two-way synchronized editor built around book-grade typography and surgical source fidelity. Open any `.md`, `.markdown`, or `.txt` file to read it in a richly typeset editorial view, and edit seamlessly in **either** the raw Markdown source or directly inside the rendered document—without mangling your surrounding formatting.

## Highlights & Core Features

### 1. Non-Destructive Two-Way Editing
Conventional WYSIWYG Markdown editors serialize the entire DOM back through a lossy HTML-to-Markdown converter, stripping your preferred list markers (`*` vs `-`), emphasis delimiters, blank lines, and indentation. **Vellum** takes a surgical approach:
- **Line-Range Block Mapping (`token.map`):** Every rendered top-level block (paragraph, heading, list, blockquote, code block, or table) is bound to its exact 0-based `[startLine, endLine)` range in the Markdown buffer via [markdown-it](https://github.com/markdown-it/markdown-it).
- **In-Place Rendered Block Editor:** Click any block in the rendered view to edit its exact Markdown lines in place. When applied (`Ctrl/Cmd + Enter`), Vellum splices only that line range back into the source document (`spliceMarkdownBlock`), leaving every other line—and your original `LF` or `CRLF` line endings—untouched.
- **Interactive GFM Task Checkboxes:** Click any `[ ]` or `[x]` task item directly in the rendered view to toggle its state on that exact line in the source.
- **Direct Table Cell Editing:** Click any rendered table cell (`<td>`) to edit its value in place without disturbing pipe alignment or neighboring cells.
- **Synchronized CodeMirror 6 Source Editor:** Edit raw Markdown with syntax highlighting, toggleable line numbers, soft wrapping, and active-line highlighting powered by [CodeMirror 6](https://codemirror.net/).
- **Unified Undo & Redo Stack:** Press `Ctrl/Cmd + Z` or `Ctrl/Cmd + Shift + Z` (`Ctrl/Cmd + Y`) to undo and redo seamlessly across both rendered block edits and raw source edits.

### 2. Three View Modes & Proportional Scroll Sync
- **Read Mode (`Ctrl/Cmd + 1`):** Distraction-free, centered book column optimized for long-form reading.
- **Split Mode (`Ctrl/Cmd + 2`):** Side-by-side raw Markdown source and rendered view with proportional scroll synchronization. Automatically collapses to a clean Read/Source toggle on mobile screens (`<= 768px`).
- **Source Mode (`Ctrl/Cmd + 3`):** Full-width raw Markdown editor.

### 3. Editorial Typography & Appearance Studio
Inspired by the anti-slop principles of [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/SKILL.md) and the design system guidelines of [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/README.md), Vellum treats typography as its primary interface element:
- **Curated Font Pairings:** Choose independently between **Body Fonts** (*Newsreader*, *Lora*, *Plus Jakarta Sans*, System Serif, System Sans), **Heading Fonts** (*Instrument Serif*, *Fraunces*, *Newsreader*, *Plus Jakarta Sans*, System), and **Monospace Code Fonts** (*JetBrains Mono*, *Fira Code*, *IBM Plex Mono*, System Mono).
- **Fine Type Controls:** Live sliders for font size (`14px–24px`), line height (`1.40–2.00`), paragraph spacing (`0.75em–2.00em`), and reading measure (**Narrow** `56ch`, **Comfortable** `68ch`, **Wide** `86ch`).
- **Three Calibrated Surface Themes:** **Warm Paper (Light)** (`#FAF7F2`), **Archival Vellum (Sepia)** (`#F3E9D2`), and **Carbon Ink (Dark)** (`#131312`), automatically respecting `prefers-color-scheme` on first load.
- **Editorial Accent Swatches & Custom Picker:** Five curated presets (*Terracotta Vermilion*, *Botanical Pine*, *Archival Cobalt*, *Raw Ochre*, *Burgundy Ink*) plus a custom hex color picker.
- **Theme-Synced Code Highlighting:** Fenced code blocks automatically switch between light and dark [Highlight.js](https://highlightjs.org/) stylesheets.

### 4. Local File I/O & Crash-Proof Autosave
- **In-Place Disk Saving:** Uses the browser [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) (`showOpenFilePicker` / `FileSystemFileHandle.createWritable()`) so pressing `Ctrl/Cmd + S` writes directly back to the opened `.md` file on Chromium browsers, with automatic fallback to standard browser downloads on Firefox and Safari.
- **Drag-and-Drop Anywhere:** Drop any `.md`, `.markdown`, or `.txt` file onto the window to open it immediately.
- **Working Copy Autosave & Recent Files:** Continuously saves your active buffer and a list of recent files to `localStorage`, complete with a subtle unsaved-changes indicator.

### 5. Reading, Navigation & Export Helpers
- **Scroll-Spy Table of Contents:** Collapsible outline sidebar (`Ctrl/Cmd + Shift + O`) that highlights your current section as you scroll and jumps both panes on click.
- **Find in Document (`Ctrl/Cmd + F`):** Highlights all matches in the rendered view with `Enter` / `Shift + Enter` match cycling and live match counts.
- **Quiet Status Bar:** Real-time word count, character count, line count, estimated reading time, and `LF`/`CRLF` line-ending indicator.
- **Focus / Zen Mode (`Ctrl/Cmd + \`):** Hides all application chrome (toolbar, sidebar, status bar) so only the page remains.
- **One-Click Exports:** Copy sanitized HTML to clipboard, download a standalone styled `.html` file, or print / save as PDF via dedicated `@media print` rules.

### 6. Full GFM, Math & Sanitization
- Supports GitHub Flavored Markdown tables, interactive task lists, footnotes (`[^1]`), strikethrough, autolinks, fenced code blocks, and inline/block LaTeX math rendered via [KaTeX](https://katex.org/).
- All rendered HTML is sanitized with [DOMPurify](https://github.com/cure53/DOMPurify) so opening untrusted `.md` files never executes inline scripts.

## Keyboard Shortcuts

| Action | Windows / Linux | macOS |
| :--- | :--- | :--- |
| **Open File** | `Ctrl + O` | `Cmd + O` |
| **Save File (In-Place / Download)** | `Ctrl + S` | `Cmd + S` |
| **Read Mode** | `Ctrl + 1` | `Cmd + 1` |
| **Split Mode** | `Ctrl + 2` | `Cmd + 2` |
| **Source Mode** | `Ctrl + 3` | `Cmd + 3` |
| **Toggle Outline Sidebar** | `Ctrl + Shift + O` | `Cmd + Shift + O` |
| **Open Appearance Settings** | `Ctrl + ,` | `Cmd + ,` |
| **Find in Document** | `Ctrl + F` | `Cmd + F` |
| **Focus / Zen Mode** | `Ctrl + \` | `Cmd + \` |
| **Undo / Redo** | `Ctrl + Z` / `Ctrl + Y` | `Cmd + Z` / `Cmd + Shift + Z` |
| **Apply Inline Block Edit** | `Ctrl + Enter` | `Cmd + Enter` |
| **Show Shortcuts Dialog** | `?` | `?` |

## Project Structure

```text
vellum-md/
├── index.html              # Self-contained application shell & UI markup
├── package.json            # Dependencies & Vite scripts
├── vite.config.js          # Static build configuration (relative base './')
├── README.md               # Project documentation
└── src/
    ├── style.css           # Semantic theme tokens, editorial typography & print styles
    ├── markdown-engine.js  # token.map block parser, surgical line splicer & stats
    ├── file-io.js          # File System Access API, drag-and-drop & recent files
    ├── settings.js         # Appearance customization & localStorage persistence
    └── sample-doc.js       # Default showcase guide & edge-case test fixtures
```

## Quick Start (Local Development)

### Option A: Zero-Build Static Run
Because `index.html` is pre-configured with ES module imports, you can open `index.html` directly in any modern browser or serve the folder over HTTP:

```bash
python3 -m http.server 8080
# Open http://localhost:8080 in your browser
```

### Option B: Vite Development & Production Build
If you have [Node.js](https://nodejs.org/) installed:

```bash
# 1. Install dependencies
npm install

# 2. Start the local Vite dev server with hot reload
npm run dev

# 3. Build optimized static assets into dist/
npm run build

# 4. Preview the production build locally
npm run preview
```

## Free Static Hosting & Deployment

Because Vellum is 100% client-side, every feature—including opening local files, in-place disk saving, drag-and-drop, and HTML/PDF exports—works on any free static host without a backend server. Hosting over `https://` also provides the secure context required by the File System Access API.

| Provider | Deployment Method | Build Command | Output Directory |
| :--- | :--- | :--- | :--- |
| **[Cloudflare Pages](https://developers.cloudflare.com/pages/get-started/direct-upload/)** | Connect GitHub repo or drag-and-drop folder in **Workers & Pages → Upload assets** | `npm run build` *(or none for direct upload)* | `dist` *(or `.` for direct upload)* |
| **[GitHub Pages](https://docs.github.com/en/pages/quickstart)** | Push to a GitHub repo and enable **Settings → Pages → Deploy from a branch (`main`)** | None required (`index.html` at root) | `/ (root)` |
| **[Netlify](https://www.netlify.com/knowledge-base/netlify-drop-vs-vercel-drop/)** | Drag folder onto **Netlify Drop** or connect GitHub repository | `npm run build` | `dist` |
| **[Vercel](https://vercel.com/kb/guide/vercel-drop-vs-netlify-drop)** | Drag archive onto [Vercel Drop](https://vercel.com/kb/vercel-drop) or import GitHub repo | `vite build` | `dist` |

## Privacy & Security

- **Zero Telemetry:** No analytics, no accounts, no cookies, and no external API calls for your documents. Your files never leave your device.
- **Strict HTML Sanitization:** All rendered Markdown passes through `DOMPurify.sanitize()` before mounting to the DOM.

## Known Limitations

- **Browser Support for In-Place File Saving:** Direct write-back to the original file handle on disk (`FileSystemFileHandle.createWritable()`) is supported in Chromium-based browsers (Chrome, Edge, Brave, Opera) over `https://` or `localhost`. In Firefox and Safari, `Ctrl/Cmd + S` gracefully falls back to downloading the updated `.md` file.
- **Relative Image Paths:** When opening a standalone `.md` file from disk without granting directory access, relative image paths (such as `./images/chart.png`) cannot be read from arbitrary local paths by the browser and are rendered as a descriptive fallback card showing the image `alt` text and relative path.
- **Block-Scoped In-Place Editing:** Clicking in the rendered view edits the enclosing top-level Markdown block (`paragraph`, `heading`, `list`, `blockquote`, `code_block`, `table`) or individual task checkbox / table cell rather than arbitrary multi-block text selections, guaranteeing 100% preservation of your untouched Markdown formatting.

## License

Released under the [MIT License](https://opensource.org/licenses/MIT).
