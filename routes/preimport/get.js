const express = require("express")
const router = express.Router()

const PreImport = require('../../controllers/PreImportTable')

const PreImportController = new PreImport()

router.get('/:version_id/:table_id', async (req, res) => {
    await PreImportController.get(req, res)
})


module.exports = router;