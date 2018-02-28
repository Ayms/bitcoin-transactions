var BS32='qpzry9x8gf2tvdw0s3jn54khce6mua7l';

var bs32_encode=function(arr) {
	var r='';
	var l=arr.length;
	for (var i=0;i<l;i++) {
		r+=BS32[arr[i]];
	};
	return r;
};

var bs32_decode=function(str) {
	var index;
	var r=[];
	var l=str.length;
	for (var i=0;i<l;i++) {
		index=BS32.indexOf(str[i]);
		r.push(index);
	};
	return r;
};

var to_code=function(val,len,code) {
	val=val.toString(code);
	while (val.length<len) {
		val='0'+val;
	};
	return val;
};

var to_5=function(payload) {
	var s=[];
	var r=[];
	var pad;
	while (payload.length>5) {
		s.push(payload.slice(0,5));
		payload=payload.slice(5);
	};
	s.push(payload);
	pad=to_code(parseInt(payload.toString('hex'),16),payload.length*8,2);
	while (pad.length%5) {
		pad=pad+'0';
	};
	s[s.length-1]=pad;
	s.forEach(function(val,i) {
		var tmp=val;
		if (i!==s.length-1) {
			tmp=to_code(parseInt(val.toString('hex'),16),val.length*8,2);
		};
		while (tmp.length) {
			r.push(parseInt(tmp.slice(0,5),2));
			tmp=tmp.slice(5);
		};
	});
	return r;
};

var and_xor=function(bin,data,boo) {
	var top,rest,top_,rest_;
	data=to_code(data,40,2);
	if (typeof bin!=="string") {
		bin=to_code(bin,40,2);
	};
	top=parseInt(bin.slice(0,8),2);
	rest=parseInt(bin.slice(8),2);
	top_=parseInt(data.slice(0,8),2);
	rest_=parseInt(data.slice(8),2);
	if (boo) {
		top&=top_;
		rest&=rest_;
	} else {
		top^=top_;
		rest^=rest_;
	};
	top=top>>>0; //useless but...
	rest=rest>>>0;
	return parseInt(to_code(top,2,16)+to_code(rest,8,16),16);
};

var get_hash_size=function(version) {
	switch (version&7) {
		case 0: return 160;
		case 1:	return 192;
		case 2:	return 224;
		case 3:	return 256;
		case 4:	return 320;
		case 5:	return 384;
		case 6:	return 448;
		case 7:	return 512;
	};
};

function get_type(version) {
	//console.log(to_code(version,8,2));
	switch (version&0x78) {
	  case 0: return 'p2pkh';
	  case 8: return 'p2sh';
	  default: throw ('Invalid address type');
	};
};

var polymod=function(v) {
	var c=1;
	var c0;
	var l=v.length;
	for (var i=0;i<l;i++) {
		var top,rest;
		var bin=to_code(c,40,2);
		c0=parseInt(bin.slice(0,5),2);
		c=and_xor(bin,0x07ffffffff,true);
		bin=to_code(c,40,2);
		c=parseInt(bin.slice(5)+'00000',2);
		c=and_xor(c,v[i]);
		if (c0&0x01) {c=and_xor(c,0x98f2bc8e61)};
		if (c0&0x02) {c=and_xor(c,0x79b76d99e2)};
		if (c0&0x04) {c=and_xor(c,0xf33e5fb3c4)};
		if (c0&0x08) {c=and_xor(c,0xae2eabe2a8)};
		if (c0&0x10) {c=and_xor(c,0x1e4f43e470)};
	};
	c=and_xor(c,1);
	return to_5(new Buffer(to_code(c,10,16),'hex'));
};

var checksum=function(payload,prefix) {
	var l=prefix.length;
	var v=[];
	for (var i=0;i<l;i++) {
		v.push(prefix.charCodeAt(i)&0x1f);
	};
	v[l]=0;
	v=v.concat(payload.concat([0,0,0,0,0,0,0,0]));
	return polymod(v);
};

var encode_b=function(hash,type,prefix) {
	var version,payload,checksum_;
	var p=prefix.length;
	var v=[];
	switch (type) {
		case 'p2pkh': version=0;break;
		case 'p2sh': version=8;break;
		default: throw "no type specified";
	};
	payload=Buffer.concat([new Buffer([version]),hash]);
	payload=to_5(payload);
	checksum_=checksum(payload,prefix);
	return prefix+':'+bs32_encode(payload.concat(checksum_));
};

