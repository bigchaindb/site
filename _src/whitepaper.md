---
layout: page

title: Bigchain: A Scalable Blockchain Database
---

Trent McConaghy, Rodolphe Marques, Andreas Müller
ascribe GmbH, Berlin, Germany

(Draft) Dec 31, 2015

**Abstract**

This paper describes Bigchain, a blockchain database technology capable of 100,000 transactions per second throughput and storing petabytes of data. It is suitable for deployment as trustless public blockchain databases, as well as permission-controlled blockchain databases for private trust networks. The Bitcoin blockchain has sparked dreams of an open, global database that could transform the financial system and the broader Internet, with long-term positive implications for society. However, the Bitcoin blockchain has major scalability and governance issues. There are several proposals to scale the blockchain, from proof of stake to side chains; we discuss the challenges of these.  Bigchain is an alternative that draws on ideas from cryptography engineering, distributed databases, the domain name system (DNS), and an innovation we call blockchain pipelining. Rather than trying to scale up a blockchain, we add decentralized characteristics to an existing, scalable, battle-hardened distributed database. We present a thorough description of Bigchain, and experimental results.

# Introduction

The Internet - especially the World Wide Web [8]  - has fundamentally reshaped society in the last two decades. The 90s Web started out open, free-spirited, and democratic. In the past 15 years, power has consolidated across social media platforms and the cloud.  People around the world have come to trust and rely on these services, which offer a reliability and ease of use that limited the early Internet. However, each service is massively centralized and vulnerable to hacking.
An antidote to centralized services and a concentration of power is to re-imagine and re-create our Internet via decentralized networks, to give people control over their data, assets and redistribute power to the networks.

Satoshi Nakamoto's invention of Bitcoin has sparked a new phase for the Internet that promises a large positive impact on society.

The Bitcoin blockchain [64] has emerged as the world’s first public database that uses a decentralized network to validate transactions. The Bitcoin blockchain points to the potential to enable a new phase for the Internet that is open and democratic but also easy to use and trust  [77][2][63]. It is intrinsically democratic, or at the very least disintermediating. It is also trustworthy: cryptography that enables the conduct of trustworthy transactions with strangers without needing to trust them, and without needing a brand as proxy.

As a database, the Bitcoin blockchain has some novel characteristics: anyone can add to it, anyone can read from it, nothing gets deleted, and no one owns or controls it. Like many databases, it is replicated, so that entries are auto-synced in copies throughout the database network. It enables a new approach to digital assets, where only the holder of the asset’s private key can transact on that asset. This means hackers or compromised sys admins cannot arbitrarily change data. There is no single-point-of-failure risk.

**But the Bitcoin blockchain has a fatal flaw: it doesn’t scale.**

When the Bitcoin blockchain is measured by traditional databases standards, it’s terrible: throughput is just a few transactions per second (tps), latency before a confirmed write is 10 minutes, and capacity is just a few dozen Gb. Furthermore, adding nodes causes more problems: with a doubling of nodes, network traffic quadruples with no improvement in throughput, latency, or capacity.

Blockchains hold great promise to rewire modern financial systems, supply chains, creative industries, and even the Internet itself. But these existing systems and the Internet need scale: throughput of up to millions of transactions per second (or higher), latency less than a second (or even ms), and capacity of petabytes or more. These needs exceed the performance of the Bitcoin blockchain by many orders of magnitude.

For these needs to be realized, a blockchain needs big performance: high throughput, low latency, high capacity, and efficient network usage.

**The blockchain wants to be big.**

In addition to scalability problems, the Bitcoin blockchain has governance problems: there is an oligarchy of miners, and a handful of core developers who can’t agree on how to implement scalability, and whether to discourage transactions not tied to Bitcoin as a currency (BTC) [18].

This paper first explores how well scalable blockchain needs are met by existing technologies:

Section 2 - the Bitcoin blockchain,
Section 3 - blockchain scalability proposals,
Section 4 - scaling up, lessons from Machine Learning,
Section 5 - distributed databases (DBs), and
Section 6 - trusted Internet-scale databases.

None of the existing technologies meet all our needs. However, each provides hints at a solution.

Our approach is to “block-chainify big data” using the distributed computing tools that have been powering the Internet for 20 years. We call the approach Bigchain. Bigchain addresses the scalability and governance issues of the Bitcoin blockchain.
We elaborate upon Bigchain in:

Table 1 - Bigchain compared to traditional blockchains and distributed DBs,
Section 7 - Bigchain detailed description,
Section 8 - Bigchain permissioning & roles,
Section 9 - Bigchain benchmarks,
Section 10 - Bigchain deployment, and
Section 11 - Conclusion

# Review: Bitcoin Blockchain

This section sets out how Bitcoin performs with respect to scalability and governance.

Technically speaking, a blockchain is a distributed database that solves the “Byzantine Generals + Sybil Attacks” problem [49]. In the Byzantine Generals problem [67], nodes need to agree on some value for a database entry, with the constraint that the nodes don’t necessarily get along. The Sybil Attack problem [28] arises when one or more nodes figure out how to get an unfairly disproportionate vote in the course of agreeing: think “attack of the clones.” Some have proposed to label the combination of the two the “Strong Byzantine Generals’ ” (SBG) problem [49].

## Bitcoin Scalability

Throughput. The Bitcoin network processes just 1 transaction per second (tps) on average, with a theoretical maximum of 7 tps [11]. It could handle higher throughput if each block was bigger, though right now that leads to size issues (see Capacity and network bandwidth below). This is unacceptably low compared to the number of transactions processed by Visa (2,000 tps typical, 10,000 tps peak) [9], Twitter (5,000 tps typical, 15,000 tps peak), advertising networks (500,000 tps typical), trading networks, or email networks (up to 1M tps). An ideal global blockchain, or set of blockchains, would support all of these multiple high-throughput needs.
Latency. Each block on the Bitcoin network takes 10 minutes to process. For sufficient security, one should wait for about an hour. For larger transfer amounts, latency needs to be longer to outweigh the cost of a double spend attack. By comparison, a transaction on the Visa network is approved in seconds at most.
Capacity and network bandwidth. The blockchain is 50 Gb large, and grew by 24Gb in 2015 [14]. It already takes a long time to download (e.g. 1 day). If throughput increased by 2,000x to Visa standards, that would result in a database growth of 3.9Gb/day  or 1.42 Pb/year. At 150,000 tps, the blockchain would grow by 214 Pb/year. If throughput were 1M tps, throughput would be so high that it would swamp the bandwidth of any node’s connection, which is counterproductive to the democratic goals of Bitcoin.

## Bitcoin Governance

There are three governance issues in the current version of Bitcoin.
First, just a handful of mining pools and ASIC builders control the whole network. It is clear from the Bitcoin whitepaper that Satoshi Nakamoto did not anticipate this. Now, an oligarchy of fewer than 10 mining pools has emerged, as illustrated in Figure 1. There is nothing preventing these organizations from colluding [58]. Collusion among just a few of these pools could mean disaster for the Bitcoin blockchain. Even single pools like GHash.io keep bumping up against 51% control [58] of the network. Proof-of-Work (POW) based decentralization is nice in theory, but in practice it has led to extreme centralization.

Second, a handful of developers are able to change the code governing the Bitcoin blockchain. The block size debate [56][78][11] has demonstrated that consensus for a relatively modest 8x in throughput has been difficult to achieve. It would be naïve to expect these core developers to agree to the fundamental changes needed for a million-fold improvement anytime soon.

Third, many of the core developers believe that the Bitcoin blockchain should only be for Bitcoin itself. They treat non-BTC transactions, such as moving fiat, certifying diamonds, or notarizing, as “dust” [18], and have taken action by charging ever-larger fees for individual transactions (about 3 cents these days) [15]. While this point is subjective, in practice it will prevent the Bitcoin blockchain from becoming a general global database.

# Review: Blockchain Scalability Proposals

Here, we review proposals to solve the Strong Byzantine Generals’ (SBG) problem while scaling the blockchain, and more generally to have blockchain-like behavior at greater scales.

## Base Consensus Approaches

The approaches differ by how a node becomes a voting node, and how their voting weight is set.

**Proof of Work (POW)**. This is the baseline approach used by the Bitcoin blockchain. There is no restriction on who can enter the network as a voter. A node is chosen at random, proportional to its computational power (hash rate).

Work may be SHA256 hashing (e.g. Bitcoin), scrypt hashing (e.g. Litecoin), or something else. This has a natural tendency towards centralization: a contest to garner the most hashing power. Power is currently held by a handful of well-funded ASIC mining companies (e.g. KNC miner) and mining pools (e.g. GHash.io).

Another issue with POW is the incredible energy cost of the Bitcoin blockchain. In stark contrast to global efforts to minimize energy costs, the Bitcoin blockchain incentivizes spending as much electricity as economically possible given the value of BTC. While this is not a flaw in the POW itself, it is an inevitable and undesirable outcome of the POW model.

Section 2 provides additional information on the pitfalls of the Bitcoin blockchain, and by extension the POW model.

**Proof of Stake (POS)** [10]. POS promises lower latency and does not have the extreme computational requirements of POW.

