
import { FaEdit, FaTrashAlt, FaCheckCircle } from 'react-icons/fa'

function Task({ index, task, deleteTask, getSingleTask, setToComplete }) {
  return (
    <div className={task.completed ? 'task completed' : 'task'}>
      <p>
        <b>{index + 1}. </b>
        {task.name}
      </p>
      <div className="task-icons">
        <FaCheckCircle color={task.completed ? 'gray' : 'green'} onClick={() => setToComplete(task)} />
        <FaEdit onClick={() => getSingleTask(task)} />
        <FaTrashAlt color="red" onClick={() => deleteTask(task._id)} />
      </div>
    </div>
  )
}
export default Task
