const express = require("express")
const router = express.Router()

const Controller = require('../../config/controllers/controller');
const permission = Controller.permission;

const TableControllerClass = require('../../controllers/Version/TablesController');
const TableController = new TableControllerClass();

router.delete('/table', async (req, res) => { await TableController.removeTable( req, res, [permission.mgr, permission.spv, permission.dpr] ) })
router.delete('/table/fields', async (req, res) => { await TableController.removeFields( req, res ) } )
module.exports = router;