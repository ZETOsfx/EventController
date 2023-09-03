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

router.get('/all', authMw, userController.getAllUsers);     //  /account/all    outbase { none }
router.patch('/upd', authMw, userController.updateUser);    //  /account/upd    inbase  { id, name, role, password }
router.post('/rm', authMw, userController.deleteUser);      //  /account/rm     inbase  { id }

module.exports = router;