In the POS model, there is no restriction on who can enter the network. To validate a block, a node is chosen at random, proportionally to how much “stake” it has. “Stake” is a function of the amount of coin held, and sometimes of “coin age” (e.g. how many days have passed since last time the coin voted).

In the last couple years, POS proposals evolve as issues are identified (e.g. “nothing at stake” and “rich get richer”), and fixes proposed. To handle the identified issues, current POS protocols have become increasingly complex. Complex systems generally have more vulnerabilities, compromising security.

**Federation**. Each federation has its own rules about who can join as voter. Typically each member of the federation has an equal vote.

Membership rules for voters can vary widely. In the (pre-acquisition) Hyperledger model, the requirement was a TLD and SSL certificate [13]. In Stellar, membership had been based on a social network, until it got forked [47]. In the Tendermint [52] and Ethereum Slasher [20][21] proposals, anyone could join by posting a fixed bond as a security deposit. The voter lost the bond if they acted maliciously. The value of bond is greater than the benefit from being malicious.

Federations may have a small or large number of voting nodes. Each model comes with a tradeoff: many nodes has higher latency, and few nodes is not as “decentralized” as many would like.

Membership rules directly affects the size of the federation. For example, in Tendermint, the lower the bond, the more voting nodes there are.

## Consensus Mashups

The base consensus approaches can be creatively combined.

**Hierarchy of POW - Centralized**. Big Bitcoin exchanges operate their own internal databases of transactions, then synchronize a summary of the transactions with the blockchain now and then. This is how stock exchanges work (e.g.  a hierarchy of the New York Stock Exchange through bank “dark pools”).

**Hierarchy of Small Federation - Big Federation**. An example is AI Coin [1]. The top level has 5 power nodes, and the bottom level has 50 nodes.

**Hierarchy of POW – Federation**. An example is Factom [33]. The bottom level is a document store, and the top level is the Bitcoin blockchain, which has a Merkle tree root hash of the last 10 minutes’ worth of documents.

**POW then POS**. An example is the Ethereum rollout plan. The motivation is: if one starts with pure POS then no one has any coins, so anyone owning coins can dominate. So, the idea is to kick-start coin ownership with POW, followed by POS once everything stabilizes.

**X then Centralized then X’**. This happens when the consensus algorithm X gets broken, so the voting becomes temporarily handled by the project’s managing entity, until a fixed version of algorithm X is developed and released. One example is Stellar. It started as a federation, but got forked [47]. So, it ran on a single server in early 2015 while a new consensus protocol [59] was developed and released in April 2015 [48]. Another example is Peercoin, one of the first POS variants. But a fork occurred, and in early 2015 the developer had to sign transactions until the fix was released [68].

**And more**. The above is just a sampling; there continue to be innovations. A case-in-point is Bitcoin-NG [78] which aims to reduce latency to first confirmation while minimizing all other changes to the Bitcoin blockchain design.

## Engineering Optimizations

This section reviews some of the options available to improve the efficiency and throughput of existing blockchain consensus models.

**Shrink Problem Scope**. One trick to minimize the size of the blockchain is to only keep unspent outputs. This works if the history of transactions is not important. But in many blockchain applications, from art provenance to supply chain tracking, history is crucial.  Another trick, called Simple Payment Verification (SPV), is to only store each block header rather than the full node. It allows the node to check if a given transaction is in the block without actually holding the transactions. This is fine, making it easier for nodes to participate in the network, but doesn’t solve the core consensus problem. Cryptonite is an example that combines several of these style tricks [26].

**Different POW hashing algorithm**. Litecoin and others use scrypt hashing which needs about 2/3 less computational effort than SHA256 hashing (used by Bitcoin). However, that doesn’t improve scalability, because it still creates an arms race of computational power among miners.

**Compression**. Data on the blockchain has a particular structure, so it’s conceivable that one could get one or more orders of magnitude compression out of it. This is a nice trick without much compromise for a simple transaction ledger. However, if we’re also trying to store media (e.g. images), since media already has highly optimized compression and media files are far larger than the rest of the transaction data, then it won’t help those cases.

**Better BFT Algorithm**. The first solution to the Byzantine Generals’ problem was published in 1982 [54], and since that time many proposals have been published at distributed computing conferences and other venues. Modern examples include Aardvark [24] and Robust Byzantine Fault Tolerance (RBFT) [3]. These are certainly useful, but in general would not be able to bring about orders of magnitude improvement.

**Multiple Independent Chains**. Here, each chain focuses on a particular set of users or use cases. It is the blockchain version of the Internet’s Rule 34: “If it exists there is blockchain of it.” For example, you can use Dogecoin if you want a laugh, or use Primecoin if you want POW to be slightly more helpful to the world. The countless existing databases of the world operate in this principle right now. Each has a specific use case. But these databases have centralized control, of course. For decentralized control, a big challenge is security: anything with a small overall vote weight (computational power, “stake”) is at risk. POW blockchains would have a difficult time getting enough mining power to prevent a targeted attack. It is a similar challenge for POS stake.

**Multiple Independent Chains with Shared Resources for Security**. Pegged sidechains are the most famous example, where mining among chains has the effect of being merged [4]. SuperNET [36] and Ethereum’s hypercubes and multichain proposals [22] fit in this category too. However, if the goal is simply to get a database to run at scale, it adds cognitive and engineering complexity to break it into many heterogeneous sub-chains.  

## Bitcoin’s Scalability-Killing Technology Choices

The Bitcoin blockchain has three characteristics that cause poor scaling:

1. **Each node stores all data**. The prevailing “wisdom” is that to be decentralized, each full node must store a copy of all the data. This copy is kept on a single hard drive (or in memory); there is no support to distribute storage across many hard drives / machines. Ironically, this forces centralization: as the size of the DB grows then only those with the resources to hold all data will be able to participate.

2. **Broadcast network**. Bitcoin uses a simple broadcast network to propagate transactions, which makes it O(N2) in the number of nodes in terms of bandwidth overhead, e.g. if there were 10x more transactions, it would cause 100x more network traffic. Right now every new node has 6,500 nodes worth of communication to deal with.

3. **POW voting**. The Bitcoin network takes an incredible amount of resources to choose a leader to verify the next round of transactions. Despite all these resources, first confirmations still take on average 10 minutes. In Bitcoin this is by design; Litecoin and other alternative coin systems (“altcoins”) reduce the latency, but compromise security.

Any single one of these characteristics prevents Bitcoin blockchain from scaling up to Internet levels. None of the previous works have addressed all three. So, a necessary but not sufficient constraint in Bigchain design is to avoid these three technology choices.

# Scaling Up: Lessons from Machine Learning

The machine learning field can offer insight into successful approaches to scaling up.

## Historical

In the field of artificial intelligence (AI), including its sub-field machine learning (ML), for decades the prevailing wisdom was “let’s make it work on a toy problem, then just scale up the algorithm to larger problems.” This strategy may seem reasonable at first glance. However, it never worked. In fact it was counter-productive to the AI community: AI researchers would get interesting results on a toy problem, make grand pronouncements, not reach those targets, and disappoint those they’d made the pronouncements to (including, alas, their funders). This pattern was repeated with block world experiments in the 50s, vision experiments in the 60s, expert systems in the 80s, neural networks in the 90s, and support vector machines and evolutionary algorithms in the 00s.

## Halevy, Norvig, and Pereira (Google)

In the seminal paper “The Unreasonable Effectiveness of Data” [39], Google researchers showed a remarkable result on a suite of machine learning problems: with every 10x increase in the amount of model training data, the accuracy increased, and the best-performing algorithm changed. Not only did the best-performing algorithm change with more data, it got simpler. Some of the very best algorithms were rooted in ideas from the 1950s, such as perceptron learning [72].

It’s hard to understate the importance of these results: as the problem got larger, the prevailing algorithm had to be completely tossed out, and replaced by another, simpler algorithm.

## McConaghy (KUL / Solido)

One of the authors of this paper (Trent McConaghy) has had similar experiences in several AI / ML projects over the last 15 years. In one project, the challenge was to scale analog circuit topology synthesis. The baseline was an approach that used 1,000 cores and ran for a month, with non-trustworthy results [50]. The first four prototypes all used unconstrained genetic programming with no embedded knowledge, and got 10x-100x; but the results were still not trustworthy. Then Trent took a pause, threw everything away, and tried something new – designing a new language for analog circuits. The result was a 10,000x speedup (10 cores, 4 hours) and trustworthy results [60].

In another project, the aim was to extract interpretable (whitebox) regression models from training data. Trent had managed to get about 10x speedup from the baseline, using grammar-constrained genetic programming. But it still took 10 min on 1 core, and could only handle up to 50 variables. Once again Trent took a pause, threw everything away, and tried something new - in this case large-scale regularized linear learning combined with specially chosen basis functions. The new approach took 0.1s on 1 core, a 3,600x speedup; and could scale to 10,000 variables (200x improvement) [61]. Now, this algorithm has now been deployed thousands of times for designing cutting-edge computer chips for the likes of Nvidia [51] and TSMC [65].

Figure 2: accuracy (test error) vs. training time for four model-building approaches. FFX was 3,600x faster than the status quo (GP-SR) while maintaining accuracy.

## Lessons Learned

