---
layout: guide

title: "Tutorial: How to create a digital twin of your car"
tagline: Build a telemetry app to digitally track the mileage of a car
header: header-car.jpg
order: 3

learn: >
    - How BigchainDB can be used to record dynamic parameters of an asset

    - How decentralized identifiers can represent objects in BigchainDB

    - How asset metadata is updated by using `TRANSFER` transactions to change the state of an asset (the mileage of a car in our example)
---

Hi there! Welcome to our next tutorial! For this tutorial, we assume that you are familiar with the BigchainDB primitives (assets, inputs, outputs, transactions etc.). If you are not, familiarize yourself with [Key concepts of BigchainDB](../key-concepts-of-bigchaindb/).

# About digital twins

We are moving towards an era where the Internet of Things is becoming real. Cars become more connected, devices equipped with sensors can communicate their data, and objects become smarter and smarter. This triggers the need for a digital representation of these devices to store their data in a safe location and to have a complete audit trail of their activity. This is the core idea of the digital twin of an object.

BigchainDB is an ideal solution to create digital twins of smart devices. In this tutorial, you will learn how to build a simple and basic version of a digital twin of your car, which allows its owner to store and update the mileage of the car. The car contains a GPS tracker to submit the mileage and the car, as well as the GPS sensor will have their own identity.

Let's get started!

{% include_relative _setup.md %}

# Creation of a key pair

In BigchainDB, users are represented as a private and public key pair. In our case, a key pair for Alice will be created.

For Alice, you can generate a key pair from a seed phrase using the BIP39 library, so you will just need to remember this particular seed phrase. The code below illustrates that.

```js
const bip39 = require('bip39')

const seed = bip39.mnemonicToSeed('seedPhrase').slice(0,32)
const alice = new BigchainDB.Ed25519Keypair(seed)
```

```python
from bigchaindb_driver.crypto import generate_keypair

alice = generate_keypair()
```

```java
net.i2p.crypto.eddsa.KeyPairGenerator edDsaKpg = new net.i2p.crypto.eddsa.KeyPairGenerator();

KeyPair alice = edDsaKpg.generateKeyPair();
```

# Decentralized Identifier Class

In telemetry applications, certain objects like in our case e.g. the car, need to have an identity to conduct actions in the system. Ideally, this identity is not controlled by anyone, such that the device can truly act autonomously. For these use cases, in BigchainDB we will use decentralized identifiers (DID) which are identifiers intended for verifiable digital identity that is "self-sovereign". They do not dependent on a centralized registry, identity provider, or certificate authority. You can learn more about it in our [DID specification](https://w3c-ccg.github.io/did-spec/).

So in our app, each object in the real world as the car, the telemetry box in the car, the GPS device, etc. will be represented by a DID. Each object will have a tag or cryptochip containing a securely hidden private key that serves as unique identity.

You will create a DID class that inherits from Orm BigchainDB driver, so DID objects will have all of the methods available in Orm. The `entity` represents the public key of the object itself.

Start by installing [Orm BigchainDB JavaScript driver](https://github.com/bigchaindb/js-driver-orm):

```bash
npm i bigchaindb-orm
```

Then create your DID class:

```js
const Orm = require('bigchaindb-orm')

class DID extends Orm {
    constructor(entity) {
        super(API_PATH)
        this.entity = entity
    }
}
```

So as now each object has its own keypair, it is possible to create a DID from each object. The objects are thus "self-sovereign", there is not a central authority that controls them. They will just have a user or another object that will have the ownership over them. Because in our Orm driver, a model is needed, the default one can be used for this tutorial.

```js
const car = new BigchainDB.Ed25519Keypair()
const sensorGPS = new BigchainDB.Ed25519Keypair()

const userDID = new DID(alice.publicKey)
const carDID = new DID(car.publicKey)
const gpsDID = new DID(sensorGPS.publicKey)

userDID.define("myModel", "https://schema.org/v1/myModel")
carDID.define("myModel", "https://schema.org/v1/myModel")
gpsDID.define("myModel", "https://schema.org/v1/myModel")
```

As you can see, every object or actor (alice, car, GPS sensor) has now its own key pair and identity in our system.

# Digital registration of assets on BigchainDB

After having generated key pairs (and identities), you can now create the actual assets in BigchainDB. There will be three assets in our system: the car, the user and the GPS sensor. Therefore, as a first step you will create an asset representing each object. As decentralized identifiers are used, you can easily call the `create` method that each of them have and an asset will be created.

These assets will now live in BigchainDB forever and there is no possibility to delete them. This is the immutability property of blockchain technology.

For creating the first asset you can generate a `CREATE` transaction that represents the user DID in BigchainDB as an asset. The user is a self-owned identity, so you will use Alice's keypair to create the `userDID`.

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
As you can see, by inheriting the Orm class it is very easy to create an asset in BigchainDB. The only thing needed is the keypair and the asset.

The id property is set in the DID object. This is the unique identifier of this asset.

In order to create the asset of the car you first need to define the asset field that represents the car. It has a JSON format:

```js
const vehicle = {
  value: '6sd8f68sd67',
  power: {
    engine: '2.5',
    hp: '220 hp',
  }
  consumption: '10.8 l',
}
```

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


Now you have digitally registered the parts of the car on BigchainDB, respectively in our case on the BigchainDB test network.

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
