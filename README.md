# DrunkFlavor

Welcome to DrunkFlavor, your ultimate destination for delicious alcoholic drink recipes! Whether you're a cocktail enthusiast or looking to impress your friends at your next gathering, DrunkFlavor is here to provide you with a wide array of enticing drink recipes to try in the comfort of your own home. From classic cocktails to our own adaptations, our carefully curated collection will satisfy all taste preferences. Explore our recipe database, complete with instructions and ingredient lists, making it easy for you to recreate these delectable drinks. Get ready to elevate your mixology skills and discover the perfect libation for any occasion. Join our community and let DrunkFlavor be your go-to resource for all things drinks!

# Development

DrunkFlavor is a open source project, if you are interested in knowing more about its development, you will find below the link to the git repositories, as well as instructions to run it locally.  
Feel free to suggest improvements and report possible bugs, if you are a software developer pull requests are always welcome.

Github repositories:

- Backend: <https://github.com/juanlessa/drunk-flavor-back>
- Frontend: <https://github.com/juanlessa/drunk-flavor-front>

## Frontend

- [Setup](#setup)
    - [node.js](#nodejs)
    - [dotenv](#dotenv)
- [Dev](#dev)
- [Build](#build)

## Setup

### node.js

To run our website, you will need to have Node.js 16 or higher installed on your machine.
To install Node.js on macOS, execute the command below.

```shell
brew install node
```

If you are using a different operating system, please refer to the installation guide on the [Node.js website](https://nodejs.org) for instructions.

You can run the commands below to check the versions of the node.js and npm.

```shell
$ node --version
v16.17.0

$ npm --version
8.15.0
```

Make sure that your node.js and npm versions are equal to or higher than these ones.

Finally run the command bellow to install the project dependencies.

```shell
npm install
```

Now your node.js setup is ready.

### dotenv

To run the website, you need to add a file named `.env` at the root project folder, containing the environment variables.
You can use the [`.env.example`](https://github.com/juanlessa/drunk-flavor-front/blob/master/.env.example) file and add the corresponding values for your environment, or simply copy the sample below:

```dotenv
# API connection
NUXT_PUBLIC_API_BASE=http://localhost:3333
```

Now your environment setup is ready.

## Dev

Once your setup is ready, you are able to run the drunkflavor website in development mode by using the command below.

```shell
npm run dev
```

## Build

Build the application for production by using the command below.

```shell
npm run build
```
