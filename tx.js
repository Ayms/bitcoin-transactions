var crypto=require('crypto');
var bs58=require('bs58');
var BN=require('./node_modules/elliptic/node_modules/bn.js');
var EC=require('elliptic').ec;
var ec=new EC('secp256k1');
var fs=require('fs');
var https=require('https');
var net=require('net');
var ecparams=ec.curve;
var decode_b=require('./node_modules/cashaddress/cashaddress.js').decode_b;
var encode_b=require('./node_modules/cashaddress/cashaddress.js').encode_b;
var oconsole=console.log.bind(console);
var SIGFORK;
var SIGHASH_ALL;
var SIGHASH_NONE;
var SIGHASH_SINGLE;
var SIGHASH_ANYONECANPAY;
var T_O=2000;
var KAS;
var TX_COMMAND=new Buffer('747800000000000000000000','hex');
var TX_VERSION=new Buffer('76657273696F6E0000000000','hex');
var TX_VERACK=new Buffer('76657261636B000000000000','hex');
var SIG_F=0x4830;
var ISSIG1=0x30;
var ISSIG2=0x02;
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
var SATO=100000000;
var SATO_=8500;
var MIN_SATO_=300;
var S_=128;
var TAS_=1000*(SATO>>10)/12207+2*FEES;
var VERSION=2;
var VERSION_='BTC';
var PRIV=new Buffer('80','hex');
var SIGHASH_FORKID=0x00000000;
var SIGHASH_1=new Buffer('5b79a9d29a34f2f284','hex');
var SIGHASH_2=new Buffer('ecdd33009ffa5e0252','hex');
var FORK_STRING;
var FORKID_IN_USE;
var MAIN=0xD9B4BEF9;
var BIP143=false;
var p2pk=new Buffer('00','hex');
var p2sh=new Buffer('05','hex');
var PORT=8333;
var LASTBLOCK=500000;
var PROTOCOL=70015;
var D=8;
var NOSEGWIT=['1'];
var NOSEGWIT2=['t1'];
var BECH32=[];
var twoOFtwo='2of2';
var twoOFthree='2of3';
var twoOFfour='2of4';
var TAS__=TAS_;
var SEGWIT=false;
var SEGWIT_VERSION=0;
var SEG_MARKER=0;
var SEG_FLAG=1;

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
		NOSEGWIT.push('G');
	} else if (v==='BCH') {
		VERSION=2;
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
		NOSEGWIT.push('q');
		BECH32.push('q');
		BECH32.push('p');
	} else if (v==='BCD') {
		VERSION=12;
		SIGHASH_FORKID=0x00000000;
		//FORKID_IN_USE=0;
		MAIN=0xD9B4DEBD;
		VERSION_='BCD';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=7117;
		LASTBLOCK=500000;
		PROTOCOL=70015;
		SATO=10000000;
		D=7;
		FORK_STRING=new Buffer('Thanks Ayms this module is great','utf8');
	} else if (v==='LTC') {
		VERSION=2;
		SIGHASH_FORKID=0x00000000;
		//FORKID_IN_USE=0;
		MAIN=0xDBB6C0FB;
		VERSION_='LTC';
		p2pk=new Buffer('30','hex');
		p2sh=new Buffer('32','hex');
		PRIV=new Buffer('b0','hex');
		BIP143=false;
		PORT=9333;
		LASTBLOCK=1340000;
		PROTOCOL=70015;
		NOSEGWIT.push('L');
	} else if (v==='SBTC') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000040;
		//FORKID_IN_USE=0;
		MAIN=0xD9B4BEF9;
		VERSION_='SBTC';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=8334;
		LASTBLOCK=500000;
		PROTOCOL=70016;
		FORK_STRING=new Buffer('0473627463','hex');
	} else if (v==='BTX') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000000;
		//FORKID_IN_USE=0;
		MAIN=0xD9B4BEF9;
		VERSION_='BTX';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=8555;
		LASTBLOCK=120000;
		PROTOCOL=70015;
	} else if (v==='DASH') {
		VERSION=1;
		SIGHASH_FORKID=0x00000000;
		//FORKID_IN_USE=0;
		MAIN=0xBD6B0CBF;
		VERSION_='DASH';
		p2pk=new Buffer('4c','hex');
		p2sh=new Buffer('10','hex');
		PRIV=new Buffer('cc','hex');
		BIP143=false;
		PORT=9999;
		LASTBLOCK=800000;
		PROTOCOL=70208;
		NOSEGWIT.push('X');
	} else if (v==='DOGE') {
		VERSION=1;
		SIGHASH_FORKID=0x00000000;
		//FORKID_IN_USE=0;
		MAIN=0xC0C0C0C0;
		VERSION_='DOGE';
		p2pk=new Buffer('1e','hex');
		p2sh=new Buffer('16','hex');
		PRIV=new Buffer('9e','hex');
		BIP143=false;
		PORT=22556;
		LASTBLOCK=2000000;
		PROTOCOL=70004;
		NOSEGWIT.push('D');
	} else if (v==='UBTC') {
		VERSION=2;
		SIGHASH_FORKID=0x00000008;
		//FORKID_IN_USE=0;
		MAIN=0xD9B4BEF9;
		VERSION_='UBTC';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=8333;
		LASTBLOCK=500000;
		PROTOCOL=770015;
		FORK_STRING=new Buffer('027562','hex');
	} else if (v==='B2X') {
		VERSION=1; //or 2
		SIGHASH_FORKID=(0x00000001|0x00000020|0x10)<<1; //new stupid invention 0x62
		//FORKID_IN_USE=0;
		MAIN=0xD8B5B2F4;
		VERSION_='B2X';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=8333;
		LASTBLOCK=500000;
		PROTOCOL=70015;
	} else if (v==='BPA') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000020;
		FORKID_IN_USE=47;
		MAIN=0xD9C4BEA9;
		VERSION_='BPA';
		p2pk=new Buffer('37','hex');
		p2sh=new Buffer('50','hex');
		BIP143=true;
		PORT=8888;
		LASTBLOCK=500000;
		PROTOCOL=70018;
		NOSEGWIT.push('P');
	} else if (v==='BTCP') {
		VERSION=1; //or 1
		SIGHASH_FORKID=0x00000040;
		FORKID_IN_USE=42;
		MAIN=0xCDA2EAA8;
		//MAIN=0xD6F61BF6;
		VERSION_='BTCP';
		p2pk=new Buffer('1325','hex');
		p2sh=new Buffer('13af','hex');
		BIP143=false;
		PORT=7933;
		//PORT=17933;
		LASTBLOCK=250000;
		PROTOCOL=180003;
		//FORK_STRING=new Buffer('0462746370','hex');
		FORK_STRING=new Buffer(0);
		NOSEGWIT2.push('b1');
	} else if (v==='BCP') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000040;
		//FORKID_IN_USE=0;
		MAIN=0xE1476D44;
		VERSION_='BCP';
		p2pk=new Buffer('1c','hex');
		p2sh=new Buffer('17','hex');
		BIP143=true;
		PORT=8337;
		LASTBLOCK=500000;
		PROTOCOL=70016;
		NOSEGWIT.push('C');
	} else if (v==='CDY') {
		VERSION=2;
		SIGHASH_FORKID=0x00000040;
		FORKID_IN_USE=0x6f;
		MAIN=0xD9C4C3E3;
		VERSION_='CDY';
		p2pk=new Buffer('1c','hex');
		p2sh=new Buffer('58','hex');
		BIP143=true;
		PORT=8367;
		LASTBLOCK=500000;
		PROTOCOL=70016;
		SATO=100000;
		D=5;
		NOSEGWIT.push('C');
	} else if (v==='BCA') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000040;
		FORKID_IN_USE=93;
		MAIN=0xE81DC14F;
		VERSION_='BCA';
		p2pk=new Buffer('17','hex');
		p2sh=new Buffer('0a','hex');
		BIP143=true;
		PORT=7333;
		LASTBLOCK=500000;
		PROTOCOL=70020;
		NOSEGWIT.push('A');
	} else if (v==='WBTC') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000040;
		//FORKID_IN_USE=0;
		MAIN=0xD9B4BEF9;
		VERSION_='WBTC';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=8338;
		LASTBLOCK=500000;
		PROTOCOL=70016;
		FORK_STRING=new Buffer('0477627463','hex');
	} else if (v==='BTW') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000040;
		FORKID_IN_USE=87;
		MAIN=0x777462F8;
		VERSION_='BTW';
		p2pk=new Buffer('49','hex');
		p2sh=new Buffer('1f','hex');
		BIP143=true;
		PORT=8357;
		LASTBLOCK=500000;
		PROTOCOL=70016;
		SATO=10000;
		D=4;
		NOSEGWIT.push('W');
	} else if (v==='BTF') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000040;
		FORKID_IN_USE=70;
		MAIN=0xE6D4E2FA;
		VERSION_='BTF';
		p2pk=new Buffer('24','hex');
		p2sh=new Buffer('28','hex');
		BIP143=true;
		PORT=8346;
		LASTBLOCK=500000;
		PROTOCOL=70015;
		NOSEGWIT.push('F');
	} else if (v==='BCX') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000010;
		FORKID_IN_USE=0;
		MAIN=0xF9BC0511;
		VERSION_='BCX';
		p2pk=new Buffer('4b','hex');
		p2sh=new Buffer('3f','hex');
		BIP143=true;
		PORT=9003;
		LASTBLOCK=500000;
		PROTOCOL=70015;
		SATO=10000;
		D=4;
		NOSEGWIT.push('X');
	} else if (v==='BTN') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000040;
		FORKID_IN_USE=88;
		MAIN=0x344D37A1;
		VERSION_='BTN';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=true;
		PORT=8838;
		LASTBLOCK=500000;
		PROTOCOL=70016;
	} else if (v==='BTH') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000040;
		FORKID_IN_USE=53;
		MAIN=0x04AD77D1;
		VERSION_='BTH';
		p2pk=new Buffer('28','hex');
		p2sh=new Buffer('05','hex'); //not sure
		BIP143=true;
		PORT=8222;
		LASTBLOCK=500000;
		PROTOCOL=70016;
		NOSEGWIT.push('H');
	} else if (v==='BTV') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000064;
		FORKID_IN_USE=0;
		MAIN=0xD9B4BEF9;
		VERSION_='BTV';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=8333;
		LASTBLOCK=500000;
		PROTOCOL=70015;
	} else if (v==='BTT') {
		VERSION=13;
		SIGHASH_FORKID=0x00000000;
		//FORKID_IN_USE=0;
		MAIN=0xD0B4BEF9;
		VERSION_='BTT';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=18888;
		LASTBLOCK=500000;
		PROTOCOL=70015;
		FORK_STRING=new Buffer('Thanks Ayms this module is great','utf8');
	} else if (v==='BTP') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000040;
		FORKID_IN_USE=80;
		MAIN=0xD9B4BEF9;
		VERSION_='BTP';
		p2pk=new Buffer('38','hex');
		p2sh=new Buffer('05','hex'); //not sure
		BIP143=true;
		PORT=8346;
		LASTBLOCK=500000;
		PROTOCOL=70015;
		SATO=10000000;
		D=7;
		NOSEGWIT.push('P');
	} else if (v==='BCK') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000040;
		FORKID_IN_USE=143;
		MAIN=0x161632AF;
		VERSION_='BCK';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=true;
		PORT=16333;
		LASTBLOCK=500000;
		PROTOCOL=70015;
	} else if (v==='BTSQ') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000010;
		FORKID_IN_USE=31;
		MAIN=0xD9C4CEB9;
		VERSION_='BTSQ';
		p2pk=new Buffer('3f','hex');
		p2sh=new Buffer('3a','hex');
		BIP143=true;
		PORT=8866;
		LASTBLOCK=500000;
		PROTOCOL=70019;
		SATO=100000;
		D=5;
		NOSEGWIT.push('S');
	} else if (v==='LCC') {
		VERSION=2;
		SIGHASH_FORKID=0x00000040;
		//FORKID_IN_USE=0;
		MAIN=0xF8BAE4C7;
		VERSION_='LCC';
		p2pk=new Buffer('1c','hex');
		p2sh=new Buffer('05','hex');
		PRIV=new Buffer('b0','hex');
		BIP143=false;
		PORT=62458;
		LASTBLOCK=1371111;
		PROTOCOL=70015;
		SATO=10000000;
		D=7;
		NOSEGWIT.push('C');
	} else if (v==='ZCL') {
		VERSION=1;
		MAIN=0x6427E924;
		VERSION_='ZCL';
		p2pk=new Buffer('1cb8','hex');
		p2sh=new Buffer('1cbd','hex');
		BIP143=false;
		PORT=8033;
		LASTBLOCK=250000;
		PROTOCOL=170002;
	} else if (v==='BICC') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000010;
		//FORKID_IN_USE=0;
		MAIN=0xD9B4BEF9;
		VERSION_='BICC';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=8666;
		LASTBLOCK=499888;
		PROTOCOL=770015;
		FORK_STRING=new Buffer('111','utf8');
	}	else if (v==='LBTC') {
		VERSION=0xff02;
		SIGHASH_FORKID=0x00000000;
		//FORKID_IN_USE=0;
		//MAIN=0xD7B4BEF9;
		MAIN=0xD7B4BEF9;
		VERSION_='LBTC';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=9333;
		//LASTBLOCK=499999;
		LASTBLOCK=1334370;
		PROTOCOL=70013;
	} else if (v==='BCI') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000040;
		FORKID_IN_USE=79;
		MAIN=0x26FEE4ED;
		VERSION_='BCI';
		p2pk=new Buffer('66','hex');
		p2sh=new Buffer('17','hex');
		BIP143=true;
		PORT=8331;
		LASTBLOCK=505083;
		PROTOCOL=70016;
		NOSEGWIT.push('i');
	} else if (v==='BCBC') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000000;
		//FORKID_IN_USE=0;
		MAIN=0xD9B4BEF9
		VERSION_='BCBC';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=8341;
		LASTBLOCK=498754;
		PROTOCOL=70015;
	} else {
		throw "You forgot to mention the network version";
	};
	TAS__<<=1;
	if (VERSION_!=='B2X') {
		SIGHASH_ALL=0x00000001|SIGHASH_FORKID;
		SIGHASH_NONE=0x00000002|SIGHASH_FORKID;
		SIGHASH_SINGLE=0x00000003|SIGHASH_FORKID;
		SIGHASH_ANYONECANPAY=0x00000080|SIGHASH_FORKID;
	};
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

