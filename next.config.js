
console.log({
  MONGO_DB: process.env.MONGO_DB,
  MONGO_DB_CONNECTION: process.env.MONGO_DB_CONNECTION,
})

module.exports = {
  env: {
    MONGO_DB: process.env.MONGO_DB,
    MONGO_DB_CONNECTION: process.env.MONGO_DB_CONNECTION,
  },
}