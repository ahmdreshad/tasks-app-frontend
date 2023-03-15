import { useState, useEffect } from 'react'
import axios from 'axios'
import Task from './Task'
import TaskForm from './TaskForm'
import { toast } from 'react-toastify'
import { URL } from '../App'
import Spinner from '../assets/Spinner'

function TaskList() {
  const [tasks, setTasks] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [taskID, setTaskID] = useState('')
  const [completedTasks, setCompletedTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    completed: false,
  })

  const { name } = formData

  // getting tasks
  const getTasks = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(`${URL}/api/tasks`)
      setIsLoading(false)
      setTasks(data)
    } catch (error) {
      toast.error(error.message)
      setIsLoading(false)
    }
  }

  // for geeting tasks when page reloads
  useEffect(() => {
    getTasks()
  }, [])

  // getting completed tasks
  useEffect(() => {
    const cTask = tasks.filter((task) => {
      return task.completed === true
    })

    setCompletedTasks(cTask)
  }, [tasks])
  // input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // form handler
  const createTask = async (e) => {
    e.preventDefault()
    if (name === '') {
      toast.error('input field can not be empty', {
        autoClose: 2000,
        position: 'top-center',
      })
    }
    try {
      setIsLoading(true)
      await axios.post(`${URL}/api/tasks`, formData)
      toast.success('Added Successfully', {
        autoClose: 1500,
        position: 'top-center',
      })
      setFormData({ ...formData, name: '' })
      setIsLoading(false)
      getTasks()
    } catch (error) {
      toast.error(error.message)
    }
  }

  // delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`)
      toast.success('Successfully Deleted', {
        autoClose: 1500,
        position: 'top-center',
      })
      getTasks()
    } catch (error) {
      toast.error(error)
    }
  }

  // Get single Task to input field
  const getSingleTask = async (task) => {
    setFormData({ name: task.name, completed: false })
    setIsEditing(true)
    setTaskID(task._id)
  }

  // update the task which received through edit button
  const updateTask = async (e) => {
    e.preventDefault()
    if (name === '') {
      return toast.error('Input field can not be empty', {
        autoClose: 1500,
        position: 'top-center',
      })
    }
    try {
      await axios.put(`${URL}/api/tasks/${taskID}`, formData)

      setFormData({ ...formData, name: '' })
      setIsEditing(false)
      getTasks()
      toast.success('Updated Successfully', {
        autoClose: 1500,
        position: 'top-center',
      })
    } catch (error) {
      toast.error(error.message, {
        autoClose: 1500,
        position: 'top-center',
      })
    }
  }

  // set to completed a task
  const setToComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true,
    }
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData)
      getTasks()
      toast.success('Completed', {
        autoClose: 1500,
        position: 'top-center',
      })
    } catch (error) {
      toast.error(error.message, {
        autoClose: 1500,
        position: 'top-center',
      })
    }
  }

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {tasks.length > 0 && (
        <div className="--flex-between --pb">
          <p>
            <b>Total Tasks :</b> {tasks.length}
          </p>
          <p>
            <b>Completed Tasks: </b> {completedTasks.length}
          </p>
        </div>
      )}
      <hr />
      {isLoading && <Spinner />}
      {!isLoading && tasks.length === 0 ? (
        <p className="--py">No Task, Please Add a task</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return (
              <Task
                key={task._id}
                task={task}
                index={index}
                deleteTask={deleteTask}
                getSingleTask={getSingleTask}
                setToComplete={setToComplete}
              />
            )
          })}
        </>
      )}
    </div>
  )
}
export default TaskList
