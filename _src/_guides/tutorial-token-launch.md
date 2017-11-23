---
layout: guide

title: "Tutorial: How to launch your own token on BigchainDB"
tagline: Learn how to use divisible assets in BigchainDB for token distribution events
header: header-token.jpg

learn: >
    - How to use divisible assets on BigchainDB

    - How assets in BigchainDB can represent tokens

    - How tokens can be distributed to participants using TRANSFER transactions
---

Hi there! Welcome to our second tutorial about divisible assets. For this tutorial, we assume that you are familiar with the BigchainDB primitives (assets, inputs, outputs, transactions etc.). If you are not, familiarize yourself with [Key concepts of BigchainDB](../key-concepts-of-bigchaindb/).

# About token distribution events

In the last 12 months we have witnessed exponential growth in token distribution events. Most of them have been launched on Ethereum. Since we are experiencing rising interest in potential token launches on BigchainDB, this tutorial aims at showing a very simple approach on how to launch your own token on BigchainDB.

Note however, that we do not support ERC20 and no one has launched tokens on BigchainDB yet. This tutorial just aims at showing one possible approach.

{% include_relative _setup.md %}

# Usage of divisible assets to create tokens

BigchainDB supports divisible assets. A divisible asset is an asset that has a fixed number of sub-assets linked to it. These fixed sub-assets that are linked to it, represent your tokens. When creating a divisible asset in BigchainDB, the number of the sub-assets (tokens) that you want to create needs to be specified. That represents your fixed total supply of tokens.

The code below illustrates how to create a divisible asset with 10 000 tokens associated to it.

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

Now, we have minted 10 000 tokens. For that there is an extra parameter to the `makeOutput()` function. Pay attention to give the function a string instead of a plain number. With the `tokenCreator` keypair we indicate who the owner of the tokens will be. Once the transaction is accepted by BigchainDB we update the value of the tokens left in the possession of the creator.

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
