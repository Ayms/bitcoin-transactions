https://btgexp.com/tx/118d6160c8ae2465835ad41908a154cd9be6c78ca4012f79edbf65ca96407f97

node tx.js BTG create prevtx=2a38e1dee239985c427db146f364cac7cfdfcc845fdfe2051f070284b3284587 prevaddr=GSjwHAAYmFfQ4WPArc2ErtjQGr3Q2nkjvo prevamount=0.00993305 previndex=33 privkey=privkey addr=GKz5ii8tWQG9hd196vNkwkLKsWHqaeKSoB amount=0.00973305

/*
Version BTG
Creating transaction to send 0.00973305 (without fees) to GKz5ii8tWQG9hd196vNkwkLKsWHqaeKSoB from output number 33 with amount 0.00993305 owned by GSjwHAAYmFfQ4WPArc2ErtjQGr3Q2nkjvo in transaction 2a38e1dee239985c427db146f364cac7cfdfcc845fdfe2051f070284b3284587
----- Serialize for hash
Address corresponding to private key is GSjwHAAYmFfQ4WPArc2ErtjQGr3Q2nkjvo

----- Transaction hash: 118d6160c8ae2465835ad41908a154cd9be6c78ca4012f79edbf65ca96407f97
Transaction body:
0200000001874528b38402071f05e2df5f84ccdfcfc7ca64f346b17d425c9839e2dee1382a210000006a473044022041c150bdbc22245efb3d4bef0ecaa9a0e1b8bb86ce5d0b7436da0a6529bf3cd502204dbd45864711b914e99baeb0c6c5a42ba37ad195679ffc63d32350a6e22a506a4121039f1e160a02079a6d6b7be0334cc4d76a125cd13a6f8d7131b11c263bc20bf918ffffffff02f9d90e00000000001976a914177b585b5401ad21b60b78b1b3c91996f250296d88ac05260000000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac00000000
Complete transaction:
e1476d44747800000000000000000000e1000000977f40960200000001874528b38402071f05e2df5f84ccdfcfc7ca64f346b17d425c9839e2dee1382a210000006a473044022041c150bdbc22245efb3d4bef0ecaa9a0e1b8bb86ce5d0b7436da0a6529bf3cd502204dbd45864711b914e99baeb0c6c5a42ba37ad195679ffc63d32350a6e22a506a4121039f1e160a02079a6d6b7be0334cc4d76a125cd13a6f8d7131b11c263bc20bf918ffffffff02f9d90e00000000001976a914177b585b5401ad21b60b78b1b3c91996f250296d88ac05260000000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac00000000
Size 249 bytes
Network Fees: 10267 - 41.23 satoshis/byte
Dev Fees: 9733

------------- Check - deserialize
{ input:
   [ { hash: '2a38e1dee239985c427db146f364cac7cfdfcc845fdfe2051f070284b3284587',
       n: 33,
       scriptSigLen: <Buffer 6a>,
       scriptSig: [Object],
       data: null,
       nSequence: <Buffer ff ff ff ff> } ],
  output:
   [ { nValue: 973305,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 17 7b 58 5b 54 01 ad 21 b6 0b 78 b1 b3 c9 19 96 f2 50 29 6d 88 ac>,
       address: 'GKz5ii8tWQG9hd196vNkwkLKsWHqaeKSoB',
       type: 'p2pkh' },
     { nValue: 9733,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       address: 'GSBbeuKPu4d6HKJhtPgk7XayMcaXyQy8TS',
       type: 'p2pkh' } ],
  nVersion: <Buffer 02 00 00 00>,
  nbinput: 1,
  nboutput: 2,
  nLockTime: <Buffer 00 00 00 00> }
------------- End Check - deserialize
------------- Check - verify
----- Transaction hash: 118d6160c8ae2465835ad41908a154cd9be6c78ca4012f79edbf65ca96407f97
signature: 3044022041c150bdbc22245efb3d4bef0ecaa9a0e1b8bb86ce5d0b7436da0a6529bf3cd502204dbd45864711b914e99baeb0c6c5a42ba37ad195679ffc63d32350a6e22a506a
----- Serialize for hash
02000000
----- Transaction verified
----- Transaction hash: 118d6160c8ae2465835ad41908a154cd9be6c78ca4012f79edbf65ca96407f97
------------- End Check - verify
*/

//If you don't get 'Transaction verified' then something went wrong

//Check now using the body of the transaction

node tx.js BTG decode 0200000001874528b38402071f05e2df5f84ccdfcfc7ca64f346b17d425c9839e2dee1382a210000006a473044022041c150bdbc22245efb3d4bef0ecaa9a0e1b8bb86ce5d0b7436da0a6529bf3cd502204dbd45864711b914e99baeb0c6c5a42ba37ad195679ffc63d32350a6e22a506a4121039f1e160a02079a6d6b7be0334cc4d76a125cd13a6f8d7131b11c263bc20bf918ffffffff02f9d90e00000000001976a914177b585b5401ad21b60b78b1b3c91996f250296d88ac05260000000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac00000000

