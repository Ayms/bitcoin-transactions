const crypto=require('crypto');
const Tx=require('./transactions.js');
const {btc_decode,baddress,check_addr,bech_convert,decode_redeem}=require('./addresses.js');
const {getPublicfromPrivate}=require('./keys.js');
const {is_bech,resp_xhr,clone_inputs,big_satoshis,testamount,check_mOfn}=require('./utils.js');

const create=function(args,coin) {
	//console.log(args);
	let tx_=[];
	let prevamount=0;
	let fees=parseFloat(args[6]);
	let amount=parseFloat(args[7])||null;
	let dtype='p2pkh';
	let daddr=args[5];
	let saddr;
	daddr=bech_convert(daddr,coin)||daddr; //bech convert for BCH only
	console.log('Destination address '+daddr);
	if  (is_bech(daddr)) {
		dtype='p2w'; //not nested will become p2wpkh2 or p2wsh2 later
	} else if (!((coin.NOP2SH.indexOf(daddr.substr(0,1))!==-1)||(coin.NOP2SH2.indexOf(daddr.substr(0,2))!==-1))) {
		console.log("Warning !!!! You are sending the funds to a P2SH address, make sure that you control it, especially if it's a BIP141 segwit address");
		dtype='p2sh';
	};
	//console.log(args);
	let inputs=args[0].split('_');
	//console.log(inputs);
	let prevaddr_=clone_inputs(args[1].split('_'),inputs,'Number of prevaddr inconsistent with number of inputs');
	//console.log(prevaddr_);
	let prevamount_=clone_inputs(args[2].split('_'),inputs,'Number of prevamount inconsistent with number of inputs');
	//console.log(prevamount_);
	let previndex_=clone_inputs(args[3].split('_'),inputs,'Number of previndex inconsistent with number of inputs');
	//console.log(previndex_);
	let privkey_=clone_inputs(args[4].split('_'),inputs,'Number of privkeys inconsistent with number of inputs');
	//console.log(privkey_);
	prevaddr_.forEach(function(addr,j) {
		let bech;
		let a=addr.split('-')[0];
		let sw=addr.split('-')[1];
		coin.SEGWIT=coin.SEGWIT||sw;//prevaddr=prevaddr-segwit
		bech=bech_convert(a,coin);
		if (bech) {
			prevaddr_[j]=bech;
			if (sw) {
				prevaddr_[j]+='-'+sw;
			};
		};
	});
	coin.SEGWIT=!!coin.SEGWIT;//true if one of the inputs is a segwit address then segwit serialization is used
	if (coin.SEGWIT) {
		if (coin.VERSION_!=='BTCP') {
			console.log('!!!!!!!!!! - Some prevaddr are corresponding to segwit addresses, creating a segwit transaction');
		} else {
			console.log('\r\n\r\n!!!!!!!!!! - Some prevaddr are corresponding to segwit addresses, Bitcoin Private partially supports segwit for now, creating a BTCP-like segwit transaction\r\n\r\n');
		};
	};
	prevamount_.forEach(function(val) {
		prevamount+=parseFloat(val);
	});
	let res=testamount([prevamount,fees,amount],coin);
	if (!res[0]) {
		console.log('Something is wrong with your numbers, please check them with the testamount command');
	} else {
		privkey_.forEach(function(privs,i) {
			let script='p2pkh';
			let prev=prevaddr_[i].split('-')[0];
			let sw=prevaddr_[i].split('-')[1];
			let bech=is_bech(prev);
			let type=sw?(bech?'p2wpkh2':'p2wpkh'):'p2pkh';
			privs=privs.split('-');
			if (privs.length>1) {
				type=sw?(bech?'p2wsh2':'p2wsh'):'p2sh';
				if (((coin.NOP2SH.indexOf(prev.substr(0,1))!==-1)||(coin.NOP2SH2.indexOf(prev.substr(0,2))!==-1))&&(!bech)) {
					throw "prevaddr address is not a p2sh one, multisig can't be used";
				};
				let typed=privs[privs.length-1];
				if (typed===coin.mOfn) { //reorder privkeys if necessary and check redeem script
					let order;
					let tmp;
					let pub;
					let n=0;
					let m;
					script=new Buffer(privs[privs.length-2],'hex');
					check_addr(script,prev,type,coin);
					m=check_mOfn(script,coin);
					if (!m[1]) {
						throw 'Wrong multisig redeem script';
					};
					m=m[0];
					privs=privs.slice(0,privs.length-2);
					tmp=new Array(privs.length);
					order=decode_redeem(coin,script,true);
					order.forEach(function(pubkey) {
						pubkey=pubkey.toString('hex');
						for (let i=0;i<privs.length;i++) {
							pub=getPublicfromPrivate(privs[i],coin);
							if (pub===pubkey) {
								tmp[n]=privs[i];
								n++;
								break;
							};
						};
					});
					if (tmp.length===m) {
						privs=tmp;
					} else {
						throw 'Wrong number of keys in redeem script';
					};
				} else {
					script='p2sh'; //if not mofn p2sh
				};
				if (sw&&(coin.VERSION_==='BTCP')) {
					let oprev=prev;
					prev=baddress(script,coin.p2sh);
					console.log('BTCP segwit output, changing '+oprev+' to pubkey address '+prev);
					saddr=crypto.createHash('sha256').update(script).digest();
					saddr=Buffer.concat([new Buffer([coin.SEGWIT_VERSION]),new Buffer([saddr.length]),saddr]);
					saddr=Buffer.concat([new Buffer([saddr.length]),saddr]).toString('hex');
					console.log('Segwit redeem is '+saddr);
					if (baddress(new Buffer(saddr.slice(2),'hex'),coin.p2sh)!==oprev) {
						throw 'redeem script does not correspond to segwit address';
					};
					type='p2sh';
					coin.SEGWIT=false;
				};
			} else {
				if ((!((coin.NOP2SH.indexOf(prev.substr(0,1))!==-1)||(coin.NOP2SH2.indexOf(prev.substr(0,2))!==-1)))&&(!coin.SEGWIT)&&(!sw)) {
					throw "prevaddr is a p2sh address, redeem script should be specified";
				};
				if (sw&&(coin.VERSION_==='BTCP')) {
					let oprev=prev;
					prev=getPublicfromPrivate(privs[0],coin);
					prev=baddress(new Buffer(prev,'hex'),coin.p2pk);
					console.log('BTCP segwit output, changing '+oprev+' to pubkey address '+prev);
					saddr=btc_decode(prev,coin.p2pk);
					saddr=Buffer.concat([new Buffer([coin.SEGWIT_VERSION]),new Buffer([saddr.length]),saddr]);
					saddr=Buffer.concat([new Buffer([saddr.length]),saddr]).toString('hex');
					console.log('Segwit redeem is '+saddr);
					if (baddress(new Buffer(saddr.slice(2),'hex'),coin.p2sh)!==oprev) {
						throw 'redeem script does not correspond to segwit address';
					};
					type='p2pkh';
					coin.SEGWIT=false;
				};
			};
			tx_.push([[inputs[i],prev,parseFloat(prevamount_[i]),type],parseInt(previndex_[i]),null,script,null,privs,saddr]);
			//script redeem (without op_pushdata) if multisig p2sh or p2wsh, if not null null
			//type p2pkh, p2sh, p2wpkh, p2wsh
			//pubkey [pubkey1, pubkey2,...]
		});
		amount=amount||big_satoshis(res[0],coin);
		if (!res[2]) {
			new Tx(coin,tx_,[[daddr,amount,dtype]],null);
			//dtype p2pkh, p2sh (for segwit nested)
		} else {
			let rtype=tx_[0][0][3]; //type of refunded address
			if ((rtype==='p2wpkh')||(rtype==='p2wsh')) {
				rtype='p2sh';//refunded segwit address
			};
			if ((rtype==='p2wpkh2')||(rtype==='p2wsh2')) {
				rtype='p2w';//refunded segwit address
			};
			new Tx(coin,tx_,[[daddr,amount,dtype],[tx_[0][0][1],big_satoshis(res[2],coin),rtype]],null); //refund to the first address
		};
	};
};

module.exports={create,Tx};