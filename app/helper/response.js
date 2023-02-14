const send = (res, data) => {
  return res.send(data);
};
const error = (res, message) => {
  return res.send({
    success: false,
    data: [],
    message
  });
};

module.exports = {
  send,
  error
};
