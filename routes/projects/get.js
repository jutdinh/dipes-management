const express = require("express")
const router = express.Router()

const Controller = require('../../config/controllers/controller');
const permission = Controller.permission;

const ProjectsControllerClass = require('../../controllers/Projects'); 

const ProjectsController = new ProjectsControllerClass()


router.get('/all/projects',  (req, res) => {  ProjectsController.get(req, res, [ permission.uad, permission.ad, permission.pm, permission.pd ]) })
router.get('/full/all/projects', (req, res) => ProjectsController.getFullProjectsData( req, res ))
router.get('/project/:project_id', (req, res) => { ProjectsController.getOne( req, res, [ permission.uad, permission.ad, permission.pm, permission.pd ] ) })


router.get('/statistic/status/over/years',  (req, res)  => {  ProjectsController.statisProjectsBasedOnStatusOfAllTime(req, res) })
router.get('/statistic/manager/and/their/projects',  (req, res)  => {  ProjectsController.statisProjectsBasedOnManagers(req, res) })

router.get('/statistic', (req, res)  => {  ProjectsController.statisProjects(req, res) })

router.get('/project/:project_id/tasks', ( req, res ) => { ProjectsController.getTasks( req, res ) }) // removed

router.get('/project/:project_id/periods', ( req, res ) => { ProjectsController.getTaskPeriods( req, res ) })
router.get('/project/:project_id/period/:period_id', ( req, res ) => { ProjectsController.getTaskPeriod( req, res ) })

router.get('/report/data', (req, res) => { ProjectsController.getProjectsForReport( req, res, [ permission.uad, permission.ad, permission.pm, permission.pd ] ) })
router.get('/p/:project_id/report/data', (req, res) => { ProjectsController.getProjectForReport( req, res, [ permission.uad, permission.ad, permission.pm, permission.pd ] ) })
module.exports = router;