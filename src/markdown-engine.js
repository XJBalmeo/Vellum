/**
 * Non-destructive Line-Range Block Mapper & Two-Way Sync Engine
 * Maps markdown-it top-level tokens with token.map = [startLine, endLine]
 * back to exact lines in the Markdown source buffer.
 */

export function detectLineEnding(text) {
  return text.includes('\r\n') ? '\r\n' : '\n';
}

export function splitLinesPreserve(text) {
  return text.split(/\r?\n/);
}

/**
 * Surgically splices new text into [startLine, endLine) of sourceText,
 * preserving the document's original CRLF or LF line endings and untouched lines.
 */
export function spliceMarkdownBlock(sourceText, startLine, endLine, newBlockRaw) {
  const eol = detectLineEnding(sourceText);
  const lines = splitLinesPreserve(sourceText);
  const clampedStart = Math.max(0, Math.min(startLine, lines.length));
  const clampedEnd = Math.max(clampedStart, Math.min(endLine, lines.length));
  const replacementLines = splitLinesPreserve(newBlockRaw);

  const nextLines = [
    ...lines.slice(0, clampedStart),
    ...replacementLines,
    ...lines.slice(clampedEnd)
  ];
  return nextLines.join(eol);
}

/**
 * Surgically toggles a GFM task list item checkbox (`- [ ]` <-> `- [x]`) on a specific 0-based line.
 */
export function toggleTaskCheckboxOnLine(sourceText, lineIndex) {
  const eol = detectLineEnding(sourceText);
  const lines = splitLinesPreserve(sourceText);
  if (lineIndex < 0 || lineIndex >= lines.length) return sourceText;

  const line = lines[lineIndex];
  const taskRegex = /^(\s*(?:[-*+]|\d+[.)])\s+\[)([ xX])(\]\s*.*)$/;
  const match = line.match(taskRegex);
  if (!match) return sourceText;

  const currentMark = match[2];
  const nextMark = currentMark === ' ' ? 'x' : ' ';
  lines[lineIndex] = `${match[1]}${nextMark}${match[3]}`;
  return lines.join(eol);
}

/**
 * Surgically updates a single GFM table cell at (lineIndex, colIndex) without altering
 * column alignment rows, surrounding pipes, or other rows.
 */
export function updateTableCellOnLine(sourceText, lineIndex, colIndex, newCellContent) {
  const eol = detectLineEnding(sourceText);
  const lines = splitLinesPreserve(sourceText);
  if (lineIndex < 0 || lineIndex >= lines.length) return sourceText;

  const line = lines[lineIndex];
  // Split by unescaped pipe `|`
  const hasLeadingPipe = /^\s*\|/.test(line);
  const hasTrailingPipe = /\|\s*$/.test(line);
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  const cells = trimmed.split(/(?<!\\)\|/);

  if (colIndex < 0 || colIndex >= cells.length) return sourceText;
  const sanitizedCell = newCellContent.replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').trim();
  cells[colIndex] = ` ${sanitizedCell} `;

  let rebuilt = cells.join('|');
  if (hasLeadingPipe) rebuilt = '|' + rebuilt;
  if (hasTrailingPipe) rebuilt = rebuilt + '|';
  lines[lineIndex] = rebuilt;
  return lines.join(eol);
}

/**
 * Extracts top-level blocks and headings from markdown-it tokens with exact line ranges.
 */
export function parseMarkdownBlocks(mdInstance, sourceText) {
  const lines = splitLinesPreserve(sourceText);
  const env = {};
  const tokens = mdInstance.parse(sourceText, env);

  const blocks = [];
  const headings = [];
  let depth = 0;
  let currentBlockStart = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Collect headings for Table of Contents
    if (token.type === 'heading_open' && token.map) {
      const level = parseInt(token.tag.slice(1), 10) || 1;
      const inlineToken = tokens[i + 1];
      const title = inlineToken && inlineToken.type === 'inline' ? inlineToken.content : 'Section';
      const slug = 'heading-line-' + token.map[0];
      headings.push({
        id: slug,
        level,
        title: title.replace(/[*_`~]/g, ''),
        startLine: token.map[0],
        endLine: token.map[1]
      });
    }

    if (depth === 0 && token.map) {
      const [startLine, endLine] = token.map;
      const rawSlice = lines.slice(startLine, endLine).join('\n');
      const blockType = token.type.replace(/_open$/, '');
      blocks.push({
        index: blocks.length,
        type: blockType,
        tag: token.tag || 'div',
        startLine,
        endLine,
        raw: rawSlice
      });
    }

    if (token.nesting === 1) depth++;
    else if (token.nesting === -1) depth = Math.max(0, depth - 1);
  }

  return { tokens, blocks, headings, lines };
}

/**
 * Computes word count, character count, line count, and reading time.
 */
export function computeDocumentStats(sourceText) {
  const trimmed = sourceText.trim();
  if (!trimmed) {
    return { words: 0, chars: sourceText.length, lines: sourceText ? splitLinesPreserve(sourceText).length : 1, readingTimeMin: 0 };
  }
  // Strip fenced code blocks and markdown punctuation for cleaner word count
  const cleanText = trimmed
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*_`~>\[\]()!|-]/g, ' ');
  const wordMatches = cleanText.trim().split(/\s+/).filter(Boolean);
  const words = wordMatches.length;
  const chars = sourceText.length;
  const lines = splitLinesPreserve(sourceText).length;
  const readingTimeMin = Math.max(1, Math.ceil(words / 220));
  return { words, chars, lines, readingTimeMin };
}
