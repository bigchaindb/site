# Setup

Start by installing the official [BigchainDB JavaScript driver](https://github.com/bigchaindb/js-bigchaindb-driver):

```bash
npm i bigchaindb-driver
```

Then, include that as a module and connect to any BigchainDB node. You can create your own `app_id` and `app_key` on [BigchainDB Testnet](https://testnet.bigchaindb.com).

```js
const BigchainDB = require('bigchaindb-driver')

const API_PATH = 'https://test.bigchaindb.com/api/v1/'
const conn = new BigchainDB.Connection(API_PATH, {
    app_id: 'Get one from testnet.bigchaindb.com',
    app_key: 'Get one from testnet.bigchaindb.com'
})
```
