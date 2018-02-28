node tx.js BTG create prevtx=39b6e448982e4fe151fb926ed2993b6f80b3a3c1973bef9f3e394d4132af74e7_94a73b7f26ba81c9f427ef6cccdea55136d621dda1b6cefdaa93f678c6e5a2b3_e6ee88b3bf9b2c18c10c867a5f805ab705e0cb7238e836076908a0e4f0ed3e31 prevaddr=GSBbeuKPu4d6HKJhtPgk7XayMcaXyQy8TS prevamount=0.00008500_0.00106195_0.00110399 previndex=1 privkey=<privkey> addr=GKz5ii8tWQG9hd196vNkwkLKsWHqaeKSoB fees=0.00000600

/*

Version BTG
create
--- Prevamount is small, min dev fees of 8500 apply - amount should be 0.00215994
--- Previous amount is: 0.00225094
--- Amount to spend is: 0.00215994
--- Network fees are: 0.00000600
--- Dev fees are: 0.00008500
Address corresponding to private key is GSBbeuKPu4d6HKJhtPgk7XayMcaXyQy8TS
{ input:
   [ { hash: '39b6e448982e4fe151fb926ed2993b6f80b3a3c1973bef9f3e394d4132af74e7',
       n: 1,
       scriptSigLen: <Buffer 6a>,
       scriptSig: [Object],
       data: null,
       script: null,
       nSequence: <Buffer ff ff ff ff>,
       pubKey: <Buffer 02 4a ff 97 02 46 74 82 b6 61 90 75 47 92 7f 27 32 90 1f 00 30 7e 6d 2d 0d d5 16 06 70 47 22 94 b8>,
       prevscriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       prevscriptPubkeyValue: 8500 },
     { hash: '94a73b7f26ba81c9f427ef6cccdea55136d621dda1b6cefdaa93f678c6e5a2b3',
       n: 1,
       scriptSigLen: <Buffer 6b>,
       scriptSig: [Object],
       data: null,
       script: null,
       nSequence: <Buffer ff ff ff ff>,
       pubKey: <Buffer 02 4a ff 97 02 46 74 82 b6 61 90 75 47 92 7f 27 32 90 1f 00 30 7e 6d 2d 0d d5 16 06 70 47 22 94 b8>,
       prevscriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       prevscriptPubkeyValue: 106195 },
     { hash: 'e6ee88b3bf9b2c18c10c867a5f805ab705e0cb7238e836076908a0e4f0ed3e31',
       n: 1,
       scriptSigLen: <Buffer 6b>,
       scriptSig: [Object],
       data: null,
       script: null,
       nSequence: <Buffer ff ff ff ff>,
       pubKey: <Buffer 02 4a ff 97 02 46 74 82 b6 61 90 75 47 92 7f 27 32 90 1f 00 30 7e 6d 2d 0d d5 16 06 70 47 22 94 b8>,
       prevscriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       prevscriptPubkeyValue: 110399 } ],
  output:
   [ { nValue: 215994,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 17 7b 58 5b 54 01 ad 21 b6 0b 78 b1 b3 c9 19 96 f2 50 29 6d 88 ac>,
       address: 'GKz5ii8tWQG9hd196vNkwkLKsWHqaeKSoB',
       type: 'p2pkh' },
     { nValue: 8500,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       address: '',
       type: 'p2pkh' } ],
  fees: 600,
  s: 8500,
  nLockTime: <Buffer 00 00 00 00>,
  nVersion: <Buffer 02 00 00 00>,
  sigHash: <Buffer 41 4f 00 00>,
  nbinput: 3,
  nboutput: 2,
  version: 'BTG' }
----- Transaction hash: 9659e77a0398654d67c17d59424507f728b8fbe7f6bf9f0919d0c941da75ad77
Transaction body:
0200000003e774af32414d393e9fef3b97c1a3b3806f3b99d26e92fb51e14f2e9848e4b639010000006a47304402201a969d454bf809e49bb284d510846fc27ffcc4a4ab02a32fa1413dc37264d20b02203c6f22c1884d79e1e6e163375ebc890d27486388c74db4a45a74089918f83e034121024aff9702467482b661907547927f2732901f00307e6d2d0dd5160670472294b8ffffffffb3a2e5c678f693aafdceb6a1dd21d63651a5decc6cef27f4c981ba267f3ba794010000006b483045022100fc1cc28f3e04437083124286edd6494b67fe7c3a58323f9919e8811503f3df4002203c4f3aec6056fcecd98c97c7a2902251a574e53d0d10ebc2321a0d498bcf557b4121024aff9702467482b661907547927f2732901f00307e6d2d0dd5160670472294b8ffffffff313eedf0e4a008690736e83872cbe005b75a805f7a860cc1182c9bbfb388eee6010000006b483045022100e98981859ed267b3a2fbb537737000dee77096c373f429570994d9620266cb480220113c7d173348657f5a404a27d40ec02d0aa9be2e79511f3b33dc22642a4581634121024aff9702467482b661907547927f2732901f00307e6d2d0dd5160670472294b8ffffffff02ba4b0300000000001976a914177b585b5401ad21b60b78b1b3c91996f250296d88ac34210000000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac00000000

Complete transaction:
e1476d447478000000000000000000000902000077ad75da0200000003e774af32414d393e9fef3b97c1a3b3806f3b99d26e92fb51e14f2e9848e4b639010000006a47304402201a969d454bf809e49bb284d510846fc27ffcc4a4ab02a32fa1413dc37264d20b02203c6f22c1884d79e1e6e163375ebc890d27486388c74db4a45a74089918f83e034121024aff9702467482b661907547927f2732901f00307e6d2d0dd5160670472294b8ffffffffb3a2e5c678f693aafdceb6a1dd21d63651a5decc6cef27f4c981ba267f3ba794010000006b483045022100fc1cc28f3e04437083124286edd6494b67fe7c3a58323f9919e8811503f3df4002203c4f3aec6056fcecd98c97c7a2902251a574e53d0d10ebc2321a0d498bcf557b4121024aff9702467482b661907547927f2732901f00307e6d2d0dd5160670472294b8ffffffff313eedf0e4a008690736e83872cbe005b75a805f7a860cc1182c9bbfb388eee6010000006b483045022100e98981859ed267b3a2fbb537737000dee77096c373f429570994d9620266cb480220113c7d173348657f5a404a27d40ec02d0aa9be2e79511f3b33dc22642a4581634121024aff9702467482b661907547927f2732901f00307e6d2d0dd5160670472294b8ffffffff02ba4b0300000000001976a914177b585b5401ad21b60b78b1b3c91996f250296d88ac34210000000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac00000000
Size 545 bytes
Network Fees: 600 - 1.10 satoshis/byte
Dev Fees: 8500
------------- Check - deserialize
{ input:
   [ { hash: '39b6e448982e4fe151fb926ed2993b6f80b3a3c1973bef9f3e394d4132af74e7',
       n: 1,
       scriptSigLen: 106,
       scriptSig: [Object],
       script: [Object],
       nSequence: <Buffer ff ff ff ff> },
     { hash: '94a73b7f26ba81c9f427ef6cccdea55136d621dda1b6cefdaa93f678c6e5a2b3',
       n: 1,
       scriptSigLen: 107,
       scriptSig: [Object],
       script: [Object],
       nSequence: <Buffer ff ff ff ff> },
     { hash: 'e6ee88b3bf9b2c18c10c867a5f805ab705e0cb7238e836076908a0e4f0ed3e31',
       n: 1,
       scriptSigLen: 107,
       scriptSig: [Object],
       script: [Object],
       nSequence: <Buffer ff ff ff ff> } ],
  output:
   [ { nValue: 215994,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 17 7b 58 5b 54 01 ad 21 b6 0b 78 b1 b3 c9 19 96 f2 50 29 6d 88 ac>,
       address: 'GKz5ii8tWQG9hd196vNkwkLKsWHqaeKSoB',
       type: 'p2pkh' },
     { nValue: 8500,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       address: 'GSBbeuKPu4d6HKJhtPgk7XayMcaXyQy8TS',
       type: 'p2pkh' } ],
  s: 0,
  nVersion: <Buffer 02 00 00 00>,
  nbinput: 3,
  nboutput: 2,
  nLockTime: <Buffer 00 00 00 00> }
------------- End Check - deserialize
------------- Check - verify
----- Transaction hash: 9659e77a0398654d67c17d59424507f728b8fbe7f6bf9f0919d0c941da75ad77
----- Transaction verified
----- Transaction hash: 9659e77a0398654d67c17d59424507f728b8fbe7f6bf9f0919d0c941da75ad77
------------- End Check - verify
*/


