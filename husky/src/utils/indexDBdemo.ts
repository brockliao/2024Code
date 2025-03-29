export default {
  openIndexedDB(name: string) {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(name)

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('myObjectStore')) {
          const objectStore = db.createObjectStore('myObjectStore', { keyPath: 'id' })
          objectStore.createIndex('nameIndex', 'name', { unique: false })
        }
      }
      request.onsuccess = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest).result
        resolve(db)
      }
      request.onerror = () => {
        reject(new Error('数据库打开失败'))
      }
    })
  },
  addData(db: IDBDatabase, data: any) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['myObjectStore'], 'readwrite')
      const objectStore = transaction.objectStore('myObjectStore')
      const request = objectStore.add(data)
      request.onsuccess = () => {
        resolve(request.result)
      }
      request.onerror = () => {
        reject(new Error('数据添加失败'))
      }
    })
  },
  getDataById(db: IDBDatabase, id: number) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['myObjectStore'])
      const objectStore = transaction.objectStore('myObjectStore')
      const request = objectStore.get(id)
      request.onsuccess = () => {
        resolve(request.result)
      }
      request.onerror = () => {
        reject(new Error('数据查询失败'))
      }
    })
  },
  getDataByName(db: IDBDatabase, name: string) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['myObjectStore'])
      const objectStore = transaction.objectStore('myObjectStore')
      const index = objectStore.index('nameIndex')
      const request = index.get(name)
      request.onsuccess = () => {
        resolve(request.result)
      }
      request.onerror = () => {
        reject(new Error('数据查询失败'))
      }
    })
  },
  getAllData(db: IDBDatabase) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['myObjectStore'])
      const objectStore = transaction.objectStore('myObjectStore')
      const request = objectStore.getAll()
      request.onsuccess = () => {
        resolve(request.result)
      }
      request.onerror = () => {
        reject(new Error('数据查询失败'))
      }
    })
  },
  updateData(db: IDBDatabase, data: { id: number; [key: string]: any }) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['myObjectStore'], 'readwrite')
      const objectStore = transaction.objectStore('myObjectStore')
      // 在 IndexedDB 中，使用 put() 方法更新数据时，通过传入包含主键值的对象来确定要更新的记录。
      // 如果传入对象的主键值在对象存储中存在，put() 方法会更新该记录；若不存在，则会插入一条新的记录。
      const request = objectStore.put(data)
      request.onsuccess = () => {
        resolve(request.result)
      }
      request.onerror = () => {
        reject(new Error('数据更新失败'))
      }
    })
  },
  deleteDataById(db: IDBDatabase, id: number) {
    return new Promise((resolve, reject) => {
      // 注释 IDBTransaction 类型的定义
      // 用于表示数据库事务，用于执行数据库操作，如读取、写入、删除等。
      // 它包含了事务的状态、错误信息等属性和方法。
      // 可以通过调用 db.transaction() 方法来创建一个事务对象。
      const transaction = db.transaction(['myObjectStore'], 'readwrite')
      // 获取指定名称的对象存储，用于操作数据库中的数据
      const objectStore = transaction.objectStore('myObjectStore')
      const request = objectStore.delete(id)
      request.onsuccess = () => {
        resolve(request.result)
      }
      request.onerror = () => {
        reject(new Error('数据删除失败'))
      }
    })
  },
  deleteDataByName(db: IDBDatabase, name: string) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['myObjectStore'], 'readwrite')
      const objectStore = transaction.objectStore('myObjectStore')
      const index = objectStore.index('nameIndex')
      const request = index.getAllKeys(name)
      request.onsuccess = () => {
        const keys = request.result
        keys.forEach((key: any) => {
          objectStore.delete(key)
        })
      }
      request.onerror = () => {
        reject(new Error('数据删除失败'))
      }
    })
  },
}
