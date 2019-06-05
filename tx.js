var crypto=require('crypto');
var bs58=require('bs58');
var BN=require('./node_modules/elliptic/node_modules/bn.js');
var EC=require('elliptic').ec;
var ec=new EC('secp256k1');
var ecdh=new EC('curve25519');
var SHA256Compress=require('./node_modules/sha256-c/SHA256Compress.js');
var https=require('https');
var http=require('http');
var net=require('net');
var ecparams=ec.curve;
var decode_b=require('./node_modules/cashaddress/cashaddress.js').decode_b;
var encode_b=require('./node_modules/cashaddress/cashaddress.js').encode_b;
var decode_bech32=require('./node_modules/bech32/segwit.js').decode;
var encode_bech32=require('./node_modules/bech32/segwit.js').encode;
var oconsole=console.log.bind(console);
var MASTER_SECRET=new Buffer('Bitcoin seed');
var HARDENED_OFFSET=0x80000000;
var BITCOIN_VERSIONS={private:0x0488ADE4,public:0x0488B21E};
var DEFAULT_WALLET_NB=100;
var DEFAULT_PATH="m/0'/0'/0'";
var DEFAULT_HARD=true;
var CRLF='\r\n';
var zcash_z=new Buffer('169a','hex');
var zcash_spending_key=new Buffer('ab36','hex');
var ZCASH_VERSIONS=BITCOIN_VERSIONS; //take same value than bitcoin
var SUPER_MAGIC=0; //Bug #1893
var SIGHASH_ALL;
var SIGHASH_NONE;
var SIGHASH_SINGLE;
var SIGHASH_ANYONECANPAY;
var T_O;
var TX_COMMAND;
var TX_VERSION;
var TX_VERACK;
var TX_GETDATA;
var SIG_F;
var ISSIG1;
var ISSIG2;
var OP_PUSHDATA1;
var OP_PUSHDATA2;
var OP_PUSH;
var MAX_OP_PUSH;
var OP_DUP;
var OP_HASH160;
var OP_RETURN;
var OP_0;
var OP_1;
var OP_2;
var OP_3;
var OP_DROP;
var OP_DEPTH;
var OP_EQUAL;
var OP_EQUALVERIFY;
var OP_CHECKSIG;
var OP_CHECKSIGVERIFY;
var OP_CHECK_MULTISIG;
var OP_CODESEPARATORS;
var OP_FORK;
var P2SH_NON_STANDARD;
var FEES;
var SATO;
var VERSION;
var VERSION_;
var PRIV;
var SIGHASH_FORKID;
var SIGHASH_1;
var SIGHASH_2;
var FORK_STRING;
var FORKID_IN_USE;
var MAIN;
var BIP143;
var p2pk;
var p2sh;
var prefix;
var PORT;
var LASTBLOCK;
var PROTOCOL;
var D;
var NOP2SH;
var NOP2SH2;
var BECH32;
var twoOFtwo;
var twoOFthree;
var twoOFfour;
var SEGWIT;
var SEGWIT_VERSION;
var SEG_MARKER;
var SEG_FLAG;
var command_xhr;
var res_xhr;

//Hack for Buffer nodejs deprecation and backward compatibility with previous nodejs versions
var oBuffer=Buffer;

if (oBuffer.from) {
	console.log('--------------------------------------------');
	Buffer=function() {
		if (typeof arguments[0]==='number') {
			return oBuffer.alloc(arguments[0]);
		} else {
			return oBuffer.from.apply(null,arguments);
		};
	};
	Object.keys(oBuffer).forEach(function(val) {
		Buffer[val]=oBuffer[val];
	});
	Object.setPrototypeOf(Buffer.prototype,oBuffer.prototype);
};

if (typeof window==='undefined'===false) {
	var window=false;
};

var version_=function(v) {
	SIGHASH_ALL=null;
	SIGHASH_NONE=null;
	SIGHASH_SINGLE=null;
	SIGHASH_ANYONECANPAY=null;
	T_O=2000;
	TX_COMMAND=new Buffer('747800000000000000000000','hex');
	TX_VERSION=new Buffer('76657273696F6E0000000000','hex');
	TX_VERACK=new Buffer('76657261636B000000000000','hex');
	TX_GETDATA=new Buffer('676574646174610000000000','hex'); //remove
	SIG_F=0x4830;
	ISSIG1=0x30;
	ISSIG2=0x02;
	OP_PUSHDATA1=0x4c;
	OP_PUSHDATA2=0x4d;
	OP_PUSH=512;
	MAX_OP_PUSH=520;
	OP_DUP='76';
	OP_HASH160='a9';
	OP_RETURN='6a';
	OP_0='00';
	OP_1='01';
	OP_2='52';
	OP_3='53';
	OP_DROP='75';
	OP_DEPTH='74';
	OP_EQUAL='87';
	OP_EQUALVERIFY='88';
	OP_CHECKSIG='ac';
	OP_CHECKSIGVERIFY='ad';
	OP_CHECK_MULTISIG='ae';
	OP_CODESEPARATORS='ab';
	OP_FORK='b689';
	P2SH_NON_STANDARD=new Buffer(OP_0+OP_DROP+OP_DEPTH+OP_0+OP_EQUAL,'hex');
	FEES=250;
	SATO=100000000;
	VERSION=2;
	VERSION_='BTC';
	PRIV=new Buffer('80','hex');
	SIGHASH_FORKID=0x00000000;
	SIGHASH_1=new Buffer('5b79a9d29a34f2f284','hex');
	SIGHASH_2=new Buffer('ecdd33009ffa5e0252','hex');
	FORK_STRING=null;
	FORKID_IN_USE=null;
	MAIN=0xD9B4BEF9;
	BIP143=false;
	p2pk=new Buffer('00','hex');
	p2sh=new Buffer('05','hex');
	prefix='Bitcoin Signed Message:\n';//for future signing implementation https://github.com/bitcoin/bitcoin/blob/master/src/validation.cpp
	PORT=8333;
	LASTBLOCK=500000;
	PROTOCOL=70015;
	D=8;
	NOP2SH=['1'];
	NOP2SH2=['t1'];
	BECH32=[];
	twoOFtwo='2of2';
	twoOFthree='2of3';
	twoOFfour='2of4';
	SEGWIT=false;
	SEGWIT_VERSION=0;
	SEG_MARKER=0;
	SEG_FLAG=1;
	command_xhr=[];
	if (v==='BTC') {
		//default
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
		SUPER_MAGIC=1893; //Bug #1893
		//DEFAULT_PATH='m/'+SUPER_MAGIC+"'/0'/0'";
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
		NOP2SH.push('G');
		DEFAULT_PATH=="m/44'/156'/0'/0/0";
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
		NOP2SH.push('q');
		BECH32.push('q');
		BECH32.push('p');
	} else if (v==='BCD') {
		VERSION=12;
		SIGHASH_FORKID=0x00000000;
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
		DEFAULT_PATH=="m/44'/999'/0'/0/0";
	} else if (v==='LTC') {
		VERSION=2;
		SIGHASH_FORKID=0x00000000;
		MAIN=0xDBB6C0FB;
		VERSION_='LTC';
		p2pk=new Buffer('30','hex');
		p2sh=new Buffer('32','hex');
		PRIV=new Buffer('b0','hex');
		BIP143=false;
		PORT=9333;
		LASTBLOCK=1340000;
		PROTOCOL=70015;
		NOP2SH.push('L');
		DEFAULT_PATH=="m/2'/156'/0'/0/0";
	} else if (v==='SBTC') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000040;
		MAIN=0xD9B4BEF9;
		VERSION_='SBTC';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=8334;
		LASTBLOCK=500000;
		PROTOCOL=70016;
		FORK_STRING=new Buffer('0473627463','hex');
		DEFAULT_PATH=="m/44'/8888'/0'/0/0";
	} else if (v==='BTX') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000000;
		MAIN=0xD9B4BEF9;
		VERSION_='BTX';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=8555;
		LASTBLOCK=120000;
		PROTOCOL=70015;
		DEFAULT_PATH=="m/44'/165'/0'/0/0";
	} else if (v==='DASH') {
		VERSION=1;
		SIGHASH_FORKID=0x00000000;
		MAIN=0xBD6B0CBF;
		VERSION_='DASH';
		p2pk=new Buffer('4c','hex');
		p2sh=new Buffer('10','hex');
		PRIV=new Buffer('cc','hex');
		BIP143=false;
		PORT=9999;
		LASTBLOCK=800000;
		PROTOCOL=70208;
		NOP2SH.push('X');
		DEFAULT_PATH=="m/44'/5'/0'/0/0";
	} else if (v==='DOGE') {
		VERSION=1;
		SIGHASH_FORKID=0x00000000;
		MAIN=0xC0C0C0C0;
		VERSION_='DOGE';
		p2pk=new Buffer('1e','hex');
		p2sh=new Buffer('16','hex');
		PRIV=new Buffer('9e','hex');
		BIP143=false;
		PORT=22556;
		LASTBLOCK=2000000;
		PROTOCOL=70004;
		NOP2SH.push('D');
		DEFAULT_PATH=="m/44'/3'/0'/0/0";
	} else if (v==='UBTC') {
		VERSION=2;
		SIGHASH_FORKID=0x00000008;
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
		FORKID_IN_USE=0;
		SIGHASH_FORKID=0x00000031;
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
		NOP2SH.push('P');
		DEFAULT_PATH=="m/44'/6666'/0'/0/0";
	} else if (v==='BTCP') {
		VERSION=1; //or 1
		SIGHASH_FORKID=0x00000040;
		FORKID_IN_USE=42;
		MAIN=0xCDA2EAA8;
		VERSION_='BTCP';
		p2pk=new Buffer('1325','hex');
		p2sh=new Buffer('13af','hex');
		BIP143=false;
		PORT=7933;
		LASTBLOCK=250000;
		PROTOCOL=180003;
		FORK_STRING=new Buffer(0);
		NOP2SH2.push('b1');
		DEFAULT_PATH=="m/44'/183'/0'/0/0";
	} else if (v==='BCP') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000040;
		MAIN=0xE1476D44;
		VERSION_='BCP';
		p2pk=new Buffer('1c','hex');
		p2sh=new Buffer('17','hex');
		BIP143=true;
		PORT=8337;
		LASTBLOCK=500000;
		PROTOCOL=70016;
		NOP2SH.push('C');
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
		NOP2SH.push('C');
		DEFAULT_PATH=="m/44'/1145'/0'/0/0";
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
		NOP2SH.push('A');
		DEFAULT_PATH=="m/44'/185'/0'/0/0";
	} else if (v==='WBTC') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000040;
		MAIN=0xD9B4BEF9;
		VERSION_='WBTC';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=8338;
		LASTBLOCK=500000;
		PROTOCOL=70016;
		FORK_STRING=new Buffer('0477627463','hex');
		DEFAULT_PATH=="m/44'/188'/0'/0/0";
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
		NOP2SH.push('W');
		DEFAULT_PATH=="m/44'/777'/0'/0/0";
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
		NOP2SH.push('F');
		DEFAULT_PATH=="m/44'/9888'/0'/0/0";
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
		NOP2SH.push('X');
		DEFAULT_PATH=="m/44'/1688'/0'/0/0";
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
		DEFAULT_PATH=="m/44'/1000'/0'/0/0";
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
		SATO=1000000;
		D=6;
		NOP2SH.push('H');
	} else if (v==='BTV') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000040;
		FORKID_IN_USE=50;
		MAIN=0xD9B4BEF9;
		VERSION_='BTV';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=8333;
		LASTBLOCK=500000;
		PROTOCOL=70015;
		DEFAULT_PATH=="m/44'/7777'/0'/0/0";
	} else if (v==='BTT') {
		VERSION=13;
		SIGHASH_FORKID=0x00000000;
		MAIN=0xD0B4BEF9;
		VERSION_='BTT';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=18888;
		LASTBLOCK=500000;
		PROTOCOL=70015;
		FORK_STRING=new Buffer('Thanks Ayms this module is great','utf8');
		DEFAULT_PATH=="m/44'/34952'/0'/0/0";
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
		NOP2SH.push('P');
		DEFAULT_PATH=="m/44'/8999'/0'/0/0";
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
		NOP2SH.push('S');
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
		NOP2SH.push('C');
		DEFAULT_PATH=="m/44'/192'/0'/0/0";
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
		DEFAULT_PATH=="m/44'/147'/0'/0/0";
	} else if (v==='BICC') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000010;
		MAIN=0xD9B4BEF9;
		VERSION_='BICC';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=8666;
		LASTBLOCK=499888;
		PROTOCOL=731800;
		FORK_STRING=new Buffer('03313131','hex');
	} else if (v==='LBTC') {
		VERSION=0xff01;
		SIGHASH_FORKID=0x00000000;
		MAIN=0xD7B3BEF9;
		VERSION_='LBTC';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=9333;
		LASTBLOCK=1334370;
		PROTOCOL=70013;
		DEFAULT_PATH=="m/44'/998'/0'/0/0";
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
		NOP2SH.push('i');
	} else if (v==='BCBC') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000000;
		MAIN=0xD9B4BEF9;
		VERSION_='BCBC';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=8341;
		LASTBLOCK=498754;
		PROTOCOL=70015;
	} else if (v==='BTCH') {
		VERSION=1; //or 2
		SIGHASH_FORKID=0x00000000;
		MAIN=0x8DE4EEF9;
		VERSION_='BTCH';
		p2pk=new Buffer('3c','hex');
		p2sh=new Buffer('55','hex');
		PRIV=new Buffer('bc','hex');
		BIP143=false;
		PORT=7770;
		LASTBLOCK=507089;
		PROTOCOL=170002;
		NOP2SH.push('R');
	} else if (v==='GOD') {
		VERSION=2;
		SIGHASH_FORKID=0x00000008;
		FORKID_IN_USE=107;
		MAIN=0xD9B4BEF9;
		VERSION_='GOD';
		p2pk=new Buffer('61','hex');
		p2sh=new Buffer('17','hex');
		BIP143=true;
		PORT=8885;
		LASTBLOCK=501226;
		PROTOCOL=70015;
		NOP2SH.push('g');
		DEFAULT_PATH=="m/44'/9999'/0'/0/0";
	} else if (v==='BBC') {
		VERSION=1;
		SIGHASH_FORKID=0x00000040;
		FORKID_IN_USE=66;
		MAIN=0xC3C2C2FE;
		VERSION_='BBC';
		p2pk=new Buffer('13','hex');
		p2sh=new Buffer('37','hex');
		BIP143=true;
		PORT=8366;
		LASTBLOCK=508888;
		PROTOCOL=70015;
		NOP2SH.push('8');
		SATO=10000000;
		D=7;
		DEFAULT_PATH=="m/44'/1111'/0'/0/0";
	} else if (v==='NBTC') {
		VERSION=1;
		SIGHASH_FORKID=0x00000040;
		FORKID_IN_USE=78;
		MAIN=0xD8B4BEF9;
		VERSION_='BBC';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=true;
		PORT=18880;
		LASTBLOCK=501225;
		PROTOCOL=70015;
	} else if (v==='BCL') {
		VERSION=1;
		MAIN=0x4D744BE4;
		VERSION_='BCL';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=false;
		PORT=8338;
		LASTBLOCK=518800;
		PROTOCOL=70015;
	} else if (v==='BSV') {
		VERSION=2;
		SIGHASH_FORKID=0x00000040;
		//FORKID_IN_USE=0;
		MAIN=0xE8F3E1E3;
		VERSION_='BSV';
		p2pk=new Buffer('00','hex');
		p2sh=new Buffer('05','hex');
		BIP143=true;
		PORT=8333;
		LASTBLOCK=546229;
		PROTOCOL=70015;
		NOP2SH.push('q');
		BECH32.push('q');
		BECH32.push('p');
		DEFAULT_PATH=="m/44'/236'/0'/0/0";
	} else {
		throw "You forgot to mention the network version";
	};
	SIGHASH_ALL=0x00000001|SIGHASH_FORKID;
	SIGHASH_NONE=0x00000002|SIGHASH_FORKID;
	SIGHASH_SINGLE=0x00000003|SIGHASH_FORKID;
	SIGHASH_ANYONECANPAY=0x00000080|SIGHASH_FORKID;
};

