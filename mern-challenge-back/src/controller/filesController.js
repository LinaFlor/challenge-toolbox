const filesService = require('../services/files.service');

/**
 * Controller to get and format file data.
 * If a query param ?fileName is passed, it returns only the information of that file.
 *
 * @async
 * @function getFilesData
 * @param {import('express').Request} req - HTTP request object from Express.
 * @param {import('express').Response} res - HTTP response object from Express.
 * @returns {Promise<void>} Sends a JSON response with the file data or an error.
 */

async function getFilesData(req, res) {
  try {
    const { fileName } = req.query || null;
    const result = await filesService.getFilesData(fileName);

    if (fileName && result === null) {
      return res.status(404).json({
        message: `File "${fileName}" not found`
      });
    }

    res.status(200).json(result);
  } catch {
    res.status(500).json({ 
      message: 'Error processing files'
    });
  }
}

/**
 * Controller to get files list from external API.
 *
 * @async
 * @function getFilesList
 * @param {import('express').Request} req - HTTP request object from Express.
 * @param {import('express').Response} res - HTTP response object from Express.
 * @returns {Promise<void>} Sends a JSON response with the list of files or an error.
 */

async function getFilesList(req, res) {
  try {
    const files = await filesService.fetchFileList();
    res.status(200).json({ files });
  } catch {
    res.status(500).json({ 
      message: 'Error fetching file list'
    });
  }
};

module.exports = { getFilesData, getFilesList };