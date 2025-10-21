/**
 * Parses the raw CSV content returned by the external API into a structured JSON format.
 * 
 * This function:
 * - Removes BOM markers if present.
 * - Splits lines safely (handling LF and CRLF).
 * - Removes headers if detected.
 * - Validates and normalizes each line of data.
 * - Filters out malformed or incomplete lines.
 *
 * Expected CSV format:
 *   file,text,number,hex
 *   file1.csv,Example,1234,70ad29aacf0b690b0467fe2b2767f765
 *
 * @param {string} content - Raw CSV file content as a string.
 * @returns {Array<{ text: string, number: number, hex: string }>} 
 * An array of valid parsed lines.
 */

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
    const EXPECTED_PARTS = 4;

    if (parts.length !== EXPECTED_PARTS) continue;

    const [, textRaw, numberStrRaw, hexRaw] = parts;
    const text = (textRaw || '').trim();
    const numberStr = (numberStrRaw || '').trim();
    const hex = (hexRaw || '').trim();
    const HEX_LENGTH = 32;

    if (text === '' || numberStr === '') continue;
    const number = Number(numberStr);
    if (Number.isNaN(number)) continue;

    // accept hex with or without 0x; normalize to lowercase 32-char hex without prefix
    let normalizedHex = hex;
    if (normalizedHex.startsWith('0x') || normalizedHex.startsWith('0X')) {
      normalizedHex = normalizedHex.slice(2);
    }
    normalizedHex = normalizedHex.toLowerCase();
    if (!new RegExp(`^[0-9a-f]{${HEX_LENGTH}}$`).test(normalizedHex)) continue;

    result.push({ text, number, hex: normalizedHex });
  }
  return result;
}

module.exports = {
    parseCSVContent
};