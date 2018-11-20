# Niallap

A Discord bot on steroïds (dat title 😭).

## Getting Started

These instructions will help you to install your self-hosted Discord bot.

### Prerequisites

You'll need `git`. It'll allow you to clone this repository and install the bot.
You also need `NodeJS`. The bot need it to work.
FFMpeg is also mandatory. You can install it by running this command (if you're on linux) :

```
sudo apt install ffmpeg
```

### Installing

First, clone this repository with `git`.
```
git clone https://github.com/AxelDeneu/Niallap
```
Then, install the dependencies of the bot with your prefered NodeJS package manager :

```
npm install
```
or
```
yarn install
```

Now, you need to rename the file `config.json.sample` in the `config` folder to `config.json`.
And rename the file `playlists.json.sample` int the `db` folder to `playlists.json`.

That's it! The bot is installed. Please refer to the "Usage" section to learn how to start Niallap.

## Usage

To run the the bot, enter the command (with your prefered package manager) :
```
npm start
```
or
```
yarn start
```

Now, you need to keep your terminal open. But if you want to run it in a background task. You can install `screen` by running this command (if you're on linux) :
```
sudo apt install screen
```
Then, run the following command to create a new background terminal :
```
screen -S Niallap
```
Run Niallap :
```
npm start
```
or
```
yarn start
```
And detach the screen by pressing `CTRL + A`, release, and pressing `B`.

Niallap is now running in a background process.
You can easily come back to the background terminal by running the command :
```
screen -r Niallap
```

## Built With

* [discord.js](https://discord.js.org/#/) - A JavaScript Discord Library

## Authors

* **Axel Deneu** - *Initial work* - [AxelDeneu](https://github.com/AxelDeneu)

See also the list of [contributors](https://github.com/AxelDeneu/Niallap/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
