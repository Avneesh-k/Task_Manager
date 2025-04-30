const TaskModel = require("../Models/TaskModel.js");

const createTask = async(req,res)=>{
    const data = req.body;
    try{
        const model = new TaskModel(data);
        await model.save();
        res.status(201)
            .json({message:'Task is created',success:true})
    }
    catch(err){
        console.log("Error creating task:", err.message); // 👈 log the error
        res.status(500).json({message:'Failed to create task',success:false})
    }
}

const fetchAllTasks = async(req,res)=>{
    try{
        const data = await TaskModel.find({});
        res.status(200)
            .json({message:'All Tasks',success:true,data})
    }
    catch(err){
        console.log("Error load task:", err.message); // 👈 log the error
        res.status(500).json({message:'Failed to load task',success:false})
    }
}


const updateTask = async(req,res)=>{
    try{
        const id = req.params.id;
        const body = req.body;
        const obj = {$set:{...body}};
        await TaskModel.findByIdAndUpdate(id,obj);
        res.status(200)
            .json({message:'update Tasks',success:true})
    }
    catch(err){
        console.log("Error creating task:", err.message); // 👈 log the error
        res.status(500).json({message:'Failed to update task',success:false})
    }
}

const deleteTask = async(req,res)=>{
    try{
        const id = req.params.id;
        await TaskModel.findByIdAndDelete(id);
        res.status(200)
            .json({message:'Delete Tasks',success:true})
    }
    catch(err){
        console.log("Error creating task:", err.message); // 👈 log the error
        res.status(500).json({message:'Failed to delete task',success:false})
    }
}

module.exports = {
    createTask,
    fetchAllTasks,
    updateTask,
    deleteTask
}
