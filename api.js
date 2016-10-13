/* 
	所属公司: 湖南快乐益
	维护者邮箱:cgf_150@163.com
	目录
		1.移动提示类
			调用方法:tipBridge('提示',function(){
				//提示完毕执行函数
			});
		
		2.腾讯地图常用类
			调用步骤 
				引入js文件 地址http://map.qq.com/api/js?v=2.exp&key=46QBZ-CSPWU-2BUV6-B32ZC-JQ5N7-FDBEZ
				1.声明和配置conf对象
					var conf={
						tarId:'id',	//显示地图的容器的id
					}
				2.调用MapManage.createMap()方法
				3.接口说明
					a.定位(根据IP定位只能精确到市)
					MapManager.position({
						succ:function(data){
							//data.detail 为返回值里面包含 name(如长沙市) latLng(经纬度)
						},
						error:function(){
							//调用失败
						}
					});
					b.地址转为经纬度
					MapManager.getCoord('地址：如湖南省长沙市湖南工业职业技术学院 注意地面前面需要加省市',{
						sucss:function(data){
							//data 为经纬度
						},
						error:function(){
							//获取失败
						},
						locate:true/false	//是否在地图上显示，前提是conf配置了tarId，否则会报错哦
					});
					c.经纬度转地址
					MapManager.getLocation('经纬度',{
						succ:function(data){
							// data 为地址如湖南省长沙市....
						},
						error:function(){
							//获取失败
						},
						locate:true/false	//是否在地图上显示，前提是conf配置了tarId，否则会报错哦
					})

		3.滑动类
			1.基本的iscroll结构
			2.引入iscroll.probe.js
			3.配置参数
				var opt={
					upEle:'upEle',	//上拉加载提示容器
					downEle:'downEle',	//下拉刷新提示容器
					container:'#wrapper',	//iscroll容器
					upState:{				//上拉加载状态 下同
						default:'上拉加载',	//默认状态 可以使用html 比如 <b>上拉加载</b>
						ready:'释放加载',	//准备状态
						load:'正在加载'		//加载中状态
					},
					downState:{	//下拉刷新状态
						default:'下拉刷新',
						ready:'释放刷新',
						refresh:'正在刷新'
					}
				};
			4.引入api.js(即本文件)
			4.调用scrollBridge类
				scrollBridge.init();	//初始化
				scrollBridge.refresh(function(){	//刷新时需要做的操作，记住在刷新完毕之后需要调用scrollBridge.refreshFinish()方法
					//
				});
				scrollBridge.load(function(){	//加载时需要做的操作，记住在加载完毕之后需要调用scrollBridge.loadFinish()方法
					//
				});
		
		4.图片压缩类
			photoMini(obj,callback)
				obj files对象
				callback回调函数 参数data -> 图片被压缩的base64
			toDataURL(obj,callback); 
				参数同上，把图片文件base64化

*/

