import { defineStore } from 'pinia'
import indexDB from '@/utils/storage'

export const useDbStore = defineStore('db', () => {
  const db = new indexDB('localDb')
  db.init() // 初始化数据库
  return { add: db.add, update: db.update, remove: db.remove, get: db.get }
})
