const express = require("express")
const router = express.Router()

const UIControllerClass = require("../../controllers/UIController")

const UIController = new UIControllerClass()

router.get('/v/:version_id', (req, res) => { UIController.getUIs(req, res) })
router.get('/u/:version_id/:ui_id', (req, res) => { UIController.getUI(req, res) })

router.get('/:version_id/savedui', (req, res) => { UIController.getSavedUI(req, res) })
module.exports = router;
