import { describe, it, expect, vi } from 'vitest'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import { mount } from '@vue/test-utils'
import TodoViewVue from '@/views/TodoView.vue'
import { useTodoStore } from '@/stores/todo'

// Create a Pinia instance
const pinia = createPinia()

// Create a Vue app and use PiniaVuePlugin
const app = createApp(TodoViewVue)
app.use(pinia)

const store = useTodoStore()
const wrapper = mount(TodoViewVue, {
  global: {
    provide: {
      $store: store
    }
  }
})

describe('TodoView', () => {
  it('h1 contains text todo', () => {
    expect(wrapper.find('h1').text()).toBe('TODO')
  })

  it('input has an empty value', () => {
    expect(wrapper.find('input').element.value).toBe('')
  })

  it('should loop over currentTodoList correctly', async () => {
    store.todos = [
      { id: 1, text: 'Todo 1', completed: false },
      { id: 2, text: 'Todo 2', completed: false },
      { id: 3, text: 'Todo 3', completed: false }
    ]

    await wrapper.vm.$nextTick()

    const todoElements = wrapper.findAll('.px-6.py-5.flex')

    expect(todoElements.length).toBe(store.todos.length)

    for (let i = 0; i < todoElements.length; i++) {
      const todoElement = todoElements[i]

      expect(todoElement.text()).toContain(store.todos[i].text)
    }
  })

  it('stores todolength in local storage', () => {
    localStorage.removeItem('todoLength')
    const todoLengthValue = 5
    store.todoLength = todoLengthValue
    store.storeTodoLength()
    const storedTodoLength = localStorage.getItem('todoLength')

    if (storedTodoLength !== null) {
      const parsedTodoLength = parseInt(storedTodoLength, 10)
      expect(parsedTodoLength).toBe(todoLengthValue)
    }
  })

  it('gets todolength from local storage', () => {
    localStorage.setItem('todoLength', '7')
    store.getTodoLength()

    expect(store.todoLength).toBe(7)
  })

  it('should add a new todo item to the store', () => {
    store.todos = []
    const todoText = 'Test todo item'

    store.addTodo(todoText)
    expect(store.todos).toHaveLength(1)
    expect(store.todos[0].text).toBe(todoText)
    expect(store.todos[0].completed).toBe(false)
  })

  it('check if the addTodo function exist in the store', () => {
    expect(store.addTodo).toBeDefined()
  })

  it('should trigger mouseover event on todo item', async () => {
    store.todos = [
      { id: 1, text: 'Todo 1', completed: false },
      { id: 2, text: 'Todo 2', completed: false },
      { id: 3, text: 'Todo 3', completed: false }
    ]
    await wrapper.vm.$nextTick()
    const todoElement = wrapper.find('.px-6.py-5.flex').element
    await todoElement.dispatchEvent(new Event('mouseover'))
    expect(store.showDeleteButton[1]).toBe(true)
  })

  it('should trigger mouseleave event on todo item', async () => {
    store.todos = [
      { id: 1, text: 'Todo 1', completed: false },
      { id: 2, text: 'Todo 2', completed: true },
      { id: 3, text: 'Todo 3', completed: false }
    ]
    await wrapper.vm.$nextTick()
    const todoElement = wrapper.find('.px-6.py-5.flex').element
    await todoElement.dispatchEvent(new Event('mouseleave'))
    expect(store.showDeleteButton[1]).toBe(false)
  })
  it('should delete a todo item from the store', () => {
    store.todosClone = [
      { id: 1, text: 'Todo 1', completed: false },
      { id: 2, text: 'Todo 2', completed: true },
      { id: 3, text: 'Todo 3', completed: false }
    ]

    const todoIdToDelete = 2

    store.deleteTodo(todoIdToDelete)

    expect(store.todosClone).toHaveLength(2)
  })
  it('should mark all todos as completed when none are completed', () => {
    store.todosClone = [
      { id: 1, text: 'Todo 1', completed: false },
      { id: 2, text: 'Todo 2', completed: false },
      { id: 3, text: 'Todo 3', completed: false }
    ]
    store.markAllTodosAsCompleted()
    const allCompleted = store.todosClone.every((todo) => todo.completed === true)
    expect(allCompleted).toBe(true)
  })

  it('should mark all todos as incomplete when all are completed', () => {
    store.todosClone = [
      { id: 1, text: 'Todo 1', completed: true },
      { id: 2, text: 'Todo 2', completed: true },
      { id: 3, text: 'Todo 3', completed: true }
    ]

    store.markAllTodosAsCompleted()

    const allIncomplete = store.todosClone.every((todo) => todo.completed === false)
    expect(allIncomplete).toBe(true)
  })

  it('should mark a todo item as completed', () => {
    store.todosClone = [
      { id: 1, text: 'Todo 1', completed: false },
      { id: 2, text: 'Todo 2', completed: false },
      { id: 3, text: 'Todo 3', completed: false }
    ]

    const todoIdToComplete = 2
    store.markAsCompleted(todoIdToComplete)

    const completedTodo = store.todosClone.find((todo) => todo.id === todoIdToComplete)
    if (completedTodo !== undefined) {
      completedTodo.completed = true
    }

    expect(completedTodo).not.toBeUndefined()
    expect(completedTodo?.completed).toBe(true)
  })

  it('should mark a completed todo item as incomplete', () => {
    store.todosClone = [
      { id: 1, text: 'Todo 1', completed: false },
      { id: 2, text: 'Todo 2', completed: true },
      { id: 3, text: 'Todo 3', completed: false }
    ]

    const todoIdToIncomplete = 2
    store.markAsCompleted(todoIdToIncomplete)

    // Check if the specified todo item is marked as incomplete
    const incompleteTodo = store.todosClone.find((todo) => todo.id === todoIdToIncomplete)
    if (incompleteTodo !== undefined) {
      incompleteTodo.completed = false
    }
    expect(incompleteTodo).not.toBeUndefined()
    expect(incompleteTodo?.completed).toBe(false)
  })
  it('should clear completed todos and reindex the remaining ones', () => {
    store.todos = [
      { id: 1, text: 'Todo 1', completed: false },
      { id: 2, text: 'Todo 2', completed: true },
      { id: 3, text: 'Todo 3', completed: false }
    ]
    store.clearTodos()

    expect(store.todos).toHaveLength(2)
    expect(store.todos[0].id).toBe(1)
    expect(store.todos[1].id).toBe(2)

    // Ensure that remaining todos are reindexed
    expect(store.todos[0].id).toBe(1)
    expect(store.todos[1].id).toBe(2)
  })
})
