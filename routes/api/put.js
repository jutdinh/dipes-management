const express = require("express")
const router = express.Router()

const ApiControllerClass = require("../../controllers/APIController")

const ApiController = new ApiControllerClass()

router.put('/api', async (req, res) => { 
    try{
        await ApiController.update( req, res )        
    }catch{
        res.send({ success: false, status: "0x4501246" })
    } 
})


module.exports = router;