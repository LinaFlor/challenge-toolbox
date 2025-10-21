const http = require('http');
const assert = require('assert');

require('../src/server');

const filesService = require('../src/services/files.service');

function request(path) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: '127.0.0.1', port: process.env.PORT || 3001, path, method: 'GET' };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let body = null;
        try { body = JSON.parse(data); } catch (e) { body = data; }
        resolve({ statusCode: res.statusCode, body });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

describe('Files routes', function() {
  // stub the service so tests do not call external APIs
  before(() => {
    filesService.fetchFileList = async () => ['file1.csv', 'file2.csv'];
    filesService.getFilesData = async (fileName) => {
      if (fileName) {
        if (fileName === 'notfound.csv') return null;
        return [{ file: fileName, lines: [{ text: 'hello', number: 1, hex: '2c74a526dec5a9d9fc8ca46a392ca42c' }] }];
      }
      return [
        { file: 'file1.csv', lines: [{ text: 'one', number: 1, hex: '2c74a526dec5a9d9fc8ca46a392ca42c' }] },
        { file: 'file2.csv', lines: [{ text: 'two', number: 2, hex: '2c74a526dec5a9d9fc8ca46a392ca42c' }] }
      ];
    };
  });

  it('GET /files/list returns available files', async () => {
    const res = await request('/files/list');
  assert.strictEqual(res.statusCode, 200);
  assert.ok(res.body && Array.isArray(res.body.files), 'files array missing');
  ['file1.csv', 'file2.csv'].forEach(f => assert.ok(res.body.files.includes(f)));
  });

  it('GET /files/data returns all files data', async () => {
    const res = await request('/files/data');
  assert.strictEqual(res.statusCode, 200);
  assert.ok(Array.isArray(res.body));
  assert.strictEqual(res.body.length, 2);
  assert.ok(res.body[0] && 'file' in res.body[0]);
  assert.ok(res.body[0] && 'lines' in res.body[0]);
  });

  it('GET /files/data?fileName=file1.csv returns single file data', async () => {
    const res = await request('/files/data?fileName=file1.csv');
  assert.strictEqual(res.statusCode, 200);
  assert.ok(Array.isArray(res.body) && res.body.length === 1);
  assert.strictEqual(res.body[0].file, 'file1.csv');
  });

  it('GET /files/data?fileName=notfound.csv returns 404', async () => {
    const res = await request('/files/data?fileName=notfound.csv');
  assert.strictEqual(res.statusCode, 404);
  assert.ok(res.body && res.body.message);
  });
  
  it('GET /non-existent returns 404 and JSON error', async () => {
    const res = await request('/non-existent');
    assert.strictEqual(res.statusCode, 404);
    // Should return a JSON object with an error property (from errorHandler)
    assert.ok(res.body && (res.body.error || res.body.message), 'Error message missing in 404 response');
  });
});
