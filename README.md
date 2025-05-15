<div align="center">
    <img src="./icon.png" alt="Logo" width="80" height="80">

  <h3 align="center">Whatsapp & Telegram Multi Account Container</h3>

  <p align="center">
    This is a modified <strong>firefox multi account container extension </strong> for whatsapp and telegram so that it can run scripts automation like send message broadcast to group or user.
  </p>
</div>

## About The Project

Sometimes when we creating a WhatsApp or Telegram bot, we often don't see the website interface. In this extension, we can run the bot script directly without any problems.

Libraries used:

- <a href="https://web.whatsapp.com/" title="Whatsapp">WhatsApp</a> bot script uses a modified <a href="https://github.com/pedroslopez/whatsapp-web.js" title="Whatsapp Bot">WWebJS</a> library
- <a href="https://web.telegram.org/k/" title="Telegram">Telegram</a> client bot script does not use any libraries, using the default module from <a href="https://web.telegram.org/k/" title="Telegram">https://web.telegram.org/k/</a>

<strong>IMPORTANT:</strong> Telegram client bot only works on the URL https://web.telegram.org/k/

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Installation

Make sure you have firefox browser to run the extension

1. Clone the repo
   ```sh
   git clone https://github.com/radityaseptian/walagraf.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Load Extension Firefox
   ```sh
   go to "about:debugging#/runtime/this-firefox"
   click "Load Temporary Add-on" button
   choose location of file "manifest.json" in this project
   ```
4. Use Container Extension

```sh
 click extension Manage Containers in your firefox
 click "Manage Containers" to Add or Remove container website
```

## Usage

To modify the code you don't need to know all the project structure and what the code is for, just focus on the `/src/lib/*` and `/src/js/background/messageHandler.js` files, in the example in my code I show how to send a message every 10 minutes to a random group and post log result to local server, you can change it according to what you want.

## Tips

When modifying code from `/src/lib/*` you only need to refresh the browser tab, unlike when modifying code from `/src/js/*` you need to restart the extension in the `about:debugging#/runtime/this-firefox` settings and click the "Reload" button.

## Contact Me

Email: [radityaseptian1551@gmail.com](mailto:radityaseptian1551@gmail.com)
