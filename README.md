# happyiApi
湖南快乐益基础api

#所属公司: 湖南快乐益
#维护者邮箱:cgf_150@163.com
#目录
	
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
			
