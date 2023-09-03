require('dotenv').config();
const Router = require('express');
const router = new Router();
const fileController = require('../controller/FileworkingService');
const authMw = require('../middleware/authMiddleware');

router.use(Router.json());
router.use(Router.urlencoded({ extended: true }));


const multer = require('multer');
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_PATH_ORIGIN);
    },
    filename: (req, file, cb) => {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, Date.now() + '--' + file.originalname);
    }
});
const upload = multer({ storage: fileStorageEngine });

    // Get all loaded files
router.get('/files', authMw, fileController.getFiles);
    // Load list of images
router.post('/img', authMw, upload.array('image', 10), fileController.addImg);
    // Update data about image
router.patch('/img', authMw, fileController.updateImg);
    // Delete image
router.delete('/img', authMw, fileController.deleteImg);

module.exports = router;