var display=function(hd,version,bool) {
	var seed='';
	if (bool) {
		seed='master seed ';
	};
	console.log('------------------------------------ '+(seed?(seed+' '+hd.seed.toString('hex')):('depth '+hd.depth+' index hardened '+(hd.index-HARDENED_OFFSET))));
	console.log(seed+'chain code: '+hd.chainCode.toString('hex'));
	console.log(seed+'private key: '+hd.privateKey.toString('hex'));
	console.log(seed+'public key: '+hd.publicKeyl.toString('hex'));
	console.log(seed+'public key (compact): '+hd.publicKey.toString('hex'));
	console.log(seed+'Extended private key: '+btc_encode(serialize(hd,'private'),version));
	console.log(seed+'Extended public key: '+btc_encode(serialize(hd,'public'),version));
	console.log(seed+'address: '+hd.address);
};

var display_z=function(hd) {
	console.log('------------------------------------ '+('depth '+hd.depth+' index hardened '+(hd.index-HARDENED_OFFSET)));
	console.log('spending key: '+hd.ask.toString('hex'));
	console.log('viewing key: '+hd.sk_enc.toString('hex'));
	console.log('paying key: '+hd.apk.toString('hex'));
	console.log('transmission key: '+hd.pk_enc.toString('hex'));
	console.log('spending key address: '+hd.ask_a);
	console.log('z-address: '+hd.z_address);
};

var display_w=function(res,version,boo) {
	//res: time,xprv,seed,hd,[path,index,not_hardened],priv
	//zcash
	//[ask,zaddr];
	var time=res[0];
	var l=res.length;
	var tmp=res[4];
	if (boo) {
		console.log('# extended private masterkey: '+res[1]);
	};
	if (res[2]) {
			console.log(btc_encode(res[2],PRIV)+' '+time+' hdseed=1 '+' # addr='+getAddressfromPrivate(res[2],version)+' hdkeypath=m');
	};
	path=tmp[0];
	s_=tmp[1];
	not_hardened=tmp[2];
	nb=tmp[3];
	for (var i=0;i<nb;i++) {
		priv=res[i+5];
		console.log(btc_encode(priv,PRIV)+' '+time+' '+(i?'reserve=1':'label=')+' # addr='+getAddressfromPrivate(priv,version)+" hdkeypath="+path+'/'+(i+s_)+(not_hardened?"":"'"));
	};
	if (res.length>(nb+5)) { //zcash
		console.log(CRLF+'# Zkeys'+CRLF);
		nb+=6;
		for (var i=nb;i<l;i++) {
			console.log('# '+res[i][0]+' '+time+' # zaddr='+res[i][1]+" hdkeypath="+path+'/'+(i+s_-nb)+(not_hardened?"":"'"));
		};
	};
};

var display_tx=function(tx) {
	var res=[];
	var tmp=[];
	var type;
	res.push('nVersion '+tx.nVersion.toString('hex'));
	res.push('nb input: '+tx.nbinput);
	tx.input.forEach(function(inp) {
		res.push('   -------');
		res.push('   tx: '+inp.hash);
		res.push('   n: '+inp.n);
		if ((inp.type==='p2wpkh')||(inp.type==='p2wsh')||(inp.type==='p2w')) { //p2w non nested segwit
			if (inp.type==='p2w') {
				inp.type=(inp.nb_w>2)?'p2wsh2':'p2wpkh2';
			};
			res.push('   type: '+inp.type);
			res.push('   script: '+inp.witness_script.toString('hex'));
			res.push('   nb witness: '+inp.nb_w);
			tmp=inp.scriptSig.map(function(val) {
				return val.toString('hex');
			});
			res.push('   witness sigs: '+tmp.join(','));
			tmp=inp.script.map(function(val) {
				return val.toString('hex');
			});
			res.push('   script(s) witness: '+tmp.join(',')); //pubkey or redeem
		} else {
			tmp=inp.scriptSig.map(function(val) {
				return val.toString('hex');
			});
			inp.type=(tmp.length>1)?'p2sh':'p2pkh';
			res.push('   type: '+inp.type);
			res.push('   scriptSigLen: '+decodevarlen(inp.scriptSigLen)[0]);
			res.push('   scriptSig: '+tmp.join(','));
			res.push('   script: '+Buffer.concat(inp.script).toString('hex'));
		};
		if (inp.type==='p2pkh') {
			res.push('   address '+btc_encode(hash_160(inp.script[0]),p2pk));
		} else if ((inp.type.indexOf('p2wpkh')!==-1)||(inp.type.indexOf('p2wsh')!==-1)) {
			if (inp.type.indexOf('p2wpkh')!==-1) {
				tmp=hash_160(inp.script[0]);
				res.push('   hash '+tmp.toString('hex'));
				res.push('   address pubkey '+btc_encode(tmp,p2pk));
				if (inp.type!=='p2wpkh2') {
					res.push('   address segwit '+btc_encode(hash_160(inp.witness_script),p2sh));
				} else {
					res.push('   address segwit '+encode_bech32('bc',0,tmp)+' - '+btc_encode(hash_160(Buffer.concat([new Buffer([SEGWIT_VERSION]),new Buffer([tmp.length]),tmp])),p2sh));
				};
			} else {
				try {
					tmp=decode_redeem(Buffer.concat(inp.script).toString('hex'),true);
					tmp=tmp.map(function(key) {
						return btc_encode(hash_160(key),p2pk)
					});
					res.push('   multisig addresses '+tmp.join(','));
				} catch(ee) {};
				tmp=crypto.createHash('sha256').update(inp.script[0]).digest();
				res.push('   hash '+tmp.toString('hex'));
				if (inp.type!=='p2wsh2') {
					res.push('   address segwit '+btc_encode(hash_160(inp.witness_script),p2sh));
				} else {
					res.push('   address segwit '+encode_bech32('bc',0,tmp));
				};
			};
		} else if (inp.type==='p2sh') {
			try {
				tmp=decode_redeem(Buffer.concat(inp.script).toString('hex'),true);
				tmp=tmp.map(function(key) {
					return btc_encode(hash_160(key),p2pk)
				});
				res.push('   multisig addresses '+tmp.join(','));
				res.push('   address '+btc_encode(hash_160(inp.script[0]),p2sh));
			} catch(ee) {};
		};
		res.push('   nSequence: '+inp.nSequence.toString('hex'));
	});
	res.push('nb output: '+tx.nboutput);
	tx.output.forEach(function(out) {
		res.push('   -------');
		res.push('   nValue: '+out.nValue);
		res.push('   scriptPubkeyLen: '+decodevarlen(out.scriptPubkeyLen)[0]);
		res.push('   scriptPubkey: '+out.scriptPubkey.toString('hex'));
		res.push('   address: '+out.address);
		res.push('   type: '+out.type);
	});
	res.push('nLockTime '+tx.nLockTime.toString('hex'));
	if (!window) {
		res.forEach(function(txt) {
			console.log(txt);
		});
	};
	return res;
};

