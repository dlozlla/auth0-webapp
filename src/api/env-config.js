require("dotenv").config();
const {
  ISSUER_BASE_URL,
  AUDIENCE,
  API_PORT,
  API_URL,
} = process.env;

function checkUrl() {
  return (req, res, next) => {
    let host = req.headers.host;
    if (!API_URL.includes(host)) {
      return res.status(301).redirect(API_URL);
    }
    return next();
  };
}

function removeTrailingSlashFromUrl(url) {
  if (!url || !url.endsWith("/")) return url;

  return url.substring(0, url.length - 1);
}

console.log("\n----------------------------------");
console.log("Environment Settings:");
console.log(`ISSUER_BASE_URL: ${ISSUER_BASE_URL}`);
console.log(`AUDIENCE: ${AUDIENCE}`);
console.log(`API_URL: ${API_URL}`);

console.log("----------------------------------\n");

module.exports = {
  checkUrl,
  ISSUER_BASE_URL: removeTrailingSlashFromUrl(ISSUER_BASE_URL),
  AUDIENCE: AUDIENCE,
  API_PORT: API_PORT,
  API_URL: removeTrailingSlashFromUrl(API_URL),
};
