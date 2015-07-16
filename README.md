# tsm-server-api

Uma aplicação [Sails](http://sailsjs.org)
API no TSM Server para atender o SIMBA em consultas e solicitações de registros de nodes no TSM.

## Getting Started

To get you started you can simply clone the tsm-server-api repository and install the dependencies:

### Prerequisites

You need git to clone the tsm-server-api repository. You can get git from
[http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to initialize and test tsm-server-api. You must have node.js and its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/).

### Clone tsm-server-api

Clone the tsm-server-api repository using [git][git]:

```
cd git
git clone https://gitlab.supcd.serpro/37318942204/tsm-server-api.git
cd tsm-server-api
```

### Install Dependencies

Install `nvm` on you home directory.

```
cd ~
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.25.1/install.sh | bash
```

Close and reopen your terminal. Install stable version of `node`.

```
nvm install stable
nvm use stable
```
Install application dependencies using the node package manager.

```
cd ~/git/tsm-server-api
npm install
```

### Run the tests

I configured a grunt task to run all tests. Just run:

```
grunt test
```

You may need to setting up node environment again, if you have just opened a new shell.
```
nvm use stable
grunt test
```

### Lifting the app

To start the web service you run sails with the lift argument.
```
sails lift
```

You can specify which environment to load, development or frontend, by exporting a variable before lifting the app.

```
export NODE_ENV=development
```

or

```
export NODE_ENV=frontend
```

You can see the responses from the web service accessing any API from the browser or some tool like curl.

http://localhost:1337/Node

```
curl http://localhost:1337/Node
```

#### Frontend Enviroment Settings

The *frontend* environment use local disk as data storage for all models. All nodes you see and create are stored on flat files on your local computer. This makes your life easier if you will be working on frontend stuff only, as you won't need to worry about installing and configuring TSM BA Client and Mongo database as well.

#### Development Environment Settings

This working set uses Mongo database to store local administrators and TSM instances configuration. However, it will connect to a real TSM instance. Don't panic! You will be restricted to one exclusive for testing.
You must have Mongo installed on your system, and export the following shell variables before lifting sails:

```
export MONGO_HOST=<*mongo_db_host*>
export MONGO_PORT=<*mongo_db_port*>
export MONGO_USER=<*mongo_db_user*>
export MONGO_PASSWORD=<*mongo_db_password*>
export MONGO_DATABASE=<*mongo_db_database*>
```

#### Default Administrator

In any case, when you lift sails, if the administrator's collection is found to be empty, a default administrator will be created for you to use in frontend (the frontend part is in another project). His credentials are admin/admin.

### Creating Data

```
curl -X POST --data 'nodeName=DFCDSRVP0045_MENSAL&domainName=LINUX' http://localhost:1337/Node
```

Replace the values of the attributes *nodeName* and *domainName* at your wish.

## Models

The API has the following models.

### Node

The Node model is responsible to handle with TSM Nodes requests. It has the attributes below:

| Attribute | Type | Validation
| :---: | :---: | ---
| *nodeName* | string | `required` |
| *domainName* | string | `required` |
| *archDelete* | boolean | optional |
| *backDelete* | boolean | optional |
| *maxNummp* | integer | optional |

To search for a node you can open the following URL in your browser:

```
http://localhost:1337/node/find?nodeName="DFCDSRVP0045_MENSAL"
```

Or post it using curl:

```
curl -X POST --data 'nodeName="DFCDSRVP0045_MENSAL"' http://localhost:1337/Node/find
```