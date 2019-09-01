const {redeem_addr,hash_160}=require('./addresses.js');
const {getPublicfromPrivate}=require('./keys.js');
const {encode_b}=require('../node_modules/cashaddress/cashaddress.js');

const encode_redeem=function(coin,m,keys,boo) {
	let res=[];
	let n=keys.length;
	let a=new Buffer(0);
	if (m>n) {
		throw "Number of keys required can't be superior to the total number of keys"
	};
	if (n>16) {
		throw "Can't have more than 16 keys in a multisig transaction";
	};
	keys.forEach(function(key) {
		if (boo) {
			key=new Buffer(key,'hex');
		} else {
			key=new Buffer(getPublicfromPrivate(key,coin),'hex');
		};
		a=Buffer.concat([a,new Buffer([key.length]),key]);
	});
	n=n.toString(16);
	m=m.toString(16);
	n=(n.length>1)?0x60:parseInt('5'+n,16);
	m=(m.length>1)?0x60:parseInt('5'+m,16);
	a=Buffer.concat([new Buffer([m]),a,new Buffer([n]),new Buffer(coin.OP_CHECK_MULTISIG,'hex')]);
	res.push(a);
	res.push(redeem_addr(coin,a,'p2sh'));
	res.push(redeem_addr(coin,a,'p2wsh'));
	res.push(redeem_addr(coin,a,'p2wsh2'));
	if (coin.bch) {
		res.push(encode_b(hash_160(a),'p2sh','bitcoincash'));
	};
	console.log('Redeem script: '+res[0].toString('hex'));
	console.log('Address: '+res[1]);
	console.log('Segwit (nested): '+res[2]);
	console.log('Segwit (bech32): '+res[3]);
	if (res[4]) {
		console.log('BCH bech: '+res[4]);
	};
	res=['Redeem script: '+res[0].toString('hex'),'Address: '+res[1],'Segwit (nested): '+res[2],'Segwit (bech32): '+res[3],res[4]?('BCH bech: '+res[4]):''];
	return res;
};

module.exports={encode_redeem};