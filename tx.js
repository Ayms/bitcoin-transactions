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
const {createauto}=require('./src/getTx.js');
const {is_bech,resp_xhr,testamount,decimals}=require('./src/utils.js');
const {decode_redeem,convert_}=require('./src/addresses.js');
let oconsole=console.log.bind(console);
let coin;

if (process.argv) {
	let decode_args=function(arg) {
		arg=arg.map(function(val) {
			return val.split('=')[1]||val;
		})
		return arg;
	};
	if (process.argv.length>1) {
		let args=process.argv.splice(2);
		if (args.length) {
			coin=version_(args[0]);
		};
		console.log('Version '+coin.VERSION_);
		if (args.length>1) {
			let command=args[1];
			args=decode_args(args.slice(2));
			switch (command) {
				case 'testamount':
					testamount(args,coin);break;
				case 'convert':
					convert_(args[0],coin);break;
				case 'createauto':
					createauto(args,coin);break;
				case 'create': 
					create(args,coin);break;
				case 'decode': var tx=new Tx(coin);tx.deserialize(args[0]);tx.display_tx();break;
				case 'testconnect': Send(coin,null,args[0]);break;
				case 'send': Send(coin,args[0],args[1]);break;
				case 'decoderedeem': decode_redeem(coin,args[0]);break;
				case 'verify':
				//node tx.js BTC verify <tx> '<prevscriptpubKey>,<prevamount>'
					let arr=[];
					var tx=args.shift();
					args=args.map(function(arg) {
						arg=arg.split(',');
						arg[0]=new Buffer(arg[0],'hex');
						arg[1]=decimals(arg[1]*coin.SATO);
						return arg;
					});
					new Tx(coin).verify(tx,args);
					break;
				case 'createwallet': args.splice(1,0,coin);create_wallet(...args);break;
			};
		};
	};
};

//{addresses:input1.value}
//{decode_redeem:input0.value}
//{addresses:input2.value,privs:input3.value,destination:input4.value}

const xhr_=function(args,res_x) {
	let res=[];
	console.log=function() {};
	if (args.version) {
		coin=version_(args.version);
		coin.res_xhr=res_x;
		if (args.addresses) {
			if (!args.destination) {
				let addrs=args.addresses.split('_');
				addrs.forEach(function(addr) {
					try {
						res.push(convert_(addr,coin));
					} catch(ee) {
						res.push('Wrong address');
					};
				});
			} else {
				try {
					if (!args.txs) {
						let arr=[args.addresses];
						if (args.privs) {
							arr.push(args.privs);
						};
						arr.push(args.destination);
						createauto(arr,coin);
					} else {
						command_xhr.push('node tx.js '+coin.VERSION_+' create '+'prevtx='+args.tx+' prevaddr='+args.addresses+' prevamount='+args.prevamount+' previndex='+args.previndex+' privkey='+args.privs+' addr='+args.destination+' fees='+args.fees+(args.amount?(' amount='+args.amount):''));
						create([args.txs,args.addresses,args.prevamount,args.previndex,args.privs,args.destination,args.fees,args.amount],coin);
					};
				} catch(ee) {
					resp_xhr({error:ee.message||ee},coin);
				};
			};
		} else if (args.decode_redeem) {
			try {
				res=decode_redeem(coin,args.decode_redeem);
			} catch(ee) {
				res.push('Wrong redeem script');
			};
		};
	};
	return res.length?res:coin.command_xhr;
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