const express = require("express")
const router = express.Router()


const Notification = require('../../controllers/Notification')
const NotificationController = new Notification()

router.put(`/seen/state`, async (req, res) => {
    await NotificationController.updateSeenState(req, res)
})

module.exports = router;