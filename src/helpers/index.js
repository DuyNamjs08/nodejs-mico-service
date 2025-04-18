function prepareForEs(mongoDoc) {
  const { _id, __v, ...rest } = mongoDoc;
  return rest;
}
function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
const paginate = (page = 1, pageSize = 1000) => {
  const offset = (page - 1) * pageSize;
  return { skip: offset, take: pageSize };
};
module.exports = {
  prepareForEs,
  getRandomElement,
  paginate,
};
