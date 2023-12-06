const programService = require('../../../services/ProgramService');

const handle = async (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            data: await programService.selfPrograms(req),
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            data: await error.message,
        });
    }
};

module.exports = handle;
