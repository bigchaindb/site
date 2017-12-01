---
layout: guide

title: Key concepts of BigchainDB
tagline: Get familiar with the transaction model of BigchainDB (inputs, outputs, assets, transactions).
order: 1

learn: >
    - How BigchainDB's transaction model works

    - What the individual components in a transaction represent

    - What a CREATE transaction is

    - What a TRANSFER transaction is
---

# About our transaction model

The first thing to understand about BigchainDB is how we structure our data. Traditional SQL databases structure data in tables. NoSQL databases extend that by using other formats to structure data (e.g. JSON, key-values etc.). At BigchainDB, we structure data as assets. Our key principle is that everything can be represented as an asset. An asset can characterize any physical or digital object that you can think of (e.g. a car, a house, a data set or an intellectual property right).
These assets can be registered on BigchainDB by users in CREATE transactions and transferred (or updated) to other users in TRANSFER transactions.
While traditionally, we design applications focusing on business processes (e.g. apps for booking & processing client orders, apps for tracking delivery of products etc.), in BigchainDB we don’t focus on processes, but on assets (e.g. a client order can be an asset that is then tracked across its entire lifecycle). This switch in perspective from a process-centric towards an asset-centric view influences much of how we build applications.

# Visualization of our transaction model

This infographic will help you understanding what CREATE and TRANSFER transactions are and what the individual components of a transaction represent (inputs, outputs, assets, metadata etc.). We will be using a simple real-life example: Martina digitally registers her bicycle on BigchainDB in a CREATE transaction and after some time transfers this bicycle to Stefan in a TRANSFER transaction.
Every concept that we describe (e.g. inputs, outputs etc.) has a more detailed description in the subsequent sections.

![](../diagram.svg)

The data model of transactions is explained in our [transaction model.](https://docs.bigchaindb.com/projects/server/en/latest/data-models/transaction-model.html)

# Asset

An asset can represent any physical or digital object from the real world. It can be a physical object like a car or a house or also a digital object like a customer order or an air mile. An asset can have one or multiple owners, but it can also be its own owner - think of e.g. an autonomous car or an IoT sensor that does transactions automatically. More information about the asset data model can be found in our [asset model](https://docs.bigchaindb.com/projects/server/en/latest/data-models/asset-model.html). An asset always contains the data that is immutable, like in our example the colour and the registration number of a bicycle. Depending on the context, an asset can represent many different things.

### An asset as a claim

An asset can represent an ownership claim for a particular object, e.g. it represents a claim that user XYZ owns the bicycle with the number XYZ. This can be valid for any type of ownership.

### An asset as a token

An asset can also represent a token. BigchainDB supports divisible assets. This means, multiple assets can be issued and attributed to one overarching asset. This can for instance be interesting for token launches.

### An asset as a versioned document

An asset can also be a versioned document with the version state in the metadata field. The version of this document can be updated on a continuous base. Every time there is a new version of the document, it could be reflected in the metadata. For further information refer to our [blog.](https://blog.bigchaindb.com/crab-create-retrieve-append-burn-b9f6d111f460)

### An asset as a time series

An asset can also represent a time series of data. For instance, an IoT sensor records its own data. The IoT sensor is the asset and every submission of its data (e.g. temperature) is represented as an update in the metadata with the latest temperature that the IoT sensor measured.

### An asset as a finite state machine

An asset can also be a state machine where the state is represented in the metadata. Each time the machine changes its state, there is a transaction (possibility to listen to it with the websocket) changing the metadata to the state.

### An asset as a permission (RBAC)

Assets could also be: roles, users, messages, (and anything which can have multiple instances in a scenario — vehicles, reports, and so on). Find more information on our [blog.](https://blog.bigchaindb.com/role-based-access-control-for-bigchaindb-assets-b7cada491997)

As you can see, there are almost no limits with respect to what an asset can represent.

# Input

Conceptually, an input is a pointer to an output of a previous transaction. It specifies to whom an asset belonged before and it provides a proof that the conditions required to transfer the ownership of that asset (e.g. a person needs to sign) are fulfilled. In a create transaction, there is no previous owner, so an input in a create transaction simply specifies, who the person is that is registering the object (this can, but must not be the person, to whom the object will belong afterwards). In a transfer transaction, an input contains a proof that the user is authorized to "spend" (transfer or update) this particular output. In practical terms, this means that with the input, a user is stating which asset (e.g. the bike) should be transferred and he is demonstrating that he or she is authorized to do the transfer of that asset. Learn more about the structure of inputs in our [input model.](https://docs.bigchaindb.com/projects/server/en/latest/data-models/inputs-outputs.html#inputs)

# Output

A transaction output specifies the conditions that need to be fulfilled to acquire ownership of a specific asset. For instance: to transfer a bicycle, a person needs to sign the transaction with her private key. This also implicitly contains the information that the public key associated with that private key is the current owner of the asset. Learn more about the data model of outputs in our [output model.](https://docs.bigchaindb.com/projects/server/en/latest/data-models/inputs-outputs.html#outputs)
Note that a transaction can also have multiple outputs. These are called divisible assets. To learn more about divisible assets, complete our [tutorial.](../tutorial-token-launch/) The output can also contain complex conditions (e.g. multiple signatures of multiple people) to acquire ownership. Learn more about that in the data model for [cryptoconditions.]( https://docs.bigchaindb.com/projects/server/en/latest/data-models/conditions.html)

# Metadata

The metadata field allows to add additional data to a transaction. This can be any type of data, e.g. the age of a bicycle, the kilometers driven etc. The good thing about the metadata is that it can be updated with every transaction. So, in contrast to the data in the asset field, the metadata field allows to add new information to every transaction. Additionally, with the release of BigchainDB 1.3, we introduced the ability to query for metadata. Read more about that on our [blog.](https://blog.bigchaindb.com/bigchaindb-version-1-3-7940cc60c767)

# Transaction ID

The ID of a transaction is a hash that identifies a transaction in a unique way. It contains all the information about the transaction in a hashed way. Find out more about the cryptography BigchainDB uses [here.] (https://docs.bigchaindb.com/projects/server/en/latest/appendices/cryptography.html#hashes)

That's it! Now you are familiar with our transaction model and you are ready to complete our first [tutorial](../tutorial-car-telemetry-app/) and get started on BigchainDB!
