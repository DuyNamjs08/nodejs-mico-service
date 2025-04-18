const express = require("express");
const CommentController = require("../../controllers/comment.controller");
const router = express.Router();

router.post("/comments", CommentController.createComment);
router.get("/comments", CommentController.getComments);
router.delete("/comments", CommentController.deleteComments);

module.exports = router;
