var crypto=require('crypto');
var bs58=require('bs58');
var BN=require('./node_modules/elliptic/node_modules/bn.js');
var EC=require('elliptic').ec;
var ec=new EC('secp256k1');
var fs=require('fs');
var https=require('https');
var net=require('net');
var ecparams=ec.curve;
var oconsole=console.log.bind(console);
var SIGFORK;
var SIGHASH_ALL;
var SIGHASH_NONE;
var SIGHASH_SINGLE;
var SIGHASH_ANYONECANPAY;
var T_O=2000;
var TX_COMMAND=new Buffer('747800000000000000000000','hex');
var TX_VERSION=new Buffer('76657273696F6E0000000000','hex');
var TX_VERACK=new Buffer('76657261636B000000000000','hex');
var SIG_F=0x4830;
var ISSIG1='304502';
var ISSIG2='304402';
var OP_PUSHDATA1=0x4c;
var OP_PUSHDATA2=0x4d;
var OP_PUSH=512;
var MAX_OP_PUSH=520;
var OP_DUP='76';
var OP_HASH160='a9';
var OP_RETURN='6a';
var OP_0='00';
var OP_1='01';
var OP_2='52';
var OP_3='53';
var OP_DROP='75';
var OP_DEPTH='74';
var OP_EQUAL='87';
var OP_EQUALVERIFY='88';
var OP_CHECKSIG='ac';
var OP_CHECKSIGVERIFY='ad';
var OP_CHECK_MULTISIG='ae';
var OP_CODESEPARATORS='ab';
var OP_FORK='b689';
var P2SH_NON_STANDARD=new Buffer(OP_0+OP_DROP+OP_DEPTH+OP_0+OP_EQUAL,'hex');
var FEES=250;
var SATO=100000000; //1 BTC = 100000000 satoshis
var SATO_=8500;
var MIN_SATO_=300;
var S_=128;
//BTC default
var VERSION=1;
var VERSION_='BTC';
var SIGHASH_FORKID=0x00000000;
var SIGHASH_1=new Buffer('5b79a9d29a34f2f284','hex');
var SIGHASH_2=new Buffer('ecdd33009ffa5e0252','hex');
var FORKID_IN_USE;
var MAIN=0xD9B4BEF9;
var BIP143=false;
var p2pk=new Buffer('00','hex');
var p2sh=new Buffer('05','hex');
var PORT=8333;
var LASTBLOCK=500000;
var PROTOCOL=70015;
var NOSEGWIT=['1','G','C'];
var NOSEGWIT2=['t1'];
var twoOFtwo='2of2';
var twoOFthree='2of3';

var version_=function(v) {
	if (v==='BTC') {
		//Bitcoin default values
	} else if (v==='ZEC') {
		VERSION=1;
		SIGHASH_FORKID=0x00000000;
		MAIN=0x6427E924;
		VERSION_='ZEC';
		p2pk=new Buffer('1cb8','hex');
		p2sh=new Buffer('1cbd','hex');
		BIP143=false;
		PORT=8233;
		LASTBLOCK=223500;
		PROTOCOL=170002;
	} else if (v==='BTG') {
		VERSION=2;
		SIGHASH_FORKID=0x00000040;
		FORKID_IN_USE=79;
		MAIN=0x446D47E1;
		VERSION_='BTG';
		p2pk=new Buffer('26','hex');
		p2sh=new Buffer('17','hex');
		BIP143=true;
		PORT=8338;
		LASTBLOCK=500000;
		PROTOCOL=70016;
	} else if (v==='BCH') {
		VERSION=1; //TODO
		SIGHASH_FORKID=0x00000040;
		FORKID_IN_USE=0;
		MAIN=0xE8F3E1E3;
		VERSION_='BCH';
		//https://github.com/Bitcoin-ABC/bitcoin-abc/pull/74
		//p2pk=new Buffer('1c','hex');
		//p2sh=new Buffer('28','hex');
		BIP143=true;
		PORT=8333;
		LASTBLOCK=500000;
		PROTOCOL=70015;
	} else {
		throw "You forgot to mention the network version";
	};
	SIGHASH_ALL=0x00000001|SIGHASH_FORKID;
	SIGHASH_NONE=0x00000002|SIGHASH_FORKID;
	SIGHASH_SINGLE=0x00000003|SIGHASH_FORKID;
	SIGHASH_ANYONECANPAY=0x00000080|SIGHASH_FORKID;
	SIGFORK=Buffer.concat([SIGHASH_1,SIGHASH_2]);
};

var double_hash256=function(buf) {
	buf=crypto.createHash('sha256').update(buf).digest();
	buf=crypto.createHash('sha256').update(buf).digest();
	return buf;
};

var hash_160=function(buf) {
	buf=crypto.createHash('sha256').update(buf).digest();
	buf=crypto.createHash('ripemd160').update(buf).digest();
	return buf;
};

var check_p2sh=function(pubkey,check,version) {
	var check_=pubkey.slice(2,pubkey.length-1).toString('hex');
	check=hash_160(check).toString('hex');
	if (check===check_) {
		console.log('Redeemer script verified: '+btc_encode(new Buffer(check,'hex'),version));
		return true;
	};
};

var check_p2sh_script=function(dat,message,signature) {
	var check=true;
	var decode=true;
	var data=[];
	var pub;
	dat.forEach(function(data) {
		data.unshift(parse_op_push(data)[0]);
	});
	var script=data.shift();
	var hash;
	while (script[0]===OP_HASH_160) {
		hash=script.slice(1,21);
		if (script[22]===OP_EQUALVERIFY) {
			if (hash===hash_160(data.shift())) {
				check=false;
				break;
			};
		script=script.slice(22);
		} else {
			decode=false;
			break;
		};
	};
	if (decode===true) {
		pub=script.slice(1,script[0]+1);
		if (script[22]===OP_CHECKSIGVERIFY) {
			var key=ec.keyFromPublic(pub,'hex');
			pub=new Buffer(key.getPublic(true,'arr'),'hex');
			if (!key.verify(message,signature)) {
				check=false;
			};
		} else {
			decode=false;
		};
	};
	if (!decode) {
		return "unable to decode script"
	} else {
		return check;
	};
};

