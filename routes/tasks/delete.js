const express = require("express")
const router = express.Router()

const Controller = require('../../config/controllers/controller');
const permission = Controller.permission;

const ProjectsControllerClass = require('../../controllers/Projects'); 

const ProjectsController = new ProjectsControllerClass()

router.delete("/task", async (req, res) => { 
    try{
        await ProjectsController.removeTask(req, res, [ permission.uad, permission.ad ]) 
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

module.exports = router;