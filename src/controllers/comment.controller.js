'use strict';
const CommentService = require('../services/Comment.service');
const { successResponse, errorResponse } = require('../helpers/response');
class CommentController {
  createComment = async (req, res) => {
    try {
      const { productId, userId, content, parentCommentId } = req.body;
      const comment = await CommentService.createComment({
        productId,
        userId,
        content,
        parentCommentId,
      });
      return successResponse(res, 'Comment created successfully', comment);
    } catch (error) {
      return errorResponse(res, 'Failed to create comment', error);
    }
  };
  getComments = async (req, res) => {
    try {
      const { productId, parentCommentId } = req.query;
      const comment = await CommentService.getCommentsByParentId({
        productId,
        parentCommentId,
      });
      return successResponse(res, 'Comment gets successfully', comment);
    } catch (error) {
      return errorResponse(res, 'Failed to gets comment', error);
    }
  };
  deleteComments = async (req, res) => {
    try {
      const { productId, commentId } = req.body;
      const comment = await CommentService.deleteComment({
        commentId,
        productId,
      });
      return successResponse(res, 'Delete comment successfully', comment);
    } catch (error) {
      return errorResponse(res, 'Failed to delete comments', error);
    }
  };
}
module.exports = new CommentController();
