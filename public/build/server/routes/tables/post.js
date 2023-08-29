const express = require("express")
const router = express.Router()

const Controller = require('../../config/controllers/controller');
const permission = Controller.permission;

const TableControllerClass = require('../../controllers/Version/TablesController');
const TableController = new TableControllerClass()

router.post('/table', async (req, res) => { await TableController.createTable( req, res, [permission.mgr, permission.spv] ) })

module.exports = router;