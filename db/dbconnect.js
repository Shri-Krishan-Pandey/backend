const mongoose = require("mongoose");
const dbConfig = require("../config/dbconfig");

mongoose
  .connect(dbConfig.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));