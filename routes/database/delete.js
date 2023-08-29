const express = require("express")
const router = express.Router()


const TablesControllerClass = require('../../controllers/TablesController');
const TableController = new TablesControllerClass()

router.delete('/table', async (req, res) => { 
    try{
        await TableController.deleteTable( req, res )         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})
router.delete('/table/fields', async (req, res) => { 
    try{
        await TableController.deleteFields( req, res )         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})
module.exports = router;