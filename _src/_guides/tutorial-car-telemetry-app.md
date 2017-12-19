---
layout: guide

title: "Tutorial: How to create a digital twin of your car"
tagline: Build a telemetry app to digitally track the mileage of a car
header: header-car.jpg
order: 2

learn: >
    - How BigchainDB can be used to record dynamic parameters of an asset

    - How assets can be used on BigchainDB to represent real objects

    - How to make a `CREATE` transaction to digitally register an asset on BigchainDB

    - How asset metadata is updated by using `TRANSFER` transactions to change the state of an asset (the mileage of a car in our example)
---

Hi there! Welcome to our first tutorial! For this tutorial, we assume that you are familiar with the BigchainDB primitives (assets, inputs, outputs, transactions etc.). If you are not, familiarize yourself with [Key concepts of BigchainDB](../key-concepts-of-bigchaindb/).

# About digital twins

We are moving towards an era where the Internet of Things is becoming real. Cars become more connected, devices equipped with sensors can communicate their data, and objects become smarter and smarter. This triggers the need for a digital representation of these devices to store their data in a safe location and to have a complete audit trail of their activity. This is the core idea of the digital twin of an object.

BigchainDB is an ideal solution to create digital twins of smart devices. In this tutorial, you will learn how to build a simple and basic version of a digital twin of your car, which allows its owner to store and update the mileage of the car.

Let's get started!

{% include_relative _setup.md %}

# Create a key pair

In BigchainDB, users are represented as a private and public key pair. In our case, a key pair for Alice will be created.

For Alice, you can generate a key pair from a seed phrase using the BIP39 library, so you will just need to remember this particular seed phrase. The code below illustrates that.

```js
const alice = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed('seedPhrase').slice(0,32))
```

# Decentralized Identifier Class

In order to create different assets in BigchainDB we will use the Decentralized Identifiers which are identifiers intended for verifiable digital identity that is "self-sovereign". They do not dependent on a centralized registry, identity provider, or certificate authority.(https://w3c-ccg.github.io/did-spec/)
So in this case, each object in the real world as the car, the telemetry box, the GPS device, etc, will be represented by a DID. Each object will have a a tag or cryptochip containing a securely hidden private key.

You will create a DID class that inherits from Orm BigchainDB driver, so DID objects will have all of the methods available in Orm. The `entity` represents the public key of the object itself.  

```js

class DID extends Orm {
    constructor(entity) {
        super(
            API_PATH, {
                app_id: 'Get one from developers.ipdb.io',
                app_key: 'Get one from developers.ipdb.io'
            }
        )
        this.entity = entity
    }
}
```


So as each object has a keypair, is possible to create a DID from each object. The objects are "self-sovereign", there is not a central authority that controls them, they will just have a user or another object that will have the ownership over them. As in Orm driver, a model is needed, the default one can be used for this tutorial

```js
const car = new driver.Ed25519Keypair()
const sensorGPS = new driver.Ed25519Keypair()

const userDID = new DID(alice.publicKey)
const carDID = new DID(car.publicKey)
const gpsDID = new DID(sensorGPS.publicKey)

userDID.define("myModel", "https://schema.org/v1/myModel")
carDID.define("myModel", "https://schema.org/v1/myModel")
gpsDID.define("myModel", "https://schema.org/v1/myModel")
```


# Digital registration of an asset on BigchainDB

After having generated key pairs, you can create assets in BigchainDB. First you will create an asset representing each object. As Decentralized Identifiers are used, you can easily call the `create` method that each of them have and an asset will be created.

These assets will live in BigchainDB forever and there is no possibility to delete it. This is the immutability property of blockchain technology.

You can start creating the car asset, so the first thing needed is the definition of the asset field that represents the car. It has a JSON format:

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

As a next step, you need to generate a `CREATE` transaction that represents the user DID in BigchainDB. The user is a self-owned identity, so you will use Alice keypair to create the `userDID`

```js
userDID.myModel.create({
        keypair: alice,
        data: {
            name: 'Alice',
            bithday: '03/08/1910'
        }
    }).then(asset => {
        userDID.id = 'did:' + asset.id
        document.body.innerHTML +='<h3>Transaction created</h3>'
        document.body.innerHTML +=asset.id
    })
```

As you can see, inheriting the Orm class is very easy to create an asset in BigchainDB. The only thing needed is the keypair and the asset.
The id property is set in the DID object. This is the unique identifier of this asset.
Now you can create the DID for the car. The owner of the car is Alice, and she is the one who can transfer this asset in the future, so the Alice keypair is needed to create this asset

```js
carDID.myModel.create({
        keypair: alice,
        data: {
            vehicle
        }
    }).then(asset => {
        carDID.id = 'did:' + asset.id
        document.body.innerHTML +='<h3>Transaction created</h3>'
        document.body.innerHTML +=txTelemetrySigned.id
    })
```

For the GPS and any other piece of the car, the car is the owner of those assets, so you will need the car keypair to create these assets

```js
gpsDID.myModel.create({
        keypair: car,
        data: {
            gps_identifier: 'a32bc2440da012'
        }
    }).then(asset => {
        gpsDID.id =  'did:' + asset.id
        document.body.innerHTML +='<h3>Transaction created</h3>'
        document.body.innerHTML +=txTelemetrySigned.id

    })
```


Now you have digitally registered the parts of the car on BigchainDB, respectively in our case on IPDB.

Once a transaction ends up in a decided-valid block, it's "etched into stone". There's no changing it, no deleting it. The asset is registered now and cannot be deleted. However, the usage of the metadata field allows you to append new information in the future.


# Update of an asset on BigchainDB

In the Orm driver a so called "Update" in a normal Database, is called "Append" in blockchain, as no data can be really deleted or updated. So in order to track the mileage of the car, the GPS piece will append a new transaction containing the new updated mileage in the metadata.
Since an update of the mileage of a car does not imply any change in the ownership, your transfer transaction will simply be a transfer transaction with the previous owner (car) as beneficiary, but with new metadata in the transaction. So, technically, the car is transferring the GPS to itself and just adding additional, new information to that transaction.


```js
function updateMileage(did, newMileage){
    did.myModel
    .retrieve(did.id)
    .then(assets => {
        // assets is an array of myModel
        // the retrieve asset contains the last (unspent) state
        // of the asset
        return assets[0].append({
            toPublicKey: car.publicKey,
            keypair: car,
            data: { newMileage }
        })
    })
    .then(updatedAsset => {
        did.mileage =  updatedAsset.data.newMileage
        document.body.innerHTML +='<h3>Append transaction created</h3>'
        document.body.innerHTML +=txTelemetrySigned.id
        return updatedAsset
    })
}
```

So, finally you have now updated your asset and it is now recorded that your car has driven a distance of `newMileage`.

That's it, we have created a car asset, and every time the car travels new kilometers the `updateMileage` will be called with the new value of it, which leads to a continuous update in the car mileage.

Congratulations! You have successfully finished your first BigchainDB tutorial.
