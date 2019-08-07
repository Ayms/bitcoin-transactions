const {toHex2,toBin}=require('./utils.js');
const crypto=require('crypto');
const wordlist=require('../words/words.json');

const Mnemonic=function(language) {
	this.PBKDF2_ROUNDS=2048;
	this.words=wordlist[language];
	if (!this.words) {
		throw 'Invalid language';
	};
};

Mnemonic.prototype.toSeed=function(mnemonic,passphrase='') {
	mnemonic=mnemonic.normalize("NFKD");
	passphrase=passphrase.normalize("NFKD");
	passphrase="mnemonic"+passphrase;
	return crypto.pbkdf2Sync(mnemonic,passphrase,this.PBKDF2_ROUNDS,64,'sha512');
};

Mnemonic.prototype.check=function(mnemonic) { //mnemonic table
	let ent=mnemonic.length;
	let str='';
	let hash;
	let check='';
	if ((ent==0)||(ent%3)) {
		throw 'Number of words must be a multiple of 3';
	};
	ent=ent*11%32; //checksum length
	for (let i=0;i<mnemonic.length;i++) {
		let word=mnemonic[i];
		let wordIndex=this.words.indexOf(word);
		if (wordIndex==-1) {
			throw word+' not in word list';
		};
		str+=toBin(wordIndex,11);
	};
	check=str.slice(str.length-ent);
	str=toHex2(str.slice(0,str.length-ent));
	hash=crypto.createHash('sha256').update(new Buffer(str,'hex')).digest().toString('hex');
	hash=parseInt(hash.slice(0,2),16).toString(2);
	while (hash.length!==8) {
		hash='0'+hash;
	};
	hash=hash.slice(0,ent);
	return (hash===check);
};

module.exports=Mnemonic;