bitcoin-transactions - Discover and move your coins by yourself
===

Javascript implementation of the Bitcoin protocol for any Bitcoin based coins, on server and inside browsers as a standalone offline webapp, this module offers all the tools to manage your addresses and transactions by yourself without the need to sync a full node and/or use a wallet that you don't trust

## Funding and license

This module is funded by [NLnet](https://nlnet.nl/) under the [EU Horizon 2020 Next Generation internet Search and Discovery call](https://nlnet.nl/discovery/)

Therefore the initial dev fees have been removed and the code is open source and provided in clear under a MIT license

## Dependencies

This module is using the very good [Elliptic](https://github.com/indutny/elliptic), [BS58](https://github.com/cryptocoinjs/bs58), [BECH32](https://github.com/sipa/bech32), [Forge SHA256](https://github.com/digitalbazaar/forge), [Browserify](https://github.com/browserify/browserify), [Terser](https://github.com/terser-js/terser) and other modules from us under a MIT license

## Browser version

The browser version is [here](https://peersm.com/wallet)

In case you don't see how to use it for some parts, please refer to the documentation and examples here

## Installation (nodejs version)

Install [nodejs for Windows,Mac,Linux](https://nodejs.org/en/download/package-manager/), usually this is easy

Create a bitcoin-transactions directory, download and unzip [master](https://github.com/Ayms/bitcoin-transactions/archive/master.zip)
	
## Support and supported coins

If you experience some issues with this module or don't feel comfortable to use it by yourself, or just don't know how to use it, please email at our github address or email contact peersm com, or post an issue

If you don't know very well how to find your transactions, your can refer to the [initial doc](https://github.com/Ayms/bitcoin-transactions/blob/master/README_previous.md)

The list of supported coins is [here](https://github.com/Ayms/bitcoin-transactions/blob/master/README_previous.md#supported-coins), as you can see the tool does support a lot of coins, most of them not being serious, we do not intend to support additional non serious coins 

## Create wallet

	node tx.js <coin> createwallet <secret> <nb optional> <path optional>
	
	Example:
	
	node tx.js BTC createwallet 4ecf2e71d567072fe2f9cda40873afcaae4224e3f249018621a90dd43e88f8de 100 "m/44'/0'/0'/0/500"


See the test vectors in https://github.com/Ayms/bitcoin-transactions/blob/master/tests/wallet.txt

``<coin>`` is the type of coin, ``<secret>`` is a BIP32 seed (32 bytes) or a xprv derived seed, nb is the number of addresses to be generated, path is the derivation path (it defaults to the standard path or BIP44 path), the "'" stands for hardened addresses

You can also use ``create_wallet <coin> <secret>`` where secret is an already generated hd object to iterate on it

Since we did implement it before Zcash team, we kept our implementation for z-addresses, now please note that this is probably not following the BIP32 Zcash implementation

## Create transactions

For a really detailed explanation of how transactions work please refer to the initial documentation above

The general syntax is:

``node tx.js <coin> create prevtx=tx1_tx2... prevaddr=prevaddr1_prevaddr2_... prevamount=amount1_amount2_... previndex=index1_index2... privkey=privkey1_privKey2 addr=addr1_addr2... fees=fees amount=amount1_amount2 optional``

- prevtx are the transactions ids of the outputs to be spent
- prevaddr are the addresses of the outputs to be spent
- amount are the amounts of the outputs to be spent
- previndex are the indexes of the outputs to be spent (warning: it starts with zero)
- privkey are the private keys or redeem scripts corresponding to prevaddr
- addr are the destination addresses
- fees are the network fees
- amount are the amounts to be sent, the delta will be refunded to the first prevaddr address, if omitted the total of prevamounts minus the network fees will go to the destination address, if there is several destination addresses, there must be the same number of amounts, same as before in that case if there is a delta for the sum of amounts + fees compared to the total of prevamounts, it will be refunded to the first prevaddr

If prevaddr corresponds to a segwit address, you must use prevaddr=prevaddr1-segwit_prevaddr2-segwit_...

In that case, if prevaddr is not a bech32 address it will create a segwit "nested into p2sh" transaction, if not it will create a legacy segwit transaction

Same thing applies if a destination address is a bech32 one or not

The best is to refer to all the examples in [test vectors](https://github.com/Ayms/bitcoin-transactions/blob/master/tests/vectors_tx.js) and [test vectors multiple addresses](https://github.com/Ayms/bitcoin-transactions/blob/master/tests/vectors_tx_multi_dest.js)

The calculation for the fees is:

	Sum of amount+network fees=Sum of prevamounts

You must choose the fees according to the rules of the coin used, do not go below ~1 satoshi per byte or your transaction will not be accepted by the network, due to rounding issues there can be one satoshi floating around
	
### Standard wallets

	node tx.js <coin> create prevtx= prevaddr=addr prevamount= previndex= privkey= addr= fees=0.00000300
	
### Multisig wallets

	node tx.js <coin> create prevtx= prevaddr=addr prevamount= previndex= privkey=priv1-priv2-redeem-mofn addr= fee=0.00000500
	
### Segwit

If your coins are on a segwit address you must add the ``-segwit`` string in prevaddr:

#### P2WPKH

	node tx.js <coin> create prevtx= prevaddr=addr-segwit prevamount= previndex= privkey= addr= fees=0.00000300
	
#### P2WSH (multisig)

	node tx.js <coin> create prevtx= prevaddr=addr-segwit prevamount= previndex= privkey=priv1-priv2-redeem-mofn addr= fee=0.00000500
	
### Multiple inputs

Same as above with a ``_`` separator for all fields, if the data is the same (for example all outputs corresponding to the same address), then just put it once not using ``_``

### Mixed inputs

You can mix all kind of transactions using the ``_`` separator, please see the last example in [test vectors](https://github.com/Ayms/bitcoin-transactions/blob/master/tests/vectors_tx.js)
	
### Sending your transaction

The difference between ``complete transaction`` and ``body`` in the output of the ``create`` command is just that ``complete transaction`` includes the ``body`` with the network headers:

node tx.js <coin> send ``complete transaction`` ``advised full node`` (as shown in [here](https://github.com/Ayms/bitcoin-transactions/blob/master/README_previous.md#supported-coins) section)
	
or
	
paste the <b>``body`` (and not the ``complete transaction``)</b> in an explorer (example: https://btgexplorer.com/tx/send or https://explorer.btcprivate.org/tx/send)
	
If you used the first method you can also check that your transaction is in mempool (see in the code and uncomment)
	
### Important warning

The tool double checks many times many things, now if you make a mistake with the destination address it can't detect it, be sure to use an address that you master

The tool can detect mistakes made with the amounts also but not always, be carefull for example not to send everything as network fees

Check carefully the output of the create command, you will see the details of the transaction, you MUST at the end get "Transaction verified" AND "serialize/deserialize OK", if you don't get this then something is wrong with your parameters

## Decode transactions

	node tx.js <coin> decode <body of the transaction>

Note: once an output corresponding to an address is spent then the corresponding public key or redeem script becomes public, this feature allows you to see it, this eliminates one check to validate further transactions involving this address, that's why it is not recommended to reuse same addresses

See Sign/Verify messages below also
	
## Verify transactions

	node tx.js <coin> verify <body of the transaction> 'outpoint1,nValue1' 'outpoint2,nValue2' ...
	
Please see [verify](https://github.com/Ayms/bitcoin-transactions/blob/master/tests/verify.js)
	
## Convert addresses

	node tx.js <coin1> convert <coin2> <addr>
	
This will convert the address from coin1 format to coin2 format

	node tx.js BTC convert BTG 18v29GccczH8nxPVm3zQ1xVaxV5Wh4Yz9v

	Type: p2pk
	Address: GRkwZPwZbqtRsRgngzeWSiqUsesMkp6eB9
	Segwit(nested): AcvpUaCnN7dZBkuf8qy6aZpF5GeBqdfKLg
	Segwit(bech): bc1q2m87z4h0mwxdqjuetmgf95tdc9wmdqz7tg4540
	
	node tx.js BTC convert BTG 375tSX5mD7BbXusGrV5GaGuy4aDH9VR176
	
	Type: p2sh
	Address: AMAkAUSwzMXNFiNqJ351JXp8PerFzPbZmy

	node tx.js BTC convert BTG bc1q2m87z4h0mwxdqjuetmgf95tdc9wmdqz7tg4540
	
	Type: p2pk
	Address: GRkwZPwZbqtRsRgngzeWSiqUsesMkp6eB9
	Segwit(nested): AcvpUaCnN7dZBkuf8qy6aZpF5GeBqdfKLg
	Segwit(bech): bc1q2m87z4h0mwxdqjuetmgf95tdc9wmdqz7tg4540
	
	node tx.js BTC convert BTG bc1qfun6tu3xkgqe0h7gcyjt036ew8n27p2nhl5ymuakcrjx0cu7a4nqqueq7n
	
	Type: p2sh
	Segwit(nested): AWGBg1UmRQAekSFMZFkBeLDFbR7Z63S8ey
	Segwit(bech): bc1qfun6tu3xkgqe0h7gcyjt036ew8n27p2nhl5ymuakcrjx0cu7a4nqqueq7n

	node2 tx.js BTC convert BCH bc1q2m87z4h0mwxdqjuetmgf95tdc9wmdqz7tg4540

	Type: p2pkh
	Address: 18v29GccczH8nxPVm3zQ1xVaxV5Wh4Yz9v
	Segwit(nested): 3NqxkcqbasHnTxQ6hHyMrJv5kC1D4o3jTC
	Segwit(bech): bc1q2m87z4h0mwxdqjuetmgf95tdc9wmdqz7tg4540
	BCH bech: bitcoincash:qptvlc2kaldce5ztn90dpyk3dhq4md5qtc6jk64fjm

	node tx.js BTC convert BCH 18v29GccczH8nxPVm3zQ1xVaxV5Wh4Yz9v

	Type: p2pkh
	Address: 18v29GccczH8nxPVm3zQ1xVaxV5Wh4Yz9v
	Segwit(nested): 3NqxkcqbasHnTxQ6hHyMrJv5kC1D4o3jTC
	Segwit(bech): bc1q2m87z4h0mwxdqjuetmgf95tdc9wmdqz7tg4540
	BCH bech: bitcoincash:qptvlc2kaldce5ztn90dpyk3dhq4md5qtc6jk64fjm

	node tx.js BTC convert ZEC 18v29GccczH8nxPVm3zQ1xVaxV5Wh4Yz9v

	Type: p2pkh
	Address: t1Rnd9c2kbK4jPbSPhUoX9mbWD9GbVzrhus
	Segwit(nested): t3fiZkxFjZC5P4bSzdinUz81zzrCHpbMpx2
	Segwit(bech): bc1q2m87z4h0mwxdqjuetmgf95tdc9wmdqz7tg4540
	
	node tx.js BCH convert BTG bitcoincash:qptvlc2kaldce5ztn90dpyk3dhq4md5qtc6jk64fjm
	
	Type: p2pkh
	Address: GRkwZPwZbqtRsRgngzeWSiqUsesMkp6eB9
	Segwit(nested): AcvpUaCnN7dZBkuf8qy6aZpF5GeBqdfKLg
	Segwit(bech): bc1q2m87z4h0mwxdqjuetmgf95tdc9wmdqz7tg4540
	
	node tx.js BTC convert BCH 375tSX5mD7BbXusGrV5GaGuy4aDH9VR176
	
	Type: p2sh
	Address: 375tSX5mD7BbXusGrV5GaGuy4aDH9VR176
	BCH bech: bitcoincash:pqajhuctcwsmjugrlnv2tn6w7sn2fug7uqvzsme2g0
	
	node tx.js BCH convert BTG pqajhuctcwsmjugrlnv2tn6w7sn2fug7uqvzsme2g0
	
	Type: p2sh
	Address: AMAkAUSwzMXNFiNqJ351JXp8PerFzPbZmy

## Decode redeem scripts

To find the keys corresponding to a m of n redeem script, you can run:

	node tx.js <coin> decoderedeem <redeem>
	
	node tx.js BTG decoderedeem 5521038c71760a4aac81afd4a314dc989c1a0621d28aac584992a26d1993709bdafddb2102fe49b9e7ad51e1bcd4ab5a76dbf4a03d2205a3dc3051494290368a9aa968dd2d2103e3c30f4d2bfcc8e9f8e5268e6f3d0f6faa539fc57600661a607b6db0daabb28921030f56f89e8c20c4b46c3101d13fd8fe5a47dafbdfbd44dbd49cd91dc5aac5c1782102636f4cf63a1f404d3d3b64084bd61a0c9fff47ee84f950492ff87df209c0a04321031fd4c6eab8efffeae088109fe450b50f5d30476e5a82925be4b7cb624eb5406d21031fd4c6eab8efffeae088109fe450b50f5d30476e5a82925be4b7cb624eb5406d57ae
	
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

## Create redeem scripts

	node tx.js <coin> createredeemfrompub <m> pub1-pub2-pub3...
	
	node2 tx.js BTG createredeemfrompub 5 038c71760a4aac81afd4a314dc989c1a0621d28aac584992a26d1993709bdafddb-02fe49b9e7ad51e1bcd4ab5a76dbf4a03d2205a3dc3051494290368a9aa968dd2d-03e3c30f4d2bfcc8e9f8e5268e6f3d0f6faa539fc57600661a607b6db0daabb289-030f56f89e8c20c4b46c3101d13fd8fe5a47dafbdfbd44dbd49cd91dc5aac5c178-02636f4cf63a1f404d3d3b64084bd61a0c9fff47ee84f950492ff87df209c0a043-031fd4c6eab8efffeae088109fe450b50f5d30476e5a82925be4b7cb624eb5406d-031fd4c6eab8efffeae088109fe450b50f5d30476e5a82925be4b7cb624eb5406d
	
	Redeem script: 5521038c71760a4aac81afd4a314dc989c1a0621d28aac584992a26d1993709bdafddb2102fe49b9e7ad51e1bcd4ab5a76dbf4a03d2205a3dc3051494290368a9aa968dd2d2103e3c30f4d2bfcc8e9f8e5268e6f3d0f6faa539fc57600661a607b6db0daabb28921030f56f89e8c20c4b46c3101d13fd8fe5a47dafbdfbd44dbd49cd91dc5aac5c1782102636f4cf63a1f404d3d3b64084bd61a0c9fff47ee84f950492ff87df209c0a04321031fd4c6eab8efffeae088109fe450b50f5d30476e5a82925be4b7cb624eb5406d21031fd4c6eab8efffeae088109fe450b50f5d30476e5a82925be4b7cb624eb5406d57ae
	Address: AMAkAUSwzMXNFiNqJ351JXp8PerFzPbZmy
	Segwit (nested): AWGBg1UmRQAekSFMZFkBeLDFbR7Z63S8ey
	Segwit (bech32): bc1qfun6tu3xkgqe0h7gcyjt036ew8n27p2nhl5ymuakcrjx0cu7a4nqqueq7n
	
	node tx.js BCH createredeemfrompub 5 038c71760a4aac81afd4a314dc989c1a0621d28aac584992a26d1993709bdafddb-02fe49b9e7ad51e1bcd4ab5a76dbf4a03d2205a3dc3051494290368a9aa968dd2d-03e3c30f4d2bfcc8e9f8e5268e6f3d0f6faa539fc57600661a607b6db0daabb289-030f56f89e8c20c4b46c3101d13fd8fe5a47dafbdfbd44dbd49cd91dc5aac5c178-02636f4cf63a1f404d3d3b64084bd61a0c9fff47ee84f950492ff87df209c0a043-031fd4c6eab8efffeae088109fe450b50f5d30476e5a82925be4b7cb624eb5406d-031fd4c6eab8efffeae088109fe450b50f5d30476e5a82925be4b7cb624eb5406d

	Redeem script: 5521038c71760a4aac81afd4a314dc989c1a0621d28aac584992a26d1993709bdafddb2102fe49b9e7ad51e1bcd4ab5a76dbf4a03d2205a3dc3051494290368a9aa968dd2d2103e3c30f4d2bfcc8e9f8e5268e6f3d0f6faa539fc57600661a607b6db0daabb28921030f56f89e8c20c4b46c3101d13fd8fe5a47dafbdfbd44dbd49cd91dc5aac5c1782102636f4cf63a1f404d3d3b64084bd61a0c9fff47ee84f950492ff87df209c0a04321031fd4c6eab8efffeae088109fe450b50f5d30476e5a82925be4b7cb624eb5406d21031fd4c6eab8efffeae088109fe450b50f5d30476e5a82925be4b7cb624eb5406d57ae
	Address: 375tSX5mD7BbXusGrV5GaGuy4aDH9VR176
	Segwit (nested): 3GBKx47ae9pt2djo7hkSv5K6GLUaL6Vwvm
	Segwit (bech32): bc1qfun6tu3xkgqe0h7gcyjt036ew8n27p2nhl5ymuakcrjx0cu7a4nqqueq7n
	BCH bech: bitcoincash:pqajhuctcwsmjugrlnv2tn6w7sn2fug7uqvzsme2g0

Probably of no use except for testing purposes:	

	node tx.js <coin> createredeem <m> priv1-priv2-priv3...
	
	node tx.js BTG createredeem 5 Kyib9iMhJxL6Zh1srtz3caTAqXhP5gsETuUBiQZEmFBrU3KAkiAg-L5Wn7mijns7mmH7GHfy2qRY9dwHDhTZ7MVW1HfpWMQxtKLseFEu2-L3EqabcHM2Fmp9odX7NSj8sKfZp4C9f1FNCkywMWK7FoPApuyfZF-KxNnFgNR5JVxZmiLrBCCEzB9g3cZU4Jx9PuYn1hLUtbm22PBNvtM-L3zqniBtFP9y41Pd8LbST99QpwWokdZd5J5aVfamnPKAfBqAta8y-L4m4szR86cinah7ttR62FTLFK2sfAgehiYGXzHbFYmxhmNBY9oJw-L4m4szR86cinah7ttR62FTLFK2sfAgehiYGXzHbFYmxhmNBY9oJw
	
	Redeem script: 5521038c71760a4aac81afd4a314dc989c1a0621d28aac584992a26d1993709bdafddb2102fe49b9e7ad51e1bcd4ab5a76dbf4a03d2205a3dc3051494290368a9aa968dd2d2103e3c30f4d2bfcc8e9f8e5268e6f3d0f6faa539fc57600661a607b6db0daabb28921030f56f89e8c20c4b46c3101d13fd8fe5a47dafbdfbd44dbd49cd91dc5aac5c1782102636f4cf63a1f404d3d3b64084bd61a0c9fff47ee84f950492ff87df209c0a04321031fd4c6eab8efffeae088109fe450b50f5d30476e5a82925be4b7cb624eb5406d21031fd4c6eab8efffeae088109fe450b50f5d30476e5a82925be4b7cb624eb5406d57ae
	Address: AMAkAUSwzMXNFiNqJ351JXp8PerFzPbZmy
	Segwit (nested): AWGBg1UmRQAekSFMZFkBeLDFbR7Z63S8ey
	Segwit (bech32): bc1qfun6tu3xkgqe0h7gcyjt036ew8n27p2nhl5ymuakcrjx0cu7a4nqqueq7n

	node tx.js BCH createredeem 5 Kyib9iMhJxL6Zh1srtz3caTAqXhP5gsETuUBiQZEmFBrU3KAkiAg-L5Wn7mijns7mmH7GHfy2qRY9dwHDhTZ7MVW1HfpWMQxtKLseFEu2-L3EqabcHM2Fmp9odX7NSj8sKfZp4C9f1FNCkywMWK7FoPApuyfZF-KxNnFgNR5JVxZmiLrBCCEzB9g3cZU4Jx9PuYn1hLUtbm22PBNvtM-L3zqniBtFP9y41Pd8LbST99QpwWokdZd5J5aVfamnPKAfBqAta8y-L4m4szR86cinah7ttR62FTLFK2sfAgehiYGXzHbFYmxhmNBY9oJw-L4m4szR86cinah7ttR62FTLFK2sfAgehiYGXzHbFYmxhmNBY9oJw
	
	Redeem script: 5521038c71760a4aac81afd4a314dc989c1a0621d28aac584992a26d1993709bdafddb2102fe49b9e7ad51e1bcd4ab5a76dbf4a03d2205a3dc3051494290368a9aa968dd2d2103e3c30f4d2bfcc8e9f8e5268e6f3d0f6faa539fc57600661a607b6db0daabb28921030f56f89e8c20c4b46c3101d13fd8fe5a47dafbdfbd44dbd49cd91dc5aac5c1782102636f4cf63a1f404d3d3b64084bd61a0c9fff47ee84f950492ff87df209c0a04321031fd4c6eab8efffeae088109fe450b50f5d30476e5a82925be4b7cb624eb5406d21031fd4c6eab8efffeae088109fe450b50f5d30476e5a82925be4b7cb624eb5406d57ae
	Address: 375tSX5mD7BbXusGrV5GaGuy4aDH9VR176
	Segwit (nested): 3GBKx47ae9pt2djo7hkSv5K6GLUaL6Vwvm
	Segwit (bech32): bc1qfun6tu3xkgqe0h7gcyjt036ew8n27p2nhl5ymuakcrjx0cu7a4nqqueq7n
	BCH bech: bitcoincash:pqajhuctcwsmjugrlnv2tn6w7sn2fug7uqvzsme2g0
	
## BIP32,39,44,49,84,141

Short summary:

- BIP32: defines how to derive P2PK keys from a 32 bytes seed according to a path (see createwallet above)

- BIP39: allows you to derive a seed from n words (where n is a multiple of 3) chosen from a list, there is a non mandatory checksum but probably enforced by every wallets, the seed is derived first according to BIP32, then derived from the path chosen

- BIP44: defines the path to derive a BIP39 seed for each coin

- BIP49: defines the path to derive a BIP39 seed to segwit nested addresses for each coin

- BIP84: defines the path to derive a BIP39 seed to bech32 addresses for each coin

- BIP141: segwit specs

The legacy derivation path `m/0'/0'/0'` defined by bitcoin core is used by default for BIP32 and BIP141, use the 'bip44' tag to change it to bip44 path

See the test vectors in [BIPs](https://github.com/Ayms/bitcoin-transactions/blob/master/tests/test_bip39.js)

### BIP39 seed

	node tx.js <coin> bip39 <language> <words> <optional (will default to legacy for BTC and bip44 for others):bip44/49/84/141>

	node tx.js BTC bip39 english "evidence ripple can refuse organ original peasant camp bar train similar scatter prepare follow meadow" bip49

	Version BTC
	Seed: b93f5a19c1701859611f5b23b5d87856386f7e3864bfceb3d2dd8327ea00bfbffad7fc5dfbd9f0a25b0f4778448ae9942dcfe97f113602313e40624b1ce1e423
	Root key: yprvABrGsX5C9januSgBRoJ6oFWCixUtcLgGagTZK5gARswdD5gCEEioddiUHutTvY6q57bKjPnBVS54R8vbw6HEgqpWW4bMEWyu6a3ega5n37y
	Valid checksum: Yes

### BIP39 wallets

	node tx.js <coin> createbip39wallet <words or extended private key> <language or null>  <optional (will default to legacy for BTC and bip44 for others):bip44/49/84/141> <optional - number of addresses> <optional - custom path>
	
	Examples:
	
	node tx.js BTC createbip39wallet "evidence ripple can refuse organ original peasant camp bar train similar scatter prepare follow meadow" english

	Seed: b93f5a19c1701859611f5b23b5d87856386f7e3864bfceb3d2dd8327ea00bfbffad7fc5dfbd9f0a25b0f4778448ae9942dcfe97f113602313e40624b1ce1e423
	Root key: xprv9s21ZrQH143K49V4bSWUbAQhYzLSfigmfZwLXgnH3sZk9yrxyaZF1a4LGhvsvdSufUUWyvBd2miWXrK3DPsDtc8uditvecAQpqz1Hy2sYwq
	Valid checksum: Yes
	# extended private masterkey: xprv9s21ZrQH143K49V4bSWUbAQhYzLSfigmfZwLXgnH3sZk9yrxyaZF1a4LGhvsvdSufUUWyvBd2miWXrK3DPsDtc8uditvecAQpqz1Hy2sYwq
	L4ANvvMfS7ux4SJGoLPMxFD5Hh5PTE3Zm2gzfA7WDi8Gmmu43bY3 2019-07-13T19:02:51.700Z label= # addr=19NRnfG6CJUxSxkVrwjC2rZi9ruFU3b1C6 hdkeypath=m/0'/0'/0'
	KxV6EiYtBmgv8kcoL92F1dx36jTGLZmTMGuJ8siEkYXyw1NJehpD 2019-07-13T19:02:51.700Z reserve=1 # addr=1C7eBnr52uHsKZG4etZvbTvYgvRY5qtmVD hdkeypath=m/0'/0'/1'
	KxMKjtJY3NQzQo1EtGJKMEBg4nmh7zgNayCQZ4itqsPVifCbGCnV 2019-07-13T19:02:51.700Z reserve=1 # addr=1NdJ346ojWupuQMc134CG2MsPzLseQrw97 hdkeypath=m/0'/0'/2'
	
	node tx.js BTC createbip39wallet "evidence ripple can refuse organ original peasant camp bar train similar scatter prepare follow meadow" english bip141
	
	# extended private masterkey: yprvABrGsX5C9januSgBRoJ6oFWCixUtcLgGagTZK5gARswdD5gCEEioddiUHutTvY6q57bKjPnBVS54R8vbw6HEgqpWW4bMEWyu6a3ega5n37y
	L4ANvvMfS7ux4SJGoLPMxFD5Hh5PTE3Zm2gzfA7WDi8Gmmu43bY3 2019-07-09T17:41:05.631Z label= # addr=3GYpJFyGCGReBy1uZCuzxrvxWNxFzXhNq9 hdkeypath=m/0'/0'/0'
	KxV6EiYtBmgv8kcoL92F1dx36jTGLZmTMGuJ8siEkYXyw1NJehpD 2019-07-09T17:41:05.631Z reserve=1 # addr=3QdLvwr2hZLgtDijEi2v52uR6fw6rudwLj hdkeypath=m/0'/0'/1'
	KxMKjtJY3NQzQo1EtGJKMEBg4nmh7zgNayCQZ4itqsPVifCbGCnV 2019-07-09T17:41:05.631Z reserve=1 # addr=35WC7bMssH6VY7czcYgVPMghqPtm6DcxWv hdkeypath=m/0'/0'/2'
	
	node tx.js BTG createbip39wallet xprv9s21ZrQH143K49V4bSWUbAQhYzLSfigmfZwLXgnH3sZk9yrxyaZF1a4LGhvsvdSufUUWyvBd2miWXrK3DPsDtc8uditvecAQpqz1Hy2sYwq null bip49

	# extended private masterkey: yprvABrGsX5C9januSgBRoJ6oFWCixUtcLgGagTZK5gARswdD5gCEEioddiUHutTvY6q57bKjPnBVS54R8vbw6HEgqpWW4bMEWyu6a3ega5n37y
	L52DFviYti9soWsJC5vfu47fNfBvN1isQETjhYYz2wbaoeQVta4K 2019-07-09T17:45:53.253Z label= # addr=AXepuY6uMUiwndcUfX8aDWKaP9yQ8DMXPF hdkeypath=m/49'/156'/0'/0/0
	L2dphVFbPGGiGHK4fsfDXUKkVqH54rky6LP6xjDwNcsJyYshfGmV 2019-07-09T17:45:53.253Z reserve=1 # addr=AZs6TgM8F6G8XgnmET6PwPiDo66LWhjDLB hdkeypath=m/49'/156'/0'/0/1
	L3oBxwnJpWRq16VzxNAyCG4YcZeHqDPTck2U49C1kzHxwPEEYsg8 2019-07-09T17:45:53.253Z reserve=1 # addr=AcZCua2cve6sfBzvbq87zebebavrimqY34 hdkeypath=m/49'/156'/0'/0/2
	
	node tx.js BTC createbip39wallet xprv9s21ZrQH143K49V4bSWUbAQhYzLSfigmfZwLXgnH3sZk9yrxyaZF1a4LGhvsvdSufUUWyvBd2miWXrK3DPsDtc8uditvecAQpqz1Hy2sYwq null bip84 50 "m/4800'/1'/2'/500"
	
	# extended private masterkey: zprvAWgYBBk7JR8GkjsJGA5j1LbhtvdLYxfmVnyn6Ua3otKWGBVRUttNFhNcK7r3vSkkUki8UsNjx6RcJRYAenhFV5W7NQHmpRoPNJ7J55jxDjE
	L4RhkBeBBc7Nt5f8cr1GxuaTWZirEUiC9UsmWDWvSj57BdQTSRzD 2019-07-09T21:07:07.764Z label= # addr=bc1qvhtt3ygh00gmm5dcp6q4agk7ygus0ry2f36mf7 hdkeypath=m/4800'/1'/2'/500
	KyeGs21U4iSwfcpXJWdq6enZ1PMvKianbZUfi7iiCGnrqmXJAd2m 2019-07-09T21:07:07.764Z reserve=1 # addr=bc1q3z2jvq992p8tqye3fhqr5wyrashav3as659suu hdkeypath=m/4800'/1'/2'/501
	L318UpxtT6suNgbvWeqoRjDUZY2RfdQ3q1JaYVPyReDZz8fzCEJk 2019-07-09T21:07:07.764Z reserve=1 # addr=bc1qww9dn84frhfae99v73cu3trf3429lk58cp4dkv hdkeypath=m/4800'/1'/2'/502
	
	node tx.js BTC createbip39wallet zprvAWgYBBk7JR8GkjsJGA5j1LbhtvdLYxfmVnyn6Ua3otKWGBVRUttNFhNcK7r3vSkkUki8UsNjx6RcJRYAenhFV5W7NQHmpRoPNJ7J55jxDjE null bip84 50 "m/4800'/1'/2'/500"
	
	# extended private masterkey: zprvAWgYBBk7JR8GkjsJGA5j1LbhtvdLYxfmVnyn6Ua3otKWGBVRUttNFhNcK7r3vSkkUki8UsNjx6RcJRYAenhFV5W7NQHmpRoPNJ7J55jxDjE
	L4RhkBeBBc7Nt5f8cr1GxuaTWZirEUiC9UsmWDWvSj57BdQTSRzD 2019-07-09T21:15:29.935Z label= # addr=bc1qvhtt3ygh00gmm5dcp6q4agk7ygus0ry2f36mf7 hdkeypath=m/4800'/1'/2'/500
	KyeGs21U4iSwfcpXJWdq6enZ1PMvKianbZUfi7iiCGnrqmXJAd2m 2019-07-09T21:15:29.935Z reserve=1 # addr=bc1q3z2jvq992p8tqye3fhqr5wyrashav3as659suu hdkeypath=m/4800'/1'/2'/501
	L318UpxtT6suNgbvWeqoRjDUZY2RfdQ3q1JaYVPyReDZz8fzCEJk 2019-07-09T21:15:29.935Z reserve=1 # addr=bc1qww9dn84frhfae99v73cu3trf3429lk58cp4dkv hdkeypath=m/4800'/1'/2'/502
	
### BIP39 words recovery

The tool allows you to recover one or two words in a BIP39 sequence in case you lost them (or to get the right words to have a correct checksum), two words still makes too many possibilities so most likely you should use this feature with only one word
	
	node tx.js <coin> recoverbip39 <language> <words> <m> <n optional>
	
m is the position of the first missing word, n the one of the second one (if relevant)
	
	node tx.js BTC recoverbip39 english "evidence ripple refuse organ original peasant camp bar train similar scatter prepare follow meadow" 3
	
	evidence ripple absent refuse organ original peasant camp bar train similar scatter prepare follow meadow
	evidence ripple adapt refuse organ original peasant camp bar train similar scatter prepare follow meadow
	evidence ripple answer refuse organ original peasant camp bar train similar scatter prepare follow meadow
	evidence ripple apology refuse organ original peasant camp bar train similar scatter prepare follow meadow
	...
	
### BIP39 seeds generation

We do not advise to use this feature since javascript prng still can be weak, instead we would recommend to use a BIP32 seed from for example [QRNG](http://qrng.anu.edu.au/) go to Live Numbers-->Live streams-->Hex and copy 64 digits (ie a 32B hex seed)

	node tx.js <coin> generatebip39 <language> <nb>
	
nb is the number of words
	
	node tx.js BTC generatebip39 english 15
	
	wrong history this yard mass agree glove matter notable arrive cabin shell leisure test anger

## Get public key from private

	node tx.js BTC getpubfromprivate <32B private key or WIF string>
	
	node tx.js BTC getpubfromprivate 4a87f69e181ee018da08ecdb9eea6ac45841070c1863aba37a60a7e33b95dd6f

	Pubkey: 038c71760a4aac81afd4a314dc989c1a0621d28aac584992a26d1993709bdafddb
	Address: 18v29GccczH8nxPVm3zQ1xVaxV5Wh4Yz9v
	Segwit nested: 3NqxkcqbasHnTxQ6hHyMrJv5kC1D4o3jTC
	Segwit bech32: bc1q2m87z4h0mwxdqjuetmgf95tdc9wmdqz7tg4540
	Hash160: 56cfe156efdb8cd04b995ed092d16dc15db6805e
	
	node tx.js BCH getpubfromprivate Kyib9iMhJxL6Zh1srtz3caTAqXhP5gsETuUBiQZEmFBrU3KAkiAg
	
	Pubkey: 038c71760a4aac81afd4a314dc989c1a0621d28aac584992a26d1993709bdafddb
	Address: 18v29GccczH8nxPVm3zQ1xVaxV5Wh4Yz9v
	Segwit nested: 3NqxkcqbasHnTxQ6hHyMrJv5kC1D4o3jTC
	Segwit bech32: bc1q2m87z4h0mwxdqjuetmgf95tdc9wmdqz7tg4540
	Hash160: 56cfe156efdb8cd04b995ed092d16dc15db6805e
	BCH bech: bitcoincash:qptvlc2kaldce5ztn90dpyk3dhq4md5qtc6jk64fjm

## Get private from WIF and vice-versa

	node tx.js BTC getprivfromwif Kyib9iMhJxL6Zh1srtz3caTAqXhP5gsETuUBiQZEmFBrU3KAkiAg
	Priv: 4a87f69e181ee018da08ecdb9eea6ac45841070c1863aba37a60a7e33b95dd6f
	
	node tx.js BTC privtowif 4a87f69e181ee018da08ecdb9eea6ac45841070c1863aba37a60a7e33b95dd6f
	WIF Priv: Kyib9iMhJxL6Zh1srtz3caTAqXhP5gsETuUBiQZEmFBrU3KAkiAg

## Public to addresses and hash
	
	node tx.js BTC pubtoaddress 038c71760a4aac81afd4a314dc989c1a0621d28aac584992a26d1993709bdafddb
	
	Pubkey: 038c71760a4aac81afd4a314dc989c1a0621d28aac584992a26d1993709bdafddb
	Address: 18v29GccczH8nxPVm3zQ1xVaxV5Wh4Yz9v
	Segwit nested: 3NqxkcqbasHnTxQ6hHyMrJv5kC1D4o3jTC
	Segwit bech32: bc1q2m87z4h0mwxdqjuetmgf95tdc9wmdqz7tg4540
	Hash160: 56cfe156efdb8cd04b995ed092d16dc15db6805e
	
	node tx.js BTC pubtoaddress 18v29GccczH8nxPVm3zQ1xVaxV5Wh4Yz9v
	
	Address: 18v29GccczH8nxPVm3zQ1xVaxV5Wh4Yz9v
	Segwit nested: 3NqxkcqbasHnTxQ6hHyMrJv5kC1D4o3jTC
	Segwit bech32: bc1q2m87z4h0mwxdqjuetmgf95tdc9wmdqz7tg4540
	Hash160: 56cfe156efdb8cd04b995ed092d16dc15db6805e

	node tx.js BCH pubtoaddress 18v29GccczH8nxPVm3zQ1xVaxV5Wh4Yz9v
	
	Address: 18v29GccczH8nxPVm3zQ1xVaxV5Wh4Yz9v
	Segwit nested: 3NqxkcqbasHnTxQ6hHyMrJv5kC1D4o3jTC
	Segwit bech32: bc1q2m87z4h0mwxdqjuetmgf95tdc9wmdqz7tg4540
	Hash160: 56cfe156efdb8cd04b995ed092d16dc15db6805e
	BCH bech: bitcoincash:qptvlc2kaldce5ztn90dpyk3dhq4md5qtc6jk64fjm

## Sign/Verify messages

This is used to prove ownership of a given address

Be careful anyway not to over use it, or do it privately, because once you have proven the ownership of a given address, then the corresponding public key becomes public, see decode transactions above

Each coin uses a prefix appended to the message to be signed (generally the string 'Bitcoin signed message:\n'), we have set the correct prefix for the main coins but did not check for all of them
	
	node tx.js <coin> signmessage <message> <privatekey> <type>
	
	type is: 'n' for compressed key, 's' for segwit, 'b' for bech32
	
	type is in fact of no use and not relevant for this module, therefore ignored by verify (but set correctly for signing), but it can be checked by other tools
	
	node tx.js BTC signmessage 'Thanks Ayms this module is great!' Kyib9iMhJxL6Zh1srtz3caTAqXhP5gsETuUBiQZEmFBrU3KAkiAg n
	
	Signature : Hw/PE+L4GW8C4S+V/6rgDZx9UHHU8hVXe8knNQQIFl73b98EWD8C1/lXA6uMOS5jJTLTXDf2t2a5zUkvOdTEQt4=

	node tx.js BTC verifymessage 'Thanks Ayms this module is great!' 'Hw/PE+L4GW8C4S+V/6rgDZx9UHHU8hVXe8knNQQIFl73b98EWD8C1/lXA6uMOS5jJTLTXDf2t2a5zUkvOdTEQt4=' 18v29GccczH8nxPVm3zQ1xVaxV5Wh4Yz9v

	Signature verified - Public key 038c71760a4aac81afd4a314dc989c1a0621d28aac584992a26d1993709bdafddb
	
	node tx.js BTC verifymessage 'Thanks Ayms this module is great!' 'Hw/PE+L4GW8C4S+V/6rgDZx9UHHU8hVXe8knNQQIFl73b98EWD8C1/lXA6uMOS5jJTLTXDf2t2a5zUkvOdTEQt4=' 3NqxkcqbasHnTxQ6hHyMrJv5kC1D4o3jTC
	
	Signature verified - Public key 038c71760a4aac81afd4a314dc989c1a0621d28aac584992a26d1993709bdafddb
	
	node tx.js BTC verifymessage 'Thanks Ayms this module is great!' 'Hw/PE+L4GW8C4S+V/6rgDZx9UHHU8hVXe8knNQQIFl73b98EWD8C1/lXA6uMOS5jJTLTXDf2t2a5zUkvOdTEQt4=' bc1q2m87z4h0mwxdqjuetmgf95tdc9wmdqz7tg4540
	
	Signature verified - Public key 038c71760a4aac81afd4a314dc989c1a0621d28aac584992a26d1993709bdafddb
	
	node tx.js BCH verifymessage 'Thanks Ayms this module is great!' 'Hw/PE+L4GW8C4S+V/6rgDZx9UHHU8hVXe8knNQQIFl73b98EWD8C1/lXA6uMOS5jJTLTXDf2t2a5zUkvOdTEQt4=' qptvlc2kaldce5ztn90dpyk3dhq4md5qtc6jk64fjm
	
	Signature verified - Public key 038c71760a4aac81afd4a314dc989c1a0621d28aac584992a26d1993709bdafddb
	
	node tx.js ZEC verifymessage 'I am a signed Zcash message' 'IO5jX5/RhpIqbo52uOs1d9g0D5+Al4cpzyWyEitZYO24HFZbb6lI94k+X7LwhqmaEi6eorUzpDSG2JPArKTN1EU=' t1LF5Se66f3uRFPFLC86FSRBasbLqTbz86k
	
	Signature verified - Public key 0259a77bc3c5621b65e557a6cc83a45a8fc4a9aa5a8908ae8e9664f41cd345842f
	
## Notes for the devs

The module is not trivial, any slight change can cause everything not to work any longer and can become difficult to identify at a certain point of time, therefore it is advised to periodically test the latest example in the multisig test vectors while making changes (if this one passes it's unlikely that something is wrong). In addition serialize/deserialize is not symetrical then ``true`` must be used when not coming from a Tx constructor transaction, initially this was a mistake due to misreading of segwit specs, we decided to keep it like this because double checking symetrical potential wrong things is just useless, therefore this adds a last serialize/deserialize independant check

## Browserification process and bugs

Please see [browserification](https://github.com/Ayms/bitcoin-transactions/tree/master/browserify/README.md)

The User Interface code and the complete browserified javascript code is [here](https://github.com/Ayms/bitcoin-transactions/blob/master/html)

There are probably some details to fix in the UI, for minor ones please email us, for others please post a bug or email

Before posting or emailing something please open the browser javascript console and send the content to us at the same time if it shows some js errors

### Related external bugs:

- https://github.com/indutny/bn.js/issues/227 this causes BN code to be included twice by browserify
- https://github.com/mishoo/UglifyJS2/issues/3443 surprisingly uglify does not support ES6

## Related projects :

* [Ayms/cashaddress](https://github.com/Ayms/cashaddress)
* [Ayms/bitcoin-wallets](https://github.com/Ayms/bitcoin-wallets)
* [Ayms/zcash-wallets](https://github.com/Ayms/zcash-wallets)
* [Ayms/bittorrent-nodeid](https://github.com/Ayms/bittorrent-nodeid)
* [Ayms/torrent-live](https://github.com/Ayms/torrent-live)
* [Ayms/node-Tor](https://github.com/Ayms/node-Tor)
* [Ayms/iAnonym](https://github.com/Ayms/iAnonym)
* [Interception Detector](http://ianonym.peersm.com/intercept.html)
* [Ayms/abstract-tls](https://github.com/Ayms/abstract-tls)
* [Ayms/websocket](https://github.com/Ayms/websocket)
* [Ayms/node-typedarray](https://github.com/Ayms/node-typedarray)
* [Ayms/node-dom](https://github.com/Ayms/node-dom)
* [Ayms/node-bot](https://github.com/Ayms/node-bot)
* [Ayms/node-gadgets](https://github.com/Ayms/node-gadgets)