/*

Version BTG
{ input:
   [ { hash: '2a38e1dee239985c427db146f364cac7cfdfcc845fdfe2051f070284b3284587',
       n: 33,
       scriptSigLen: <Buffer 6a>,
       scriptSig: [Object],
       data: null,
       nSequence: <Buffer ff ff ff ff> } ],
  output:
   [ { nValue: 973305,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 17 7b 58 5b 54 01 ad 21 b6 0b 78 b1 b3 c9 19 96 f2 50 29 6d 88 ac>,
       address: 'GKz5ii8tWQG9hd196vNkwkLKsWHqaeKSoB',
       type: 'p2pkh' },
     { nValue: 9733,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       address: 'GSBbeuKPu4d6HKJhtPgk7XayMcaXyQy8TS',
       type: 'p2pkh' } ],
  nVersion: <Buffer 02 00 00 00>,
  nbinput: 1,
  nboutput: 2,
  nLockTime: <Buffer 00 00 00 00> }
  
*/

// Double check using bitcoin-cli if you want

bgold-cli decoderawtransaction 0200000001874528b38402071f05e2df5f84ccdfcfc7ca64f346b17d425c9839e2dee1382a210000006a473044022041c150bdbc22245efb3d4bef0ecaa9a0e1b8bb86ce5d0b7436da0a6529bf3cd502204dbd45864711b914e99baeb0c6c5a42ba37ad195679ffc63d32350a6e22a506a4121039f1e160a02079a6d6b7be0334cc4d76a125cd13a6f8d7131b11c263bc20bf918ffffffff02f9d90e00000000001976a914177b585b5401ad21b60b78b1b3c91996f250296d88ac05260000000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac00000000

/*
{
  "txid": "118d6160c8ae2465835ad41908a154cd9be6c78ca4012f79edbf65ca96407f97",
  "hash": "118d6160c8ae2465835ad41908a154cd9be6c78ca4012f79edbf65ca96407f97",
  "version": 2,
  "size": 225,
  "vsize": 225,
  "locktime": 0,
  "vin": [
    {
      "txid": "2a38e1dee239985c427db146f364cac7cfdfcc845fdfe2051f070284b3284587",
      "vout": 33,
      "scriptSig": {
        "asm": "3044022041c150bdbc22245efb3d4bef0ecaa9a0e1b8bb86ce5d0b7436da0a6529bf3cd502204dbd45864711b914e99baeb0c6c5a42ba37ad195679ffc63d32350a6e22a506a[ALL|FORKID] 039f1e160a02079a6d6b7be0334cc4d76a125cd13a6f8d7131b11c263bc20bf918",
        "hex": "473044022041c150bdbc22245efb3d4bef0ecaa9a0e1b8bb86ce5d0b7436da0a6529bf3cd502204dbd45864711b914e99baeb0c6c5a42ba37ad195679ffc63d32350a6e22a506a4121039f1e160a02079a6d6b7be0334cc4d76a125cd13a6f8d7131b11c263bc20bf918"
      },
      "sequence": 4294967295
    }
  ],
  "vout": [
    {
      "value": 0.00973305,
      "n": 0,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 177b585b5401ad21b60b78b1b3c91996f250296d OP_EQUALVERIFY OP_CHECKSIG",
        "hex": "76a914177b585b5401ad21b60b78b1b3c91996f250296d88ac",
        "reqSigs": 1,
        "type": "pubkeyhash",
        "addresses": [
          "GKz5ii8tWQG9hd196vNkwkLKsWHqaeKSoB"
        ]
      }
    },
    {
      "value": 0.00009733,
      "n": 1,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 5b79a9d29a34f2f284ecdd33009ffa5e0252b689 OP_EQUALVERIFY OP_CHECKSIG",
        "hex": "76a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac",
        "reqSigs": 1,
        "type": "pubkeyhash",
        "addresses": [
          "GSBbeuKPu4d6HKJhtPgk7XayMcaXyQy8TS"
        ]
      }
    }
  ]
}
*/

//If all is correct send the transaction using the complete transaction

node tx.js BTG send e1476d44747800000000000000000000e1000000977f40960200000001874528b38402071f05e2df5f84ccdfcfc7ca64f346b17d425c9839e2dee1382a210000006a473044022041c150bdbc22245efb3d4bef0ecaa9a0e1b8bb86ce5d0b7436da0a6529bf3cd502204dbd45864711b914e99baeb0c6c5a42ba37ad195679ffc63d32350a6e22a506a4121039f1e160a02079a6d6b7be0334cc4d76a125cd13a6f8d7131b11c263bc20bf918ffffffff02f9d90e00000000001976a914177b585b5401ad21b60b78b1b3c91996f250296d88ac05260000000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac00000000