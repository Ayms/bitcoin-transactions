const EC=require('elliptic').ec;
const ec=new EC('secp256k1');
const ecdh=new EC('curve25519');
const SHA256Compress=require('../node_modules/sha256-c/SHA256Compress.js');
const {baddress,double_hash256,privatekeyFromWIF}=require('./addresses.js');
const BN=require('../node_modules/elliptic/node_modules/bn.js');
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
	return bn.toBuffer('be',32);
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

module.exports={privateKeyderive,FormatPrivate,PRFx,getPublicfromRawPrivate,ecdh_priv,getAddressfromPrivate,getPublicfromPrivate,getpubKeyfromPrivate,format_pubKey,getpubkeyfromSignature,recoverPubKey,keyFromPublic,sign};