"use strict";
const Comment = require("../models/Comment.model");
class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    try {
      const comment = await Comment.create({
        comment_productId: productId,
        comment_userId: userId,
        comment_content: content,
        comment_parentId: parentCommentId,
      });
      let rightValue = 0;
      if (parentCommentId) {
        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) {
          throw new Error("Parent comment not found");
        }
        // update many comments
        rightValue = parentComment.comment_right;
        await Comment.updateMany(
          {
            comment_right: { $gte: rightValue },
            comment_productId: productId,
            isDeleted: false,
          },
          { $inc: { comment_right: 2 } }
        );
        await Comment.updateMany(
          {
            comment_left: { $gte: rightValue },
            comment_productId: productId,
            isDeleted: false,
          },
          { $inc: { comment_left: 2 } }
        );
      } else {
        //main comment
        const maxRightValue = await Comment.findOne(
          {
            comment_productId: productId,
            isDeleted: false,
          },
          "comment_right",
          {
            sort: { comment_right: -1 },
          }
        );
        if (maxRightValue) {
          rightValue = maxRightValue.comment_right + 1;
        } else {
          rightValue = 1;
        }
      }
      comment.comment_left = rightValue;
      comment.comment_right = rightValue + 1;
      await comment.save();
      return comment;
    } catch (error) {
      throw error;
    }
  }
  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0,
  }) {
    if (parentCommentId) {
      const parents = await Comment.findById(parentCommentId);
      if (!parents) {
        throw new Error("Parent comment not found");
      }
      const comments = await Comment.find({
        comment_productId: productId,
        comment_right: {
          $lte: parents.comment_right,
        },
        comment_left: {
          $gte: parents.comment_left,
        },
        isDeleted: false,
      })
        .select({
          comment_productId: 1,
          comment_right: 1,
          comment_left: 1,
          comment_parentId: 1,
        })
        .sort({ comment_left: 1 })
        .skip(offset)
        .limit(limit);
      return comments;
    }
    const comments = await Comment.find({
      comment_productId: productId,
      isDeleted: false,
    })
      .select({
        comment_productId: 1,
        comment_right: 1,
        comment_left: 1,
        comment_parentId: 1,
      })
      .sort({ comment_left: 1 })
      .skip(offset)
      .limit(limit);
    return comments;
  }
  static async deleteComment({ commentId, productId }) {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }
    //1. xac dinh left va right
    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;
    //2. tinh width
    const width = rightValue - leftValue + 1;
    //3. xoa comment
    await Comment.deleteMany({
      comment_productId: productId,
      comment_left: { $gte: leftValue, $lte: rightValue },
    });
    //4. update cac comment con lai
    await Comment.updateMany(
      {
        comment_right: { $gte: rightValue },
        comment_productId: productId,
        isDeleted: false,
      },
      { $inc: { comment_right: -width } }
    );
    await Comment.updateMany(
      {
        comment_left: { $gte: rightValue },
        comment_productId: productId,
        isDeleted: false,
      },
      { $inc: { comment_left: -width } }
    );
    return true;
  }
}
module.exports = CommentService;
