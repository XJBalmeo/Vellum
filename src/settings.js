/**
 * Customization & Theme Persistence Module
 * Persists user typography, theme, accent color, and layout preferences to localStorage.
 */

export const STORAGE_KEYS = {
  SETTINGS: 'vellum_md_settings_v1',
  AUTOSAVE_DOC: 'vellum_md_autosave_doc_v1',
  AUTOSAVE_META: 'vellum_md_autosave_meta_v1',
  RECENT_FILES: 'vellum_md_recent_files_v1'
};

export const FONT_OPTIONS = {
  body: [
    { id: 'newsreader', label: 'Newsreader (Editorial Serif)', value: "'Newsreader', Georgia, serif" },
    { id: 'lora', label: 'Lora (Warm Book Serif)', value: "'Lora', Georgia, serif" },
    { id: 'jakarta', label: 'Plus Jakarta Sans (Humanist Sans)', value: "'Plus Jakarta Sans', -apple-system, sans-serif" },
    { id: 'system-sans', label: 'System Sans-Serif', value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
    { id: 'system-serif', label: 'System Serif (Georgia)', value: "Georgia, 'Times New Roman', serif" }
  ],
  heading: [
    { id: 'instrument', label: 'Instrument Serif (Display Editorial)', value: "'Instrument Serif', Georgia, serif" },
    { id: 'fraunces', label: 'Fraunces (Old-Style Soft Serif)', value: "'Fraunces', Georgia, serif" },
    { id: 'newsreader', label: 'Newsreader (Editorial Serif)', value: "'Newsreader', Georgia, serif" },
    { id: 'jakarta', label: 'Plus Jakarta Sans (Crisp Sans)', value: "'Plus Jakarta Sans', -apple-system, sans-serif" },
    { id: 'system', label: 'System Font', value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }
  ],
  code: [
    { id: 'jetbrains', label: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
    { id: 'firacode', label: 'Fira Code', value: "'Fira Code', monospace" },
    { id: 'ibmplex', label: 'IBM Plex Mono', value: "'IBM Plex Mono', monospace" },
    { id: 'system-mono', label: 'System Monospace', value: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" }
  ]
};

export const ACCENT_PRESETS = [
  { id: 'vermilion', label: 'Terracotta Vermilion', hex: '#B84A27' },
  { id: 'pine', label: 'Botanical Pine', hex: '#2A6F4E' },
  { id: 'cobalt', label: 'Archival Cobalt', hex: '#255C99' },
  { id: 'ochre', label: 'Raw Ochre', hex: '#B4690E' },
  { id: 'plum', label: 'Burgundy Ink', hex: '#8F2D56' }
];

export const MEASURE_PRESETS = {
  narrow: '56ch',
  comfortable: '68ch',
  wide: '86ch'
};

export function getDefaultSettings() {
  let preferredTheme = 'light';
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      preferredTheme = 'dark';
    }
  } catch (_) {}

  return {
    theme: preferredTheme,
    accent: '#B84A27',
    fontBody: 'newsreader',
    fontHeading: 'instrument',
    fontCode: 'jetbrains',
    fontSize: 18,
    lineHeight: 1.72,
    paraSpacing: 1.25,
    measure: 'comfortable',
    showLineNumbers: true,
    outlineOpen: true,
    viewMode: 'split'
  };
}

export function loadSettings() {
  const defaults = getDefaultSettings();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch (_) {
    return defaults;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (_) {}
}

export function hexToRgba(hex, alpha) {
  const clean = (hex || '#B84A27').replace('#', '');
  const num = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function applySettingsToDOM(settings) {
  const root = document.documentElement;
  root.setAttribute('data-theme', settings.theme || 'light');

  const bodyFont = FONT_OPTIONS.body.find(f => f.id === settings.fontBody)?.value || FONT_OPTIONS.body[0].value;
  const headingFont = FONT_OPTIONS.heading.find(f => f.id === settings.fontHeading)?.value || FONT_OPTIONS.heading[0].value;
  const codeFont = FONT_OPTIONS.code.find(f => f.id === settings.fontCode)?.value || FONT_OPTIONS.code[0].value;

  root.style.setProperty('--font-body', bodyFont);
  root.style.setProperty('--font-heading', headingFont);
  root.style.setProperty('--font-code', codeFont);
  root.style.setProperty('--doc-font-size', `${settings.fontSize}px`);
  root.style.setProperty('--doc-line-height', String(settings.lineHeight));
  root.style.setProperty('--doc-para-spacing', `${settings.paraSpacing}em`);
  root.style.setProperty('--doc-measure', MEASURE_PRESETS[settings.measure] || MEASURE_PRESETS.comfortable);

  const accent = settings.accent || '#B84A27';
  root.style.setProperty('--accent', accent);
  root.style.setProperty('--accent-soft', hexToRgba(accent, settings.theme === 'dark' ? 0.22 : 0.12));

  // Toggle highlight.js theme stylesheet if present
  const hljsLight = document.getElementById('hljs-light-theme');
  const hljsDark = document.getElementById('hljs-dark-theme');
  if (hljsLight && hljsDark) {
    const isDark = settings.theme === 'dark';
    hljsLight.disabled = isDark;
    hljsDark.disabled = !isDark;
  }
}
