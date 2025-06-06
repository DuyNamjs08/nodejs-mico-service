const express = require('express');
const notificationController = require('../../controllers/notification.controller');
const router = express.Router();

router.get('/notification', notificationController.getAllNotifications);

module.exports = router;
