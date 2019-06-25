const https=require('https');
const http=require('http');
const create=require('./create.js');

const getTx=function(hash,cb) {
	//blockchain.com removed, might be replaced later with our own blockchain explorer
};

const ninja=function(addrs,daddr,coin) {
	let prevtx_=[];
	let prevaddr_=[];
	let prevamount_=[];
	let previndex_=[];
	let privkey_=[];
	let fees=0;
	let boo;
	let command;
	addrs.forEach(function(val) {
		if (val.forks) {
			val.forks.forEach(function(fork) {
				if (fork.ticker===coin.VERSION_.toLowerCase()) {
					if (parseInt(fork.balance.expected)!==0) {
						fork.utxo.forEach(function(utxo) {
							prevaddr_.push(val.raddr);
							prevtx_.push(utxo.txid);
							prevamount_.push(big_satoshis(utxo.value,coin));
							previndex_.push(utxo.txindex);
							boo=val.paddr;
							privkey_.push(val.paddr||('[priv key or redeem script of '+val.addr+']'));
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
	command='node tx.js '+coin.VERSION_+' create prevtx='+prevtx_+' prevaddr='+prevaddr_+' prevamount='+prevamount_+' previndex='+previndex_+' privkey='+privkey_+' addr='+daddr+' fees='+fees;
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
			create([prevtx_,prevaddr_,prevamount_,previndex_,privkey_,daddr,fees],coin);
		} catch(ee) {
			resp_xhr({error:ee.message||ee},coin);
		};
	} else {
		resp_xhr(command_xhr,coin);
	};
};

const get_utxo_btcp=function(arg,caddrs,paddrs,daddr,coin) {
	let j=0;
	let data__=[];
	let send=function(k) {
		let options=options={
				port: 80,
				method: 'GET',
				host:'explorer.btcprivate.org',
				path:'/api/txs?address='+caddrs[k]+'&pageNum=0',
				headers: {'User-Agent':'Mozilla/5.0 (Windows NT 6.3; rv:60.0) Gecko/20100101 Firefox/60.0','Accept':'application/json, text/plain, */*','Referer':'http://explorer.btcprivate.org','Connection':'keep-alive'}
			};	
			let req=http.request(options,function(res) {
				let data_=new Buffer(0);
				res.on('data',function(d) {
					data_=Buffer.concat([data_,d]);
				});
				res.on('end',function() {
					if (data_) {
						let dat=JSON.parse(data_.toString('utf-8'));
						dat=dat.txs;
						dat=dat[dat.length-1];
						if (dat.vin[0].coinbase) {
							data__.push({addr:caddrs[k],raddr:((arg[k].split('-').length>1)?(caddrs[k]+'-segwit'):caddrs[k]),paddr:paddrs[k],forks:[{ticker:'btcp',balance:{expected:1},utxo:[{txid:dat.txid,txindex:0,value:decimals(dat.vout[0].value*coin.SATO)}]}]});
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

const createauto=function(args,coin) {
	let p={};
	let addrs=[];
	let caddrs=[];
	let paddrs=[];
	let daddr;
	let arg=args[0].split('_');
	arg.forEach(function(addr,i) {
		let add;
		addrs.push(addr.split('-')[0]); //remove segwit
		add=addrs[i];
		caddrs.push(convert_(add,coin));
	});
	if (args[1].length>50) {
		paddrs=args[1].split('_');
		daddr=convert_(args[2],coin);
	} else {
		daddr=convert_(args[1],coin);
	};
	if (paddrs.length) {
		if (addrs.length!==paddrs.length) {
			throw "Number of addresses and private keys is not equal";
		};
	};
	if (coin.VERSION_==='BTCP') {
		get_utxo_btcp(arg,caddrs,paddrs,daddr,coin);
	} else {
		console.log('querying findmycoins.ninja with '+addrs);
		p.addrs=addrs;
		p=JSON.stringify(p);
		let options={
			port: 80,
			method: 'POST',
			host:'www.findmycoins.ninja',
			path:'/q',
			headers: {'User-Agent':'Mozilla/5.0 (Windows NT 6.3; rv:60.0) Gecko/20100101 Firefox/60.0','Accept':'*/*','Referer':'http://www.findmycoins.ninja/','Content-Type':'application/json','X-Requested-With':'XMLHttpRequest','Content-Length':p.length,'Connection':'keep-alive'}
		};	
		let req=http.request(options,function(res) {
			let data_=new Buffer(0);
			res.on('data',function(d) {
				data_=Buffer.concat([data_,d]);
			});
			res.on('end',function() {
				if (data_) {
					data_=JSON.parse(data_.toString('utf-8'));
					data_=data_.addrs;
					if (data_.length) {
						data_.forEach(function(gaddr) {
							let j=addrs.indexOf(gaddr.addr);
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
					ninja(data_,daddr,coin);
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

module.exports={createauto,getTx};