---
layout: guide

title: "Tutorial: Car Telemetry App"
tagline: Learn how to build telemetry apps to track specific dynamic parameters of an asset.
header: header-car.jpg
learn: >
    - How BigchainDB can be used to build telemetry apps to track specific dynamic parameters of an asset.

    - How to make a `CREATE` transaction to create a car. Assets as representation of real objects.

    - How asset metadata is updated. In BigchainDB it is possible to use `TRANSFER` transactions to change the state of an asset, in this case the mileage of a car.
---

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

# Create a key pair for Alice

Alice will be the owner of the car, and she will be the only one able to create the asset and update the mileage field.

We can generate a keypair from a seed phrase, so we will just need to remember this seed phrase.

```js
const alice = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed('seedPhrase').slice(0,32))
```

# Create and post the asset

An asset in our case will represent an object in the real life. But it can represent a claim, a token, a version document, a finite state machine, etc. The asset will live in BigchainDB forever and there is no possibility to delete it.

First we need to define the asset field that represents the car. It has a JSON format

```js
const vehicle = {
  value: '6sd8f68sd67',
  power: {
    engine: '2.5',
    cv: '220 cv',
  }
  consumption: '10.8 l',
}
```

To post a transaction in BigchainDB, first we need to create it, then sign it and then send it. There are different methods for each step:

```js
function createCar() {
    // Construct a transaction payload
    const txCreate = BigchainDB.Transaction.makeCreateTransaction(
        {
            vehicle_number: vehicle.value,
            power: vehicle.power,
            consumption: vehicle.consumption,
            datetime: new Date().toString()
        },
        // Metadata contains information about the transaction itself
        // (can be `null` if not needed)
        {
            mileage: 0
        },
        // Output
        [BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(carOwner.publicKey))],
        carOwner.publicKey
    )
    // Sign the transaction with private keys of the owner of the car
    const txSigned = BigchainDB.Transaction.signTransaction(txCreate, carOwner.privateKey)

    // Send the transaction off to BigchainDB
    conn.postTransaction(txSigned)
        .then(() => conn.pollStatusAndFetchTransaction(txSigned.id))
        .then(res => {
            console.log('Created Transaction', txSigned)
        })
}
```

`carOwner.publicKey` can be considered as the Input for the transaction. When you sign a transaction in BigchainDB you have the rights for the next `TRANSFER` transactions that could be done with this asset. You always sign with a private key that is derivative from the seed phrase.

With the `pollStatusAndFetchTransaction` we check the status of the transaction every 0.5 seconds.

Once a transaction ends up in a decided-valid block, that's it. There's no changing it, no deleting it. But you can use `TRANSFER` transactions (with their arbitrary metadata) to store whatever you like, including information that could be interpreted as changing an asset (if that's how you want it to be interpreted).

We will use this feature to trace the mileage of the car.

Before creating the transfer transaction, we search for the last transaction with the asset id, as we will update this last transaction.

```js
conn.listTransactions(assetId)
    .then((txList) => {
        if (txList.length <= 1) {
            return txList
        }
        const inputTransactions = []
        txList.forEach((tx) =>
            tx.inputs.forEach(input => {
                // Create transactions have null fulfills by definition
                if (input.fulfills) {
                    inputTransactions.push(input.fulfills.transaction_id)
                }
            })
        )
        // In our case there should be just one input that has not beeen spent with the asseId
        return unspents = txList.filter((tx) => inputTransactions.indexOf(tx.id) === -1)
    })
```

The `listTransactions` method of BigchainDB retrieves all of the create and transfer transaction with the asset id. Then we check for the inputs that have not been spent. In this tutorial we are just working with one input and one ouput for each transaction, so there should be just one input that has not been spent yet, the one belonging to the last transaction.

We now create the transfer transaction:

```js
function updateMileage(assetId, mileageValue) {
    // Update the car with a new mileage of 55km. First we query for the asset car that we created
    conn.listTransactions(assetId)
        .then((txList) => {
            if (txList.length <= 1) {
                return txList
            }
            const inputTransactions = []
            txList.forEach((tx) =>
                tx.inputs.forEach(input => {
                    if (input.fulfills) {
                        inputTransactions.push(input.fulfills.transaction_id)
                    }
                })
            )
            // In our case there should be just one input not spend with the asseId
            return unspents = txList.filter((tx) => inputTransactions.indexOf(tx.id) === -1)
        })

        .then((tx) => {
            conn.getTransaction(tx[0].id)
                .then((txCreated) => {
                    console.log('Found', txCreated)
                    const createTranfer = BigchainDB.Transaction.makeTransferTransaction(
                        txCreated,
                        {
                            mileage: txCreated.metadata.mileage + mileageValue,
                            units: 'km'
                        }, [BigchainDB.Transaction.makeOutput(
                            BigchainDB.Transaction.makeEd25519Condition(carOwner.publicKey))],
                        0
                    )

                    // Sign with the owner of the car as she was the creator of the car
                    const signedTransfer = BigchainDB.Transaction.signTransaction(createTranfer, carOwner.privateKey)
                    console.log('signed Transfer trans', signedTransfer)
                    conn.postTransaction(signedTransfer)
                        .then(() => conn.pollStatusAndFetchTransaction(signedTransfer.id))
                        .then(res => {
                            console.log('Transfer Transaction ', signedTransfer.id, 'accepted','with ', mileageValue, 'km',)
                        })
                })
        })
}
```

Once we have the last transaction we create the transfer transaction with the new metadata value. We also need an output to preserve the ownership of the car and the index of the input being spent. In this case that's Alice and the input being spent is 0, as there is just one input. Then we sign the transaction and we send it to BigchainDB.

That's it, we have created a car asset, and every time the car travels new kilometers the `updateMileage` should be called with the new value of it.
