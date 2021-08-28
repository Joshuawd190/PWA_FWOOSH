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

function uploadTransaction() {
  const transaction = db.transaction(['new_transaction'], 'readwrite');

  const transactionObjectStore = transaction.objectStore('new_transaction');

  const getAll = transactionObjectStore.getAll();

  getAll.onsuccess = function () {
    // if there was data in indexedDb's store, let's send it to the api server
    if ((getAll.result.length = 1)) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(['new_transaction'], 'readwrite');

          const pizzaObjectStore = transaction.objectStore('new_transaction');

          pizzaObjectStore.clear();

          alert('Saved transaction has been submitted!');
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (getAll.result.length > 1) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(['new_transaction'], 'readwrite');

          const pizzaObjectStore = transaction.objectStore('new_transaction');

          pizzaObjectStore.clear();

          alert('Saved transactions have been submitted!');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

window.addEventListener('online', uploadTransaction);
