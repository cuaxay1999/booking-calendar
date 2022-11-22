import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'
// slices
import productReducer from './slices/product'
import calendarReducer from './slices/calendar'

// ----------------------------------------------------------------------

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null)
  },
  setItem(_key, value) {
    return Promise.resolve(value)
  },
  removeItem() {
    return Promise.resolve()
  }
})

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
}

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout']
}

const rootReducer = combineReducers({
  calendar: calendarReducer,
  product: persistReducer(productPersistConfig, productReducer)
})

export { rootPersistConfig, rootReducer }
