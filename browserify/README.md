## Browserification

Install browserify and terser via npm, then run from the main repo

	browserify tx.js --s internal  > ./html/browser.js
	
Then run from the html directory:

	uglifyjs surprisingly does not support ES6 (https://github.com/mishoo/UglifyJS2/issues/3443) then use terser:
	
	terser browser.js -c -m -o minified.js
	
Add minified.js between user interface (wallet.html) 'start browser.js' and 'end browser.js' comments

Before the 'end browser.js' add:

	const start=internal;
	delete window.internal; //delete global
	
You can also add browser.js the same way in walletclear.html and access the code in clear using [walletclear](https://peersm.com/walletclear)

## Related projects :

* [Ayms/cashaddress](https://github.com/Ayms/cashaddress)
* [Ayms/bitcoin-wallets](https://github.com/Ayms/bitcoin-wallets)
* [Ayms/zcash-wallets](https://github.com/Ayms/zcash-wallets)
* [Ayms/bittorrent-nodeid](https://github.com/Ayms/bittorrent-nodeid)
* [Ayms/torrent-live](https://github.com/Ayms/torrent-live)
* [Ayms/node-Tor](https://github.com/Ayms/node-Tor)
* [Ayms/iAnonym](https://github.com/Ayms/iAnonym)
* [Interception Detector](http://www.ianonym.com/intercept.html)
* [Ayms/abstract-tls](https://github.com/Ayms/abstract-tls)
* [Ayms/websocket](https://github.com/Ayms/websocket)
* [Ayms/node-typedarray](https://github.com/Ayms/node-typedarray)
* [Ayms/node-dom](https://github.com/Ayms/node-dom)
* [Ayms/node-bot](https://github.com/Ayms/node-bot)
* [Ayms/node-gadgets](https://github.com/Ayms/node-gadgets)