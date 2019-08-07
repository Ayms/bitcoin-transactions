const {btc_encode,btc_decode,hash_160,rhmac,baddress}=require('./addresses.js');
const {privateKeyderive,FormatPrivate,PRFx,getPublicfromRawPrivate,ecdh_priv,getAddressfromPrivate2}=require('./keys.js');
const {reverse}=require('./utils.js');
const crypto=require('crypto');
const CRLF='\r\n';

if (window===undefined) {
	var window=false;
};

const display=function(hd,coin,type,bool) {
	let seed='';
	let version=coin.p2pk;
	if (bool) {
		seed='master seed ';
	};
	console.log('------------------------------------ '+(seed?(seed+' '+hd.seed.toString('hex')):('depth '+hd.depth+' index hardened '+(hd.index-coin.HARDENED_OFFSET))));
	console.log(seed+'chain code: '+hd.chainCode.toString('hex'));
	console.log(seed+'private key: '+hd.privateKey.toString('hex'));
	//console.log(seed+'public key: '+hd.publicKeyl.toString('hex'));
	console.log(seed+'public key (compact): '+hd.publicKey.toString('hex'));
	console.log(seed+'Extended private key: '+btc_encode(serialize(hd,'private',coin,type),version));
	console.log(seed+'Extended public key: '+btc_encode(serialize(hd,'public',coin,type),version));
	console.log(seed+'address: '+hd.address);
};

const display_z=function(hd) {
	console.log('------------------------------------ '+('depth '+hd.depth+' index hardened '+(hd.index-coin.HARDENED_OFFSET)));
	console.log('spending key: '+hd.ask.toString('hex'));
	console.log('viewing key: '+hd.sk_enc.toString('hex'));
	console.log('paying key: '+hd.apk.toString('hex'));
	console.log('transmission key: '+hd.pk_enc.toString('hex'));
	console.log('spending key address: '+hd.ask_a);
	console.log('z-address: '+hd.z_address);
};

const display_w=function(res,coin,type,boo) {
	//res: time,xprv,seed,hd,[path,index,not_hardened],priv
	//zcash
	//[ask,zaddr];
	let time=res[0];
	let l=res.length;
	let tmp=res[4];
	if (boo) {
		console.log('# extended private masterkey: '+res[1]);
	};
	if (res[2]) {
			console.log(btc_encode(res[2],coin.PRIV)+' '+time+' hdseed=1 '+' # addr='+getAddressfromPrivate2(res[2],coin,type)+' hdkeypath=m');
	};
	path=tmp[0];
	s_=tmp[1];
	not_hardened=tmp[2];
	nb=tmp[3];
	for (let i=0;i<nb;i++) {
		priv=res[i+5];
		console.log(btc_encode(priv,coin.PRIV)+' '+time+' '+(i?'reserve=1':'label=')+' # addr='+getAddressfromPrivate2(priv,coin,type)+" hdkeypath="+path+'/'+(i+s_)+(not_hardened?"":"'"));
	};
	if (res.length>(nb+5)) { //zcash
		console.log(CRLF+'# Zkeys'+CRLF);
		nb+=6;
		for (let i=nb;i<l;i++) {
			console.log('# '+res[i][0]+' '+time+' # zaddr='+res[i][1]+" hdkeypath="+path+'/'+(i+s_-nb)+(not_hardened?"":"'"));
		};
	};
};

const serialize=function(hd,version,coin,type='btc') {
	//version(4) depth(1) fingerprint(4) index(4) chain(32) key(33) - 78 bytes
	let buffer=new Buffer(13);
	let key;
	let version_=coin.BITCOIN_VERSIONS;
	switch (type) {
		case 'nested': version_=coin.BITCOIN_VERSIONS_NESTED;break;
		case 'bech': version_=coin.BITCOIN_VERSIONS_BECH;break;
	};
	if (version==='private') {
		version=version_.private;
		key=Buffer.concat([new Buffer([0]),hd.privateKey]);
	} else {
		version=version_.public;
		key=hd.publicKey;
	};
	buffer.writeUInt32BE(version,0);
	buffer.writeUInt8(hd.depth,4);
	let fingerprint = hd.depth?hd.parentFingerprint:0x00000000;
	buffer.writeUInt32BE(fingerprint,5);
	buffer.writeUInt32BE(hd.index,9);
	buffer=Buffer.concat([buffer,hd.chainCode]);
	buffer=Buffer.concat([buffer,key]);
	return buffer;
};

