
---
layout: guide

title: "Tutorial: How to create a digital track of a piece of art"
tagline: Build a digital track of a famous paint that you own
header: header-car.jpg
order: 2

learn: >
    - How BigchainDB can be used to record dynamic parameters of an asset

    - How assets can be used on BigchainDB to represent real objects

    - How to make a `CREATE` transaction to digitally register an asset on BigchainDB

    - How asset to create `TRANSFER` transactions to change the ownership of an asset in BigchainDB
---

Hi there! Welcome to our first tutorial! For this tutorial, we assume that you are familiar with the BigchainDB primitives (assets, inputs, outputs, transactions etc.). If you are not, familiarize yourself with [Key concepts of BigchainDB](../key-concepts-of-bigchaindb/).

# About digital object

We are moving towards an era where the Internet of Things is becoming real. Cars become more connected, devices equipped with sensors can communicate their data, and objects become smarter and smarter. This triggers the need for a digital representation of these devices to store their data in a safe location and to have a complete audit trail of their activity. This is the core idea of the digital twin of an object.

BigchainDB is an ideal solution to create digital twins of smart devices. In this tutorial, you will learn how to build a simple and basic version of a digital twin of your car, which allows its owner to store and update the mileage of the car.

Let's get started!

{% include_relative _setup.md %}

# Create a key pair

In BigchainDB, users are represented as a private and public key pair. In our case, a key pair for Alice will be created. Alice will be the owner of the car, and she will be the only one able to update the mileage of the car. Using her public key, anyone can also verify that Alice is the creator of the car.

You can generate a key pair from a seed phrase using the BIP39 library, so you will just need to remember this particular seed phrase. The code below illustrates that.

```js
const alice = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed('seedPhrase').slice(0,32))
```

# Digital registration of an asset on BigchainDB

After having generated a key pair, you can create transactions in BigchainDB, so you can start registering your paint in BigchainDB. This corresponds to an asset creation. In our case, an asset will represent an object in real life, namely a paint. This asset will live in BigchainDB forever and there is no possibility to delete it. This is the immutability property of blockchain technology.

The first thing needed is the definition of the asset field that represents the car. It has a JSON format:

```js
const paint = {
  name: 'Meninas',
  author: 'Diego Rodríguez de Silva y Velázquez'
  place: 'Madrid',
  year: '1656'
}
```

As a next step, you need to generate a `CREATE` transaction to link the defined asset to the user Alice. There are three steps to post this transaction in BigchainDB, first you create it, then sign it and then send it. There are different methods for each step:

```js
function createPaint() {
    // Construct a transaction payload
    const txCreateCar = BigchainDB.Transaction.makeCreateTransaction(
        // Asset field
        {
            ...paint,
        },
        // Metadata field, contains information about the transaction itself
        // (can be `null` if not needed)
        // Initialize the mileage with 0 km
        {
            datetime: new Date().toString(),
            location: 'Madrid',
            value: {
              value_eur: '2500000€',
              value_btc: '220',
            }
        },
        // Output. For this case we create a simple Ed25519 condition
        [BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(alice.publicKey))],
        // Issuers
        alice.publicKey
    )
    // The owner of the paint signs the transaction
    const txSigned = BigchainDB.Transaction.signTransaction(txCreateCar,
        alice.privateKey)

    // Send the transaction off to BigchainDB
    conn.postTransaction(txSigned)
        // Check the status of the transaction every 0.5 seconds.
        .then(() => conn.pollStatusAndFetchTransaction(txSigned.id))
        .then(res => {
          document.body.innerHTML +='<h3>Transaction created</h3>';
          document.body.innerHTML +=txSigned.id
          // txSigned.id corresponds to the asset id of the car
        })
}
```

Now you have digitally registered the car on BigchainDB, respectively in our case on IPDB. `txSigned.id` is an id that uniquely identifies your asset. Note that the metadata field is used to record values along with the transaction, as every transaction can have new metadata.

Once a transaction ends up in a decided-valid block, it's "etched into stone". There's no changing it, no deleting it. The asset is registered now and cannot be deleted. However, the usage of the metadata field allows you to do updates in the asset. For this, you can use `TRANSFER` transactions (with their arbitrary metadata) to store any type of information, including information that could be interpreted as changing an asset (if that's how you want it to be interpreted).


# Transfer an asset on BigchainDB

Since an update of the mileage of a car does not imply any change in the ownership, your transfer transaction will simply be a transfer transaction with the previous owner (Alice) as beneficiary, but with new metadata in the transaction. So, technically, Alice is transferring the car to herself and just adding additional, new information to that transaction.

Before creating the transfer transaction, you need to search for the last transaction with the asset id, as you will transfer this specific last transaction:


The `listTransactions` method of BigchainDB retrieves all of the create and transfer transactions with a specific asset id. Then, we check for the inputs that have not been spent yet. This indicates the last transaction. In this tutorial, we are just working with one input and one output for each transaction, so there should be just one input that has not been spent yet, namely the one belonging to the last transaction.

Based on that, we can now create the transfer transaction:

```js
function transferOnwership(txCreated, newOwner) {
    // Update the paint with a new
    // First, we query for the asset paint that we created
    const createTranfer = BigchainDB.Transaction.
    makeTransferTransaction(
        txCreated, {
            mileage: txCreated.metadata.mileage + mileageValue,
            units: 'km'
        }, [BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(
                newOwner.publicKey))],
        0
    )

    // Sign with the owner of the car as she was the creator of the car
    const signedTransfer = BigchainDB.Transaction
        .signTransaction(createTranfer, carOwner.privateKey)
    conn.postTransaction(signedTransfer)
        .then((signedTransfer) => conn
            .pollStatusAndFetchTransaction(signedTransfer.id))
        .then(res => {
            document.body.innerHTML += '<h3>Transfer Transaction created</h3>'
            document.body.innerHTML += res.id
        })
}
```

Note again that in the output of this transfer transaction we have `newOwner.publicKey`. This shows that Alice is transferring the ownership of the Meninas to anybody else. Furthermore, the input being spent is 0, as there is just one input.

So, finally you sign the transaction and send it to BigchainDB. You have now updated your asset and it is now not anymore you who will be able to transfer again the paint.

That's it, we have created a paint asset.

Congratulations! You have successfully finished your first BigchainDB tutorial.
