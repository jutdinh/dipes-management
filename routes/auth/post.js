const express = require("express")
const router = express.Router()

const Controller = require('../../config/controllers/controller');
const permission = Controller.permission;

const { Auth } = require('../../controllers')

const AuthController = new Auth()

router.post('/login', async (req, res) => { 
    try{
        await AuthController.login(req, res)         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})
router.post('/signup', async (req, res) => { 
    try{
        await AuthController.signup(req, res, [ permission.uad, permission.ad ])         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})


router.post('/retrieve/password', async (req, res) => {
    await AuthController.retrievePassword( req, res )         
    try{
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

module.exports = router;