---
layout: guide

title: Key concepts of BigchainDB
description: Understand the transaction model of BigchainDB (identity, inputs, outputs, assets, transactions)
image: image.jpg
---

- Introduction: How do we structure data?
- Explain asset-centric paradigm of bigchainDB
- High-level components and relationship of components in a transaction => possibly illustrate with a graph, similar to CLI
- Illustrate example we are going to use

One of the most important aspects to understand about BigchainDB is how we structure our data. Traditional SQL databases structure data in tables, so the fundamental primitive is a table. NoSQL databases extend that by using other formats to structure data (e.g. JSON, key-values etc.). At BigchainDB, we structure data as assets. Our key principle is that everything can be represented as an asset. An asset can characterize any physical or digital object that you can think of (e.g. a car, a house, a data set or an intellectual property right).

At it’s core, an asset is a JSON document containing information of a particular object (e.g. type of car, vehicle registration number etc.), representing that object in the digital world. An asset is usually owned by someone (user) and this ownership can be transferred to another person or entity in a transaction. A transaction has an input and an output. BigchainDB is therefore a system to digitally track ownership and transactions of ownership of assets. Ownership does not necessarily mean legal ownership. It can also be e.g. “temporary” ownership, such as a logistics company temporarily holding a product while transporting it to a warehouse and then “transferring” this temporary ownership to the warehouse. Sounds complicated? Don’t worry. That’s what this guide is here for.

The only thing we want you to understand now, is that BigchainDB takes an asset-centric view and that our primitives are assets, inputs, outputs and transactions (more on that later). While traditionally, we design applications focusing on business processes (e.g. apps for booking & processing client orders, apps for tracking delivery of products etc.), in BigchainDB we don’t focus on processes, but on assets (e.g. a client order can be an asset that is then tracked across its entire lifecycle), which are transferred from one user to the next user. This influences much of how we build applications.

Maybe insert graphic
Maybe introduce an example that we can use for the entire section?

Important: Every concept will contain links to the tutorials, where this concept is used and possibly also to the docs or blogposts for more details

# Identity

What is a user in BDB? (public and private key pair)

The first and most basic thing to understand in BigchainDB and Blockchain in general, is how a user is represented. While in traditional applications, a user is mapped as a username and a corresponding password, in BigchainDB, identity is represented as a combination of a public key (username) and private key (password).

Explain public and private key

A public key is an address that all users can see, just as your username. You use the public key as the address, where you direct a transaction to. The private key is used to create a digital signature for a transaction of an asset, to proof that you are the rightful (temporary) owner, resp. holder of this asset. Other users can use your public key to verify that this digital signature was generated using your private key. You can find more detailed descriptions of private and public key cryptography (insert link)
Seems like we shouldn’t put here the name of our PKI’s parters

Explain, that we don’t offer solutions for private/public key storage

One of the main differences between private/public keys and usernames/passwords is that private keys are really only held by one user. There is no functionality that allows you to retrieve your private key, in case you lose it. Therefore, private keys need to be stored very safely. There is an entire industry focusing on providing solutions for safe storage of private keys. BigchainDB doesn’t offer a specific solution. It is the responsibility of the key holder to store it safely. A list of providers of safe key storage can be found here (insert link).

## Encrypting vs. Signing

When encrypting, you use their public key to write message and they use their private key to read it. Encryption helps ensure to protect sensitive data and preserve confidentiality and privacy

When signing, you use your private key to write message's signature, and they use your public key to check if it's really yours. Signing data helps ensure: Data Integrity , Message Authentication (Proof of Origin) and Non-repudiation

Include Decentralized Identify specification => tbd on wednesday
DIF will work on a broad array of identity initiatives, ranging from a system to move identity away from centralized actors and provide decentralized access to services, to integrating blockchain technology with biometrics, to a utility-like service that links business processes with blockchain-based timestamps as a way of proving the identity and actions of users across organizations

## Code example

Creation of a public/private key pair in JS (and maybe Py)
Show, how to generate key pairs from a seed
In Js from a seedPhrase:

```js
const keypair = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed(seedPhrase).slice(0,32))
```

# Assets

What is an asset? => Link to docs for details (data model etc.)

An asset can represent any physical or digital object from the real world. It can be a physical object like a car or a house or also a digital object like a customer order or an air mile. An asset can have one or multiple owners, but it can also be its own owner - think of e.g. an autonomous car or an IoT sensor that does transactions automatically. More information about the asset data model can be found here and here.

How to move from a process to an asset-driven model? How to think with assets?
What does an asset look like? (data model, graphical illustration)/How is an asset used in an application

```js
const assetdata = {
        'bicycle': {
                'serial_number': 'abcd1234',
                'manufacturer': 'Bicycle Inc.',
        }
}
```

How to use the asset and metadata field in an application:

Explain difference between mutable and immutable elements of assets (mutable field and metadata)

BigchainDB is an immutable database. It means that every asset you create will be there forever. An asset in BigchainDB contains two fields, the “asset” and the “metadata”. The asset field (mandatory) is something that you can never modify once you create it while the metadata field (optional) you will be able to modify it.
There are two possibilities to update an asset:
Make a transaction, so the metadata field can be updated.
Create a new asset with new data pointing to the asset you want to modify
Namespace (app/permission/type/instance/user)
Query ALREADY IN FUNCTIONALITIES

