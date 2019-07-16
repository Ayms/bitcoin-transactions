bitcoin-transactions - Discover and move your coins by yourself
===

Javascript implementation of the Bitcoin protocol for any Bitcoin based coins, on server and inside browsers as a standalone offline webapp, this module offers all the tools to manage your addresses and transactions by yourself without the need to sync a full node and/or use a wallet that you don't trust

## Funding and license

This module is funded by [NLnet](https://nlnet.nl/) under the [EU Horizon 2020 Next Generation internet Search and Discovery call](https://nlnet.nl/discovery/)

Therefore the initial dev fees have been removed and the code is open source and provided in clear under a MIT license

## Planning

If you intend to fork this module, maybe you should wait a little bit that everything is implemented, to come:

#### phase3 (beginning of August 2019):
- public keys discovery from private keys
- segwit addresses derivation and related public keys discovery
- BIP39, 44, 49, 84 and 141
- missing word or last checksum word discovery
- seed generation, discovery and recovery
- signatures generation and verification (including segwit and bech32)

#### phase4 (end of August 2019):
- browserification of everything into a secure standalone offline javascript application inside browsers

## Installation

Install [nodejs for Windows,Mac,Linux](https://nodejs.org/en/download/package-manager/), usually this is easy

Create a bitcoin-transactions directory, download and unzip [master](https://github.com/Ayms/bitcoin-transactions/archive/master.zip)

All of this does of course not apply for the browser version when it will be available
	
## Support and supported coins

If you experience some issues with this module or don't feel comfortable to use it by yourself, or just don't know how to use it, please email at our github address or email contact peersm com, or post an issue

If you don't know very well how to find your transactions, your can refer to the [initial doc](https://github.com/Ayms/bitcoin-transactions/blob/README_previous.md)

The list of supported coins is [here](https://github.com/Ayms/bitcoin-transactions/blob/README_previous.md#supported-coins), as you can see the tool does support a lot of coins, most of them not being serious, we do not intend to support additional non serious coins 

## Create wallet

	node tx.js <coin> createwallet <secret> <nb optional> <path optional>
	
	Example:
	
	node tx.js BTC createwallet 4ecf2e71d567072fe2f9cda40873afcaae4224e3f249018621a90dd43e88f8de 100 "m/44'/0'/0'/0/500"


See the test vectors in https://github.com/Ayms/bitcoin-transactions/blob/tests/wallet.txt

<coin> is the type of coin, <secret> is a BIP32 seed (32 bytes) or a xprv derived seed, nb is the number of addresses to be generated, path is the derivation path (it defaults to the standard path or BIP44 path), the "'" stands for hardened addresses

You can also use ``create_wallet <coin> <secret>`` where secret is an already generated hd object to iterate on it

Since we did implement it before Zcash team, we kept our implementation for z-addresses, now please note that this is probably not following the BIP32 Zcash implementation

## Create transactions

For a really detailed explaination of how transactions work please refer to the initial documentation above

The general syntax is:

``node tx.js <coin> create prevtx=tx1_tx2... prevaddr=prevaddr1_prevaddr2_... prevamount=amount1_amount2_... previndex=index1_index2... privkey=privkey1_privKey2 addr=addr fees=fees amount=amount optional``

- prevtx are the transactions ids of the outputs to be spent
- prevaddr are the addresses of the outputs to be spent
- amount are the amounts of the outputs to be spent
- previndex are the indexes of the outputs to be spent (warning: it starts with zero)
- privkey are the private keys or redeem scripts corresponding to prevaddr
- addr is the destination address
- fees are the network fees
- amount is the amount to be spent, the delta will be refunded to the first prevaddr address, if omitted the total of prevamounts minus the network fees will go to the destination address

If prevaddr corresponds to a segwit address, you must use prevaddr=prevaddr1-segwit_prevaddr2-segwit_...

In that case, if prevaddr is not a bech32 address it will create a segwit "nested into p2sh" transaction, if not it will create a legacy segwit transaction

Same thing applies if the destination address is a bech32 one or not

The best is to refer to all the examples in [test vectors](https://github.com/Ayms/bitcoin-transactions/blob/tests/vectors_tx.js) , and [test vectors phase2 mofn and all together](https://github.com/Ayms/bitcoin-transactions/blob/master/tests/multisig.js) and in examples files

The calculation for the fees is:

	amount+network fees=Sum of prevamounts

You must choose the fees according to the rules of the coin used, do not go below ~1 satoshi per byte or your transaction will not be accepted by the network
	
### Standard wallets

	node tx.js <coin> create prevtx= prevaddr=addr prevamount= previndex= privkey= addr= fees=0.00000300
	
### Multisig wallets

	node tx.js <coin> create prevtx= prevaddr=addr prevamount= previndex= privkey=priv1-priv2-redeem-mofn addr= fee=0.00000500
	
### Segwit

If your coins are on a segwit address you must add the ``-segwit`` flag in prevaddr:

#### P2WPKH

	node tx.js <coin> create prevtx= prevaddr=addr-segwit prevamount= previndex= privkey= addr= fees=0.00000300
	
#### P2WSH (multisig)

	node tx.js <coin> create prevtx= prevaddr=addr-segwit prevamount= previndex= privkey=priv1-priv2-redeem-mofn addr= fee=0.00000500
	
### Multiple inputs

Same as above with a ``_`` separator for all fields, if the data is the same (for example all prevaddr corresponding to the same address), then just put it once not using ``_``

### Mixed inputs

You can mix all kind of transactions using the ``_`` separator, please see the last example in [test vectors](https://github.com/Ayms/bitcoin-transactions/blob/tests/vectors_tx.js)
	
### Sending your transaction

The difference between ``complete transaction`` and ``body`` in the output of the ``create`` command is just that ``complete transaction`` includes the ``body`` with the network headers:

node tx.js <coin> send ``complete transaction`` ``advised full node`` (as shown in [here](https://github.com/Ayms/bitcoin-transactions/blob/README_previous.md#supported-coins) section)
	
or
	
paste the <b>``body`` (and not the ``complete transaction``)</b> in an explorer (example: https://btgexplorer.com/tx/send or https://explorer.btcprivate.org/tx/send)
	
If you used the first method you can also check that your transaction is in mempool (see in the code and uncomment)
	
### Important warning

The tool double checks many times many things, now if you make a mistake with the destination address it can't detect it, be sure to use an address that you master

The tool can detect mistakes made with the amounts also but not always, be carefull for example not to send everything as network fees

Check carefully the output of the create command, you will see the details of the transaction, you MUST at the end get "Transaction verified" AND "serialize/deserialize OK", if you don't get this then something is wrong with your parameters

## Decode transactions

	node tx.js <coin> decode <body of the transaction>
	
Please see [verify](https://github.com/Ayms/bitcoin-transactions/blob/tests/general.js)
	
## Verify transactions

	node tx.js <coin> verify <body of the transaction> 'outpoint1,nValue1' 'outpoint2,nValue2' ...
	
Please see [verify](https://github.com/Ayms/bitcoin-transactions/blob/tests/verify.js)
	
## Convert addresses

	node tx.js <coin target> convert <addr>
	
This will convert the address from a BTC format to <coin target> format, this feature will be ameliorated with the features to come (including bech32 format mapping)

Note that BCH bech32 like addresses are supported and systematically converted into standard addresses (TBD if this has to be changed with the features to come)

Please see [verify](https://github.com/Ayms/bitcoin-transactions/blob/tests/general.js)

## Decode redeem scripts

To find the keys corresponding to a m of n redeem script, you can run:

	node tx.js <coin> decoderedeem <redeem>
	
	Version BTG
	multisig 5 of 7
	Public Key: GRkwZPwZbqtRsRgngzeWSiqUsesMkp6eB9 equivalent to bitcoin address 18v29GccczH8nxPVm3zQ1xVaxV5Wh4Yz9v
	Public Key: GSaHPVGrp9YoRWinY1Q61xprkefodKoFxA equivalent to bitcoin address 19jMyMwuqHwWM3RVc4jybCUxqUsxXbvgCk
	Public Key: GW8VJYLzotvY2atK1aJPgcEsRj2tqmBbV2 equivalent to bitcoin address 1DHZtR23q3KEx7b25deHFqtyWZF3qhqYPs
	Public Key: GNBSiteDiXTHSF39qN8y652DrV3zw5Bg3z equivalent to bitcoin address 15LXJmKGjfqzMmjruRUrfJgKwKG9sLoq8V
	Public Key: GYkbaVWVpeEgSeH9F5vMHskKBQi7cDeazC equivalent to bitcoin address 1FugANBYqndPNAyrK9GEs7QRGEvGZhm5Qj
	Public Key: GUWjpVpYzrWUs84aTVR2RmjJyjDncoZf4x equivalent to bitcoin address 1BfpQNVc1zuBnemHXYkv11PR4ZRwdPBPgZ
	Public Key: GUWjpVpYzrWUs84aTVR2RmjJyjDncoZf4x equivalent to bitcoin address 1BfpQNVc1zuBnemHXYkv11PR4ZRwdPBPgZ
	To use the create command and to spend your multisig transaction you must find at least 5 private keys associated to those public keys
	P2SH address AMAkAUSwzMXNFiNqJ351JXp8PerFzPbZmy equivalent to bitcoin address 375tSX5mD7BbXusGrV5GaGuy4aDH9VR176
	P2WSH (nested) address AWGBg1UmRQAekSFMZFkBeLDFbR7Z63S8ey equivalent to bitcoin address 3GBKx47ae9pt2djo7hkSv5K6GLUaL6Vwvm
	P2WSH address bc1qfun6tu3xkgqe0h7gcyjt036ew8n27p2nhl5ymuakcrjx0cu7a4nqqueq7n

Please see [verify](https://github.com/Ayms/bitcoin-transactions/blob/tests/general.js)
	
## Notes for the devs

The module is not trivial, any slight change can cause everything not to work any longer and can become difficult to identify at a certain point of time, therefore it is advised to periodically test the latest example in the multisig test vectors while making changes (if this one passes it's unlikely that something is wrong). In addition serialize/deserialize is not symetrical then ``true`` must be used when not coming from a Tx constructor transaction, initially this was a mistake due to misreading of segwit specs, we decided to keep it like this because double checking symetrical potential wrong things is just useless, therefore this adds a last serialize/deserialize independant check
	
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