
function parseCSVContent(content) {

  if (!content || !content.trim()) return [];

  // delete BOM if present
  content = content.replace(/^\uFEFF/, '');

  // split lines robustly for LF and CRLF, trim and drop empty lines
  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // delete header if present
  if (lines.length > 0 && lines[0].toLowerCase().startsWith('file,')) lines.shift();

  const result = [];
  for (const line of lines) {
    const parts = line.split(',');

    if (parts.length !== 4) continue; 

    const [, textRaw, numberStrRaw, hexRaw] = parts;
    const text = (textRaw || '').trim();
    const numberStr = (numberStrRaw || '').trim();
    const hex = (hexRaw || '').trim();

    if (text === '' || numberStr === '') continue;
    const number = Number(numberStr);
    if (Number.isNaN(number)) continue;

    // accept hex with or without 0x; normalize to lowercase 32-char hex without prefix
    let normalizedHex = hex;
    if (normalizedHex.startsWith('0x') || normalizedHex.startsWith('0X')) {
      normalizedHex = normalizedHex.slice(2);
    }
    normalizedHex = normalizedHex.toLowerCase();
    if (!/^[0-9a-f]{32}$/.test(normalizedHex)) continue;

    result.push({ text, number, hex: normalizedHex });
  }
  return result;
}

module.exports = {
    parseCSVContent
};