// indexedDB の名前などを設定
// データベースの名前
const dbName = 'expensesDB'
// オブジェクトストアの名前
const storeName = 'expensesStore'
// データベースにバージョン番号を指定
const dbVersion = 1

// データベース接続をする
// データベースが未作成なら新規作成をする
let database = indexedDB.open(dbName, dbVersion)

// データベースとオブジェクトストアの作成
database.onupgradeneeded = function (event) {
  let db = event.target.result
  db.createObjectStore(storeName, { keyPath: 'id' })
  console.log('データベースを新規作成しました。')
}

// データベースの接続に成功したときに発生するイベント
database.onsuccess = function (event) {
  let db = event.target.result
  // 接続を解除する
  db.close()
  console.log('データベースに接続できました')
}
database.onerror = function (event) {
  console.log('データベースに接続できませんでした')
}
