let db;

const request = indexedDB.open('pwa_fwoosh', 1);

request.onupgradeneeded = (e) => {
  const db = e.target.result;

  db.createObjectStore('new_transaction', { autoIncrement: true });
};

request.onsuccess = (e) => {
  db = e.target.result;

  if (navigator.onLine) {
    // uploadTransaction();
  }
};

request.onerror = (e) => {
  console.log(e.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(['new_transaction'], 'readwrite');

  const transactionObjectStore = transaction.objectStore('new_transaction');

  transactionObjectStore.add(record);
}
