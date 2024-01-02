const express = require("express")
const router = express.Router()

const ApiControllerClass = require("../../controllers/APIController")

const ApiController = new ApiControllerClass()

router.post('/api', async (req, res) => { 
    await ApiController.createApi(req, res) 
    try{
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})
router.post('/make/alias', async ( req, res ) => { 
    try{
        await ApiController.makeAlias( req, res ) 
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})
module.exports = router;