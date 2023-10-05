import { defineStore } from 'pinia'
import type { Todo } from '@/types/todo'
import { store, get } from '@/utils/localstorage'

interface TodoState {
  todos: Todo[]
  todosClone: Todo[]
  showDeleteButton: { [key: number]: boolean }
  todoLength: number
  storeTodoLength: () => void
}

export const useTodoStore = defineStore('todo', {
  state: () => {
    const initialTodos = get({ key: 'todos' }) as Todo[]
    return {
      todos: initialTodos,
      todosClone: initialTodos.slice(), // Create a shallow copy
      showDeleteButton: {} as { [key: number]: boolean },
      todoLength: initialTodos.length // Initialize todoLength
    }
  },
  actions: {
    storeTodoLength(this: TodoState) {
      localStorage.setItem('todoLength', this.todoLength.toString())
    },
    getTodoLength(this: TodoState) {
      const todoNumber = localStorage.getItem('todoLength')
      if (todoNumber) {
        return (this.todoLength = parseInt(todoNumber))
      }
    },
    updateShowDeleteButton(index: number, value: boolean) {
      this.showDeleteButton[index] = value
    },
    // add item to todos
    addTodo(this: TodoState, text: string) {
      const newTodo: Todo = {
        id: this.todos.length + 1,
        text,
        completed: false
      }
      store({ key: 'todos', value: [...this.todos, newTodo] })
      this.todos = [...this.todos, newTodo]
      this.todosClone = [...this.todos]
      this.todoLength++
      this.storeTodoLength()
    },

    // delete item from todos
    deleteTodo(this: TodoState, id: number) {
      this.todosClone = this.todos
      const filteredTodos = this.todosClone.filter((todo) => todo.id !== id)

      const updatedTodos = filteredTodos.map((todo, index) => ({
        ...todo,
        id: index + 1
      }))

      store({ key: 'todos', value: updatedTodos })
      this.todos = [...updatedTodos]
      this.todosClone = [...this.todos]
      this.todoLength--
      this.storeTodoLength()
    },

    markAllTodosAsCompleted(this: TodoState) {
      this.todosClone = this.todos

      const completedCount = this.todosClone.filter((todo) => todo.completed).length
      const allCompleted = completedCount === this.todosClone.length

      const updatedTodos = this.todosClone.map((todo) => ({
        ...todo,
        completed: !allCompleted
      }))

      store({ key: 'todos', value: updatedTodos })
      this.todos = [...updatedTodos]
      this.todosClone = [...this.todos]
      const checkAllCompleted = this.todos.every((todo) => todo.completed)

      if (checkAllCompleted) {
        this.todoLength = 0
      } else {
        this.todoLength = this.todos.length
      }
      this.storeTodoLength()
    },

    // toggle completed status of todo item
    markAsCompleted(this: TodoState, id: number) {
      this.todosClone = this.todos
      const updatedTodos = this.todosClone.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed
          }
        }
        return todo
      })
      this.todos = [...updatedTodos]
      store({ key: 'todos', value: updatedTodos })
      const completedTodos = updatedTodos.filter((todo) => !todo.completed)
      const numCompletedTodos = completedTodos.length
      this.todoLength = numCompletedTodos
      this.storeTodoLength()
    },

    displayAllTodos(this: TodoState) {
      localStorage.setItem('currentFilter', 'all')
      return this.todos
    },

    displayCompletedTodos(this: TodoState) {
      localStorage.setItem('currentFilter', 'completed')
      const completedTodos = this.todos.filter((todo) => todo.completed)
      this.todosClone = completedTodos
      store({ key: 'completedTodos', value: completedTodos })
    },
    displayActiveTodos(this: TodoState) {
      localStorage.setItem('currentFilter', 'active')
      const activeTodos = this.todos.filter((todo) => !todo.completed)
      this.todosClone = activeTodos
      store({ key: 'activeTodos', value: activeTodos })
    },

    clearTodos(this: TodoState) {
      this.todosClone = this.todos
      const updatedTodos = this.todosClone.filter((todo) => !todo.completed)

      const reindexedTodos = updatedTodos.map((todo, index) => ({
        ...todo,
        id: index + 1
      }))

      store({ key: 'todos', value: reindexedTodos })
      this.todos = [...reindexedTodos]
      this.todosClone = [...reindexedTodos]
    }
  }
})
