
const { isObject, _, isValidObjectId, ObjectId } = require(root_path(`/utils`))
const { SuccessResponse, ErrorResponse } = require(root_path(`/utils/response`))
const { getBooksVolumeFromDB, getBooksVolumeFromApi, addNewBook } = require(root_path('/services/books.service'))

exports.dump = async (req, res) => {
  try {
    let {
      query,
      skip,
      orderBy,
      count
    } = req.query
    let result = await getBooksVolumeFromApi(query, skip, orderBy, count)
    if (isObject(result) && _.has(result, 'totalItems') && result.totalItems) {
      const items = _.get(result, 'items')
      let allBooks = []
      if (Array.isArray(items) && items.length) {
        let bulkBooks = []
        for (let eachItem of items) {
          const {
            title,
            authors,
            publisher,
            publishedDate,
            description,
            pageCount,
            language
          } = eachItem.volumeInfo
          bulkBooks.push({
            title,
            authors,
            publisher,
            publishedDate,
            description,
            pageCount: isNaN(pageCount) ? 0 : +pageCount,
            language
          })
          if (bulkBooks.length == 100) {
            allBooks = [...allBooks, ...bulkBooks]
            // await addNewBook(bulkBooks)
            bulkBooks = []
          }
        }
        if (bulkBooks.length) {
          allBooks = [...allBooks, ...bulkBooks]
          // await addNewBook(bulkBooks)
          bulkBooks = []
        }
      }
      return SuccessResponse(res, 'success', result, 'list')
    }
    else
      return SuccessResponse(res, 'success', [], 'noData')
  }
  catch (ex) {
    return ErrorResponse(res, 'badRequest', 'wrong', ex.message)
  }
}
exports.list = async (req, res) => {
  const params = (req.method == 'POST') ? req.body : req.query
  const skip = req.query.skip ? parseInt(req.query.skip) : 0
  let limit = req.query.limit ? parseInt(req.query.limit) : 10
  if (limit > 100)
    limit = 100
  let sortBy = { createdAt: -1 }
  if (_.has(req.query, 'sortBy')) {
    if (_.has(req.query, 'sortMethod') && 'desc' == req.query.sortMethod.toLowerCase())
      sortBy[_.get(req.query, 'sortBy')] = -1
    else
      sortBy[_.get(req.query, 'sortBy')] = 1
  }
  let matchQuery = {}
  if (_.has(params, 'id')) {
    if (Array.isArray(_.get(params, 'id'))) {
      if (_.get(params, 'id').length) {
        let allIds = []
        for (let eachId of _.get(params, 'id')) {
          if (!isValidObjectId(eachId))
            return ErrorResponse(res, 'badRequest', 'objectId', eachId)
          else
            allIds.push(eachId)
        }
        _.extend(matchQuery, { _id: { $in: allIds } })
      }
      else
        return ErrorResponse(res, 'badRequest', 'empty', _.get(params, 'id'))
    }
    else {
      if (isValidObjectId(_.get(params, 'id')))
        _.extend(matchQuery, { _id: ObjectId(_.get(params, 'id')) })
      else
        return ErrorResponse(res, 'badRequest', 'objectId', _.get(params, 'id'))
    }
  }
  if (_.has(params, 'title')) {
    let pattern = '(' + _.get(params, 'title') + ')(.*)'
    _.extend(matchQuery, { title: new RegExp(pattern, 'i') })
  }
  if (_.has(params, 'publisher')) {
    let pattern = '(' + _.get(params, 'publisher') + ')(.*)'
    _.extend(matchQuery, { publisher: new RegExp(pattern, 'i') })
  }
  if (_.has(params, 'publishedDate'))
    _.extend(matchQuery, { publishedDate: _.get(params, 'publishedDate') })
  if (_.has(params, 'pageCount'))
    _.extend(matchQuery, { pageCount: _.get(params, 'pageCount') })
  if (_.has(params, 'language'))
    _.extend(matchQuery, { language: _.get(params, 'language') })

  let project = { isDeleted: 0, __v: 0 }
  try {
    let { count, result } = await getBooksVolumeFromDB(matchQuery, project, sortBy, skip, limit)
    if (count)
      return SuccessResponse(res, 'success', { count, result }, 'list')
    else
      return SuccessResponse(res, 'success', [], 'noData')
  }
  catch (ex) {
    return ErrorResponse(res, 'badRequest', 'wrong', ex.message)
  }
}
exports.add = (req, res) => {
  return SuccessResponse(res, 'success', [], 'add')
}
exports.remove = (req, res) => {
  return SuccessResponse(res, 'success', [], 'remove')
}
exports.update = (req, res) => {
  return SuccessResponse(res, 'success', [], 'update')
}