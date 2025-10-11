import mongoose from "mongoose";
import dotenv from "dotenv"


dotenv.config()

export const connectDb = async (req, res) => {
    try {
         const connect = await mongoose.connect(process.env.MONGO_URI)
         if(connect){
            console.log("your database is well connected, happy coding!!!")
         } else{
            console.log("an error occurred wile connecting to the database")
         }
    } catch (error) {
        console.log(error)

    }
   

}