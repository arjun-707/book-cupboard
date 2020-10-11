const { makeGetRequestSync, isObject, urlFormat } = require(root_path('/utils'))
const urls = require(root_path('/configs/urls'))
const { googleBook: { apiKey: GoogleApiKey } } = require(root_path(`/configs/${NODE_ENV}/config`))
const { Books } = require(root_path('/models'))

exports.getBooksVolumeFromApi = async (searchQuery = '', startIndex = 0, orderBy = 'newest', maxResults = 10) => {
  print('getBooksVolumeFromApi       ==> ')
  try {
    searchQuery = searchQuery.trim().replace(/ /g, '+')
    let url = urlFormat(`${urls.googleBooks.baseUrl}${urls.googleBooks.endPoints.list}`, searchQuery, GoogleApiKey)
    if (startIndex)
      url += `&startIndex=${startIndex}`
    if (orderBy)
      url += `&orderBy=${orderBy}`
    if (maxResults)
      url += `&maxResults=${maxResults}`
    return await makeGetRequestSync(url)
  }
  catch (ex) {
    throw ex
  }
}
exports.getBooksVolumeFromDB = async (searchQuery = {}, project = {}, sort = {}, skip = 0, limit = 10) => {
  print('getBooksVolumeFromDB       ==> ')
  try {
    const count = await Books.count(searchQuery)
    if (count) {
      return {
        count,
        result: await Books.find(searchQuery, project).sort(sort).skip(skip).limit(limit).lean().exec()
      }
    }
    else
      return { count: 0, result: [] }
  }
  catch (ex) {
    throw ex
  }
}
exports.addNewBook = async (saveData) => {
  print('addNewBook       ==> ')
  if (Array.isArray(saveData)) {
    print('addNewBook insertMany      ==> ')
    if (saveData.length) {
      try {
        return await Books.insertMany(saveData)
      }
      catch (ex) {
        throw ex
      }
    }
    else
      throw 'saveData is an empty array'
  }
  else {
    print('addNewBook save      ==> ')
    try {
      const newBook = await new Books(saveData)
      return await newBook.save()
    }
    catch (ex) {
      throw ex
    }
  }
}