node tx.js BTG create prevtx=39b6e448982e4fe151fb926ed2993b6f80b3a3c1973bef9f3e394d4132af74e7:94a73b7f26ba81c9f427ef6cccdea55136d621dda1b6cefdaa93f678c6e5a2b3:e6ee88b3bf9b2c18c10c867a5f805ab705e0cb7238e836076908a0e4f0ed3e31 prevaddr=GSBbeuKPu4d6HKJhtPgk7XayMcaXyQy8TS prevamount=0.00008500:0.00106195:0.00110399 previndex=1 privkey=<privkey> addr=GKz5ii8tWQG9hd196vNkwkLKsWHqaeKSoB fees=0.00000600 amount=0.00107997

/*
Version BTG
create
--- Previous amount is: 0.00225094
--- Amount to spend is: 0.00107997
--- Network fees are: 0.00000600
--- Dev fees are: 0.00008500
--- Refunded amount to spending address is: 0.00107997
Address corresponding to private key is GSBbeuKPu4d6HKJhtPgk7XayMcaXyQy8TS
{ input:
   [ { hash: '39b6e448982e4fe151fb926ed2993b6f80b3a3c1973bef9f3e394d4132af74e7',
       n: 1,
       scriptSigLen: <Buffer 6b>,
       scriptSig: [Object],
       data: null,
       script: null,
       nSequence: <Buffer ff ff ff ff>,
       pubKey: <Buffer 02 4a ff 97 02 46 74 82 b6 61 90 75 47 92 7f 27 32 90 1f 00 30 7e 6d 2d 0d d5 16 06 70 47 22 94 b8>,
       prevscriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       prevscriptPubkeyValue: 8500 },
     { hash: '94a73b7f26ba81c9f427ef6cccdea55136d621dda1b6cefdaa93f678c6e5a2b3',
       n: 1,
       scriptSigLen: <Buffer 6a>,
       scriptSig: [Object],
       data: null,
       script: null,
       nSequence: <Buffer ff ff ff ff>,
       pubKey: <Buffer 02 4a ff 97 02 46 74 82 b6 61 90 75 47 92 7f 27 32 90 1f 00 30 7e 6d 2d 0d d5 16 06 70 47 22 94 b8>,
       prevscriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       prevscriptPubkeyValue: 106195 },
     { hash: 'e6ee88b3bf9b2c18c10c867a5f805ab705e0cb7238e836076908a0e4f0ed3e31',
       n: 1,
       scriptSigLen: <Buffer 6b>,
       scriptSig: [Object],
       data: null,
       script: null,
       nSequence: <Buffer ff ff ff ff>,
       pubKey: <Buffer 02 4a ff 97 02 46 74 82 b6 61 90 75 47 92 7f 27 32 90 1f 00 30 7e 6d 2d 0d d5 16 06 70 47 22 94 b8>,
       prevscriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       prevscriptPubkeyValue: 110399 } ],
  output:
   [ { nValue: 107997,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 17 7b 58 5b 54 01 ad 21 b6 0b 78 b1 b3 c9 19 96 f2 50 29 6d 88 ac>,
       address: 'GKz5ii8tWQG9hd196vNkwkLKsWHqaeKSoB',
       type: 'p2pkh' },
     { nValue: 107997,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       address: 'GSBbeuKPu4d6HKJhtPgk7XayMcaXyQy8TS',
       type: 'p2pkh' },
     { nValue: 8500,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       address: '',
       type: 'p2pkh' } ],
  fees: 600,
  s: 8500,
  nLockTime: <Buffer 00 00 00 00>,
  nVersion: <Buffer 02 00 00 00>,
  sigHash: <Buffer 41 4f 00 00>,
  nbinput: 3,
  nboutput: 3,
  version: 'BTG' }
----- Transaction hash: e60e6d9758ba7bfe5deeec4c4fd5a52c04d943883cab70ca844affa31da98efc
Transaction body:
0200000003e774af32414d393e9fef3b97c1a3b3806f3b99d26e92fb51e14f2e9848e4b639010000006b483045022100f4130c80a5d5866e1a791cd496f97bc00bada513c6a25f33a7e0db7153e9e90602200846e43976237c3ea4ef3cb430711e9eedeee377f5d918564ee3772cc7c60ebc4121024aff9702467482b661907547927f2732901f00307e6d2d0dd5160670472294b8ffffffffb3a2e5c678f693aafdceb6a1dd21d63651a5decc6cef27f4c981ba267f3ba794010000006a47304402202463e76d62549e899526c8c30e6ad17983b88c81e62079966b6e66e8ae3f26c302203bc25f5255165f030e3aaa7a796e0aac06f68a27d4862232052cffcd4a8416cc4121024aff9702467482b661907547927f2732901f00307e6d2d0dd5160670472294b8ffffffff313eedf0e4a008690736e83872cbe005b75a805f7a860cc1182c9bbfb388eee6010000006b483045022100ba254df6b97387bca504eb491dd26ed3feec12f2dedb5f30d36924d659a5f34b022037b8a960392b5c536c385976a51f0c0d6d129eaef3f212a9bb102a8f3b990e734121024aff9702467482b661907547927f2732901f00307e6d2d0dd5160670472294b8ffffffff03dda50100000000001976a914177b585b5401ad21b60b78b1b3c91996f250296d88acdda50100000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac34210000000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac00000000
Complete transaction:
e1476d447478000000000000000000002b020000fc8ea91d0200000003e774af32414d393e9fef3b97c1a3b3806f3b99d26e92fb51e14f2e9848e4b639010000006b483045022100f4130c80a5d5866e1a791cd496f97bc00bada513c6a25f33a7e0db7153e9e90602200846e43976237c3ea4ef3cb430711e9eedeee377f5d918564ee3772cc7c60ebc4121024aff9702467482b661907547927f2732901f00307e6d2d0dd5160670472294b8ffffffffb3a2e5c678f693aafdceb6a1dd21d63651a5decc6cef27f4c981ba267f3ba794010000006a47304402202463e76d62549e899526c8c30e6ad17983b88c81e62079966b6e66e8ae3f26c302203bc25f5255165f030e3aaa7a796e0aac06f68a27d4862232052cffcd4a8416cc4121024aff9702467482b661907547927f2732901f00307e6d2d0dd5160670472294b8ffffffff313eedf0e4a008690736e83872cbe005b75a805f7a860cc1182c9bbfb388eee6010000006b483045022100ba254df6b97387bca504eb491dd26ed3feec12f2dedb5f30d36924d659a5f34b022037b8a960392b5c536c385976a51f0c0d6d129eaef3f212a9bb102a8f3b990e734121024aff9702467482b661907547927f2732901f00307e6d2d0dd5160670472294b8ffffffff03dda50100000000001976a914177b585b5401ad21b60b78b1b3c91996f250296d88acdda50100000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac34210000000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac00000000
Size 579 bytes
Network Fees: 600 - 1.04 satoshis/byte
Dev Fees: 8500
------------- Check - deserialize
{ input:
   [ { hash: '39b6e448982e4fe151fb926ed2993b6f80b3a3c1973bef9f3e394d4132af74e7',
       n: 1,
       scriptSigLen: 107,
       scriptSig: [Object],
       script: [Object],
       nSequence: <Buffer ff ff ff ff> },
     { hash: '94a73b7f26ba81c9f427ef6cccdea55136d621dda1b6cefdaa93f678c6e5a2b3',
       n: 1,
       scriptSigLen: 106,
       scriptSig: [Object],
       script: [Object],
       nSequence: <Buffer ff ff ff ff> },
     { hash: 'e6ee88b3bf9b2c18c10c867a5f805ab705e0cb7238e836076908a0e4f0ed3e31',
       n: 1,
       scriptSigLen: 107,
       scriptSig: [Object],
       script: [Object],
       nSequence: <Buffer ff ff ff ff> } ],
  output:
   [ { nValue: 107997,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 17 7b 58 5b 54 01 ad 21 b6 0b 78 b1 b3 c9 19 96 f2 50 29 6d 88 ac>,
       address: 'GKz5ii8tWQG9hd196vNkwkLKsWHqaeKSoB',
       type: 'p2pkh' },
     { nValue: 107997,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       address: 'GSBbeuKPu4d6HKJhtPgk7XayMcaXyQy8TS',
       type: 'p2pkh' },
     { nValue: 8500,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       address: 'GSBbeuKPu4d6HKJhtPgk7XayMcaXyQy8TS',
       type: 'p2pkh' } ],
  s: 0,
  nVersion: <Buffer 02 00 00 00>,
  nbinput: 3,
  nboutput: 3,
  nLockTime: <Buffer 00 00 00 00> }
------------- End Check - deserialize
------------- Check - verify
----- Transaction hash: e60e6d9758ba7bfe5deeec4c4fd5a52c04d943883cab70ca844affa31da98efc
----- Transaction verified
----- Transaction hash: e60e6d9758ba7bfe5deeec4c4fd5a52c04d943883cab70ca844affa31da98efc
------------- End Check - verify
*/

