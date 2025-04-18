const NotiModel = require('../models/Notification.model');

const createNotification = async (data) => {
  const {
    noti_type,
    noti_senderId = 1,
    noti_receivedId = 1,
    noti_options = {},
  } = data;
  let noti_content = '';
  if (noti_type === 'ORDER−001') {
    noti_content = 'Order successfully';
  } else if (noti_type === 'ORDER−002') {
    noti_content = 'Order failed';
  } else if (noti_type === 'PROMOTION−001') {
    noti_content = '@@@ vừa thêm 1 voucher: @@@@@';
  } else if (noti_type === 'SHOP−001') {
    noti_content = '@@@ vừa thêm 1 sản phẩm: @@@@';
  } else {
    noti_content = 'Notification';
  }
  const notification = await NotiModel.create({
    noti_type,
    noti_senderId,
    noti_receivedId,
    noti_options,
    noti_content,
  });
  return notification.save();
};
const getAllNotifications = async ({
  userId = 1,
  type = 'ALL',
  isRead = 0,
}) => {
  const match = {
    noti_receivedId: userId,
  };
  console.log(match);
  if (type !== 'ALL') {
    match.noti_type = type;
  }

  return NotiModel.aggregate([
    {
      $match: match,
    },
    {
      $lookup: {
        from: 'Product',
        localField: 'noti_options.productId',
        foreignField: '_id',
        as: 'product',
      },
    },
    {
      $unwind: {
        path: '$product',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        finalContent: {
          $replaceOne: {
            input: {
              $replaceOne: {
                input: '$noti_content',
                find: '@@@@',
                replacement: '$product.name',
              },
            },
            find: '@@@',
            replacement: 'Shop babe',
          },
        },
      },
    },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_receivedId: 1,
        noti_content: '$finalContent',
        noti_options: 1,
        createdAt: 1,
      },
    },
  ]);
};
module.exports = {
  createNotification,
  getAllNotifications,
};
