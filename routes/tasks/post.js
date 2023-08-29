const express = require("express")
const router = express.Router()

const Controller = require('../../config/controllers/controller');
const permission = Controller.permission;

const Projects = require('../../controllers/Projects');
const ProjectsController = new Projects()


module.exports = router;