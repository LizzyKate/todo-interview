<script lang="ts">
import { ref } from 'vue'

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default {
  setup() {
    const todos = ref<Todo[]>([
      {
        id: 1,
        text: 'Example Todo',
        completed: false
      },
      {
        id: 2,
        text: 'Example Todo 2',
        completed: false
      },
      {
        id: 3,
        text: 'Example Todo 3',
        completed: false
      },
      {
        id: 4,
        text: 'Example Todo 4',
        completed: false
      },
      {
        id: 5,
        text: 'Example Todo 5',
        completed: false
      }
    ])

    return {
      todos
    }
  }
}
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
            <button class="absolute left-4">
              <i class="ri-arrow-down-s-line text-white text-lg"></i>
            </button>

            <input
              class="h-16 bg-[#25273D] rounded-md shadow-3xl w-full focus:outline-none pl-16 py-5 text-white placeholder:text-[#767992] font-normal text-lg tracking-xs"
              placeholder="Create a new todo…"
            />
          </label>
        </div>
      </div>
    </div>
    <div class="bg-[#171823] __parent max-h-full relative flex justify-center">
      <div
        class="w-[540px] absolute top-[-40px] z-50 max-h-[439px] overflow-scroll rounded-md bg-[#25273D] shadow-3xl pb-5"
      >
        <div v-for="todo in todos" :key="todo.id">
          <label class="inline-flex items-center px-6 py-5">
            <input
              type="checkbox"
              class="form-checkbox text-indigo-600 w-6 h-6 bg-transparent border border-[#393a4b] rounded-full focus:outline-none focus:border-[#393a4b]"
            />
            <span class="ml-3 text-[#C8CBE7] text-lg font-normal tracking-xs">{{ todo.text }}</span>
          </label>
          <div class="w-full bg-[#393A4B] h-[1px]"></div>
        </div>
        <div class="mt-4 px-6 flex items-center justify-between">
          <p class="text-[#5B5E7E] text-sm font-normal tracking-xxs">5 items left</p>
          <div class="flex items-center-justify-between">
            <button class="text-[#5B5E7E] text-sm font-normal tracking-xxs">All</button>
            <button class="text-[#5B5E7E] text-sm font-normal tracking-xxs ml-4">Active</button>
            <button class="text-[#5B5E7E] text-sm font-normal tracking-xxs ml-4">Completed</button>
          </div>
          <button class="text-[#5B5E7E] text-sm font-normal tracking-xxs">Clear Completed</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.__container {
  background-image: url('@/assets/images/bg.png');
}
.__parent {
  height: calc(100vh - 300px);
}
::-webkit-scrollbar {
  display: none;
}
input[type='checkbox']:checked + span {
  text-decoration: line-through;
  color: #4d5067;
}
</style>
