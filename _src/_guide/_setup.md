# Setup

Start by installing the official BigchainDB [JavaScript driver](https://github.com/bigchaindb/js-bigchaindb-driver) or [Python driver](https://github.com/bigchaindb/bigchaindb-driver):

```bash
npm i bigchaindb-driver
```

```bash
pip install -U bigchaindb-driver
```

Then, include that as a module and connect to any BigchainDB node. You can create your own `app_id` and `app_key` on [BigchainDB Testnet](https://testnet.bigchaindb.com).

```js
const BigchainDB = require('bigchaindb-driver')
const bip39 = require('bip39')

const API_PATH = 'https://test.bigchaindb.com/api/v1/'
const conn = new BigchainDB.Connection(API_PATH, {
    app_id: 'Get one from testnet.bigchaindb.com',
    app_key: 'Get one from testnet.bigchaindb.com'
})
```

```python
from bigchaindb_driver import BigchainDB
from bigchaindb_driver.crypto import generate_keypair

bdb = BigchainDB(
    'https://test.bigchaindb.com',
    headers={'app_id': 'Get one from testnet.bigchaindb.com',
             'app_key': 'Get one from testnet.bigchaindb.com'})
alice = generate_keypair()
tx = bdb.transactions.prepare(
    operation='CREATE',
    signers=alice.public_key,
    asset={'data': {'message': ''}})
signed_tx = bdb.transactions.fulfill(
    tx,
    private_keys=alice.private_key)
bdb.transactions.send(signed_tx)
```
