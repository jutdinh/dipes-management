const express = require("express")
const router = express.Router()

const PreImport = require('../../controllers/PreImportTable')

const PreImportController = new PreImport()

router.delete('/', async (req, res) => {
    await PreImportController.delete(req, res)
})

module.exports = router;