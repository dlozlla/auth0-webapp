const {
  checkUrl,
  ISSUER_BASE_URL, // Auth0 Tenant Url
  AUDIENCE, 
  API_PORT,
  API_URL, // URL for Expenses API
  REQUIRED_SCOPES,
} = require("./env-config");

const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { auth , requiredScopes,  } = require("express-oauth2-jwt-bearer");
const morgan = require("morgan");
const logger = require("./winston");

const app = express();

// Used to normalize URL
app.use(checkUrl());

app.use(morgan('":method :url :status :res[content-length] - :response-time ms"', { stream: logger.stream }));
app.use(cors());

const expenses = [
  {
    date: new Date(),
    description: "Pizza for a Coding Dojo session.",
    value: 102,
  },
  {
    date: new Date(),
    description: "Coffee for a Coding Dojo session.",
    value: 42,
  },
];

/****************************
 * This method is here to allow a
 * successful response on root requests.
 * This stops content security policy
 * from preventing the user to make
 * requests via the browsers console.
 ****************************/
app.get("/", (req, res) => {
  res.status(200).end("OK");
});
/****************************/

app.get("/total", (req, res) => {
  const total = expenses.reduce((accum, expense) => accum + expense.value, 0);
  res.send({ total, count: expenses.length });
});

// 👆 public routes above 👆
// Issuer and Audience can be obtained from env vars, but better make it explicit
app.use(auth({
  issuerBaseURL: ISSUER_BASE_URL,
  audience: AUDIENCE
}));
// 👇 private routes below 👇

app.get("/reports", requiredScopes(REQUIRED_SCOPES), (req, res) => {
  logger.info(`Valid token with scopes ${REQUIRED_SCOPES}`);
  res.send(expenses);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status,
    message: err.message,
  });
});

createServer(app).listen(API_PORT, () => {
  logger.info(`API server listening at: ${API_URL}`);
});
