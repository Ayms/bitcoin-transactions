const elliptic=require('elliptic');
const EC=elliptic.ec;
const ec=new EC('secp256k1');
const ecdh=new EC('curve25519');
const SHA256Compress=require('../node_modules/sha256-c/SHA256Compress.js');
const {baddress,double_hash256,privatekeyFromWIF,segwit_nested_p2pk,segwit_bech_p2pk,encode_bech32,hash_160,btc_encode}=require('./addresses.js');
const BN=require('../node_modules/elliptic/node_modules/bn.js'); //BN loaded twice see https://github.com/indutny/bn.js/issues/227
const {varlen}=require('./utils.js');
const encode_b=require('../node_modules/cashaddress/cashaddress.js').encode_b;
const ecparams=ec.curve;

const privateKeyderive=function(privateKey,IL) {
	let bn=new BN(IL);
	let n=ecparams.n;
	if (bn.cmp(n)>=0) {
		throw new Error();
	};
	bn.iadd(new BN(privateKey));
	if (bn.cmp(n)>=0) {
		bn.isub(n);
	};
	if (bn.isZero()) {
		throw new Error();
	};
	return bn.toArrayLike(Buffer,'be',32);
};

const publicKeyderive=function() {};

const FormatPrivate=function(buf) {
	buf[0] &=0xf8;
	buf[31] &=0x7f;
	buf[31] |=0x40;
	return buf;
};

const PRFx=function(x,t) {
	let buf=new Buffer('00000000000000000000000000000000000000000000000000000000000000','hex');
	x[0]|=0xc0; //1100
	buf=Buffer.concat([x,new Buffer([t]),buf]);
	return SHA256Compress(buf);
};

const getPublicfromRawPrivate=function(priv) {
	return new Buffer(ec.keyFromPrivate(priv).getPublic(true,'arr'),'hex');
};

const ecdh_priv=function(buf) {
	return ecdh.keyFromPrivate(buf);
};

const getAddressfromPrivate=function(privateKey,version) { //privateKey buffer
	if (privateKey.length>32) {
		privateKey=privateKey.slice(0,32); //remove 01 indicating the use of compressed public keys
	};
	return baddress(getPublicfromRawPrivate(privateKey),version);
};

const getAddressfromPrivate2=function(privateKey,coin,type='btc') { //privateKey buffer
	let version,pub;
	if (privateKey.length>32) {
		privateKey=privateKey.slice(0,32); //remove 01 indicating the use of compressed public keys
	};
	version=coin.p2pk;
	pub=getPublicfromRawPrivate(privateKey);
	switch (type) {
		case 'nested':return segwit_nested_p2pk(pub,coin);break;
		case 'bech':return segwit_bech_p2pk(pub,coin);break;
	};
	return baddress(pub,version);
};

const getPublicfromPrivate=function(priv,coin) {
	priv=privatekeyFromWIF(priv,coin);
	return getPublicfromRawPrivate(priv).toString('hex');
};

const getpubKeyfromPrivate=function(privateKey) {
	if (privateKey.length>32) {
		privateKey=privateKey.slice(0,32); //remove 01 indicating the use of compressed public keys
	};
	return getPublicfromRawPrivate(privateKey);
};

const format_pubKey=function(privs) {
	let pubs=privs.map(function(priv) {
		return getpubKeyfromPrivate(priv);
	});
	return pubs;
};

const getpubkeyfromSignature=function(message,signature) {
	let boo=[];
	message=double_hash256(message);
	for (let k=0;k<4;k++) {
		try {
			let pub=ec.recoverPubKey(message,signature,k);
			let key=ec.keyFromPublic(pub,'hex');
			pub=new Buffer(key.getPublic(true,'arr'),'hex'); //get compact format 02+x or 03+x
			console.log(pub);
			console.log('Public key of signature can be '+hash_160(pub).toString('hex'));
			//useless but...
			if (key.verify(message,signature)) {
				boo.push(pub);
			};
		} catch(ee) {};
	};
	return boo;
};

const recoverPubKey=function(message,signature,k) {
	return ec.recoverPubKey(message,signature,k);
};

const keyFromPublic=function(pub) {
	return ec.keyFromPublic(pub,'hex');
};

const sign=function(scriptSig,privKey) {
	scriptSig=double_hash256(scriptSig);
	console.log('Signing '+scriptSig.toString('hex'));
	let sign=ec.sign(scriptSig,privKey,'hex',{canonical:true});
	return sign.toDER();
};

const formatmessage=function(prefix,message) { //prefix message strings - TODO put as global var
	prefix=new Buffer(prefix,'utf8');
	message=Buffer.concat([varlen(prefix.length),prefix,varlen(message.length),new Buffer(message,'utf8')]);
	return double_hash256(message);
};

const signmessage=function(coin,message,privKey,type="n") {
	let header,sign;
	message=formatmessage(coin.prefix,message);
	//console.log('Signing '+message.toString('hex'));
	privKey=privatekeyFromWIF(privKey,coin);
	sign=ec.sign(message,privKey,'hex',{canonical:true}); 
	//https://bitcoin.stackexchange.com/questions/12554/why-the-signature-is-always-65-13232-bytes-long
	//Not sure what is the "custom encoding"
	//Let's assume that sign used here always return 32B big endian r and s here
	switch (type) {
		case "n": header=new Buffer([31]);break; //compressed key
		case "s": header=new Buffer([35]);break; //segwit
		case "b": header=new Buffer([39]);break; //bech32
	};
	sign=Buffer.concat([header,sign.r.toArrayLike(Buffer),sign.s.toArrayLike(Buffer)]).toString('base64');
	console.log('Signature : '+sign);
	return sign;
};

const verifymessage=function(coin,message,signature,address) {
	let header;
	let res=[false];
	signature=new Buffer(signature,'base64');
	header=signature[0];
	signature=signature.slice(1);
	signature={r:signature.slice(0,32).toString('hex'),s:signature.slice(32).toString('hex')}; 
	message=formatmessage(coin.prefix,message);
	for (let k=0;k<4;k++) {
		try {
			let pub=ec.recoverPubKey(message,signature,k);
			let key=ec.keyFromPublic(pub,'hex');
			pub=new Buffer(key.getPublic(true,'arr'),'hex'); //get compact format 02+x or 03+x
			let check=hash_160(pub);
			if ((address===btc_encode(check,coin.p2pk))||(address===btc_encode(hash_160(Buffer.concat([new Buffer([coin.SEGWIT_VERSION]),new Buffer([check.length]),check])),coin.p2sh))||(address===encode_bech32('bc',coin.SEGWIT_VERSION,check))||(address===encode_b(check,'p2pkh','bitcoincash').split(':')[1])) {
				res=[true,pub];
			};
		} catch(ee) {};
	};
	console.log(res[0]?('Signature verified - Public key '+res[1].toString('hex')):'Wrong signature');
	res=[res[0]?('Signature verified - Public key '+res[1].toString('hex')):'Wrong signature'];
	return res;
};

module.exports={privateKeyderive,FormatPrivate,PRFx,getPublicfromRawPrivate,ecdh_priv,getAddressfromPrivate,getAddressfromPrivate2,getPublicfromPrivate,getpubKeyfromPrivate,format_pubKey,getpubkeyfromSignature,recoverPubKey,keyFromPublic,sign,signmessage,verifymessage};