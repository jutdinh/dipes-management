const express = require("express")
const router = express.Router()

const UIControllerClass = require("../../controllers/UIController")

const UIController = new UIControllerClass()

router.delete('/ui', async (req, res) => { 
    try{
        await UIController.removeUI(req, res)         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

module.exports = router;