The common thread from these works is: to get to scale, the status quo approach had to be completely tossed out, and replaced by another. What did remain was the specification of inputs and outputs. Algorithm design needs to consider scale from the start. It might seem like a trivial idea, but remember: every researcher has their pet algorithms; to truly get to scale, the researchers need let go of their pet. This takes courage, or at the very least, discipline. What really matters, the algorithm or scale?

# Scaling Up: “Big Data” Distributed Databases

## Introduction

As section 3 reviewed, the Bitcoin community has spent considerable effort and discussion in trying to scale up blockchain-style database (DB) technology. Here, we re-frame the question: does the world have any precedents for “big data” distributed databases going to Internet scale? The answer is, simply, yes. All large Internet companies - and many small ones - run “big data” distributed databases including Facebook, Google, Amazon and Netflix. For example, at any given time Netflix might be serving up content for 35% of the bandwidth of the Internet [75].

Distributed databases regularly store petabytes (1,000,000 Gb) and more. In contrast, the Bitcoin blockchain currently stores 50 Gb, the capacity of a modern thumb drive. There are initiatives to prevent “blockchain bloat” such as trying to limit “dust” or “junk” transactions that “pollute” its 50 Gb database [80]. In light of petabyte capacity DBs, perhaps we can view blockchain “bloat” as ironic. But another view is: perhaps distributed database technology might be fruitful for blockchain database design.

Let’s explore distributed database scalability further. Figure 3 illustrates the throughput properties of a distributed database used by Netflix, called Cassandra. Figure 3 bottom right shows that 50 distributed Cassandra nodes handle 174,000 tps. Increasing to 300 nodes gives 1.1 million tps [25]. A follow-up study three years later showed a sustained >1 million tps [45]. To emphasize: unlike the Bitcoin blockchain, the throughput of this database increased as the number of nodes increased. The scaling is linear: 10x more nodes meant 10x more throughput.

Also, because each node also stores data—a subset of all data —storage capacity also increases linearly with the number of nodes. Additionally, as the number of nodes increases, Cassandra’s latency and network usage does not worsen. Cassandra can be distributed at scale not only throughout a region, but spread around the globe.

The scalability properties of distributed databases make an excellent reference target.

Figure 3: Netflix experiment of throughput on Cassandra database. The x-axis is number of nodes; the y-axis is transactions per second. From [80].

## How Do “Big Data” Distributed Databases Work?

### Summary

How does Cassandra achieve such scale? First, it avoids scalability-killing decisions like making a full copy of all the data at every node. Also, it doesn’t get caught up with baggage of mining, coins, and the like.

What it does have is a consensus algorithm to solve the Byzantine Generals (BG) problem, in order to get the distributed data to synchronize. In fact getting distributed data in sync was the original motivation for BG. The solution is known as the Paxos protocol [54] .

The BG problem was first documented in 1980 by Leslie Lamport and colleagues [67], and solved two years later, also by Lamport and colleagues [54].

### Paxos Details

Here are the details in the origins of Paxos.

In 1980, Lamport and some peers threw down a gauntlet to their colleagues with the following question: “Can you implement a distributed database that can tolerate the failure of any number of its processes (possibly all of them) without losing consistency, and that will resume normal behavior when more than half the processes are again working properly?” [67] Before this, it was generally assumed that a three-processor system could tolerate one faulty processor. The paper showed that "Byzantine" faults, in which a faulty processor sends inconsistent information to the other processors, can defeat any traditional three-processor algorithm.  In general, 3n+1 processors are needed to tolerate n faults.  However, if digital signatures are used, 2n+1 processors are enough.

The paper [67] introduced the problem of handling Byzantine faults, with the first precise statement of the consensus problem.

Lamport then set out to prove to his colleagues that the problem was impossible to solve [53]. Instead, as a happy accident, he discovered the Paxos algorithm [54]. At its heart is a three-phase consensus protocol. “to my knowledge, Paxos contains the first three-phase commit algorithm that is a real algorithm, with a clearly stated correctness condition and a proof of correctness” [53]. It overcame the impossibility result of Fischer et al. [35] by using clocks to ensure liveness.
Two notable extensions to Paxos include Lamport’s “Fast Paxos” [55]  and Castro’s “Practical Byzantine Fault Tolerance” [23] which improve its robustness via an extra “verify” message. Research continues on robust consensus protocols, outside the Bitcoin community, at distributed computing conferences. Examples include Aardvark [24] and Robust BFT [3].

### Paxos in the Ecosystem

Mike Burrows of Google (co-inventor of Google’s Chubby, BigTable, and Dapper) has said:

“There is only one consensus protocol, and that’s Paxos” [71], and
“all working protocols for asynchronous consensus we have so far encountered have Paxos at their core.” [17]
Henry Robinson of Cloudera has said:
“all other approaches are just broken versions of Paxos.”
“it’s clear that a good consensus protocol is surprisingly hard to find.” [71]

Paxos is used at Google, IBM, Microsoft, OpenReplica, VMWare, XtreemFS, Heroku, Ceph, Clustrix, Neo4j, and certainly many more [81].

## Replication factor & blockchain “full nodes”

A modern distributed database is designed to appear like a single monolithic database, but under the hood it distribute storages across a network holding many cheap hard drives (or flash drives). Each data record is stored redundantly in more than one drives, so that if a drive fails then the data can be still easily recovered. If only one disk fails at a time, then there only needs to be one backup drive for that data. One can make the risk arbitrarily small, based on assumptions of how many disks might fail at once. Modern distributed databases typically have 3 backups per data object, i.e. a replication factor of 3 [82].

Here’s a fun analysis. If mean time between failure (MTBF) of a disk is 1 year and mean time to replacement (MTTR) is 1 hour, then the chance of 3 nodes going down at once in any given hour (1/8760)3 = 1.49 x 10-12; so all three disks going down at once would happen once every 77 million years. If there were 1,000 disks worth of storage, all three disks going down at once for any disk is once every 77 thousand years. To summarize, with a replication factor of 3, modern big data databases have more than sufficient coverage, and if one is extra paranoid replication factor could be bumped to 4 or 5.

In contrast, Bitcoin has about 6,500 full nodes [12]; akin to a replication factor of 6,500. The chance of all nodes going down at once in any given hour (assuming independent) is (1/8760)6500 = 10-25626. That is, the chance of all nodes going down would occur once every 3,000 billion years. This is overkill, by an (exponential) factor of 6,500.

Of course, hardware failure is not the only reason where you can lose data. Attacks to the nodes of the network have a much higher probability. Interestingly, a well-targeted attack to 2 or 3 mining pools could just remove 50 % of the computing power from the network, making the network unusable until the next adjustment to POW complexity (about every two weeks).

## What Big Data Brings To the Table

As discussed above, Paxos is the definitive consensus algorithm. “Big data” distributed databases use it. These databases have well-documented ability to handle high throughput, low latency, high capacity, good network utilization, and any shape of data from table-like SQL interfaces, object structures of NoSQL databases, and graph databases. They handle replication in a sane fashion.

## What Big Data Lacks

Traditional “big data” distributed databases aren’t perfect. They’re centralized, i.e. deployed by a single authority with central control, rather than decentralized control like in blockchains. This means:

- Centralized-control databases are susceptible to a single point of failure, e.g. where a single node gets hacked. This is what leads to hacks at Target, Sony, and many others [16].

- Centralized-control databases are mutable. For example, a hacker could change a 5-year-old record, without anyone noticing (assuming no additional safeguards in place). This can’t happen in blockchains because past transactions cannot be deleted (because each new block contains a “hash” digest of all previous blocks)

- Centralized databases are typically not open to the public to even read, let alone write. Public openness is important for public utilities. A notable exception is WikiData [83].

- For many scenarios, these databases are a no-go politically, because the participants do not want to cede control to a single administrator. This risk of loss of control is one reason the music labels don’t share a database.

- Because of central control, these databases aren’t designed to stop Sybil attacks, where one errant node can swamp all the votes in the system (“attack of the clones”).

- These DBs traditionally don’t support creation & movement of digital assets, where only the owner of the digital asset, as defined by the controller of the private key, can move the asset.

# Case Study:  The DNS - A Trusted Internet-Scale Database

## Introduction

In the previous section, we reviewed Internet distributed databases. We highlighted their scalability properties and their solid foundation in consensus (via Paxos). We also highlighted the core weakness: centralized control where a trusted third party is always holding the keys.

Let’s ask: do we have any precedents for distributed databases going not only to Internet scale, but in a (decentralized) trusted fashion?
In fact, there is one. It’s a database that is not only at Internet scale, but also has decentralized control. In fact, it is crucial to the functioning of the Internet as we know it. It is the Domain Name System (DNS).

## History of DNS

By the early 1980s, the Internet’s growth had made managing numeric domains a major bookkeeping headache [7]. To address this, in 1983 Jon Postel proposed the DNS. It was implemented shortly afterwards, as a centralized database. The U.S. government ran the DNS until the 1993, when they handed control to Network Solutions Inc. (NSI), a private corporation.
NSI had a challenge: how to make the DNS function effectively, but take away the keys from themselves and any other single majority stakeholder. This included the US government and the U.S. Department of Defense. The solution architected by NSI’s CTO David Holtzman was brilliant and simple: a federation of nodes spread throughout the globe, where each node’s interests were as orthogonal as possible with all the other to prevent collusion [7]. Holtzman deployed this database while NSI CEO Jim Rutt vigorously held the US Commerce Department at bay [73]. In the late 90s, NSI handed off DNS oversight to the Internet Corporation for Assigned Names and Numbers (ICANN), a new non-governmental non-national organization run by Esther Dyson [7].

