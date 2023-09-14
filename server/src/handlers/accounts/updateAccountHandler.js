const userService = require('../../services/UserService');

const handle = async (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            data: await userService.updateOne(req),
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            data: await error.message,
        });
    }
}

module.exports = handle;