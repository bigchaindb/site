---
layout: page

title: The Hitchhiker's Guide to BigchainDB & IPDB
---

If you’ve ever worked with databases or APIs, you’re likely familiar with CRUD. CRUD is short for Create, Read, Update, Delete. These are the basic operations of a persistent data store. So then, what’s ORM? ORM is an abstraction layer where database items are represented as programming language objects with variables as data, relations between items and functions that represent operations on that specific item in database. Django’s ORM is among the most famous ones:

```
>>> Post.objects.create(author=me, title='Sample title', text='Test')
>>> Post.objects.all()
<QuerySet [<Post: my post title>, <Post: another post title>, <Post: Sample title>]>
```

Now, blockchains alter this interface. They allow Create, as in creating an asset or minting a token. They allow Read, as in querying for a transaction using it’s ID. They don’t allow to Update or Delete anything that has been written though.
