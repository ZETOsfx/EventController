const Router = require('express');
const router = new Router();
const NoteController = require('../controller/ManagerService');

const authMw = require('../middleware/authMiddleware');

router.use(Router.json());
router.use(Router.urlencoded({ extended: true }));

router.get('/public', NoteController.getNotesTranslate);                
router.get('/getall', authMw, NoteController.getNotes);  
router.patch('/', authMw, NoteController.addNote);                 
router.delete('/', authMw, NoteController.deleteNote);  
router.post('/sendreport', authMw, NoteController.sendReport);


module.exports = router