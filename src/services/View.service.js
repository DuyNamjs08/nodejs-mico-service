const redisClient = require('../config/redis-config');
const { successResponse, errorResponse } = require('../helpers/response');
const addVideo = async (req, res) => {
  try {
    const { videoId } = req.body;
    const addVd = await redisClient.set(`video::${videoId}`, 0);
    console.log(addVd);
    return successResponse(
      res,
      'Add video success',
      {
        id: videoId,
        views: 0,
      },
      200
    );
  } catch (error) {
    console.log(error);
    return errorResponse(res, 'Add video failed', error.message, 500);
  }
};
// đây là hàm để tăng view cho video
// khi có người xem video
// thì sẽ tăng view cho video đó
// và lưu vào redis
const playVideo = async (req, res) => {
  try {
    const { videoId } = req.body;
    const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log('Client IP:', userIp);
    const videoKey = `video::${videoId}`;
    const userKey = `user::${userIp}`;
    const isOk = await redisClient.set(userKey, 'hints', 'NX', 'EX', 100);
    console.log('isOk', isOk);
    if (isOk) {
      await redisClient.incr(videoKey);
    }
    return successResponse(
      res,
      'Play video success',
      {
        id: videoId,
        views: await redisClient.get(videoKey),
      },
      200
    );
  } catch (error) {
    console.log(error);
    return errorResponse(res, 'Play video failed', error, 500);
  }
};
// addVideo(10);
// playVideo(10, 99);

module.exports = {
  addVideo,
  playVideo,
};