The decentralized DNS successfully deployed at Internet scale. It’s hard to imagine something more Internet scale than the database underpinning the Internet’s domain name system.
The DNS is architected to evolve and extend over time. For example, its original design did not include security. The DNS Security Extensions (DNSSEC) attempt to add security while maintaining backwards compatibility [43].

DNS enables *scarcity* on domain names – only one entity can own a domain name. There can be only one amazon.com. At its core, DNS is simply a mapping from a domain name (e.g. amazon.com) to a number (e.g. 54.93.255.255). People trust the DNS because no one really controls it; it’s administered by ICANN. Web domains have digital scarcity via a public ledger that is requires little extra trust by the user (trust minimizing system). It is a consensual arrangement and in fact, anyone could create an alternative registry tomorrow that would work in a similar manner.  It would be near useless however, because there is too much of a critical mass of users that have already voted with their checkbooks and purchased and used domain names that work within the existing DNS system.

## What DNS Brings to the Table
Here are some learnings of the DNS. Decentralized federations can work, at Internet scale. But, it’s absolutely crucial to get the right federation, with the right rules. It’s not easy, as Stellar learned the hard way [47]. However, David Holtzman demonstrated that it can be done with ICANN and DNS.

The DNS does not address the challenge of large scale data storage, or of Bitcoin-specific wants like coins. But, it didn’t aim to.

# Bigchain

## Bigchain Foundational Principles

Modern big data DBs and the DNS run at Internet scale, serving billions of users.

Rather than trying to scale up blockchain technology, Bigchain starts with “big data” technology and add “blockchain-like” decentralization characteristics, while avoiding the scalability-killing technology choices that plague Bitcoin.

Specifically: Bigchain use a big data distributed database structure to solve the “full node” and “broadcast network” problems of Bitcoin, and a DNS federation architecture to solve the “POW voting” problem of Bitcoin. Since the big data database has its own built-in Byzantine Generals consensus algorithm, we exploit that directly by disallowing communication between the nodes except for via the database’s built-in communication. This gives large savings in complexity and security.

## Detailed Description of Bigchain

### Detailed Description: Bigchain Architecture

Figure 4 illustrates the architecture of the Bigchain system. The Bigchain system presents its API to clients as if there is a single blockchain database.  Under the hood there are two distributed databases S and C, connected by the Bigchain Consensus Algorithm (BCA). The BCA runs on each signing node.

Each of the distributed databases, S and C, is an off-the-shelf big data database. We do not interfere with the internal workings of each database; by doing so we get to leverage the scalability properties of the database, in addition to features like revision control and benefits like battle-tested code. Each database may hold any number of transactions. Each may be implemented in hardware in any number of hard drives or flash drives. Each is running its own internal Paxos-like consensus algorithm for consistency within the drives.

The first database holds the “backlog” transactions - an unordered set of transactions S. Incoming transactions are brought and are assigned to a single signing node to process; Sk is the set of transactions assigned to node k.
A node k running BCA processes transactions from S as follows.  It moves its transactions from the unordered set Sk into an ordered list, creates a block for it, and puts that block into the second database C. C is an ordered list of blocks where each block has reference to a parent block and its data, that is, a block chain.

Signing nodes vote on each block as to whether the block is valid or not: it is valid if all transactions are valid, and invalid if any transaction is invalid. A block is undecided until a majority of signing nodes have marked a block invalid or valid; then it is decided and can be treated as “etched into stone” similar to the idea of multiple confirmations in Bitcoin blockchain.

A block Bj in the block chain stores a tuple of data. The first entry is the parent block Bj-1, or ∅ if the block is very first block (genesis block). The second entry is the ordered list of transactions Tj. The third entry is the hash the block’s data, where the data is (a) the parent block at address αj andt (b)  the list of transactions. Lastly, the block holds the votes for each node that has voted so far. The hash does not need to store the votes because the each vote is digitally signed by the respective signing node.

### Detailed Description: Pipelining in the Bigchain Blockchain

Figure 5 shows an example of a Bigchain block chain C. Block B1 is the genesis block with a single dummy transaction. When a signing node inserts a Block into the blockchain, it implicitly gives it a vote because it believes all transactions it’s inserting are valid and it has filtered away the ones it doesn’t like.
Block B2 has had three votes of five possible, including one vote from its inserting node (left) which will always be a positive vote; and two votes from other signing nodes which in this case are positive as well. Since the majority of nodes have voted the block to be valid, the block is considered decided_valid.

Block B3 has had five votes of five possible, including one always-positive vote from its inserting node; and four votes from other signing nodes. After the initial positive vote, there was a negative vote, then a positive one, then two more negative. Since the majority of nodes have voted the block to be invalid, the block is considered decided_invalid. It’s completely ok to keep this block in the chain because all the votes show that it’s invalid, so it will be ignored when validating future transactions. By keeping it in place, we can quickly progress the chain to child blocks.
Blocks B2 and B3 won’t have any more votes, because voting on a block stops as soon as it has a majority of positive or negative votes (decided_valid or decided_invalid, respectively).

When a block is initialized, it starts off as undecided. As soon as there is majority of positive votes for a block, or a majority of negative votes, then the block goes from undecided to decided_valid or decided_invalid, respectively, and voting on the block stops.
Block B4 is undecided because it does not yet have a majority of invalid or valid votes from nodes. Voting on B4 continues.

It is crucial that despite B4 being undecided, it still has a child block B5. This is possible because we can deterministically set a specific database address for the child of block B4, as a function of the contents of B4. In this fashion, any node can try to add a child to B4, but only one succeeds and the rest simply have to re-try by adding children to B4’s children. In other words, deterministic DB addresses means forking of the chain is simply not possible. It’s a single railroad track where the next plank’s location is based on previous planks. And we don’t have to stop at adding a single plank off an undecided block, we can keep aggressively laying track, such as block B6 in the figure.
When there are undecided parent blocks, we need to do one more thing to prevent double-spending: any transaction put into a new block must not depend on any transactions in an undecided block. For example, inputs of a new transaction must not be in inputs of any undecided blocks. This is enforced in two ways: when creating new blocks on undecided blocks, don’t allow such double-spend transactions; and when voting, any block containing such transactions is voted invalid.

We call this blockchain pipelining because this behavior is reminiscent of pipelining in microprocessors. There, the microprocessor starts executing several possible instructions at once, and once the microprocessor has worked out the proper order for them, it collates the results as output and ignores useless results. As with microprocessor pipelining, blockchain pipelining gives significant speed benefit.
Detailed Description: Pseudocode for Bigchain Consensus Algorithm (BCA)
Table 2 mainloop() is pseudocode for the Bigchain Consensus Algorithm (BCA), that is, the state machine for a single server “signing” node k. Tables that follow have supporting routines.
Line 1 emphasizes that there is equal access by all the nodes to the databases S and C. The BCA operates by moving data from transaction set S to block chain C, and occasionally the other direction too.

Line 2 is the start of the main loop. All remaining pseudocode is part of this loop, which runs continuously until the node is shut down.
Line 3 accepts transactions to into S and assigns them to nodes, lines 4-5 move unordered transactions from S into ordered, grouped-by-block transactions in C, and line 6 is where the node votes on undecided blocks.
Table 3 algorithms are for assigning transactions, as follows.

Table 3 acceptAndAssignTransactions() is the main routine that groups the two major steps: accepting and assigning incoming transactions (line 1), and reassigning old transactions (line 3).

Table 3 assignNewTransactions() accepts incoming transactions from clients of the Bigchain and assigns transactions to nodes. We assign to a node rather than let any node grab any transactions, because it greatly reduces double-spend detections in the block chain building side, and therefore helps throughput. We considered assigning nodes deterministically, for example based on the hash of the transaction. However, that would be problematic if a malicious node kept repeatedly inserting a bad transaction into C, then when it got kicked back to S, the malicious node got the same transaction again. So, we assign the node randomly with equal probability to each node, except the current node k in order to avoid a duplicate vote.

In the algorithm, line 1 accepts transactions and loops through them; line 2 chooses which node, with uniform probability; line 3 records the assign time (see the next algorithm for why); and line 4 actually assigns the transaction to the chosen node.

Table 3 reassignOldTransactions() re-assigns transactions that have become old. This accounts for the scenarios of if a node goes down, is running slowly, is running maliciously, or more generally is not performing its duties. This routine ensures that transactions assigned to that node don’t dropped, by re-assigning them. It loops through all assigned transactions (lines 1-2), and if the transaction’s previous assignment is old enough (line 3) then it chooses a new node (line 4), sets a new assign time (line 5), and moves the transaction assignment from the old node (node j) to the new node (node i). For this routine to work, it also needs the unassigned-transactions to have an assign time, which is done in assignNewTransactions() line 3.

