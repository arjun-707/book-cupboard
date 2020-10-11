require('./configs/globals')

const express = require('express');
const { initMiddleware, finalMiddleware } = require(root_path('/middleware/app.middleware'))
const { connectMongo } = require(root_path('/lib/mongo'))
const { initRoutes } = require(root_path('/routes'))
const app = express()

const startApp = async () => {
  await connectMongo().catch(exit_app)
  initMiddleware(app)
  initRoutes(app)
  finalMiddleware(app)
}
startApp()