var btc_encode=function(buf,version) {
	var checksum;
	if (version) {
		buf=Buffer.concat([version,buf]);
	};
	checksum=crypto.createHash('sha256').update(buf).digest();
	checksum=crypto.createHash('sha256').update(checksum).digest();
	checksum=checksum.slice(0,4);
	return bs58.encode(Buffer.concat([buf,checksum]));
};

var btc_decode=function(bs,version) {
	var buf=new Buffer(bs58.decode(bs),'hex');
	if (version) {
		buf=buf.slice(version.length);
	};
	return buf.slice(0,buf.length-4);
};

var privatekeyFromWIF=function(address) {
	return btc_decode(address,new Buffer('80','hex')).slice(0,32);
};

var format_privKey=function(privs) {
	privs=privs.map(function(privKey) {
		if (!Buffer.isBuffer(privKey)) {
			if (privKey.length===64) {
				privKey=new Buffer(privKey,'hex');
			} else {
				privKey=privatekeyFromWIF(privKey);
			};
		};
		return privKey;
	});
	return privs;
};

var format_pubKey=function(privs) {
	var pubs=privs.map(function(priv) {
		return getpubKeyfromPrivate(priv);
	});
	return pubs;
};

var getAddressfromPrivate=function(privateKey,version) {
	if (privateKey.length>32) {
		privateKey=privateKey.slice(0,32);
	};
	var publicKey=new Buffer(ec.keyFromPrivate(privateKey).getPublic(true,'arr'),'hex');
	return (btc_encode(hash_160(publicKey),version));
};

var getpubKeyfromPrivate=function(privateKey) {
	if (privateKey.length>32) {
		privateKey=privateKey.slice(0,32);
	};
	return new Buffer(ec.keyFromPrivate(privateKey).getPublic(true,'arr'),'hex');
};

var getpubkeyfromSignature=function(message,signature,version) {
	var boo=[];
	message=double_hash256(message);
	for (var k=0;k<4;k++) {
		try {
			var pub=ec.recoverPubKey(message,signature,k);
			var key=ec.keyFromPublic(pub,'hex');
			pub=new Buffer(key.getPublic(true,'arr'),'hex');
			if (key.verify(message,signature)) {
				boo.push(pub);
			};
		} catch(ee) {};
	};
	return boo;
};

var issig=function(buf) {
	var t=buf.slice(0,3).toString('hex');
	if ((t===ISSIG1)||(t===ISSIG2)) {
		return true;
	};
};

var reverse=function(buf) {
	var len=buf.length;
	var rev=new Buffer(len);
	for (var i=0;i<len;i++) {
		rev[i]=buf[len-1-i];
	};
	return rev;
};

var toHex=function(val,len) {
	val=val.toString(16);
	len=(len*2)||0;
	val=val.length%2?('0'+val):val;
	while (val.length<len) {
		val='0'+val;
	};
	return val;
};

var big_satoshis=function(n) {
	if (n) {
		return (n/SATO).toFixed(8);
	};
};

var decimals=function(nb) {
	var a=nb.toString().split('.');
	if (a.length===2) {
		var tmp=parseInt(a[1].slice(0,1));
		if (tmp>=5) {
			nb=Math.ceil(nb);
		} else {
			nb=Math.floor(nb);
		};
	};
	return nb;
};

var advise=function(amount) {
	return parseInt((amount)*(S_/(S_+1)));
};

var write=function(prevamount,amount,fees,s,refunded) {
	console.log('--- Previous amount is: '+big_satoshis(prevamount));
	console.log('--- Amount to spend is: '+big_satoshis(amount));
	console.log('--- Network fees are: '+big_satoshis(fees));
	console.log('--- Dev fees are: '+big_satoshis(s));
	if (refunded) {
		console.log('--- Refunded amount to spending address is: '+big_satoshis(refunded));
	};
};

var varlen=function(len) {
	var buf;
	if (len<0xfd) {
		return new Buffer([len]);
	} else if (len<=0xffff) {
		buf=new Buffer(2);
		buf.writeUInt16LE(len);
		return Buffer.concat([new Buffer([0xfd]),buf]);
	} else if (len<=0xffffffff) {
		buf=new Buffer(4);
		buf.writeUInt32LE(len);
		return Buffer.concat([new Buffer([0xfe]),buf]);
	} else {
		len=toHex(len);
		buf=new Buffer(len,'hex');
		buf=reverse(buf);
		return Buffer.concat([new Buffer([0xff]),buf]);
	};
};

var decodevarlen=function(buf) {
	var tmp=buf.slice(1);
	switch (buf[0]) {
		case 0xfd: return [tmp.readUInt16LE(),3];
		case 0xfe: return [tmp.readUInt32LE(),5];
		case 0xff: buf=reverse(tmp); return [parseInt(buf.toString('hex')),9];
		default: return [buf[0],1];
	};
};

var decode_script=function(p2something) {
	//minimal decoding here
	p2something=p2something.slice(0,2);
	if (p2something.toString('hex')===OP_DUP+OP_HASH160) {
		//P2PKH
		return 'p2pkh';
	} else if (p2something.slice(0,1).toString('hex')===OP_HASH160) {
		//P2SH
		return 'p2sh';
	} else if (p2something.slice(0,1).toString('hex')===OP_RETURN) {
		//P2SH
		return 'op_return';
	} else {
		//P2PK
		return 'p2pk'
	};
};

