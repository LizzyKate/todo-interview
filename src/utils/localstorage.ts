interface IStore {
  key: string
  value?: object
}

const store = ({ key, value }: IStore) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const get = ({ key }: IStore) => {
  const storedValue = localStorage.getItem(key)
  return storedValue ? JSON.parse(storedValue) : []
}

export { store, get }
