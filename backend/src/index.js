import "dotenv/config.js";
import connectDB from "./db/index.js";
import app from "./App.js";

const port = process.env.PORT || 6000;


connectDB()
.then(() => {
   app.listen(port , () => {
      console.log(`Server is running on port ${port}`);
   })
})
.catch((error) => {
   console.log("MongoDB connection fail !!", error);
   process.exit(1);
})