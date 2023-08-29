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
router.put("/project/member/privilege", async (req, res) => { 
    try{
        await ProjectsController.changeMemberPrivilege( req, res ) 
        
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})
module.exports = router;