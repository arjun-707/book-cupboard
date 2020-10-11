module.exports = {
  googleBook: {
    apiKey: 'AIzaSyCMBuLeRVqeRmnEeERRqxGSvNaz8xjPh-8',
    clientId: '628324260473-pg24qe3smkm1n8dtmb2djov8o6afne0d.apps.googleusercontent.com',
    clientSecret: 'rpAp5Ns1i-q5IBoseDk1bdj1'
  },
  dbConfig: {
    mongo: {
      mongoURL: MONGO_URI || 'mongodb://localhost:27017/auth',
      mongoOptions: {
        useNewUrlParser: true,
        // autoReconnect: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }
    }
  }
}