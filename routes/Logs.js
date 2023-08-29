const express = require("express")
const router = express.Router()

const Controller = require('../config/controllers/controller');
const permission = Controller.permission;

const EventLogsObject = require('../controllers/LogController');

const LogController = new EventLogsObject();

router.get('/:lang', async ( req, res ) => { await LogController.get( req, res, [ permission.uad ] ) })
router.post('/search', async ( req, res ) => { 
    try{
        await LogController.search( req, res, [ permission.uad ] )         
    }catch{
        res.send({ success: false, status: "0x4501246" })
    }
})
module.exports = router;