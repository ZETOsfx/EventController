const requestService = require('../../services/RequestService');

const handle = async (req, res) =>
{
    try {
        res.status(200).json({
            status: 'success',
            data: await requestService.setActive(req),
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            data: await error.message,
        });
    }
}

module.exports = handle;