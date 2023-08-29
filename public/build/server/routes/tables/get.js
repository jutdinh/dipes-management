const express = require("express")
const router = express.Router()

const TableControllerClass = require('../../controllers/Version/TablesController');
const TableController = new TableControllerClass();

router.get('/v/:version_id', async (req, res) => { await TableController.getTables(req, res ) })
router.get('/v/:version_id/tables/fields', async (req, res) => { await TableController.getTablesAndFields(req, res ) })
router.get('/table/:table_id/fields', async ( req, res ) => { await TableController.getFields( req, res ) })
router.get('/table/:table_id', async ( req, res ) => { await TableController.getTable( req, res ) })
// get All Table Of an single Version

module.exports = router;