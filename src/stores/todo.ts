import { defineStore } from 'pinia'
import type { Todo } from '@/types/todo'
import { store, get, clear } from '@/utils/localstorage'

interface TodoState {
  todos: Todo[]
  todosClone: Todo[]
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: get({ key: 'todos' }) as Todo[],
    todosClone: [] as Todo[]
  }),
  actions: {
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
    },

    // delete item from todos
    deleteTodo(this: TodoState, id: number) {
      const filteredTodos = this.todosClone.filter((todo) => todo.id !== id)

      const updatedTodos = filteredTodos.map((todo, index) => ({
        ...todo,
        id: index + 1
      }))

      store({ key: 'todos', value: updatedTodos })
      this.todos = [...updatedTodos]
      this.todosClone = [...this.todos]
    },

    markAllTodosAsCompleted(this: TodoState) {
      this.todosClone = this.todos

      const updatedTodos = this.todosClone.map((todo) => ({
        ...todo,
        completed: !todo.completed
      }))
      store({ key: 'todos', value: updatedTodos })
      this.todos = [...updatedTodos]
      this.todosClone = [...this.todos]
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
    },

    displayAllTodos(this: TodoState) {
      this.todosClone = this.todos
      return [...this.todosClone]
    },

    displayCompletedTodos(this: TodoState) {
      this.todosClone = this.todos
      return this.todosClone.filter((todo) => todo.completed)
    },
    displayActiveTodos(this: TodoState) {
      return this.todosClone.filter((todo) => !todo.completed)
    },

    clearTodos(this: TodoState) {
      clear()
      this.todos = []
      this.todosClone = []
    }
  }
})
