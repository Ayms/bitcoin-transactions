const crypto=require('crypto');
const bs58=require('bs58');
const decode_b=require('../node_modules/cashaddress/cashaddress.js').decode_b;
const decode_bech32=require('../node_modules/bech32/segwit.js').decode;
const encode_bech32=require('../node_modules/bech32/segwit.js').encode;
const {is_bech,deserialize_scriptSig,check_mOfn}=require('./utils');

const btc_encode=function(buf,version) {
	let checksum;
	if (version) {
		buf=Buffer.concat([version,buf]);
	};
	checksum=crypto.createHash('sha256').update(buf).digest();
	checksum=crypto.createHash('sha256').update(checksum).digest();
	checksum=checksum.slice(0,4);
	return bs58.encode(Buffer.concat([buf,checksum]));
};

const btc_decode=function(bs,version) { //bs string
	let buf=new Buffer(bs58.decode(bs),'hex');
	if (version) {
		buf=buf.slice(version.length);
	};
	return buf.slice(0,buf.length-4);
};

const hash_160=function(buf) {
	buf=crypto.createHash('sha256').update(buf).digest();
	buf=crypto.createHash('ripemd160').update(buf).digest();
	return buf;
};

const rhmac=function(code,data) {
	return crypto.createHmac('sha512',code).update(data).digest();
};

const baddress=function(buf,version) {
	return btc_encode(hash_160(buf),version);
};

const decode_redeem=function(coin,script,boo) {
	let pubKey;
	let tmp;
	let arr=[];
	let prog
	script=new Buffer(script,'hex');
	tmp=script.slice(1);//remove OP_M
	tmp=tmp.slice(0,tmp.length-1);//remove checkmultisig
	tmp=tmp.slice(0,tmp.length-1);//remove OP_N
	pubKey=deserialize_scriptSig(tmp,coin)[1];
	if (!boo) {
		tmp=check_mOfn(script,coin);
		pubKey.forEach(function(key) {
			arr.push('Public Key: '+baddress(key,coin.p2pk)+' equivalent to bitcoin address '+baddress(key,new Buffer('00','hex')));
			console.log('Public Key: '+baddress(key,coin.p2pk)+' equivalent to bitcoin address '+baddress(key,new Buffer('00','hex')));
		});
		console.log('To use the create command and to spend your multisig transaction you must find at least '+tmp[0]+' private keys associated to those public keys');
		console.log('P2SH address '+redeem_addr(coin,script,'p2sh')+' equivalent to bitcoin address '+convert(redeem_addr(coin,script,'p2sh'),coin.p2sh,new Buffer('05','hex'),true));
		console.log('P2WSH (nested) address '+redeem_addr(coin,script,'p2wsh')+' equivalent to bitcoin address '+convert(redeem_addr(coin,script,'p2wsh'),coin.p2sh,new Buffer('05','hex'),true));
		console.log('P2WSH address '+redeem_addr(coin,script,'p2wsh2'));
		pubKey=arr;
	};
	return pubKey;
};

const hash_256=function(buf) {
	return crypto.createHash('sha256').update(buf).digest();
};

const double_hash256=function(buf) {
	buf=crypto.createHash('sha256').update(buf).digest();
	buf=crypto.createHash('sha256').update(buf).digest();
	return buf;
};

const getKeyfromExtended=function(extended) { //extended string
	let buf=btc_decode(extended);
	return {chainCode:buf.slice(13,45),key:buf.slice(46,78)};
};

const check_p2sh=function(pubkey,check,version) {
	let check_=pubkey.slice(2,pubkey.length-1).toString('hex');
	check=hash_160(check).toString('hex');
	if (check===check_) {
		console.log('Redeemer script verified: '+btc_encode(new Buffer(check,'hex'),version));
		return true;
	};
};

