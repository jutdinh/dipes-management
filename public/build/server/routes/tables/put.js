const express = require("express")
const router = express.Router()

const Controller = require('../../config/controllers/controller');
const permission = Controller.permission;

const TableControllerClass = require('../../controllers/Version/TablesController');
const TableController = new TableControllerClass();

router.put('/table', async (req, res) => { await TableController.updateTable( req, res, [ permission.mgr, permission.spv, permission.dpr ] ) })

router.put('/table/fields', async ( req, res ) => { await TableController.modifyFields( req, res) })
router.put('/table/keys', async ( req, res ) => { await TableController.keyManipulation( req, res) })
module.exports = router;