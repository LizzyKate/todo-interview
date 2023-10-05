<script lang="ts">
import { useTodoStore } from '@/stores/todo'
import { defineComponent, ref, onMounted, computed } from 'vue'
import type { Ref } from 'vue'

export default defineComponent({
  setup() {
    const store = useTodoStore()
    const todoList = computed(() => store.todos)
    const showAllTodos = ref(true)
    const showActiveTodos = ref(false)
    const showCompletedTodos = ref(false)
    const todoLength = computed(() => store.todoLength)
    const todo: Ref<string> = ref('')
    const currentFilter: Ref<string | null> = ref('')

    const showDeleteButton = store.showDeleteButton

    const toggleFilter = (filterType: string) => {
      currentFilter.value = filterType
      showAllTodos.value = filterType === 'all'
      showActiveTodos.value = filterType === 'active'
      showCompletedTodos.value = filterType === 'completed'
      if (showAllTodos.value) {
        store.displayAllTodos()
      } else if (showActiveTodos.value) {
        store.displayActiveTodos()
      } else if (showCompletedTodos.value) {
        store.displayCompletedTodos()
      }
      // Save the current filter state to localStorage
      localStorage.setItem('currentFilter', currentFilter.value)
    }

    const displayTodos = () => {
      currentFilter.value = localStorage.getItem('currentFilter')
      if (currentFilter.value === 'active') {
        showActiveTodos.value = true
        showAllTodos.value = false
        showCompletedTodos.value = false
        store.displayActiveTodos()
      } else if (currentFilter.value === 'completed') {
        showCompletedTodos.value = true
        showAllTodos.value = false
        showActiveTodos.value = false
        store.displayCompletedTodos()
      } else {
        showAllTodos.value = true
        showActiveTodos.value = false
        showCompletedTodos.value = false
        store.displayAllTodos()
      }
    }

    const filteredTodos = computed(() => {
      if (showAllTodos.value) {
        return todoList.value
      } else if (showActiveTodos.value) {
        return todoList.value.filter((todo: any) => !todo.completed)
      } else if (showCompletedTodos.value) {
        return todoList.value.filter((todo: any) => todo.completed)
      }
      return []
    })

    const mouseOver = (index: any) => {
      store.updateShowDeleteButton(index, true)
    }

    const mouseLeave = (index: any) => {
      store.updateShowDeleteButton(index, false)
    }

    const storeTodoLength = () => {
      store.storeTodoLength()
    }

    const getTodoLength = () => {
      store.getTodoLength()
    }

    const addTodo = () => {
      if (!todo.value) return
      store.addTodo(todo.value)
      todo.value = ''
    }

    const deleteTodo = (index: any) => {
      store.deleteTodo(index)
    }

    const markTodoAsCompleted = (index: any) => {
      store.markAsCompleted(index)
    }

    const markAllTodosAsCompleted = () => {
      store.markAllTodosAsCompleted()
    }

    const allTodosCompleted = computed(() => {
      return todoList.value.every((todo) => todo.completed)
    })

    const markAllButtonClass = computed(() => {
      return allTodosCompleted.value ? 'text-white' : 'text-gray-500 '
    })

    const clearTodoList = () => {
      store.clearTodos()
    }
    onMounted(() => {
      getTodoLength()
      storeTodoLength()
      displayTodos()
    })

    return {
      todo,
      addTodo,
      showDeleteButton,
      mouseOver,
      mouseLeave,
      deleteTodo,
      markTodoAsCompleted,
      todoLength,
      clearTodoList,
      markAllTodosAsCompleted,
      markAllButtonClass,
      todoList,
      filteredTodos,
      toggleFilter,
      currentFilter
    }
  }
})
</script>

<template>
  <section class="h-screen max-h-full">
    <div
      class="__container h-[300px] bg-center bg-cover bg-no-repeat flex items-center justify-center"
    >
      <div class="w-[540px]">
        <h1 class="text-3xl font-bold tracking-widest text-white">TODO</h1>
        <div class="mt-12 relative">
          <label class="flex items-center">
            <button class="absolute left-4" @click="markAllTodosAsCompleted">
              <i :class="`ri-arrow-down-s-line text-lg ${markAllButtonClass}`"></i>
            </button>

            <input
              class="h-16 bg-[#25273D] rounded-md shadow-3xl w-full focus:outline-none pl-16 py-5 text-white placeholder:text-[#767992] font-normal text-lg tracking-xs"
              placeholder="Create a new todo…"
              v-model="todo"
              @keyup.enter="addTodo"
            />
          </label>
        </div>
      </div>
    </div>
    <div class="bg-[#171823] __parent max-h-full relative flex justify-center">
      <div
        class="w-[540px] absolute top-[-40px] z-50 max-h-[439px] overflow-scroll rounded-md bg-[#25273D] shadow-3xl pb-5"
        v-if="todoList && todoList.length > 0"
      >
        <div v-for="todo in filteredTodos" :key="todo.id">
          <div
            class="px-6 py-5 flex justify-between items-center __todo-item"
            @mouseover="mouseOver(todo.id)"
            @mouseleave="mouseLeave(todo.id)"
          >
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                :checked="todo.completed"
                class="form-checkbox text-indigo-600 w-6 h-6 bg-transparent border border-[#393a4b] rounded-full focus:outline-none focus:border-[#393a4b]"
                @click="() => markTodoAsCompleted(todo.id)"
              />
              <span class="ml-3 text-[#C8CBE7] text-lg font-normal tracking-xs">{{
                todo.text
              }}</span>
            </label>
            <button v-if="showDeleteButton[todo.id]" @click="() => deleteTodo(todo.id)">
              <i class="ri-close-line text-xl text-[#c8cbe7]"></i>
            </button>
          </div>
          <div class="w-full bg-[#393A4B] h-[1px]"></div>
        </div>
        <div class="mt-4 px-6 flex items-center justify-between">
          <div class="w-2/3 flex items-center justify-between">
            <p class="text-[#5B5E7E] text-sm font-normal tracking-xxs">
              {{ todoLength }} items left
            </p>
            <div class="flex items-center-justify-between">
              <button
                :class="`text-[#5B5E7E] text-sm font-normal tracking-xxs ml-4 ${
                  currentFilter === 'all' ? 'border border-white p-2 rounded-md' : ''
                }`"
                @click="() => toggleFilter('all')"
              >
                All
              </button>
              <button
                :class="`text-[#5B5E7E] text-sm font-normal tracking-xxs ml-4 ${
                  currentFilter === 'active' ? 'border border-white p-2 rounded-md' : ''
                }`"
                @click="() => toggleFilter('active')"
              >
                Active
              </button>
              <button
                :class="`text-[#5B5E7E] text-sm font-normal tracking-xxs ml-4 ${
                  currentFilter === 'completed' ? 'border border-white p-2 rounded-md' : ''
                }`"
                @click="() => toggleFilter('completed')"
              >
                Completed
              </button>
            </div>
          </div>

          <button
            class="text-[#5B5E7E] text-sm font-normal tracking-xxs"
            @click="clearTodoList"
            v-if="todoList.length > 0 && todoList.some((todo) => todo.completed)"
          >
            Clear Completed
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