//1.移动提示类
function Tiplayer(){
	this.isIn=false;	//indicate the state
}
Tiplayer.prototype={
	init:function(tips,callback){
		this.tips=tips;
		this.callback=callback;
		this.createLayer();
	},
	createLayer:function(){
		if(this.isIn){
			return;
		}
		this.isIn=true;
		this.tipLay=document.createElement('div');
		this.tipLay.appendChild(document.createTextNode(this.tips));
		this.tipLay.setAttribute('id','tipLayer');
		this.tipLay.style.display="inline-block";
		document.body.appendChild(this.tipLay);
		this.tipLay.style.visibility="hidden";
		this.bgLayer=document.createElement('div');
		this.bgLayer.style="opacity:0;position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999";
		
		//calculate the center distance
		var tarLeft=0;
		var width=this.screen().width*0.3;
		var height=this.screen().height*0.1;
		var tarTop=this.screen().height*0.95/2;
		if(this.tipLay.offsetWidth>this.screen().width*0.7){
			tarLeft=(this.screen().width-this.screen().width*0.7-height)/2;
		}else{
			tarLeft=(this.screen().width-this.tipLay.offsetWidth-height)/2;
		}
		
		var sStyle="#tipLayer{position:absolute;left:"+tarLeft+"px;bottom:0px;background:rgba(0,0,0,0.5);color:#fff;max-width:"+(this.screen().width*0.7)+"px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:0px "+height/2+"px;height:"+height+"px;line-height:"+height+"px;text-align:center;border-radius:"+height+"px;transition:.8s;font-family:Airal,'Microsoft Yahei'; }\n.bombOff{opacity:0;}";

		if(document.getElementsByTagName('style').length){
			(document.getElementsByTagName('style')[0].innerHTML+=sStyle)
		}else{
			this.newStyle=document.createElement('style');
			this.newStyle.innerHTML=sStyle;
			document.getElementsByTagName('head')[0].appendChild(this.newStyle);
		}
		document.body.appendChild(this.bgLayer);
		var that=this;
		var timerTranslate=setTimeout(function(){
			that.tipLay.style.visibility="visible";
			that.tipLay.style.webkitTransform="translateY(-"+tarTop+"px)";
			clearTimeout(timerTranslate);
			timerTranslate=null;
		},50);
		var timerDelLayer=setTimeout(function(){
			that.tipLay.className="bombOff";
			that.tipLay.addEventListener('webkitTransitionEnd',function(){
				that.delLayer();
				clearTimeout(timerDelLayer);
				timerDelLayer=null;
			},false)
		},2000);
	},
	delLayer:function(){
		var that=this;
		document.body.removeChild(this.tipLay);
		document.body.removeChild(this.bgLayer);
		if(this.newStyle){
			document.getElementsByTagName('head')[0].removeChild(this.newStyle);
			this.newStyle=null;
		}
		this.isIn=false;
		if(this.callback){
			var timer=setTimeout(function(){
				that.callback.call(null);
				clearTimeout(timer);
				timer=null;
			},300);
		}
	},
	screen:function(){
		var w=document.documentElement.clientWidth;
		var h=document.documentElement.clientHeight;
		return {width:w,height:h}
	}
}
var tipBridge=(function tipBridge(){
	var instance=null
	return function(tips,callback){
		if(!instance){
			instance=new Tiplayer();
		}
		return instance.init(tips,callback);
	}
})()

//2.腾讯地图常用类
var conf={};
function Map(confOptions){
	this.opt=confOptions;
	this.initMap();
}
Map.prototype={
	initMap:function(){
		var that=this;
		if(that.opt.tarId){
			window.map = new qq.maps.Map(document.getElementById(that.opt.tarId),{
				center: new qq.maps.LatLng(39.914850, 116.403765),
				zoom: 13
			});
		}
	}
}
var MapManager={
	init:false,
	createMap:function(){
		new Map(conf);
		MapManager.init=true;
		MapManager.initMethod();
	},
	initMethod:function(){
		window.geocoder = new qq.maps.Geocoder();
	},
	getCoord:function(value,callback){
		if(!MapManager.init){ throw new Error('the map must inilization through the method: MapManager.createMap'); }
		var that=this;
		var lat=geocoder.getLocation(value);

		geocoder.setComplete(function(result) {
			if(callback.locate){
				that.updatePot(result.detail.location);
				that.createMark(result.detail);
			}
			if(callback.succ){
				callback.succ(result.detail.location);
			}
		})
		geocoder.setError(function() {
			if(callback.error){
				callback.error();
			}
		})
	},
	getAddress:function(value,callback){
		var that=this,coord=0;
		coord=value;
		if(typeof value == 'string'){
			var latLng=value.split(',');
			var lat=parseFloat(latLng[0]);
			var lng=parseFloat(latLng[1]);
			coord=new qq.maps.LatLng(lat,lng);
		}
		geocoder.getAddress(coord);

		geocoder.setComplete(function(result) {
			if(callback.locate){
				that.updatePot(result.detail.address);
				that.createMark(result.detail.address);
			}
			if(callback.succ){
				callback.succ(result.detail.address);
			}
		})
		geocoder.setError(function() {
			if(callback.error){
				callback.error();
			}
		})
	},
	createMark:function(data){
		var marker = new qq.maps.Marker({
           map:map,
           position: data.location
       });
       var info = new qq.maps.InfoWindow({
           map: map
       });
		qq.maps.event.addListener(marker, 'click', function() {
	       info.open(); 
	       info.setContent('<div style="text-align:center;white-space:nowrap;'+
		       'margin:10px;">'+data.address+'</div>');
	       info.setPosition(data.location); 
	   });
	},
	updatePot:function(pot){
		map.setCenter(pot);
	},
	position:function(callback){
		var cityServices=new qq.maps.CityService();
		cityServices.setComplete(function(result){
			if(callback.succ){
				callback.succ(result);
			}
		});
		cityServices.setError(function(result){
			if(callback.error){
				callback.error();
			}
		});
		cityServices.searchLocalCity();
	}
}

