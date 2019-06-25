const {reverse,decodevarlen,is_bech,issig,is_segwit,toHex,big_satoshis,decimals,write,resp_xhr,clone_inputs,varlen,decode_script,op_push,op_push2,deserialize_scriptSig,serialize_sig,parse_op_push,count_w,check_mOfn}=require('./utils.js');
const {btc_encode,btc_decode,hash_160,rhmac,baddress,decode_redeem,hash_256,double_hash256,getKeyfromExtended,check_p2sh,convert,convert_,bech_convert,privatekeyFromWIF,format_privKey,check_addr,decode_bech32,encode_bech32}=require('./addresses.js');
const {privateKeyderive,FormatPrivate,PRFx,getPublicfromRawPrivate,ecdh_priv,getAddressfromPrivate,getPublicfromPrivate,getpubKeyfromPrivate,format_pubKey,getpubkeyfromSignature,recoverPubKey,keyFromPublic,sign}=require('./keys.js');

if (window===undefined) {
	var window=false;
};

const Tx=function(coin,input,output,nLockTime) {
	this.coin=coin;
	this.input=[];
	this.output=[];
	this.fees=0;
	if (input) {
		let all=false;
		this.nLockTime=new Buffer(4);
		nLockTime=nLockTime||0;
		this.nLockTime.writeUInt32LE(nLockTime);
		this.nVersion=new Buffer(4);;
		this.nVersion.writeUInt32LE(coin.VERSION);
		if ((coin.VERSION_==='BCD')||(coin.VERSION_==='BTT')) {
			this.preblockhash=reverse(coin.FORK_STRING);
		};
		this.sigHash=new Buffer(4);
		this.sigHash.writeUInt32LE(coin.SIGHASH_ALL);
		this.nbinput=input.length;
		this.nboutput=output.length;
		this.version=coin.VERSION_;
		input.forEach(function(inp) {
			let data=inp[2];
			let script=inp[3];
			if (data&&script) {
				throw 'data and script are exclusive';
			};
			let privKey=format_privKey(inp[5],coin);
			let swbtcp=inp[6]?(new Buffer(inp[6],'hex')):null;
			let pubKey;
			if (script==='p2pkh') {
				if (privKey.length>1) {
					throw "can't have multiple signatures";
				};
				privKey=privKey[0];
				pubKey=getpubKeyfromPrivate(privKey,coin);
				script=null;
			} else { //multisig
				pubKey=format_pubKey(privKey);
				if (Array.isArray(inp[0])) {
					check_addr(script,inp[0][1],inp[0][3],coin);
				};
			};
			let tmp=data||script;
			if (tmp) {
				tmp=op_push(tmp,coin); //add OP_PUSHDATA for redeem script
			};
			let ns=new Buffer(4);
			ns.writeUInt32BE(inp[4]||0xffffffff);
			this.input.push({hash:inp[0],n:inp[1],scriptSigLen:null,scriptSig:null,data:(data?tmp:null),script:(script?tmp:null),nSequence:ns,privKey:privKey,pubKey:pubKey,swbtcp:swbtcp});
			//console.log(this.input);
			//script redeem (with op_pushdata even for segwit) if multisig p2sh or p2wsh or p2wsh2, if not null
			//type p2pkh, p2sh, p2wpkh, p2wsh
			//pubkey [pubkey1, pubkey2,...]
		},this);
		output.forEach(function(out) {
			let address,scriptPubkey;
			let len=new Buffer(1);
			let addr=out[0];
			switch (out[2]) {
				case 'p2pkh':
					all=true;
					version=coin.p2pk;
					address=btc_decode(addr,version);
					len.writeUInt8(address.length);
					scriptPubkey=Buffer.concat([new Buffer(coin.OP_DUP+coin.OP_HASH160,'hex'),len,address,new Buffer(coin.OP_EQUALVERIFY+coin.OP_CHECKSIG,'hex')]);
					//OP_DUP OP_HASH160 len address OP_EQUALVERIFY OP_CHECKSIG
					break;
				case 'p2pk': //not used
					all=true;
					version=coin.p2pk;
					address=btc_decode(addr,version);
					len.writeUInt8(address.length);
					scriptPubkey=Buffer.concat([len,address,new Buffer(coin.OP_CHECKSIG,'hex')]);
					//len address OP_CHECKSIG
					break;
				case 'p2w': //p2wsh2 or pw2wpkh2 - bech destination address
					let prog=new Buffer(decode_bech32('bc',addr).program);
					if (prog) {
						scriptPubkey=Buffer.concat([new Buffer([coin.SEGWIT_VERSION]),new Buffer([prog.length]),prog]);
					}  else {
						throw 'Wrong bech32 address';
					};
					break;
				case 'p2sh':
					if (out[1]!==0) {
						all=true;
						version=coin.p2sh;
						address=btc_decode(addr,version);
						len.writeUInt8(address.length);
						scriptPubkey=Buffer.concat([new Buffer(coin.OP_HASH160,'hex'),len,address,new Buffer(coin.OP_EQUAL,'hex')]);
						//OP_HASH160 len address OP_EQUAL
					} else {
						scriptPubkey=new Buffer(coin.OP_RETURN,'hex');
						let data=out[3];
						if (data) {
							if (!Buffer.isBuffer(data)) {
								data=new Buffer(data,'utf8');
							};
						} else {
							data=new Buffer(0);
						};
						if (data.length<=coin.MAX_OP_PUSH) {
							let tmp=Buffer.concat(op_push(data,coin));
							scriptPubkey=Buffer.concat([scriptPubkey,tmp]);
							//OP_RETURN + data
						} else {
							throw "Can't append more than 520 bytes of data to OP_RETURN";
						};
					};
					break;
				default: throw "unknown pay to method";
			};
			this.fees-=parseInt(out[1]*coin.SATO);
			this.output.push({nValue:parseInt(out[1]*coin.SATO),scriptPubkeyLen:varlen(scriptPubkey.length),scriptPubkey:scriptPubkey,address:addr,type:out[2]});
		},this);
		if (!all) {
			//sig_hash_all is always used except for a single output op_return
			this.sigHash.writeUInt32LE(coin.SIGHASH_NONE);
		};
		this.sighash_sign();
	};
};