Schema
Timestamp
Values

## What types of assets exist?

As already mentioned several times, assets can represent any types of object. This implies that there are different “models” of what an asset can represent.

### an asset as a claim (simple create with a message)

In the most traditional and simple case, an asset could represent an ownership claim of a piece of art, a research paper or a Smart Contract. In this case, an asset is a digital certificate that user XYZ owns asset XYZ.

### an asset as a token (divisible assets - create your token launch on bigchainDB)

Assets can also be divisible. This means that one asset can consist of different units. An asset can be divisible as many times as you wish.
A token distribution event is a good example of a divisible asset in BigchainDB. You can do your own token distribution event on BigchainDB by issuing a divisible asset with a fixed supply of associated tokens.

### an asset as a versioned document (CRAB)

An asset can also be a versioned document with the version state in the metadata field. The version of this document can be updated on a continuous base. Every time there is a new version of the document, it could be reflected in the metadata. The update would be a transfer transaction to the public key of the asset, where the transfer transaction contains the information about the version update in the metadata. For further information refer to (https://blog.bigchaindb.com/crab-create-retrieve-append-burn-b9f6d111f460)

### an asset as a time series (IOT devices that always append their latest value(s) as a TRANSFER, the current state is the unspent)

An asset can also represent a time series of data. For instance, an IoT sensor records its own data. The IoT sensor is the asset and every submission of its data (e.g. temperature) is represented as a transfer transaction, where the metadata is updated with the latest temperature that the IoT sensor measured.

### an asset as finite state machine: each state transition is a transfer

An asset can also represent a state machine where the state is represented in the metadata. Each time the machine changes it state, there is a transaction (possibility to listen to it with the websocket) changing the metadata to the state.

### An asset as a state (e.g. in smart contracts)

An asset can represent the functionality or security of a smart contract. Every time the smart contracts changes, there is a transaction reflecting the new functionalities and securities of the updated smart contract. (Ref to Jolocom project)

### an asset as a supply chain tracker of an object

Every single product can have a clear record of its history and verifiable authenticity.

### an asset as a permission (RBAC)

Assets could be also: roles, users, messages, (and anything which can have multiple instances in a scenario — vehicles, reports, and so on). (https://blog.bigchaindb.com/role-based-access-control-for-bigchaindb-assets-b7cada491997)

### an asset as an access control token (eg API's check BDB if there is a token assigned to your pubkey)

An

### an asset as an information channel (like the hashtag "#" on twitter - requires "link" - )

An

## Code example

Creation of an asset using JS (and maybe Py)

```js
const txCreateAliceSimple = driver.Transaction.makeCreateTransaction(
        assetdata,
        metadata,

        // A transaction needs an output
        [ driver.Transaction.makeOutput(
                driver.Transaction.makeEd25519Condition(alice.publicKey))
        ],
        alice.publicKey
)
```

Include other drivers: cli, jave, ORM, graphql

```js
bdbOrm.myModel
    .create({
        keypair: aliceKeypair,
        data: { key: 'dataValue' }
    })
    .then(asset => {
        /*
            asset is an object with all our data and functions
            asset.id equals the id of the asset
            asset.data is data of the last (unspent) transaction
            asset.transactionHistory gives the full raw transaction history
            Note: Raw transaction history has different object structure then
            asset. You can find specific data change in metadata property.
        */
        console.log(asset.id)
    })
```


Things to remark:

- The number of inputs = outputs in transaction
- Outputs as locks and inputs as keys that unlock them
- In a transaction you just work with one and just one asset. This will have to be changed in the future for Ocean, as several assets are needed in a transaction.
- In divisible assets, you have to spend all of the inputs in a transaction, it means the inputs that you want to remain to yourself, you still need to send to yourself in the transaction.


# Output

What is an output? => Link to docs for details (data model etc.)
Frame functionally to show logic: an output describes conditions to acquire ownership of asset, incl. Some examples

What are the components of an output (conditions, amount etc.)?

## Code example

Representation of an output in JS (and maybe Py)

# Input

What is an input? => Lused ink to docs for details (data model etc.)

How to “spend” an output:

- Either by transferring ownership right
- Or, by updating its metadata

What does an input look like? (data model, graphical illustration)
What are the components of an input (owners before, fulfillment etc.)?

## Code example

Representation of an input in JS (and maybe Py)

# Transactions

What are transactions in BigchainDB?
What types of transactions are there in BigchainDB
Show big picture for application developers: convert business processes to asset-centric flow with creates, transfers, links

## CREATE transaction

What is a create transaction?

Operations of transactions (what is a create transaction used for?)
What does a create transaction look like? (data model, graphical illustration)
What are the components of a create transaction (previous owner etc.)?

### Code example

Representation of a create transaction in JS (and maybe Py)

## TRANSFER transaction

What is a transfer transaction?

Operations of transactions (what is a transfer transaction used for?)
What does a transfer transaction look like? (data model, graphical illustration)
What are the components of a transfer transaction (Asset ID etc.)?

### Code example

Representation of a create transaction in JS (and maybe Py)
