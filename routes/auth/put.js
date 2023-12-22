const express = require("express")
const router = express.Router()

const Controller = require('../../config/controllers/controller');
const permission = Controller.permission;

const { Auth } = require('../../controllers')

const AuthController = new Auth()

router.put('/user', async (req, res) => { 
    try{
         
         await AuthController.updateUser( req, res, [ permission.uad, permission.ad ])         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})


router.put('/user/password', async (req, res) => { 
    await AuthController.changePassword( req, res, [])         
    try{         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})


router.put('/avatar', async (req, res) => { 
    try{
         await AuthController.changeAva( req, res, [ permission.uad, permission.ad])         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

router.put('/self/info', async (req, res) => { 
    try{
         await AuthController.selfUpdate( req, res )         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})
router.put('/self/avatar', async (req, res) => { 
    try{
         await AuthController.selfChangeAva( req, res )         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})


module.exports = { PUT: router };