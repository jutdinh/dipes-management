const express = require("express")
const router = express.Router()

const { Auth } = require('../../controllers')

const Controller = require('../../config/controllers/controller');
const permission = Controller.permission;

const AuthController = new Auth()

router.get('/u/:username', (req, res) => { AuthController.getUserInfor(req, res, [ permission.uad, permission.ad, permission.pm,permission.pd ]) })
router.get('/all/accounts', (req, res) => { AuthController.getAllUserInfor( req, res, [ permission.uad, permission.ad, permission.pm, permission.pd ] ) })
router.get('/token/check', (req, res) => { AuthController.tokenCheck( req, res ) })
module.exports = router;