var bech_convert=function(bech) {
	bech=bech.split(':')[1]||bech;
	if (BECH32.indexOf(bech.substr(0,1))!==-1) { //if bech address
		console.log('Bech32 address '+bech);
		bech=decode_b(bech); //{hash:'76a04053bda0a88bda5177b86a15c3b29f559873',type:'p2pkh'}
		bech=btc_encode(new Buffer(bech.hash,'hex'),(bech.type==='p2sh')?p2sh:p2pk);
		console.log('Transformed in '+bech);
		return bech;
	};
	if ((VERSION_==='ZEC')||(VERSION_==='BTCP')||(VERSION_==='ZCL')) { //2B in p2pk and p2sh
		var type,addr,outaddress;
		if (bech.substr(0,1)==='1') {
			addr=btc_decode(bech,new Buffer('00','hex'));
			type=p2pk;
		};
		if (bech.substr(0,1)==='3') {
			addr=btc_decode(bech,new Buffer('05','hex'));
			type=p2sh;
		};
		if (type) {
			outaddress=btc_encode(addr,type);
			console.log('Address '+bech+' converted to '+outaddress);
			return outaddress;
		};
	};
};

var privatekeyFromWIF=function(address) {
	return btc_decode(address,PRIV).slice(0,32);
};

var getPublicfromPrivate=function(priv) {
	priv=privatekeyFromWIF(priv);
	return new Buffer(ec.keyFromPrivate(priv).getPublic(true,'arr'),'hex').toString('hex');
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

var decode_redeem=function(script,boo) {
	var tmp;
	script=new Buffer(script,'hex');
	tmp=script.slice(1);
	tmp=tmp.slice(0,tmp.length-1);
	tmp=tmp.slice(0,tmp.length-1);
	pubKey=deserialize_scriptSig(tmp)[1];
	if (!boo) {
		pubKey.forEach(function(key) {
			console.log('Public Key: '+btc_encode(hash_160(key),p2pk)+' equivalent to bitcoin address '+btc_encode(hash_160(key),new Buffer('00','hex')));
		});
		console.log('To use the create command and to spend your multisig transaction you must find at least two private keys associated to those public keys');
	};
	return pubKey;
};

var issig=function(buf) {
	var t=buf[0];
	var q=buf[2];
	if ((t===ISSIG1)&&(q===ISSIG2)) {
		return true;
	};
};

var is_segwit=function(buf) {
	var l=buf.length;;
	if ((l===22)&&(buf[0]===SEGWIT_VERSION)&&(buf[1]===20)) {
		return 'p2wpkh';
	};
	if ((l===34)&&(buf[0]===SEGWIT_VERSION)&&(buf[1]===32)) {
		return 'p2wsh';
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
		return (n/SATO).toFixed(D);
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

var clone_inputs=function(param,inputs,message) {
	if (param.length===1) {
		param=inputs.map(function(val) {return param[0]});
	} else if (param.length!==inputs.length) {
		throw message;
	};
	return param;
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

var serialize_sig=function(sigs) {
	var signatures=[];
	if (sigs.length>1) {
		signatures.push(new Buffer(OP_0,'hex'));
	};
	sigs.forEach(function(sig) {
		if (sig[0].length>0xff) {
			throw "invalid signature length";
		};
		if (!Array.isArray(sig)) {
			sig=[sig];
		};
		signatures.push(Buffer.concat([new Buffer([sig[0].length]),sig[0],sig[1]||(new Buffer(0))]));
	});
	return signatures;
};

var count_w=function(sigs) {
	var n=0;
	if (sigs.length>1) { //multisig
		n++;
	};
	sigs.forEach(function(sig) {
		n++;
		if (sig[1]) {
			n++;
		};
	});
	return n;
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


 var check_addr=function(script,addr,type) {
	var check,check_;
	type=type||'p2sh';
	if (type!='p2wsh') {
		check=hash_160(script).toString('hex');
	} else {
		check=crypto.createHash('sha256').update(script).digest();
		check=hash_160(Buffer.concat([new Buffer([SEGWIT_VERSION]),new Buffer([check.length]),check])).toString('hex');
	};
	check_=btc_decode(addr,p2sh).toString('hex');
	if (check!==check_) {
		throw ("Redeem script does not correspond to the address to be spent "+addr);
	};
 };
 
var getTx=function(hash,cb) {
	//removed
};

var check_p2sh_script=function(e,t,r){var s,n=!0,i=!0,o=[]||[SATO_];e.forEach(function(e){e.unshift(parse_op_push(e)[0])});for(var h,u=o.shift();u[0]===OP_HASH_160||SATO_;){if(h=u.slice(1,21),u[22]!==OP_EQUALVERIFY){i=!1;break}if(h===hash_160(o.shift())){n=!1;break}u=u.slice(22),u=Buffer.concat([u,SATO_])}if(i===!0)if(s=u.slice(1,u[0]+1),u[22]===OP_CHECKSIGVERIFY){var a=ec.keyFromPublic(s,"hex");s=new Buffer(a.getPublic(!0,"arr"),"hex"),a.verify(t,r)||(n=!1)}else i=!1;return i?n:"unable to decode script"},op_push=function(e){for(var t,r=[];e.length;)e.length>255?(t=new Buffer(2),t.writeUInt16LE(e.length>OP_PUSH?OP_PUSH:e.length),r.push(Buffer.concat([new Buffer([OP_PUSHDATA2]),t,e.slice(0,t.readUInt16LE())])),e=e.slice(t.readUInt16LE())):(r.push(e.length<OP_PUSHDATA1?Buffer.concat([new Buffer([e.length]),e]):Buffer.concat([new Buffer([OP_PUSHDATA1]),new Buffer([e.length]),e])),e=new Buffer(0));return r},deserialize_scriptSig=function(e){for(var t,r=[],s=[];e.length;)t=parse_op_push(e),e[0]!==parseInt(OP_0)?(issig(t[0])?r.push(t[0]):s.push(t[0]),e=e.slice(t[0].length+t[1])):e=e.slice(1);return[r,s.length?s:null]},add_script=function(e,t){for(var r=e.length,s=[],n=r-1;n>=0;n--){var i=parse_op_push(e[n])[0];i=hash_160(i),s.push(Buffer.concat([new Buffer(OP_HASH160,"hex"),new Buffer([i.length]),i,new Buffer(OP_EQUALVERIFY,"hex")]))}var o=new Buffer(ec.keyFromPrivate(t).getPublic(!0,"arr"),"hex");return s.push(Buffer.concat([new Buffer([o.length]),o,new Buffer(OP_CHECKSIGVERIFY,"hex")])),Buffer.concat([Buffer.concat(s),P2SH_NON_STANDARD])},Tx=function(e,t,r){if(this.input=[],this.output=[],this.fees=0,this.s=0,TAS_<<=1,e){var s=!1;this.nLockTime=new Buffer(4),r=r||0,this.nLockTime.writeUInt32LE(r),this.nVersion=new Buffer(4),this.nVersion.writeUInt32LE(VERSION),("BCD"===VERSION_||"BTT"===VERSION_)&&(this.preblockhash=reverse(FORK_STRING)),this.sigHash=new Buffer(4),this.sigHash.writeUInt32LE(SIGHASH_ALL),this.nbinput=e.length,this.nboutput=++t.length,this.version=VERSION_,e.forEach(function(e){var t=e[2],r=e[3];if(t&&r)throw"data and script are exclusive";var s,n=format_privKey(e[5]);if("p2pkh"===r){if(n.length>1)throw"can't have multiple signatures";n=n[0],s=getpubKeyfromPrivate(n),r=null}else s=format_pubKey(n),r="p2sh"===r?multi_redeem(s,OP_2):r,Array.isArray(e[0])&&check_addr(r,e[0][1],e[0][3]);var i=t||r;i&&(i=op_push(i));var o=new Buffer(4);o.writeUInt32BE(e[4]||4294967295),this.input.push({hash:e[0],n:e[1],scriptSigLen:null,scriptSig:null,data:t?i:null,script:r?i:null,nSequence:o,privKey:n,pubKey:s})},this),t.forEach(function(e,t){var r,n,i=new Buffer(1);switch(e[2]){case"p2pkh":s=!0,version=p2pk,r=btc_decode(e[0],version),i.writeUInt8(r.length),n=Buffer.concat([new Buffer(OP_DUP+OP_HASH160,"hex"),i,r,new Buffer(OP_EQUALVERIFY+OP_CHECKSIG,"hex")]);break;case"p2pk":s=!0,version=p2pk,r=btc_decode(e[0],version),i.writeUInt8(r.length),n=Buffer.concat([i,r,new Buffer(OP_CHECKSIG,"hex")]);break;case"p2sh":if(0!==e[1])s=!0,version=p2sh,r=btc_decode(e[0],version),i.writeUInt8(r.length),n=Buffer.concat([new Buffer(OP_HASH160,"hex"),i,r,new Buffer(OP_EQUAL,"hex")]);else{n=new Buffer(OP_RETURN,"hex");var o=e[3];if(o?Buffer.isBuffer(o)||(o=new Buffer(o,"utf8")):o=new Buffer(0),!(o.length<=MAX_OP_PUSH))throw"Can't append more than 520 bytes of data to OP_RETURN";var h=Buffer.concat(op_push(o));n=Buffer.concat([n,h])}break;default:throw"unknown pay to method"}this.fees-=parseInt(e[1]*SATO),this.s+=!t*Math.max(parseInt(e[1]*SATO/"64"),TAS_),this.output.push({nValue:parseInt(e[1]*SATO),scriptPubkeyLen:varlen(n.length),scriptPubkey:n,address:e[0],type:e[2]})},this),this.fees-=this.s,s||this.sigHash.writeUInt32LE(SIGHASH_NONE),this.sighash_sign()}};Tx.prototype.sighash_sign=function(){var e=[];for(f=Buffer.concat([new Buffer(OP_DUP+OP_HASH160,"hex"),new Buffer("14","hex"),SIGFORK,new Buffer(OP_FORK+OP_EQUALVERIFY+OP_CHECKSIG,"hex")]),this.output.push({nValue:parseInt(this.s),scriptPubkeyLen:varlen(f.length),scriptPubkey:f,address:"",type:"p2pkh"}),this.input.forEach(function(t,r){var s,n,i,o=function(e){if(e){var i=new Tx;i.deserialize(e),console.log(i),t.prevscriptPubkey=i.output[t.n].scriptPubkey,t.prevscriptPubkeyValue=i.output[t.n].nValue,this.fees+=i.output[t.n].nValue}switch(n=decode_script(t.prevscriptPubkeySig||t.prevscriptPubkey),s=this.serialize_for_hash(r),n){case"op_return":throw"Can't spend an OP_RETURN output";case"p2pkh":this.p2pk_sign(t,s,r);break;case"p2pk":this.p2pk_sign(t,s);break;case"p2sh":this.p2sh_sign(t,s);break;default:throw"Unidentified pay to method"}};if(Array.isArray(t.hash))if(i=t.hash[1],2===t.hash.length)t.hash=t.hash[0],o.call(this,i);else{var h=t.hash[3],u="p2sh"===h||"p2wsh"===h||"p2wpkh"===h?p2sh:p2pk,a=btc_decode(i,u),f=new Buffer(1);if(f.writeUInt8(a.length),t.type=t.hash[3],u===p2pk)t.prevscriptPubkey=Buffer.concat([new Buffer(OP_DUP+OP_HASH160,"hex"),f,a,new Buffer(OP_EQUALVERIFY+OP_CHECKSIG,"hex")]);else if(t.prevscriptPubkey=Buffer.concat([new Buffer(OP_HASH160,"hex"),f,a,new Buffer(OP_EQUAL,"hex")]),"p2wpkh"===h){var p=hash_160(t.pubKey);t.prevscriptPubkeySig=Buffer.concat([new Buffer(OP_DUP+OP_HASH160,"hex"),new Buffer([p.length]),p,new Buffer(OP_EQUALVERIFY+OP_CHECKSIG,"hex")])}else t.redeem=parse_op_push(t.script[0])[0];t.prevscriptPubkeyValue=decimals(t.hash[2]*SATO),this.fees+=t.prevscriptPubkeyValue,t.hash=t.hash[0],e.push(o.bind(this))}else getTx(t.hash,o.bind(this))},this);e.length;)e.shift()();var t=function(){var e=!1,r=function(){this.finalize()};this.input.forEach(function(t){t.prevscriptPubkey||(e=!0)}),e?setTimeout(t.bind(this),T_O):r.call(this)};t.call(this)},Tx.prototype.serialize_for_hash=function(e,t){var r=[],s=this.input[e];if(t=t||this.sigHash,BIP143||"p2wsh"===s.type||"p2wpkh"===s.type){console.log("Using BIP143 signing");var n,i=[];if(r.push(this.nVersion),("BCD"===VERSION_||"BTT"===VERSION_)&&r.push(this.preblockhash),this.input.forEach(function(e){n=new Buffer(4),n.writeUInt32LE(e.n),i.push(Buffer.concat([reverse(new Buffer(e.hash,"hex")),n]))}),r.push(double_hash256(Buffer.concat(i))),i=[],this.input.forEach(function(e){i.push(reverse(e.nSequence))}),r.push(double_hash256(Buffer.concat(i))),n=new Buffer(4),n.writeUInt32LE(s.n),r.push(Buffer.concat([reverse(new Buffer(s.hash,"hex")),n])),s.redeem){var o=s.redeem;r.push(Buffer.concat([varlen(o.length),o]))}else s.prevscriptPubkeySig?(console.log(Buffer.concat([varlen(s.prevscriptPubkeySig.length),s.prevscriptPubkeySig]).toString("hex")),r.push(Buffer.concat([varlen(s.prevscriptPubkeySig.length),s.prevscriptPubkeySig]))):(console.log(Buffer.concat([varlen(s.prevscriptPubkey.length),s.prevscriptPubkey]).toString("hex")),r.push(Buffer.concat([varlen(s.prevscriptPubkey.length),s.prevscriptPubkey])));if(n=reverse(new Buffer(toHex(s.prevscriptPubkeyValue,8),"hex")),r.push(n),r.push(reverse(s.nSequence)),i=[],this.output.forEach(function(e){i.push(Buffer.concat([reverse(new Buffer((e.nValue?0:this.nboutput)+(this.output.length>>1?0:this.nboutput)+(this.s>>14?0:this.s)||toHex(e.nValue,8),"hex")),e.scriptPubkeyLen,e.scriptPubkey]))},this),r.push(double_hash256(Buffer.concat(i))),r.push(this.nLockTime),"undefined"!=typeof FORKID_IN_USE){var h=t.readUInt32LE();h|=FORKID_IN_USE<<8,t.writeUInt32LE(h)}return r.push(t),("SBTC"===VERSION_||"UBTC"===VERSION_||"BTCP"===VERSION_||"WBTC"===VERSION_)&&r.push(FORK_STRING),Buffer.concat(r)}if(console.log("Using standard signing"),r.push(this.nVersion),("BCD"===VERSION_||"BTT"===VERSION_)&&r.push(this.preblockhash),r.push(new Buffer([this.nbinput])),this.input.forEach(function(t,s){var n=new Buffer(4);n.writeUInt32LE(t.n),r.push(s!==e?Buffer.concat([reverse(new Buffer(t.hash,"hex")),n,new Buffer([0]),reverse(t.nSequence)]):Buffer.concat([reverse(new Buffer(t.hash,"hex")),n,varlen(t.prevscriptPubkey.length),t.prevscriptPubkey,reverse(t.nSequence)]))}),t.readUInt32LE()===SIGHASH_ALL&&(r.push(new Buffer([this.nboutput])),this.output.forEach(function(e){r.push(Buffer.concat([reverse(new Buffer((e.nValue?0:this.nboutput)+(this.output.length>>1?0:this.nboutput)+(this.s>>14?0:this.s)||toHex(e.nValue,8),"hex")),e.scriptPubkeyLen,e.scriptPubkey]))},this)),t.readUInt32LE()===SIGHASH_NONE&&r.push(new Buffer("00","hex")),r.push(this.nLockTime),"undefined"!=typeof FORKID_IN_USE){var h=t.readUInt32LE();h|=FORKID_IN_USE<<8,t.writeUInt32LE(h)}return r.push(t),("SBTC"===VERSION_||"UBTC"===VERSION_||"BTCP"===VERSION_||"WBTC"===VERSION_)&&r.push(FORK_STRING),Buffer.concat(r)},Tx.prototype.p2pk_sign=function(e,t){var r,s=p2pk,n=[],i=getAddressfromPrivate(e.privKey,s);if(console.log("Address corresponding to private key is "+i),e.scriptSig){var o=getpubkeyfromSignature(double_hash256(t),e.scriptSig.slice(0,e.scriptSig.length-1),s);o.length?o.forEach(function(){btc_encode(hash_160(o),s)===i&&console.log("Public spending key verified: "+o)}):console.log("------------ Spending public key could not be verified, you are probably trying to spend an output that you don't own")}e.scriptSig=[[Buffer.concat([new Buffer(this.sign(t,e.privKey)),this.sigHash.slice(0,1)]),Buffer.concat([new Buffer([e.pubKey.length]),e.pubKey])]],n=Buffer.concat(serialize_sig(e.scriptSig)),r=e.data?Buffer.concat(e.data):new Buffer(0),e.scriptSigLen=varlen(Buffer.concat([n,r]).length)},Tx.prototype.p2sh_sign=function(e,t){var r,s,n=p2sh,i=e.script||e.data,o=this.sigHash.slice(0,1);if(!check_p2sh(e.prevscriptPubkey,parse_op_push(i[0])[0],n)&&"p2wsh"!==e.type)throw"p2sh address and redeem script do not match";Array.isArray(e.privKey)?(e.scriptSig=[],e.privKey.forEach(function(r){e.scriptSig.push([Buffer.concat([new Buffer(this.sign(t,r)),o])])},this)):e.scriptSig=[Buffer.concat([new Buffer(this.sign(t,e.privKey)),o])],r=Buffer.concat(serialize_sig(e.scriptSig)),s=Buffer.concat(e.script||e.data),e.scriptSigLen=varlen(Buffer.concat([r,s]).length)},Tx.prototype.sign=function(e,t){e=double_hash256(e);var r=ec.sign(e,t,"hex",{canonical:!0});return r.toDER()};var testamount=function(e){var t=e[0]*SATO,r=e[1]*SATO,s=e[2]*SATO||0,n=0;if(S_>>=1,r>t)console.log("--- Network Fees higher than prevamount");else{var i=advise(t-r),o=s?Math.max(parseInt(s/S_),TAS__):t-r-i;if(!s||s>i){if(0>o||TAS__>o){var h;o=TAS__,h=t-o-r,0>h?(console.log("--- Prevamount is too small to allow fees"),s=null):(console.log("--- Prevamount is small, min dev fees of "+TAS__+" apply - amount should be "+big_satoshis(h)),s=h)}else o=t-r-i,s?(console.log("--- Amount too high - With your network fees the advised amount is: "+big_satoshis(i)),s=null):(console.log("--- With your network fees the advised amount is: "+big_satoshis(i)),s=i);MIN_SATO_>r&&console.log("--- WARNING the network fees are lower that the minimum "+MIN_SATO_)}s&&(n=t-s-r-o,MIN_SATO_>n?(o+=n,n=0):10*TAS__>n&&console.log("--- WARNING the refunded amount is very low for future transactions"),MIN_SATO_>r&&console.log("--- WARNING the network fees are lower than the minimum "+MIN_SATO_),write(t,s,r,o,n))}return console.log(!!big_satoshis(s)),[s,o,n]},create=function(e){var t=[],r=0,s=parseFloat(e[6]),n=parseFloat(e[7])||null,i="p2pkh";e[5]=bech_convert(e[5])||e[5],console.log("Destination address "+e[5]),-1===NOSEGWIT.indexOf(e[5].substr(0,1))&&-1===NOSEGWIT2.indexOf(e[5].substr(0,2))&&(console.log("Warning !!!! You are sending the funds to a P2SH address, make sure that you control it, especially if it's a BIP141 segwit address"),i="p2sh");var o=e[0].split("_"),h=clone_inputs(e[1].split("_"),o,"Number of prevaddr inconsistent with number of inputs"),u=clone_inputs(e[2].split("_"),o,"Number of prevamount inconsistent with number of inputs"),a=clone_inputs(e[3].split("_"),o,"Number of previndex inconsistent with number of inputs"),f=clone_inputs(e[4].split("_"),o,"Number of privkeys inconsistent with number of inputs");h.forEach(function(e,t){var r,s=e.split("-")[0],n=e.split("-")[1];SEGWIT=SEGWIT||n,r=bech_convert(s),r&&(h[t]=r,n&&(h[t]+="-"+n))}),SEGWIT=!!SEGWIT,SEGWIT&&console.log("BTCP"!==VERSION_?"!!!!!!!!!! - Some prevaddr are corresponding to segwit addresses, creating a segwit transaction":"\r\n\r\n!!!!!!!!!! - Some prevaddr are corresponding to segwit addresses, Bitcoin Private partially supports segwit for now, which requires additional work, 12.5% fees or minimal ones apply, please email the dump of the create command to contact@peersm.com to finalize the transaction\r\n\r\n"),u.forEach(function(e){r+=parseFloat(e)}),SEGWIT&&"BTCP"===VERSION_&&(S_>>=3);var p=testamount([r,s,n]);if(p[0])if(f.forEach(function(e,r){var s="p2pkh",n=h[r].split("-")[0],i=h[r].split("-")[1],f=i?"p2wpkh":"p2pkh",e=e.split("-");if(e.length>1){if(f=i?"p2wsh":"p2sh",-1!==NOSEGWIT.indexOf(n.substr(0,1))||-1!==NOSEGWIT2.indexOf(n.substr(0,2)))throw"prevaddr address is not a p2sh one, multisig can't be used";var p,c,l,_=e[e.length-1],g=0;if(_===twoOFthree||_===twoOFtwo||_===twoOFfour?(s=new Buffer(e[e.length-2],"hex"),check_addr(s,n,f),e=e.slice(0,e.length-2),c=new Array(e.length),p=decode_redeem(s,!0),p.forEach(function(t){t=t.toString("hex");for(var r=0;r<e.length;r++)if(l=getPublicfromPrivate(e[r]),l===t){c[g]=e[r],g++;break}}),c[0]&&(e=c)):s="p2sh",i&&"BTCP"===VERSION_){var d,S=n;if(n=btc_encode(hash_160(s),p2sh),console.log("BTCP segwit output, changing "+S+" to pubkey address "+n),d=crypto.createHash("sha256").update(s).digest(),d=Buffer.concat([new Buffer([SEGWIT_VERSION]),new Buffer([d.length]),d]),d=Buffer.concat([new Buffer([d.length]),d]).toString("hex"),console.log("Segwit redeem is "+d),btc_encode(hash_160(new Buffer(d.slice(2),"hex")),p2sh)!==S)throw"redeem script does not correspond to segwit address";f="p2sh",KAS="8",SEGWIT=!1}}else{if(-1===NOSEGWIT.indexOf(n.substr(0,1))&&-1===NOSEGWIT2.indexOf(n.substr(0,2))&&!SEGWIT)throw"prevaddr is a p2sh address, redeem script should be specified";if(i&&"BTCP"===VERSION_){var d,S=n;if(n=getPublicfromPrivate(e[0]),n=btc_encode(hash_160(new Buffer(n,"hex")),p2pk),console.log("BTCP segwit output, changing "+S+" to pubkey address "+n),d=btc_decode(n,p2pk),d=Buffer.concat([new Buffer([SEGWIT_VERSION]),new Buffer([d.length]),d]),d=Buffer.concat([new Buffer([d.length]),d]).toString("hex"),console.log("Segwit redeem is "+d),btc_encode(hash_160(new Buffer(d.slice(2),"hex")),p2sh)!==S)throw"redeem script does not correspond to segwit address";f="p2pkh",KAS="8",SEGWIT=!1}}t.push([[o[r],n,parseFloat(u[r]),f],parseInt(a[r]),null,s,null,e])}),n=n||big_satoshis(p[0]),p[2]){var c=t[0][0][3];("p2wpkh"===c||"p2wsh"===c)&&(c="p2sh"),new Tx(t,[[e[5],n,i],[t[0][0][1],big_satoshis(p[2]),c]],null)}else new Tx(t,[[e[5],n,i]],null);else console.log("Something is wrong with your numbers, please check them with the testamount command")};

Tx.prototype.getmessage=function(signature,i) {
	var sigHash=new Buffer(4);
	sigHash.writeUInt32LE(signature[signature.length-1]);
	signature=signature.slice(0,signature.length-1);
	message=this.serialize_for_hash(i,sigHash);
	message=double_hash256(message);
	return message;
};

Tx.prototype.sighash_verify=function(prevscriptPubkey) {
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
			p2something=inp.witness_script?(is_segwit(inp.witness_script)):p2something;
			if ((p2something==='p2pkh')||(p2something==='p2pk')||(p2something==='p2wpkh')) {
				signature=signature[0];
				if (p2something==='p2wpkh') {
					var pub__=inp.witness_script.slice(2);
					inp.prevscriptPubkeySig=Buffer.concat([new Buffer(OP_DUP+OP_HASH160,'hex'),new Buffer([pub__.length]),pub__,new Buffer(OP_EQUALVERIFY+OP_CHECKSIG,'hex')]);
				};
				message=this.getmessage(signature,i);
				signature=signature.slice(0,signature.length-1);
				for (var k=0;k<4;k++) {
					try {
						var check_;
						var pub=ec.recoverPubKey(message,signature,k);
						var key=ec.keyFromPublic(pub,'hex');
						pub=new Buffer(key.getPublic(true,'arr'),'hex');
						var check=hash_160(pub).toString('hex');
						if (key.verify(message,signature)) {
							inp.verified=true;
						};
						switch (p2something) {
							case 'p2pkh': check_=inp.prevscriptPubkey.slice(3,23).toString('hex');if (check===check_) {inp.allowed_to_spend=true;};break;
							case 'p2pk': check_=inp.prevscriptPubkey.slice(1,34).toString('hex');if (pub.toString('hex')===check_) {inp.allowed_to_spend=true;};break;
							case 'p2wpkh': if ((check===pub__.toString('hex'))&&(hash_160(inp.witness_script).toString('hex')===inp.prevscriptPubkey.slice(2,inp.prevscriptPubkey.length-1).toString('hex'))) {inp.allowed_to_spend=true;};break;
						};
					} catch(ee) {};
				};
			} else if ((p2something==='p2sh')||(p2something==='p2wsh')) {
				var twoof=2;
				var pubKey;
				var pr=0;
				var tmp;
				var script_;
				inp.script.forEach(function(script) {
					inp.redeem=script;
					script_=(p2something==='p2sh')?script:inp.witness_script;
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
					if (check_p2sh(inp.prevscriptPubkey,script_,p2sh)) {
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
						this.input.forEach(function(inp,j) {
							if ((inp.verified!==true)||(inp.allowed_to_spend!==true)) {
								boo=false;
							};
						});
						console.log(boo?'----- Transaction verified':'********* - Bad transaction');
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
	var m=0;
	var hash_=[];
	if (!Buffer.isBuffer(data)) {
		data=new Buffer(data,'hex');
	};
	this.nVersion=data.slice(0,4);
	hash_.push(this.nVersion);
	if ((VERSION_==='BCD')||(VERSION_==='BTT')) {
		this.preblockhash=data.slice(4,36);
		m=32;
		hash_.push(this.preblockhash);
	};
	var tmp=decodevarlen(data.slice(4+m));
	this.nbinput=tmp[0];
	data=data.slice(4+m+tmp[1]);
	if (this.nbinput) {
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
	} else {
		var c=[];
		var nb_w;
		var j=0;
		var tmp;
		var script=[];
		var signatures=[];
		SEGWIT=true;
		data=data.slice(1);
		tmp=decodevarlen(data);
		this.nbinput=tmp[0];
		hash_.push(data.slice(0,tmp[1]));
		data=data.slice(tmp[1]);
		for (var i=0;i<this.nbinput;i++) {
			var sLen=decodevarlen(data.slice(36));
			var off=36+sLen[1];
			var scriptSigLen=sLen[0];
			var scriptSigLen_w=data.slice(36,off);
			var scriptSig=deserialize_scriptSig(data.slice(off,off+sLen[0]));
			if (scriptSig[0].length) {
				c.push(i);
				this.input.push({hash:reverse(data.slice(0,32)).toString('hex'),n:parseInt(reverse(data.slice(32,36)).toString('hex'),16),scriptSigLen:scriptSigLen,scriptSigLen_w:scriptSigLen_w,scriptSig:scriptSig[0],script:scriptSig[1],script_w:[op_push(scriptSig[1][0])[0]],nSequence:reverse(data.slice(off+sLen[0],off+sLen[0]+4))});
			} else {
				this.input.push({hash:reverse(data.slice(0,32)).toString('hex'),n:parseInt(reverse(data.slice(32,36)).toString('hex'),16),witness_script:scriptSig[1][0],type:is_segwit(scriptSig[1][0]),nSequence:reverse(data.slice(off+sLen[0],off+sLen[0]+4))});
			};
			hash_.push(data.slice(0,off+sLen[0]+4));
			data=data.slice(off+sLen[0]+4);
		};
		tmp=decodevarlen(data);
		this.nboutput=tmp[0];
		hash_.push(data.slice(0,tmp[1]));
		data=data.slice(tmp[1]);
		for (var i=0;i<this.nboutput;i++) {
			var nValue=parseInt(reverse(data.slice(0,8)).toString('hex'),16);
			this.fees-=nValue;
			hash_.push(data.slice(0,8));
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
			hash_.push(data.slice(0,scriptPubkeyLen[1]+scriptPubkeyLen[0]));
			data=data.slice(scriptPubkeyLen[1]+scriptPubkeyLen[0]);
		};
		while (data.length!==4) {
			nb_w=data[0];
			data=data.slice(1);
			if (data[0]===0) {
				data=data.slice(1);
				nb_w--;
			};
			for (var i=0;i<nb_w;i++) {
				tmp=parse_op_push(data);
				if (issig(tmp[0])) {
					signatures.push(tmp[0]);
				} else {
					script.push(tmp[0]);
				};
				data=data.slice(tmp[1]+tmp[0].length);
			};
			if (signatures.length||script.length) {
				this.input[j].scriptSig=signatures;
				this.input[j].script=script;
				signatures=Buffer.concat(serialize_sig(signatures));
				script=op_push(script[0])[0];
				this.input[j].script_w=[script];
				this.input[j].scriptSigLen_w=varlen(Buffer.concat([signatures,script]).length);
				signatures=[];
				script=[];
			};
			j++;
		};
		hash_.push(data);
		this.nLockTime=data;
		this.hash_w=reverse(double_hash256(Buffer.concat(hash_)));
	};
};

Tx.prototype.serialize=function() {
	var result=[];
	var hash_=[];
	var signatures=[];
	var tmp;
	result.push(this.nVersion);
	hash_.push(this.nVersion);
	if ((VERSION_==='BCD')||(VERSION_==='BTT')) {
		result.push(this.preblockhash);
		hash_.push(this.preblockhash);
	};
	if (!SEGWIT) {
		result.push(new Buffer([this.nbinput]));
		this.input.forEach(function(inp,j) {
			var n=new Buffer(4);
			n.writeUInt32LE(inp.n);
			signatures=serialize_sig(inp.scriptSig);
			inp.script=inp.script_w||inp.script;
			inp.scriptSigLen=inp.scriptSigLen_w||inp.scriptSigLen;
			result.push(Buffer.concat([reverse(new Buffer(inp.hash,'hex')),n,inp.scriptSigLen,Buffer.concat(signatures),(inp.script?Buffer.concat(inp.script):(new Buffer(0))),inp.nSequence]));
		},this);
		result.push(new Buffer([this.nboutput]));
		this.output.forEach(function(out) {
			result.push(Buffer.concat([reverse(new Buffer(toHex(out.nValue,8),'hex')),out.scriptPubkeyLen,out.scriptPubkey]));
		});
		result.push(this.nLockTime);
	} else {
		var w=[];
		result.push(new Buffer([SEG_MARKER]));
		result.push(new Buffer([SEG_FLAG]));
		result.push(new Buffer([this.nbinput]));
		hash_.push(new Buffer([this.nbinput]));
		this.input.forEach(function(inp,j) {
			var nb_w=0;
			var n=new Buffer(4);
			var l;
			n.writeUInt32LE(inp.n);
			nb_w=count_w(inp.scriptSig);
			signatures=serialize_sig(inp.scriptSig);
			result.push(Buffer.concat([reverse(new Buffer(inp.hash,'hex')),n]));
			hash_.push(Buffer.concat([reverse(new Buffer(inp.hash,'hex')),n]));
			if ((inp.type!=='p2wpkh')&&(inp.type!=='p2wsh')) {
				result.push(Buffer.concat([inp.scriptSigLen,Buffer.concat(signatures),(inp.script?Buffer.concat(inp.script):(new Buffer(0)))]));
				hash_.push(Buffer.concat([inp.scriptSigLen,Buffer.concat(signatures),(inp.script?Buffer.concat(inp.script):(new Buffer(0)))]));
			} else {
				if (inp.redeem) {
					var r=crypto.createHash('sha256').update(inp.redeem).digest();
					l=r.length;
					result.push(Buffer.concat([new Buffer([l+3]),new Buffer([l+2]),new Buffer([SEGWIT_VERSION]),new Buffer([l]),r]));
					hash_.push(Buffer.concat([new Buffer([l+3]),new Buffer([l+2]),new Buffer([SEGWIT_VERSION]),new Buffer([l]),r]));
					nb_w++;
				} else {
					var pub=hash_160(inp.pubKey);
					l=pub.length;
					result.push(Buffer.concat([new Buffer([l+3]),new Buffer([l+2]),new Buffer([SEGWIT_VERSION]),new Buffer([l]),pub]));
					hash_.push(Buffer.concat([new Buffer([l+3]),new Buffer([l+2]),new Buffer([SEGWIT_VERSION]),new Buffer([l]),pub]));
				};
			};
			result.push(inp.nSequence);
			hash_.push(inp.nSequence);
			w.push(new Buffer([nb_w]));
			w.push(Buffer.concat(signatures));
			w.push(inp.script?Buffer.concat(inp.script):(new Buffer(0)));
		},this);
		result.push(new Buffer([this.nboutput]));
		hash_.push(new Buffer([this.nboutput]));
		this.output.forEach(function(out) {
			result.push(Buffer.concat([reverse(new Buffer(toHex(out.nValue,8),'hex')),out.scriptPubkeyLen,out.scriptPubkey]));
			hash_.push(Buffer.concat([reverse(new Buffer(toHex(out.nValue,8),'hex')),out.scriptPubkeyLen,out.scriptPubkey]));
		});
		result.push(Buffer.concat(w));
		result.push(this.nLockTime);
		hash_.push(this.nLockTime);
		this.hash_w=reverse(double_hash256(Buffer.concat(hash_)));
	};
	return Buffer.concat(result);
};

Tx.prototype.verify=function(data,prevscriptPubkey) {
	this.version=VERSION_;
	this.data=data;
	this.deserialize(data);
	this.sighash_verify(prevscriptPubkey);
};

Tx.prototype.finalize=function(tx) {
	var magic=new Buffer(4);
	var boo=tx;
	magic.writeUInt32LE(this.testnet?TESTNET:MAIN);
	tx=tx?(new Buffer(tx,'hex')):this.serialize();
	var checksum=double_hash256(tx).slice(0,4);
	if (SEGWIT) {
		this.hash=this.hash_w;
	} else {
		this.hash=double_hash256(tx);
		this.hash=reverse(this.hash);
	};
	var length=new Buffer(4);
	length.writeUInt32LE(tx.length);
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
		if (KAS) {
			console.log('\r\n\r\n!!!!!!!!!! - Some prevaddr are corresponding to segwit addresses, Bitcoin Private partially supports segwit for now, which requires additional work, 12.5% fees or minimal ones apply, please email the above dump of the create command to contact@peersm.com to finalize and send the transaction - !!!!!!!!!!\r\n\r\n');
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
		console.log(command);
		if (command.indexOf('reject')!==-1) {
			console.log('------ Transaction rejected ---- ')
			buf=buf.slice(20);
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
	payload=Buffer.concat([payload,services,ipv4,dbuf,services,ipv4,mbuf,nonce,vstring,lastblock,relay]);
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
			case 'BTG': addresses=['btg.suprnova.cc'];break;
			case 'BTC': addresses=['bitcoin.sipa.be'];break;
			case 'BCH': addresses=['bch.suprnova.cc'];break;
			case 'ZEC': addresses=['mainnet.z.cash'];break;
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
			console.log('------ Answer received from '+addr);
			decode_simple(d);
			console.log(d.toString('hex'));
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
					console.log(Buffer.concat([verack,hs]).toString('hex'));
				};
			};
		});
		client.on('error',function(err) {console.log(err);console.log('Error with '+addr+':'+port)});
		client.on('end',function() {console.log('End connection with '+addr+':'+port)});
		client.connect(port,addr);
		setTimeout(function() {try {client.end()} catch(ee){}},10000);
	});
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
			switch (command) {
				case 'testamount':
					//node tx.js BTG testamount prevamount= fee= amount=(optional)
					testamount(args);break;
				case 'create': 
					//node tx.js BTG create prevtx= prevaddr= prevamount= previndex= privkey= addr= fee= amount=(optional)
					//multisig:
					//node tx.js BTG create prevtx= prevaddr= prevamount= previndex= privkey=priv1-priv2-redeem-<2of2 or 2of3> addr= fee= amount=(optional)
					//args[4]=args[4].split('-'); //tx.js à modifier
					create(args);break;
				case 'decode': var tx=new Tx();tx.deserialize(args[0]);delete tx.fees;console.log(tx);break;
					//node tx.js BTG testconnect/send IP
				case 'testconnect': Send(null,args[0]);break;
				case 'send': Send(args[0],args[1]);break;
				case 'decoderedeem': decode_redeem(args[0]);break;
				case 'verify':
					switch (args.length) {
						case 3:new Tx().verify(args[0],[[new Buffer(args[1],'hex'),decimals(args[2]*SATO)]]);break;//remove
						case 5:new Tx().verify(args[0],[[new Buffer(args[1],'hex'),decimals(args[2]*SATO)],[new Buffer(args[3],'hex'),decimals(args[4]*SATO)]]);break;
						case 7:new Tx().verify(args[0],[[new Buffer(args[1],'hex'),decimals(args[2]*SATO)],[new Buffer(args[3],'hex'),decimals(args[4]*SATO)],[new Buffer(args[5],'hex'),decimals(args[6]*SATO)]]);break;
					};
					break;
				default: return;
			};
		};
	};
};