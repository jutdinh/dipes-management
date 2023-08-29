const express = require("express")
const router = express.Router()

const VersionsControllerClass = require('../../controllers/VersionsController'); 

const VersionsController = new VersionsControllerClass()

router.get('/d/:version_id/write-ui', (req, res) => { VersionsController.writeUIForExportingWholeProject(req, res) })
router.get('/d/:version_id/whole', (req, res) => { VersionsController.exportWholeProject(req, res) })
router.get('/d/:version_id/tables', (req, res) => { VersionsController.exportTables(req, res) })
router.get('/d/:version_id/apis', (req, res) => { VersionsController.exportAPIs(req, res) })
router.get('/d/:version_id/ui', (req, res) => { VersionsController.exportUIs(req, res) })

module.exports = router;