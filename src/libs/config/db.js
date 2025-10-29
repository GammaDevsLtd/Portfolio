import mongoose from "mongoose" ;

const connection = {};


export const connectMongoDB = async () => {
    if(connection.isConnected){
        console.log("Using Existing Connection");
        return;
      }

    try{
      const db = await mongoose.connect(process.env.MONGODB_URI);
      connection.isConnected = db.connections[0].readyState;
        console.log("DB Connected")
    } catch (error){
        console.log("Error connecting to DB" , error)
        throw new Error("Error connecting to database");
    }
}