In line 3, the node assignment is not random, but instead deterministic as a function of the transaction. This is so that nodes don’t inadvertently fight over which next node gets the transaction t. An example deterministic function findex(t) is mod(hash(t)), i.e. to hash the transaction then mod it by the number of nodes.

Table 4 maybeAddGenesisBlock() is the routine for adding the genesis (initial) block to C, if needed. Line 1 shows that it’s only invoked if C is indeed empty. Line 2 computes the database address α deterministically from a value c that is common to all nodes, e.g. simply a user-input string like “use this c”. Lines 3-7 create a new block with a single dummy transaction, and attempt to insert the block into C at address α. It only succeeds if no other signing node has beat it to the punch inserting a block into address α. It’s crucial that every node computes the same inserting address α, so that this block is only inserted once. An alternative to this algorithm is simply for the initiator of the network to manually create a genesis block.
Table 5 addNormalBlock() creates and adds a normal (non-genesis) block to C, and ends with a set of transactions to postpone.

Lines 1-2 initialize the routine’s main variables – the block to add Bnew, and the transactions to postpone adding until later Tpostpone.

Lines 3-16 tries to create and add a block to C, repeating its attempts until the addition is successful. Addition is unsuccessful when another node beats node k to the punch adding a block at the target database address α. Line 4 updates its pointer Btail to the most recent block in C. It’s important to grab Btail here rather than compute it on-the-fly, in case new blocks are added while lines 3-16 are running. Line 5 initializes the ordered list of transactions we’ll be adding to the block, and 6-10 add them one at a time. If a transaction t depends on an undecided block (risking double-spend) it will be postponed to another block by being added to Tpostpone (lines 7-8). Otherwise, if it is considered valid, then it is added to Tnew (lines 9-10). Otherwise, it will be discarded. Line 11 computes the new block DB address α; as in maybeAddGenesisBlock() line 2 it is crucial that this address will be the same on every signing node so that blockchain pipelining happens rather than forks. Like that line, line 11 does this as a deterministic function, and chains it to the previous block by making it a function of the previous block’s data.

Lines 12-16 creates the block (including a vote from this node k) and tries to insert it into address α. If it fails because another node has won the race to α, it will simply re-try starting at line 13. It’s important to recompute Btail and Tnew after a failed add, because validity of a transaction may have changed with the additional block(s) in C compared to the previous attempt.

Lines 17-18 occur once the block has been successfully added. With new transactions now in C, those transactions can be removed from S, as line 17 does by clearing Sk. Line 18 reconciles by adding back any postponed transactions, i.e. any transactions that risked double-spends due to being added after an undecided block.

Table 6 voteOnUndecidedBlocks() is the routine for node k to vote on other undecided blocks. Lines 1-8 iterates from the oldest undecided block (found in line 1) to the newest block (when temporary variable goes to ∅ in line 6). For each block, line H4 computes a Boolean of whether all transactions in the block B are valid, and line 5 stores that in B’s votes variable B.V, signed by node k.

Table 7 holds the routines for measuring validity of transactions.

Table 7 transactionsValid() is the top-level routine to simply loop through all the transactions supplied in the transaction list T (lines 2-5), and if any transaction is found to be invalid (line 3) then the routine returns False.

Table 7 transactionValid() measures whether a transaction is valid, based on traditional blockchain validity measures (ill-formed, double-spend, etc) in lines 3-4 and also based on whether it depends on an undecided block (lines 5-6).

Table 7 dependsOnUndecidedBlock() clarifies what it means to depend on an undecided block.

## Consensus Algorithm Checklist

As we were designing the Bigchain Consensus Algorithm, we encountered some pitfalls and concerns that we resolved.

Client transaction order. Ensure that transactions sent from the same client, or at least received in a particular order, are processed in that order, or at least a bias to that order. A typical scenario is where a client’s first transaction is to fill a value at an address, and second transaction is to spend from it. For starters, this should not be rejected. Better yet, it should go through the system efficiently, which means that there should (at the very least) be a bias to process the first client transaction before the second client transaction.

Block construction order. By the time we create memory space for a block at address α, all its transactions must be in the block, so that blocks added after α can check to not double-spend those transactions. How this would fail: node 1 creates a block B1 at α1, then node 2 creates a block B2 that follows B1, then node 2 adds transactions to B2, then node 1 adds transactions to B1 which invalidate some of the transactions in B2.

Hashing votes. Is there transaction malleability because votes are not hashed? At first glance it may look like a problem, because a block’s hash can get propagated to its child block before all its votes are in. A preliminary answer would be to have a second chain of hashes that actually includes the votes. But, the solution can be simpler than that: a single hash (without votes) is fine because the votes are digitally signed by the signing nodes, and therefore not malleable.
Dropping transactions. If a node goes down, what happens to the transactions assigned to it -- do those transactions inadvertently get dropped? In our initial design, the answer was mostly no, because all transactions are stored in S until they have been committed to a block. However, if a node went down or, more generally misbehaved, transactions assigned to that node might not get handled. So we added a way to re-assign transactions if the previous node assignment got stale – algorithm reassignOldTransactions() in Table 3.

Denial of service. Are there any transactions that can be repeatedly called by aggressor clients or a malicious server node, which tie up the network? To our knowledge, this is not an issue any more than a traditional web service.
DB built-in communication vulnerability. The nodes communicate using the big data DB’s own built-in Byzantine Generals consensus algorithm. Is this a vulnerability? The answer is that a majority of the network would need to be affected for it to have any major consequences.

Double spends. Are there any ways to double-spend? This is a useful question to keep continually asking. So far, we have not encountered issues.
Admin becoming god. Does the sys admin have any powers that allow them to play “god”, and thus constitute a single point of failure? We were careful to limit the power of the sys admin to even less than a voting node. So to our knowledge, the answer is no, because all write transactions (including updating software) need to be voted on by the federation.

# Permissioning & Roles

## Introduction

People use permissioning in daily life, from shared file systems like Dropbox and Google Drive, to local filesystems in Windows, iOS, and Linux, to distributed databases. Similarly, we should expect blockchain databases to have rich permissioning systems.

Permissioning ideas from these other systems can inform our design. Unix permissioning can offer an example. In Unix, each file or directory has three identity roles (owning user, owning group, others) and three types of permissions for each role (read, write, execute), for a total of nine permission values. For example, the permission values “rwxr--r---” means that the owning user can read, write, and execute (rwx); the owning group can read but not write or execute (r--), and others have no permissions (---).

## Overview of Bigchain Permissioning

A Bigchain database instance is characterized by which identities have which permissions. Table 8 and Table 9 gives examples on a private and public Bigchain, respectively. This is loosely comparable to a private intranet and the public Internet. We will elaborate on these shortly.

An identity (holder of a unique private key) can be granted a permission for each transaction type. Permissions, as reflected on the tables, can be as follows: “T” means the identity can do a transaction; “To”  means the identity can do transaction if it is the owner of the asset (has the private key); and “Tp” means can do transaction, after the owner of the asset has given permission to the identity. Most transactions need voting by voting (signing) nodes, with the exception of read operations.

A role is simply a group of individual permissions. Roles facilitate permission assignment and help understanding. Roles can be custom-created depending on the context. An identity may hold multiple roles, where the identity’s permissions is simply the union of its role permissions (and any other permissions that have been granted to it).

The core Bigchain protocol has as few actions (transaction types) as possible, to maximize backwards-compatibility and minimize complexity. Overlay protocols, such as SPOOL [44] for unique asset ownership, add actions like consignment and authentication. Table 8 and Table 9 each have core protocol actions, as well as some overlay protocol actions from SPOOL.

## Example Private Bigchain Roles

A private Bigchain could be set up to amongst a group of interested parties to facilitate the exchange of securities, gain supply chain transparency or manage the disbursement of royalties.  For instance, the music industry could choose to form a trust network including the record labels, independent musicians, the collecting societies (RIAA, GEMA, etc.), streaming services and support functions such as lawyers and communications agencies. This consortium of parties make up an enterprise trust network (ETN).

Table 8 gives permissioning of an example private Bigchain instance, for use in an ETN.

Column A gives actions allowed; column B gives whether the action needs voting; columns C-I are actual roles; and the final column is whether the action is part of the core Bigchain protocol.

An identity holding the “Voting node” role (column C) can vote on a transaction (row 2); no other role is able to do this.

Voting nodes can update permissions for any other identity (row 3); this of course needs voting consensus from other nodes. This is how new identities entering the system get permissions or roles. This is how voting nodes are added, and removed.
A voting node may also propose to update the voting node software (row 4); voting nodes will only update once they reach consensus. Voting nodes also must be able to read an asset (row 15) in order to be able to vote.

Like a voting node, an identity with “Sys Admin” role can propose to update permissions or update voting node software. This role is helpful because voting nodes may not be up-to-date technically when the sys admin is. Crucially, the sys admin cannot unilaterally update the software; rather, it can only propose software and ensure that the voting nodes hit consensus about updating. The sys admin must also be able to read an asset (row 15), in order to debug issues that may arise with the software.

The main job of the “Issuer” role is to issue assets (row 5). But it can also do everything that a “Trader” role can do.