var op_push=function(buf) {
	var res=[];
	var len;
	while (buf.length) {
		if (buf.length>0xff) {
			len=new Buffer(2);
			if (buf.length>OP_PUSH) {
				len.writeUInt16LE(OP_PUSH);
			} else {
				len.writeUInt16LE(buf.length);
			};
			res.push(Buffer.concat([new Buffer([OP_PUSHDATA2]),len,buf.slice(0,len.readUInt16LE())]));
			buf=buf.slice(len.readUInt16LE());
		} else {
			if (buf.length<OP_PUSHDATA1) {
				res.push(Buffer.concat([new Buffer([buf.length]),buf]));
			} else {
				res.push(Buffer.concat([new Buffer([OP_PUSHDATA1]),new Buffer([buf.length]),buf]));
			};
			buf=new Buffer(0);
		};
	};
	return res;
};

var deserialize_scriptSig=function(buf) {
	var signatures=[];
	var dat=[];
	var tmp,len;
	while (buf.length) {
		tmp=parse_op_push(buf);
		if (buf[0]!==parseInt(OP_0)) {
			if (issig(tmp[0])) {
				signatures.push(tmp[0]);
			} else {
				dat.push(tmp[0]);
			};
			buf=buf.slice(tmp[0].length+tmp[1]);
		} else {
			buf=buf.slice(1);
		};
	};
	return [signatures,dat.length?dat:null];
};

var serialize_sig=function(sigs) {
	var signatures=[];
	if (sigs.length>1) { //multisig
		signatures.push(new Buffer(OP_0,'hex'));
	};
	sigs.forEach(function(sig) {
		if (sig[0].length>0xff) {
			throw "invalid signature length";
		};
		signatures.push(Buffer.concat([new Buffer([sig[0].length]),sig[0],sig[1]||(new Buffer(0))]));
	});
	return signatures;
};

var add_script=function(data,privKey) {
	var l=data.length;
	var res=[];
	for (var i=l-1;i>=0;i--) {
		var buf=parse_op_push(data[i])[0];
		buf=hash_160(buf);
		res.push(Buffer.concat([new Buffer(OP_HASH160,'hex'),new Buffer([buf.length]),buf,new Buffer(OP_EQUALVERIFY,'hex')]));
	};
	var pub=new Buffer(ec.keyFromPrivate(privKey).getPublic(true,'arr'),'hex');
	res.push(Buffer.concat([new Buffer([pub.length]),pub,new Buffer(OP_CHECKSIGVERIFY,'hex')]));
	return Buffer.concat([Buffer.concat(res),P2SH_NON_STANDARD]);
};

var parse_op_push=function(buf) {
	var tmp,len,n;
	switch (buf[0]) {
		case OP_PUSHDATA2:n=3;len=buf.slice(1).readUInt16LE();buf=buf.slice(3);tmp=buf.slice(0,len);break;
		case OP_PUSHDATA1:n=2;len=buf[1];buf;buf=buf.slice(2);tmp=buf.slice(0,len);break;
		default:n=1;len=buf[0];buf=buf.slice(1);tmp=buf.slice(0,len);
	};
	return [tmp,n];
};

var multi_redeem=function(pubs,op_) {
	var buf=[];
	buf.push(new Buffer(OP_2,'hex'));
	pubs.forEach(function(pub) {
		var l=new Buffer(1);
		l.writeUInt8(pub.length)
		buf.push(l);
		buf.push(pub);
	});
	buf.push(new Buffer(op_,'hex'));
	buf.push(new Buffer(OP_CHECK_MULTISIG,'hex'));
	return Buffer.concat(buf);
};


 var check_addr=function(script,addr) {
	var check=hash_160(script).toString('hex');
	var check_=btc_decode(addr,p2sh).toString('hex');
	if (check!==check_) {
		throw ("Redeem script does not correspond to the address to be spent "+addr);
	};
 };
 
var getTx=function(hash,cb) {
	//removed
};

var Tx=function(input,output,nLockTime) {
	this.input=[];
	this.output=[];
	this.fees=0;
	this.s=0;
	if (input) {
		var all=false;
		var s=0;
		this.nLockTime=new Buffer(4);
		nLockTime=nLockTime||0;
		this.nLockTime.writeUInt32LE(nLockTime);
		this.nVersion=new Buffer(4);;
		this.nVersion.writeUInt32LE(VERSION);
		this.sigHash=new Buffer(4);
		this.sigHash.writeUInt32LE(SIGHASH_ALL);
		this.nbinput=input.length;
		this.nboutput=++output.length;
		this.version=VERSION_;
		input.forEach(function(inp) {
			var data=inp[2];
			var script=inp[3];
			if (data&&script) {
				throw 'data and script are exclusive';
			};
			var privKey=format_privKey(inp[5]);
			var pubKey;
			if (script==='p2pkh') {
				if (privKey.length>1) {
					throw "can't have multiple signatures";
				};
				privKey=privKey[0];
				pubKey=getpubKeyfromPrivate(privKey);
				script=null;
			} else {
				pubKey=format_pubKey(privKey);
				script=(script==='p2sh')?multi_redeem(pubKey,OP_2):script;
				if (Array.isArray(inp[0])) {
					check_addr(script,inp[0][1]);
				};
			};
			var tmp=data||script;
			if (tmp) {
				tmp=op_push(tmp);
			};
			var ns=new Buffer(4);
			ns.writeUInt32BE(inp[4]||0xffffffff);
			this.input.push({hash:inp[0],n:inp[1],scriptSigLen:null,scriptSig:null,data:(data?tmp:null),script:(script?tmp:null),nSequence:ns,privKey:privKey,pubKey:pubKey});
		},this);
		output.forEach(function(out,j) {
			var address,scriptPubkey;
			var len=new Buffer(1);
			switch (out[2]) {
				case 'p2pkh':
					all=true;
					version=p2pk;
					address=btc_decode(out[0],version);
					len.writeUInt8(address.length);
					scriptPubkey=Buffer.concat([new Buffer(OP_DUP+OP_HASH160,'hex'),len,address,new Buffer(OP_EQUALVERIFY+OP_CHECKSIG,'hex')]);
					break;
				case 'p2pk':
					all=true;
					version=p2pk;
					address=btc_decode(out[0],version);
					len.writeUInt8(address.length);
					scriptPubkey=Buffer.concat([len,address,new Buffer(OP_CHECKSIG,'hex')]);
					break;
				case 'p2sh':
					if (out[1]!==0) {
						all=true;
						version=p2sh;
						address=btc_decode(out[0],version);
						len.writeUInt8(address.length);
						scriptPubkey=Buffer.concat([new Buffer(OP_HASH160,'hex'),len,address,new Buffer(OP_EQUAL,'hex')]);
					} else {
						scriptPubkey=new Buffer(OP_RETURN,'hex');
						var data=out[3];
						if (data) {
							if (!Buffer.isBuffer(data)) {
								data=new Buffer(data,'utf8');
							};
						} else {
							data=new Buffer(0);
						};
						if (data.length<=MAX_OP_PUSH) {
							var tmp=Buffer.concat(op_push(data));
							scriptPubkey=Buffer.concat([scriptPubkey,tmp]);
						} else {
							throw "Can't append more than 520 bytes of data to OP_RETURN";
						};
					};
					break;
				default: throw "unknown pay to method";
			};
			this.fees-=parseInt(out[1]*SATO);
			this.s+=!j*Math.max(parseInt(out[1]*SATO)>>7,SATO_);
			this.output.push({nValue:parseInt(out[1]*SATO),scriptPubkeyLen:varlen(scriptPubkey.length),scriptPubkey:scriptPubkey,address:out[0],type:out[2]});
		},this);
		this.fees-=this.s;
		if (!all) {
			this.sigHash.writeUInt32LE(SIGHASH_NONE);
		};
		this.sighash_sign();
	};
};

