const { successResponse, errorResponse } = require('../helpers/response');
const { getAllNotifications } = require('../services/Notification.service');
class NotificationController {
  getAllNotifications = async (req, res) => {
    try {
      const { shopId } = req.query;
      const notifications = await getAllNotifications({ shopId });
      return successResponse(
        res,
        'getAllNotifications  successfully',
        notifications
      );
    } catch (error) {
      return errorResponse(res, 'Failed to getAllNotifications', error);
    }
  };
}
module.exports = new NotificationController();
