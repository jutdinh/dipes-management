const express = require("express")
const router = express.Router()

const Controller = require('../../config/controllers/controller');
const permission = Controller.permission;

const Projects = require('../../controllers/Projects');
const ProjectsController = new Projects()

router.post('/create/',  async (req, res ) => { 
    try{
         await ProjectsController.create(req, res, [ permission.ad, permission.uad ])         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})
router.post('/members/', async (req, res) => { 
    try{
         await ProjectsController.addMembers( req, res )         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

router.post("/periods", async (req, res) => { 
    try{
        await ProjectsController.createTaskPeriod(req, res)         
   }catch{
       res.send({ success: false, status: "0x4501246" })
   }
})

router.post('/project/:project_id/task/',  async (req, res ) => { 
    try{
         await ProjectsController.createTask(req, res, [ permission.ad, permission.uad ])         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

router.post('/search',  async (req, res ) => {     
    await ProjectsController.searchProjects(req, res, [ permission.ad, permission.uad ])         
    
})

module.exports = router;