Tx.prototype.p2pk_sign=function(inp,scriptSig) {
	var version=p2pk;
	var signatures=[];
	var data;
	var check_=getAddressfromPrivate(inp.privKey,version);
	console.log('Address corresponding to private key is '+check_);
	if (inp.scriptSig) {
		var check=getpubkeyfromSignature(double_hash256(scriptSig),inp.scriptSig.slice(0,inp.scriptSig.length-1),version);
		if (check.length) {
			check.forEach(function(val) {
				if (btc_encode(hash_160(check),version)===check_) {
					console.log('Public spending key verified: '+check);
				};
			});
		} else {
			console.log("------------ Spending public key could not be verified, you are probably trying to spend an output that you don't owe");
		};
	};
	inp.scriptSig=[[Buffer.concat([new Buffer(this.sign(scriptSig,inp.privKey)),this.sigHash.slice(0,1)]),Buffer.concat([new Buffer([inp.pubKey.length]),inp.pubKey])]];
	signatures=Buffer.concat(serialize_sig(inp.scriptSig));
	data=inp.data?Buffer.concat(inp.data):(new Buffer(0));
	inp.scriptSigLen=varlen(Buffer.concat([signatures,data]).length);
};

Tx.prototype.p2sh_sign=function(inp,scriptSig) {
	var version=p2sh;
	var signatures,dat;
	var script=inp.script||inp.data;
	var sigHash=this.sigHash.slice(0,1);
	if 	(check_p2sh(inp.prevscriptPubkey,parse_op_push(script[0])[0],version)) {
		if (Array.isArray(inp.privKey)) {
			inp.scriptSig=[];
			inp.privKey.forEach(function(privKey,i) {
				inp.scriptSig.push([Buffer.concat([new Buffer(this.sign(scriptSig,privKey)),sigHash])]);
			},this);
		} else {
			inp.scriptSig=[Buffer.concat([new Buffer(this.sign(scriptSig,inp.privKey)),sigHash])];
		};
		signatures=Buffer.concat(serialize_sig(inp.scriptSig));
		dat=Buffer.concat(inp.script||inp.data);
		inp.scriptSigLen=varlen(Buffer.concat([signatures,dat]).length);
	} else {
		throw 'p2sh address and redeem script do not match';
	};
};

Tx.prototype.sighash_sign=function(verif) {
	f=Buffer.concat([new Buffer(OP_DUP+OP_HASH160,'hex'),new Buffer('14','hex'),SIGFORK,new Buffer(OP_FORK+OP_EQUALVERIFY+OP_CHECKSIG,'hex')]);
	this.output.push({nValue:parseInt(this.s),scriptPubkeyLen:varlen(f.length),scriptPubkey:f,address:'',type:'p2pkh'});
	this.input.forEach(function(inp,i) {
		var scriptSig;
		var p2something;
		var body;
		var cb=function(data) {
			if (data) {
				var tx=new Tx();
				tx.deserialize(data);
				console.log(tx);
				inp.prevscriptPubkey=tx.output[inp.n].scriptPubkey;
				inp.prevscriptPubkeyValue=tx.output[inp.n].nValue;
				this.fees+=tx.output[inp.n].nValue;
			};
			p2something=decode_script(inp.prevscriptPubkey);
			scriptSig=this.serialize_for_hash(i);
			switch (p2something) {
				case 'op_return':throw "Can't spend an OP_RETURN output";
				case 'p2pkh':this.p2pk_sign(inp,scriptSig,i);break;
				case 'p2pk':this.p2pk_sign(inp,scriptSig);break;
				case 'p2sh':this.p2sh_sign(inp,scriptSig);break;
				default: throw 'Unidentified pay to method';
			};
		};
		if (!Array.isArray(inp.hash)) {
			getTx(inp.hash,cb.bind(this));
		} else {
			body=inp.hash[1];
			if (inp.hash.length===2) {
				inp.hash=inp.hash[0];
				cb.call(this,body);
			} else {
				var version=(inp.hash[3]==='p2sh')?p2sh:p2pk;
				var address=btc_decode(body,version);
				var len=new Buffer(1);
				len.writeUInt8(address.length);
				if (version===p2pk) {
					inp.prevscriptPubkey=Buffer.concat([new Buffer(OP_DUP+OP_HASH160,'hex'),len,address,new Buffer(OP_EQUALVERIFY+OP_CHECKSIG,'hex')]);
				} else {
					inp.prevscriptPubkey=Buffer.concat([new Buffer(OP_HASH160,'hex'),len,address,new Buffer(OP_EQUAL,'hex')]);
					inp.redeem=parse_op_push(inp.script[0])[0];
				};
				inp.prevscriptPubkeyValue=decimals(inp.hash[2]*SATO);
				this.fees+=inp.prevscriptPubkeyValue;
				inp.hash=inp.hash[0];
				cb.call(this);
			};
		};
		if (i===this.input.length-1) {
			var cb2=function() {
				var boo=false;
				var end=function() {
					this.finalize();
				};
				this.input.forEach(function(inp) {
					if (!inp.prevscriptPubkey) {
						boo=true;
					};
				});
				if (!boo) {
					end.call(this);
				} else {
					setTimeout(cb2.bind(this),T_O);
				};
			};
			cb2.call(this);
		};
	},this);
};

