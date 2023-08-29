const express = require("express")
const router = express.Router()


const TablesControllerClass = require('../../controllers/TablesController');
const TableController = new TablesControllerClass()

router.get('/v/:version_id',  (req, res) => {  TableController.getTables(req, res ) })
router.get('/v/:version_id/tables/fields',  (req, res) => {  TableController.getTablesAndFields(req, res ) })
router.get('/v/:version_id/table/:table_id/fields',  ( req, res ) => {  TableController.getFields( req, res ) })
router.get('/v/:version_id/table/:table_id',  ( req, res ) => {  TableController.getTable( req, res ) })

module.exports = router;