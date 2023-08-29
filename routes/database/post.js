const express = require("express")
const router = express.Router()


const TablesControllerClass = require('../../controllers/TablesController');
const TableController = new TablesControllerClass()

router.post('/table', async (req, res) => { 
    try{
        await TableController.createTable( req, res )         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

module.exports = router;