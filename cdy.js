//This is just an example showing how to multiply the numbers by 1000 to create your transaction from a BCH explorer to claim your coins, we don't own the addresses used in the example

https://blockchair.com/bitcoin-cash/transaction/7b092655e0502549d068782288d340e5b7b35335b16925cd88ac3c2ee9a64864

//multiply prevamount, amount and fees by 1000

node tx.js CDY create prevtx=7b092655e0502549d068782288d340e5b7b35335b16925cd88ac3c2ee9a64864 prevaddr=1KA3qcZk7SLyiD4Lnk4LvALN3zRRPPGC7j prevamount=9856.27021 previndex=0 privkey=<privkey> addr=1GcTA2j3Ni7dDMPG6NvqY8knCkjapeeY1E fees=0.00195

/*
Transaction body:
02000000016448a6e92e3cac88cd2569b13553b3b7e540d388227868d0492550e05526097b000000006a473044022062063f4c15c25aac877ed324b7fffc975afa422b838382333e9c43491eed174902203e2c604ce6bdc35b68de2d1172ec3935b4c31bfdc67dc4c0ac6b5d0fbbeaf47e4121039f1e160a02079a6d6b7be0334cc4d76a125cd13a6f8d7131b11c263bc20bf918ffffffff026818d839000000001976a914ab3e47722956ef320812b91f09ce805f5a75191888ac6160e700000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac00000000
Complete transaction:
e3c3c4d9747800000000000000000000e1000000d114157302000000016448a6e92e3cac88cd2569b13553b3b7e540d388227868d0492550e05526097b000000006a473044022062063f4c15c25aac877ed324b7fffc975afa422b838382333e9c43491eed174902203e2c604ce6bdc35b68de2d1172ec3935b4c31bfdc67dc4c0ac6b5d0fbbeaf47e4121039f1e160a02079a6d6b7be0334cc4d76a125cd13a6f8d7131b11c263bc20bf918ffffffff026818d839000000001976a914ab3e47722956ef320812b91f09ce805f5a75191888ac6160e700000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac00000000
Size 249 bytes
Network Fees: 196 - 0.79 satoshis/byte
Dev Fees: 15163489
------------- Check - deserialize
{ input:
   [ { hash: '7b092655e0502549d068782288d340e5b7b35335b16925cd88ac3c2ee9a64864',
       n: 0,
       scriptSigLen: 106,
       scriptSig: [Object],
       script: [Object],
       nSequence: <Buffer ff ff ff ff> } ],
  output:
   [ { nValue: 970463336,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 ab 3e 47 72 29 56 ef 32 08 12 b9 1f 09 ce 80 5f 5a 75 19 18 88 ac>,
       address: 'CY5Lj557Fm6A7VHgn8Fm7eNopswzjeLYbG',
       type: 'p2pkh' },
     { nValue: 15163489,
       scriptPubkeyLen: <Buffer 19>,
       scriptPubkey: <Buffer 76 a9 14 5b 79 a9 d2 9a 34 f2 f2 84 ec dd 33 00 9f fa 5e 02 52 b6 89 88 ac>,
       address: 'CQoZopLWoFzL6yuqeCMZGGs74a16qHxK5y',
       type: 'p2pkh' } ],
  s: 0,
  nVersion: <Buffer 02 00 00 00>,
  nbinput: 1,
  nboutput: 2,
  nLockTime: <Buffer 00 00 00 00> }
------------- End Check - deserialize
*/

//sending your transaction

node tx.js CDY send e3c3c4d9747800000000000000000000e1000000d114157302000000016448a6e92e3cac88cd2569b13553b3b7e540d388227868d0492550e05526097b000000006a473044022062063f4c15c25aac877ed324b7fffc975afa422b838382333e9c43491eed174902203e2c604ce6bdc35b68de2d1172ec3935b4c31bfdc67dc4c0ac6b5d0fbbeaf47e4121039f1e160a02079a6d6b7be0334cc4d76a125cd13a6f8d7131b11c263bc20bf918ffffffff026818d839000000001976a914ab3e47722956ef320812b91f09ce805f5a75191888ac6160e700000000001976a9145b79a9d29a34f2f284ecdd33009ffa5e0252b68988ac00000000 seed.bitcoincandy.one