Tx.prototype.display_tx=function() {
	let res=[];
	let tmp=[];
	let type;
	res.push('nVersion '+this.nVersion.toString('hex'));
	res.push('nb input: '+this.nbinput);
	this.input.forEach(function(inp) {
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
			res.push('   script: '+Buffer.concat(inp.script||[new Buffer(0)]).toString('hex'));
		};
		try { //strange non standard transactions can make it throw
			if (inp.type==='p2pkh') {
				res.push('   address '+baddress(inp.script[0],this.coin.p2pk));
			} else if ((inp.type.indexOf('p2wpkh')!==-1)||(inp.type.indexOf('p2wsh')!==-1)) {
				if (inp.type.indexOf('p2wpkh')!==-1) {
					tmp=hash_160(inp.script[0]);
					res.push('   hash '+tmp.toString('hex'));
					res.push('   address pubkey '+btc_encode(tmp,this.coin.p2pk));
					if (inp.type!=='p2wpkh2') {
						res.push('   address segwit '+baddress(inp.witness_script,this.coin.p2sh));
					} else {
						res.push('   address segwit '+encode_bech32('bc',0,tmp)+' - '+baddress(Buffer.concat([new Buffer([this.coin.SEGWIT_VERSION]),new Buffer([tmp.length]),tmp]),this.coin.p2sh));
					};
				} else {
					try {
						tmp=decode_redeem(this.coin,Buffer.concat(inp.script).toString('hex'),true);
						tmp=tmp.map(function(key) {
							return baddress(key,this.coin.p2pk);
						});
						res.push('   multisig addresses '+tmp.join(','));
					} catch(ee) {};
					tmp=hash_256(inp.script[0]);
					res.push('   hash '+tmp.toString('hex'));
					if (inp.type!=='p2wsh2') {
						res.push('   address segwit '+baddress(inp.witness_script,this.coin.p2sh));
					} else {
						res.push('   address segwit '+encode_bech32('bc',0,tmp));
					};
				};
			} else if (inp.type==='p2sh') {
				try {
					tmp=decode_redeem(this.coin,Buffer.concat(inp.script).toString('hex'),true);
					tmp=tmp.map(function(key) {
						return baddress(key,this.coin.p2pk);
					});
					res.push('   multisig addresses '+tmp.join(','));
					res.push('   address '+btc_encode(hash_160(inp.script[0]),this.coin.p2sh));
				} catch(ee) {};
			};
		} catch(ee) {};
		res.push('   nSequence: '+inp.nSequence.toString('hex'));
	},this);
	res.push('nb output: '+this.nboutput);
	this.output.forEach(function(out) {
		res.push('   -------');
		res.push('   nValue: '+out.nValue);
		res.push('   scriptPubkeyLen: '+decodevarlen(out.scriptPubkeyLen)[0]);
		res.push('   scriptPubkey: '+out.scriptPubkey.toString('hex'));
		res.push('   address: '+out.address);
		res.push('   type: '+out.type);
	});
	res.push('nLockTime '+this.nLockTime.toString('hex'));
	if (!window) {
		res.forEach(function(txt) {
			console.log(txt);
		});
	};
	return res;
};

