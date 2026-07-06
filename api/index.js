const { handleRequest } = require("../app");

module.exports = async (request, response) => {
  await handleRequest(request, response);
};
