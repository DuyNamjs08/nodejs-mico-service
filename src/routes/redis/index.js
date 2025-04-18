const express = require('express');
const router = express.Router();
const { addVideo, playVideo } = require('../../services/View.service');
router.post('/add-video', addVideo);
router.post('/views', playVideo);
module.exports = router;
