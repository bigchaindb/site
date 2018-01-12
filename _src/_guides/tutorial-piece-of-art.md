
---
layout: guide

title: "Tutorial: How to create a digital record of a piece of art"
tagline: Build a digital certificate of a famous painting that you own
header: header-car.jpg
order: 2

learn: >

    - How assets can be used on BigchainDB to represent real objects

    - How to make a `CREATE` transaction to digitally register an asset on BigchainDB

    - How to create `TRANSFER` transactions to change the ownership of an asset in BigchainDB

    - How BigchainDB can be used to record dynamic parameters of an asset

---

Hi there! Welcome to our first tutorial! For this tutorial, we assume that you are familiar with the BigchainDB primitives (assets, inputs, outputs, transactions etc.). If you are not, familiarize yourself with [Key concepts of BigchainDB](../key-concepts-of-bigchaindb/).

# About digital representations of assets

We are moving towards an era where every physical object has a digital representation in a database. This can be in the form of a certificate, a simple entry in a database or another form of digital footprint. In the past, this used to be the paper trail associated with the purchase of a car, a painting or any other type of asset. Today, digital is slowly replacing analog in most aspects of our life. Thanks to advances in cryptography, we are reaching a point where even ownership claims of a specific object don't need to be a signed paper certificate anymore. This allows digitization to move to a new level. BigchainDB as a solution is suited perfectly to act as a digital asset registration and tracking tool.  

Using the example of the digital registration of a famous painting you own, in this tutorial you will learn how to register an asset on BigchainDB and how to digitally transfer the ownership of this asset to someone else. The example is for illustrative purposes. For a real life application, there would be additional components that would need to be included.

Let's get started!

{% include_relative _setup.md %}

# Creation of a key pair

Before starting, you need to create a user in BigchainDB. In BigchainDB, users are represented as a private and public key pair. In our case, a key pair for Alice will be created. Alice will be the owner of the painting, and she will be the only one able to make changes to the digital representation of the painting. Using her public key, anyone can also verify that Alice is the owner of the painting.

You can generate a key pair from a seed phrase using the BIP39 library, so you will just need to remember this particular seed phrase. The code below illustrates that.

```js
const alice = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed('seedPhrase').slice(0,32))
```

# Digital registration of an asset on BigchainDB

Now, let's assume that Alice is extremely lucky and gets to acquire the famous painting "Las Meninas" by the Spanish painter Diego Velázquez at a fantastic price during an auction held by the Spanish museum "museo nacional del prado". Now, she wants to ensure that she can digitally certify that she is the owner of this painting. For this reason, she wants to register the painting as an asset on BigchainDB to have an immutable claim. This corresponds to a CREATE transaction in BigchainDB. Using her key pair, Alice can create an asset on BigchainDB. In your case, the asset will represent an object in real life, namely the painting "Las Meninas". This asset will live in BigchainDB forever and there is no possibility to delete it.

The first step required is the definition of the asset field that represents the painting. This field contains the data about the asset that is immutable. It has a JSON format:

```js
const painting = {
    name: 'Meninas',
    author: 'Diego Rodríguez de Silva y Velázquez'
    place: 'Madrid',
    year: '1656'
}
```

As a next step, you need to generate a `CREATE` transaction to link the defined asset to the user Alice. There are three steps to post this transaction in BigchainDB. First you create it, then sign it and then send it. There are different methods for each step. Here, we are illustrating one of them:

```js
function createPaint() {
    // Construct a transaction payload
    const txCreatePaint = BigchainDB.Transaction.makeCreateTransaction(
        // Asset field
        {
            painting,
        },
        // Metadata field, contains information about the transaction itself
        // (can be `null` if not needed)
        {
            datetime: new Date().toString(),
            location: 'Madrid',
            value: {
                value_eur: '25000000€',
                value_btc: '2200',
            }
        },
        // Output. For this case we create a simple Ed25519 condition
        [BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(alice.publicKey))],
        // Issuers
        alice.publicKey
    )
    // The owner of the painting signs the transaction
    const txSigned = BigchainDB.Transaction.signTransaction(txCreatePaint,
        alice.privateKey)

    // Send the transaction off to BigchainDB
    conn.postTransaction(txSigned)
        // Check the status of the transaction
        .then(() => conn.pollStatusAndFetchTransaction(txSigned.id))
        .then(res => {
            document.body.innerHTML += '<h3>Transaction created</h3>';
            document.body.innerHTML += txSigned.id
            // txSigned.id corresponds to the asset id of the painting
        })
}
```

Now Alice has digitally registered her painting on BigchainDB. Alice's public key appears in the output, specifying that she is the owner of the painting. `txSigned.id` is an id that uniquely identifies your asset (your asset id). Note that the metadata field is used to record values along with the transaction (e.g. the price of the painting). This is a field that can be different in every transaction (as every transaction can have different metadata, because e.g. the price of the painting changes).

Once a transaction ends up in a decided-valid block, it's "etched into stone". There's no changing it, no deleting it. The asset is registered now and cannot be deleted. However, the usage of the metadata field allows you to do updates in the asset. For this, you can use `TRANSFER` transactions (with their arbitrary metadata) to store any type of information, including information that could be interpreted as changing an asset (if that's how you want it to be interpreted).

# Transfer of an asset on BigchainDB

Now, let's assume Alice has sold her painting in a good deal to someone else and she wants to digitally reflect that transfer. In BigchainDB, this would correspond to a TRANSFER transaction. For this, you first need to create a new key pair for a new owner (newOwner). For simplicity, this step is left out in the code below.

The `getTransaction` method allows us to search for a transaction having its id, as we need the complete transaction to make transfer transaction.
Based on that, we can now create the transfer transaction:

```js
function transferOwnership(txCreatedID, newOwner) {
    const newUser = new BigchainDB.Ed25519Keypair()
    // Get transaction payload by ID
    conn.getTransaction(txCreatedID)
        .then((txCreated) => {
            const createTranfer = BigchainDB.Transaction.
            makeTransferTransaction(
                // The output index 0 is the one that is being spent
                [{
                    tx: txCreated,
                    output_index: 0
                }],
                [BigchainDB.Transaction.makeOutput(
                    BigchainDB.Transaction.makeEd25519Condition(
                        newOwner.publicKey))],
                {
                    datetime: new Date().toString(),
                    value: {
                        value_eur: '30000000€',
                        value_btc: '2100',
                    }
                }
            )
            // Sign with the key of the owner of the painting (Alice)
            const signedTransfer = BigchainDB.Transaction
                .signTransaction(createTranfer, alice.privateKey)
            return conn.postTransaction(signedTransfer)
        })
        .then((signedTransfer) => conn
            .pollStatusAndFetchTransaction(signedTransfer.id))
        .then(res => {
            document.body.innerHTML += '<h3>Transfer Transaction created</h3>'
            document.body.innerHTML += res.id
        })
}
```

Note again that in the output of this transfer transaction we have `newOwner.publicKey`. This shows that Alice has transferred the ownership of the Meninas to anybody else (newOwner). Furthermore, the input being spent is 0, as there is just one input. Additionally, note that the metadata field was used to update information about the painting (the price of the transaction, which increased to 30 mn. EUR etc.).

You have now updated your asset and it is now not anymore Alice who will be able to transfer the painting, because someone else is now the owner.

That's it, we have created a digital representation of a painting and transferred the ownership to another user.

Congratulations! You have successfully finished your first BigchainDB tutorial.
