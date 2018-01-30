bitcoin-transactions
===

Claim your coins and manage them by yourself: Bitcoin transactions made simple for standard or multisig wallets, create and send by your own your Bitcoin, Bitcoin Cash, Bitcoin Gold, Bitcoin Diamond, Super Bitcoin, Bitcore, Zcash, Litecoin, DOGE, Dash transactions, manage your keys and do not disclose them to dubious wallets software

## Rationale

This module is equivalent to bitcoin-cli for some features but much more simple to use. To use bitcoin-cli you need to run the full bitcoin software, sync with the network and then sync your wallet.

This is a nightmare for quite a lot of people since syncing a full node can take 10 days and most likely will fail at the end

And this does not help the network since even if you succeed to sync from home most likely you will run a non efficient full node

<b>In addition many people lost everything by using malware wallets trying to get their 'free' coins, and apparently there are some common misunderstanding with the addresses format, please see the [Claiming your coins (BCH, BTG, BCD) - Adresses and getting "free" coins](https://github.com/Ayms/bitcoin-transactions#claiming-your-coins-bchbtgbcd---addresses-and-getting-free-coins)</b>

And finally, if you succeeded to sync you can prune after but you still need to run constantly the bitcoin software

The whole purpose of this module is to allow you to make transactions without having to run and sync a full node

Given the size of the blockchain and number of different networks, at a certain point of time it will become impossible for people to run the full sw for each one just to have their wallet synced and be able to send transactions

And it is crazy to let wallet sw manage your keys

Then even if the restart of this module was inspired by the epic bitcoin gold launch it is intended for the long term

This is not coming from nowhere, neither a scam, you can read https://github.com/BTCGPU/BTCGPU/issues/238

## Implementation and Code

This module is using [elliptic](https://github.com/indutny/elliptic) and [bs58](https://github.com/cryptocoinjs/bs58)

The code is provided in clear so you can check it but please read the specific conditions of the license

This module was started a year ago, the intent was at that time to make non trivial transactions, then was stopped, the basic intent now is to allow you to make simply your transactions (for example to send your mined coins to an exchange or to send your BTx to BTy)

This module is secure, it does not send anything outside (except the transactions when you request it) and does not get anything from the outside, therefore your keys are just managed by you locally

## Supported coins

Please see below the supported coins and acronym to be used, as well as full nodes where to send your transactions, and use/tests cases

### Forked coins

SegwitB2X "B2X" - node1.b2x-segwit.io (or node2/3) - see [b2x.js](https://github.com/Ayms/bitcoin-transactions/blob/master/b2x.js)

United Bitcoin "UB" - ip.ub.com - see [ub.js](https://github.com/Ayms/bitcoin-transactions/blob/master/ub.js)

Bitcoin Gold "BTG" - btg.suprnova.cc  - see below and https://github.com/Ayms/bitcoin-transactions/issues/5

Bitcoin Cash "BCH" - bch.suprnova.cc - see https://github.com/Ayms/bitcoin-transactions/issues/4 and [example-4.js](https://github.com/Ayms/bitcoin-transactions/blob/master/example-4.js) and [Specific case of BCH](https://github.com/Ayms/bitcoin-transactions#specific-case-of-bch) for the new address format

Bitcoin Diamond "BCD" - seed1.dns.btcd.io or 139.198.190.221 or 121.201.13.117 - please read [Specific case of BCD](https://github.com/Ayms/bitcoin-transactions#specific-case-of-bcd) and see [bcd.js](https://github.com/Ayms/bitcoin-transactions/blob/master/bcd.js)

Super Bitcoin "SBTC" - seed.superbtca.com

Bitcore "BTX" - btx.suprnova.cc

More to come ("candidates" list as soon as they put their full node code on github: Bitcoin Platinium, Lightning Bitcoin, Bitcoin God, Bitcoin Cash Plus, Bitcoin Uranium, Bitcoin Silver, Bitcoin X, Bitcoin Atom, Bitcoin Zobi, etc)

### Legacy coins

Bitcoin Core "BTC" - bitcoin.sipa.be - see https://github.com/Ayms/bitcoin-transactions/blob/master/verify.txt

Zcash "ZEC" - mainnet.z.cash - see https://github.com/Ayms/bitcoin-transactions/blob/master/verify.txt

Litecoin "LTC" - ltc.suprnova.cc - see https://github.com/Ayms/bitcoin-transactions/blob/master/verify.txt

Dogecoin "DOGE" - 5.135.158.86

Dash "DASH" - dash.suprnova.cc

## Fees

Unlike bitcoin-cli this modules allows you to manage your fees too, do not go below ~1 satoshi per byte for the network fees or your transaction will not be accepted by the network

There are development fees of ~1.5% (with a minimum of 0.00017000) that are added to each transaction that you broadcast, of course the fees apply only when your broadcasted transaction to the network is included in a block, no fees apply to create/test your transactions

If you don't like the dev fees then please do not use this module but please realize that you can adjust the network fees to compensate

This module is not trivial at all, the bitcoin protocol and formats do not make things easy, it is not recommended (neither authorized by the license) to try to modify anything, if you send wrong transactions to the network at best you will be immediately banned by the nodes for one day and at worse you could send transactions that could spend your funds at a wrong place

<b>Please note that due to rounding issues there is always a satoshi floating around that will go to the network, this is a minor issue that we will not correct in order not to change all of our test vectors</b>

Should this project be funded we will remove the dev fees and put it fully open source

## Installation

Install [nodejs for Windows,Mac,Linux](https://nodejs.org/en/download/package-manager/), usually this is easy

Create a bitcoin-transactions directory, install elliptic and bs58 with npm in node-modules and copy tx.js

Or just unzip [bitcoin-transactions.zip](http://www.peersm.com/bitcoin-transactions.zip) (137 kB)

	For Windows users that are not used to the command line tools:
	
	Install nodejs using the above link
	
	Unzip [bitcoin-transactions.zip](http://www.peersm.com/bitcoin-transactions.zip) somewhere (let's say C:/Users/Me)
	
	[key Windows]+[X], then "execute" and enter cmd, this will open the console
	
	cd /Users/Me/bitcoin-transactions
	
	Now you can enter the commands (please see below): node tx.js BTG create prevtx= prevaddr= prevamount= previndex= privkey= addr= fees= amount=
	
## The easy way

Once you know this module (if not please read what follows), most likely you will do:

### Standard wallets

	node tx.js <acronym> create prevtx= prevaddr= prevamount= previndex= privkey= addr= fees=0.00000300
	
	node tx.js <acronym> send <complete transaction> <advised full node above>
	
	or
	
	paste the <body> in an explorer (example: https://btgexplorer.com/tx/send)
	
### Multisig wallets

	node tx.js <acronym> create prevtx= prevaddr= prevamount= previndex= privkey=priv1-priv2-redeem-<2of2 or 2of3 or 2of4> addr= fee=0.00000500
	
	node tx.js <acronym> send <complete transaction> <advised full node above>
	
	or
	
	paste the <body> in an explorer (example: https://btgexplorer.com/tx/send)
	
The module will calculate the amount to be spent according to the fees and advise if the numbers are not coherent:

	amount+dev fees+network fees=prevamount
	
You can adjust the fees if you like according to the size of the transaction instead of using 0.00000300 or 0.00000500

## "Advanced use" - Multiple inputs

The previous method requires to perform one transaction per output to be spent, this can be a kind of painful and you are paying more network fees (this does not change anything for the dev fees), you might want to merge different outputs to a single destination address in one transaction (so you can spend it later with only one transaction too)

See the [Multiple inputs](https://github.com/Ayms/bitcoin-transactions#multiple-inputs) section below

## Use

See [example-1.js](https://github.com/Ayms/bitcoin-transactions/blob/master/example-1.js), Bitcoin Gold transaction 118d6160c8ae2465835ad41908a154cd9be6c78ca4012f79edbf65ca96407f97 was created with this module and mined in block 501249, see https://btgexp.com/tx/118d6160c8ae2465835ad41908a154cd9be6c78ca4012f79edbf65ca96407f97

Please note that the examples do not reflect the current dev fees

#### Standard wallets

[example-1.js](https://github.com/Ayms/bitcoin-transactions/blob/master/example-1.js) is now deprecated, please see [example-2.js](https://github.com/Ayms/bitcoin-transactions/blob/master/example-2.js) for the new format and transaction https://btgexp.com/tx/cc9684a4243999d1a1fc21c7ad7dbd1b3462bb1fb29614ed16b4d2763ab12bd4

We will follow this transaction for our examples, the previous transaction was [d5a80b216e5966790617dd3828bc13152bad82f121b16208496e9d718664e206](https://btgexp.com/tx/d5a80b216e5966790617dd3828bc13152bad82f121b16208496e9d718664e206)

#### Multisig wallets

See [example-3.js](https://github.com/Ayms/bitcoin-transactions/blob/master/example-3.js) for "Two of two" and "Two of three" transactions examples

And see [example-4.js](https://github.com/Ayms/bitcoin-transactions/blob/master/example-4.js) for a "Two of four" example

Multisig transactions/wallets (and why it's a very bad idea to use them) is explained [here(TODO)]() 

### Important Warning

<b>Many wallets provide by default P2SH segwit/BIP141 addresses</b>

<b>Do not use them with this module for now, use standard P2PKH addresses (starting with a 1 for Bitcoin and Bitcoin Cash, by a G for Bitcoin gold and by t1 for Zcash) or standard P2SH addresses (starting with a 3 for Bitcoin and Bitcoin Cash, by a A for Bitcoin gold and by t3 for Zcash) for multisig wallets (note that it is not possible to differentiate a segwit address from a normal P2SH one, so, again, make sure that your are not using segwit addresses)</b>

While using this module if you make a mistake with the parameters the transaction might look valid but will just be rejected by the network, so there is no impact, <b>except if you make a mistake with the destination address, nobody can check this, then make sure that the destination address is one that you master</b>

<b>If you have just as little as a slight shadow of a doubt while creating a transaction and looking at the outcome, please don't send it, email us or post an issue (WITHOUT YOUR PRIVATE KEYS)</b>

<b>Before this, please do some work and check precisely what you did, common mistakes are related to wrong private keys and/or wrong redeem script or prevamount for multisig, or fees too low, or amount to be spent on a destination address too low (referenced as "dust" if below 546 Satoshis)</b>

### Important - Understanding transactions

In our example we are going to spend output 31 of transaction d5a80b216e5966790617dd3828bc13152bad82f121b16208496e9d718664e206 with a prevamount of 0.00998277 that belongs to us since GSjwHAAYmFfQ4WPArc2ErtjQGr3Q2nkjvo is one of our addresses, with 0.00001001 network fees

``prevamount`` is like a bank note, you cannot cut it in half, give half to a merchant and keep the rest, you have to give the totality to the merchant (here the network) and get back the rest from him

Here we can decide to spend the whole ``0.00998277`` amount or just a part

In case we decide to spend a part, the delta will be refunded to our address GSjwHAAYmFfQ4WPArc2ErtjQGr3Q2nkjvo

This is what we do in our example, where we have decided to spend 0.005 to a given address and will get back 0.00488776 on address GSjwHAAYmFfQ4WPArc2ErtjQGr3Q2nkjvo which corresponds to the total amount minus the dev and network fees ``0.00998277=0.005 + 0.00488776 + fees``

The calculation is simply:

	amount+dev fees+network fees=prevamount
	
But this is easy to make mistakes, then we have added the ``testamount`` feature which is recommended to use before using the ``create`` command where you explicity say how much network fees you want to pay

Same applies for multisig transactions, the delta, if any, will be refunded to your multisig address as you can see in [example-3.js](https://github.com/Ayms/bitcoin-transactions/blob/master/example-3.js)

### Setting/Checking your parameters

#### You have decided to spend the whole amount with 0.0001001 fees and want to know what will be the amount (including dev fees) to put in the ``create`` command, do:

	node tx.js BTG testamount prevamount=0.00998277 fees=0.00001001
	
	--- Prevamount is small, min dev fees of 8500 apply - amount should be 0.00988776

Then you should use ``0.00988776`` in the ``amount`` parameter of the ``create`` command or use the ``create`` command without the ``amount`` parameter as explained in the "easy way" section above

#### You have decided to spend 0.005 with 0.0001001 fees like example-2, do:

	node tx.js BTG testamount prevamount=0.00998277 fees=0.00001001 amount=0.005

	--- Previous amount is: 0.00998277
	--- Amount to spend is: 0.00500000
	--- Network fees are: 0.00001001
	--- Dev fees are: 0.00008500
	--- Refunded amount to spending address is: 0.00488776
	
You will spend 0.005, pay ``0.00001001+0.00008500`` as fees and get back 0.00488776 on your initial address

As you can see in [example-2.js](https://github.com/Ayms/bitcoin-transactions/blob/master/example-2.js) since the numbers are rounded and checked again by the ``create`` command there can be a the end a difference of 0.00000001 with that numbers as network fees

For multisig wallets, that's the same and both examples can be seen in [example-3.js](https://github.com/Ayms/bitcoin-transactions/blob/master/example-3.js)

### Create transactions

Once the numbers are correct you can create your transaction:

#### Standard wallets

`node tx.js BTG create prevtx=d5a80b216e5966790617dd3828bc13152bad82f121b16208496e9d718664e206 prevaddr=GSjwHAAYmFfQ4WPArc2ErtjQGr3Q2nkjvo prevamount=0.00998277 previndex=31 privkey=privkey addr=GKz5ii8tWQG9hd196vNkwkLKsWHqaeKSoB fees=0.00001001 amount=0.005 `
	
	first argument (BTG here) is the network you want to use, please see the "supported coins" section above
	prevtx is the previous transaction containing the output that you want to spend
	prevaddr is the address where was sent the output that you want to spend (then one of yours)
	prevamount is the amount of the output that you want to spend
	previndex is the index of the output in the transaction
	privkey is your private key as you can see it in your wallet.dat dump
	addr is the address where to spend the output
	amount is the amount the address will receive
	fees are the network fees that you have decided to pay

You can get all those information simply from a blockchain explorer, in case of a transaction with many outputs, to get the index of your output just copy/paste from the site and look at the line number for your output (<b>don't forget that it starts from 0, the first output index is 0 not 1</b>)

#### Specific case of BCD

One BTC will become 10 BCDs, it just means that amount, prevamount and fees are multiplied by 10, then they have now 7 decimals instead of 8 (so amount, prevamount or fees of 0.00001234 become 0.0001234 in the create command)

This is just a marketing representation and does not change anything else, please see [example-6.js](https://github.com/Ayms/bitcoin-transactions/blob/master/example-6.js) that you can compare with [example-2.js](https://github.com/Ayms/bitcoin-transactions/blob/master/example-2.js)

#### Specific case of BCH

The BCH address format did change recently, this does not really make any difference for this module but we have updated the address format except that we have not yet included the cashaddress format that we have implemented in the very excellent [cashaddress](https://github.com/Ayms/cashaddress) module

Should you want this module to be merged here please post an issue

See also [BCH addresses converter](https://cashaddr.bitcoincash.org/)

As we can see it's unclear if legacy addresses should still be the same than Bitcoin or if they start with a C (for p2pkh), both format work with this module, the default is still Bitcoin like addresses

#### Multisig wallets

`node tx.js BTG create prevtx= prevaddr= prevamount= previndex= privkey=priv1-priv2-redeem-<2of2 or 2of3 or 2of4> addr= fee= amount=(optional)`

The arguments are the same than before except privkey where priv1 and priv2 are the two private keys required to spend your coins on your multisig address, redeem is the redeem script, 2of2 or 2of3 or 2of4 is the multisig scheme corresponding to your address

To find what are the public keys included in the redeem script, please run:

	node tx.js BTG decoderedeem <redeem>
	
	Public Key: GLU1deMwMToTt7s87Nv98v9qrK2sbZML5k equivalent to bitcoin address 13d6DX2zNcCAoeZqBSG2i9oww9F2bvd82o
	Public Key: GLbb8AJPnpbwaFxHJAH6UggaB6e4u1CtFQ equivalent to bitcoin address 13kfi2ySoxzeVnezNDcz3vLgFvrDrpL1qW
	Public Key: GSjwHAAYmFfQ4WPArc2ErtjQGr3Q2nkjvo equivalent to bitcoin address 19u1s2qbnQ46z35svfN8S8PWMgFZ1vqpxz

Then you need to find at least two private keys corresponding to two of those public keys, to retrieve them (and the redeem script first) from your wallet, you can look at the first part of this tutorial [How to extract Bitcoin Gold from a 2fa Electrum Wallet [STEP BY STEP]](https://bitcointalk.org/index.php?topic=2550529.0) but of course you don't need to run a full node

This can look complicate but is not so much
	
You will get a summary of everything at the end of the command and warnings if the numbers are not correct, the ``create`` command does check the transaction again after it has been created, <b>you must get at the end the message 'Transaction verified', if not something went wrong</b>

Most likely if you get 'Bad transaction' this is because you made a mistake with the private key(s) and/or the redeem script or prevamount in case of multisig, or you are trying to spend something that does not belong to you, if this happens and everything looks correct, please report (<b>but never send to us/advertise your private keys, remove them and post the logs</b>)

### Decode transaction

It's a good idea to check again your transaction once it has been created, use the ``transaction body``

`node tx.js BTG decode 020000000106e26486719d6e490862b121f182ad2b1513bc2838dd17067966596e210ba8d51f0000006a473044022039e2eee9a14fd18665eceeaac8af87888704ef2bfa14afe850b850e6fc7fdea702201d3c4340cc6998738295176320dc2597b3b6fcb93abc01add17b57b9ea70f0754121039f1e160a02079a6d6b7be0334cc4d76a125cd13a6f8d7131b11c263bc20bf918ffffffff0320a10700000000001976a914177b585b5401ad21b60b78b1b3c91996f250296d88ac47750700000000001976a91461975b3a4b9d5059e3db3e301e394d6d13275b3688ac34210000000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac00000000`
	
If you want you can double check again using something else like bitcoin-cli

### Send your transaction

Once you are sure that everything is correct, you can send your transaction to the network using the ``complete transaction``:

`node tx.js BTG send e1476d4474780000000000000000000003010000d42bb13a020000000106e26486719d6e490862b121f182ad2b1513bc2838dd17067966596e210ba8d51f0000006a473044022039e2eee9a14fd18665eceeaac8af87888704ef2bfa14afe850b850e6fc7fdea702201d3c4340cc6998738295176320dc2597b3b6fcb93abc01add17b57b9ea70f0754121039f1e160a02079a6d6b7be0334cc4d76a125cd13a6f8d7131b11c263bc20bf918ffffffff0320a10700000000001976a914177b585b5401ad21b60b78b1b3c91996f250296d88ac47750700000000001976a91461975b3a4b9d5059e3db3e301e394d6d13275b3688ac34210000000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac00000000`
	
Some addresses of nodes are hard coded, they don't belong to us and we can't say how long they will work, so if you want to use a specific node, do ``node tx.js BTG send <tx> A.B.C.D`` where A.B.C.D is the IP address of the node (please see the recommended full nodes [above](https://github.com/Ayms/bitcoin-transactions#supported-coins))

Before sending your transaction it's a good idea too to check the network by doing ``node tx.js BTG testconnect`` or ``node tx.js BTG testconnect A.B.C.D``
	
A more easy way if available for your network is to copy and paste the ``body of the transaction`` (and not the ``complete transaction``) to a blockchain explorer that will broadcast it, there are no risks of doing this except that you don't know if the explorer will do its job, the explorer can't modify the transaction

## Claiming your coins (BCH,BTG,BCD,SBTC) - Addresses and getting 'free' coins

The addresses between the different networks are the same, it always ends up with the hash of your public key and is encoded in a specficic way for each network, but they still are the same

There are some tools existing to convert addresses, you might consider using the very excellent [Ayms/bitcoin-wallets](https://github.com/Ayms/bitcoin-wallets) module to create your wallet and/or convert addresses
	
This module is not intended to push you to get your 'free' coins from bitcoin core
	
Because, unlike many people think, you have them already so there is no need to rush to 'convert' them, many people did not get their 'free' coins and just lost all what they had by using malware wallets

That's why, even if there are zero technical reason for doing this, some people advise to transfer first their bitcoins to another wallet before proceeding with such module
	
However, if you want to move your bitcoins "from bitcoin core to BCH, BTG, BCD or SBTC" (which as explained above means nothing) or from "bitcoin core to a bitcoin X exchange", you can just use the ``create`` command:
	
`node tx.js BTG create prevtx= prevaddr= prevamount= previndex= privkey=privkey addr= fees= amount=(optional)`

or

`node tx.js BTG create prevtx= prevaddr= prevamount= previndex= privkey=priv1-priv2-redeem-<2of2 or 2of3 or 2of4> addr= fee= amount=(optional)`

where prev[tx,addr,amount,index] refers very exactly to the same that you can see in a bitcoin core explorer like https://blockchain.info before block 491407 (<b>same transaction id, same address, same amount, same index</b>) and privkey is the private key corresponding to your bitcoin core address or priv1-priv2-redeem corresponds to your multisig bitcoin address
	
and addr can be a bitcoin address too that will be converted into a BCH, BTG or BCD address as you will see in the output of the command
	
You can convert before if you like the prevaddr and addr from a bitcoin core one to a bitcoin gold one but this is of no use, the create command will work with the original bitcoin addresses

If this explanation is unclear, please see the example given [here](https://github.com/BTCGPU/BTCGPU/issues/213#issuecomment-350449253)

<b>Again, if you do this, never use Segwit/BIP141 addresses for the destination and the origin</b>

## Double check again

If for any reason you don't trust this project then it's easy to use bitcoin-cli to check that the transactions are correct, especially ``decoderawtransaction`` and ``signrawtransaction`` using the body of the transaction to compare the output and the signatures

## Signatures

The most complicate part is to generate correct signatures for the transactions, this is the only part of the code that is slightly minified which does not impact anything in terms of security

<b>The rationale for this is that we have noticed that some people are trying to cheat with the dev fees, if you don't like them, don't use this module, and modifying anything can be quite dangerous, should this continue we might consider a much higher rate for the dev fees and replace the code in clear by an obscure obfuscated one</b>

## Multiple inputs

`node tx.js BTG create prevtx=tx1:tx2:...:txn prevaddr=addr1:addr2:...:addrn prevamount=amount1:amount2:...:amountn previndex=index1:index2:...:indexn privkey=privkey1:privkey2:...:privkeyn addr=<destination address> fees=0.00000600`

You can put the ``amount=`` parameter (but we believe that it's quite stupid even if included in our examples), then the delta will be refunded to addr1

To simplify, if prevaddr and/or index are always the same (and why not amount), you can do:

`node tx.js BTG create prevtx=tx1:tx2:...:txn prevaddr=addr1 prevamount=amount1:amount2:...:amountn previndex=index1 privkey=privkey1 addr=<destination address> fees=0.00000600`

or

`node tx.js BTG create prevtx=tx1:tx2:...:txn prevaddr=addr1 prevamount=amount1 previndex=index1 privkey=privkey1 addr=<destination address> fees=0.00000600`

### Multisig wallets

This works the same `privkey=privkey1:privkey2:...:privkeyn` where each privkeyi is priv1-priv2-redeem-<2of2 or 2of3 or 2of4>

You can mix standard inputs and multisig ones, see all the examples in [multiinputs.js](https://github.com/Ayms/bitcoin-transactions/blob/master/multiinputs.js)

Don't forget to adjust the fees according to the size of your transaction

<b>This has not been extensively tested for now even if we are confident that this is working well, so please check very closely the outcome before sending the transaction, most likely it will only be rejected if there is an issue but again check the destination addresses</b>

## License

This module is subject to the following modified MIT license which removes the rights to modify, merge, sublicense, and sell:

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, publish, and/or distribute copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

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