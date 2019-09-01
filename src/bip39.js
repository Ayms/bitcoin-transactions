const Mnemonic=require('./mnemonic.js');
const {decode_xprv,encode_xprv,create_wallet}=require('./hd.js');
const {compute_path,mod44_path}=require('./utils.js');
const crypto=require('crypto');

//unlike other tools the default path for bip32 and bip141 is the legacy bitcoin one m/0'/0'/0'
//and for BTC you must specify the bip44 path if you want to use it (bip44 contradicts the bitcoin core wallet so the default is bitcoin core wallet)
//test seed: evidence ripple can refuse organ original peasant camp bar train similar scatter prepare follow meadow
//{private:0x0488ADE4,public:0x0488B21E}
//BIP84 : {public: 0x04b24746,private: 0x04b2430c} //zprv bech
//BIP49 : {public: 0x049d7cb2,private: 0x049d7878} //yprv segwit nested
//BIP141 : yprv

const create_bip39=function(coin,language,secret,type='btc') { //type btc,nested,bech
	let res;
	let mn=new Mnemonic(language);
	let seed=mn.toSeed(secret); //seed buf
	res=[seed,encode_xprv(coin,seed,true,type),mn.check(secret.split(' '))];
	console.log('Seed: '+seed.toString('hex'));
	console.log('Root key: '+res[1]);
	console.log('Valid checksum: '+(res[2]?'Yes':'No'));
	return res;
};

const bip39_wallet=function(secret,coin,language,type='btc',nb=coin.DEFAULT_WALLET_NB,path=coin.LEGACY_PATH||coin.DEFAULT_PATH) {
	//secret: string of words, string xprv or hd
	let tmp;
	if (secret.split(' ').length>1) {
		secret=create_bip39(coin,language,secret,type);
		secret=secret[1];
	};
	if (path.indexOf('m')===-1) { //path integer
		tmp=parseInt(path);
		path=((type==='btc')||(type==='bip32'))?coin.LEGACY_PATH:coin.DEFAULT_PATH;
	};
	if ((path===coin.DEFAULT_PATH)||(path===coin.LEGACY_PATH)) {
		switch (type) {
			case 'bip44':path=coin.DEFAULT_PATH;break;
			case 'bip49':path=mod44_path(coin.DEFAULT_PATH,'bip49');break;
			case 'bip84':path=mod44_path(coin.DEFAULT_PATH,'bip84');break;
			case 'bip141':path=coin.GLEGACY_PATH;break;
		};
	};
	switch (type) {
		case 'bip49':type='nested';break;
		case 'bip84':type='bech';break;
		case 'bip141':type='nested';break;
	};
	if (tmp) {
		path=compute_path(path,tmp);
	};
	return create_wallet(secret,coin,nb,type,path);
};

const recoverbip39=function(coin,language,test,missing,boo) { //missing [m,n] m first missing word (starting with 1), n second missing word 
	let mn=new Mnemonic(language);
	let allwords=mn.words;
	let l=allwords.length;
	let m=missing.length;
	let res=[];
	test=test.split(' ');
	if (m>2) {
		throw "You can't recover more than two missing words";
	};
	missing.forEach(function(index) {
		test.splice(parseInt(index)-1,0,'test');
	});
	if (test.length%3) {
		throw "Total number of words must be a multiple of 3";
	};
	let check=function(words) {
		if (mn.check(words)) {
			if (!boo) {
				console.log(words.join(' '));
			};
			res.push(words.slice());
		};
	};
	let iterate=function(i) {
		test[parseInt(missing[0])-1]=allwords[i];
		if (m>1) {
			for (let j=0;j<l;j++) {
				test[parseInt(missing[1])-1]=allwords[j];
				check(test);
			};
		} else {
			check(test);
		};
		i++;
		if (i<l) {
			//setTimeout(function() {iterate(i)},1); //or workers for browser
			iterate(i);
		};
	};
	iterate(0);
	return res;
};

const generatebip39=function(coin,language,nb=coin.BIP39_nb) {
	let seed=[];
	let i=0;
	let res;
	let mn=new Mnemonic(language);
	let allwords=mn.words;
	while (seed.length<nb-1) {
		let tmp;
		tmp=allwords[parseInt(crypto.randomBytes(2).toString('hex'),16)%0x800];
		if (seed.indexOf(tmp)===-1) {
			seed[i]=tmp;
			i++;
		};
	};
	res=recoverbip39(coin,language,seed.join(' '),[seed.length+1],true);
	seed=res[parseInt(crypto.randomBytes(2).toString('hex'),16)%(res.length)];
	console.log(seed.join(' '));
	return seed.join(' ');
};

module.exports={create_bip39,bip39_wallet,recoverbip39,generatebip39};