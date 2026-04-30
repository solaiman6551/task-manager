import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTasks } from './tasksSlice'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'

const TaskList = () => {
  const dispatch = useDispatch()
  const { items: tasks, loading } = useSelector((state) => state.tasks)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  const todo = tasks.filter(t => t.status === 'todo')
  const inProgress = tasks.filter(t => t.status === 'in_progress')
  const done = tasks.filter(t => t.status === 'done')

  const Column = ({ title, tasks, color }) => (
    <div className="flex-1 min-w-0">
      <div className={`flex items-center gap-2 mb-3`}>
        <span className={`w-3 h-3 rounded-full ${color}`}></span>
        <h2 className="font-semibold text-gray-700">{title}</h2>
        <span className="text-xs text-gray-400 ml-1">({tasks.length})</span>
      </div>
      <div className="flex flex-col gap-3">
        {tasks.map(task => <TaskCard key={task.id} task={task} />)}
        {tasks.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
            No tasks
          </p>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Task
        </button>
      </div>
      {loading ? (
        <p className="text-gray-500">Loading tasks...</p>
      ) : (
        <div className="flex gap-6">
          <Column title="Todo" tasks={todo} color="bg-gray-400" />
          <Column title="In Progress" tasks={inProgress} color="bg-blue-400" />
          <Column title="Done" tasks={done} color="bg-green-400" />
        </div>
      )}
      {showForm && <TaskForm onClose={() => setShowForm(false)} />}
    </div>
  )
}

export default TaskList