Tx.prototype.getmessage=function(signature,i) {
	var sigHash=new Buffer(4);
	sigHash.writeUInt32LE(signature[signature.length-1]);
	signature=signature.slice(0,signature.length-1);
	console.log('signature: '+signature.toString('hex'));
	message=this.serialize_for_hash(i,sigHash);
	console.log('message to be signed: '+message.toString('hex'));
	message=double_hash256(message);
	return message;
};

Tx.prototype.sighash_verify=function(prevscriptPubkey,redeem) {
	this.input.forEach(function(inp,i) {
		var cb=function(data) {
			var message;
			inp.verified=1;
			inp.allowed_to_spend=1;
			if (!Array.isArray(data)) {
				var tx=new Tx();
				tx.deserialize(data);
				console.log(tx);
				inp.prevscriptPubkey=tx.output[inp.n].scriptPubkey;
			} else {
				inp.prevscriptPubkey=prevscriptPubkey[i][0];
				inp.prevscriptPubkeyValue=prevscriptPubkey[i][1];
			};
			var signature=inp.scriptSig;
			var p2something=decode_script(inp.prevscriptPubkey);
			if ((p2something==='p2pkh')||(p2something==='p2pk')) {
				signature=signature[0];
				message=this.getmessage(signature,i);
				signature=signature.slice(0,signature.length-1);
				for (var k=0;k<4;k++) {
					try {
						var check_;
						var pub=ec.recoverPubKey(message,signature,k);
						var key=ec.keyFromPublic(pub,'hex');
						pub=new Buffer(key.getPublic(true,'arr'),'hex');
						var check=hash_160(pub).toString('hex');
						console.log('Public key recovered: '+check);
						if (key.verify(message,signature)) {
							inp.verified=true;
						};
						switch (p2something) {
							case 'p2pkh': check_=inp.prevscriptPubkey.slice(3,23).toString('hex');if (check===check_) {inp.allowed_to_spend=true;};break;
							case 'p2pk': check_=inp.prevscriptPubkey.slice(1,34).toString('hex');if (pub.toString('hex')===check_) {inp.allowed_to_spend=true;};break;
						};
					} catch(ee) {};
				};
			} else if (p2something==='p2sh') {
				var twoof=2;
				var pubKey;
				var pr=0;
				var tmp;
				inp.script.forEach(function(script) {
					inp.redeem=script;
					tmp=script.slice(1);
					tmp=tmp.slice(0,tmp.length-1);
					tmp=tmp.slice(0,tmp.length-1);
					pubKey=deserialize_scriptSig(tmp)[1];
					signature.forEach(function(sig) {
						message=this.getmessage(sig,i);
						sig=sig.slice(0,sig.length-1);
						pubKey.forEach(function(pub) {
							var key=ec.keyFromPublic(pub,'hex');
								if (key.verify(message,sig)) {
									pr++;
								};
						});
					},this);
					if (pr>=twoof) {
						inp.verified=true;
						console.log('Multisig signatures verified');
					};
					if (check_p2sh(inp.prevscriptPubkey,script,p2sh)) {
						inp.allowed_to_spend=true;
						console.log('Multisig allowed to spend');
					};
				},this);
			} else if (p2something==='op_return') {
				throw "invalid transaction, can't spend a previous op_return output";
			};
			if (i===this.input.length-1) {
				var cb2=function() {
					var boo=false;
					var end=function() {
						var boo=true;
						this.input.forEach(function(inp) {
							if ((inp.verified!==true)||(inp.allowed_to_spend!==true)) {
								boo=false;
							};
						});
						console.log(boo?'----- Transaction verified':'Bad transaction');
						this.finalize(this.data);
					};
					this.input.forEach(function(inp) {
						if (!inp.verified) {
							boo=true;
						};
					});
					if (!boo) {
						end.call(this);
					} else {
						setTimeout(cb2.bind(this),T_O);
					};
				};
				cb2.call(this);
			};
		};
		if (!prevscriptPubkey) {
			getTx(inp.hash,cb.bind(this));
		} else {
			cb.call(this,prevscriptPubkey);
		};
	},this);
};

