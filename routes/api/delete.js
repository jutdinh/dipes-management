const express = require("express")
const router = express.Router()

const ApiControllerClass = require("../../controllers/APIController")

const ApiController = new ApiControllerClass()

router.delete('/api', async (req, res) => { 
    try{
        await ApiController.delete( req, res ) 
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

module.exports = router;