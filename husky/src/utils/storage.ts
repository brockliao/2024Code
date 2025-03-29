const SQL_NAME = 'gy-letter-h5'
const DB_NAME = 'h5'

class indexDb {
  name: string // 主键
  request: IDBDatabase // 数据库请求
  db: IDBDatabase // 数据库

  /**
   * 构造函数，初始化 IndexedDB 操作实例
   * @param name - 作为主键使用的名称，用于标识存储的数据
   */
  constructor(name: string) {
    // 将传入的名称赋值给类的 name 属性，作为主键使用
    this.name = name
  }

  /**
   * 初始化 IndexedDB 数据库
   * @returns 返回一个 Promise，当数据库成功打开时解析为数据库实例，失败时拒绝并抛出错误
   */
  init() {
    // 返回一个 Promise 对象，用于处理异步操作
    return new Promise((resolve, reject) => {
      // 尝试打开指定名称的 IndexedDB 数据库
      this.request = window.indexedDB.open(SQL_NAME)
      /**
       * 当打开数据库请求失败时触发的回调函数
       * @param event - 包含错误信息的事件对象
       */
      this.request.onerror = (event: Event) => {
        // 拒绝 Promise 并传递错误事件
        reject(event)
        // 弹出提示框告知用户缓存获取失败
        alert('缓存获取失败')
      }
      /**
       * 当打开数据库请求成功时触发的回调函数
       * @param event - 包含成功信息的事件对象
       */
      this.request.onsuccess = (event: IDBRequestEventMap['success']) => {
        // 解析 Promise 并传递数据库实例
        resolve(event?.target?.result)
        // 将数据库实例赋值给类的 db 属性
        this.db = event?.target?.result
      }
      /**
       * 当数据库需要升级时触发的回调函数
       * @param event - 包含升级信息的事件对象
       */
      this.request.onupgradeneeded = (event: IDBRequestEventMap['upgradeneeded']) => {
        // 将数据库实例赋值给类的 db 属性
        this.db = event.target.result
        // 声明对象存储变量
        let objectStore
        // 检查数据库中是否已经存在指定名称的对象存储
        if (!this.db.objectStoreNames.contains(DB_NAME)) {
          // 如果不存在，则创建一个新的对象存储
          objectStore = this.db.createObjectStore(DB_NAME, {
            // 使用 'name' 作为主键
            keyPath: 'name',

            // 主键不允许重复
            unique: true,
          })
          // 在对象存储上创建一个索引，用于快速查找 'content' 字段
          objectStore.createIndex('content', 'content', { unique: false })
        }
      }
    })
  }

  /**
   * 根据名称从 IndexedDB 中获取数据
   * @param name - 要获取的数据的名称
   * @returns 返回一个 Promise，当操作成功时解析为获取到的数据，失败时拒绝并抛出错误
   */
  async get(name: string) {
    // 返回一个 Promise 对象，用于处理异步操作
    return new Promise((resolve, reject) => {
      // 开启一个只读事务，用于从数据库中读取数据
      const transaction = this.db.transaction([DB_NAME], 'readonly')
      // 获取指定名称的对象存储，用于操作数据库中的数据
      const objectStore = transaction.objectStore(DB_NAME)
      // 发起一个获取数据的请求，根据名称从对象存储中获取数据
      const req = objectStore.get(name)

      // 当请求成功时，将获取到的数据作为结果解析 Promise
      req.onsuccess = function () {
        resolve(req.result)
      }
      // 当请求失败时，拒绝 Promise 并抛出错误
      req.onerror = reject
    })
  }

  /**
   * 向 IndexedDB 数据库中添加一条新记录
   * @param content - 要添加的数据内容
   * @returns 返回一个 Promise，当操作成功时解析为添加操作的结果，失败时拒绝并抛出错误
   */
  async add(content: string) {
    // 返回一个 Promise 对象，用于处理异步操作
    return new Promise((resolve, reject) => {
      // 开启一个读写事务，用于向数据库中添加数据
      const select = this.db
        .transaction([DB_NAME], 'readwrite')
        .objectStore(DB_NAME)
        // 发起一个添加数据的请求，将包含名称和内容的对象添加到对象存储中
        .add({ name: this.name, content })

      /**
       * 当添加数据请求成功时触发的回调函数
       * @param event - 包含成功信息的事件对象
       */
      select.onsuccess = (event: any) => {
        // 将添加操作的结果作为结果解析 Promise
        resolve(event.target.result)
      }
      /**
       * 当添加数据请求失败时触发的回调函数
       * 直接拒绝 Promise 并抛出错误
       */
      select.onerror = reject
    })
  }

  /**
   * 更新 IndexedDB 数据库中指定名称的记录
   * @param name - 要更新的记录的名称，作为主键
   * @param content - 要更新的记录的新内容
   * @returns 返回一个 Promise，当操作成功时解析为更新操作的结果，失败时拒绝并抛出错误
   */
  async update(name: string, content: string) {
    // 返回一个 Promise 对象，用于处理异步操作
    return new Promise((resolve, reject) => {
      // 开启一个读写事务，用于更新数据库中的数据
      const select = this.db
        .transaction([DB_NAME], 'readwrite')
        .objectStore(DB_NAME)
        // 发起一个更新数据的请求，将包含名称和新内容的对象更新到对象存储中
        .put({ name, content })

      /**
       * 当更新数据请求成功时触发的回调函数
       * @param event - 包含成功信息的事件对象
       */
      select.onsuccess = (event: any) => {
        // 将更新操作的结果作为结果解析 Promise
        resolve(event.target.result)
      }
      /**
       * 当更新数据请求失败时触发的回调函数
       * 直接拒绝 Promise 并抛出错误
       */
      select.onerror = reject
    })
  }

  /**
   * 从 IndexedDB 数据库中删除指定名称的记录
   * @param name - 要删除的记录的名称，作为主键
   * @returns 返回一个 Promise，当操作成功时解析为删除操作的结果，失败时拒绝并抛出错误
   */
  async remove(name: string) {
    // 返回一个 Promise 对象，用于处理异步操作
    return new Promise((resolve, reject) => {
      // 开启一个读写事务，用于从数据库中删除数据
      const select = this.db
        .transaction([DB_NAME], 'readwrite')
        .objectStore(DB_NAME)
        // 发起一个删除数据的请求，根据名称从对象存储中删除对应记录
        .delete(name)

      /**
       * 当删除数据请求成功时触发的回调函数
       * @param event - 包含成功信息的事件对象
       */
      select.onsuccess = (event: any) => {
        // 将删除操作的结果作为结果解析 Promise
        resolve(event.target.result)
      }
      /**
       * 当删除数据请求失败时触发的回调函数
       * 直接拒绝 Promise 并抛出错误
       */
      select.onerror = reject
    })
  }
}

export default indexDb