const deriveChild=function(index,coin,not_hard,type='btc') {
	let hd={};
	let isHardened=!not_hard;
	let indexBuffer=new Buffer(4);
	let version=coin.p2pk;
	indexBuffer.writeUInt32BE((isHardened?(index+coin.HARDENED_OFFSET):index),0);
	let data;
	if (isHardened) {
		// 0x00 priv (32B)  index (4B);
		data=Buffer.concat([new Buffer([0]),this.privateKey,indexBuffer]);
	} else {
		if (!this.publicKey) {
			this.publicKey=getPublicfromRawPrivate(this.privateKey);
		};
		data=Buffer.concat([this.publicKey,indexBuffer]);
	};
	let I=rhmac(this.chainCode,data);;
	let IL=I.slice(0,32);
	let IR=I.slice(32);
	if (this.privateKey) {
		//try {
			hd.privateKey=privateKeyderive(this.privateKey,IL);
			hd.publicKey=getPublicfromRawPrivate(hd.privateKey);
			//hd.publicKeyl=new Buffer(ec.keyFromPrivate(hd.privateKey).getPublic('arr'),'hex');
			hd.address=baddress(hd.publicKey,(version||this.version)); //default is compressed keys
		//} catch (err) {
		//	return;
		//};
	} else {
		try {
			hd.publicKey=publicKeyderive(this.publicKey,IL);
		} catch (err) {
			return;
		};
	};
	hd.fingerprint=hash_160(hd.publicKey).slice(0,4).readUInt32BE(0);
	hd.chainCode=IR;
	hd.depth=this.depth+1;
	hd.parentFingerprint=this.fingerprint;
	hd.index=index+coin.HARDENED_OFFSET;
	hd.version=version||this.version;
	//hd.deriveChild=()=>{deriveChild};
	hd.deriveChild=deriveChild.bind(hd);
	//display(hd,version,type); //uncomment to display the details
	return hd;
};

const generate_keys_bip32=function(buf,coin,type='btc') {
	let pub,compact,priv,hmac;
	let hd={};
	let version=coin.p2pk;
	hmac=rhmac(coin.MASTER_SECRET,buf);
	hd.seed=buf;
	hd.privateKey=hmac.slice(0,32);
	hd.chainCode=hmac.slice(32);
	//hd.publicKeyl=new Buffer(ec.keyFromPrivate(hd.privateKey).getPublic('arr'),'hex'); //long 65 bytes
	hd.publicKey=getPublicfromRawPrivate(hd.privateKey); //compact 33 bytes
	baddress(hd.publicKey,(version))
	hd.address=baddress(hd.publicKey,(version)); //default is supposed to be compressed keys
	hd.fingerprint=hash_160(hd.publicKey).slice(0,4).readUInt32BE(0);
	hd.version=version;
	hd.index=0;
	hd.depth=0;
	//display(hd,version,type,true); //uncomment to display the details
	//hd.deriveChild=()=>{deriveChild};
	hd.deriveChild=deriveChild.bind(hd);
	return hd;
};

const decode_xprv=function(xprv,version) {
	//version(4) depth(1) fingerprint(4) index(4) chain(32) key(33) - 78 bytes
	let hd={};
	xprv=btc_decode(xprv);//buf
	//console.log(xprv.toString('hex'));
	hd.privateKey=xprv.slice(46); //32B remove first B
	hd.chainCode=xprv.slice(13,45);//32B
	hd.version=version;
	hd.index=0;
	hd.depth=0;
	hd.deriveChild=deriveChild.bind(hd);
	//console.log(hd.privateKey.toString('hex'));
	//console.log(hd.chainCode.toString('hex'));
	return hd;
};

