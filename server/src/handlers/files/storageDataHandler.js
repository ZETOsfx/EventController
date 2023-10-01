const storageService = require('../../services/FileStorageService');

const handle = async (req, res) =>
{
    try {
        res.status(200).json({
            status: 'success',
            data: await storageService.getWorkload(),
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            data: await error.message,
        });
    }
}

module.exports = handle;