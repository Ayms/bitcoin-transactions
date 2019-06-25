const net=require('net');
const crypto=require('crypto');
const {toHex,reverse}=require('./utils.js');
const {double_hash256}=require('./addresses.js');

const decode_simple=function(message,coin) { //message buf
	let magic=new Buffer(4);
	magic.writeUInt32LE(coin.MAIN);
	message=message.toString('hex').split(magic.toString('hex'));
	message.shift();
	message.forEach(function(buf) {
		buf=new Buffer(buf,'hex');
		let command=buf.slice(0,12).toString();
		console.log(command);
		if (command.indexOf('reject')!==-1) {
			console.log('------ Transaction rejected ---- ')
			buf=buf.slice(20);
			console.log(buf.toString('hex'));
		};
	});
};

const Version=function(myip,dip,coin) {
	let services=new Buffer('0100000000000000','hex');
	let ipv4=new Buffer('00000000000000000000FFFF','hex');
	let relay=new Buffer('00','hex');
	let magic=new Buffer(4);
	magic.writeUInt32LE(coin.MAIN);
	let dbuf=new Buffer(4);
	dip=(new Buffer(dip.split('.'))).readUInt32BE();
	dbuf.writeUInt32BE(dip);
	dbuf=Buffer.concat([dbuf,new Buffer(toHex(coin.PORT,2),'hex')]);
	let mbuf=new Buffer(4);
	myip=(new Buffer(myip.split('.'))).readUInt32BE();
	mbuf.writeUInt32BE(myip);
	mbuf=Buffer.concat([mbuf,new Buffer(toHex(coin.PORT,2),'hex')]);
	let nonce=crypto.randomBytes(8);
	let vstring=new Buffer('/https://github.com/Ayms/bitcoin-transactions/','utf8');
	vstring=Buffer.concat([new Buffer([vstring.length]),vstring]);
	let lastblock=new Buffer(4);
	lastblock.writeUInt32LE(coin.LASTBLOCK);
	let payload=new Buffer(4);
	payload.writeUInt32LE(coin.PROTOCOL);
	payload=Buffer.concat([payload,services]);
	payload=Buffer.concat([payload,reverse(new Buffer(toHex(Date.now(),8),'hex'))]);
	payload=Buffer.concat([payload,services,ipv4,dbuf,services,ipv4,mbuf,nonce,vstring,lastblock,relay]); //BIP 37 relay flag at the end
	let length=new Buffer(4);
	length.writeUInt32LE(payload.length);
	let checksum=double_hash256(payload);
	checksum=checksum.slice(0,4);
	return Buffer.concat([magic,coin.TX_VERSION,length,checksum,payload]);
};

const Send=function(coin,data,ip,port=coin.PORT) {
	let addresses=[];
	let fakeip='127.0.0.1'; //should be your IP address and the receiver's one but we don't care
	let magic=new Buffer(4);
	magic.writeUInt32LE(coin.MAIN);
	let verack=Buffer.concat([magic,coin.TX_VERACK,new Buffer('00000000','hex'),new Buffer('5df6e0e2','hex')]);
	if (!ip) {
		switch (coin.VERSION_) {
			case 'BTG': addresses=['btg.suprnova.cc'];break;
			case 'BTC': addresses=['bitcoin.sipa.be'];break;
			case 'BCH': addresses=['bch.suprnova.cc'];break;
			case 'ZEC': addresses=['mainnet.z.cash'];break;
			default: return;
		};
	} else {
		addresses.push(ip);
	};
	console.log('Sending to '+addresses);
	addresses.forEach(function(addr) {
		let client=new net.Socket();
		client.setNoDelay(true);
		client.on('connect',function() {
			console.log('Connected to : '+addr+':'+port);
			let v=Version(fakeip,fakeip,coin);
			client.write(v);
			console.log('Sent version to '+addr);
		});
		client.on('data',function(d) {
			console.log('------ Answer received from '+addr);
			decode_simple(d,coin);
			console.log(d.toString('hex'));
			if (d.toString('hex').indexOf(coin.TX_VERACK.toString('hex'))!==-1) {
				console.log('-------- Verack received - completing handshake with '+addr);
				if (!data) {
					client.write(verack);
					/*
					console.log('----------------------------------------------- Getting tx from mempool');
					let length=new Buffer(4);
					let l=new Buffer([1]);//nb entries
					let v=new Buffer(4);
					v.writeUInt32LE(1);//type of entry (tx)
					let hash=reverse(new Buffer('6d79064beb221b26730bc16671bfb48ee686a67dc438cfaf502c6e4e5d3a4a4a','hex')); //mempool
					let payload=Buffer.concat([l,v,hash]);
					length.writeUInt32LE(payload.length);
					let getdata=Buffer.concat([magic,coin.TX_GETDATA,length,double_hash256(payload).slice(0,4),payload]);
					//console.log(getdata);
					client.write(Buffer.concat([verack,getdata]));
					*/
				};
				if (data) {
					console.log('------ Sending transaction to '+addr);
					let hs=new Buffer(data,'hex');
					client.write(Buffer.concat([verack,hs]));
					console.log('Sent '+hs.toString('hex')+' to '+addr);
					console.log('Sent verack + tx');
				};
			};
		});
		client.on('error',function(err) {console.log(err);console.log('Error with '+addr+':'+port)});
		client.on('end',function() {console.log('End connection with '+addr+':'+port)});
		client.connect(port,addr);
		setTimeout(function() {try {client.end()} catch(ee){}},10000);
	});
};

module.exports=Send;