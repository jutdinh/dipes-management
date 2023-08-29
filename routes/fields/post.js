const express = require("express")
const router = express.Router()


const TablesControllerClass = require('../../controllers/TablesController');
const TableController = new TablesControllerClass()

router.post('/fields', async (req, res) => { 
    try{
        await TableController.addFields( req, res )         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

module.exports = router;