const encode_xprv=function(coin,seed,master,type='btc') { //master true for BIP39
	let hd={};
	if (master) {
		seed=crypto.createHmac('sha512',coin.MASTER_SECRET).update(seed).digest();
		hd.privateKey=seed.slice(0,32);
		hd.chainCode=seed.slice(32);
	} else {
		hd.privateKey=seed.slice(0,32);
		hd.chainCode=seed.slice(32);
	};
	hd.depth=0;
	hd.index=0;
	//console.log(serialize(hd,'private').toString('hex'));
	return btc_encode(serialize(hd,'private',coin,type));
};

const create_wallet=function(secret,coin,nb=coin.DEFAULT_WALLET_NB,type='btc',path=coin.LEGACY_PATH||coin.DEFAULT_PATH) {
//secret: buffer, string(hex), string xprv or hd
//warning: zcash implementation is a personnal one dated before zcash implemented bip32, we will not implement the official one since the zcash team did not deem necessary to mention this implementation, neither to mention us as previous work, the super_magic number refers to a suggestion from a team member as a kind of joke
	let time=new Date().toISOString();
	let tmp,txt,priv,seed,hd,s_,p,boo;
	let res=[];
	let version=coin.p2pk;
	boo=(secret.privateKey!==undefined);
	if (type.indexOf('m/')!==-1) {
		path=type;
		type='btc';
	};
	res.push(time);
	if (!boo) {
		if (!Buffer.isBuffer(secret)) {
			if (secret.indexOf('prv')===-1) {
				secret=new Buffer(secret,'hex');
			};
		};
		if (Buffer.isBuffer(secret)) {
			hd=generate_keys_bip32(secret,coin,type);
		} else {
			hd=decode_xprv(secret,version);
		};
	} else {
		hd=secret;
	};
	res.push(btc_encode(serialize(hd,'private',coin,type))); //xprv
	seed=(boo||(!Buffer.isBuffer(secret)))?null:(Buffer.concat([secret,new Buffer('01','hex')])); //assume all versions are using compressed keys
	res.push(seed);
	path=path.split('/');
	path.shift();//remove m
	p=path.length;
	for (let  i=0;i<p;i++) {
		s_=path[i].split("'");
		if (s_.length!==2) {
			not_hardened=true;
		} else {
			not_hardened=false;
		};
		s_=parseInt(s_[0]);
		if ((!boo)&&(i!==p-1)) {
			hd=hd.deriveChild(s_,coin,not_hardened,type);
		};
	};
	res.push(hd);
	path.pop();//remove last
	res.push(['m/'+path.join('/'),s_,not_hardened,nb]);
	for (let i=0;i<nb;i++) {
		tmp=hd.deriveChild(i+s_,coin,not_hardened,type);
		priv=Buffer.concat([tmp.privateKey,new Buffer('01','hex')]); //assume all versions are using compressed keys
		res.push(priv);
	};
	if (coin.VERSION_==='ZEC') {
		res.push('Zkeys');
		for (let i=0;i<nb;i++) {
			tmp=hd.deriveChild(i+s_,coin,not_hardened,type);
			tmp.ask=reverse(FormatPrivate(PRFx(tmp.privateKey,1)));
			tmp.ask=new Buffer(ecdh_priv(tmp.ask).getPrivate('hex'),'hex');//spending key
			priv=new Buffer(tmp.ask.length);
			tmp.ask.copy(priv);
			tmp.apk=reverse(PRFx(priv,0)); //paying key
			tmp.sk_enc=reverse(FormatPrivate(PRFx(priv,1)));//viewing key
			tmp.pk_enc=ecdh_priv(tmp.sk_enc);
			tmp.pk_enc=new Buffer(tmp.pk_enc.getPublic(true,'arr'),'hex');//transmission key
			tmp.z=reverse(Buffer.concat([tmp.pk_enc,tmp.apk]));
			tmp.ask_a=btc_encode(tmp.ask,coin.zcash_spending_key);
			tmp.z_address=btc_encode(tmp.z,coin.zcash_z);
			//display_z(tmp);//uncomment to display details
			res.push([tmp.ask_a,tmp.z_address]);
		};
	};
	if (!window) {
		//res: time,xprv,seed,hd,[path,index,not_hardened],priv
		//zcash
		//[ask,zaddr];
		display_w(res,coin,type,!boo);
	};
	return res;
};

module.exports={create_wallet,decode_xprv,encode_xprv};