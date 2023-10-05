import { defineStore } from 'pinia'
import type { Todo } from '@/types/todo'
import { store, get } from '@/utils/localstorage'

interface TodoState {
  todos: Todo[]
  todosClone: Todo[]
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [] as Todo[],
    todosClone: [] as Todo[]
  }),
  getters: {
    // displayCompletedTodos: (state) => {
    //   const completedTodos = state.todos.filter((todo) => todo.completed)
    //   state.todos = completedTodos
    //   return state.todos
    // },
  },
  actions: {
    initializeStore(this: TodoState) {
      const storedTodos = get({ key: 'todos' })
      if (storedTodos) {
        this.todos = [...storedTodos]
        this.todosClone = [...storedTodos]
      }
      return this.todos
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

    // toggle completed status of todo item
    markAsCompleted(this: TodoState, id: number) {
      const updatedTodos = this.todosClone.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed
          }
        }
        return todo
      })
      store({ key: 'todos', value: updatedTodos })
      this.todos = [...updatedTodos]
      this.todosClone = [...this.todos]
    },

    displayAllTodos(this: TodoState) {
      console.log(this.todos)
      return this.todos
    },

    displayCompletedTodos(this: TodoState) {
      return this.todosClone.filter((todo) => todo.completed)
    }
  }
})
