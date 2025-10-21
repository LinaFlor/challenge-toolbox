const axios = require('axios');
const { parseCSVContent } = require('../utils/csvParser');

const FILES_API_URL = 'https://echo-serv.tbxnet.com/v1/secret';
const AUTH_HEADER = { Authorization: 'Bearer aSuperSecretKey' };

/**
 * Fetches the list of available files from the external API.
 *
 * @async
 * @returns {Promise<string[]>} A promise that resolves to an array of filenames.
 * @throws {Error} If the request fails for reasons other than handled responses.
 */

async function fetchFileList() {
  const logger = require('../middleware/logger');
  const url = `${FILES_API_URL}/files`;
  logger.debug(`Fetching file list from ${url}`);
  const resp = await axios.get(url  , { headers: AUTH_HEADER });
  logger.info(`Fetched ${resp.data.files?.length || 0} files from API`);
  return resp.data.files || [];
}

/**
 * Fetches the raw CSV content of a specific file from the external API.
 *
 * @async
 * @param {string} filename - The name of the file to fetch.
 * @returns {Promise<string|null>} The raw CSV content as a string, or null if the file was not found (404).
 * @throws {Error} If another type of network or parsing error occurs.
 */

async function fetchFileContent(filename) {
    const logger = require('../middleware/logger');
    const url = `${FILES_API_URL}/file/${encodeURIComponent(filename)}`;
    logger.debug(`Fetching file content for ${filename} from ${url}`);
    try {
      const resp = await axios.get(url, { headers: AUTH_HEADER });
      logger.debug(`Fetched content for file: ${filename}`);
      return resp.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        logger.warn(`File not found in API: ${filename}`);
        return null;
      }
      logger.error(`Error fetching file content for ${filename}`, error);
      throw error;
    }

}

/**
 * Retrieves and processes file data from the external API.
 *
 * - If a specific filename is provided, only that file is fetched and parsed.
 * - Otherwise, it fetches all available files, downloads each one, and parses their contents.
 * - Invalid or inaccessible files are returned with an empty "lines" array.
 *
 * @async
 * @param {string} [fileName] - Optional filename to fetch specific file data.
 * @returns {Promise<Array<{ file: string, lines: Array<{ text: string, number: number, hex: string }> }>>}
 * A promise resolving to a list of processed files with their parsed lines.
 */

async function getFilesData(fileName) {
    
    const logger = require('../middleware/logger');
    if (fileName) {
        logger.debug(`Getting data for file: ${fileName}`);
        const content = await fetchFileContent(fileName);

        if (content === null) {
            logger.warn(`File not found: ${fileName}`);
            return null;
        } else {
          const lines = parseCSVContent(content);
          logger.info(`Parsed content for file: ${fileName}`);
          return [{ file: fileName, lines }];
        }
    }

    logger.debug('Getting data for all files');
    const files = await fetchFileList();

    const promises = files.map(async (file) => {
      try {
        const content = await fetchFileContent(file);
        const lines = parseCSVContent(content);
        logger.info(`Parsed content for file: ${file}`);
        return { file, lines };
      } catch (err) {
        logger.error(`Error processing file: ${file}`, err);
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