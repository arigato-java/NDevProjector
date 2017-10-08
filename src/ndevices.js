(function(exports){
'use strict';
const mastodon_access_token='';
const mastodon_api_url='';
function JavaDevicesProjector(callback){
	this.callback=callback;
}
JavaDevicesProjector.prototype.project=function(atTime){
	const javapointX=Date.UTC(2015,9,5,16,41,9); // 2015-Oct-05T16:41:00Z 7 Billion Devices (Oracle India)
	const javapointY=Date.UTC(2016,7,29,16,58,52); // 2016-08-29T16:58:52Z 15 Billion Devices (go.java)
	const tXY=javapointY-javapointX;

	const logdevX=Math.log(7e9);
	const logdevY=Math.log(15e9);
	const devdiffXY=logdevY-logdevX;

	const tNX=atTime-javapointX;
	const projection=Math.round(Math.exp(logdevX+(tNX/tXY)*devdiffXY));

	return projection;
};
JavaDevicesProjector.prototype.projectionAnnouncementString=function(atTime){
	const ndev=this.project(atTime);
	const ndev_str=new Intl.NumberFormat().format(ndev);
	const options={'timeZone':'Asia/Tokyo',
		year:'numeric',month:'numeric',day:'numeric',
		hour:'numeric',minute:'numeric',second:'numeric',
		hour12: false};
	const time_str=new Intl.DateTimeFormat('japanese',options).format(atTime);
	var msg=ndev_str+' のデバイスで走る Java ('+time_str+' 現在; 推計)';
	return msg;
};
JavaDevicesProjector.prototype.post=function(){
	var msg=this.projectionAnnouncementString(Date.now());
	var Masto=require('mastodon');
	var M=new Masto({
		access_token:mastodon_access_token,
		timeout_ms: 5*1000,
		api_url:mastodon_api_url
	});
	M.post('statuses',{'status':msg}).then(res=>{this.callback({'msg':msg})});
};
function main(){
	return new Promise((resolve,reject)=>{
		var jp=new JavaDevicesProjector((res)=>{resolve(res)});
		jp.post();
	});
}
exports.main=main;
})(exports);