The “Trader” role conducts trades of assets, has others conduct trades on its behalf, and lines up reading & authentication of assets. It can transfer ownership to an identity, though only if it is the owner of the asset as indicated by the “O” (row 6); or be on the receiving end of an asset transfer (row 7). Similarly, if it is the owner then it can consign, i.e. have another identity to sell on its behalf (row 8); or be on the receiving end as consignee (row 9). By default, read permissions are off, but a trader can allow others to read the asset info (row 10 grants permission; row 15 read). The trader can also add arbitrary data or files to an asset (row 11).

A “Broker / Consignee” role (column G) gets a subset of the trader’s permissions - only what is needed to be able to sell the work on the owner’s behalf.
We will describe the “Authenticator” role (column H) later, in section 8.5.
For simplicity of presentation, some details have been omitted compared to the actual implementation. For example, usually a consignee has to accept a consignment request.

## Detailed Description: Public Bigchain Roles

Table 9 gives permissioning of the public Bigchain instance. Here, Bigchain is configured such that each User (Role E) can do anything, except for sensitive roles of voting, sys admin, and authentication. Critically, Users can issue any asset (E5) and read all assets (E15); this is one of the defining features of an open blockchain.

## Cryptographic Authentication of Assets

The “Authenticator” role gives a formal place for authentication & certificate-granting authorities, such as a credit rating agency, an art expert certifying the authenticity of a painting, a university issuing a degree, or a notary stamping a document.

While the Bigchain can function completely without the authenticator role, in a decentralized network where anyone can issue assets, it’s obvious that 3rd parties will step in to provide an extra layer of trust for asset buyers.

These 3rd parties would do what any trusted 3rd party does today – act as an escrow agent, place a stamp or seal of approval, issue a certificate or rate the quality or reputation of the asset issuer (i.e. 5 star rating).

The flow is: the trader enables an identity to have read & authentication permission on an asset (row 12), then the Authenticator reviews all relevant information about the asset, and issue a report as a transaction (row 13).

The owner of the asset may then create a cryptographic Certificate of Authenticity (COA), a digital document that includes all the digitally signed authentication reports from the various authenticators. The overall COA is digitally signed too, so even if printed out, tampering can be detected.

This flow can incorporate not only traditional authorities, but also new possibilities such as point-of-creation software vendors certifying that a particular digital creation was created by their software at a given point in time, or even simply any person giving a thumbs-up or thumbs-down to the validity of the asset. Think Hacker News-style upvoting and downvoting, but with cryptographic signatures.

The COA can then be used by the seller as a pointer to authenticity, to show that the asset is not fraudulent.

Reputation of each authenticator, and the asset issuer, will undoubtedly matter. This approach does not prescribe exactly how, and instead remains flexible for many possible approaches. This approach simply gives a mechanism for reliable gathering and aggregation of signed data.

For instance, if a person decides to issue a set of 100 share certificates in Foo Corporation without having any prior track record or history of starting companies, a third party service on top of Bigchain could rate the security issuance as C (junk). Nonetheless, daring and adventurous investors can still decide to purchase the share certificates, at their own risk.

Other examples could emerge from ideas in prediction markets [40], social media reputation systems (Facebook Friends and Likes, Slashdot moderation, Hacker News upvoting, downvoting and karma, and Klout scores), new reputation systems like backFeed [5], and fictional inspiration from reputation economies described by Doctorow (Whuffie) [27], Suarez (Levels) [76], and others.

Reputation will likely play an increasingly important role, and reputation dynamics could get continually more interesting.

## Detailed Description: Transaction Validity, Incentivization, and Native Assets

Each Bigchain transaction has inputs and outputs. Like Bitcoin, the key measure of transaction validity is whether the inputs have sufficient funds to cover the outputs: “You can only spend what you have.” Validity is measured by voting nodes.
Recall that Bigchain consensus is federation-based. A node gets to vote on a transactions based on whether it has been given a voting node role. Contrast this to POW where the probability of a node voting is proportional its hash power (which in turn is proportional to the electricity that the node spent, assuming state-of-the-art hardware); or to POS where probability of a node voting is (at last partly) proportional to how much money it has.

Traditionally, blockchains have held two types of assets. First are “native assets” built into the core protocol. The consensus uses them to measure transaction validity (inputs ≥  the outputs?), and to reward voting by native-asset transaction fees and mining rewards. Second are non-native “overlay assets” in overlay protocols sitting above the core protocol. However, this traditional approach to native assets and reward has these issues:

- Issue: Overlay Asset Double-Spend. Traditional blockchains’ consensus do not account for overlay assets; there is nothing at the core protocol level to prevent a double-spend of an overlay asset.

- Issue: Native Asset Friction to Network Participation. Because traditional blockchain voting nodes need to get paid in the native asset, any new participants in the network must go find that native asset, typically on an exchange, before being able to conduct a transaction. This is especially difficult on newer blockchains that may be on few exchanges. Compare this to a traditional web service, where any new participant can conduct a transaction simply by paying in a standard currency like U.S. dollars with a standard payment method like a credit card.
Bigchain overcomes these issues as follows (and as shown in Table 10):

- Native consensus voting on every asset. Every transaction always keeps track of which asset it is operating on, chaining back to the transaction that issued the asset. Every asset is “native” in the sense that it’s used to measure transaction validity. Therefore, this overcomes the issue of “asset overlay double-spend.”

- Low friction to network participation. Akin to a traditional web service, the network operator (voting nodes) sets the terms on how to join the network, conduct transactions, and pay for the transactions (e.g. 10 USD for 10K transactions, paid via credit card, or Bitcoin).

## Detailed Description: Bigchain Federation Nodes

In Bigchain, the identities that set up the original federation choose the initial Voting Nodes, which can be changed according to a consensus among Voting Nodes. This is straightforward in setting up private trust networks. But how might we choose initial Voting Nodes for a public blockchain?

Here’s a first idea: choose e.g. 15 nodes that are least likely to collude. For example, include the American Department of Defense with the Chinese Red Army, Google with Baidu, Goldman Sachs with Deutsche Bank, and Sony Pictures with Creative Commons. While fun to think about, it could be difficult to manage because nodes may be antagonistic to each other, and a profit orientation may inspire collusion.
Here’s a next idea: choose nodes that have the long-term interests of the Internet in their mission, especially foundations that do not have a built-in motive of profit. If they collude, great, their collusion is for the long-term interests of the Internet. A consortium of the freedom fighters of the Internet is likely more palatable to the mainstream citizens of the Internet, and more robust for the long term, than the current governance structure of the Bitcoin blockchain.

We are currently gathering a consortium of such nodes. If you think you may fit as one of these nodes, or have suggestions, please contact the authors.

## Detailed Description: Incentivization & Security

In POW and POS blockchains, the network, the incentive model and the security of the network are inextricably linked. So, security is intrinsic to the system. But as discussed, both POW and POS have scalability challenges.

In a federation like Bigchain, the security of each node, and aggregate security over the entire network is extrinsic. This means that the rules for confidentiality, availability and integrity are outside the core network design [37].

For instance, if there are seven nodes, all with weak rules for security, the network will be breached.  Whereas if each of the network nodes have reasonable to strong security standards, the network as a whole can withstand attacks.

# Bigchain Benchmarks

Figure 6 shows an example of Bigchain running at 100,000 writes per s. (FIXME flesh this section out.)

# Bigchain Deployment

## Bigchain Use Cases

Many Bigchain database use cases are like traditional blockchain use cases, except focused where higher throughput, lower latency, or more storage capacity is necessary. For example, it can handle the throughput of high-volume payment processors, and directly store contracts and receipts on the DB alongside the actual transaction.

Some Bigchain database use cases are also like traditional distributed database use cases, except focused where blockchain characteristics can benefit. For example, improving database reliability by not having a single point of failure; or simply storage of documents but with secure time-stamping.

Bigchain use cases include:

- Creation and real-time movement of high-volume financial assets. Only the owner of the asset can move the asset, rather than the network administrator like in previous database systems. Reduces costs, minimizes transaction latency, and enables new financial applications.

- Track high-volume physical assets along whole supply chain. Can help reduce fraud, for massive cost savings. Every RF ID tag in existence could be on a Bigchain.

- Track intellectual property (IP) assets along the licensing chain. Reduces licensing friction in channels connecting creators to audiences, and gives perfect provenance to digital artefacts. A typical music service has 38 million songs; Bigchain could store this in a heartbeat.

- DB Reliability – resistance to single points of failure. Helps us get past the status quo where a single hack leads to massive data loss, like in Target or Sony [16].  

- Time stamping, receipts, and certification. Irrefutable evidence of an electronic action reduces legal friction. And, Bigchain is big enough so that receipts and COAs can be stored directly on it.

- Legally-binding contracts, directly on the Bigchain database next to the transaction, Ricardian contract style [38]

Bigchain complements other technologies including smart contracts, decentralized file systems, and traditional centralized technologies. Ethereum [32][19], Eris [31], Enigma [30][84] and others provide smart contracts platforms with a flexible feature set for decentralized processing, and come with their own blockchain. Bigchain is just blockchain- or database- style storage, focusing on raw speed & scalability. The DBs can operate side-by-side, just as most modern applications have many types of databases operating side-by-side. Another analogy is that smart contracts systems are the processor and the RAM, and Bigchain is the hard drive.  IPFS [6] is also complementary: it stores massive data blobs in a decentralized way, and Bigchain transactions link to blob URIs.

