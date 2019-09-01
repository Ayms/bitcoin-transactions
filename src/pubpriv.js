const {btc_encode,btc_decode,baddress,hash_160,privatekeyFromWIF,segwit_nested_p2pk,segwit_bech_p2pk}=require('./addresses.js');
const {getPublicfromRawPrivate}=require('./keys.js');
const encode_b=require('../node_modules/cashaddress/cashaddress.js').encode_b;

const pubs=function(pub,coin) {
	let res=[(pub.length===20?null:pub),(pub.length===20?btc_encode(pub,coin.p2pk):baddress(pub,coin.p2pk)),segwit_nested_p2pk(pub,coin),segwit_bech_p2pk(pub,coin),(pub.length===20?pub:hash_160(pub))];
	if (coin.bch) {
		res.push(encode_b(pub.length===20?pub:hash_160(pub),'p2pkh','bitcoincash'));
	};
	if (res[0]) {
		console.log('Pubkey: '+res[0].toString('hex'));
	};
	console.log('Address: '+res[1]);
	console.log('Segwit nested: '+res[2]);
	console.log('Segwit bech32: '+res[3]);
	console.log('Hash160: '+res[4].toString('hex'));
	if (coin.bch) {
		console.log('BCH bech: '+res[5]);
	};
	res=[res[0]?('Pubkey: '+res[0].toString('hex')):'','Address: '+res[1],'Segwit nested: '+res[2],'Segwit bech32: '+res[3],'Hash160: '+res[4].toString('hex'),res[5]?('BCH bech: '+res[5]):''];
	if (!res[0]) {
		res.unshift();
	};
	return res;
};

const getpubfromprivate=function(coin,priv) { //private 32B hex string or wif string
	let res,pub;
	if (priv.length===64) {
		priv=new Buffer(priv,'hex');
	};
	if (!Buffer.isBuffer(priv)) {
		priv=privatekeyFromWIF(priv,coin);
	};
	pub=getPublicfromRawPrivate(priv);
	res=pubs(pub,coin);
	return res;
};

const getprivfromWIF=function(coin,priv) {
	let res=privatekeyFromWIF(priv,coin);
	console.log('Priv: '+res.toString('hex'));
	return 'Priv: '+res.toString('hex');
};

const privtoWIF=function(coin,priv) {
	let res=btc_encode(Buffer.concat([new Buffer(priv,'hex'),new Buffer('01','hex')]),coin.PRIV);
	console.log('WIF Priv: '+res);
	return res;
};

/*
const pubtohash=function(coin,address) {
	let res=btc_decode(address,coin.p2pk);
	console.log('Hash160: '+res.toString('hex'));
	return res;
};
*/

const pubtoaddress=function(coin,pub) {
	if (pub.length===66) {
		pub=new Buffer(pub,'hex');
	} else {
		pub=btc_decode(pub,coin.p2pk);
	};
	return pubs(pub,coin);
};

module.exports={getpubfromprivate,getprivfromWIF,privtoWIF,pubtoaddress};