Tx.prototype.p2pk_sign=function(inp,scriptSig) {
	let version=this.coin.p2pk;
	let signatures=[];
	let data;
	let check_=getAddressfromPrivate(inp.privKey,version);
	console.log('Address corresponding to private key is '+check_);
	if (inp.scriptSig) {
		//verify public spending address - can look strange, just to be sure...
		let check=getpubkeyfromSignature(double_hash256(scriptSig),inp.scriptSig.slice(0,inp.scriptSig.length-1),version);
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
	inp.scriptSig=[[Buffer.concat([new Buffer(sign(scriptSig,inp.privKey)),this.sigHash.slice(0,1)]),Buffer.concat([new Buffer([inp.pubKey.length]),inp.pubKey]),(inp.swbtcp?inp.swbtcp:(new Buffer(0)))]]; //add pubkey
	signatures=Buffer.concat(serialize_sig(inp.scriptSig,this.coin)); //add OP_PUSHDATA/length
	data=inp.data?Buffer.concat(inp.data):(new Buffer(0));//pubkey with len
	inp.scriptSigLen=varlen(Buffer.concat([signatures,data]).length);
};

Tx.prototype.p2sh_sign=function(inp,scriptSig) {
	let version=this.coin.p2sh;
	let signatures,dat;
	let script=inp.script||inp.data;
	let sigHash=this.sigHash.slice(0,1);
	if 	((inp.type.indexOf('p2w')!==-1)||(check_p2sh(inp.prevscriptPubkey,parse_op_push(script[0],this.coin)[0],version))) { //skip the check for nested segwit p2wsh/p2wpkh, done later
		if (Array.isArray(inp.privKey)) {
			inp.scriptSig=[];
			inp.privKey.forEach(function(privKey) {
				inp.scriptSig.push([Buffer.concat([new Buffer(sign(scriptSig,privKey)),sigHash])]);
			},this);
		} else {
			inp.scriptSig=[Buffer.concat([new Buffer(sign(scriptSig,inp.privKey)),sigHash])];
		};
		signatures=Buffer.concat(serialize_sig(inp.scriptSig,this.coin)); //add OP_0 and OP_PUSHDATA/length
		inp.data=inp.swbtcp?inp.swbtcp:(new Buffer(0));
		dat=Buffer.concat([inp.script[0],inp.data]);//redeem with length
		inp.scriptSigLen=varlen(Buffer.concat([signatures,dat]).length); //dat redeem
	} else {
		throw 'p2sh address and redeem script do not match';
	};
};

Tx.prototype.p2w_sign=function(inp,scriptSig) {
	let signatures;
	let sigHash=this.sigHash.slice(0,1);
	if (Array.isArray(inp.privKey)) {
		inp.scriptSig=[];
		inp.privKey.forEach(function(privKey) {
			inp.scriptSig.push([Buffer.concat([new Buffer(sign(scriptSig,privKey)),sigHash])]);
		},this);
		inp.type='p2wsh2';
	} else {
		inp.scriptSig=[[Buffer.concat([new Buffer(sign(scriptSig,inp.privKey)),sigHash]),Buffer.concat([new Buffer([inp.pubKey.length]),inp.pubKey])]];
		inp.type='p2wpkh2';
	};
	inp.scriptSigLen=varlen(0);
};

Tx.prototype.sighash_sign=function() {
	let queue_=[];
	this.input.forEach(function(inp,i) {
		let scriptSig;
		let p2something;
		let addr;
		let cb=function(data) {
			if (data) {
				let tx=new Tx(this.coin);
				tx.deserialize(data);
				//console.log(tx);
				tx.display_tx();
				inp.prevscriptPubkey=tx.output[inp.n].scriptPubkey;
				inp.prevscriptPubkeyValue=tx.output[inp.n].nValue;
				this.fees+=tx.output[inp.n].nValue;
			};
			p2something=decode_script(inp.prevscriptPubkeySig||inp.prevscriptPubkey,this.coin);
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
			//getTx(inp.hash,cb.bind(this)); //not used see getTx.js
		} else {
			addr=inp.hash[1];
			if (inp.hash.length===2) { //query explorer
				inp.hash=inp.hash[0];
				cb.call(this,addr);
			} else {
				let version,address;
				let type=inp.hash[3];
				if ((type!=='p2wpkh2')&&(type!=='p2wsh2')) {
					version=((type==='p2sh')||(type==='p2wsh')||(type==='p2wpkh'))?this.coin.p2sh:this.coin.p2pk;
					address=btc_decode(addr,version);
					let len=new Buffer(1);
					len.writeUInt8(address.length);
					inp.type=inp.hash[3];
					if (version===this.coin.p2pk) {
						inp.prevscriptPubkey=Buffer.concat([new Buffer(this.coin.OP_DUP+this.coin.OP_HASH160,'hex'),len,address,new Buffer(this.coin.OP_EQUALVERIFY+this.coin.OP_CHECKSIG,'hex')]);
					} else {
						inp.prevscriptPubkey=Buffer.concat([new Buffer(this.coin.OP_HASH160,'hex'),len,address,new Buffer(this.coin.OP_EQUAL,'hex')]);
						if (type==='p2wpkh') {
							let pub=hash_160(inp.pubKey);
							inp.prevscriptPubkeySig=Buffer.concat([new Buffer(this.coin.OP_DUP+this.coin.OP_HASH160,'hex'),new Buffer([pub.length]),pub,new Buffer(this.coin.OP_EQUALVERIFY+this.coin.OP_CHECKSIG,'hex')]);
						} else {
							inp.redeem=parse_op_push(inp.script[0],this.coin)[0]; //redeem without OP_PUSHDATA
						};
					};
				} else {
					let prog=new Buffer(decode_bech32('bc',addr).program);
					if (prog) {
						inp.prevscriptPubkey=Buffer.concat([new Buffer([this.coin.SEGWIT_VERSION]),new Buffer([prog.length]),prog]);
						//inp.prevscriptPubkeySig=new Buffer([0]);
						if (prog.length===32) {
							inp.redeem=parse_op_push(inp.script[0],this.coin)[0]; //redeem without OP_PUSHDATA
						};
					} else {
						throw 'Wrong bech32 address';
					};
				};
				inp.prevscriptPubkeyValue=decimals(inp.hash[2]*this.coin.SATO);
				this.fees+=inp.prevscriptPubkeyValue;
				inp.hash=inp.hash[0];
				queue_.push(cb.bind(this));
			};
		};
	},this);
	while (queue_.length) {
		queue_.shift()();
	};
	let cb2=function() {
		let boo=false;
		let end=function() {
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
			setTimeout(cb2.bind(this),this.coin.T_O);
		};
	};
	cb2.call(this);
};

Tx.prototype.getmessage=function(signature,i) {
	let sigHash=new Buffer(4);
	sigHash.writeUInt32LE(signature[signature.length-1]);
	signature=signature.slice(0,signature.length-1);
	message=this.serialize_for_hash(i,sigHash);
	message=double_hash256(message);
	return message;
};

Tx.prototype.sighash_verify=function(prevscriptPubkey) { //prevscriptPubkey [[scriptPubkey,nValue]]
	this.input.forEach(function(inp,i) {
		let pub,pub__,key,check,check_;
		let cb=function(data) {
			let message;
			inp.verified=1;
			inp.allowed_to_spend=1;
			if (!Array.isArray(data)) {
				let tx=new Tx(this.coin);
				tx.deserialize(data);
				//console.log(tx);
				tx.display_tx();
				inp.prevscriptPubkey=tx.output[inp.n].scriptPubkey;
			} else {
				inp.prevscriptPubkey=prevscriptPubkey[i][0];
				inp.prevscriptPubkeyValue=prevscriptPubkey[i][1];
			};
			let signature=inp.scriptSig; //[sig] or [sig1,sig2,sig3]
			let p2something=decode_script(inp.prevscriptPubkey,this.coin);
			if (inp.witness_script) {
				if (inp.witness_script.length===1) {
					delete inp.witness_script;
				};
			};
			p2something=(inp.witness_script)?(is_segwit(inp.witness_script,this.coin)):p2something;
			if ((p2something==='p2pkh')||(p2something==='p2pk')||(p2something==='p2wpkh')||(p2something==='p2wpkh2')) {
				signature=signature[0];
				if (p2something==='p2wpkh') {
					pub__=inp.witness_script.slice(2); //witness script
					//correct remove
					inp.prevscriptPubkeySig=Buffer.concat([new Buffer(this.coin.OP_DUP+this.coin.OP_HASH160,'hex'),new Buffer([pub__.length]),pub__,new Buffer(this.coin.OP_EQUALVERIFY+this.coin.OP_CHECKSIG,'hex')]);
				};
				message=this.getmessage(signature,i);
				console.log('Verifying signature for '+message.toString('hex'));
				signature=signature.slice(0,signature.length-1); //remove sighash
				for (let k=0;k<4;k++) {
					try {
						pub=recoverPubKey(message,signature,k);
						key=keyFromPublic(pub,'hex');
						pub=new Buffer(key.getPublic(true,'arr'),'hex'); //get compact format 02+x or 03+x
						check=hash_160(pub).toString('hex');
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
				let mofn;
				let pubKey;
				let pr=0;
				let tmp;
				let script_;
				if (this.coin.VERSION_==='BTCP') {
					inp.script.pop(); //remove data btcp sw
				};
				inp.script.forEach(function(script) { //only one script for multisig, keep foreach for future uses
					inp.redeem=script;
					script_=((p2something==='p2sh')||(p2something==='p2wsh2'))?script:inp.witness_script;
					mofn=check_mOfn(script,this.coin);
					if (!mofn[1]) {
						throw 'Wrong redeem script';
					};
					mofn=mofn[0];
					tmp=script.slice(1);//remove OP_M
					tmp=tmp.slice(0,tmp.length-1);//remove checkmultisig
					tmp=tmp.slice(0,tmp.length-1);//remove OP_N
					pubKey=deserialize_scriptSig(tmp,this.coin)[1];
					signature.forEach(function(sig) {
						message=this.getmessage(sig,i);
						sig=sig.slice(0,sig.length-1); //remove sighash
						pubKey.forEach(function(pub) {
							let key=keyFromPublic(pub,'hex');
							if (key.verify(message,sig)) {
								pr++;
							};
						});
					},this);
					if (pr>=mofn) {
						inp.verified=true;
						console.log('Multisig signatures verified');
					};
					if (p2something!=='p2wsh2') {
						if (check_p2sh(inp.prevscriptPubkey,script_,this.coin.p2sh)) {
							inp.allowed_to_spend=true;
							console.log('Multisig allowed to spend');
						};
					} else {
						tmp=hash_256(script);
						tmp=Buffer.concat([new Buffer([this.coin.SEGWIT_VERSION]),new Buffer([tmp.length]),tmp]);
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
				let cb2=function() {
					let boo=false;
					let end=function() {
						let boo=true;
						this.input.forEach(function(inp) {
							if ((inp.verified!==true)||(inp.allowed_to_spend!==true)) {
								boo=false;
							};
						});
						console.log(boo?'----- Transaction verified':'********* - Bad transaction');
						if (!boo) {
							this.coin.command_xhr={error:'Bad transaction - check your keys and parameters'};
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
						setTimeout(cb2.bind(this),this.coin.T_O);
					};
				};
				cb2.call(this);
			};
		};
		if (!prevscriptPubkey) {
			//getTx(inp.hash,cb.bind(this)); //not used see getTx.js
		} else {
			cb.call(this,prevscriptPubkey);
		};
	},this);
};

Tx.prototype.deserialize=function(data) {
	let m=0;
	let hash_=[];
	if (!Buffer.isBuffer(data)) {
		data=new Buffer(data,'hex');
	};
	this.nVersion=data.slice(0,4);
	hash_.push(this.nVersion);
	if ((this.coin.VERSION_==='BCD')||(this.coin.VERSION_==='BTT')) {
		this.preblockhash=data.slice(4,36);
		m=32;
		hash_.push(this.preblockhash);
	};
	let tmp=decodevarlen(data.slice(4+m));
	this.nbinput=tmp[0];
	data=data.slice(4+m+tmp[1]);
	if (this.nbinput) {
		for (let i=0;i<this.nbinput;i++) {
			let sLen=decodevarlen(data.slice(36));
			let off=36+sLen[1];
			let scriptSigLen=varlen(sLen[0]);
			let scriptSig=deserialize_scriptSig(data.slice(off,off+sLen[0]),this.coin); //[[signatures],[redeem script or pubkey]] without OP_PUSHDATA/length
			this.input.push({hash:reverse(data.slice(0,32)).toString('hex'),n:parseInt(reverse(data.slice(32,36)).toString('hex'),16),scriptSigLen:scriptSigLen,scriptSig:scriptSig[0],script:scriptSig[1],nSequence:reverse(data.slice(off+sLen[0],off+sLen[0]+4))});
			//type undefined
			data=data.slice(off+sLen[0]+4);
		};
		tmp=decodevarlen(data);
		this.nboutput=tmp[0];
		data=data.slice(tmp[1]);
		for (let i=0;i<this.nboutput;i++) {
			let nValue=parseInt(reverse(data.slice(0,8)).toString('hex'),16);
			this.fees-=nValue;
			data=data.slice(8);
			let scriptPubkeyLen=decodevarlen(data);
			let scriptPubkey=data.slice(scriptPubkeyLen[1],scriptPubkeyLen[1]+scriptPubkeyLen[0]);
			let p2something=decode_script(scriptPubkey,this.coin);
			let address;
			switch (p2something) {
				case 'p2pkh': address=btc_encode(scriptPubkey.slice(3,23),this.coin.p2pk);break;
				case 'p2sh': address=btc_encode(scriptPubkey.slice(2,22),this.coin.p2sh);break;
				case 'op_return': address='';break;
				case 'p2wpkh2': address=encode_bech32('bc',0,scriptPubkey.slice(2,22))+' - '+btc_encode(hash_160(scriptPubkey.slice(2,22)),this.coin.p2sh);break;
				case 'p2wsh2': address=encode_bech32('bc',0,scriptPubkey.slice(2,34))+' - '+btc_encode(hash_160(scriptPubkey.slice(2,34)),this.coin.p2sh);break;
				case 'p2pk': address=btc_encode(hash_160(scriptPubkey.slice(1,34)),this.coin.p2pk);break;
			};
			this.output.push({nValue:nValue,scriptPubkeyLen:data.slice(0,scriptPubkeyLen[1]),scriptPubkey:scriptPubkey,address:address,type:p2something});
			data=data.slice(scriptPubkeyLen[1]+scriptPubkeyLen[0]);
		};
		this.nLockTime=data;
	} else { //segwit
		let c=[];
		let nb_w;
		let w;
		let tmp;
		let j=0;
		let script=[];
		let signatures=[];
		this.coin.SEGWIT=true;
		data=data.slice(1); //skip flag
		tmp=decodevarlen(data);
		this.nbinput=tmp[0];
		hash_.push(data.slice(0,tmp[1]));
		data=data.slice(tmp[1]);
		for (let i=0;i<this.nbinput;i++) {
			let sLen=decodevarlen(data.slice(36));
			let off=36+sLen[1];
			let scriptSigLen=varlen(sLen[0]);
			let scriptSigLen_w=data.slice(36,off);
			let scriptSig=deserialize_scriptSig(data.slice(off,off+sLen[0]),this.coin); ////[[signatures],[script or pubkey]] or [[],[witness_script nested]] [[], null] (segwit not nested)
			if (scriptSig[0].length) { //non segwit input
				c.push(i);
				this.input.push({hash:reverse(data.slice(0,32)).toString('hex'),n:parseInt(reverse(data.slice(32,36)).toString('hex'),16),scriptSigLen:scriptSigLen,scriptSigLen_w:scriptSigLen_w,scriptSig:scriptSig[0],script:scriptSig[1],script_w:[op_push(scriptSig[1][0],this.coin)[0]],nSequence:reverse(data.slice(off+sLen[0],off+sLen[0]+4))});
			} else {
				this.input.push({hash:reverse(data.slice(0,32)).toString('hex'),n:parseInt(reverse(data.slice(32,36)).toString('hex'),16),witness_script:(scriptSig[1]?scriptSig[1][0]:(new Buffer([0]))),type:(scriptSig[1]?is_segwit(scriptSig[1][0],this.coin):'p2w'),nSequence:reverse(data.slice(off+sLen[0],off+sLen[0]+4))});
				//type p2wpkh,p2wsh,p2w
			};
			hash_.push(data.slice(0,off+sLen[0]+4));
			data=data.slice(off+sLen[0]+4);
		};
		tmp=decodevarlen(data);
		this.nboutput=tmp[0];
		hash_.push(data.slice(0,tmp[1]));
		data=data.slice(tmp[1]);
		for (let i=0;i<this.nboutput;i++) {
			let nValue=parseInt(reverse(data.slice(0,8)).toString('hex'),16);
			this.fees-=nValue;
			hash_.push(data.slice(0,8));
			data=data.slice(8);
			let scriptPubkeyLen=decodevarlen(data);
			let scriptPubkey=data.slice(scriptPubkeyLen[1],scriptPubkeyLen[1]+scriptPubkeyLen[0]);
			let p2something=decode_script(scriptPubkey,this.coin);
			let address;
			switch (p2something) {
				case 'p2pkh': address=btc_encode(scriptPubkey.slice(3,23),this.coin.p2pk);break;
				case 'p2sh': address=btc_encode(scriptPubkey.slice(2,22),this.coin.p2sh);break;
				case 'op_return': address='';break;
				case 'p2wpkh2': address=encode_bech32('bc',0,scriptPubkey.slice(2,22))+' - '+btc_encode(scriptPubkey.slice(2,22),this.coin.p2sh);break;
				case 'p2wsh2': address=encode_bech32('bc',0,scriptPubkey.slice(2,34))+' - '+btc_encode(scriptPubkey.slice(2,34),this.coin.p2sh);break;
				case 'p2pk': address=btc_encode(hash_160(scriptPubkey.slice(1,34)),this.coin.p2pk);break;
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
				for (let i=0;i<nb_w;i++) {
					//console.log(data.toString('hex'));
					if (data[0]!==0) { //OP_0 without length
						tmp=decodevarlen(data);
						data=data.slice(tmp[1]);
						w=data.slice(0,tmp[0]);
						if (issig(w,this.coin)) {
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
					signatures=Buffer.concat(serialize_sig(signatures,this.coin));
					//BTCP stuff
					script=op_push(script[0],this.coin)[0];//op+len+script
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
	let result=[];
	let input_i=this.input[i];
	if (!sigHash) {
		sigHash=new Buffer(4);
		this.sigHash.copy(sigHash);
	};
	if ((!this.coin.BIP143)&&(input_i.type?(input_i.type.indexOf('p2w')===-1):true)) { //non segwit
		console.log('Using standard signing');
		result.push(this.nVersion);
		if ((this.coin.VERSION_==='BCD')||(this.coin.VERSION_==='BTT')) {
			result.push(this.preblockhash);
		};
		result.push(new Buffer([this.nbinput]));
		this.input.forEach(function(inp,j) {
			let n=new Buffer(4);
			n.writeUInt32LE(inp.n);
			if (j!==i) {
				result.push(Buffer.concat([reverse(new Buffer(inp.hash,'hex')),n,new Buffer([0]),reverse(inp.nSequence)]));
			} else {
				result.push(Buffer.concat([reverse(new Buffer(inp.hash,'hex')),n,varlen(inp.prevscriptPubkey.length),inp.prevscriptPubkey,reverse(inp.nSequence)]));
			};
		});
		if (sigHash.readUInt32LE()===this.coin.SIGHASH_ALL) {
			result.push(new Buffer([this.nboutput]));
			this.output.forEach(function(out) {
					result.push(Buffer.concat([reverse(new Buffer((toHex(out.nValue,8)),'hex')),out.scriptPubkeyLen,out.scriptPubkey]));
			},this);
		};
		if (sigHash.readUInt32LE()===this.coin.SIGHASH_NONE) {
			result.push(new Buffer('00','hex'));
		};
		result.push(this.nLockTime);
		if (this.coin.FORKID_IN_USE!==undefined) {
			let sigfork=sigHash.readUInt32LE();
			if (this.coin.VERSION_!=="B2X") {
				sigfork|=this.coin.FORKID_IN_USE<<8;
			} else {
				sigfork<<=1
			};
			sigHash.writeUInt32LE(sigfork);
		};
		result.push(sigHash);
		if ((this.coin.VERSION_==='SBTC')||(this.coin.VERSION_==='UBTC')||(this.coin.VERSION_==='BTCP')||(this.coin.VERSION_==='WBTC')||(this.coin.VERSION_==='BICC')) {
			result.push(this.coin.FORK_STRING);
		};
		//result.forEach(function(v) {console.log(v.toString('hex'))});
		return Buffer.concat(result);
	} else {
		console.log('Using BIP143 signing');
		let sigtmp=[];
		let n;
		result.push(this.nVersion);
		if ((this.coin.VERSION_==='BCD')||(this.coin.VERSION_==='BTT')) {
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
			let scriptCode=input_i.redeem;
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
		if (this.coin.FORKID_IN_USE!==undefined) {
			let sigfork=sigHash.readUInt32LE();
			if (this.coin.VERSION_!=="B2X") {
				sigfork|=this.coin.FORKID_IN_USE<<8;
			} else {
				sigfork<<=1
			};
			sigHash.writeUInt32LE(sigfork);
		};
		result.push(sigHash);
		if ((this.coin.VERSION_==='SBTC')||(this.coin.VERSION_==='UBTC')||(this.coin.VERSION_==='BTCP')||(this.coin.VERSION_==='WBTC')||(this.coin.VERSION_==='BICC')) {
			result.push(this.coin.FORK_STRING);
		};
		//console.log('----- Serialized result');
		//result.forEach(function(v) {console.log(v.toString('hex'))});
		return Buffer.concat(result);
	};
};

Tx.prototype.serialize=function(boo) {
	let result=[];
	let hash_=[];
	let signatures=[];
	result.push(this.nVersion);
	hash_.push(this.nVersion);
	if ((this.coin.VERSION_==='BCD')||(this.coin.VERSION_==='BTT')) {
		result.push(this.preblockhash);
		hash_.push(this.preblockhash);
	};
	if (!this.coin.SEGWIT) {
		result.push(new Buffer([this.nbinput]));
		this.input.forEach(function(inp) {
			let n=new Buffer(4);
			n.writeUInt32LE(inp.n);
			signatures=serialize_sig(inp.scriptSig,this.coin);//scriptSig [sig,pubkey] or [sig] only when coming from deserialize
			inp.script=inp.script_w||inp.script;//redeem (with length/OP_PUSHDATA except when coming from deserialize) - pubkey when coming from deserialize
			//add op_push when coming from deserialize
			if (boo) {
				inp.script=op_push2(inp.script,this.coin); //add OP_PUSHDATA/length
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
		let w=[];
		result.push(new Buffer([this.coin.SEG_MARKER]));
		result.push(new Buffer([this.coin.SEG_FLAG]));
		result.push(new Buffer([this.nbinput]));
		hash_.push(new Buffer([this.nbinput]));
		this.input.forEach(function(inp) {
			let nb_w=0;
			let n=new Buffer(4);
			let l;
			n.writeUInt32LE(inp.n);
			nb_w=count_w(inp.scriptSig); //[[sig,pubkey]] or [[sig1],[sig2],] from multisig, [sig1,sig2,] from deserialize (nb_w value derived later)
			signatures=serialize_sig(inp.scriptSig,this.coin); //[signatures + pubkey] (sigs only when from deserialize)
			result.push(Buffer.concat([reverse(new Buffer(inp.hash,'hex')),n]));
			hash_.push(Buffer.concat([reverse(new Buffer(inp.hash,'hex')),n]));
			if ((inp.type===undefined)||inp.type.indexOf('p2w')===-1) { //Non segwit input
				//add op_push when coming from deserialize
				if (boo) {
					inp.script=op_push2(inp.script,this.coin); //add OP_PUSHDATA/length
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
					let r=hash_256(inp.redeem);
					l=r.length;
					result.push(Buffer.concat([new Buffer([l+3]),new Buffer([l+2]),new Buffer([this.coin.SEGWIT_VERSION]),new Buffer([l]),r]));//232220020(hash redeem)
					hash_.push(result[result.length-1]);//232220020(hash redeem)
					nb_w++;
				} else if (inp.pubKey) {
					let pub=hash_160(inp.pubKey);
					l=pub.length;
					result.push(Buffer.concat([new Buffer([l+3]),new Buffer([l+2]),new Buffer([this.coin.SEGWIT_VERSION]),new Buffer([l]),pub])); //17160014(hash pub)
					hash_.push(result[result.length-1]); //17160014(hash pub)
				} else if (inp.witness_script) { //00etc from deserialize
					l=inp.witness_script.length;
					if (l>1) { //not OP_0 or OP_n
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

Tx.prototype.verify=function(data,prevscriptPubkey) {
	this.version=this.coin.VERSION_;
	this.data=data;
	this.deserialize(data);
	this.sighash_verify(prevscriptPubkey);
};

Tx.prototype.finalize=function(tx) {
	let magic=new Buffer(4);
	let boo=tx;
	magic.writeUInt32LE(this.testnet?TESTNET:this.coin.MAIN);
	tx=tx?(new Buffer(tx,'hex')):this.serialize();
	console.log('checksum hash '+double_hash256(tx).toString('hex'));
	let checksum=double_hash256(tx).slice(0,4);
	if (this.coin.SEGWIT) {
		this.hash=this.hash_w;
	} else {
		this.hash=double_hash256(tx);
		this.hash=reverse(this.hash);
	};
	let length=new Buffer(4);
	length.writeUInt32LE(tx.length);
	this.tx=Buffer.concat([magic,this.coin.TX_COMMAND,length,checksum,tx]);
	console.log('----- Transaction ID: '+this.hash.toString('hex'));
	//console.log(this.tx.toString('hex'));
	if (!boo) {
		let prevscriptPubkey=[];
		let fees_=this.fees;
		let length_=this.tx.length;
		let tx_b=tx.toString('hex');
		let tx_d;
		console.log('Transaction body:\n'+tx_b);
		console.log('Complete transaction:\n'+this.tx.toString('hex'));
		console.log('Size '+this.tx.length+' bytes');
		console.log('Network Fees: '+fees_+' - '+(fees_/length_).toFixed(2)+' satoshis/byte');
		try {
			this.coin.command_xhr.push(tx.toString('hex'));
			this.coin.command_xhr.push(this.tx.toString('hex'));
			this.coin.command_xhr.push(this.hash.toString('hex'));
		} catch(ee) {};
		console.log('------------- Check - deserialize ');
		let tx_check=new Tx(this.coin);
		tx_check.deserialize(tx);
		//delete tx_check.fees;
		//try {
			this.coin.command_xhr.push(tx_check.display_tx());
		//} catch(ee) {};
		console.log('------------- End Check - deserialize ');
		console.log('------------- Check - verify ');
		this.input.forEach(function(inp) {
			prevscriptPubkey.push([inp.prevscriptPubkey,inp.prevscriptPubkeyValue]);
		});
		let tx_verify=new Tx(this.coin);
		tx_verify.verify(tx,prevscriptPubkey);
		console.log('------------- End Check - verify ');
		let tx_check2=new Tx(this.coin);
		tx_d=tx_check2.deserialize(tx_b);
		if (tx_b===tx_check2.serialize(true).toString('hex')) {
			console.log('------------- OK - serialize/deserialize ');
		} else {
			console.log('------------- NOK - serialize/deserialize ');
		};
		try {
			this.coin.command_xhr.push(fees_);
		} catch(ee) {};
		if (fees_>this.coin.FEES*length_) {
			console.log('---- WARNING !!!!!!!!!!!!!!! ----- Network fees look very high, probably you did not choose the correct amount, please make sure that amount+dev fees+network fees=prevamount');
		} else if (fees_<0) {
			console.log('---- WARNING !!!!!!!!!!!!!!! ----- Network fees are incorrect, probably you did not choose the correct amount, please make sure that amount+dev fees+network fees=prevamount');
		};
		resp_xhr(this.coin);
	};
};

module.exports=Tx;