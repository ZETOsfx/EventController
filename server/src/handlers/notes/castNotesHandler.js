const noteService = require('../../services/NoteService');

const handle = async (req, res) =>
{
    try {
        res.status(200).json({
            status: 'success',
            data: await noteService.getFromCast(),
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            data: await error.message,
        });
    }
}

module.exports = handle;