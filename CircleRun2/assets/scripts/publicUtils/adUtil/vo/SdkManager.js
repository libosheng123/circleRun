


window.SdkManager = module.exports = {
	instance:null,
	init:function(obj){
		this._bannerAd = null;
	},
	onHide(callBack){
		callBack();
	},
	onShow(callBack){
		callBack();
	},
	getHaveVideo(){
		return true;
	},
	showBannerByBottom(){
		if(this._bannerAd && this._bannerAd.isValid){
			return;
		}
		var bg = new cc.Node('bg');
		this._bannerAd = bg;
		bg.anchorY = 0;
		bg.addComponent(cc.Sprite);
		cc.loader.load('http://idata.igame58.com/oppo/q_ad/bannerNativeBg.png', (err, texture) => {
			if(bg.isValid){
				bg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
				bg.width = 720;
				bg.height = 115;
			}
		});
		var fNode = cc.director.getScene();
		bg.x = cc.winSize.width/2;
		fNode.addChild(bg,999); 
		cc.game.addPersistRootNode(bg);
	},
	hideBanner(){
		if(this._bannerAd && this._bannerAd.isValid){
			this._bannerAd.destroy();
		}
	},
	showRewardedVideoAd(callBack){
		var layerBg = new cc.Node("layerBg");
		layerBg.width = 2560;
		layerBg.height = 2560;
		layerBg.x = cc.winSize.width/2;
		layerBg.y = cc.winSize.height/2;
		var scene = cc.director.getScene();
		scene.addChild(layerBg);
		layerBg.zIndex = 9999;
		//关闭按钮
		layerBg.on(cc.Node.EventType.TOUCH_START, function(event){
		}, );
		var titleLabel = new cc.Node("titleLabel");
		titleLabel.addComponent(cc.Label);
		titleLabel.getComponent(cc.Label).fontSize = 30;
		titleLabel.getComponent(cc.Label).enableWrapText = true;
		titleLabel.width = cc.winSize.width - 200;
		titleLabel.getComponent(cc.Label).string = "视频播放回调的测试";
		titleLabel.x = 0;
		titleLabel.y = 100;
		layerBg.addChild(titleLabel);
		var buttonSuccess = new cc.Node("buttonSuccess");
		buttonSuccess.addComponent(cc.Label);
		buttonSuccess.getComponent(cc.Label).fontSize = 30;
		buttonSuccess.getComponent(cc.Label).string = "播放成功";
		buttonSuccess.x = -100;
		buttonSuccess.y = -100;
		layerBg.addChild(buttonSuccess);
		//关闭按钮
		buttonSuccess.on(cc.Node.EventType.TOUCH_START, (event)=>{
			scene.removeChild(layerBg);
			callBack(true);
		}, );
		var buttonFailed = new cc.Node("buttonFailed");
		buttonFailed.addComponent(cc.Label);
		buttonFailed.getComponent(cc.Label).fontSize = 30;
		buttonFailed.getComponent(cc.Label).string = "播放失败";
		buttonFailed.x = 100;
		buttonFailed.y = -100;
		layerBg.addChild(buttonFailed);
		//关闭按钮
		buttonFailed.on(cc.Node.EventType.TOUCH_START, (event)=>{
			scene.removeChild(layerBg);
			callBack(false);
		}, );
	},
	showSpotByFinish(){
		this.showSopt();
	},
	showSpotByPause(){
		this.showSopt();
	},
	showSopt(){
		var bg = new cc.Node('pingbi');
		bg.addComponent(cc.BlockInputEvents);
		bg.width = 2560;
		bg.height = 2560;
		var fNode = cc.director.getScene();
		bg.x = cc.winSize.width/2;
		bg.y = cc.winSize.height/2;
		fNode.addChild(bg,999); 
		cc.game.addPersistRootNode(bg);
		bg.on(cc.Node.EventType.TOUCH_START, (event)=>{
			bg.destroy();
		}, );
		var sp = new cc.Node('sp');
		sp.addComponent(cc.Sprite);
		bg.addChild(sp);
		sp.opacity = 50;
		cc.loader.load('http://idata.igame58.com/oppo/q_ad/oppo_native_insters_layerBg.png', (err, texture) => {
			if(sp.isValid){
				sp.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
				sp.width = 2560;
				sp.height = 2560;
			}
		});
		var label = new cc.Node('label');
		bg.addChild(label);
		label.addComponent(cc.Label);
		label.getComponent(cc.Label).fontSize = 30;
		label.getComponent(cc.Label).lineHeight = 35;
		label.getComponent(cc.Label).string = '测试插屏 点击任意区域关闭';
	}
}
