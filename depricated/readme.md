# Hora

## Todo

* [ ] user accounts
* [ ] github login
* [x] store users

---

# Calico

Calico allows github users to easily create a list of repositories and users for comparison. It uses Node.js, Express 4, and Github Login.

---

## Dev environment

```
mongod
npm start
```

* [http://localhost:3000](http://localhost:3000)
* [http://localhost:3000/api](http://localhost:3000/api)
* [http://localhost:3000/reggi](http://localhost:3000/reggi)

---

* establish: interact with dotenv and any config parameters

* model: interacts with mongo database and collections
  * var model = require("./model")(db);
* flow: controls operations within routes 
  * var flow = require("./flow")(model)
* route: controls paths
  * var route = require("./route")(flow);

---

## Minor and major models

The minor model for the "CRUD" operations of any schemea is the function that accepts a parameter and talks to the database.

The major model for the same operation is the more, logic based version. Does extra stuff. You always want to go through the major version.

---

# Todo

* [ ] index / homepage with github connect button
* [ ] store github user in mongodb
* [ ] decide on creating internal access_token or using github access_token
* [ ] set session / cookies for logged in github user
* [ ] set internal access_token cookie when user logs in
* [ ] research how to install an ember app within a Node.js api
* [ ] redirect user to profile when logged in
* [ ] user profile is public
* [ ] shows banner on user profile when logged in 
  * [ ] allow user to "create list of users"
  * [ ] allow user to  "create list of repos"
* create api endpoints for
  * user
    * [ ] create
    * [ ] read
    * [ ] update
    * [ ] delete
    * [ ] login
  * lists (always return array)
    * [ ] create
    * [ ] read
      * [ ] via name
      * [ ] via _id
      * [ ] via user
      * [ ] via repo
    * [ ] update
      * [ ] via name
      * [ ] via _id
    * [ ] delete
      * [ ] via name
      * [ ] via _id
  * items (always return array)
    * [ ] via list id
    * [ ] via list name
      * [ ] create
        * [ ] via array of items (urls)
        * [ ] via item (url)
      * [x] ~~read~~
      * [ ] update
        * [ ] via array of items (urls)
          * [ ] append
          * [ ] overwrite
      * [ ] delete
        * [ ] via item (url)
        * [ ] via array of items (urls)

---

# Layers

## Model

* Talks directly to the database
* Performs low level CRUD operations

## API

* Talks to model(s)
* Talks to github

---

# Schemas

## Schema A 

* users
  * created_at
  * lists
    * id
    * name
    * created_at
    * items
      * created_at
      * name
      * repo
  * github
    * access_token
    * username

## Schema B

* users
  * github
    * access_token
    * username
* lists
  * user
  * name
  * type
  * items
    * created_at
    * name
    * repo
* repos


---

If we were to have everything within one `users` collection and all the lists created by the user were within that one document list "reads" would be super quick. If someone else used the same repo in a list it would contain the latest version this docs repo info would be out of date

---

# Repos

How do I handle the many-to-many relationship between lists-and-repos?

## Option 1

Store the entire repository data within the list:

Pro:

* Simple read query

Con:

* Complex write query
* Async fetch before write
* Lists using the same repo will be out of date
* Have to re-write much of the way that lists are inserted and updated

## Option 2

Store the repos in a separate repo database:

Pro:

* Simple write / update query (in use)

Con:

* Complex write query

---

# Github Comparison

_Friday, June 13, 2014 at 3:32:54 PM_

## Mongo

* github
  * users
  * lists

## YML Schema

```
api.function
  input: output
---
api.user.create
  github_user + token: (creates github_user with token in mongo) [success | fail]
api.lists.create
  edit_privileges (everyone|me) + github_user: list.id
api.lists.read
  github_user: lists
  null: lists (most recent)
api.list.read
  list.id: list
api.list.update
  list.id + github_user: list
api.list.delete
  list.id + github_user: "ok"
api.item.create
  list.id + item + github_user: list
api.item.delete
  list.id + item + github_user: list
```

## JSON Schema 

_USERSLIST.CREATE_

```
{
  "url": "/api/users_list.json",
  "funciton": "api.usersList.create",
  "method": "POST",
  "action": "create users list",
  "auth": "github-user",
  "input": [{
    "edit-privileges": [
      "everyone",
      "me",
    ],
    "list-owner.github-user"
  }],
  "output": [
    "mongo-users-list"
  ]
}
```

_USERSLIST.EDIT_

```
{
  "url": "/api/users_list/{mongo-users-list-id}.json",
  "funciton": "api.usersList.edit",
  "method": "PUT",
  "action": "edit users list",
  "auth": "list-owner.github-user",
  "input": [{
      "edit-privileges": [
        "everyone",
        "me",
      ]
    },
    "list-owner.github-user",
    "mongo-users-list-id"
  ],
  "output": [
    "mongo-users-list"
  ]
}
```

_USERSLIST.READ_

```
{
  "url": "/api/users_list/{mongo-users-list-id}.json",
  "function": "api.usersList.read",
  "method": "GET",
  "action": "read users list",
  "auth": null,
  "input": [{
      "edit-privileges": [
        "everyone",
        "me",
      ]
    },
    "list-owner.github-user",
    "mongo-users-list-id"
  ],
  "output": [
    "mongo-users-list"
  ]
}
```

_USERSLIST.DELETE_

```
{
  "url": "/api/users_list/{mongo-users-list-id}.json",
  "function": "api.usersList.delete",
  "method": "DELETE",
  "action": "delete users list",
  "auth": "list-owner.github-user",
  "input": [
    "list-owner.github-user", // 
    "mongo-users-list-id" // 
  ]
}
```

_USERSLIST.USER.CREATE_

```
{
  "url": "/api/users_list/{mongo-users-list-id}/user.json",
  "action": "add user to list",
  "auth": "github-user",
  "input": [
    "incoming.github-user",
    "mongo-users-list-id"
  ],
  "output": [
    "mongo-users-list-new"
  ]
}
```


# actors

## List

* create : `node actors/scripts/script.actors.lists.create.js --file actors/scripts/list.json`
* read handle : `node actors/scripts/script.actors.lists.read.js --handle "amazing_lists"`


---


Remove the item.

 `--item reggi/handwritten --remove`
 
Overwrite all items.

 `--item reggi/handwritten --overwrite`

Add an item to items.

 `--item reggi/handwritten`

---

`node run.js lists write --user thomas --item reggi/handwritten`

---

# Model

## User

* create : `node models/scripts/script.models.users.create.js --user reggi`
* read : `node models/scripts/script.models.users.read.js --user reggi`
* update : `node models/scripts/script.models.users.update.js --user reggi --token`
* delete : `node models/scripts/script.models.users.update.js --user reggi --status delete`
* log : `node models/scripts/script.models.users.log.js --user reggi --msg "Just pushed a log"`

## Repo

* read id : `node models/scripts/script.models.repos.read.js --id 1296269`
* read name : `node models/scripts/script.models.repos.read.js --name  octocat/Hello-World`
* write : `node models/scripts/script.models.repos.write.js --file models/scripts/repo.json`

## List

* create : `node models/scripts/script.models.lists.write.js --file models/scripts/list.json`
* read user : `node models/scripts/script.models.lists.read.js --user reggi`
* read handle : `node models/scripts/script.models.lists.read.js --handle "amazing_lists"`
* update rename : `node models/scripts/script.models.lists.write.js --name "Amazing List" --user reggi --rename "Better List"`

# Items

* items overwrite: `node models/scripts/script.models.lists.write.js --name "Amazing List" --user reggi --item express/express --overwrite`
* items remove: `node models/scripts/script.models.lists.write.js --name "Amazing List" --user reggi --item twbs/bootstrap --remove`
* items append: `node models/scripts/script.models.lists.write.js --name "Amazing List" --user reggi --item twbs/bootstrap --append`
