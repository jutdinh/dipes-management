const express = require("express")
const router = express.Router()

const ActivationControllerObject = require('../../controllers/Activation')

const ActivationController = new ActivationControllerObject()

router.post('/activate/key', async( req, res ) => { await ActivationController.activateKey(req, res) })
router.post('/generate/key', async( req, res ) => { await ActivationController.generateActivationKey(req, res) })
module.exports = router;