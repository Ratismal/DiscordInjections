# DiscordInjections

This script aims to pick up where [BeautifulDiscord](https://github.com/leovoel/BeautifulDiscord) ends. Not only does it support custom CSS injections, but it also gives you the ability for custom JavaScript.

## Features

1. Custom CSS
2. CSS hot-loading and watching
3. Custom JS
4. Exposes the native Discord WebSocket and localStorage

## Installation

1. Go to the directory you would like to install this module in.
2. Type `git clone https://github.com/Ratismal/DiscordInjections folderName`
3. Run `npm install`
4. Run `npm run install`

## Requirements

This module requires you to have node.js installed with ES6 support. [Install](https://nodejs.org/en/download/)

## Usage

All usage takes place in the folder you installed DiscordInjections into.

### CSS

By default, DiscordInjections comes with a blank `style.css` file within the `CSS` folder. It is recommended to put your custom CSS in this file.

For a custom location, open Content Inspector (`ctrl` + `shift` + `I`) and type
```
_cssInjector.set("path/to/css");
```

### JavaScript

There are two segments of JS that get injected.

#### Preload/index.js

This is content that gets injected before anything else in the discord client. It is what enables us to intercept the WS and localStorage objects. Put things that need to be loaded first here.

#### DomReady/index.js

This is content that gets injected after the DOM is ready. Place everything else in here.

#### Note

Do not touch the `DomReady/inject.js` file, as it is what handles the custom CSS and JS injections.

### WebSockets and localStorage

Discord deletes its websocket and localStorage references to prevent tampering. In order to prevent deletion, these variables are stored to `window.$ws` and `window.$localStorage` respectively.

Additionally, Discord initiates a new websocket object every reconnect. To ensure that your implementation works properly, you should define a `window.onWebsocketReload` function, that takes a websocket as an input.

## License

DiscordInjections is open-source under the MIT license.

Copyright 2017 stupid cat

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.