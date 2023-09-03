const Router = require('express');
const router = new Router();
const ModerController = require('../controller/ModeratorService');
const authMw = require('../middleware/authMiddleware');

router.use(Router.json());
router.use(Router.urlencoded({ extended: true }));


    // Получение списка запросов на утверждение
router.get('/requests', authMw, ModerController.getRequests);
    // Список всех шаблонов, которые может задействовать модератор для редактирования запросов
router.patch('/alltmp', authMw, ModerController.getTemplates);


    // Переключить процесс
router.patch('/switchprocess', authMw, ModerController.switchProcess);
    // Автоматическое опрерывание обработки при выходе
router.post('/endprocess', authMw, ModerController.EndProcess);


    // Утвердить запрос 
router.patch('/access', authMw, ModerController.Access);
    // Отклонить запрос 
router.put('/deny', authMw, ModerController.Deny);
    // Открыть выбранный в поле шаблон
router.patch('/details', authMw, ModerController.Details);
    // Установка на воспроизведение 
router.patch('/setactive', authMw, ModerController.SetActive);
    // Получение списка событий для предпросмотра шаблона внутри композиции 
router.patch('/preview', authMw, ModerController.previewData);


module.exports = router;
