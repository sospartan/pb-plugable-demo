import { useState, useEffect } from 'react'
import PocketBase from 'pocketbase'
import './App.css'

// Initialize PocketBase client
const pb = new PocketBase('/')

interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  created: string
  updated: string
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch todos from PocketBase
  const fetchTodos = async () => {
    try {
      setLoading(true)
      const records = await pb.collection('todos').getFullList<Todo>({
        sort: '-created',
      })
      setTodos(records)
      setError(null)
    } catch (err) {
      console.error('Error fetching todos:', err)
      setError('Failed to fetch todos')
    } finally {
      setLoading(false)
    }
  }

  // Create a new todo
  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.title.trim()) return

    try {
      const record = await pb.collection('todos').create<Todo>({
        title: newTodo.title,
        description: newTodo.description,
        completed: false,
      })
      setTodos([record, ...todos])
      setNewTodo({ title: '', description: '' })
      setError(null)
    } catch (err) {
      console.error('Error creating todo:', err)
      setError('Failed to create todo')
    }
  }

  // Toggle todo completion
  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const record = await pb.collection('todos').update<Todo>(id, {
        completed: !completed,
      })
      setTodos(todos.map(todo => 
        todo.id === id ? record : todo
      ))
      setError(null)
    } catch (err) {
      console.error('Error updating todo:', err)
      setError('Failed to update todo')
    }
  }

  // Delete a todo
  const deleteTodo = async (id: string) => {
    try {
      await pb.collection('todos').delete(id)
      setTodos(todos.filter(todo => todo.id !== id))
      setError(null)
    } catch (err) {
      console.error('Error deleting todo:', err)
      setError('Failed to delete todo')
    }
  }

  // Load todos on component mount
  useEffect(() => {
    fetchTodos()
  }, [])

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading todos...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo App</h1>
        <p>Powered by PocketBase</p>
      </header>

      {error && (
        <div className="error">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <form onSubmit={createTodo} className="todo-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Todo title..."
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            className="todo-input"
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Description (optional)..."
            value={newTodo.description}
            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
            className="todo-textarea"
            rows={3}
          />
        </div>
        <button type="submit" className="add-button">
          Add Todo
        </button>
      </form>

      <div className="todos-container">
        <div className="todos-stats">
          <span>Total: {todos.length}</span>
          <span>Completed: {todos.filter(t => t.completed).length}</span>
          <span>Pending: {todos.filter(t => !t.completed).length}</span>
        </div>

        {todos.length === 0 ? (
          <div className="empty-state">
            <p>No todos yet. Create your first todo above!</p>
          </div>
        ) : (
          <div className="todos-list">
            {todos.map((todo) => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-content">
                  <div className="todo-header">
                    <h3 className="todo-title">{todo.title}</h3>
                    <div className="todo-actions">
                      <button
                        onClick={() => toggleTodo(todo.id, todo.completed)}
                        className={`toggle-button ${todo.completed ? 'completed' : ''}`}
                        title={todo.completed ? 'Mark as pending' : 'Mark as completed'}
                      >
                        {todo.completed ? '✓' : '○'}
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="delete-button"
                        title="Delete todo"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  {todo.description && (
                    <p className="todo-description">{todo.description}</p>
                  )}
                  <div className="todo-meta">
                    <small>Created: {new Date(todo.created).toLocaleString()}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="app-footer">
        <button onClick={fetchTodos} className="refresh-button">
          Refresh
        </button>
      </footer>
    </div>
  )
}

export default App
