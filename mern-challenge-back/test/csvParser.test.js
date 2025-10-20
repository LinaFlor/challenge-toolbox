const assert = require('assert');
const { parseCSVContent } = require('../src/utils/csvParser');

describe('csvParser.parseCSVContent', () => {
  it('returns empty array for falsy content', () => {
    assert.deepStrictEqual(parseCSVContent(''), []);
    assert.deepStrictEqual(parseCSVContent(null), []);
    assert.deepStrictEqual(parseCSVContent(undefined), []);
  });

  it('handles BOM, CRLF and removes header', () => {
    const csv = '\uFEFFfile,text,number,hex\r\nfile1,abcdef,1,2c74a526dec5a9d9fc8ca46a392ca42c\r\n';
    const res = parseCSVContent(csv);
    assert.strictEqual(res.length, 1);
    assert.strictEqual(res[0].text, 'abcdef');
    assert.strictEqual(res[0].number, 1);
    assert.strictEqual(res[0].hex, '2c74a526dec5a9d9fc8ca46a392ca42c');
  });

  it('accepts hex with 0x prefix and normalizes', () => {
    const csv = 'file,text,number,hex\nfile2,hi,2,0x2C74A526DEC5A9D9FC8CA46A392CA42C\n';
    const res = parseCSVContent(csv);
    assert.strictEqual(res.length, 1);
    assert.strictEqual(res[0].hex, '2c74a526dec5a9d9fc8ca46a392ca42c');
  });

  it('ignores invalid lines', () => {
    const csv = 'file,text,number,hex\nbadline\nfile3,ok,notanumber,2c74a526dec5a9d9fc8ca46a392ca42c\nfile4,ok,3,shorthex\n';
    const res = parseCSVContent(csv);
    assert.strictEqual(res.length, 0);
  });
});
