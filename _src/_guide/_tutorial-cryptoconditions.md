---
layout: guide

title: "Tutorial: How to create a pull request with different conditions for reviews"
tagline: Learn how to use crypto-conditions for pull requests in GitHub using signatures for reviews, assignments and merges.
header: header-crypto.jpg
order: 4

learn: >

    - How to use cryptoconditions in BigchainDB

---

Hi there! Welcome to our next tutorial about crypto-conditions. For this tutorial, we assume that you are familiar with the BigchainDB primitives (assets, inputs, outputs, transactions etc.). If you are not, familiarize yourself with the [Key concepts of BigchainDB](../key-concepts-of-bigchaindb/). We also assume that you have completed our [first tutorial](../tutorial-car-telemetry-app/) and have a basic understanding of [crypto-conditions.](https://the-ipdb-transaction-spec.readthedocs.io/en/latest/transaction-components/conditions.html) 


# About GitHub issues and pull requests

The interaction among developers on Github is a prime example of collaboration, where multiple parties usually need to coordinate, align and approve different suggestions. This makes it a useful example for the potential usage of a BigchainDB feature: crypto-conditions. Crypto-conditions are a tool that allows to design complex signature schemes, where multiple parties need to sign to approve, respectively trigger and event.
Today, GitHub gives you the possibility of signing your commits before publishing that. Leveraging that, you could use crypto-conditions to create different conditions that need to be fulfilled before merging a pull request (PR). 
For the sake of the tutorial, think of the following setting: let's imagine you belong to a very cool startup called "SmartAntsLabs" based in Berlin. The start-up works with open-source projects. Now you have discovered a bug and you want to report it. You create an issue on Github and you accept a PR to solve the issue. You expect the developer team to make a contribution to this PR. At least one of them should create a commit in the PR. Once that happens and the PR is ready, someone needs to assign it to the QA team. In the QA team let's imagine there is needed 3 total votes. Then once that happens it could be send it to the production where just 1 signature out of 3 people who belong to this team is needed to merge the pull request.

{% include_relative _setup.md %}

# Create threshold-sha-256 condition

So, first things first. Initially, you need to represent the Github issue as an asset in BigchainDB. But it will have special conditions, as in the output you should indicate that just one signature (one private key) is needed in order to send the Pull request associated with it to the QA team. So imagine there are 3 developers in your SmartAntsLabs startup.

```js
//Users will be needed to create the cryptoconditions
const dev1 = new BigchainDB.Ed25519Keypair()
const dev2 = new BigchainDB.Ed25519Keypair()
const dev3 = new BigchainDB.Ed25519Keypair()
// The creator of the issue
const creator = new BigchainDB.Ed25519Keypair()

// at the output of the transaction to-be-spent
// Set threshold 1, so just one signature is needed to create the PR and send it to the QA team.
const threshold = 1
const condition1 = BigchainDB.Transaction.makeEd25519Condition(dev1.publicKey, false)
const condition2 = BigchainDB.Transaction.makeEd25519Condition(dev2.publicKey, false)
const condition3 = BigchainDB.Transaction.makeEd25519Condition(dev3.publicKey, false)

const thresholdCondition = BigchainDB.Transaction.makeThresholdCondition(threshold, [condition1, condition2, condition3])
```

Each condition is of type Ed25519, and combining together you can create the so called Threshold Condition. Set parameter `threshold` to 1, as it will just need 1 of the developers, no matters who of them, to sign later the transaction.


# Fulfill inputs in different ways

Now with the `thresholdCondition` you can generate an output in the same way you used to do it, calling the `makeOutput` method of the Js driver


```js
let output = BigchainDB.Transaction.makeOutput(thresholdCondition);
// Set public keys, as the makeThresholdCondition does not that
output.public_keys = [dev1.publicKey, dev2.publicKey, dev3.publicKey];

// Create the transaction
let makeTransaction = BigchainDB.Transaction.makeCreateTransaction({
        issue: '#16',
        datetime: new Date().toString()
    },
    // Metadata contains information about the transaction itself
    // (can be `null` if not needed)
    {
        state: 'Issue created.'
    },
    // Output
    [output],
    // Issuers
    creator.publicKey
)

// Sign the transaction with private key of the creator
const txSigned = BigchainDB.Transaction.signTransaction(makeTransaction, creator.privateKey)

// Send the transaction to BigchainDB
conn.postTransactionCommit(txSigned)
    .then(res => {
        document.body.innerHTML +='<h3>Transaction created</h3>';
        document.body.innerHTML +=txSigned.id
    })

```
Apart from make the output with the correspond function, you need to provide the public keys of the users who will have the ownership of that output. Then you just create the transaction with the output that you have created, and the signature of the creator of the pull request.

In this way you are transferring the ownership of the issue to the developers. They will have now the chance to work with this object in BigchainDB, and just with one signatures of them will be enough to transfer this object in BigchainDB again.

So let's imagine that a developer of SmartAntsLabs has fixed the issue in a new pull request that he has created. He provides his private key in order to make a transfer transaction in BighchainDB and give the ownership of it to the QA person. She will be the only one who can review it, give an okey and moving forward with the PR.



```js
function createPR() {
    // Transfer the asset to the QA team
    const QAperson = new BigchainDB.Ed25519Keypair()
    let createTranfer = BigchainDB.Transaction.makeTransferTransaction(
        txSigned,
        {
            state: "Pull request created"
        }, [BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(receiver.publicKey))],
        0
    )

    // at the input of the spending transaction
    // Create and sign fulfillments to fulfill the cryptoconditions. Just one signature is enough, then one private keys is needed.
    let fulfillment1 = BigchainDB.Transaction.makeEd25519Condition(dev2.publicKey, false)
    //Sign the fulfillment with the created transfer
    fulfillment1.sign(
        new Buffer(BigchainDB.Transaction.serializeTransactionIntoCanonicalString(createTranfer)),
        new Buffer(base58.decode(dev2.privateKey))
    )

    const threshold = 1
    // 1 out of 3 need to sign the fulfillment. Still condition1 and condition3 are needed as the "circuit definition" is needed.
    // See https://github.com/bigchaindb/cryptoconditions/issues/94
    let fulfillment = BigchainDB.Transaction.makeThresholdCondition(threshold, [fulfillment1, condition1, condition3], false)


    const fulfillmentUri = fulfillment.serializeUri()
    // Finally set the fulfillment for the input. That is to sign the transaction
    createTranfer.inputs[0].fulfillment = fulfillmentUri

    // Post the transaction to BigchainDB
    conn.postTransactionCommit(createTranfer)
        .then(res => {
          document.body.innerHTML +='<h3>Transaction created</h3>';
          document.body.innerHTML +=createTranfer.id
        })
}
```

Now the ball is in the QA person. She reviews the impact in the UI of the software, do some tests and she is ready to approve the changes. Once that happens the PR will be send to the production team. They are going to make sure while testing in the test network that the changes made work seamless and are ready for a production environment.


In the production team of SmartAntsLabs there are 4 people but with different experience as there is one intern and recently one person has joined the super SmartAntsLabs startup. So with his review the PR will not be approved as there should be someone with more experience who also review the the PR. In order to create this scenario, the intern will have 1 vote as well as an early employee and the two other two seniors production women will have 2 votes each one.


```js

//Production team
const intern = new BigchainDB.Ed25519Keypair()
const earlyEmployee = new BigchainDB.Ed25519Keypair()
const senior1 = new BigchainDB.Ed25519Keypair()
const senior2 = new BigchainDB.Ed25519Keypair()

// At the output of the transaction to-be-spent
// Create subcondition where early employee and intern have to approve. Is a 2 out of 2
const thresholdSubconditions = 2
const subCondition1 = BigchainDB.Transaction.makeEd25519Condition(intern.publicKey, false)
const subCondition2 = BigchainDB.Transaction.makeEd25519Condition(earlyEmployee.publicKey, false)

const condition3 = BigchainDB.Transaction.makeThresholdCondition(thresholdSubconditions, [subCondition1, subCondition2], false)

// Then create the other scenarios. All together is a 1 out of 3, as just one scenario is needed
const thresholdProduction = 1
const condition1 = BigchainDB.Transaction.makeEd25519Condition(senior1.publicKey, false)
const condition2 = BigchainDB.Transaction.makeEd25519Condition(senior2.publicKey, false)
//Threshold of the whole scenarios
const thresholdCondition = BigchainDB.Transaction.makeThresholdCondition(thresholdProduction, [condition1, condition2, condition3])

let output = BigchainDB.Transaction.makeOutput(thresholdCondition);

// Set public keys, as the makeThresholdCondition does not that. All of the public keys involved in any subcondition are needed
output.public_keys = [senior1.publicKey, senior2.publicKey, inter.publicKey, earlyEmployee.publicKey];

// Create the transfer transaction
let createTranfer = BigchainDB.Transaction.makeTransferTransaction(
    txSigned,
    {
        state: "Send to production"
    },
    [output],
    0
)

// Sign the transaction with private key of the qa person
const transferToProduction = BigchainDB.Transaction.signTransaction(createTranfer, QAperson.privateKey)

// Send the transaction to BigchainDB
conn.postTransactionCommit(transferToProduction)
    .then(res => {
        document.body.innerHTML ='<h3>Transfer transaction created</h3>';
        document.body.innerHTML +=transferToProduction.id
    })

```

Generally there is a threshold condition 1 out of 3 possible scenarios:
 1. Senior 1 approves
 2. Senior 2 approves
 3. Intern and early employee approve

So just with the occurrence of one, the next transfer transaction can be done. For that first you create a subcondition which is that both the intern and the early employee has to sign to fulfill this subcondition. That is represented as `condition3` in the code, then with the other conditions of the senior members you can create the threshold condition. Finally the QA person signs the transaction and send it to BigchainDB.

Is the turn of the production team. The intern starts to look at the issue, try to run it but the senior is on the same task and harnessing her experience she finish the review before and approve the PR and merge it to the master branch.

```js

// Public key that private key is very difficult to generate
const burnPublicKey = 'burnburnburnburnburnburnburnburnburnburnburn'
// Create the transfer transaction
let transferApprove = BigchainDB.Transaction.makeTransferTransaction(
    transferToProduction,
    {
        state: "Approved. Merged"
    },
    [[BigchainDB.Transaction.makeOutput(
        BigchainDB.Transaction.makeEd25519Condition(burnPublicKey.publicKey))]],
    0
)

let fulfillmentSenior = BigchainDB.Transaction.makeEd25519Condition(senior1.publicKey, false)
// The only one that need to sign is the senior1
fulfillment1.sign(
    new Buffer(BigchainDB.Transaction.serializeTransactionIntoCanonicalString(transferApprove)),
    new Buffer(base58.decode(senior1.privateKey))
);

// Still condition1 and condition3 are needed as the "circuit definition" is needed.
let fulfillment = BigchainDB.Transaction.makeThresholdCondition(threshold, [fulfillmentSenior, condition2, condition3],false)
//Sign the transaction
const fulfillmentUri = fulfillment.serializeUri()
transferApprove.inputs[0].fulfillment = fulfillmentUri

conn.postTransactionCommit(transferApprove)
    .then(res => {
      document.body.innerHTML ='<h3>Transfer transaction created</h3>';
      document.body.innerHTML +=transferApprove.id
    })


```

The public key `burnPublicKey` is such that is very unlikely and almost impossible to generate a private key that match with this public key, so none will be able to use fulfill the condition for this output for making an input of a transaction with it. Just a senior person is needed, so as long as there is a fulfillment signed with a private key from a senior, the transaction can be done.

That's it! Now you know, how cryptoconditions in BigchainDB can be used to create a pull request with different conditions and roles in order to merge it.
