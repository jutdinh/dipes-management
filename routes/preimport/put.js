const express = require("express")
const router = express.Router()

const PreImport = require('../../controllers/PreImportTable')

const PreImportController = new PreImport()

router.put('/', async (req, res) => {
    await PreImportController.put(req, res)
})

module.exports = router;