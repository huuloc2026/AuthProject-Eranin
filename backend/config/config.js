require("dotenv").config();
const mongoose = require("mongoose");
const dbState = [
  {
    value: 0,
    label: "*****Disconnected",
  },
  {
    value: 1,
    label: "======> Success Connected",
  },
  {
    value: 2,
    label: "Connecting",
  },
  {
    value: 3,
    label: "Disconnecting",
  },
];
//====Function
const connection = async () => {
  const options = {
    dbName: process.env.DB_DATANAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };
  try {
    await mongoose.connect(process.env.DB_HOST, options);

    const state = Number(mongoose.connection.readyState);
    console.log(dbState.find((f) => f.value === state).label, "to db");
  } catch (error) {
    console.log(">>>>Error: ", error);
  }
};
module.exports = connection;
