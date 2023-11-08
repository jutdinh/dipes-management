const express = require("express")
const router = express.Router()


const Notification = require('../../controllers/Notification')
const NotificationController = new Notification()

router.delete(`/notifies`, async (req, res) => {
    await NotificationController.removeNotifies(req, res)
})

module.exports = router;