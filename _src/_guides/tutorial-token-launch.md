---
layout: guide

title: "Tutorial: Token distribution launch"
tagline: Build a token launch with BigchainDB
header: header-token.jpg

learn: >
    - How BigchainDB can be used to record the transactions made by a token distribution launch

    - How to use divisible assets on BigchainDB
---

We show how divisible assets work in BigchainDB by showing how you could create your own token launch on BigchainDB. The token distribution is represented by divisible assets (tokens) linked to one specific application (company/network).

# Setup

Start by installing the official [BigchainDB JavaScript driver](https://github.com/bigchaindb/js-bigchaindb-driver):

```bash
npm i bigchaindb-driver
```

Then include as a module and connect to IPDB or any BigchainDB node:

```js
const BigchainDB = require('bigchaindb-driver')

const API_PATH = 'https://test.ipdb.io/api/v1/'
const conn = new BigchainDB.Connection(API_PATH, {
    app_id: '2db4355b',
    app_key: 'b106b7e24cc2306a00906da90de4a960'
})
```

# Create divisible asset

When creating a divisible asset in BigchainDB, the number of the sub-assets that you want to create should be specified.

```js
const nTokens = 10000
let tokensLeft

function tokenLaunch() {

    const tx = BigchainDB.Transaction.makeCreateTransaction({
            token: tokenName.value,
            number_tokens: nTokens
        }, {
            datetime: new Date().toString()
        }, [BigchainDB.Transaction.makeOutput(BigchainDB.Transaction.makeEd25519Condition(tokenCreator.publicKey), nTokens.toString())],
        tokenCreator.publicKey
    )

    // Sign the transaction with private keys
    const txSigned = BigchainDB.Transaction.signTransaction(tx, tokenCreator.privateKey)

    conn.postTransaction(txSigned)
        .then(() => conn.pollStatusAndFetchTransaction(txSigned.id))
        .then(res => {
            lastTx = txSigned.id
            console.log('Create Transaction', txSigned, 'accepted')
            tokensLeft = nTokens
        })
}
```

We have decided to create 10000 tokens. For that there is an extra parameter to the `makeOutput()` function. Pay attention to give the function a string instead of a plain number. With the `tokenCreator` keypair we indicate who the owner of the tokens will be. Once the transaction is accepted by BigchainDB we update the value of the tokens left in the possesion of the creator.

Once the tokens are created we can start to spread it over our users.

# Transfer tokens

```js
const amountToSend = 200

function transferTokens() {
    const newUser = new BigchainDB.Ed25519Keypair()

    conn.listOutputs(tokenCreator.publicKey, 'false')
        .then((txs) => {
            conn.getTransaction(txs[0].transaction_id)
                .then((tx) => {
                    console.log('the search found', tx)

                    const createTranfer = BigchainDB.Transaction.makeTransferTransaction(
                        tx, {
                            tranferTo: 'john'
                        }, [BigchainDB.Transaction.makeOutput(
                                BigchainDB.Transaction.makeEd25519Condition(tokenCreator.publicKey), (tokensLeft - amountToSend).toString()),
                            BigchainDB.Transaction.makeOutput(
                                BigchainDB.Transaction.makeEd25519Condition(newUser.publicKey), amountToSend)
                        ],
                        0
                    )
                    const signedTransfer = BigchainDB.Transaction.signTransaction(createTranfer, tokenCreator.privateKey)
                    conn.postTransaction(signedTransfer)
                        .then(() => conn.pollStatusAndFetchTransaction(signedTransfer.id))
                        .then(res => {
                            tokensLeft -= amountToSend
                            console.log('Transfer Transaction', signedTransfer.id, 'accepted')
                        })
                })
        })
}
```

With `listOutputs` using `false` as the second argument we can retrieve all the outputs that were not spent yet. Then we query for that transaction and we make a transfer with it. As the transaction model of BigchainDB is designed, all of the inputs have to be spent in a transaction. That means that if we send part of the `tokensLeft` to some user, we have to send the rest to the `tokenCreator` to preserve that amount.