//multisig 2 of 3 + 2 of 2 + standard p2pkh

node tx.js BTG create prevtx=a193319f02818dc8a0d5e5d75ef01018b17b4cf631246c5a5e3ab0d6f190d6ec:a3bf7ca4d4f4c8d6337ecd34a21c60a7b1457f7bb5c6b043f13800d00dae05ac:e6ee88b3bf9b2c18c10c867a5f805ab705e0cb7238e836076908a0e4f0ed3e31 prevaddr=APWkFpVPuqSf24m8et1sZvARHXNStB2H8x:APYoozQLELj1eV4JpAE95dTQUGcQNG4XVp:GSBbeuKPu4d6HKJhtPgk7XayMcaXyQy8TS prevamount=0.00459356:0.00009433:0.00110399 previndex=0:0:1 privkey=<priv1>-<priv2>-5221021254e3173d3351fa283d10c82042686f43e739933ab19860b479316ffbba57482102267d15316f752c73f80dac185a872463563f0c16457062de1be4d1e513442e8321039f1e160a02079a6d6b7be0334cc4d76a125cd13a6f8d7131b11c263bc20bf91853ae-2of3:<priv3>-<priv4>-5221021254e3173d3351fa283d10c82042686f43e739933ab19860b479316ffbba57482102267d15316f752c73f80dac185a872463563f0c16457062de1be4d1e513442e8352ae-2of2:<priv5> addr=GKz5ii8tWQG9hd196vNkwkLKsWHqaeKSoB fees=0.00000900 amount=0.002

