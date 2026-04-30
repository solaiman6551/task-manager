import { useDispatch } from 'react-redux'
import { removeTask, editTask } from './tasksSlice'

const statusColors = {
  todo: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
}

const priorityColors = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}

const TaskCard = ({ task }) => {
  const dispatch = useDispatch()

  const handleStatusChange = (e) => {
    dispatch(editTask({ id: task.id, updates: { status: e.target.value } }))
  }

  const handleDelete = () => {
    if (window.confirm('Delete this task?')) {
      dispatch(removeTask(task.id))
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-gray-800 text-base">{task.title}</h3>
        <button
          onClick={handleDelete}
          className="text-red-400 hover:text-red-600 text-sm ml-2"
        >
          Delete
        </button>
      </div>
      {task.description && (
        <p className="text-gray-500 text-sm">{task.description}</p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
        {task.due_date && (
          <span className="text-xs text-gray-400">Due: {task.due_date}</span>
        )}
      </div>
      <select
        value={task.status}
        onChange={handleStatusChange}
        className="text-sm border border-gray-200 rounded-lg px-2 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  )
}

export default TaskCard