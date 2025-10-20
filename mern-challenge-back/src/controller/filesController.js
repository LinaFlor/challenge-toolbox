const filesService = require('../services/files.service');

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