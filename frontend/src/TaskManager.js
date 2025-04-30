import React, {useEffect, useState} from 'react';
import {FaCheck, FaPlus, FaSearch,FaPencilAlt, FaTrash} from 'react-icons/fa';
import {ToastContainer} from 'react-toastify'
import { CreateTask, DeleteTaskById, GetAllTasks, UpdateTaskById } from './api';
import { notify } from './utils';
function TaskManager() {
    const [input ,setInput] = useState('');
    const [tasks, setTasks] = useState([]);
    const [copyTasks, setCopyTasks] = useState([]);
    const [updateTask,setUpdateTask] = useState(null);
    const handleTask=()=>{
        if(updateTask && input){
            const obj = {
                taskName:input,
                isDone:updateTask.isDone,
                _id : updateTask._id
            }
          handleUpdateItem(obj);
        }
        else if(updateTask ===null &&input){
            handleAddTask();
        }
        setInput('')
    }
    useEffect(()=>{
        if(updateTask){
            setInput(updateTask.taskName)
        }
    },[updateTask])
    const handleAddTask = async()=>{
        const obj = {
            taskName:input,
            isDone : false
        }
        try{
            const {success, message} = await CreateTask(obj);
            if(success){
               notify(message,'success')
            }else{
               notify(message,'error')
            }
            setInput('')
            fetchAllTasks();
        }catch(err){
            notify('Failed to create task','error')
        }
      
    }
const fetchAllTasks = async () => {
  try {
    const response = await GetAllTasks();
    
    // Ensure the data exists and is an array
    if (response && Array.isArray(response.data)) {
      setTasks(response.data);
      setCopyTasks(response.data);
    } else {
      notify("Failed to load tasks", "error");
      setTasks([]); // Prevents map() error
    }
  } catch (err) {
    notify("Failed to load tasks", "error");
    setTasks([]); // Prevents map() error on fetch failure
  }
};



const handleDeleteTask=async(id)=>{
    try{
        const{success,message}=
        await DeleteTaskById(id);
        if(success){
            notify(message,'success')
         }else{
            notify(message,'error')
         }
         fetchAllTasks();
    }catch(err){
        notify("Failed to Load All Task!")
    }
}

const handleCheckAndUncheck =async(item)=>{
   const {_id,isDone,taskName} = item;
   const obj = {
    taskName,
    isDone:!isDone
   }
   try{
    const{success,message}=
    await UpdateTaskById(_id,obj);
    if(success){
        notify(message,'success')
     }else{
        notify(message,'error')
     }
     fetchAllTasks();
}catch(err){
    notify("Failed to Load All Task!")
}
}


const handleUpdateItem=async(item)=>{
    const {_id,isDone,taskName} = item;
    const obj = {
     taskName,
     isDone:isDone
    }
    try{
     const{success,message}=
     await UpdateTaskById(_id,obj);
     if(success){
         notify(message,'success')
      }else{
         notify(message,'error')
      }
      fetchAllTasks();
 }catch(err){
     notify("Failed to Load All Task!")
 }
}


const handleSearch=(e)=>{
    const term = e.target.value.toLowerCase();
    const oldTasks = [...copyTasks];
    const results = oldTasks.filter((item)=>item.taskName.toLowerCase().includes(term));
    setTasks(results)
}

  return (
    <div className='d- flex flex-column align-items-center w-50 m-auto mt-5'>
     <h1 className='mb-4'>Task Manager</h1>
     <div className='d-flex justify-content-between align-items-center mb-4 w-100'>
     <div className='input-group flex-grow-1 me-2'>
        <input type='text'
               value ={input}
               onChange={
                (e)=>{
                    setInput(e.target.value)
                }
               }
               className='form-control me-1'
               placeholder='Add new task'/>
        <button  className='btn btn-success btn-sm me-2' onClick={handleTask}>
            <FaPlus className='m-2'/>
        </button>
     </div>
     <div className='input-group flex-grow-1'>

        <input onChange={handleSearch} className='form-control ' type='text' placeholder='Serch Tasks'/>
        <span className='input-group-text'>
            <FaSearch/>
        </span>
     </div>
    </div>
    <div className='d-flex flex-column w-100'>
        {
         {Array.isArray(tasks) && tasks.map((item) => (
            <div key={item._id} className='m-2 p-2 border bg-light w-100 rounded-3 d-flex justify-content-between align-items-center'>
            <span className={item.isDone ? 'text-decoration-line-through':''}>{item.taskName}</span>
 
            <div className=''>
             <button onClick={()=>handleCheckAndUncheck(item)} className='btn btn-success btn-sm me-2' type='button'><FaCheck/></button>
             <button onClick={()=>setUpdateTask(item)} className='btn btn-primary btn-sm me-2 ' type='button'><FaPencilAlt/></button>
            
             <button  onClick={()=>handleDeleteTask(item._id)}  className='btn btn-danger btn-sm me-2' type='button'><FaTrash/></button>
            </div>
         </div>
          ))
        }
    </div>
    <ToastContainer position='top-right' autoClose ={3000} hideProgressBar={false}/>
    </div>
  )
}

export default TaskManager
