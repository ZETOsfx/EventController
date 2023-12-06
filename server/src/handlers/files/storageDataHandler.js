const storageService = require('../../services/FileStorageService');

const handle = async (req, res) => {
    storageService.getWorkload(req, res);
};

module.exports = handle;
