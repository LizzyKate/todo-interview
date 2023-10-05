# Todo

![Todo APP]('/todo.png')

This is a todo app that keep tracks of tasks and shows tasks are done

## Features

### Creating Todo Items:

Anonymous users can create todo items.
An input box is provided for entering the task description.
Users can press the enter key to add a new todo item.
Newly created todo items are displayed in the list.

### Viewing Empty List:

When there are no todo items, the main page shows an input box in focus.

### Marking Todo Items as Done:

Users can mark todo items as completed by clicking on a checkbox next to the item.
Completed items have a grayed-out appearance with a strike-through style.
The number of remaining incompleted items is updated.
A "Clear completed" button is displayed to remove completed items.

### Filtering Todo Items:

Users can filter todo items based on their status (All, Active, Completed).
Clicking the "Active" button displays only incompleted items.
Clicking the "Completed" button displays only completed items.
Clicking the "All" button shows all todo items.

### Removing Todo Items:

Users can remove individual completed todo items by hovering over them and clicking a cross icon.
Bulk removal of completed items is possible by clicking the "Clear completed" button.

### Removing Todo Items:

Users can remove individual completed todo items by hovering over them and clicking a cross icon.
Bulk removal of completed items is possible by clicking the "Clear completed" button.

## Technologies

Vue3
Composition Api
Typescript
Css
Tailwind Css
Pinia
Pnpm

## Getting Started

Clone the repository to your local machine.
Install the required dependencies using pnpm install.
Run the development server using pnpm dev.

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
