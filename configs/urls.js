
let googleBooksURL = 'https://www.googleapis.com'

if ('production' == NODE_ENV) {
  googleBooksURL = 'https://www.googleapis.com'
}

module.exports = {
  googleBooks: {
    baseUrl: googleBooksURL,
    endPoints: {
      list: '/books/v1/volumes?q=%s&key=%s' // &startIndex=11&orderBy=newest&maxResults=2'
    }
  }
}