## Bigchain Products & Services

We envision the following products and services surrounding Bigchain.

1. BigchainDB – a blockchain database with high throughput, high capacity, and low latency.

- For “ringleaders” creating new private trust networks, to take advantage of blockchain capabilities at scale.

- There will be an out-of-the-box version, deployed just like any other database, and customized versions (via services, or customized directly by the user).

- Interfaces will include a REST API, language-specific bindings (e.g. python), RPC (like bitcoind), and command line. Below that will be an out-of-the-box core protocol, out-of-the-box asset overlay protocol [44], and customizable overlay protocols.

- It will support legally binding contracts, which are generated automatically and stored directly on the Bigchain DB, Ricardian contract style [38]. There will be out-of-box contracts for out-of-the-box protocols, and customizable contracts for customizable protocols.

- There will be cryptographic COAs, which are generated automatically and stored directly on the Bigchain DB. There will be out-of-box and customizable versions.

- It is built on a large, open-source pre-existing database codebase that has been hardened on enterprise usage over many years. The new code will be security-audited and open source too.

2. Bigchain DBs as a service, using a public Bigchain instance, or a private Bigchain with more open permissioning.

- For developers who want the benefits of blockchains without the hassle of setting up private networks

- For cloud providers who want scalable blockchain as part of their service

- Main interfaces will be a REST API directly, REST API through cloud providers, and language-specific bindings (e.g. python).

- With the features of the BigchainDB listed above.

3. “Blockchain-ify your database” service, to help others bring blockchain properties to other distributed databases.

- This is for database vendors looking to extend their database towards blockchain applications.

4. Bigchain Analytics. Handling massive amounts of data leads to a data flood. But this data can be turned into insights and actions with the help of appropriate machine learning and interactive visualizations.

- A reference example is Variation Designer [74], software co-designed by one of the authors, which enterprises use to design bleeding-edge computer chips.

## Timeline

Like many, we’ve known about Bitcoin & blockchain scalability issues for years. Here’s the timeline of how Bigchain has taken shape.

- Oct 2014 – gave first public talk on big data & blockchains [62]
- Apr 2015 – preliminary investigations; paused project to focus on IP business
- Sep 2015 – re-initiated project; detailed design; building & optimizing
- Dec 2015 – initial benchmarks; achieved 100,000 transactions / s
- Jan 2016 – whitepaper first version: what you’re reading
- Jan 2016 – more thorough documentation

Here’s the approximate future timeline:

2016 Q1

- alpha rollout, focus to start is private Bigchains for lead enterprise users, and a public Bigchain among initial public nodes (test-only to start)
- further speed optimizations; target 1M transactions / s
- security audit

2016 Q2

- open source code
- beta rollout

2016 Q3

- v1 rollout

# Conclusion

The blockchain wants to be big. If we want it to live up to its vision, it needs to be big.

We propose an answer called Bigchain: “block-chainify big data” using distributed computing tools that have been powering the Internet for 20 years. Bigchain handles over 100,000 transactions per second (with plans for over 1 million), sub-second latency, and petabyte+ capacity. Bigchain’s rich permissioning system supports public blockchains and private trust networks.





References

