//Hack for Buffer nodejs deprecation and backward compatibility with previous nodejs versions
var oBuffer=Buffer;

if (oBuffer.from) {
	Buffer=function() {
		if (typeof arguments[0]==='number') {
			return oBuffer.alloc(arguments[0]);
		} else {
			return oBuffer.from(...arguments);
		};
	};
	Object.keys(oBuffer).forEach(function(val) {
		Buffer[val]=oBuffer[val];
	});
	Object.setPrototypeOf(Buffer.prototype,oBuffer.prototype);
};

const version_=require('./src/btc_version.js');
const Send=require('./src/network.js');
const {create,Tx}=require('./src/create.js');
const {create_wallet}=require('./src/hd.js');
const {is_bech,resp_xhr,testamount,decimals}=require('./src/utils.js');
const {decode_redeem,convert2}=require('./src/addresses.js');
const {encode_redeem}=require('./src/redeem.js');
const {create_bip39,bip39_wallet,recoverbip39,generatebip39}=require('./src/bip39.js');
const {getpubfromprivate,getprivfromWIF,privtoWIF,pubtohash,pubtoaddress}=require('./src/pubpriv.js');
const {signmessage,verifymessage}=require('./src/keys.js');
let oconsole=console.log.bind(console);
let coin;

const start=function(args) {
	if (args.length) {
		if (typeof document==='undefined') {
			console.log(args);
		};
		try {
			coin=version_(args[0]);
			console.log('Version '+coin.VERSION_);
			if (args.length>1) {
				let command=args[1];
				args=args.slice(2);
				switch (command) {
					case 'testamount':
						return testamount(args,coin);
					case 'convert':
						return convert2(args[1],coin,version_(args[0]));
					case 'create':
						return create(args,coin);
					case 'decode': var tx=new Tx(coin);tx.deserialize(args[0]);return tx.display_tx();
					case 'testconnect': return Send(coin,null,args[0]);
					case 'send': return Send(coin,args[0],args[1]);
					case 'decoderedeem': return decode_redeem(coin,args[0]);
					case 'createredeem': return encode_redeem(coin,args.shift(),args[0].split('-'));
					case 'createredeemfrompub': return encode_redeem(coin,args.shift(),args[0].split('-'),true);
					case 'verify':
						let arr=[];
						let tx_;
						var tx=args.shift();
						args=args.map(function(arg) {
							arg=arg.split(',');
							arg[0]=new Buffer(arg[0],'hex');
							arg[1]=decimals(arg[1]*coin.SATO);
							return arg;
						});
						tx_=new Tx(coin);
						tx_.verify(tx,args);
						return tx_.res;
					case 'createwallet': args.splice(1,0,coin);return create_wallet(...args);
					case 'bip39':
						let type='btc';
						if (args[2]) {
							switch (args[2]) {
								case 'bip44':type='bip44';break;
								case 'bip49':type='nested';break;
								case 'bip84':type='bech';break;
								case 'bip141':type='nested';break;
							};
						};
						return create_bip39(coin,args[0],args[1],type);
					case 'createbip39wallet': args.splice(1,0,coin);return bip39_wallet(...args);
					case 'recoverbip39':
						let language=args[0];
						let test=args[1];
						args.shift();
						args.shift();
						return recoverbip39(coin,language,test,args);
					case 'generatebip39':
						args.unshift(coin);
						return generatebip39(...args);
					case 'getpubfromprivate':
						args.unshift(coin);
						return getpubfromprivate(...args);
					case 'getprivfromwif':
						args.unshift(coin);
						return getprivfromWIF(...args);
					case 'privtowif':
						args.unshift(coin);
						return privtoWIF(...args);
					case 'pubtohash':
						args.unshift(coin);
						return pubtohash(...args);
					case 'pubtoaddress':
						args.unshift(coin);
						return pubtoaddress(...args);
					case 'signmessage':
						args.unshift(coin);
						return signmessage(...args);
					case 'verifymessage':
						args.unshift(coin);
						return verifymessage(...args);
					case 'checkbip39':
						args.unshift(coin);
						return create_bip39(...args);
				};
			};
		} catch(ee) {
			return {error:ee.message||ee}; //if result is not array => error
		};
	};
};

if (process!==undefined) {
	if (process.argv) {
		let decode_args=function(arg) {
			arg=arg.map(function(val) {
				return val.split('=')[1]||val;
			});
			return arg;
		};
		if (process.argv.length>1) {
			let args=process.argv.splice(2);
			args=decode_args(args);
			start(args);
			//console.log(start(args));
		};
	};
};

module.exports=start;