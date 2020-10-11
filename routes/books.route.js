const path = require('path')
const books = require(root_path('/controllers/books.controller'));

module.exports = app => {

  app.route('/v1/books/dump').get(books.dump);
  app.route('/v1/books/list').get(books.list).post(books.list);
  app.route('/v1/books/add').post(books.add);
  app.route('/v1/books/remove').delete(books.remove);
  app.route('/v1/books/update').put(books.update);
};