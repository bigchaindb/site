---
layout: guide

title: "Tutorial: How to launch your own token on BigchainDB"
tagline: Learn how to use divisible assets in BigchainDB for token distribution events
header: header-token.jpg
order: 3

learn: >
    - How to use divisible assets on BigchainDB

    - How assets in BigchainDB can represent tokens

    - How tokens can be distributed to participants using TRANSFER transactions
---

Hi there! Welcome to our second tutorial about divisible assets. For this tutorial, we assume that you are familiar with the BigchainDB primitives (assets, inputs, outputs, transactions etc.). If you are not, familiarize yourself with the [Key concepts of BigchainDB](../key-concepts-of-bigchaindb/). We also assume that you have completed our [first tutorial](../tutorial-car-telemetry-app/).

# About token distribution events

In the last 12 months we have witnessed exponential growth in token distribution events. Many of them have been launched on Ethereum. Since we are experiencing rising interest in potential token launches on BigchainDB, this tutorial aims at showing a very simple approach on how to launch your own token on BigchainDB.

Note however, that we do not support ERC20 and no one has launched tokens on BigchainDB yet. This tutorial just aims at illustrating the usage of one building block, namely divisible assets. An actual token launch requires other components which are not discussed here. 

{% include_relative _setup.md %}

# Usage of divisible assets to create tokens

In BigchainDB, token generation can be represented as a divisible asset. A divisible asset is an asset that has a fixed number of sub-assets linked to it. This means that the create transaction for this asset has multiple outputs. The linked fixed sub-assets represent your tokens. When creating a divisible asset in BigchainDB, the number of the sub-assets (tokens) that you want to create needs to be specified in the beginning. That number represents your fixed total supply of tokens.

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

With these commands, we have minted 10000 tokens. For that there is an extra parameter to the `makeOutput()` function. Pay attention to give the function a string instead of a plain number. With the `tokenCreator` keypair we indicate who the owner of the tokens will be. This could for instance be the foundation issuing the tokens. Once this transaction is accepted by BigchainDB, we update the value of the tokens left in the possesion of the creator. Right now, all the tokens created are associated with the public key of the creator (`tokenCreater.publicKey`).

Now that the tokens have been minted, we can start distributing them to the owners.

# Distribute tokens

Tokens can be transferred to an unlimited number of participants. In our example, we are now going to make a transfer transaction to transfer 200 tokens to a new user called John. For that, we first need to create a new user and then do the transfer. The code below shows that.

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
You have now transferred 200 tokens to the user John. You could repeat the same with multiple other users.
With `listOutputs` using `false` as the second argument you retrieved all the outputs that were not spent yet. Then, you queried for that transaction and made a transfer to John with it. Note however, that there is also a transaction back to `tokenCreator.publicKey`. That is related to BigchainDB's transaction model. It is designed in a way that all of the inputs have to be spent in a transaction. That means that if we send part of the `tokensLeft` (200 tokens) to John, we have to send the rest (9800 tokens) back to the `tokenCreator` to preserve that amount.

Note that in our example, the supply of your tokens was fixed and cannot be changed anymore after creation. So, you would need to clearly define for yourself, how many tokens you will need. However, BigchainDB does offer the option of refillable, divisible assets that allow for a more dynamic token supply. You can learn more about that [here](https://github.com/bigchaindb/bigchaindb/issues/1741).

That's it! Now you know, how divisible assets in BigchainDB can be used as a potential building block for token launches. Of course, in practice a token distribution event is much more complex and requires other important building blocks like smart contracts etc. But, this tutorial showed you how divisible assets can play a part of that.  