const convert=function(key,inversion,outversion,boo) {
	let p2pkh=btc_decode(key,inversion);
	let outaddress=btc_encode(p2pkh,outversion);
	if (!boo) {
		console.log('Address '+key+' converted to '+outaddress);
	};
	return outaddress;
};

const convert_=function(add,coin) {
	/* remove bech32 conversion for full segwit
	if  (add.substr(0,2)==='bc') { //bech32
		var prog=new Buffer(decode_bech32('bc',add).program);
		if (prog) {
			prog=Buffer.concat([new Buffer([coin.SEGWIT_VERSION]),new Buffer([prog.length]),prog]);
			add=btc_encode(hash_160(prog),new Buffer('05','hex'));
		};
	};
	*/
	//convert address if BTC addresses used
	if ((add.substr(0,1)==='1')&&(coin.p2pk[0]!==0)) {
		add=convert(add,new Buffer('00','hex'),coin.p2pk);
	};
	if ((add.substr(0,1)==='3')&&(coin.p2pk[0]!==0)) {
		add=convert(add,new Buffer('05','hex'),coin.p2sh);
	};
	return add;
};

const bech_convert=function(bech,coin) {
	bech=bech.split(':')[1]||bech;
	if (coin.BECH32.indexOf(bech.substr(0,1))!==-1) { //if BCH bech address
		console.log('Bech32 address '+bech);
		bech=decode_b(bech); //{hash:'76a04053bda0a88bda5177b86a15c3b29f559873',type:'p2pkh'}
		bech=btc_encode(new Buffer(bech.hash,'hex'),(bech.type==='p2sh')?coin.p2sh:coin.p2pk);
		console.log('Transformed in '+bech);
	} else {
		bech=convert_(bech,coin);
	};
	return bech;
};

const privatekeyFromWIF=function(address,coin) {
	return btc_decode(address,coin.PRIV).slice(0,32);
};

const format_privKey=function(privs,coin) {
	privs=privs.map(function(privKey) {
		if (!Buffer.isBuffer(privKey)) {
			if (privKey.length===64) {
				privKey=new Buffer(privKey,'hex');
			} else {
				privKey=privatekeyFromWIF(privKey,coin);
			};
		};
		return privKey;
	});
	return privs;
};

const check_addr=function(script,addr,type='p2sh',coin) {
	let check,check_;
	if (type.indexOf('p2wsh')===-1) {
		check=hash_160(script).toString('hex');
	} else {
		check=crypto.createHash('sha256').update(script).digest();
		if (type==='p2wsh') {
			check=hash_160(Buffer.concat([new Buffer([coin.SEGWIT_VERSION]),new Buffer([check.length]),check])).toString('hex');
		} else {
			check_=new Buffer(decode_bech32('bc',addr).program).toString('hex');
			check=check.toString('hex');
		};
	};
	if (!is_bech(addr)) {
		check_=btc_decode(addr,coin.p2sh).toString('hex');
	};
	console.log(check);
	console.log(check_)
	if (check!==check_) {
		throw ("Redeem script does not correspond to the address to be spent "+addr);
	};
};

const redeem_addr=function(coin,script,type='p2sh',version=coin.p2sh) {
	let addr;
	if (type.indexOf('p2wsh')===-1) {
		addr=btc_encode(hash_160(script),version);
	} else {
		addr=crypto.createHash('sha256').update(script).digest();
		if (type==='p2wsh') {
			addr=baddress(Buffer.concat([new Buffer([coin.SEGWIT_VERSION]),new Buffer([addr.length]),addr]),version);
		} else {
			addr=encode_bech32('bc',0,addr);
		};
	};
	return addr;
};

module.exports={btc_encode,btc_decode,hash_160,rhmac,baddress,decode_redeem,hash_256,double_hash256,getKeyfromExtended,check_p2sh,convert,convert_,bech_convert,privatekeyFromWIF,format_privKey,check_addr,decode_bech32,encode_bech32,redeem_addr};
