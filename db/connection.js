import mongoose from "mongoose";

//db connection
const connectDB = async() => {
  mongoose
    .connect(process.env.DB_CONNECTION)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(`Cannot connect to DB, err:${err}`));
};
export default connectDB;