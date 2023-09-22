const express = require("express")
const router = express.Router()

const UIControllerClass = require("../../controllers/UIController")

const UIController = new UIControllerClass()

router.post('/ui', async (req, res) => { 
    try{
        await UIController.createUI(req, res)         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

router.post('/api/and/ui', async (req, res) => { 
    try{
        await UIController.createAPIandUI(req, res)         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

router.post('/apiview', async (req, res) => { 
    await UIController.createAPIView(req, res)         
})


module.exports = router;