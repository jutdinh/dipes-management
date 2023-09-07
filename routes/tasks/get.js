const express = require("express")
const router = express.Router()

const TasksControllerClass = require('../../controllers/Tasks'); 
const TasksControler = new TasksControllerClass()

router.get('/:project_id/statistic', (req, res) => { TasksControler.statisticTask( req, res ) })

module.exports = router;