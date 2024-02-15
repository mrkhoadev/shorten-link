var express = require('express');
var router = express.Router();

const indexController = require("../controllers/index.controller");
/* GET home page. */
router.get('/', indexController.index);
router.get("/logout", indexController.logout);

router.post("/", indexController.handleSubmit);
router.post("/delete", indexController.handleDelete);
router.post("/edit", indexController.handleEdit);
router.get('/:id', indexController.navigation);
router.post('/:id', indexController.handleNavigationLogin);



module.exports = router;
