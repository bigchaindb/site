# Setup

Start by installing the official BigchainDB [JavaScript driver](https://github.com/bigchaindb/js-bigchaindb-driver), [Python driver](https://github.com/bigchaindb/bigchaindb-driver) or [Java driver](https://github.com/bigchaindb/java-bigchaindb-driver):

```bash
# JavaScript driver
npm i bigchaindb-driver
```

```bash
# Python driver
pip install -U bigchaindb-driver
```

```xml
<!-- Java driver, in pom.xml for Maven users -->
<dependency>
	<groupId>com.bigchaindb</groupId>
	<artifactId>bigchaindb-driver</artifactId>
	<version>1.0</version>
</dependency>
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

```python
from bigchaindb_driver import BigchainDB

conn = BigchainDB(
    'https://test.bigchaindb.com',
    headers={'app_id': 'Get one from testnet.bigchaindb.com',
             'app_key': 'Get one from testnet.bigchaindb.com'})
```

```java
BigchainDbConfigBuilder
	.baseUrl("https://test.bigchaindb.com/")
	.addToken("app_id", "Get one from testnet.bigchaindb.com")
	.addToken("app_key","Get one from testnet.bigchaindb.com").setup();
```
