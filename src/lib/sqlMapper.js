
const getKeys = (data = {}) => {
  return Object.keys(data).toString()
}
const getValues = (data = {}) => {
  return Object.values(data).map(x => typeof x === 'string' ? `'${x}'` : x).join(', ')
}

const createInsertQuery = ({table, data}) => {

  return `INSERT INTO ${table} (${getKeys(data)}) VALUES (${getValues(data)});`
}

module.exports = {
  createInsertQuery
}