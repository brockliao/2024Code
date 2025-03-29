// 定义数据类型
interface Person {
  id: number
  name: string
  age: number
}

// 处理浏览器前缀，以兼容不同浏览器
const indexedDB =
  window.indexedDB ||
  (window as any).mozIndexedDB ||
  (window as any).webkitIndexedDB ||
  (window as any).msIndexedDB
const IDBTransaction =
  window.IDBTransaction ||
  (window as any).mozIDBTransaction ||
  (window as any).webkitIDBTransaction ||
  (window as any).msIDBTransaction
const IDBKeyRange =
  window.IDBKeyRange ||
  (window as any).mozIDBKeyRange ||
  (window as any).webkitIDBKeyRange ||
  (window as any).msIDBKeyRange

// 数据库名称和版本
const DB_NAME = 'myDatabase'
const DB_VERSION = 1
const OBJECT_STORE_NAME = 'myObjectStore'

// 检查 IndexedDB 是否可用
if (!indexedDB) {
  console.error('当前浏览器不支持 IndexedDB')
}

// 打开数据库
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!indexedDB) {
      reject(new Error('当前浏览器不支持 IndexedDB'))
      return
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    // onupgradeneeded：当数据库首次创建或者数据库版本号（DB_VERSION）发生变化时，onupgradeneeded 事件会被触发。
    // 这个事件会在数据库实际打开之前执行，
    // 用于对数据库进行升级操作，例如创建或修改对象存储（objectStore）和索引（index）。
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result
      // 检查数据库中是否存在名为 OBJECT_STORE_NAME 的对象存储，如果不存在，则创建该对象存储，并指定 id 字段为主键。
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        // 主键是一个唯一标识对象的字段，用于快速查找和操作对象。
        // 在这个例子中，id 字段被指定为主键，这意味着每个对象都有一个唯一的 id 值。
        const objectStore = db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' })
        // 在对象存储上创建一个名为 nameIndex 的索引，用于根据 name 字段进行查询，unique 为 false
        // 表示 name 字段的值可以重复。
        // 索引可以提高查询效率，特别是当需要根据 name 字段进行频繁查询时。
        objectStore.createIndex('nameIndex', 'name', { unique: false })
      }
    }
    // onsuccess：当数据库成功打开，并且 onupgradeneeded 事件（如果有）已经完成后，
    // onsuccess 事件会被触发。这个事件表示数据库已经准备好进行读写操作。
    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result
      resolve(db)
    }
    // onerror：如果在打开数据库的过程中发生错误，onerror 事件会被触发。
    // 这个事件会在 onupgradeneeded 和 onsuccess 事件之前触发，用于处理打开数据库时出现的错误。
    request.onerror = (event: Event) => {
      console.error('数据库打开失败', (event.target as IDBOpenDBRequest).error)
      reject(new Error('数据库打开失败'))
    }
  })
}

// 添加数据
async function addData(data: Person): Promise<void> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([OBJECT_STORE_NAME], 'readwrite')
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME)
    const request = objectStore.add(data)

    request.onsuccess = () => {
      console.log('数据添加成功')
      resolve()
    }

    request.onerror = () => {
      reject(new Error('数据添加失败'))
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}

// 根据 ID 查询数据
async function getDataById(id: number): Promise<Person | null> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    // 在数据库上创建一个只读事务，指定要操作的对象存储名称为 OBJECT_STORE_NAME。
    const transaction = db.transaction([OBJECT_STORE_NAME])
    // 从事务中获取指定名称的对象存储。
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME)
    // 在对象存储上创建一个索引，用于快速查找 'content' 字段。 id是主键，能快速查询，
    // 而其他键值可能存在重复，需要使用index后缀，如：nameIndex ageIndex等
    const request = objectStore.get(id)

    request.onsuccess = () => {
      const result = request.result
      resolve(result)
    }

    request.onerror = () => {
      reject(new Error('数据查询失败'))
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}

// 根据名称查询数据
async function getDataByName(name: string): Promise<Person | null> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([OBJECT_STORE_NAME])
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME)
    const index = objectStore.index('nameIndex')
    const request = index.get(name)

    request.onsuccess = () => {
      const result = request.result
      resolve(result)
    }

    request.onerror = () => {
      reject(new Error('数据查询失败'))
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}

// 更新数据
async function updateData(data: Person): Promise<void> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([OBJECT_STORE_NAME], 'readwrite')
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME)
    const request = objectStore.put(data)

    request.onsuccess = () => {
      console.log('数据更新成功')
      resolve()
    }

    request.onerror = () => {
      reject(new Error('数据更新失败'))
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}

// 根据 ID 删除数据
async function deleteDataById(id: number): Promise<void> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([OBJECT_STORE_NAME], 'readwrite')
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME)
    const request = objectStore.delete(id)

    request.onsuccess = () => {
      console.log('数据删除成功')
      resolve()
    }

    request.onerror = () => {
      reject(new Error('数据删除失败'))
    }

    transaction.oncomplete = () => {
      db.close()
    }
  })
}

// 示例用法
async function main() {
  try {
    // 添加数据
    const newPerson: Person = { id: 1, name: 'John', age: 30 }
    await addData(newPerson)

    // 根据 ID 查询数据
    const personById = await getDataById(1)
    console.log('根据 ID 查询到的数据:', personById)

    // 根据名称查询数据
    const personByName = await getDataByName('John')
    console.log('根据名称查询到的数据:', personByName)

    // 更新数据
    const updatedPerson: Person = { id: 1, name: 'Jane', age: 31 }
    await updateData(updatedPerson)

    // 删除数据
    await deleteDataById(1)
  } catch (error) {
    console.error(error)
  }
}

main()
