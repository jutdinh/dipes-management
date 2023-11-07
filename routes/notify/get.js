const express = require("express")
const router = express.Router()

const Notification = require('../../controllers/Notification')
const NotificationController = new Notification()

router.get(`/notifies`, async (req, res) => {
    await NotificationController.getNotifies(req, res)
})


module.exports = router;