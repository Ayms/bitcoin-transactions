const reverse=function(buf) {
	let len=buf.length;
	let rev=new Buffer(len);
	for (let i=0;i<len;i++) {
		rev[i]=buf[len-1-i];
	};
	return rev;
};

const decodevarlen=function(buf) {
	let tmp=buf.slice(1);
	switch (buf[0]) {
		case 0xfd: return [tmp.readUInt16LE(),3];
		case 0xfe: return [tmp.readUInt32LE(),5];
		case 0xff: buf=reverse(tmp); return [parseInt(buf.toString('hex')),9];
		default: return [buf[0],1];
	};
};

const BufftoArr=function(buf) {//Not used, keep for browserification if needed
	let arr=[];
	arr.push(...buf);
	return arr;
};

const get_index=function(arr) {//Not used
	let index;
	let i=0;
	while(arr[i]===1) {
		i++;
	};
	arr[i]=1;
	return (i>arr.length?false:i);
};

const is_bech=function(add) {
	return (add.substr(0,2)==='bc')?true:false;
};

const issig=function(buf,coin) {
	let t=buf[0];
	let q=buf[2];
	if ((t===coin.ISSIG1)&&(q===coin.ISSIG2)) {
		return true;
	};
};

const is_segwit=function(buf,coin) {
	let l=buf.length;;
	if ((l===22)&&(buf[0]===coin.SEGWIT_VERSION)&&(buf[1]===20)) {
		return 'p2wpkh';
	};
	if ((l===34)&&(buf[0]===coin.SEGWIT_VERSION)&&(buf[1]===32)) {
		return 'p2wsh';
	};
};

const toHex=function(val,len) {
	val=val.toString(16);
	len=(len*2)||0;
	val=val.length%2?('0'+val):val;
	while (val.length<len) {
		val='0'+val;
	};
	return val;
};

const big_satoshis=function(n,coin) {
	if (n) {
		return (n/coin.SATO).toFixed(coin.D);
	};
};

const decimals=function(nb) {
	let a=nb.toString().split('.');
	if (a.length===2) {
		let tmp=parseInt(a[1].slice(0,1));
		if (tmp>=5) {
			nb=Math.ceil(nb);
		} else {
			nb=Math.floor(nb);
		};
	};
	return nb;
};

const write=function(coin,prevamount,amount,fees,s,refunded) {
	console.log('--- Previous amount is: '+big_satoshis(prevamount,coin));
	console.log('--- Amount to spend is: '+big_satoshis(amount,coin));
	console.log('--- Network fees are: '+big_satoshis(fees,coin));
	if (refunded) {
		console.log('--- Refunded amount to spending address is: '+big_satoshis(refunded,coin));
	};
};

const resp_xhr=function(coin,res=coin.command_xhr) {
	if (coin.res_xhr) {
		let head={};
		head['Server']='Peersm';
		head['Date']=(new Date()).toUTCString();
		coin.res_xhr.writeHead(200,head);
		coin.res_xhr.end(JSON.stringify(res));
	} else {
		if (res) {
			coin.command_xhr=res;
		};
	};
};

const clone_inputs=function(param,inputs,message) {
	if (param.length===1) {
		param=inputs.map(function() {return param[0]});
	} else if (param.length!==inputs.length) {
		throw message;
	};
	return param;
};

const varlen=function(len) {
	let buf;
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

const decode_script=function(p2something,coin) {
	let one,two;
	p2something=p2something.slice(0,2);
	one=p2something.slice(0,1).toString('hex');
	two=p2something.slice(1)[0];
	if (p2something.toString('hex')===coin.OP_DUP+coin.OP_HASH160) {
		//P2PKH
		return 'p2pkh';
	} else if (one===coin.OP_HASH160) {
		//P2SH
		return 'p2sh';
	} else if (one===coin.OP_RETURN) {
		//P2SH
		return 'op_return';
	} else if (parseInt(one)===coin.SEGWIT_VERSION) {
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

const op_push=function(buf,coin) {
	let res=[];
	let len;
	while (buf.length) {
		if (buf.length>0xff) {
			len=new Buffer(2);
			if (buf.length>coin.OP_PUSH) {
				len.writeUInt16LE(coin.OP_PUSH);
			} else {
				len.writeUInt16LE(buf.length);
			};
			res.push(Buffer.concat([new Buffer([coin.OP_PUSHDATA2]),len,buf.slice(0,len.readUInt16LE())]));
			buf=buf.slice(len.readUInt16LE());
		} else {
			if (buf.length<coin.OP_PUSHDATA1) {
				res.push(Buffer.concat([new Buffer([buf.length]),buf]));
			} else {
				res.push(Buffer.concat([new Buffer([coin.OP_PUSHDATA1]),new Buffer([buf.length]),buf]));
			};
			buf=new Buffer(0);
		};
	};
	return res;
};

const op_push2=function(arr,coin) {
	let res=[];
	arr.forEach(function(a) {
		res.push(Buffer.concat(op_push(a,coin)));
	});
	return res;
};

const deserialize_scriptSig=function(buf,coin) {
	let signatures=[];
	let dat=[];
	let tmp;
	while (buf.length) {
		tmp=parse_op_push(buf,coin);
		if (buf[0]!==parseInt(coin.OP_0)) {
			if (issig(tmp[0],coin)) {
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

const serialize_sig=function(sigs,coin) {
	let signatures=[];
	if (sigs.length>1) { //multisig
		signatures.push(new Buffer(coin.OP_0,'hex'));
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

const parse_op_push=function(buf,coin) {
	let tmp,len,n;
	switch (buf[0]) {
		case coin.OP_PUSHDATA2:n=3;len=buf.slice(1).readUInt16LE();buf=buf.slice(3);tmp=buf.slice(0,len);break;
		case coin.OP_PUSHDATA1:n=2;len=buf[1];buf=buf.slice(2);tmp=buf.slice(0,len);break;
		default:n=1;len=buf[0];buf=buf.slice(1);tmp=buf.slice(0,len);
	};
	return [tmp,n];
};

const count_w=function(sigs) {
	let n=0;
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

const check_mOfn=function(script,coin) {
	let m,n;
	m=parseInt(script[0].toString(16).slice(1),16);//OP_M
	n=script[script.length-2].toString(16);//OP_N
	if (n===coin.OP_16) {
		n=16;
	} else {
		if (parseInt(n,16)<96) {
			n=parseInt(n.slice(1),16);
		} else {
			n=0; //more than 16 keys, will throw
		};
	};
	console.log('multisig '+m+' of '+n);
	return [m,(m<=n)];
};

const testamount=function(args,coin) {
	let prevamount=args[0]*coin.SATO;
	let fees=args[1]*coin.SATO;
	let amount=args[2]*coin.SATO||0;
	let refunded=0;
	if (amount) {
		refunded=prevamount-amount-fees;
		if (refunded<0) {
			throw '--- Your numbers are incorrect, please check them and try again';
		};
		write(coin,prevamount,amount,fees,0,refunded);
	} else {
		amount=prevamount-fees;
		write(coin,prevamount,amount,fees,0,refunded);
	};
	//console.log(!!big_satoshis(amount));
	return [amount,0,refunded];
};

module.exports={reverse,decodevarlen,is_bech,issig,is_segwit,toHex,big_satoshis,decimals,write,resp_xhr,clone_inputs,varlen,decode_script,op_push,op_push2,deserialize_scriptSig,serialize_sig,parse_op_push,count_w,check_mOfn,testamount};