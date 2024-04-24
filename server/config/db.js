const mongoose = require('mongoose')
const connectDB = async () =>{
    try {
        mongoose.set('strictQuery',false);
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`DataBase Connected: ${connect.connection.host}`);
    } catch (error) {
        console.log("DataBase Not Connected");
    }
}

module.exports = connectDB