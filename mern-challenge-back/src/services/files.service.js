const axios = require('axios');
const { parseCSVContent } = require('../utils/csvParser');

const FILES_API_URL = 'https://echo-serv.tbxnet.com/v1/secret';
const AUTH_HEADER = { Authorization: 'Bearer aSuperSecretKey' };

async function fetchFileList() {
    const url = `${FILES_API_URL}/files`;
    const resp = await axios.get(url  , { headers: AUTH_HEADER });
    return resp.data.files || [];
}

async function fetchFileContent(filename) {
    const url = `${FILES_API_URL}/file/${encodeURIComponent(filename)}`;
    try {
      const resp = await axios.get(url, { headers: AUTH_HEADER });
      return resp.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }

}

async function getFilesData(fileName) {
    
    if (fileName) {
        const content = await fetchFileContent(fileName);

        if (content === null) {
            return null;
        } else {
          const lines = parseCSVContent(content);
          return [{ file: fileName, lines }];
        }


    }

  const files = await fetchFileList();

  const promises = files.map(async (file) => {
    try {
      const content = await fetchFileContent(file);
      const lines = parseCSVContent(content);
      return { file, lines };
    } catch {
      return { file, lines: [] };
    }
  });

  return Promise.all(promises);
}

module.exports = {
    fetchFileList,
    fetchFileContent,
    getFilesData
};