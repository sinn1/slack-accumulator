
console.log({
  SECRET: process.env.SECRET,
  ANOTHER_SECRET: process.env.ANOTHER_SECRET,
  MONGO_DB: process.env.MONGO_DB,
  MONGO_DB_CONNECTION: process.env.MONGO_DB_CONNECTION,
})

module.exports = {
  env: {
    SECRET: process.env.SECRET,
    MONGO_DB: process.env.MONGO_DB,
    MONGO_DB_CONNECTION: process.env.MONGO_DB_CONNECTION,
  },
}