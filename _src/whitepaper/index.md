---
layout: page

title: Whitepaper
description: 'This paper describes BigchainDB. BigchainDB fills a gap in the decentralization ecosystem: a decentralized database, at scale. It is capable of 1 million writes per second throughput, storing petabytes of data, and sub-second latency.'

whitepaper:
    title: Full Whitepaper
    text: Download the full whitepaper.
    files:
        - file: bigchaindb-whitepaper.pdf
          button: Download PDF
---

## BigchainDB: A Scalable Blockchain Database

*by <br>Trent McConaghy, Rodolphe Marques, Andreas Müller, Dimitri De Jonghe, Troy McConaghy, Greg McMullen, Ryan Henderson*

*February 2016*
*ascribe GmbH, Berlin, Germany*

### Abstract

This paper describes BigchainDB. BigchainDB fills a gap in the decentralization ecosystem: a decentralized database, at scale. It points to performance of 1 million writes per second throughput, storing petabytes of data, and sub-second latency.

 The BigchainDB design starts with a distributed database (DB), and through a set of innovations adds blockchain characteris- tics: decentralized control, immutability, and creation & movement of digital assets. BigchainDB inherits characteristics of modern distributed databases: linear scaling in throughput and capacity with the number of nodes, a full-featured NoSQL query language, efficient querying, and permissioning. Being built on an existing distributed DB, it also inherits enterprise-hardened code for most of its codebase.

 Scalable capacity means that legally binding con- tracts and certificates may be stored directly on the blockchain database. The permissioning system enables configurations ranging from private enterprise blockchain databases to open, public blockchain databases. BigchainDB is complementary to decentralized processing platforms like Ethereum, and decentralized file systems like InterPlanetary File System (IPFS).

 This paper describes technology perspectives that led to the BigchainDB design: traditional blockchains, distributed databases, and a case study of the domain name system (DNS). We introduce a concept called blockchain pipelining, which is key to scalability when adding blockchainlike characteristics to the distributed DB. We present a thorough description of BigchainDB, a detailed analysis of latency, and experimental results. The paper concludes with a description of use cases.
