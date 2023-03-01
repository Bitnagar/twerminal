/* eslint-disable no-undef */
const { TwitterApi } = require("twitter-api-v2");
require("dotenv").config();

const userClient = new TwitterApi({
  appKey: process.env.API_KEY,
  appSecret: process.env.API_KEY_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

module.exports = {userClient: userClient};