//3.滑动类
var opt={}
var PageScroll=(function pageScroll(){
	var pageIScroll=function(opt){
		var myScroll=null,options=null,_maxScrollY=0,upEle=null,downEle=null,upOffset=0,downOffset=0,upTimer=null;
		this.option=opt;
		this.init=function(){
			var that=this;
			window.addEventListener('load',function(){
				upEle=document.getElementById(that.option.upEle);
				downEle=document.getElementById(that.option.downEle);
				upOffset=upEle.offsetHeight;
				downOffset=downEle.offsetHeight;

				options={
					probeType:1,
					useTransition:false,
					startY:-downOffset,
					mousewheel:true
				}
				myScroll=new IScroll(that.option.container,options);
				_maxScrollY=myScroll.maxScrollY=myScroll.maxScrollY+upOffset;
				myScroll.on('scrollStart',function(){
					that.scrollStart();
				});
				myScroll.on('scroll',function(){
					that.scrollMove();
				});
				myScroll.on('scrollEnd',function(){
					that.scrollEnd();
				});
			},false);
		}
		this.scrollStart=function(){
			upEle.style.visibility="visible";
			downEle.style.visibility="visible";
		}
		this.scrollMove=function(){
			var nowY=myScroll.y>>0;
			if(nowY>40&&downEle.className.indexOf('flip')==-1){
				downEle.className+=' flip';
				downEle.innerHTML=this.option.downState.ready||'释放刷新';
			}else if(nowY<=(_maxScrollY-upOffset)&&upEle.className.indexOf('flip')==-1){
				upEle.className+=' flip';
				upEle.innerHTML=this.option.upState.ready||'释放刷新';
				_maxScrollY=myScroll.maxScrollY=myScroll.maxScrollY-upOffset;
			}
		}
		this.scrollEnd=function(){
			if(downEle.className.indexOf('flip')==-1&&myScroll.y>myScroll.options.startY){
				downEle.innerHTML=this.option.downState.default||'下拉刷新...';
				myScroll.scrollTo(0,myScroll.options.startY,800);
			}else if(downEle.className.indexOf('flip')>0&&myScroll.y>myScroll.options.startY){
				downEle.className+=' refreshing';
				downEle.innerHTML=this.option.downState.refresh||'正在刷新...';
				this.fnRefresh();
			}else if(upEle.className.indexOf('flip')!=-1){
				upEle.className+=' loading';
				upEle.innerHTML=this.option.upState.load||"正在加载...";
				this.fnLoad();
			}
		}
		this.fnRefresh=function(callBack){
			this.fnRefresh=callBack;
		}
		this.fnLoad=function(callBack){
			this.fnLoad=callBack;
		}
		this.refreshFinish=function(){
			myScroll.scrollTo(0,myScroll.options.startY,800);
			downEle.className="downEle";
			downEle.innerHTML=this.option.downState.default||"下拉刷新...";
		}
		this.loadFinish=function(){
			upEle.className='upEle';
			upEle.innerHTML=this.option.downState.default||'上拉加载';
			_maxScrollY=myScroll.maxScrollY=myScroll.maxScrollY+upOffset;
			myScroll.scrollToElement("p.upEle",100);
		}
	}
	return pageIScroll;
})()
var scrollBridge=(function(fnRefresh,fnLoad){
	try{
		var option=opt;
	}catch(e){
		throw new Error('please config the opt object first !');
	}
	var pageScroll=new PageScroll(option); 
	return {
		init:function(){
			pageScroll.init.call(pageScroll);
		},
		refresh:function(fn){
			pageScroll.fnRefresh.call(pageScroll,fn);
		},
		load:function(fn){
			pageScroll.fnLoad.call(pageScroll,fn);
		},
		refreshFinish:function(){
			pageScroll.refreshFinish.call(pageScroll);
		},
		loadFinish:function(){
			pageScroll.loadFinish.call(pageScroll);
		}
	}
})();

//4.图片压缩类
function photoMini(obj,callback){
	var base64URL='';
	try{
		toDataURL(obj,function(data){
			lrz(data)
			        .then(function (rst) {
			            base64URL=rst.base64;
			            callback.succ(base64URL);
			        })
			        .catch(function (err) {
			            callback.error(err);
			        })
		})
	}catch(e){
		throw new Error('please include lrz.bundle.js first !');
	}
};
function toDataURL(fileObj,callBack){
	var fileReader=new FileReader();
	fileReader.onload=function(e){
		callBack(this.result);
	}
	fileReader.readAsDataURL(fileObj);
	fileReader.onerror=function(){
		console.log('error in api.js file ! function name is toDataURL');
	}
}


