Cashaddress
===

Simple and standalone javascript implementation of modified BIP173 for Bitcoin Cash addresses

## Code

The Bitcoin Cash specs are [here](https://github.com/Bitcoin-UAHF/spec/blob/master/cashaddr.md)

Unlike other implementations this module does not require any external one and can be used standalone, this is implemented for nodejs but can be easily adapted for browsers, Buffer then need to be changed, you might consider [Ayms/node-typedarray](https://github.com/Ayms/node-typedarray)

Cashaddresses are computed by group of 5 bits with 5 bytes which does not make it easy for a js implementation since js handles numbers and operators with 4 bytes, therefore standard operators can't be used and some manipulations can look strange in the code but are not (and certainly less than other implementations bypassing this little difficulty by funnily using Big Integers)

## Installation

Just copy the cashaddress.js file

## Use

	//hash:'76a04053bda0a88bda5177b86a15c3b29f559873' //1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu
	
	var addr=encode_b(new Buffer(hash,'hex'),'p2pkh','bitcoincash');
	
	console.log(addr)
	
	//bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a
	
	console.log(decode_b(addr));
	
	//{hash:'76a04053bda0a88bda5177b86a15c3b29f559873',type:'p2pkh'}


See the test vectors at the end of the code
	
## License

MIT License

## Related projects :

* [Ayms/bitcoin-transactions](https://github.com/Ayms/bitcoin-transactions)
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
