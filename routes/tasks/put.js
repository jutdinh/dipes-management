const express = require("express")
const router = express.Router()

const Controller = require('../../config/controllers/controller');
const permission = Controller.permission;

const Projects = require('../../controllers/Projects');
const ProjectsController = new Projects()


router.put('/task/info', async (req, res) => { 
    try{
        await ProjectsController.updateTask( req, res )        
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})
router.put('/task/approve', async (req, res) => { 
    try{
        await ProjectsController.updateTask( req, res, "approve" )         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})
router.put('/task/status', async (req, res) => { 
    try{
        await ProjectsController.updateTask( req, res, "status" )         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})
module.exports = router;