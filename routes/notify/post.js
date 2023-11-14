const express = require("express")
const router = express.Router()

const Notification = require('../../controllers/Notification')
const NotificationController = new Notification()

router.post(`/translate`, async (req, res) => {
    await NotificationController.translateNotify(req, res)
})



module.exports = router;