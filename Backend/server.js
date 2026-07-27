const dns = require('dns') 
dns.setServers(["1.1.1.1","8.8.8.8"])
const PORT = process.env.PORT || 3000;


require("dotenv").config();
const app = require('./src/app')
const connectDB = require('./src/config/database')
require("./src/config/redis");
const resume = "I am a MERN developer";
const selfDescription = "3rd year CSE student";
const jobDescription = "Looking for React developer";


connectDB();

app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`);
})


