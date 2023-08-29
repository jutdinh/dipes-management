const express = require("express")
const router = express.Router()

const ActivationClass = require( '../../controllers/Activation' )

const ActivationController = new ActivationClass()

router.get('/keys', (req, res) => {  ActivationController.get(req, res) })

module.exports = router;