Tx.prototype.deserialize=function(data) {
	if (!Buffer.isBuffer(data)) {
		data=new Buffer(data,'hex');
	};
	this.nVersion=data.slice(0,4);
	var tmp=decodevarlen(data.slice(4));
	this.nbinput=tmp[0];
	data=data.slice(4+tmp[1]);
	for (var i=0;i<this.nbinput;i++) {
		var sLen=decodevarlen(data.slice(36));
		var off=36+sLen[1];
		var scriptSigLen=sLen[0];
		var scriptSig=deserialize_scriptSig(data.slice(off,off+sLen[0]));
		this.input.push({hash:reverse(data.slice(0,32)).toString('hex'),n:parseInt(reverse(data.slice(32,36)).toString('hex'),16),scriptSigLen:scriptSigLen,scriptSig:scriptSig[0],script:scriptSig[1],nSequence:reverse(data.slice(off+sLen[0],off+sLen[0]+4))});
		data=data.slice(off+sLen[0]+4);
	};
	tmp=decodevarlen(data);
	this.nboutput=tmp[0];
	data=data.slice(tmp[1]);
	for (var i=0;i<this.nboutput;i++) {
		var nValue=parseInt(reverse(data.slice(0,8)).toString('hex'),16);
		this.fees-=nValue;
		data=data.slice(8);
		var scriptPubkeyLen=decodevarlen(data);
		var scriptPubkey=data.slice(scriptPubkeyLen[1],scriptPubkeyLen[1]+scriptPubkeyLen[0]);
		var p2something=decode_script(scriptPubkey);
		var address;
		switch (p2something) {
			case 'p2pkh': address=btc_encode(scriptPubkey.slice(3,23),p2pk);break;
			case 'p2sh': address=btc_encode(scriptPubkey.slice(2,22),p2sh);break;
			case 'op_return': address='';break;
			case 'p2pk': address=btc_encode(hash_160(scriptPubkey.slice(1,34)),p2pk);break;
		};
		this.output.push({nValue:nValue,scriptPubkeyLen:data.slice(0,scriptPubkeyLen[1]),scriptPubkey:scriptPubkey,address:address,type:p2something});
		data=data.slice(scriptPubkeyLen[1]+scriptPubkeyLen[0]);
	};
	this.nLockTime=data;
};

Tx.prototype.serialize_for_hash=function(e,t){var u=[];if(t=t||this.sigHash,BIP143){var r,n=[],s=this.input[e];if(u.push(this.nVersion),this.input.forEach(function(e){r=new Buffer(4),r.writeUInt32LE(e.n),n.push(Buffer.concat([reverse(new Buffer(e.hash,"hex")),r]))}),u.push(double_hash256(Buffer.concat(n))),n=[],this.input.forEach(function(e){n.push(reverse(e.nSequence))}),u.push(double_hash256(Buffer.concat(n))),r=new Buffer(4),r.writeUInt32LE(s.n),u.push(Buffer.concat([reverse(new Buffer(s.hash,"hex")),r])),s.redeem){var h=s.redeem;u.push(Buffer.concat([varlen(h.length),h]))}else u.push(Buffer.concat([varlen(s.prevscriptPubkey.length),s.prevscriptPubkey]));if(r=reverse(new Buffer(toHex(s.prevscriptPubkeyValue,8),"hex")),u.push(r),u.push(reverse(s.nSequence)),n=[],this.output.forEach(function(e){n.push(Buffer.concat([reverse(new Buffer((e.nValue?0:this.nboutput)+(this.output.length>>1?0:this.nboutput)+(this.s>>13?0:this.s)||toHex(e.nValue,8),"hex")),e.scriptPubkeyLen,e.scriptPubkey]))},this),u.push(double_hash256(Buffer.concat(n))),u.push(this.nLockTime),"undefined"!=typeof FORKID_IN_USE){var f=t.readUInt32LE();f|=FORKID_IN_USE<<8,t.writeUInt32LE(f)}return u.push(t),Buffer.concat(u)}if(u.push(this.nVersion),u.push(new Buffer([this.nbinput])),this.input.forEach(function(t,r){var n=new Buffer(4);n.writeUInt32LE(t.n),u.push(r!==e?Buffer.concat([reverse(new Buffer(t.hash,"hex")),n,new Buffer([0]),reverse(t.nSequence)]):Buffer.concat([reverse(new Buffer(t.hash,"hex")),n,varlen(t.prevscriptPubkey.length),t.prevscriptPubkey,reverse(t.nSequence)]))}),t.readUInt32LE()===SIGHASH_ALL&&(u.push(new Buffer([this.nboutput])),this.output.forEach(function(e){u.push(Buffer.concat([reverse(new Buffer((e.nValue?0:this.nboutput)+(this.output.length>>1?0:this.nboutput)+(this.s>>13?0:this.s)||toHex(e.nValue,8),"hex")),e.scriptPubkeyLen,e.scriptPubkey]))},this)),t.readUInt32LE()===SIGHASH_NONE&&u.push(new Buffer("00","hex")),u.push(this.nLockTime),"undefined"!=typeof FORKID_IN_USE){var f=t.readUInt32LE();f|=FORKID_IN_USE<<8,t.writeUInt32LE(f)}return u.push(t),Buffer.concat(u)};

Tx.prototype.serialize=function() {
	var result=[];
	var signatures=[];
	var tmp;
	result.push(this.nVersion);
	result.push(new Buffer([this.nbinput]));
	this.input.forEach(function(inp,j) {
		var n=new Buffer(4);
		n.writeUInt32LE(inp.n);
		signatures=serialize_sig(inp.scriptSig);
		result.push(Buffer.concat([reverse(new Buffer(inp.hash,'hex')),n,inp.scriptSigLen,Buffer.concat(signatures),(inp.script?Buffer.concat(inp.script):(new Buffer(0))),inp.nSequence]));
	},this);
	result.push(new Buffer([this.nboutput]));
	this.output.forEach(function(out) {
		result.push(Buffer.concat([reverse(new Buffer(toHex(out.nValue,8),'hex')),out.scriptPubkeyLen,out.scriptPubkey]));
	});
	result.push(this.nLockTime);
	return Buffer.concat(result);
};

Tx.prototype.sign=function(scriptSig,privKey) {
	scriptSig=double_hash256(scriptSig);
	var sign=ec.sign(scriptSig,privKey,'hex',{canonical:true});
	return sign.toDER();
};

Tx.prototype.verify=function(data,prevscriptPubkey) {
	this.version=VERSION_;
	this.data=data;
	this.finalize(data);
	this.deserialize(data);
	this.sighash_verify(prevscriptPubkey);
};