var decode_b=function(addr) {
	var checksum_,checksum__;
	var prefix='bitcoincash';
	var buf=[];
	var hash,size,type,version;
	addr=addr.toLowerCase();
	addr=addr.split(':');
	if (addr.length>1) {
		prefix=addr[0];
		addr=addr[1];
	} else {
		addr=addr[0];
	};
	addr=bs32_decode(addr);
	checksum__=addr.slice(addr.length-8);
	addr=addr.slice(0,addr.length-8);
	checksum_=checksum(addr,prefix);
	if (checksum_.join('')!==checksum__.join('')) {
		throw "Invalid checksum";
	};
	hash=addr.map(function(val) {return to_code(val,5,2)});
	hash=hash.join('');
	version=parseInt(hash.slice(0,8),2);
	size=get_hash_size(version);
	type=get_type(version);
	hash=hash.slice(0,size+8);
	while (hash.length) {
		buf.push(parseInt(hash.slice(0,8),2));
		hash=hash.slice(8);
	};
	return {hash:new Buffer(buf).slice(1).toString('hex'),type:type};
};

module.exports.decode_b=decode_b;
module.exports.encode_b=encode_b;

/*

Tests

76a04053bda0a88bda5177b86a15c3b29f559873 1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu		bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a
cb481232299cd5743151ac4b2d63ae198e7bb0a9 1KXrWXciRDZUpQwQmuM1DbwsKDLYAYsVLR		bitcoincash:qr95sy3j9xwd2ap32xkykttr4cvcu7as4y0qverfuy
011f28e473c95f4013d7d53ec5fbc3b42df8ed10 16w1D5WRVKJuZUsSRzdLp9w3YGcgoxDXb		bitcoincash:qqq3728yw0y47sqn6l2na30mcw6zm78dzqre909m2r
76a04053bda0a88bda5177b86a15c3b29f559873 3CWFddi6m4ndiGyKqzYvsFYagqDLPVMTzC		bitcoincash:ppm2qsznhks23z7629mms6s4cwef74vcwvn0h829pq
cb481232299cd5743151ac4b2d63ae198e7bb0a9 3LDsS579y7sruadqu11beEJoTjdFiFCdX4		bitcoincash:pr95sy3j9xwd2ap32xkykttr4cvcu7as4yc93ky28e
011f28e473c95f4013d7d53ec5fbc3b42df8ed10 31nwvkZwyPdgzjBJZXfDmSWsC4ZLKpYyUw		bitcoincash:pqq3728yw0y47sqn6l2na30mcw6zm78dzq5ucqzc37

bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a
00000000
{ hash: '76a04053bda0a88bda5177b86a15c3b29f559873',
  type: 'p2pkh' }
bitcoincash:qr95sy3j9xwd2ap32xkykttr4cvcu7as4y0qverfuy
00000000
{ hash: 'cb481232299cd5743151ac4b2d63ae198e7bb0a9',
  type: 'p2pkh' }
bitcoincash:qqq3728yw0y47sqn6l2na30mcw6zm78dzqre909m2r
00000000
{ hash: '011f28e473c95f4013d7d53ec5fbc3b42df8ed10',
  type: 'p2pkh' }
bitcoincash:ppm2qsznhks23z7629mms6s4cwef74vcwvn0h829pq
00001000
{ hash: '76a04053bda0a88bda5177b86a15c3b29f559873',
  type: 'p2sh' }
bitcoincash:pr95sy3j9xwd2ap32xkykttr4cvcu7as4yc93ky28e
00001000
{ hash: 'cb481232299cd5743151ac4b2d63ae198e7bb0a9',
  type: 'p2sh' }
bitcoincash:pqq3728yw0y47sqn6l2na30mcw6zm78dzq5ucqzc37
00001000
{ hash: '011f28e473c95f4013d7d53ec5fbc3b42df8ed10',
  type: 'p2sh' }

var addr;

var hash=['76a04053bda0a88bda5177b86a15c3b29f559873','cb481232299cd5743151ac4b2d63ae198e7bb0a9','011f28e473c95f4013d7d53ec5fbc3b42df8ed10'];

hash.forEach(function(h) {
	addr=encode_b(new Buffer(h,'hex'),'p2pkh','bitcoincash');
	console.log(addr);
	console.log(decode_b(addr));
});

hash.forEach(function(h) {
	addr=encode_b(new Buffer(h,'hex'),'p2sh','bitcoincash');
	console.log(addr);
	console.log(decode_b(addr));
});

*/