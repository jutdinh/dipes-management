const express = require("express")
const router = express.Router()

const Controller = require('../../config/controllers/controller');
const permission = Controller.permission;

const ProjectsControllerClass = require('../../controllers/Projects'); 

const ProjectsController = new ProjectsControllerClass()

router.put("/update",  async (req, res) => {  
    try{
        await ProjectsController.update(req, res, [permission.uad, permission.ad, permission.pm ]) 
        
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

router.put("/project/:project_id/period/:period_id/progress",  async (req, res) => {  

    await ProjectsController.updatePeriodProgress(req, res) 
    try{
        
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

router.put("/project/:project_id/period/:period_id",  async (req, res) => {  
    await ProjectsController.updateTaskPeriod(req, res) 
    try{
        
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

router.put("/project/:project_id/period/:period_id/task/:task_id",  async (req, res) => {  
    try{
        await ProjectsController.updateTask(req, res)         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

router.put("/project/:project_id/period/:period_id/task/:task_id/status",  async (req, res) => {  
    try{
        await ProjectsController.updateTask(req, res, "status")         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})


router.put("/project/:project_id/period/:period_id/task/:task_id/approve",  async (req, res) => {  
    try{
        await ProjectsController.updateTask(req, res, "approve")         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

router.put("/project/:project_id/period/:period_id/task/:task_id/progress",  async (req, res) => {  
    try{
        await ProjectsController.updateTaskProgress(req, res)         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})


router.put("/project/:project_id/period/:period_id/task/:task_id/child/:child_task_id",  async (req, res) => {  
    try{
        await ProjectsController.updateChildTask(req, res)         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

router.put("/project/:project_id/period/:period_id/task/:task_id/child/:child_task_id/approve",  async (req, res) => {  
    try{
        await ProjectsController.updateChildTaskApproval(req, res)         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})




router.put("/project/member/privilege", async (req, res) => { 
    try{
        await ProjectsController.changeMemberPrivilege( req, res ) 
        
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

router.put("/project/members/privileges", async (req, res) => { 
    try{
        await ProjectsController.changeMemberPrivileges( req, res ) 
        
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})

module.exports = router;