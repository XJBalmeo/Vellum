/**
 * File I/O & Recent Files Manager
 * Handles File System Access API (showOpenFilePicker / showSaveFilePicker),
 * fallback file input/download, drag-and-drop, and recent files metadata in localStorage.
 */

import { STORAGE_KEYS } from './settings.js';

export function loadRecentFiles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENT_FILES);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export function recordRecentFile(name, snippet = '') {
  try {
    const existing = loadRecentFiles().filter(item => item.name !== name);
    const updated = [
      {
        name,
        timestamp: Date.now(),
        preview: snippet.slice(0, 120)
      },
      ...existing
    ].slice(0, 8);
    localStorage.setItem(STORAGE_KEYS.RECENT_FILES, JSON.stringify(updated));
    return updated;
  } catch (_) {
    return [];
  }
}

export function formatRelativeTime(timestamp) {
  const diffSec = Math.max(1, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

export async function openFileFromDisk(fallbackInputEl) {
  if ('showOpenFilePicker' in window) {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'Markdown & Text Files',
            accept: {
              'text/markdown': ['.md', '.markdown', '.mdown', '.mkd'],
              'text/plain': ['.txt']
            }
          }
        ],
        multiple: false
      });
      const file = await handle.getFile();
      const content = await file.text();
      return { name: file.name, content, handle };
    } catch (err) {
      if (err && err.name === 'AbortError') return null;
      // If security error inside sandboxed iframe, fall back to <input type="file">
    }
  }

  return new Promise((resolve) => {
    if (!fallbackInputEl) {
      resolve(null);
      return;
    }
    fallbackInputEl.value = '';
    const onChange = async () => {
      fallbackInputEl.removeEventListener('change', onChange);
      const file = fallbackInputEl.files && fallbackInputEl.files[0];
      if (!file) {
        resolve(null);
        return;
      }
      const content = await file.text();
      resolve({ name: file.name, content, handle: null });
    };
    fallbackInputEl.addEventListener('change', onChange, { once: true });
    fallbackInputEl.click();
  });
}

export async function saveFileToDisk(filename, content, existingHandle = null) {
  // 1. Write back in-place if we already hold a FileSystemFileHandle
  if (existingHandle && typeof existingHandle.createWritable === 'function') {
    try {
      const writable = await existingHandle.createWritable();
      await writable.write(content);
      await writable.close();
      return { saved: true, name: existingHandle.name || filename, handle: existingHandle, method: 'fs-inplace' };
    } catch (err) {
      if (err && err.name === 'AbortError') return { saved: false };
    }
  }

  // 2. Try showSaveFilePicker if available and not blocked by iframe permissions
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename || 'document.md',
        types: [
          {
            description: 'Markdown File',
            accept: { 'text/markdown': ['.md', '.markdown'] }
          }
        ]
      });
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      return { saved: true, name: handle.name || filename, handle, method: 'fs-picker' };
    } catch (err) {
      if (err && err.name === 'AbortError') return { saved: false };
      // Fall through to standard browser download if blocked in sandboxed iframe
    }
  }

  // 3. Universal browser download fallback (Firefox, Safari, sandboxed iframes)
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'document.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  return { saved: true, name: filename || 'document.md', handle: null, method: 'download' };
}
