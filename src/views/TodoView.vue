<script lang="ts">
import { useTodoStore } from '@/stores/todo'
import { defineComponent, ref, onMounted, computed } from 'vue'
import type { Ref } from 'vue'

export default defineComponent({
  setup() {
    const store = useTodoStore()
    const todoList = computed(() => store.todos)
    const todoListRef = ref(todoList.value) // Create a reactive ref
    const todoLength = ref(todoList.value.length)
    const todo: Ref<string> = ref('')
    let useRefList = false
    const showDeleteButton: Ref<{ [key: number]: boolean }> = ref({})

    const mouseOver = (index: any) => {
      showDeleteButton.value[index] = true
    }

    const mouseLeave = (index: any) => {
      showDeleteButton.value[index] = false
    }

    const storeTodoLength = () => {
      localStorage.setItem('todoLength', todoLength.value.toString())
    }

    const getTodoLength = () => {
      const todoNumber = localStorage.getItem('todoLength')
      if (todoNumber) {
        return (todoLength.value = parseInt(todoNumber))
      }
    }

    const addTodo = () => {
      if (!todo.value) return
      store.addTodo(todo.value)
      todo.value = ''
      todoLength.value++
      localStorage.setItem('todoLength', todoLength.value.toString())
    }

    const deleteTodo = (index: any) => {
      store.deleteTodo(index)
      todoLength.value--
      localStorage.setItem('todoLength', todoLength.value.toString())
    }

    const markTodoAsCompleted = (index: any) => {
      store.markAsCompleted(index)
      const completedTodos = todoList.value.filter((todo) => !todo.completed)

      todoLength.value = completedTodos.length
      localStorage.setItem('todoLength', todoLength.value.toString())

      return todoLength.value
    }

    const markAllTodosAsCompleted = () => {
      store.markAllTodosAsCompleted()
      const allCompleted = todoList.value.every((todo) => todo.completed)

      if (allCompleted) {
        todoLength.value = 0
      } else {
        todoLength.value = todoList.value.length
      }

      localStorage.setItem('todoLength', todoLength.value.toString())
    }

    const markAllButtonClass = computed(() => {
      return currentTodoList.value.every((todo) => todo.completed)
        ? 'text-white text-lg'
        : 'text-gray-500 text-lg'
    })

    const getAllTodos = () => {
      store.displayAllTodos()
    }

    // const getCompletedTodos = () => {
    //   const completedTodos = store.displayCompletedTodos()
    //   todoListRef.value = completedTodos
    //   console.log(todoListRef.value)
    //   useRefList = true
    // }
    // const getActiveTodos = () => {
    //   const activeTodos = store.displayActiveTodos()
    //   todoListClone.value = activeTodos
    // }

    const currentTodoList = computed(() => {
      return useRefList ? todoListRef.value : todoList.value
    })

    const clearTodoList = () => {
      store.clearTodos()
    }
    onMounted(() => {
      getTodoLength()
      storeTodoLength()
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
      getAllTodos,
      // getCompletedTodos,
      // getActiveTodos,
      currentTodoList,
      clearTodoList,
      markAllTodosAsCompleted,
      markAllButtonClass
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
              <i :class="`ri-arrow-down-s-line text-white text-lg ${markAllButtonClass}`"></i>
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
        v-if="currentTodoList.length > 0"
      >
        <div v-for="todo in currentTodoList" :key="todo.id">
          <div
            class="px-6 py-5 flex justify-between items-center"
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
              <button class="text-[#5B5E7E] text-sm font-normal tracking-xxs" @click="getAllTodos">
                All
              </button>
              <button
                class="text-[#5B5E7E] text-sm font-normal tracking-xxs ml-4"
                @click="getActiveTodos"
              >
                Active
              </button>
              <button
                class="text-[#5B5E7E] text-sm font-normal tracking-xxs ml-4"
                @click="getCompletedTodos"
              >
                Completed
              </button>
            </div>
          </div>

          <button
            class="text-[#5B5E7E] text-sm font-normal tracking-xxs"
            @click="clearTodoList"
            v-if="currentTodoList.length > 0 && currentTodoList.some((todo) => todo.completed)"
          >
            Clear Completed
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
