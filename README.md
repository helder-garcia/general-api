# simba-api

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