AI Coin, Home page, http://www.ai-coin.org/
M. Andreesen, “Why Bitcoin Matters”, New York Times, January 21, 2014, dealbook.nytimes.com/2014/01/21/why-bitcoin-matters
P.-L. Aublin, “RBFT: Redundant Byzantine Fault Tolerance”, IEEE ICDCS, 2013, http://www.computer.org/csdl/proceedings/icdcs/2013/5000/00/5000a297.pdf  
A. Back et al, “Enabling Blockchain Innovations with Pegged Sidechains,” Oct 22, 2010, http://www.blockstream.com/sidechains.pdf
Backfeed, http://backfeed.cc/
J. Benet, “IPFS – Content Addressed, Versioned, P2P File System, 2014, http://static.benet.ai/t/ipfs.pdf
Berkman Center for Internet and Society, Brief History of the Domain Name System, Harvard, 2000, http://cyber.law.harvard.edu/icann/pressingissues2000/briefingbook/dnshistory.html
T. Berners-Lee, “Information Management: A Proposal”, March, 1989, World Wide Web Consortium, http://www.w3.org/History/1989/proposal.html
Bitcoin Wiki, “Block size limit controversy”, https://en.bitcoin.it/wiki/Block_size_limit_controversy
Bitcoin Wiki, “Proof of Stake,” 2015, https://en.bitcoin.it/wiki/Proof_of_Stake
Bitcoin Wiki, “Scalability”, 2015, https://en.bitcoin.it/wiki/Scalability
Bitnodes, “Estimate of the size of the Bitcoin network,” 2015, https://getaddr.bitnodes.io/
Bitsmith, “Dan O’Prey talks Hyperledger”, Aug 21, 2014, http://www.thecoinsman.com/2014/08/decentralization/dan-oprey-talks-hyperledger/
Blockchain.info, “Blockchain size”, retrieved Dec 30, 2015, https://blockchain.info/charts/blocks-size
Blockchain.info, “Total transaction fees”, retrieved Dec 30, 2015, https://server2.blockchain.info/charts/transaction-fees
G. Bluestone, “Sony Offline After Hackers Stole Passwords, Threatened Blackmail: Report”, Nov. 24, 2014, http://gawker.com/sony-goes-offline-after-widespread-hack-by-potential-bl-1662893066
M. Burrows, “The Chubby Lock Service for Loosely-Coupled Distributed Systems”, OSDI'06 (Seventh Symposium on Operating System Design and Implementation), Seattle, WA, November, 2006, http://static.googleusercontent.com/media/research.google.com/en//archive/chubby-osdi06.pdf
V. Buterin, “Bitcoin Developers Adding $0.007 Minimum Transaction Output Size”, Bitcoin Magazine, May 6, 2013, https://bitcoinmagazine.com/articles/bitcoin-developers-adding-0-007-minimum-transaction-output-size-1367825159
V. Buterin, “Ethereum White Paper: A Next Generation Smart Contract & Decentralized Application Platform”, http://blog.lavoiedubitcoin.info/public/Bibliotheque/EthereumWhitePaper.pdf
V. Buterin, “Slasher: A Punitive Proof-of-Stake Algorithm”, Jan 15, 2014, https://blog.ethereum.org/2014/01/15/slasher-a-punitive-proof-of-stake-algorithm/
V. Buterin, “Slasher Ghost, and other Developments in Proof of Stake, Oct. 3, 2014, https://blog.ethereum.org/2014/10/03/slasher-ghost-developments-proof-stake/
V. Buterin, “Scalability, Part 2: Hypercubes”, Oct. 21, 2014, https://blog.ethereum.org/2014/10/21/scalability-part-2-hypercubes/
M. Castro, "Practical Byzantine Fault Tolerance", PhD thesis, MIT, 2001, http://research.microsoft.com/en-us/um/people/mcastro/publications/thesis.pdf
A. Clement  et al, “Making byzantine fault tolerant systems tolerate byzantine faults”, NSDI, 2009, https://www.usenix.org/legacy/event/nsdi09/tech/full_papers/clement/clement.pdf
A. Cockcroft and D. Sheahan, “Benchmarking Cassandra Scalability on AWS – Over a million writes per second”, http://techblog.netflix.com/2011/11/benchmarking-cassandra-scalability-on.html
Cryptonite, Home Page, http://cryptonite.info/
C. Doctorow, “Down and Out in the Magic Kingdom,” Tor, Feb 1, 2003, http://www.amazon.com/Down-Magic-Kingdom-Cory-Doctorow/dp/076530953X
J. R. Douceur, “The Sybil Attack”,  International Workshop on Peer-To-Peer Systems, 2002, http://research.microsoft.com/pubs/74220/IPTPS2002.pdf
C. Dwork, N. Lynch, and L. Stockmeyer, “Consensus in the Presence of Partial Synchrony”, Journal of the ACM 35(2), April 1988, p. 288-323, groups.csail.mit.edu/tds/papers/Lynch/jacm88.pdf
Enigma website, http://enigma.media.mit.edu/
Eris Industries, http://erisindustries.com/
Ethereum, https://ethereum.org/
I. Eyal et al, “Bitcoin-NG: A Scalable Blockchain Protocol”, to appear in USENIX Symposium on Networked Systems Design and Implementation (NSDI), 2016. Technical Report, Nov 11, 2015, http://diyhpl.us/~bryan/papers2/bitcoin/Bitcoin-NG:%20A%20scalable%20blockchain%20protocol.pdf
Factom,  http://factom.org/
M.J. Fischer et al, “Impossibility of distributed consensus with one faulty process", Journal of the ACM 32 (2), April 1985, https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf
J.S. Galt, “JL777’s vision of the Supernet,” Nov. 10, 2014, https://bitcoinmagazine.com/18167/what-is-the-supernet-jl777s-vision/
M. Gault, “The CIA Secret to Cybersecurity that No One Seems to Get”, Dec 20, 2015, http://www.wired.com/2015/12/the-cia-secret-to-cybersecurity-that-no-one-seems-to-get
I. Grigg, “The Ricardian Contract”, Proc. First International Workshop on Electronic Contracting, IEEE, 2004, http://iang.org/papers/ricardian_contract.html
A. Halevy et al, “The Unreasonable Effectiveness of Data,” IEEE Intelligent Systems 24(2), pp. 8-12, March-April 2009, http://static.googleusercontent.com/media/research.google.com/en//pubs/archive/35179.pdf
R. Hanson, “Information Prizes – Patronizing Basic Research, Finding Consensus,” Western Economics Association meeting, Lake Tahoe, June 1993, http://mason.gmu.edu/~rhanson/ideafutures.html
M. Hearn, “EB25 – Mike Hearn: Lighthouse, Assurance Contracts, bitcoinj, Transaction Fees & Core Dev Team”, Epicenter bitcoin podcast 25, June 21, 2015, https://epicenterbitcoin.com/podcast/eb-025/
S. Higgins, “Microsoft Adds Bitcoin Payments for Xbox Games and Mobile Content”, CoinDesk, Dec. 11, 2014,  http://www.coindesk.com/microsoft-adds-bitcoin-payments-xbox-games-mobile-content/  
ICANN, “DNSSEC – What Is It and Why Is It Important?”, Jan 29, 2014, https://www.icann.org/resources/pages/dnssec-qaa-2014-01-29-en
D. de Jonghe and T. McConaghy, “SPOOL Protocol,” https://github.com/ascribe/spool
C. Kalantzis, “Revisiting 1 Million Writes per second”, http://techblog.netflix.com/2014/07/revisiting-1-million-writes-per-second.html
J. Kallgren, “The Evolution of Bitcoin, from Behind a Berlin Bar”, CoinDesk, April, 2014, http://www.coindesk.com/evolution-bitcoin-behind-berlin-bar
J. Kim, Safety, liveness and fault tolerance—the consensus choices, Dec 5, 2014, https://www.stellar.org/blog/safety_liveness_and_fault_tolerance_consensus_choice/
J. Kim, “Stellar Consensus Protocol: Proof and Code,” April 8, 2015, https://www.stellar.org/blog/stellar-consensus-protocol-proof-code/
P. Koshy, “Bitcoin and the Byzantine Generals Problem -- a Crusade is needed? A Revolution?”, Financial Cryptography (blog), Nov 19, 2014, http://financialcryptography.com/mt/archives/001522.html
J.R. Koza et al, “Genetic Programming III: Darwinian Invention and Problem Solving,” Morgan Kaufmann, 1999, http://www.amazon.com/Genetic-Programming-III-Darwinian-Invention/dp/1558605436
T. Ku, “NVidia on Solido Variation Designer with SNPS HSPICE for 6-sigma”, Deepchip, Sept. 20, 2011, http://www.deepchip.com/items/0492-10.html
J. Kwon, “Tendermint: Consensus without Mining”, Draft v.0.6, fall 2014, http://tendermint.com/docs/tendermint.pdf
L. Lamport, “My Writings”, Microsoft Research, http://research.microsoft.com/en-us/um/people/lamport/pubs/pubs.html
L. Lamport et al, "The Byzantine Generals Problem”, ACM Transactions on Programming Languages and Systems 4 (3): 382–401, July 1982, http://research.microsoft.com/en-us/um/people/lamport/pubs/byz.pdf
L. Lamport, "Fast Paxos”, Microsoft Research, Distributed Computing 19(2), pp. 79-103, 2005, http://research.microsoft.com/pubs/64624/tr-2005-112.pdf
H. Lombardo, “Garzik, Andresen Warn that Maxwell Bitcoin Roadmap Ignores Hard Questions on Block Size & Higher Fees”, Dec 30, 2015, http://allcoinsnews.com/2015/12/30/garzik-andresen-warn-that-maxwell-led-bitcoin-roadmap-ignores-hard-questions-on-block-size-higher-fees/
J. Lopp. "On stage right now: people representing approximately 90% of the Bitcoin hashing power. Truly an historic moment," Twitter photo, from Scaling Bitcoin Workshop, Hong Kong, Dec 6-7, 2015,  https://twitter.com/lopp/status/673398201307664384
J. Matonis, “The Bitcoin Mining Arms Race: GHash.io and the 51% Issue”, Coindesk, July 17, 2014, http://www.coindesk.com/bitcoin-mining-detente-ghash-io-51-issue/
D. Mazieres, “The Stellar Consensus Protocol: A Federated Model for Internet-Level Consensus”, Stellar, draft of Nov 17, 2015, retrieved Dec 30, 2015, https://www.stellar.org/papers/stellar-consensus-protocol.pdf
T. McConaghy et al, “Variation-Aware Structural Synthesis of Analog Circuits via Hierarchical Building Blocks and Structural Homotopy,” IEEE Transactions on Computer-Aided Design 28(9), Sept. 2009, pp. 1281–1294, http://trent.st/content/2009-TCAD-robust_mojito.pdf
T. McConaghy, “High-Dimensional Statistical Modeling and Analysis of Custom Integrated Circuits,” Proc. Custom Integrated Circuits Conference, Sept. 2011, http://trent.st/content/2011-CICC-FFX-paper.pdf
T. McConaghy, “Blockchain, Throughput, and Big Data,” Berlin, Germany, Oct 28, 2014, http://trent.st/content/2014-10-28%20mcconaghy%20-%20blockchain%20big%20data.pdf
J. Monegro, “The Blockchain Application Stack”, Joel Monegro Blog, November, 2014, http://joel.mn/post/103546215249/the-blockchain-application-stack
S. Nakamoto, “Bitcoin: A Peer-to-Peer Electronic Cash System”, 2009, https://bitcoin.org/bitcoin.pdf
D. Nenni, “TSMC heart Solido”, SemiWiki, April 27, 2013 https://www.semiwiki.com/forum/content/2283-tsmc-solido.html
J. Ojeda-Zapata, “Target hack: how did they do it?”, San Jose Mercury News, Dec. 20, 2014, http://www.mercurynews.com/business/ci_24765398/how-did-hackers-pull-off-target-data-heist
M. Pease, R. Shostak, and L. Lamport, “Reaching Agreement in the Presence of Faults,” J. ACM 27(2), April 1980, http://research.microsoft.com/en-US/um/people/Lamport/pubs/reaching.pdf
Peercoin, Wikipedia, http://en.wikipedia.org/wiki/Peercoin
H. Robinson, “Consensus Protocols: The Two Phase Commit”, The Paper Trail, Nov. 27, 2008, http://the-paper-trail.org/blog/consensus-protocols-two-phase-commit/
H. Robinson, “Consensus Protocols: The Three Phase Commit”, The Paper Trail, Nov. 29, 2008, http://the-paper-trail.org/blog/consensus-protocols-three-phase-commit/
H. Robinson, “Consensus Protocols: Paxos”, The Paper Trail, Feb. 3, 2009, http://the-paper-trail.org/blog/consensus-protocols-paxos/
F. Rosenblatt, “The Perceptron--a perceiving and recognizing automaton,” Report 85-460-1, Cornell Aeronautical Laboratory, 1957
J. Schwartz, “Internet ‘Bad Boy’ Takes on a New Challenge”, April 23, 2001, http://www.nytimes.com/2001/04/23/business/technology-Internet-bad-boy-takes-on-a-new-challenge.html
Solido Design Automation, “Variation Designer” software, http://www.solidodesign.com  
T. Spangler, “Netflix Streaming Eats Up 35% of Downstream Internet Traffic: Study”, Variety, Nov. 20, 2014, http://variety.com/2014/digital/news/netflix-streaming-eats-up-35-of-downstream-Internet-bandwidth-usage-study-1201360914/
D. Suarez, “Freedom (TM)”, Dutton Adult, Jan 7, 2010, http://www.amazon.com/Freedom-TM-Daniel-Suarez/dp/0525951571
M. Swan, “Blockchain: Blueprint for a new Economy”, O’Reilly, 2015, http://shop.oreilly.com/product/0636920037040.do
K. Torpey, “Will It Take a Crisis to Find Consensus in the Bitcoin Block Size Debate?”, Oct. 14, 2015, http://insidebitcoins.com/news/will-it-take-a-crisis-to-find-consensus-in-the-bitcoin-block-size-debate/35254
M. Trillo, “Stress Test Prepares VisaNet for the Most Wonderful Time of the Year “, Visa Viewpoints, Oct. 10, 2013, http://www.visa.com/blogarchives/us/2013/10/10/stress-test-prepares-visanet-for-the-most-wonderful-time-of-the-year/index.html
A. Wagner, “Ensuring Network Scalability: How to Fight Blockchain Bloat”, Bitcoin Magazine, Nov. 6, 2014, https://bitcoinmagazine.com/articles/how-to-ensure-network-scalibility-fighting-blockchain-bloat-1415304056
Wikipedia, “Paxos (Computer Science)”, http://en.wikipedia.org/wiki/Paxos_(computer_science)
Wikipedia, “RAID”, http://en.wikipedia.org/wiki/RAID
WikiData, https://www.wikidata.org
G. Zyskind et al, “Enigma: Decentralized Computation Platform with Guaranteed Privacy”, MIT, 2015, http://enigma.media.mit.edu/enigma_full.pdf
