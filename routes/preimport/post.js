const express = require("express")
const router = express.Router()

const PreImport = require('../../controllers/PreImportTable')

const PreImportController = new PreImport()

router.post('/add', async (req, res) => {
    await PreImportController.post(req, res)
})

module.exports = router;