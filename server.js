const http = require("http");
const { BRAND_NAME, handleRequest } = require("./app");

const PORT = Number(process.env.PORT || 3000);

const server = http.createServer(async (request, response) => {
  await handleRequest(request, response);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`${BRAND_NAME} is running at http://127.0.0.1:${PORT}`);
});
