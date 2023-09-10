const Router = require('express');
const router = new Router();
const userController = require('../controller/AdminService');
const authMw = require('../middleware/authMiddleware');

router.use(Router.json());
router.use(Router.urlencoded({ extended: true })); 

// ------ ОБРАБОТКА ЗАПРОСОВ -----------
// ----------- REGISTER ----------------
router.get('/log', authMw, userController.logPanel);
router.patch('/register', authMw, userController.registerAsync);

// ------------ LOGIN ------------------
router.post('/authenticate', userController.signInAsync);   

router.get('/all', authMw, userController.getAllUsers);
router.patch('/upd', authMw, userController.updateUser);
router.post('/rm', authMw, userController.deleteUser);

module.exports = router;