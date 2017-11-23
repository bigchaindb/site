# Setup

Start by installing the official [BigchainDB JavaScript driver](https://github.com/bigchaindb/js-bigchaindb-driver):

```bash
npm i bigchaindb-driver
```

Then, include that as a module and connect to IPDB or any BigchainDB node. In the case of IPDB, create your own `app_id` and `app_key` on [IPDB](https://ipdb.io/#getstarted).

```js
const BigchainDB = require('bigchaindb-driver')

const API_PATH = 'https://test.ipdb.io/api/v1/'
const conn = new BigchainDB.Connection(API_PATH, {
    app_id: 'Get one from developers.ipdb.io',
    app_key: 'Get one from developers.ipdb.io'
})
```
