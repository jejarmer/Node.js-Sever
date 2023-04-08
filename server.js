// Core Node Modules
const fs = require("fs");
const path = require("path");
const fsPromises = require("fs").promises;
const http = require("http");
const logEvents = require("./logEvents.js");

const serveFile = async (filePath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(filePath);
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    response.writeHead(200, { "Content-Type": contentType });
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (err) {
    console.log(err);
    if (!response.headersSent) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "text/plain");
      response.end("Internal Server Error");
    }
  }
};

const server = http.createServer((req, res) => {
  logEvents(`Image request: ${req.url}`);
  let contentType;
  const extension = path.extname(req.url);
  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpeg":
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    default:
      contentType = "text/html";
  }

  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
        ? path.join(__dirname, "views", "index.html")
        : contentType === "text/html"
          ? path.join(__dirname, "views", req.url)
          : path.join(__dirname, "images", path.basename(req.url));

  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    serveFile(filePath, contentType, res);
  } else {
    switch (path.parse(filePath).base) {
      case "old-page.html":
        res.writeHead(301, { Location: "/new-page.html" });
        res.end();
        break;
      case " www-page.html":
        res.writeHead(301, { Location: "/" });
        res.end();
        break;
      default:
        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
    }
  }
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});