var BufftoArr=function(buf) {//Not used, keep for browserification if needed
	var arr=[];
	arr.push.apply(arr,buf);
	return arr;
};

var get_index=function(arr) {
	var index;
	var i=0;
	while(arr[i]===1) {
		i++;
	};
	arr[i]=1;
	return (i>arr.length?false:i);
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

var PRFx=function(x,t) {
	var buf=new Buffer('00000000000000000000000000000000000000000000000000000000000000','hex');
	x[0]|=0xc0; //1100
	buf=Buffer.concat([x,new Buffer([t]),buf]);
	return SHA256Compress(buf);
};

var FormatPrivate=function(buf) {
	buf[0] &=0xf8;
	buf[31] &=0x7f;
	buf[31] |=0x40;
	return buf;
};

var privateKeyderive=function(privateKey,IL) {
	var bn=new BN(IL);
	var n=ecparams.n;
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

var publicKeyderive=function() {};

var getKeyfromExtended=function(extended) { //extended string
	var buf=btc_decode(extended);
	return {chainCode:buf.slice(13,45),key:buf.slice(46,78)};
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

var btc_decode=function(bs,version) { //bs string
	var buf=new Buffer(bs58.decode(bs),'hex');
	if (version) {
		buf=buf.slice(version.length);
	};
	return buf.slice(0,buf.length-4);
};

var is_bech=function(add) {
	return (add.substr(0,2)==='bc')?true:false;
};

var convert=function(key,inversion,outversion) {
	var p2pkh=btc_decode(key,inversion);
	var outaddress=btc_encode(p2pkh,outversion);
	console.log('Address '+key+' converted to '+outaddress);
	return outaddress;
};

var convert_=function(add) {
	/* remove bech32 conversion for full segwit
	if  (add.substr(0,2)==='bc') { //bech32
		var prog=new Buffer(decode_bech32('bc',add).program);
		if (prog) {
			prog=Buffer.concat([new Buffer([SEGWIT_VERSION]),new Buffer([prog.length]),prog]);
			add=btc_encode(hash_160(prog),new Buffer('05','hex'));
		};
	};
	*/
	//convert address if BTC addresses used
	if ((add.substr(0,1)==='1')&&(p2pk[0]!==0)) {
		add=convert(add,new Buffer('00','hex'),p2pk);
	};
	if ((add.substr(0,1)==='3')&&(p2pk[0]!==0)) {
		add=convert(add,new Buffer('05','hex'),p2sh);
	};
	return add;
};

var bech_convert=function(bech) {
	bech=bech.split(':')[1]||bech;
	if (BECH32.indexOf(bech.substr(0,1))!==-1) { //if BCH bech address
		console.log('Bech32 address '+bech);
		bech=decode_b(bech); //{hash:'76a04053bda0a88bda5177b86a15c3b29f559873',type:'p2pkh'}
		bech=btc_encode(new Buffer(bech.hash,'hex'),(bech.type==='p2sh')?p2sh:p2pk);
		console.log('Transformed in '+bech);
	} else {
		bech=convert_(bech);
	};
	return bech;
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

var getAddressfromPrivate=function(privateKey,version) { //privateKey buffer
	if (privateKey.length>32) {
		privateKey=privateKey.slice(0,32); //remove 01 indicating the use of compressed public keys
	};
	var publicKey=new Buffer(ec.keyFromPrivate(privateKey).getPublic(true,'arr'),'hex');
	return (btc_encode(hash_160(publicKey),version));
};

var getpubKeyfromPrivate=function(privateKey) {
	if (privateKey.length>32) {
		privateKey=privateKey.slice(0,32); //remove 01 indicating the use of compressed public keys
	};
	return new Buffer(ec.keyFromPrivate(privateKey).getPublic(true,'arr'),'hex');
};

var getpubkeyfromSignature=function(message,signature) {
	var boo=[];
	message=double_hash256(message);
	for (var k=0;k<4;k++) {
		try {
			var pub=ec.recoverPubKey(message,signature,k);
			var key=ec.keyFromPublic(pub,'hex');
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

var serialize=function(hd,version) {
	//version(4) depth(1) fingerprint(4) index(4) chain(32) key(33) - 78 bytes
	var buffer=new Buffer(13);
	var key;
	if (version==='private') {
		version=BITCOIN_VERSIONS.private;
		key=Buffer.concat([new Buffer([0]),hd.privateKey]);
	} else {
		version=BITCOIN_VERSIONS.public;
		key=hd.publicKey;
	};
	buffer.writeUInt32BE(version,0);
	buffer.writeUInt8(hd.depth,4);
	var fingerprint = hd.depth?hd.parentFingerprint:0x00000000;
	buffer.writeUInt32BE(fingerprint,5);
	buffer.writeUInt32BE(hd.index,9);
	buffer=Buffer.concat([buffer,hd.chainCode]);
	buffer=Buffer.concat([buffer,key]);
	return buffer;
};

var convert_p=function(privateWIF,inversion,outversion) { //private key WIF string format in wallet.dat
	var privateKey=btc_decode(privateWIF,new Buffer('80','hex'));
	var inaddress=getAddressfromPrivate(privateKey,inversion);
	var outaddress=getAddressfromPrivate(privateKey,outversion);
	console.log('BTC address '+inaddress+' converted to '+outaddress);
};

var deriveChild=function(index,version,not_hard) {
	//var isHardened=index>=HARDENED_OFFSET;
	var hd={};
	//var isHardened=true;
	var isHardened=!not_hard;
	var indexBuffer=new Buffer(4);
	indexBuffer.writeUInt32BE((isHardened?(index+HARDENED_OFFSET):index),0);
	var data;
	if (isHardened) {
		// 0x00 priv (32B)  index (4B);
		data=Buffer.concat([new Buffer([0]),this.privateKey,indexBuffer]);
	} else {
		if (!this.publicKey) {
			this.publicKey=new Buffer(ec.keyFromPrivate(this.privateKey).getPublic(true,'arr'),'hex');
		};
		data=Buffer.concat([this.publicKey,indexBuffer]);
	};
	var I=crypto.createHmac('sha512',this.chainCode).update(data).digest();
	var IL=I.slice(0,32);
	var IR=I.slice(32);
	if (this.privateKey) {
		try {
			hd.privateKey=privateKeyderive(this.privateKey,IL);
			hd.publicKey=new Buffer(ec.keyFromPrivate(hd.privateKey).getPublic(true,'arr'),'hex');
			hd.publicKeyl=new Buffer(ec.keyFromPrivate(hd.privateKey).getPublic('arr'),'hex');
			hd.address=btc_encode(hash_160(hd.publicKey),(version||this.version)); //default is supposed to be compressed keys
		} catch (err) {
			return;
		};
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
	hd.index=index+HARDENED_OFFSET;
	hd.version=version||this.version;
	//hd.deriveChild=()=>{deriveChild};
	hd.deriveChild=deriveChild.bind(hd);
	//display(hd,version); //uncomment to display the details
	return hd;
};

var generate_keys_bip32=function(str,version) {
	var pub,compact,priv,hmac;
	var hd={};
	hmac=crypto.createHmac('sha512',MASTER_SECRET).update(str).digest();
	hd.seed=str;
	hd.privateKey=hmac.slice(0,32);
	hd.chainCode=hmac.slice(32);
	hd.publicKeyl=new Buffer(ec.keyFromPrivate(hd.privateKey).getPublic('arr'),'hex'); //long 65 bytes
	hd.publicKey=new Buffer(ec.keyFromPrivate(hd.privateKey).getPublic(true,'arr'),'hex'); //compact 33 bytes
	hd.address=btc_encode(hash_160(hd.publicKey),version); //default is supposed to be compressed keys
	hd.fingerprint=hash_160(hd.publicKey).slice(0,4).readUInt32BE(0);
	hd.version=version;
	hd.index=0;
	hd.depth=0;
	//display(hd,version,true); //uncomment to display the details
	//hd.deriveChild=()=>{deriveChild};
	hd.deriveChild=deriveChild.bind(hd);
	return hd;
};

var decode_xprv=function(xprv,version) {
	//version(4) depth(1) fingerprint(4) index(4) chain(32) key(33) - 78 bytes
	var hd={};
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
	display=function() {};
	return hd;
};

var decode_redeem=function(script,boo) {
	var tmp;
	var arr=[];
	script=new Buffer(script,'hex');
	tmp=script.slice(1);//remove OP_2
	tmp=tmp.slice(0,tmp.length-1);//remove checkmultisig
	tmp=tmp.slice(0,tmp.length-1);//remove OP_2/OP_3
	pubKey=deserialize_scriptSig(tmp)[1];
	if (!boo) {
		pubKey.forEach(function(key) {
			arr.push('Public Key: '+btc_encode(hash_160(key),p2pk)+' equivalent to bitcoin address '+btc_encode(hash_160(key),new Buffer('00','hex')));
			console.log('Public Key: '+btc_encode(hash_160(key),p2pk)+' equivalent to bitcoin address '+btc_encode(hash_160(key),new Buffer('00','hex')));
		});
		console.log('To use the create command and to spend your multisig transaction you must find at least two private keys associated to those public keys');
		pubKey=arr;
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

var write=function(prevamount,amount,fees,s,refunded) {
	console.log('--- Previous amount is: '+big_satoshis(prevamount));
	console.log('--- Amount to spend is: '+big_satoshis(amount));
	console.log('--- Network fees are: '+big_satoshis(fees));
	if (refunded) {
		console.log('--- Refunded amount to spending address is: '+big_satoshis(refunded));
	};
};

var resp_xhr=function(res) {
	if (res_xhr) {
		var head={};
		head['Server']='Peersm';
		head['Date']=(new Date()).toUTCString();
		res_xhr.writeHead(200,head);
		res_xhr.end(JSON.stringify(res));
	} else {
		command_xhr=res;
	};
};

var clone_inputs=function(param,inputs,message) {
	if (param.length===1) {
		param=inputs.map(function() {return param[0]});
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
	var one,two;
	p2something=p2something.slice(0,2);
	one=p2something.slice(0,1).toString('hex');
	two=p2something.slice(1)[0];
	if (p2something.toString('hex')===OP_DUP+OP_HASH160) {
		//P2PKH
		return 'p2pkh';
	} else if (one===OP_HASH160) {
		//P2SH
		return 'p2sh';
	} else if (one===OP_RETURN) {
		//P2SH
		return 'op_return';
	} else if (parseInt(one)===SEGWIT_VERSION) {
		switch (two) {
			case 20: return 'p2wpkh2';
			case 32: return 'p2wsh2';
			default: return 'unknown';
		};
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

var op_push2=function(arr) {
	var res=[];
	arr.forEach(function(a) {
		res.push(Buffer.concat(op_push(a)));
	});
	return res;
};

var deserialize_scriptSig=function(buf) {
	var signatures=[];
	var dat=[];
	var tmp;
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
		if (!Array.isArray(sig)) { //signature double array but deserialize / serialize simple array
			sig=[sig];
		};
		signatures.push(Buffer.concat([new Buffer([sig[0].length]),sig[0],sig[1]||(new Buffer(0))]),sig[2]||(new Buffer(0))); //sig,pubkey,sw btcp
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

var add_script=function(data,privKey) {
	var l=data.length;
	var res=[];
	for (var i=l-1;i>=0;i--) {
		var buf=parse_op_push(data[i])[0];
		buf=hash_160(buf);
		res.push(Buffer.concat([new Buffer(OP_HASH160,'hex'),new Buffer([buf.length]),buf,new Buffer(OP_EQUALVERIFY,'hex')])); // OP_HASH_160 op_push_hash OP_EQUALVERIFY
	};
	var pub=new Buffer(ec.keyFromPrivate(privKey).getPublic(true,'arr'),'hex');
	res.push(Buffer.concat([new Buffer([pub.length]),pub,new Buffer(OP_CHECKSIGVERIFY,'hex')])); //pubkey OP_CHECKSIGVERIFY
	return Buffer.concat([Buffer.concat(res),P2SH_NON_STANDARD]);
};

var parse_op_push=function(buf) {
	var tmp,len,n;
	switch (buf[0]) {
		case OP_PUSHDATA2:n=3;len=buf.slice(1).readUInt16LE();buf=buf.slice(3);tmp=buf.slice(0,len);break;
		case OP_PUSHDATA1:n=2;len=buf[1];buf=buf.slice(2);tmp=buf.slice(0,len);break;
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
	if (type.indexOf('p2wsh')===-1) {
		check=hash_160(script).toString('hex');
	} else {
		check=crypto.createHash('sha256').update(script).digest();
		if (type==='p2wsh') {
			check=hash_160(Buffer.concat([new Buffer([SEGWIT_VERSION]),new Buffer([check.length]),check])).toString('hex');
		} else {
			check_=new Buffer(decode_bech32('bc',addr).program).toString('hex');
			check=check.toString('hex');
		};
	};
	if (!is_bech(addr)) {
		check_=btc_decode(addr,p2sh).toString('hex');
	};
	if (check!==check_) {
		throw ("Redeem script does not correspond to the address to be spent "+addr);
	};
 };
 
var getTx=function(hash,cb) {
	//blockchain.com removed, might be replaced later with our own blockchain explorer
};

var Tx=function(input,output,nLockTime) {
	this.input=[];
	this.output=[];
	this.fees=0;
	if (input) {
		var all=false;
		this.nLockTime=new Buffer(4);
		nLockTime=nLockTime||0;
		this.nLockTime.writeUInt32LE(nLockTime);
		this.nVersion=new Buffer(4);;
		this.nVersion.writeUInt32LE(VERSION);
		if ((VERSION_==='BCD')||(VERSION_==='BTT')) {
			this.preblockhash=reverse(FORK_STRING);
		};
		this.sigHash=new Buffer(4);
		this.sigHash.writeUInt32LE(SIGHASH_ALL);
		this.nbinput=input.length;
		this.nboutput=output.length;
		this.version=VERSION_;
		input.forEach(function(inp) {
			var data=inp[2];
			var script=inp[3];
			if (data&&script) {
				throw 'data and script are exclusive';
			};
			var privKey=format_privKey(inp[5]);
			var swbtcp=inp[6]?(new Buffer(inp[6],'hex')):null;
			var pubKey;
			if (script==='p2pkh') {
				if (privKey.length>1) {
					throw "can't have multiple signatures";
				};
				privKey=privKey[0];
				pubKey=getpubKeyfromPrivate(privKey);
				script=null;
			} else { //multisig
				pubKey=format_pubKey(privKey);
				script=(script==='p2sh')?multi_redeem(pubKey,OP_2):script;
				if (Array.isArray(inp[0])) {
					check_addr(script,inp[0][1],inp[0][3]);
				};
			};
			var tmp=data||script;
			if (tmp) {
				tmp=op_push(tmp); //add OP_PUSHDATA for redeem script
			};
			var ns=new Buffer(4);
			ns.writeUInt32BE(inp[4]||0xffffffff);
			this.input.push({hash:inp[0],n:inp[1],scriptSigLen:null,scriptSig:null,data:(data?tmp:null),script:(script?tmp:null),nSequence:ns,privKey:privKey,pubKey:pubKey,swbtcp:swbtcp});
			//console.log(this.input);
			//script redeem (with op_pushdata even for segwit) if multisig p2sh or p2wsh or p2wsh2, if not null
			//type p2pkh, p2sh, p2wpkh, p2wsh
			//pubkey [pubkey1, pubkey2,...]
		},this);
		output.forEach(function(out) {
			var address,scriptPubkey;
			var len=new Buffer(1);
			var addr=out[0];
			switch (out[2]) {
				case 'p2pkh':
					all=true;
					version=p2pk;
					address=btc_decode(addr,version);
					len.writeUInt8(address.length);
					scriptPubkey=Buffer.concat([new Buffer(OP_DUP+OP_HASH160,'hex'),len,address,new Buffer(OP_EQUALVERIFY+OP_CHECKSIG,'hex')]);
					//OP_DUP OP_HASH160 len address OP_EQUALVERIFY OP_CHECKSIG
					break;
				case 'p2pk': //not used
					all=true;
					version=p2pk;
					address=btc_decode(addr,version);
					len.writeUInt8(address.length);
					scriptPubkey=Buffer.concat([len,address,new Buffer(OP_CHECKSIG,'hex')]);
					//len address OP_CHECKSIG
					break;
				case 'p2w': //p2wsh2 or pw2wpkh2 - bech destination address
					var prog=new Buffer(decode_bech32('bc',addr).program);
					if (prog) {
						scriptPubkey=Buffer.concat([new Buffer([SEGWIT_VERSION]),new Buffer([prog.length]),prog]);
					}  else {
						throw 'Wrong bech32 address';
					};
					break;
				case 'p2sh':
					if (out[1]!==0) {
						all=true;
						version=p2sh;
						address=btc_decode(addr,version);
						len.writeUInt8(address.length);
						scriptPubkey=Buffer.concat([new Buffer(OP_HASH160,'hex'),len,address,new Buffer(OP_EQUAL,'hex')]);
						//OP_HASH160 len address OP_EQUAL
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
							//OP_RETURN + data
						} else {
							throw "Can't append more than 520 bytes of data to OP_RETURN";
						};
					};
					break;
				default: throw "unknown pay to method";
			};
			this.fees-=parseInt(out[1]*SATO);
			this.output.push({nValue:parseInt(out[1]*SATO),scriptPubkeyLen:varlen(scriptPubkey.length),scriptPubkey:scriptPubkey,address:addr,type:out[2]});
		},this);
		if (!all) {
			//sig_hash_all is always used except for a single output op_return
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
		//verify public spending address - can look strange, just to be sure...
		var check=getpubkeyfromSignature(double_hash256(scriptSig),inp.scriptSig.slice(0,inp.scriptSig.length-1),version);
		if (check.length) {
			check.forEach(function(val) {
				if (btc_encode(hash_160(check),version)===check_) {
					console.log('Public spending key verified: '+check);
				};
			});
		} else {
			console.log("------------ Spending public key could not be verified, you are probably trying to spend an output that you don't own");
		};
	};
	inp.scriptSig=[[Buffer.concat([new Buffer(this.sign(scriptSig,inp.privKey)),this.sigHash.slice(0,1)]),Buffer.concat([new Buffer([inp.pubKey.length]),inp.pubKey]),(inp.swbtcp?inp.swbtcp:(new Buffer(0)))]]; //add pubkey
	signatures=Buffer.concat(serialize_sig(inp.scriptSig)); //add OP_PUSHDATA/length
	data=inp.data?Buffer.concat(inp.data):(new Buffer(0));//pubkey with len
	inp.scriptSigLen=varlen(Buffer.concat([signatures,data]).length);
};

Tx.prototype.p2sh_sign=function(inp,scriptSig) {
	var version=p2sh;
	var signatures,dat;
	var script=inp.script||inp.data;
	var sigHash=this.sigHash.slice(0,1);
	if 	((inp.type.indexOf('p2w')!==-1)||(check_p2sh(inp.prevscriptPubkey,parse_op_push(script[0])[0],version))) { //skip the check for nested segwit p2wsh/p2wpkh, done later
		if (Array.isArray(inp.privKey)) {
			inp.scriptSig=[];
			inp.privKey.forEach(function(privKey) {
				inp.scriptSig.push([Buffer.concat([new Buffer(this.sign(scriptSig,privKey)),sigHash])]);
			},this);
		} else {
			inp.scriptSig=[Buffer.concat([new Buffer(this.sign(scriptSig,inp.privKey)),sigHash])];
		};
		signatures=Buffer.concat(serialize_sig(inp.scriptSig)); //add OP_0 and OP_PUSHDATA/length
		inp.data=inp.swbtcp?inp.swbtcp:(new Buffer(0));
		dat=Buffer.concat([inp.script[0],inp.data]);//redeem with length
		inp.scriptSigLen=varlen(Buffer.concat([signatures,dat]).length); //dat redeem
	} else {
		throw 'p2sh address and redeem script do not match';
	};
};

Tx.prototype.p2w_sign=function(inp,scriptSig) {
	var signatures;
	var sigHash=this.sigHash.slice(0,1);
	if (Array.isArray(inp.privKey)) {
		inp.scriptSig=[];
		inp.privKey.forEach(function(privKey) {
			inp.scriptSig.push([Buffer.concat([new Buffer(this.sign(scriptSig,privKey)),sigHash])]);
		},this);
		inp.type='p2wsh2';
	} else {
		inp.scriptSig=[[Buffer.concat([new Buffer(this.sign(scriptSig,inp.privKey)),sigHash]),Buffer.concat([new Buffer([inp.pubKey.length]),inp.pubKey])]];
		inp.type='p2wpkh2';
	};
	inp.scriptSigLen=varlen(0);
};

Tx.prototype.sighash_sign=function() {
	var queue_=[];
	this.input.forEach(function(inp,i) {
		var scriptSig;
		var p2something;
		var addr;
		var cb=function(data) {
			if (data) {
				var tx=new Tx();
				tx.deserialize(data);
				//console.log(tx);
				display_tx(tx);
				inp.prevscriptPubkey=tx.output[inp.n].scriptPubkey;
				inp.prevscriptPubkeyValue=tx.output[inp.n].nValue;
				this.fees+=tx.output[inp.n].nValue;
			};
			p2something=decode_script(inp.prevscriptPubkeySig||inp.prevscriptPubkey);
			scriptSig=this.serialize_for_hash(i);
			switch (p2something) {
				case 'op_return':throw "Can't spend an OP_RETURN output";
				case 'p2pkh':this.p2pk_sign(inp,scriptSig,i);break;
				case 'p2pk':this.p2pk_sign(inp,scriptSig);break;
				case 'p2sh':this.p2sh_sign(inp,scriptSig);break;
				case 'p2wpkh2':this.p2w_sign(inp,scriptSig);break;
				case 'p2wsh2':this.p2w_sign(inp,scriptSig);break;
				default: throw 'Unidentified pay to method';
			};
		};
		if (!Array.isArray(inp.hash)) {
			getTx(inp.hash,cb.bind(this));
		} else {
			addr=inp.hash[1];
			if (inp.hash.length===2) { //query explorer
				inp.hash=inp.hash[0];
				cb.call(this,addr);
			} else {
				var version,address;
				var type=inp.hash[3];
				if ((type!=='p2wpkh2')&&(type!=='p2wsh2')) {
					version=((type==='p2sh')||(type==='p2wsh')||(type==='p2wpkh'))?p2sh:p2pk;
					address=btc_decode(addr,version);
					var len=new Buffer(1);
					len.writeUInt8(address.length);
					inp.type=inp.hash[3];
					if (version===p2pk) {
						inp.prevscriptPubkey=Buffer.concat([new Buffer(OP_DUP+OP_HASH160,'hex'),len,address,new Buffer(OP_EQUALVERIFY+OP_CHECKSIG,'hex')]);
					} else {
						inp.prevscriptPubkey=Buffer.concat([new Buffer(OP_HASH160,'hex'),len,address,new Buffer(OP_EQUAL,'hex')]);
						if (type==='p2wpkh') {
							var pub=hash_160(inp.pubKey);
							inp.prevscriptPubkeySig=Buffer.concat([new Buffer(OP_DUP+OP_HASH160,'hex'),new Buffer([pub.length]),pub,new Buffer(OP_EQUALVERIFY+OP_CHECKSIG,'hex')]);
						} else {
							inp.redeem=parse_op_push(inp.script[0])[0]; //redeem without OP_PUSHDATA
						};
					};
				} else {
					var prog=new Buffer(decode_bech32('bc',addr).program);
					if (prog) {
						inp.prevscriptPubkey=Buffer.concat([new Buffer([SEGWIT_VERSION]),new Buffer([prog.length]),prog]);
						//inp.prevscriptPubkeySig=new Buffer([0]);
						if (prog.length===32) {
							inp.redeem=parse_op_push(inp.script[0])[0]; //redeem without OP_PUSHDATA
						};
					} else {
						throw 'Wrong bech32 address';
					};
				};
				inp.prevscriptPubkeyValue=decimals(inp.hash[2]*SATO);
				this.fees+=inp.prevscriptPubkeyValue;
				inp.hash=inp.hash[0];
				queue_.push(cb.bind(this));
			};
		};
	},this);
	while (queue_.length) {
		queue_.shift()();
	};
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

Tx.prototype.getmessage=function(signature,i) {
	var sigHash=new Buffer(4);
	sigHash.writeUInt32LE(signature[signature.length-1]);
	signature=signature.slice(0,signature.length-1);
	message=this.serialize_for_hash(i,sigHash);
	message=double_hash256(message);
	return message;
};

Tx.prototype.sighash_verify=function(prevscriptPubkey) { //prevscriptPubkey [[scriptPubkey,nValue]]
	this.input.forEach(function(inp,i) {
		var cb=function(data) {
			var message;
			inp.verified=1;
			inp.allowed_to_spend=1;
			if (!Array.isArray(data)) {
				var tx=new Tx();
				tx.deserialize(data);
				//console.log(tx);
				display_tx(tx);
				inp.prevscriptPubkey=tx.output[inp.n].scriptPubkey;
			} else {
				inp.prevscriptPubkey=prevscriptPubkey[i][0];
				inp.prevscriptPubkeyValue=prevscriptPubkey[i][1];
			};
			var signature=inp.scriptSig; //[sig] or [sig1,sig2,sig3]
			var p2something=decode_script(inp.prevscriptPubkey);
			if (inp.witness_script) {
				if (inp.witness_script.length===1) {
					delete inp.witness_script;
				};
			};
			p2something=(inp.witness_script)?(is_segwit(inp.witness_script)):p2something;
			if ((p2something==='p2pkh')||(p2something==='p2pk')||(p2something==='p2wpkh')||(p2something==='p2wpkh2')) {
				signature=signature[0];
				if (p2something==='p2wpkh') {
					var pub__=inp.witness_script.slice(2); //witness script
					//correct remove
					inp.prevscriptPubkeySig=Buffer.concat([new Buffer(OP_DUP+OP_HASH160,'hex'),new Buffer([pub__.length]),pub__,new Buffer(OP_EQUALVERIFY+OP_CHECKSIG,'hex')]);
				};
				message=this.getmessage(signature,i);
				signature=signature.slice(0,signature.length-1); //remove sighash
				for (var k=0;k<4;k++) {
					try {
						var check_;
						var pub=ec.recoverPubKey(message,signature,k);
						var key=ec.keyFromPublic(pub,'hex');
						pub=new Buffer(key.getPublic(true,'arr'),'hex'); //get compact format 02+x or 03+x
						var check=hash_160(pub).toString('hex');
						if (key.verify(message,signature)) {
							inp.verified=true;
						};
						switch (p2something) {
							case 'p2pkh': check_=inp.prevscriptPubkey.slice(3,23).toString('hex');if (check===check_) {inp.allowed_to_spend=true;};break;
							case 'p2pk': check_=inp.prevscriptPubkey.slice(1,34).toString('hex');if (pub.toString('hex')===check_) {inp.allowed_to_spend=true;};break;
							case 'p2wpkh': if ((check===pub__.toString('hex'))&&(hash_160(inp.witness_script).toString('hex')===inp.prevscriptPubkey.slice(2,inp.prevscriptPubkey.length-1).toString('hex'))) {inp.allowed_to_spend=true;};break;
							case 'p2wpkh2': check_=inp.prevscriptPubkey.slice(2).toString('hex');if (check===check_) {inp.allowed_to_spend=true;};break;
						};
					} catch(ee) {};
				};
				if (check_) {
					//console.log('Pub key '+check_);
				};
				if (inp.allowed_to_spend===true) {
					//console.log('--------------- input '+i+' '+inp.hash+' verified');
				} else {
					//console.log('--------------- input '+i+' '+inp.hash+' bad');
				};
			} else if ((p2something==='p2sh')||(p2something==='p2wsh')||(p2something==='p2wsh2')) {
				//multisig only
				var twoof=2;
				var pubKey;
				var pr=0;
				var tmp;
				var script_;
				if (inp.script.length>1) {
					inp.script.pop(); //remove data btcp sw
				};
				inp.script.forEach(function(script) {
					inp.redeem=script; //correct ??
					script_=((p2something==='p2sh')||(p2something==='p2wsh2'))?script:inp.witness_script;
					tmp=script.slice(1);//remove OP_2
					tmp=tmp.slice(0,tmp.length-1);//remove checkmultisig
					tmp=tmp.slice(0,tmp.length-1);//remove OP_2/OP_3
					pubKey=deserialize_scriptSig(tmp)[1];
					signature.forEach(function(sig) {
						message=this.getmessage(sig,i);
						sig=sig.slice(0,sig.length-1); //remove sighash
						pubKey.forEach(function(pub) {
							var key=ec.keyFromPublic(pub,'hex');
							if (key.verify(message,sig)) {
								pr++;
							};
						});
					},this);
					if (pr>=twoof) { //modify for m of n
						inp.verified=true;
						console.log('Multisig signatures verified');
					};
					if (p2something!=='p2wsh2') {
						if (check_p2sh(inp.prevscriptPubkey,script_,p2sh)) {
							inp.allowed_to_spend=true;
							console.log('Multisig allowed to spend');
						};
					} else {
						tmp=crypto.createHash('sha256').update(script_).digest();
						tmp=Buffer.concat([new Buffer([SEGWIT_VERSION]),new Buffer([tmp.length]),tmp]);
						if (tmp.toString('hex')===inp.prevscriptPubkey.toString('hex')) {
							inp.allowed_to_spend=true;
							console.log('Multisig allowed to spend');
						};
					};
				},this);
				if (inp.verified&&inp.allowed_to_spend) {
					//console.log('--------------- input '+i+' verified');
				};
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
						console.log(boo?'----- Transaction verified':'********* - Bad transaction');
						if (!boo) {
							command_xhr={error:'Bad transaction - check your keys and parameters'};
						};
						this.finalize(this.data); //double verify again, here the transaction hash
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
			var scriptSigLen=varlen(sLen[0]);
			var scriptSig=deserialize_scriptSig(data.slice(off,off+sLen[0])); //[[signatures],[redeem script or pubkey]] without OP_PUSHDATA/length
			this.input.push({hash:reverse(data.slice(0,32)).toString('hex'),n:parseInt(reverse(data.slice(32,36)).toString('hex'),16),scriptSigLen:scriptSigLen,scriptSig:scriptSig[0],script:scriptSig[1],nSequence:reverse(data.slice(off+sLen[0],off+sLen[0]+4))});
			//type undefined
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
				case 'p2wpkh2': address=encode_bech32('bc',0,scriptPubkey.slice(2,22))+' - '+btc_encode(hash_160(scriptPubkey.slice(2,22)),p2sh);break;
				case 'p2wsh2': address=encode_bech32('bc',0,scriptPubkey.slice(2,34))+' - '+btc_encode(hash_160(scriptPubkey.slice(2,34)),p2sh);break;
				case 'p2pk': address=btc_encode(hash_160(scriptPubkey.slice(1,34)),p2pk);break;
			};
			this.output.push({nValue:nValue,scriptPubkeyLen:data.slice(0,scriptPubkeyLen[1]),scriptPubkey:scriptPubkey,address:address,type:p2something});
			data=data.slice(scriptPubkeyLen[1]+scriptPubkeyLen[0]);
		};
		this.nLockTime=data;
	} else { //segwit
		var c=[];
		var nb_w;
		var w;
		var tmp;
		var j=0;
		var script=[];
		var signatures=[];
		SEGWIT=true;
		data=data.slice(1); //skip flag
		tmp=decodevarlen(data);
		this.nbinput=tmp[0];
		hash_.push(data.slice(0,tmp[1]));
		data=data.slice(tmp[1]);
		for (var i=0;i<this.nbinput;i++) {
			var sLen=decodevarlen(data.slice(36));
			var off=36+sLen[1];
			var scriptSigLen=varlen(sLen[0]);
			var scriptSigLen_w=data.slice(36,off);
			var scriptSig=deserialize_scriptSig(data.slice(off,off+sLen[0])); ////[[signatures],[script or pubkey]] or [[],[witness_script nested]] [[], null] (segwit not nested)
			if (scriptSig[0].length) { //non segwit input
				c.push(i);
				this.input.push({hash:reverse(data.slice(0,32)).toString('hex'),n:parseInt(reverse(data.slice(32,36)).toString('hex'),16),scriptSigLen:scriptSigLen,scriptSigLen_w:scriptSigLen_w,scriptSig:scriptSig[0],script:scriptSig[1],script_w:[op_push(scriptSig[1][0])[0]],nSequence:reverse(data.slice(off+sLen[0],off+sLen[0]+4))});
			} else {
				this.input.push({hash:reverse(data.slice(0,32)).toString('hex'),n:parseInt(reverse(data.slice(32,36)).toString('hex'),16),witness_script:(scriptSig[1]?scriptSig[1][0]:(new Buffer([0]))),type:(scriptSig[1]?is_segwit(scriptSig[1][0]):'p2w'),nSequence:reverse(data.slice(off+sLen[0],off+sLen[0]+4))});
				//type p2wpkh,p2wsh,p2w
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
				case 'p2wpkh2': address=encode_bech32('bc',0,scriptPubkey.slice(2,22))+' - '+btc_encode(scriptPubkey.slice(2,22),p2sh);break;
				case 'p2wsh2': address=encode_bech32('bc',0,scriptPubkey.slice(2,34))+' - '+btc_encode(scriptPubkey.slice(2,34),p2sh);break;
				case 'p2pk': address=btc_encode(hash_160(scriptPubkey.slice(1,34)),p2pk);break;
			};
			this.output.push({nValue:nValue,scriptPubkeyLen:data.slice(0,scriptPubkeyLen[1]),scriptPubkey:scriptPubkey,address:address,type:p2something});
			hash_.push(data.slice(0,scriptPubkeyLen[1]+scriptPubkeyLen[0]));
			data=data.slice(scriptPubkeyLen[1]+scriptPubkeyLen[0]);
		};
		while (data.length!==4) {
				nb_w=data[0];
				this.input[j].nb_w=nb_w;
				data=data.slice(1);
			if (nb_w) {
				if (data[0]===0) { //remove OP_0
					data=data.slice(1);
					nb_w--;
				};
				for (var i=0;i<nb_w;i++) {
					//console.log(data.toString('hex'));
					if (data[0]!==0) { //OP_0 without length
						tmp=decodevarlen(data);
						data=data.slice(tmp[1]);
						w=data.slice(0,tmp[0]);
						if (issig(w)) {
							signatures.push(w);
						} else {
							script.push(w); //script or pubkey
						};
						data=data.slice(tmp[0]);
					} else {
						w=new Buffer([0]);
						script.push(w);
						data=data.slice(1);
					};
					//console.log('---------'+w.toString('hex'));
				};
				if (signatures.length||script.length) {
					this.input[j].scriptSig=signatures;//[sig] or [sig1,sig2,sig3]
					this.input[j].script=script;//[pubkey] or [redeem]
					signatures=Buffer.concat(serialize_sig(signatures));
					//BTCP stuff
					script=op_push(script[0])[0];//op+len+script
					this.input[j].script_w=[script];
					this.input[j].scriptSigLen_w=varlen(Buffer.concat([signatures,script]).length);//buffer
					//end BTCP stuff
					signatures=[];
					script=[];
				};
			};
			j++;
		};
		hash_.push(data);
		this.nLockTime=data;
		this.hash_w=reverse(double_hash256(Buffer.concat(hash_)));
	};
};

Tx.prototype.serialize_for_hash=function(i,sigHash) {
	var result=[];
	var input_i=this.input[i];
	if (!sigHash) {
		sigHash=new Buffer(4);
		this.sigHash.copy(sigHash);
	};
	if ((!BIP143)&&(input_i.type?(input_i.type.indexOf('p2w')===-1):true)) { //non segwit
		console.log('Using standard signing');
		result.push(this.nVersion);
		if ((VERSION_==='BCD')||(VERSION_==='BTT')) {
			result.push(this.preblockhash);
		};
		result.push(new Buffer([this.nbinput]));
		this.input.forEach(function(inp,j) {
			var n=new Buffer(4);
			n.writeUInt32LE(inp.n);
			if (j!==i) {
				result.push(Buffer.concat([reverse(new Buffer(inp.hash,'hex')),n,new Buffer([0]),reverse(inp.nSequence)]));
			} else {
				result.push(Buffer.concat([reverse(new Buffer(inp.hash,'hex')),n,varlen(inp.prevscriptPubkey.length),inp.prevscriptPubkey,reverse(inp.nSequence)]));
			};
		});
		if (sigHash.readUInt32LE()===SIGHASH_ALL) {
			result.push(new Buffer([this.nboutput]));
			this.output.forEach(function(out) {
					result.push(Buffer.concat([reverse(new Buffer((toHex(out.nValue,8)),'hex')),out.scriptPubkeyLen,out.scriptPubkey]));
			},this);
		};
		if (sigHash.readUInt32LE()===SIGHASH_NONE) {
			result.push(new Buffer('00','hex'));
		};
		result.push(this.nLockTime);
		if (typeof FORKID_IN_USE!=='undefined') {
			var sigfork=sigHash.readUInt32LE();
			if (VERSION_!=="B2X") {
				sigfork|=FORKID_IN_USE<<8;
			} else {
				sigfork<<=1
			};
			sigHash.writeUInt32LE(sigfork);
		};
		result.push(sigHash);
		if ((VERSION_==='SBTC')||(VERSION_==='UBTC')||(VERSION_==='BTCP')||(VERSION_==='WBTC')||(VERSION_==='BICC')) {
			result.push(FORK_STRING);
		};
		//result.forEach(function(v) {console.log(v.toString('hex'))});
		return Buffer.concat(result);
	} else {
		console.log('Using BIP143 signing');
		var sigtmp=[];
		var n;
		result.push(this.nVersion);
		if ((VERSION_==='BCD')||(VERSION_==='BTT')) {
			result.push(this.preblockhash);
		};
		this.input.forEach(function(inp) {
			n=new Buffer(4);
			n.writeUInt32LE(inp.n);
			sigtmp.push(Buffer.concat([reverse(new Buffer(inp.hash,'hex')),n]));
		});
		result.push(double_hash256(Buffer.concat(sigtmp)));
		sigtmp=[];
		this.input.forEach(function(inp) {
			sigtmp.push(reverse(inp.nSequence));
		});
		result.push(double_hash256(Buffer.concat(sigtmp)));
		n=new Buffer(4);
		n.writeUInt32LE(input_i.n);
		result.push(Buffer.concat([reverse(new Buffer(input_i.hash,'hex')),n]));
		if (!input_i.redeem) {
			if (!input_i.prevscriptPubkeySig) {
				result.push(Buffer.concat([varlen(input_i.prevscriptPubkey.length),input_i.prevscriptPubkey]));
			} else {
				result.push(Buffer.concat([varlen(input_i.prevscriptPubkeySig.length),input_i.prevscriptPubkeySig]));
			};
		} else {
			var scriptCode=input_i.redeem;
			result.push(Buffer.concat([varlen(scriptCode.length),scriptCode]));
		};
		n=reverse(new Buffer(toHex(input_i.prevscriptPubkeyValue,8),'hex'));
		result.push(n);
		result.push(reverse(input_i.nSequence));
		sigtmp=[];
		this.output.forEach(function(out) {
			sigtmp.push(Buffer.concat([reverse(new Buffer((toHex(out.nValue,8)),'hex')),out.scriptPubkeyLen,out.scriptPubkey]));
		},this);
		result.push(double_hash256(Buffer.concat(sigtmp)));
		result.push(this.nLockTime);
		if (typeof FORKID_IN_USE!=='undefined') {
			var sigfork=sigHash.readUInt32LE();
			if (VERSION_!=="B2X") {
				sigfork|=FORKID_IN_USE<<8;
			} else {
				sigfork<<=1
			};
			sigHash.writeUInt32LE(sigfork);
		};
		result.push(sigHash);
		if ((VERSION_==='SBTC')||(VERSION_==='UBTC')||(VERSION_==='BTCP')||(VERSION_==='WBTC')||(VERSION_==='BICC')) {
			result.push(FORK_STRING);
		};
		//console.log('----- Serialized result');
		//result.forEach(function(v) {console.log(v.toString('hex'))});
		return Buffer.concat(result);
	};
};

Tx.prototype.serialize=function(boo) {
	var result=[];
	var hash_=[];
	var signatures=[];
	result.push(this.nVersion);
	hash_.push(this.nVersion);
	if ((VERSION_==='BCD')||(VERSION_==='BTT')) {
		result.push(this.preblockhash);
		hash_.push(this.preblockhash);
	};
	if (!SEGWIT) {
		result.push(new Buffer([this.nbinput]));
		this.input.forEach(function(inp) {
			var n=new Buffer(4);
			n.writeUInt32LE(inp.n);
			signatures=serialize_sig(inp.scriptSig);//scriptSig [sig,pubkey] or [sig] only when coming from deserialize
			inp.script=inp.script_w||inp.script;//redeem (with length/OP_PUSHDATA except when coming from deserialize) - pubkey when coming from deserialize
			//add op_push when coming from deserialize
			if (boo) {
				inp.script=op_push2(inp.script); //add OP_PUSHDATA/length
			};
			inp.scriptSigLen=inp.scriptSigLen_w||inp.scriptSigLen;
			result.push(Buffer.concat([reverse(new Buffer(inp.hash,'hex')),n,inp.scriptSigLen,Buffer.concat(signatures),(inp.script?Buffer.concat(inp.script):(new Buffer(0))),(inp.data?inp.data:(new Buffer(0))),reverse(inp.nSequence)]));
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
		this.input.forEach(function(inp) {
			var nb_w=0;
			var n=new Buffer(4);
			var l;
			n.writeUInt32LE(inp.n);
			nb_w=count_w(inp.scriptSig); //[[sig,pubkey]] or [[sig1],[sig2],] from multisig, [sig1,sig2,] from deserialize (nb_w value derived later)
			signatures=serialize_sig(inp.scriptSig); //[signatures + pubkey] (sigs only when from deserialize)
			result.push(Buffer.concat([reverse(new Buffer(inp.hash,'hex')),n]));
			hash_.push(Buffer.concat([reverse(new Buffer(inp.hash,'hex')),n]));
			if ((typeof (inp.type)==='undefined')||inp.type.indexOf('p2w')===-1) { //Non segwit input
				//add op_push when coming from deserialize
				if (boo) {
					inp.script=op_push2(inp.script); //add OP_PUSHDATA/length
				};
				result.push(Buffer.concat([inp.scriptSigLen,Buffer.concat(signatures),(inp.script?Buffer.concat(inp.script):(new Buffer(0)))]));
				hash_.push(result[result.length-1]);
				w.push(new Buffer([0])); //push 00 in witness data for non segwit input
			} else {
				if ((inp.type==='p2wpkh2')||(inp.type==='p2wsh2')) {
					result.push(new Buffer([0]));
					hash_.push(result[result.length-1]);
					if (inp.type==='p2wsh2') {
						nb_w++;
					};
				} else if (inp.redeem) {
					var r=crypto.createHash('sha256').update(inp.redeem).digest();
					l=r.length;
					result.push(Buffer.concat([new Buffer([l+3]),new Buffer([l+2]),new Buffer([SEGWIT_VERSION]),new Buffer([l]),r]));//232220020(hash redeem)
					hash_.push(result[result.length-1]);//232220020(hash redeem)
					nb_w++;
				} else if (inp.pubKey) {
					var pub=hash_160(inp.pubKey);
					l=pub.length;
					result.push(Buffer.concat([new Buffer([l+3]),new Buffer([l+2]),new Buffer([SEGWIT_VERSION]),new Buffer([l]),pub])); //17160014(hash pub)
					hash_.push(result[result.length-1]); //17160014(hash pub)
				} else if (inp.witness_script) { //00etc from deserialize
					l=inp.witness_script.length;
					if (l>1) { //not OP_0 or OP_n - to check
						result.push(Buffer.concat([new Buffer([l+1]),new Buffer([l]),inp.witness_script]));
					} else {
						result.push(inp.witness_script);
					};
					hash_.push(result[result.length-1]);
					nb_w=inp.nb_w;
				};
				if (!boo) { //not from deserialize
					w.push(new Buffer([nb_w]));
				} else {
					w.push(new Buffer([inp.nb_w]));
				};
					w.push(Buffer.concat(signatures)); //[signature + pubkey] or [signatures] (multisig and deserialize)
				if (boo) { //coming from deserialize
					inp.script.forEach(function(scr) {
						if (scr.length>1) { //not OP_0 or alike
							w.push(Buffer.concat([varlen(scr.length),scr])); //pubkey or redeem
						} else {
							w.push(scr);
						};
					});
				} else {
					if (inp.redeem) {
						w.push(Buffer.concat([varlen(inp.redeem.length),inp.redeem]));
					};
				};
			};
			result.push(reverse(inp.nSequence));
			hash_.push(result[result.length-1]);
			
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

Tx.prototype.sign=function(scriptSig,privKey) {
	scriptSig=double_hash256(scriptSig);
	console.log('Signing '+scriptSig.toString('hex'));
	var sign=ec.sign(scriptSig,privKey,'hex',{canonical:true});
	return sign.toDER();
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
	console.log('checksum hash '+double_hash256(tx).toString('hex'));
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
	//console.log(this.tx.toString('hex'));
	if (!boo) {
		var prevscriptPubkey=[];
		var fees_=this.fees;
		var length_=this.tx.length;
		var tx_b=tx.toString('hex');
		var tx_d;
		console.log('Transaction body:\n'+tx_b);
		console.log('Complete transaction:\n'+this.tx.toString('hex'));
		console.log('Size '+this.tx.length+' bytes');
		console.log('Network Fees: '+fees_+' - '+(fees_/length_).toFixed(2)+' satoshis/byte');
		try {
			command_xhr.push(tx.toString('hex'));
			command_xhr.push(this.tx.toString('hex'));
			command_xhr.push(this.hash.toString('hex'));
		} catch(ee) {};
		console.log('------------- Check - deserialize ');
		var tx_check=new Tx();
		tx_check.deserialize(tx);
		//delete tx_check.fees;
		try {
			command_xhr.push(display_tx(tx_check));
		} catch(ee) {};
		console.log('------------- End Check - deserialize ');
		console.log('------------- Check - verify ');
		this.input.forEach(function(inp) {
			prevscriptPubkey.push([inp.prevscriptPubkey,inp.prevscriptPubkeyValue]);
		});
		var tx_verify=new Tx();
		tx_verify.verify(tx,prevscriptPubkey);
		console.log('------------- End Check - verify ');
		var tx_check2=new Tx();
		tx_d=tx_check2.deserialize(tx_b);
		if (tx_b===tx_check2.serialize(true).toString('hex')) {
			console.log('------------- OK - serialize/deserialize ');
		} else {
			console.log('------------- NOK - serialize/deserialize ');
		};
		try {
			command_xhr.push(fees_);
		} catch(ee) {};
		if (fees_>FEES*length_) {
			console.log('---- WARNING !!!!!!!!!!!!!!! ----- Network fees look very high, probably you did not choose the correct amount, please make sure that amount+dev fees+network fees=prevamount');
		} else if (fees_<0) {
			console.log('---- WARNING !!!!!!!!!!!!!!! ----- Network fees are incorrect, probably you did not choose the correct amount, please make sure that amount+dev fees+network fees=prevamount');
		};
		resp_xhr(command_xhr);
	};
};

var decode_simple=function(message) { //message buf
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
					/*
					console.log('----------------------------------------------- Getting tx from mempool');
					var length=new Buffer(4);
					var l=new Buffer([1]);//nb entries
					var v=new Buffer(4);
					v.writeUInt32LE(1);//type of entry (tx)
					var hash=reverse(new Buffer('6d79064beb221b26730bc16671bfb48ee686a67dc438cfaf502c6e4e5d3a4a4a','hex')); //mempool
					var payload=Buffer.concat([l,v,hash]);
					length.writeUInt32LE(payload.length);
					var getdata=Buffer.concat([magic,TX_GETDATA,length,double_hash256(payload).slice(0,4),payload]);
					//console.log(getdata);
					client.write(Buffer.concat([verack,getdata]));
					*/
				};
				if (data) {
					console.log('------ Sending transaction to '+addr);
					var hs=new Buffer(data,'hex');
					client.write(Buffer.concat([verack,hs]));
					console.log('Sent '+hs.toString('hex')+' to '+addr);
					console.log('Sent verack + tx');
				};
			};
		});
		client.on('error',function(err) {console.log(err);console.log('Error with '+addr+':'+port)});
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
	if (amount) {
		refunded=prevamount-amount-fees;
		if (refunded<0) {
			throw '--- Your numbers are incorrect, please check them and try again';
		};
		write(prevamount,amount,fees,0,refunded);
	} else {
		amount=prevamount-fees;
		write(prevamount,amount,fees,0,refunded);
	};
	//console.log(!!big_satoshis(amount));
	return [amount,0,refunded];
};

var ninja=function(addrs,daddr) {
	var prevtx_=[];
	var prevaddr_=[];
	var prevamount_=[];
	var previndex_=[];
	var privkey_=[];
	var fees=0;
	var boo;
	var command;
	addrs.forEach(function(val) {
		if (val.forks) {
			val.forks.forEach(function(fork) {
				if (fork.ticker===VERSION_.toLowerCase()) {
					if (parseInt(fork.balance.expected)!==0) {
						fork.utxo.forEach(function(utxo) {
							prevaddr_.push(val.raddr);
							prevtx_.push(utxo.txid);
							prevamount_.push(big_satoshis(utxo.value));
							previndex_.push(utxo.txindex);
							boo=val.paddr;
							privkey_.push(val.paddr||('[priv key or (multisig priv1-priv2-redeem-2of2 or 2of3 or 2of4) of '+val.addr+']'));
						});
					};
				};
			});
		};
	});
	fees=big_satoshis(prevtx_.length*400);
	prevtx_=prevtx_.join('_');
	prevaddr_=prevaddr_.join('_');
	prevamount_=prevamount_.join('_');
	previndex_=previndex_.join('_');
	privkey_=privkey_.join('_');
	command='node tx.js '+VERSION_+' create prevtx='+prevtx_+' prevaddr='+prevaddr_+' prevamount='+prevamount_+' previndex='+previndex_+' privkey='+privkey_+' addr='+daddr+' fees='+fees;
	console.log('The command '+(boo?'':'to run')+' is:');
	console.log(command);
	if ((addrs.length===0)||(prevaddr_.length===0)) {
		if (!command_xhr.error) {
			command_xhr={error:'No result'};
		};
	};
	try {
		command_xhr.push(command);
	} catch(ee) {};
	if (boo) {
		try {
			create([prevtx_,prevaddr_,prevamount_,previndex_,privkey_,daddr,fees]);
		} catch(ee) {
			resp_xhr({error:ee.message||ee});
		};
	} else {
		resp_xhr(command_xhr);
	};
};

var get_utxo_btcp=function(arg,caddrs,paddrs,daddr) {
	var j=0;
	var data__=[];
	var send=function(k) {
		var options=options={
				port: 80,
				method: 'GET',
				host:'explorer.btcprivate.org',
				path:'/api/txs?address='+caddrs[k]+'&pageNum=0',
				headers: {'User-Agent':'Mozilla/5.0 (Windows NT 6.3; rv:60.0) Gecko/20100101 Firefox/60.0','Accept':'application/json, text/plain, */*','Referer':'http://explorer.btcprivate.org','Connection':'keep-alive'}
			};	
			var req=http.request(options,function(res) {
				var data_=new Buffer(0);
				res.on('data',function(d) {
					data_=Buffer.concat([data_,d]);
				});
				res.on('end',function() {
					if (data_) {
						var dat=JSON.parse(data_.toString('utf-8'));
						dat=dat.txs;
						dat=dat[dat.length-1];
						if (dat.vin[0].coinbase) {
							data__.push({addr:caddrs[k],raddr:((arg[k].split('-').length>1)?(caddrs[k]+'-segwit'):caddrs[k]),paddr:paddrs[k],forks:[{ticker:'btcp',balance:{expected:1},utxo:[{txid:dat.txid,txindex:0,value:decimals(dat.vout[0].value*SATO)}]}]});
						};
						j++;
						if (j<arg.length) {
							send(j);
						} else {
							//console.log(data__);
							ninja(data__,daddr);
						};
					} else {
						console.log('No results from explorer.btcprivate.org');
					};
				});
				req.on('error', function() {
					console.log('error querying explorer.btcprivate.org');
				});
			});
			req.on('error', function() {
				console.log('error2 querying explorer.btcprivate.org');
			});
			req.end();
		};
	send(j);
};

var createauto=function(args) {
	var p={};
	var addrs=[];
	var caddrs=[];
	var paddrs=[];
	var daddr;
	var arg=args[0].split('_');
	arg.forEach(function(addr,i) {
		var add;
		addrs.push(addr.split('-')[0]); //remove segwit
		add=addrs[i];
		caddrs.push(convert_(add));
	});
	if (args[1].length>50) {
		paddrs=args[1].split('_');
		daddr=convert_(args[2]);
	} else {
		daddr=convert_(args[1]);
	};
	if (paddrs.length) {
		if (addrs.length!==paddrs.length) {
			throw "Number of addresses and private keys is not equal";
		};
	};
	if (VERSION_==='BTCP') {
		get_utxo_btcp(arg,caddrs,paddrs,daddr);
	} else {
		console.log('querying findmycoins.ninja with '+addrs);
		p.addrs=addrs;
		p=JSON.stringify(p);
		var options={
			port: 80,
			method: 'POST',
			host:'www.findmycoins.ninja',
			path:'/q',
			headers: {'User-Agent':'Mozilla/5.0 (Windows NT 6.3; rv:60.0) Gecko/20100101 Firefox/60.0','Accept':'*/*','Referer':'http://www.findmycoins.ninja/','Content-Type':'application/json','X-Requested-With':'XMLHttpRequest','Content-Length':p.length,'Connection':'keep-alive'}
		};	
		var req=http.request(options,function(res) {
			var data_=new Buffer(0);
			res.on('data',function(d) {
				data_=Buffer.concat([data_,d]);
			});
			res.on('end',function() {
				if (data_) {
					data_=JSON.parse(data_.toString('utf-8'));
					data_=data_.addrs;
					if (data_.length) {
						data_.forEach(function(gaddr) {
							var j=addrs.indexOf(gaddr.addr);
							if (j===-1) {
								j=caddrs.indexOf(gaddr.addr)
							};
							if (j!==-1) {
								gaddr.raddr=arg[j]; //recover segwit info
								gaddr.paddr=paddrs[j];
							};
						});
					} else {
						command_xhr={error:'No results or no answer from findmycoins.ninja'};
					};
					ninja(data_,daddr);
				} else {
					console.log('No results from findmycoins.ninja, you might be using addresses that are involved in more than 50 transactions, please contact us at contact@peersm.com');
				};
			});
			req.on('error', function() {
				console.log('error querying findmycoins.ninja');
			});
		});
		req.on('error', function() {
			console.log('error2 querying findmycoins.ninja');
		});
		req.write(p);
		req.end();
	};
};

var create=function(args) {
	//console.log(args);
	var tx_=[];
	var prevamount=0;
	var fees=parseFloat(args[6]);
	var amount=parseFloat(args[7])||null;
	var dtype='p2pkh';
	var daddr=args[5];
	daddr=bech_convert(daddr)||daddr; //bech convert for BCH only
	console.log('Destination address '+daddr);
	if  (is_bech(daddr)) {
		dtype='p2w'; //not nested will become p2wpkh2 or p2wsh2 later
	} else if (!((NOP2SH.indexOf(daddr.substr(0,1))!==-1)||(NOP2SH2.indexOf(daddr.substr(0,2))!==-1))) {
		console.log("Warning !!!! You are sending the funds to a P2SH address, make sure that you control it, especially if it's a BIP141 segwit address");
		dtype='p2sh';
	};
	//console.log(args);
	var inputs=args[0].split('_');
	//console.log(inputs);
	var prevaddr_=clone_inputs(args[1].split('_'),inputs,'Number of prevaddr inconsistent with number of inputs');
	//console.log(prevaddr_);
	var prevamount_=clone_inputs(args[2].split('_'),inputs,'Number of prevamount inconsistent with number of inputs');
	//console.log(prevamount_);
	var previndex_=clone_inputs(args[3].split('_'),inputs,'Number of previndex inconsistent with number of inputs');
	//console.log(previndex_);
	var privkey_=clone_inputs(args[4].split('_'),inputs,'Number of privkeys inconsistent with number of inputs');
	//console.log(privkey_);
	prevaddr_.forEach(function(addr,j) {
		var bech;
		var a=addr.split('-')[0];
		var sw=addr.split('-')[1];
		SEGWIT=SEGWIT||sw;//prevaddr=prevaddr-segwit
		bech=bech_convert(a);
		if (bech) {
			prevaddr_[j]=bech;
			if (sw) {
				prevaddr_[j]+='-'+sw;
			};
		};
	});
	SEGWIT=!!SEGWIT;//true if one of the inputs is a segwit address then segwit serialization is used
	if (SEGWIT) {
		if (VERSION_!=='BTCP') {
			console.log('!!!!!!!!!! - Some prevaddr are corresponding to segwit addresses, creating a segwit transaction');
		} else {
			console.log('\r\n\r\n!!!!!!!!!! - Some prevaddr are corresponding to segwit addresses, Bitcoin Private partially supports segwit for now, creating a BTCP-like segwit transaction\r\n\r\n');
		};
	};
	prevamount_.forEach(function(val) {
		prevamount+=parseFloat(val);
	});
	var res=testamount([prevamount,fees,amount]);
	if (!res[0]) {
		console.log('Something is wrong with your numbers, please check them with the testamount command');
	} else {
		privkey_.forEach(function(privs,i) {
			var script='p2pkh';
			var prev=prevaddr_[i].split('-')[0];
			var sw=prevaddr_[i].split('-')[1];
			var bech=is_bech(prev);
			var type=sw?(bech?'p2wpkh2':'p2wpkh'):'p2pkh';
			var privs=privs.split('-');
			if (privs.length>1) {
				type=sw?(bech?'p2wsh2':'p2wsh'):'p2sh';
				if (((NOP2SH.indexOf(prev.substr(0,1))!==-1)||(NOP2SH2.indexOf(prev.substr(0,2))!==-1))&&(!bech)) {
					throw "prevaddr address is not a p2sh one, multisig can't be used";
				};
				var typed=privs[privs.length-1];
				var order;
				var tmp;
				var pub;
				var n=0;
				if ((typed===twoOFthree)||(typed===twoOFtwo)||(typed===twoOFfour)) {
					script=new Buffer(privs[privs.length-2],'hex');
					check_addr(script,prev,type);
					privs=privs.slice(0,privs.length-2);
					tmp=new Array(privs.length);
					order=decode_redeem(script,true);
					order.forEach(function(pubkey) {
						pubkey=pubkey.toString('hex');
						for (var i=0;i<privs.length;i++) {
							pub=getPublicfromPrivate(privs[i]);
							if (pub===pubkey) {
								tmp[n]=privs[i];
								n++;
								break;
							};
						};
					});
					if (tmp[0]) {
						privs=tmp;
					};
				} else {
					script='p2sh'; //if not 2ofx p2sh
				};
				if (sw&&(VERSION_==='BTCP')) {
					var saddr;
					var oprev=prev;
					prev=btc_encode(hash_160(script),p2sh);
					console.log('BTCP segwit output, changing '+oprev+' to pubkey address '+prev);
					saddr=crypto.createHash('sha256').update(script).digest();
					saddr=Buffer.concat([new Buffer([SEGWIT_VERSION]),new Buffer([saddr.length]),saddr]);
					saddr=Buffer.concat([new Buffer([saddr.length]),saddr]).toString('hex');
					console.log('Segwit redeem is '+saddr);
					if (btc_encode(hash_160(new Buffer(saddr.slice(2),'hex')),p2sh)!==oprev) {
						throw 'redeem script does not correspond to segwit address';
					};
					type='p2sh';
					SEGWIT=false;
				};
			} else {
				if ((!((NOP2SH.indexOf(prev.substr(0,1))!==-1)||(NOP2SH2.indexOf(prev.substr(0,2))!==-1)))&&(!SEGWIT)&&(!sw)) {
					throw "prevaddr is a p2sh address, redeem script should be specified";
				};
				if (sw&&(VERSION_==='BTCP')) {
					var saddr;
					var oprev=prev;
					prev=getPublicfromPrivate(privs[0]);
					prev=btc_encode(hash_160(new Buffer(prev,'hex')),p2pk);
					console.log('BTCP segwit output, changing '+oprev+' to pubkey address '+prev);
					saddr=btc_decode(prev,p2pk);
					saddr=Buffer.concat([new Buffer([SEGWIT_VERSION]),new Buffer([saddr.length]),saddr]);
					saddr=Buffer.concat([new Buffer([saddr.length]),saddr]).toString('hex');
					console.log('Segwit redeem is '+saddr);
					if (btc_encode(hash_160(new Buffer(saddr.slice(2),'hex')),p2sh)!==oprev) {
						throw 'redeem script does not correspond to segwit address';
					};
					type='p2pkh';
					SEGWIT=false;
				};
			};
			tx_.push([[inputs[i],prev,parseFloat(prevamount_[i]),type],parseInt(previndex_[i]),null,script,null,privs,saddr]);
			//script redeem (without op_pushdata) if multisig p2sh or p2wsh, if not null null
			//type p2pkh, p2sh, p2wpkh, p2wsh
			//pubkey [pubkey1, pubkey2,...]
		});
		amount=amount||big_satoshis(res[0]);
		if (!res[2]) {
			new Tx(tx_,[[daddr,amount,dtype]],null);
			//dtype p2pkh, p2sh (for segwit nested)
		} else {
			var rtype=tx_[0][0][3]; //type of refunded address
			if ((rtype==='p2wpkh')||(rtype==='p2wsh')) {
				rtype='p2sh';//refunded segwit address
			};
			if ((rtype==='p2wpkh2')||(rtype==='p2wsh2')) {
				rtype='p2w';//refunded segwit address
			};
			new Tx(tx_,[[daddr,amount,dtype],[tx_[0][0][1],big_satoshis(res[2]),rtype]],null); //refund to the first address
		};
	};
};

var create_wallet=function(secret,nb,path,version) {
//secret: buffer, string(hex), string xprv or hd
//warning: zcash implementation is a personnal one dated before zcash implemented bip32, we will not implement the official one since the zcash team did not deem necessary to mention this implementation, neither to mention us as previous work, the super_magic number refers to a suggestion from a team member as a kind of joke
	var time=new Date().toISOString();
	var tmp,txt,priv,seed,hd,s_,p,boo;
	var res=[];
	version=version||p2pk;
	nb=nb||DEFAULT_WALLET_NB;
	path=path||DEFAULT_PATH;
	boo=(typeof (secret.privateKey)!=='undefined');
	res.push(time);
	if (!boo) {
		if (!Buffer.isBuffer(secret)) {
			if (secret.indexOf('xprv')===-1) {
				secret=new Buffer(secret,'hex');
			};
		};
		if (Buffer.isBuffer(secret)) {
			hd=generate_keys_bip32(secret,version);
		} else {
			hd=decode_xprv(secret,version);
		};
	} else {
		hd=secret;
	};
	res.push(btc_encode(serialize(hd,'private'))); //xprv
	seed=(boo||(!Buffer.isBuffer(secret)))?null:(Buffer.concat([secret,new Buffer('01','hex')])); //assume all versions are using compressed keys
	res.push(seed);
	path=path.split('/');
	path.shift();//remove m
	p=path.length;
	for (var i=0;i<p;i++) {
		s_=path[i].split("'");
		if (s_.length!==2) {
			not_hardened=true;
		} else {
			not_hardened=false;
		};
		s_=parseInt(s_[0]);
		if ((!boo)&&(i!==p-1)) {
			hd=hd.deriveChild(s_,version,not_hardened);
		};
	};
	res.push(hd);
	path.pop();//remove last
	res.push(['m/'+path.join('/'),s_,not_hardened,nb]);
	for (var i=0;i<nb;i++) {
		tmp=hd.deriveChild(i+s_,version,not_hardened);
		priv=Buffer.concat([tmp.privateKey,new Buffer('01','hex')]); //assume all versions are using compressed keys
		res.push(priv);
	};
	if (VERSION_==='ZEC') {
		res.push('Zkeys');
		for (var i=0;i<nb;i++) {
			tmp=hd.deriveChild(i+s_,version,not_hardened);
			tmp.ask=reverse(FormatPrivate(PRFx(tmp.privateKey,1)));
			tmp.ask=new Buffer(ecdh.keyFromPrivate(tmp.ask).getPrivate('hex'),'hex');//spending key
			priv=new Buffer(tmp.ask.length);
			tmp.ask.copy(priv);
			tmp.apk=reverse(PRFx(priv,0)); //paying key
			tmp.sk_enc=reverse(FormatPrivate(PRFx(priv,1)));//viewing key
			tmp.pk_enc=ecdh.keyFromPrivate(tmp.sk_enc);
			tmp.pk_enc=new Buffer(tmp.pk_enc.getPublic(true,'arr'),'hex');//transmission key
			tmp.z=reverse(Buffer.concat([tmp.pk_enc,tmp.apk]));
			tmp.ask_a=btc_encode(tmp.ask,zcash_spending_key);
			tmp.z_address=btc_encode(tmp.z,zcash_z);
			//display_z(tmp);//uncomment to display details
			res.push([tmp.ask_a,tmp.z_address]);
		};
	};
	if (!window) {
		//res: time,xprv,seed,hd,[path,index,not_hardened],priv
		//zcash
		//[ask,zaddr];
		display_w(res,version,!boo);
	};
	return res;
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
					testamount(args);break;
				case 'convert':
					convert_(args[0]);break;
				case 'createauto':
					createauto(args);break;
				case 'create': 
					create(args);break;
				case 'decode': var tx=new Tx();tx.deserialize(args[0]);display_tx(tx);break;
				case 'testconnect': Send(null,args[0]);break;
				case 'send': Send(args[0],args[1]);break;
				case 'decoderedeem': decode_redeem(args[0]);break;
				case 'verify':
				//node tx.js BTC verify <tx> '<prevscriptpubKey>,<prevamount>'
					var arr=[];
					var tx=args.shift();
					args=args.map(function(arg) {
						arg=arg.split(',');
						arg[0]=new Buffer(arg[0],'hex');
						arg[1]=decimals(arg[1]*SATO);
						return arg;
					});
					new Tx().verify(tx,args);
					break;
				case 'createwallet': create_wallet.apply(null,args);break;
			};
		};
	};
};

//{addresses:input1.value}
//{decode_redeem:input0.value}
//{addresses:input2.value,privs:input3.value,destination:input4.value}

var xhr_=function(args,res_x) {
	var res=[];
	res_xhr=res_x;
	command_xhr=[];
	console.log=function() {};
	if (args.version) {
		version_(args.version);
		if (args.addresses) {
			if (!args.destination) {
				var addrs=args.addresses.split('_');
				addrs.forEach(function(addr) {
					try {
						res.push(convert_(addr));
					} catch(ee) {
						res.push('Wrong address');
					};
				});
			} else {
				try {
					if (!args.txs) {
						var arr=[args.addresses];
						if (args.privs) {
							arr.push(args.privs);
						};
						arr.push(args.destination);
						createauto(arr);
					} else {
						command_xhr.push('node tx.js '+VERSION_+' create '+'prevtx='+args.tx+' prevaddr='+args.addresses+' prevamount='+args.prevamount+' previndex='+args.previndex+' privkey='+args.privs+' addr='+args.destination+' fees='+args.fees+(args.amount?(' amount='+args.amount):''));
						create([args.txs,args.addresses,args.prevamount,args.previndex,args.privs,args.destination,args.fees,args.amount]);
					};
				} catch(ee) {
					resp_xhr({error:ee.message||ee});
				};
			};
		} else if (args.decode_redeem) {
			try {
				res=decode_redeem(args.decode_redeem);
			} catch(ee) {
				res.push('Wrong redeem script');
			};
		};
	};
	return res.length?res:command_xhr;
};

module.exports.version_=version_;
module.exports.create=create;
module.exports.xhr=xhr_;
module.exports.createwallet=create_wallet;

//notes for future browserification
//browserify tx.js --s internal  > browser.js
//end browser.js - add:
//var create=internal.create;
//var version_=internal.version_;
//var xhr=internal.xhr;
//var createwallet=internal.createwallet;
//delete window.internal; //delete global
//end map exports
//add wallet.html js
//save minify.js
//uglifyjs minify.js -c -m --comments -o minified.js
//add in wallet.html