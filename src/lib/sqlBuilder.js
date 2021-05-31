/**
 * stupid primitive builder, nothing fancy
 */

const normalizeValue = (x) => (typeof x === 'string' ? `'${x}'` : x)

const createInsertQuery = ({table, data}) => {
  const getKeys = (data = {}) => {
    return Object.keys(data).toString()
  }
  const getValues = (data = {}) => {
    return Object.values(data)
      .map((x) => normalizeValue(x))
      .join(', ')
  }

  return `INSERT INTO ${table} (${getKeys(data)}) VALUES (${getValues(data)});`
}

const createUpdateQuery = ({table, data, conditions}) => {
  const mapData = (data, joinWith = ',') =>
    Object.entries(data)
      .map((kv) => `${kv[0]} = ${normalizeValue(kv[1])}`)
      .join(` ${joinWith} `)

  return `UPDATE ${table} AS t SET ${mapData(data)} WHERE ${mapData(conditions, 'AND')}`
}

module.exports = {
  createInsertQuery,
  createUpdateQuery,
}
