const programService = require('../../services/ProgramService');
const composeService = require('../../../services/ComposeService');

const handle = async (req, res) =>
{
    try {
        res.status(200).json({
            status: 'success',
            data: {
                programs: await programService.getAll(req),
                composes: await composeService.getAll(req),
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            data: await error.message,
        });
    }
}

module.exports = handle;