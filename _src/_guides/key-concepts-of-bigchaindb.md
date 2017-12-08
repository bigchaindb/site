---
layout: guide

title: Key concepts of BigchainDB
tagline: Get familiar with our transaction model 
Assets, Inputs, Outputs, and Transactions
order: 1

learn: >
    - How BigchainDB's transaction model works

    - What each component in a transaction represents

    - What a `CREATE` transaction is

    - What a `TRANSFER` transaction is
---

# About our transaction model

The first thing to understand about BigchainDB is how we structure our data. Traditional SQL databases structure data in tables. NoSQL databases use other formats to structure data such as JSON and key-values, as well as tables. At BigchainDB, we structure data as assets. We believe anything can be represented as an asset. An asset can characterize any physical or digital object that you can think of like a car, a data set or an intellectual property right.

These assets can be registered on BigchainDB in two ways. (1) By users in `CREATE` transactions. (2) Transferred (or updated) to other users in `TRANSFER` transactions.
Traditionally, people design applications focusing on business processes (e.g. apps for booking & processing client orders, apps for tracking delivery of products etc). At BigchainDB, we don’t focus on processes rather on assets (e.g. a client order can be an asset that is then tracked across its entire lifecycle). This switch in perspective from a process-centric towards an asset-centric view influences much of how we build applications.

# Visualization of our transaction model

This infographic will help you understanding what `CREATE` and `TRANSFER` transactions are and what the individual components of a transaction represent (inputs, outputs, assets, metadata etc.). Lets use a simple real-life example: Martina digitally registers her bicycle on BigchainDB in a `CREATE` transaction. After some time, she transfers this bicycle to Stefan in a `TRANSFER` transaction.

Every concept that we describe (e.g. inputs, outputs etc.) is discussed in further detail below. 

<img class="image--create-transfer" src="../diagram.png" srcset="../diagram@2x.png 2x, ../diagram.png 1x" alt="BigchainDB CREATE and TRANSFER transactions" />

The data model of transactions is explained in our [transaction model](https://the-ipdb-transaction-spec.readthedocs.io/en/latest/introduction.html).

# Asset

An asset can represent any physical or digital object. It can be a physical object like a car or a house. Or it can be a digital object like a customer order or an air mile. An asset can have one or multiple owners, but it can also be its own owner. Think of an autonomous car or an IoT sensor that does transactions automatically. More information about the asset data model can be found in our [asset model](https://the-ipdb-transaction-spec.readthedocs.io/en/latest/transaction-components/asset.html). An asset always contains data that is immutable. In our example, the color and the registration number of a bicycle is immutable data. 

Depending on the context, an asset can represent many different things.

### An asset as a claim

An asset can represent an ownership claim for a particular object, e.g. it represents a claim that User ABC owns the bicycle with the number XYZ. This can be valid for any type of ownership.

### An asset as a token

An asset can also represent a token. BigchainDB supports divisible assets. This means, multiple assets can be issued and attributed to one overarching asset. This can for instance be interesting for token launches.

### An asset as a versioned document

An asset can also be a versioned document with the version stated in the metadata field. The version of this document can be updated on a continuous basis. Every time there is a new version of the document, it could be reflected in the metadata. For further information refer to our [blog](https://blog.bigchaindb.com/crab-create-retrieve-append-burn-b9f6d111f460).

### An asset as a time series

An asset can also represent a time series of data. For instance, an IoT sensor records its own data. The IoT sensor is the asset and every submission of its data (e.g. temperature) is represented as an update in the metadata with the latest temperature that the IoT sensor measured.

### An asset as a state machine

An asset can also be a state machine where the state transition is represented in the metadata. Each time the machine changes its state, a transaction is triggered to update the metadata to the new state (possibility to listen to it with the WebSocket).

### An asset as a permission (RBAC)

Assets could also be: roles, users, messages, (and anything which can have multiple instances in a scenario — vehicles, reports, and so on). Find more information on our [blog](https://blog.bigchaindb.com/role-based-access-control-for-bigchaindb-assets-b7cada491997).

As you can see, there are almost no limits with respect to what an asset can represent.

# Input

Conceptually, an input is a pointer to an output of a previous transaction. It specifies to whom an asset belonged before and it provides a proof that the conditions required to transfer the ownership of that asset (e.g. a person needs to sign) are fulfilled. In a CREATE transaction, there is no previous owner, so an input in a CREATE transaction simply specifies who the person is that is registering the object (this is usually the same as the initial owner of the asset). In a TRANSFER transaction, an input contains a proof that the user is authorized to "spend" (transfer or update) this particular output. In practical terms, this means that with the input, a user is stating which asset (e.g. the bike) should be transferred. He also demonstrates that he or she is authorized to do the transfer of that asset. Learn more about the structure of inputs in our [input model](https://the-ipdb-transaction-spec.readthedocs.io/en/latest/transaction-components/inputs.html).

# Output

A transaction output specifies the conditions that need to be fulfilled to change the ownership of a specific asset.. For instance: to transfer a bicycle, a person needs to sign the transaction with her private key. This also implicitly contains the information that the public key associated with that private key is the current owner of the asset. Learn more about the data model of outputs in our [output model](https://the-ipdb-transaction-spec.readthedocs.io/en/latest/transaction-components/outputs.html).

Note that a transaction can also have multiple outputs. These are called divisible assets. To learn more about divisible assets, complete our [tutorial.](../tutorial-token-launch/) The output can also contain complex conditions (e.g. multiple signatures of multiple people) to acquire ownership. Learn more about that in the data model for [crypto-conditions](https://the-ipdb-transaction-spec.readthedocs.io/en/latest/transaction-components/conditions.html).

# Metadata

The metadata field allows users to add additional data to a transaction. This can be any type of data, like the age of a bicycle or the kilometers driven. The good thing about the metadata is that it can be updated with every transaction. In contrast to the data in the asset field, the metadata field allows to add new information to every transaction. Additionally, with the release of BigchainDB V1.3, we introduced the ability to query for metadata. Read more about that on our [blog.](https://blog.bigchaindb.com/bigchaindb-version-1-3-7940cc60c767)

# Transaction ID

The ID of a transaction is a unique hash that identifies a transaction. It contains all the information about the transaction in a hashed way. Find out more about the cryptography BigchainDB uses [here.](https://the-ipdb-transaction-spec.readthedocs.io/en/latest/common-operations/crypto-hashes.html)

That's it! Now you're familiar with our transaction model and ready to complete our first [tutorial](../tutorial-car-telemetry-app/) and get started on BigchainDB!
