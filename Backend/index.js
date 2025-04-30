const express = require('express');
const app = express();

require('dotenv').config();
require('./Models/db.js')
const TaskRouter = require('./Routes/TaskRouter.js');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 8080



app.get('/',(req,res)=>{
    res.send("Server is running")
})
app.use(cors())
app.use(bodyParser.json())
app.use('/task',TaskRouter)

app.listen(PORT,(req,res)=>{
    console.log(`Server is running on port number ${PORT}`)
})
