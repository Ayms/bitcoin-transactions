const version=function(v) {
	let MASTER_SECRET=new Buffer('Bitcoin seed');
	let HARDENED_OFFSET=0x80000000;
	let BITCOIN_VERSIONS={private:0x0488ADE4,public:0x0488B21E};
	let DEFAULT_WALLET_NB=100;
	let DEFAULT_PATH="m/0'/0'/0'";
	let zcash_z=new Buffer('169a','hex');
	let zcash_spending_key=new Buffer('ab36','hex');
	let SUPER_MAGIC=0; //Bug #1893
	let SIGHASH_ALL=null;
	let SIGHASH_NONE=null;
	let SIGHASH_SINGLE=null;
	let SIGHASH_ANYONECANPAY=null;
	let T_O=2000;
	let TX_COMMAND=new Buffer('747800000000000000000000','hex');
	let TX_VERSION=new Buffer('76657273696F6E0000000000','hex');
	let TX_VERACK=new Buffer('76657261636B000000000000','hex');
	let TX_GETDATA=new Buffer('676574646174610000000000','hex');
	let ISSIG1=0x30;
	let ISSIG2=0x02;
	let OP_PUSHDATA1=0x4c;
	let OP_PUSHDATA2=0x4d;
	let OP_PUSH=512;
	let MAX_OP_PUSH=520;
	let OP_DUP='76';
	let OP_HASH160='a9';
	let OP_RETURN='6a';
	let OP_0='00';
	let OP_16='60';
	let OP_EQUAL='87';
	let OP_EQUALVERIFY='88';
	let OP_CHECKSIG='ac';
	let OP_CHECKSIGVERIFY='ad';
	let OP_CHECK_MULTISIG='ae';
	let OP_CODESEPARATORS='ab';
	let FEES=250;
	let SATO=100000000;
	let VERSION=2;
	let VERSION_='BTC';
	let PRIV=new Buffer('80','hex');
	let SIGHASH_FORKID=0x00000000;
	let FORK_STRING=null;
	let FORKID_IN_USE=null;
	let MAIN=0xD9B4BEF9;
	let BIP143=false;
	let p2pk=new Buffer('00','hex');
	let p2sh=new Buffer('05','hex');
	let prefix='Bitcoin Signed Message:\n';//for future signing implementation https://github.com/bitcoin/bitcoin/blob/master/src/validation.cpp
	let PORT=8333;
	let LASTBLOCK=500000;
	let PROTOCOL=70015;
	let D=8;
	let NOP2SH=['1'];
	let NOP2SH2=['t1'];
	let BECH32=[];
	let mOfn='mofn';
	let SEGWIT=false;
	let SEGWIT_VERSION=0;
	let SEG_MARKER=0;
	let SEG_FLAG=1;
	let command_xhr=[];
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
		DEFAULT_PATH="m/44'/156'/0'/0/0";
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
		DEFAULT_PATH="m/44'/999'/0'/0/0";
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
		DEFAULT_PATH="m/2'/156'/0'/0/0";
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
		DEFAULT_PATH="m/44'/8888'/0'/0/0";
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
		DEFAULT_PATH="m/44'/165'/0'/0/0";
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
		DEFAULT_PATH="m/44'/5'/0'/0/0";
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
		DEFAULT_PATH="m/44'/3'/0'/0/0";
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
		DEFAULT_PATH="m/44'/6666'/0'/0/0";
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
		DEFAULT_PATH="m/44'/183'/0'/0/0";
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
		DEFAULT_PATH="m/44'/1145'/0'/0/0";
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
		DEFAULT_PATH="m/44'/185'/0'/0/0";
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
		DEFAULT_PATH="m/44'/188'/0'/0/0";
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
		DEFAULT_PATH="m/44'/777'/0'/0/0";
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
		DEFAULT_PATH="m/44'/9888'/0'/0/0";
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
		DEFAULT_PATH="m/44'/1688'/0'/0/0";
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
		DEFAULT_PATH="m/44'/1000'/0'/0/0";
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
		DEFAULT_PATH="m/44'/7777'/0'/0/0";
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
		DEFAULT_PATH="m/44'/34952'/0'/0/0";
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
		DEFAULT_PATH="m/44'/8999'/0'/0/0";
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
		DEFAULT_PATH="m/44'/192'/0'/0/0";
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
		DEFAULT_PATH="m/44'/147'/0'/0/0";
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
		DEFAULT_PATH="m/44'/998'/0'/0/0";
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
		DEFAULT_PATH="m/44'/9999'/0'/0/0";
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
		DEFAULT_PATH="m/44'/1111'/0'/0/0";
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
		DEFAULT_PATH="m/44'/236'/0'/0/0";
	} else {
		throw "You forgot to mention the network version";
	};
	SIGHASH_ALL=0x00000001|SIGHASH_FORKID;
	SIGHASH_NONE=0x00000002|SIGHASH_FORKID;
	SIGHASH_SINGLE=0x00000003|SIGHASH_FORKID;
	SIGHASH_ANYONECANPAY=0x00000080|SIGHASH_FORKID;
	return {
		MASTER_SECRET,
		HARDENED_OFFSET,
		BITCOIN_VERSIONS,
		DEFAULT_WALLET_NB,
		DEFAULT_PATH,
		zcash_z,
		zcash_spending_key,
		SUPER_MAGIC,
		SIGHASH_ALL,
		SIGHASH_NONE,
		SIGHASH_SINGLE,
		SIGHASH_ANYONECANPAY,
		T_O,
		TX_COMMAND,
		TX_VERSION,
		TX_VERACK,
		TX_GETDATA,
		ISSIG1,
		ISSIG2,
		OP_PUSHDATA1,
		OP_PUSHDATA2,
		OP_PUSH,
		MAX_OP_PUSH,
		OP_DUP,
		OP_HASH160,
		OP_RETURN,
		OP_0,
		OP_16,
		OP_EQUAL,
		OP_EQUALVERIFY,
		OP_CHECKSIG,
		OP_CHECKSIGVERIFY,
		OP_CHECK_MULTISIG,
		OP_CODESEPARATORS,
		FEES,
		SATO,
		VERSION,
		VERSION_,
		PRIV,
		SIGHASH_FORKID,
		FORK_STRING,
		FORKID_IN_USE,
		MAIN,
		BIP143,
		p2pk,
		p2sh,
		prefix,
		PORT,
		LASTBLOCK,
		PROTOCOL,
		D,
		NOP2SH,
		NOP2SH2,
		BECH32,
		mOfn,
		SEGWIT,
		SEGWIT_VERSION,
		SEG_MARKER,
		SEG_FLAG,
		command_xhr
	};
};

module.exports=version;