/*

Version BTG
create
--- Previous amount is: 0.00579188
--- Amount to spend is: 0.00200000
--- Network fees are: 0.00000900
--- Dev fees are: 0.00008500
--- Refunded amount to spending address is: 0.00369788
Address corresponding to private key is GSBbeuKPu4d6HKJhtPgk7XayMcaXyQy8TS
{ input:
   [ { hash: 'a193319f02818dc8a0d5e5d75ef01018b17b4cf631246c5a5e3ab0d6f190d6ec',
       n: 0,
       scriptSigLen: <Buffer fd fd 00>,
       scriptSig: [Object],
       data: null,
       script: [Object],
       nSequence: <Buffer ff ff ff ff>,
       pubKey: [Object],
       prevscriptPubkey: <Buffer a9 14 54 e4 98 dd f5 e6 62 1e f6 2c 3f 1e f3 9b 39 94 a1 e4 21 a4 87>,
       redeem: <Buffer 52 21 02 12 54 e3 17 3d 33 51 fa 28 3d 10 c8 20 42 68 6f 43 e7 39 93 3a b1 98 60 b4 79 31 6f fb ba 57 48 21 02 26 7d 15 31 6f 75 2c 73 f8 0d ac 18 5a ... >,
       prevscriptPubkeyValue: 459356 },
     { hash: 'a3bf7ca4d4f4c8d6337ecd34a21c60a7b1457f7bb5c6b043f13800d00dae05ac',
       n: 0,
       scriptSigLen: <Buffer db>,
       scriptSig: [Object],
       data: null,
       script: [Object],
       nSequence: <Buffer ff ff ff ff>,
       pubKey: [Object],
       prevscriptPubkey: <Buffer a9 14 55 48 65 77 35 1c 6a 22 66 6a ae c3 72 3e a2 96 f5 e1 c2 1a 87>,
       redeem: <Buffer 52 21 02 12 54 e3 17 3d 33 51 fa 28 3d 10 c8 20 42 68 6f 43 e7 39 93 3a b1 98 60 b4 79 31 6f fb ba 57 48 21 02 26 7d 15 31 6f 75 2c 73 f8 0d ac 18 5a ... >,
       prevscriptPubkeyValue: 9433 },
     { hash: 'e6ee88b3bf9b2c18c10c867a5f805ab705e0cb7238e836076908a0e4f0ed3e31',
       n: 1,
       scriptSigLen: <Buffer 6b>,
       scriptSig: [Object],
       data: null,
       script: null,
       nSequence: <Buffer ff ff ff ff>,
       pubKey: <Buffer 02 4a ff 97 02 46 74 82 b6 61 90 75 47 92 7f 27 32 90 1f 00 30 7e 6d 2d 0d d5 16 06 70 47 22 94 b8>,
       prevscriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       prevscriptPubkeyValue: 110399 } ],
  output:
   [ { nValue: 200000,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 17 7b 58 5b 54 01 ad 21 b6 0b 78 b1 b3 c9 19 96 f2 50 29 6d 88 ac>,
       address: 'GKz5ii8tWQG9hd196vNkwkLKsWHqaeKSoB',
       type: 'p2pkh' },
     { nValue: 369788,
       scriptPubkeyLen: <Buffer 17>,
       scriptPubkey: <Buffer a9 14 54 e4 98 dd f5 e6 62 1e f6 2c 3f 1e f3 9b 39 94 a1 e4 21 a4 87>,
       address: 'APWkFpVPuqSf24m8et1sZvARHXNStB2H8x',
       type: 'p2sh' },
     { nValue: 8500,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       address: '',
       type: 'p2pkh' } ],
  fees: 900,
  s: 8500,
  nLockTime: <Buffer 00 00 00 00>,
  nVersion: <Buffer 02 00 00 00>,
  sigHash: <Buffer 41 4f 00 00>,
  nbinput: 3,
  nboutput: 3,
  version: 'BTG' }
----- Transaction hash: 1d78d063a95db4828fa621244d7d5550a6dc85f97b4fbceb2a84c2eeea1f04e0
Transaction body:
0200000003ecd690f1d6b03a5e5a6c2431f64c7bb11810f05ed7e5d5a0c88d81029f3193a100000000fdfd0000483045022100bed1ad72c2079e88ed6078a703fab6f14ba6d306e2fa5a11db2e03d1943eea5c02200b47a01b6337c5c2dac3c3be2f40f49311e1030ced3ca8077c16269bd8a3d85a4147304402204bb783b0466e91d3f56c3a171410ff429d531e288801e045217c5ab356dd359802206ac29fb0be836aab6ecd94eb033fa72ce1aaea07a6fdf3b5b30ecdc91fcb20b9414c695221021254e3173d3351fa283d10c82042686f43e739933ab19860b479316ffbba57482102267d15316f752c73f80dac185a872463563f0c16457062de1be4d1e513442e8321039f1e160a02079a6d6b7be0334cc4d76a125cd13a6f8d7131b11c263bc20bf91853aeffffffffac05ae0dd00038f143b0c6b57b7f45b1a7601ca234cd7e33d6c8f4d4a47cbfa300000000db00483045022100e6e2c3448b233865ab1d1f22907547687064b4d5f485fb129c7a4e2796671b6502205bb6d506485c0cc0c9378497d17e9e6d6959a26bc544c4b7bbf12ad65633291b41483045022100e34e7565742204a720e4de9ba0946085b7cf5bfae6005546213edf4ef6f54a1902207f83ecb3ab9a033b67635bdf66455c8196d02a536c4a4c611af2e916b5a37c6541475221021254e3173d3351fa283d10c82042686f43e739933ab19860b479316ffbba57482102267d15316f752c73f80dac185a872463563f0c16457062de1be4d1e513442e8352aeffffffff313eedf0e4a008690736e83872cbe005b75a805f7a860cc1182c9bbfb388eee6010000006b483045022100df677cfa16b26cf47e283cfb27ee81fda981ebae28630488b9373ca08833adcd02202c7f2a9dbe1849e7a242ab6067d02126758b4c3a276a865e451d27f0247bb3464121024aff9702467482b661907547927f2732901f00307e6d2d0dd5160670472294b8ffffffff03400d0300000000001976a914177b585b5401ad21b60b78b1b3c91996f250296d88ac7ca405000000000017a91454e498ddf5e6621ef62c3f1ef39b3994a1e421a48734210000000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac00000000
Complete transaction:
e1476d447478000000000000000000002e030000e0041fea0200000003ecd690f1d6b03a5e5a6c2431f64c7bb11810f05ed7e5d5a0c88d81029f3193a100000000fdfd0000483045022100bed1ad72c2079e88ed6078a703fab6f14ba6d306e2fa5a11db2e03d1943eea5c02200b47a01b6337c5c2dac3c3be2f40f49311e1030ced3ca8077c16269bd8a3d85a4147304402204bb783b0466e91d3f56c3a171410ff429d531e288801e045217c5ab356dd359802206ac29fb0be836aab6ecd94eb033fa72ce1aaea07a6fdf3b5b30ecdc91fcb20b9414c695221021254e3173d3351fa283d10c82042686f43e739933ab19860b479316ffbba57482102267d15316f752c73f80dac185a872463563f0c16457062de1be4d1e513442e8321039f1e160a02079a6d6b7be0334cc4d76a125cd13a6f8d7131b11c263bc20bf91853aeffffffffac05ae0dd00038f143b0c6b57b7f45b1a7601ca234cd7e33d6c8f4d4a47cbfa300000000db00483045022100e6e2c3448b233865ab1d1f22907547687064b4d5f485fb129c7a4e2796671b6502205bb6d506485c0cc0c9378497d17e9e6d6959a26bc544c4b7bbf12ad65633291b41483045022100e34e7565742204a720e4de9ba0946085b7cf5bfae6005546213edf4ef6f54a1902207f83ecb3ab9a033b67635bdf66455c8196d02a536c4a4c611af2e916b5a37c6541475221021254e3173d3351fa283d10c82042686f43e739933ab19860b479316ffbba57482102267d15316f752c73f80dac185a872463563f0c16457062de1be4d1e513442e8352aeffffffff313eedf0e4a008690736e83872cbe005b75a805f7a860cc1182c9bbfb388eee6010000006b483045022100df677cfa16b26cf47e283cfb27ee81fda981ebae28630488b9373ca08833adcd02202c7f2a9dbe1849e7a242ab6067d02126758b4c3a276a865e451d27f0247bb3464121024aff9702467482b661907547927f2732901f00307e6d2d0dd5160670472294b8ffffffff03400d0300000000001976a914177b585b5401ad21b60b78b1b3c91996f250296d88ac7ca405000000000017a91454e498ddf5e6621ef62c3f1ef39b3994a1e421a48734210000000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac00000000
Size 838 bytes
Network Fees: 900 - 1.07 satoshis/byte
Dev Fees: 8500
------------- Check - deserialize
{ input:
   [ { hash: 'a193319f02818dc8a0d5e5d75ef01018b17b4cf631246c5a5e3ab0d6f190d6ec',
       n: 0,
       scriptSigLen: 253,
       scriptSig: [Object],
       script: [Object],
       nSequence: <Buffer ff ff ff ff> },
     { hash: 'a3bf7ca4d4f4c8d6337ecd34a21c60a7b1457f7bb5c6b043f13800d00dae05ac',
       n: 0,
       scriptSigLen: 219,
       scriptSig: [Object],
       script: [Object],
       nSequence: <Buffer ff ff ff ff> },
     { hash: 'e6ee88b3bf9b2c18c10c867a5f805ab705e0cb7238e836076908a0e4f0ed3e31',
       n: 1,
       scriptSigLen: 107,
       scriptSig: [Object],
       script: [Object],
       nSequence: <Buffer ff ff ff ff> } ],
  output:
   [ { nValue: 200000,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 17 7b 58 5b 54 01 ad 21 b6 0b 78 b1 b3 c9 19 96 f2 50 29 6d 88 ac>,
       address: 'GKz5ii8tWQG9hd196vNkwkLKsWHqaeKSoB',
       type: 'p2pkh' },
     { nValue: 369788,
       scriptPubkeyLen: <Buffer 17>,
       scriptPubkey: <Buffer a9 14 54 e4 98 dd f5 e6 62 1e f6 2c 3f 1e f3 9b 39 94 a1 e4 21 a4 87>,
       address: 'APWkFpVPuqSf24m8et1sZvARHXNStB2H8x',
       type: 'p2sh' },
     { nValue: 8500,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       address: 'GSBbeuKPu4d6HKJhtPgk7XayMcaXyQy8TS',
       type: 'p2pkh' } ],
  s: 0,
  nVersion: <Buffer 02 00 00 00>,
  nbinput: 3,
  nboutput: 3,
  nLockTime: <Buffer 00 00 00 00> }
------------- End Check - deserialize
------------- Check - verify
----- Transaction hash: 1d78d063a95db4828fa621244d7d5550a6dc85f97b4fbceb2a84c2eeea1f04e0
----- Transaction verified
----- Transaction hash: 1d78d063a95db4828fa621244d7d5550a6dc85f97b4fbceb2a84c2eeea1f04e0
------------- End Check - verify

*/