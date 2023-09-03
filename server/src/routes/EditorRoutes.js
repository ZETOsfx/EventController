const Router = require('express');
const router = new Router();
const EventController = require('../controller/EditorService');
const authMw = require('../middleware/authMiddleware');

router.use(Router.json());
router.use(Router.urlencoded({ extended: true }));


    // Получение шаблонов и композиций
router.get('/alltmp', authMw, EventController.allData);

    // Открытие шаблона
router.patch('/all', authMw, EventController.getTemplate);          
    // Сохранение шаблона
router.patch('/save', authMw, EventController.saveTemplate);       
    // Создать новый шаблон
router.patch('/addtmp', authMw, EventController.createTemplate);
    // Удалить шаблон
router.delete('/deltmp', authMw, EventController.deleteTemplate);

    // Компановка шаблонов
router.put('/compose', authMw, EventController.createCompose);
    // Удалить композицию
router.delete('/delcmp', authMw, EventController.deleteCompose);
    // Отправить композицию на модерацию
router.patch('/sendcmp', authMw, EventController.sendCompose);
    // Просмотр содержимого шаблонов в композиции 
router.patch('/opencmp', authMw, EventController.openCompose);
    // Правки в композицию 
router.patch('/savecmp', authMw, EventController.templateSaveChangesIntoCompose);
    // Получить события из шаблона внутри компановки
router.patch('/tmpcmpreserve', authMw, EventController.eventsFromTmpInCompose);


    // Выдача списка событий на трансляцию
router.get('/json', EventController.getEventsFormatJSON);


module.exports = router;