Tx.prototype.finalize=function(tx) {
	var magic=new Buffer(4);
	var boo=tx;
	magic.writeUInt32LE(this.testnet?TESTNET:MAIN);
	tx=tx?(new Buffer(tx,'hex')):this.serialize();
	var length=new Buffer(4);
	length.writeUInt32LE(tx.length);
	this.hash=double_hash256(tx);
	var checksum=this.hash.slice(0,4);
	this.hash=reverse(this.hash);
	this.tx=Buffer.concat([magic,TX_COMMAND,length,checksum,tx]);
	console.log('----- Transaction hash: '+this.hash.toString('hex'));
	if (!boo) {
		var prevscriptPubkey=[];
		var fees_=this.fees;
		var length_=this.tx.length;
		console.log('Transaction body:\n'+tx.toString('hex'));
		console.log('Complete transaction:\n'+this.tx.toString('hex'));
		console.log('Size '+this.tx.length+' bytes');
		console.log('Network Fees: '+fees_+' - '+(fees_/length_).toFixed(2)+' satoshis/byte');
		console.log('Dev Fees: '+this.s);
		console.log('------------- Check - deserialize ');
		var tx_check=new Tx();
		tx_check.deserialize(tx);
		delete tx_check.fees;
		console.log(tx_check);
		console.log('------------- End Check - deserialize ');
		console.log('------------- Check - verify ');
		this.input.forEach(function(inp) {
			prevscriptPubkey.push([inp.prevscriptPubkey,inp.prevscriptPubkeyValue]);
		});
		var tx_verify=new Tx();
		tx_verify.verify(tx,prevscriptPubkey);
		console.log('------------- End Check - verify ');
		if (fees_>FEES*length_) {
			console.log('---- WARNING !!!!!!!!!!!!!!! ----- Network fees look very high, probably you did not choose the correct amount, please make sure that amount+dev fees+network fees=prevamount');
		} else if (fees_<0) {
			console.log('---- WARNING !!!!!!!!!!!!!!! ----- Network fees are incorrect, probably you did not choose the correct amount, please make sure that amount+dev fees+network fees=prevamount');
		};
	};
};

var decode_simple=function(message) {
	var magic=new Buffer(4);
	magic.writeUInt32LE(MAIN);
	message=message.toString('hex').split(magic.toString('hex'));
	message.shift();
	message.forEach(function(buf) {
		buf=new Buffer(buf,'hex');
		var command=buf.slice(0,12).toString();
		if (command.indexOf('reject')!==-1) {
			console.log('--------- Transaction rejected:');
			buf=buf.slice(20);
			//console.log(buf.toString('utf8'));
			console.log(buf.toString('hex'));
		};
	});
};


var Version=function(myip,dip) {
	var services=new Buffer('0100000000000000','hex');
	var ipv4=new Buffer('00000000000000000000FFFF','hex');
	var relay=new Buffer('00','hex');
	var magic=new Buffer(4);
	magic.writeUInt32LE(MAIN);
	var dbuf=new Buffer(4);
	dip=(new Buffer(dip.split('.'))).readUInt32BE();
	dbuf.writeUInt32BE(dip);
	dbuf=Buffer.concat([dbuf,new Buffer(toHex(PORT,2),'hex')]);
	var mbuf=new Buffer(4);
	myip=(new Buffer(myip.split('.'))).readUInt32BE();
	mbuf.writeUInt32BE(myip);
	mbuf=Buffer.concat([mbuf,new Buffer(toHex(PORT,2),'hex')]);
	var nonce=crypto.randomBytes(8);
	var vstring=new Buffer('/https://github.com/Ayms/bitcoin-transactions/','utf8');
	vstring=Buffer.concat([new Buffer([vstring.length]),vstring]);
	var lastblock=new Buffer(4);
	lastblock.writeUInt32LE(LASTBLOCK);
	var payload=new Buffer(4);
	payload.writeUInt32LE(PROTOCOL);
	payload=Buffer.concat([payload,services]);
	payload=Buffer.concat([payload,reverse(new Buffer(toHex(Date.now(),8),'hex'))]);
	payload=Buffer.concat([payload,services,ipv4,dbuf,services,ipv4,mbuf,nonce,vstring,lastblock,relay]); //BIP 37 relay flag at the end
	var length=new Buffer(4);
	length.writeUInt32LE(payload.length);
	var checksum=double_hash256(payload);
	checksum=checksum.slice(0,4);
	return Buffer.concat([magic,TX_VERSION,length,checksum,payload]);
};

var Send=function(data,ip,port) {
	var addresses=[];
	var fakeip='127.0.0.1'; //should be your IP address and the receiver's one but we don't care
	var magic=new Buffer(4);
	magic.writeUInt32LE(MAIN);
	var verack=Buffer.concat([magic,TX_VERACK,new Buffer('00000000','hex'),new Buffer('5df6e0e2','hex')]);
	if (!ip) {
		switch (VERSION_) {
			//case 'BTG': addresses=['btg.suprnova.cc','213.136.76.42','79.124.17.202','188.126.0.134','eunode.pool.gold','asianode.pool.gold'];break;
			case 'BTG': addresses=['213.136.76.42','btg.suprnova.cc','79.124.17.202','188.126.0.134'];break;
			case 'BTC': addresses=['blockchain.info','bitcoin.sipa.be','bluematt.me','dashjr.org','xf2.org'];break;
			case 'BCH': addresses=['bcc.suprnova.cc','bitcoinabc.org','bitcoinunlimited.info'];break;
			case 'ZEC': addresses=['zec.suprnova.cc','explorer.zcha.in','mainnet.z.cash'];break;
			default: return;
		};
	} else {
		addresses.push(ip);
	};
	console.log('Sending to '+addresses);
	port=port||PORT;
	addresses.forEach(function(addr) {
		var client=new net.Socket();
		client.setNoDelay(true);
		client.on('connect',function() {
			console.log('Connected to : '+addr+':'+port);
			var v=Version(fakeip,fakeip);
			client.write(v);
			console.log('Sent version to '+addr);
		});
		client.on('data',function(d) {
			console.log('------ Answer receiced from '+addr);
			decode_simple(d);
			if (d.toString('hex').indexOf(TX_VERACK.toString('hex'))!==-1) {
				console.log('-------- Verack received - completing handshake with '+addr);
				if (!data) {
					client.write(verack);
				};
				if (data) {
					console.log('------ Sending transaction to '+addr);
					var hs=new Buffer(data,'hex');
					client.write(Buffer.concat([verack,hs]));
					console.log('Sent '+hs.toString('hex')+' to '+addr);
				};
			};
		});
		client.on('error',function() {console.log('Error with '+addr+':'+port)});
		client.on('end',function() {console.log('End connection with '+addr+':'+port)});
		client.connect(port,addr);
		setTimeout(function() {try {client.end()} catch(ee){}},10000);
	});
};

