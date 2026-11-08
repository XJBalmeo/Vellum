export const DEFAULT_DOCUMENT = `# Vellum — An Editorial Markdown Studio

> "Typography is the craft of endowing human language with a durable visual form." — Robert Bringhurst, *The Elements of Typographic Style*

Welcome to **Vellum**, a client-side Markdown reader and two-way editor designed around book-grade typography and surgical source fidelity. Every paragraph, heading, list, table, and code block in the **Rendered View** is mapped directly to its exact line range (\`token.map\`) in the **Markdown Source**.

Click any block in the rendered pane—or toggle a task checkbox below—to edit it in place without mangling your surrounding Markdown formatting, list markers, or indentation.

## 1. Two-Way Editing & Line-Range Fidelity

Unlike conventional WYSIWYG editors that serialize the entire DOM back through a lossy HTML-to-Markdown converter, Vellum updates **only the exact source lines** of the block you touched:

- [x] **Surgical Block Replacement:** Clicking a rendered block opens an inline source editor scoped to \`[startLine, endLine)\`.
- [x] **Interactive Task Lists:** Clicking any checkbox in the rendered document flips \`[ ]\` to \`[x]\` on that exact line in the source.
- [ ] **Unified History Stack:** Press \`Ctrl/Cmd + Z\` or \`Ctrl/Cmd + Shift + Z\` to undo and redo seamlessly across both rendered edits and raw source edits.
- [ ] **Scroll Synchronization:** Switch to **Split Mode** (\`Ctrl/Cmd + 2\`) to scroll source and rendered panes in proportional lockstep.

### Typographic Scale & Reading Measure

Long-form writing reads best when lines are held between **60 and 75 characters** with generous leading. Open the **Appearance Panel** (\`Ctrl/Cmd + ,\`) in the top toolbar to customize:

1. **Curated Font Pairings:** Mix *Newsreader*, *Lora*, or *Fraunces* for editorial prose with *Instrument Serif* or *Plus Jakarta Sans* for headings and *JetBrains Mono* for code.
2. **Surface Themes:** Switch between **Warm Paper (Light)**, **Carbon Ink (Dark)**, and **Archival Vellum (Sepia)**, paired with five editorial accent colors.
3. **Measure & Rhythm:** Adjust font size (\`14px–24px\`), line height (\`1.4–2.0\`), paragraph spacing, and column measure (*Narrow*, *Comfortable*, or *Wide*).

## 2. GitHub Flavored Markdown & Structured Data

Vellum supports full GitHub Flavored Markdown (GFM), including tables with inline formatting, footnotes[^1], ~~strikethrough~~, autolinks like https://commonmark.org, and interactive table cells (double-click any table cell in the rendered view to edit it directly, or click the table's edit badge to edit the raw pipe table).

| Feature | Implementation Strategy | Source Preservation | Shortcut |
| :--- | :--- | :---: | ---: |
| **Read Mode** | Centered book column with scroll-spy outline | Full fidelity | \`Mod + 1\` |
| **Split Mode** | Side-by-side CodeMirror 6 + live rendered pane | Line-mapped sync | \`Mod + 2\` |
| **Source Mode** | Focused syntax-highlighted Markdown editor | Direct buffer | \`Mod + 3\` |
| **Zen Focus** | Hides all application chrome for distraction-free writing | Auto-saved | \`Mod + \\\\\` |

## 3. Code Blocks & Math Notation

Fenced code blocks are highlighted automatically and adapt to your active theme. Even Markdown syntax nested inside a fenced code block is preserved safely without confusing the block mapper:

\`\`\`javascript
// Map a rendered block edit back to exact Markdown source lines
function applyBlockSplice(sourceText, startLine, endLine, replacementRaw) {
  const eol = sourceText.includes('\\r\\n') ? '\\r\\n' : '\\n';
  const lines = sourceText.split(/\\r?\\n/);
  const updated = [
    ...lines.slice(0, startLine),
    ...replacementRaw.split(/\\r?\\n/),
    ...lines.slice(endLine)
  ];
  return updated.join(eol);
}
\`\`\`

Vellum also renders inline math such as Euler's identity $e^{i\\pi} + 1 = 0$ and display equations via KaTeX:

$$
\\mathcal{L}(\\theta) = \\frac{1}{N} \\sum_{i=1}^{N} \\left( y_i - f_\\theta(x_i) \\right)^2 + \\lambda \\|\\theta\\|_2^2
$$

## 4. Multilingual & Archival Note (Tagalog / Filipino)

*Ang mabuting tipograpiya ay tahimik na naglilingkod sa mambabasa.* Sa pamamagitan ng malinaw na antas ng mga pamagat, tamang agwat ng mga linya, at maingat na pagpili ng kulay, nagiging mas magaan at kasiya-siya ang pagbabasa at pagsusulat ng mahahabang dokumento sa **Vellum**. Maaari kang magbukas ng anumang \`.md\`, \`.markdown\`, o \`.txt\` na talaksan mula sa iyong kompyuter—lahat ng pagbabago ay nananatiling pribado sa iyong browser.

[^1]: Footnotes are automatically linked and collected at the bottom of the rendered page while remaining editable in place.
`;

export const EDGE_CASE_FIXTURES = {
  empty: ``,
  tagalog: `# Talaan ng Disenyo at Tipograpiya sa Pilipinas

> "Ang wika ay kaluluwa ng isang bansa, at ang tipograpiya ang nagbibigay-katawan dito."

Sa kasaysayan ng paglilimbag sa Pilipinas—mula sa *Doctrina Christiana* noong 1593 hanggang sa makabagong digital na publikasyon sa Bacoor, Maynila, at Cebu—mahalaga ang kalinawan ng bawat titik at tuldik (tulad ng *maragsâ*, *malumì*, at *mabilís*).

## Mga Layunin sa Pagsusuri

- [x] Suportahan ang mga bantas at tuldik sa Filipino (*ngunit*, *datapwat*, *gunita*)
- [x] Panatilihin ang eksaktong linya sa bawat talata kapag nag-e-edit
- [ ] Magdagdag ng mga tala para sa baybayin at makabagong ortograpiya

| Rehiyon | Pangunahing Wika | Halimbawa ng Salita | Katangian |
| :--- | :--- | :--- | :--- |
| **Calabarzon** | Tagalog | *Maligayang pagdating* | Malumanay at malinaw |
| **Gitnang Visayas** | Cebuano | *Maayong buntag* | Masigla at matatag |
| **Ilocos** | Ilokano | *Naimbag nga bigat* | Matipid sa pantig |
`,
  complexEdgeCases: `# Edge Case Torture Test (CRLF, Nested Lists, Code with Markdown)

1. First level ordered item
   * Second level unordered with \`* \` marker
     - Third level unordered with \`- \` marker
       + Fourth level unordered with \`+ \` marker and **bold _nested_ emphasis**
2. Second ordered item with a task:
   - [x] Completed nested task
   - [ ] Pending nested task with \`inline code | pipe\`

\`\`\`markdown
# This heading is inside a fenced code block
- [ ] It must NOT be treated as an interactive task list
| Or | A | Table |
\`\`\`

| Column with \`|\` escaped | Formatting | Math & Code |
| :--- | :---: | ---: |
| Cell with **bold** and *italic* | ~~Deleted~~ text | \`x = y + 1\` |
| Second row | [Link](https://example.com) | $a^2 + b^2 = c^2$ |
`
};
