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

// フォーム内容を DB に登録する
function register() {
  // フォームの入力チェック
  // false が返却されたら登録処理を中断
  if (inputCheck() == false) {
    return
  }

  // ラジオボタンのデータを取得
  // name属性が balance のラジオボタンのデータを取得
  let radio = document.getElementsByName('balance')
  let balance
  for (let i = 0; i < radio.length; i++) {
    if (radio[i].checked == true) {
      balance = radio[i].value
      break
    }
  }

  // フォームに入力された値を取得
  let date = document.getElementById('date').value
  let amount = document.getElementById('amount').value
  let memo = document.getElementById('memo').value
  let category = document.getElementById('category').value
  // ラジオボタンが収入を選択時はカテゴリを「収入」にする
  if (balance == '収入') {
    category = '収入'
  }

  // データベースにデータを登録する
  insertData(balance, date, category, amount, memo)
}

// データの挿入
function insertData(balance, date, category, amount, memo) {
  // 一意の ID を現在の日時から作成
  let uniqueID = new Date().getTime().toString()
  console.log(uniqueID)
  // DB に登録するための連想配列のデータを作成
  let data = {
    id: uniqueID,
    balance: balance,
    date: String(date),
    category: category,
    amount: amount,
    memo: memo,
  }

  // データベースを開く
  let database = indexedDB.open(dbName, dbVersion)

  // データベースの開けなかった時の処理
  database.onerror = function (event) {
    console.log('データベースに接続できませんでした')
  }

  // データベースを開いたらデータの登録を実行
  database.onsuccess = function (event) {
    let db = event.target.result
    let transaction = db.transaction(storeName, 'readwrite')
    transaction.oncomplete = function (event) {
      console.log('トランザクション完了')
    }
    transaction.onerror = function (event) {
      console.log('トランザクションエラー')
    }

    let store = transaction.objectStore(storeName)
    let addData = store.add(data)
    addData.onsuccess = function () {
      console.log('データが登録できました')
      alert('登録しました')
    }
    addData.onerror = function () {
      console.log('データが登録できませんでした')
    }
    // DB を閉じる
    db.close()
  }
}