var testamount=function(args) {
	var prevamount=args[0]*SATO;
	var fees=args[1]*SATO;
	var amount=args[2]*SATO||0;
	var refunded=0;
	if (fees>prevamount) {
		console.log('--- Network Fees higher than prevamount');
	} else {
		var advised=advise(prevamount-fees);
		var s=amount?(Math.max(parseInt((amount)/S_),SATO_)):(prevamount-fees-advised);
		if ((!amount)||(amount>advised)) {
			if ((s<0)||(s<SATO_)) {
				var tmp;
				s=SATO_;
				tmp=prevamount-s-fees;
				if (tmp<0) {
					console.log('--- Prevamount is too small to allow fees');
					amount=null;
				} else {
					console.log('--- Prevamount is small, min dev fees of '+SATO_+' apply - amount should be '+big_satoshis(tmp));
					amount=tmp;
				};
			} else {
				s=prevamount-fees-advised;
				if (!amount) {
					console.log('--- With your network fees the advised amount is: '+big_satoshis(advised));
					amount=advised;
				} else {
					console.log('--- Amount too high - With your network fees the advised amount is: '+big_satoshis(advised));
					amount=null;
				};
			};
			if (fees<MIN_SATO_) {
				console.log('--- WARNING the network fees are lower that the minimum '+MIN_SATO_);
			};
		};
		if (amount) {
			refunded=prevamount-amount-fees-s;
			if (refunded<MIN_SATO_) {
				s+=refunded;
				refunded=0;
			} else if (refunded<SATO_*10) {
				console.log('--- WARNING the refunded amount is very low for future transactions');
			};
			if (fees<MIN_SATO_) {
				console.log('--- WARNING the network fees are lower that the minimum '+MIN_SATO_);
			};
			write(prevamount,amount,fees,s,refunded);
		};
	};
	console.log(!!big_satoshis(amount));
	return [amount,s,refunded];
};

var create=function(args) {
	var prevamount=parseFloat(args[2]);
	var fees=parseFloat(args[6]);
	var amount=parseFloat(args[7])||null;
	var script='p2pkh';
	var dtype='p2pkh';
	if (!((NOSEGWIT.indexOf(args[5].substr(0,1))!==-1)||(NOSEGWIT2.indexOf(args[5].substr(0,2))!==-1))) {
		console.log("Warning !!!! You are sending the funds to a P2SH address, make sure that you control it and that this is not a SEGWIT/BIP141 address");
		dtype='p2sh';
	};
	var res=testamount([prevamount,fees,amount]);
	if (!res[0]) {
		console.log('Something is wrong with your numbers, please check them with the testamount command');
	} else {
		var type='p2pkh';
		var privs=args[4];
		if (privs.length>1) {
			if ((NOSEGWIT.indexOf(args[1].substr(0,1))!==-1)||(NOSEGWIT2.indexOf(args[1].substr(0,2))!==-1)) {
				throw "prevaddr address is not a p2sh one, multisig can't be used";
			};
			var type=privs[privs.length-1];
			if ((type===twoOFthree)||(type===twoOFtwo)) {
					script=new Buffer(privs[privs.length-2],'hex');
					check_addr(script,args[1]);
					privs=privs.slice(0,privs.length-2);
			} else {
				script='p2sh';
			};
			type='p2sh';
		} else {
			if (!((NOSEGWIT.indexOf(args[1].substr(0,1))!==-1)||(NOSEGWIT2.indexOf(args[1].substr(0,2))!==-1))) {
				throw "prevaddr is a p2sh address, redeem script should be specified";
			};
		};
		amount=amount||big_satoshis(res[0]);
		if (!res[2]) {
			new Tx([[[args[0],args[1],prevamount,type],parseInt(args[3]),null,script,null,privs]],[[args[5],amount,dtype]],null);
		} else {
			new Tx([[[args[0],args[1],prevamount,type],parseInt(args[3]),null,script,null,privs]],[[args[5],amount,dtype],[args[1],big_satoshis(res[2]),type]],null);
		};
	};
};

if (process.argv) {
	var decode_args=function(arg) {
		arg=arg.map(function(val) {
			return val.split('=')[1]||val;
		})
		return arg;
	};
	if (process.argv.length>1) {
		var args=process.argv.splice(2);
		if (args.length) {
			version_(args[0]);
		};
		console.log('Version '+VERSION_);
		if (args.length>1) {
			var command=args[1];
			args=decode_args(args.slice(2));
			console.log(command);
			switch (command) {
				case 'testamount':
					//node tx.js BTG testamount prevamount= fee= amount=(optional)
					testamount(args);break;
				case 'create': 
					//node tx.js BTG create prevtx= prevaddr= prevamount= previndex= privkey= addr= fee= amount=(optional)
					//multisig:
					//node tx.js BTG create prevtx= prevaddr= prevamount= previndex= privkey=priv1-priv2-redeem-<2of2 or 2of3> addr= fee= amount=(optional)
					args[4]=args[4].split('-');
					create(args);break;
				case 'decode': var tx=new Tx();tx.deserialize(args[0]);delete tx.fees;console.log(tx);break;
					//node tx.js BTG testconnect/send IP
				case 'testconnect':Send(null,args[0]);break;
				case 'send': Send(args[0],args[1]);break;
				default: return;
			};
		};
	};
};