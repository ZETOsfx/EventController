const authService = require('../services/AuthService').default;

const handle = async (req, res) =>
{
    try {
        res.status(200).json({
            status: 'success',
            data: await authService.signIn(req),
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            data: await error.message,
        });
    }
}

module.exports = handle;