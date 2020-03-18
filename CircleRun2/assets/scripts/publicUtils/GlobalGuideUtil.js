cc.Class({
    extends: cc.Component,

    properties: {
        buttonMask: cc.Node,
        titleLabel: cc.Label,
        goOnLabel: cc.Node,
        hero: cc.Node
    },
    onLoad() {
    },

    start() {
        cc.game.addPersistRootNode(this.node);
        this.node.active = false;
        Singleton.guideUtil = this;
    },
    updateHeroSkeletonData(skeletonData) {
        if (!this.hero.getComponent(sp.Skeleton)) {
            let skeleton = this.hero.addComponent(sp.Skeleton);
            skeleton.skeletonData = skeletonData;
            skeleton.premultipliedAlpha = false;
            skeleton.defaultSkin = 'jian1';
            skeleton.defaultAnimation = 'daiji';
            skeleton.loop = true;
            // this.hero.scale = 0.5;
        }
    },
    showGuide(obj) {
        return new Promise((r, j) => {
            let msg = obj.msg ? obj.msg : '';
            let targetNode = obj.targetNode ? obj.targetNode : null;
            let blockEvent = obj.blockEvent ? true : false;
            let hasNext = obj.hasNext ? true : false;
            if (blockEvent) {
                this.node.getComponent(cc.BlockInputEvents).enabled = true;
            } else {
                this.node.getComponent(cc.BlockInputEvents).enabled = false;
            }
            this.titleLabel.string = "";
            this.goOnLabel.active = false;
            // this.titleLabel.node.x = 0;
            // this.titleLabel.node.y = 0;
            this.node.x = cc.Canvas.instance.node.width * 0.5;
            this.node.y = cc.Canvas.instance.node.height * 0.5;
            this.node.width = cc.Canvas.instance.node.width;
            this.node.height = cc.Canvas.instance.node.height;

            if (targetNode) {
                this.hero.active = false;
                if (this.node.active) {
                    cc.tween(this.buttonMask)
                        .to(0.33, { position: this.buttonMask.parent.convertToNodeSpaceAR(targetNode.convertToWorldSpaceAR(cc.v2(0, 0))), width: targetNode.width, height: targetNode.height })
                        .call(() => {
                            this.titleLabel.node.x = 0;
                            this.titleLabel.node.y = this.buttonMask.y - this.buttonMask.height * 0.5 - 30;
                            this.titleLabel.string = msg;
                            this.goOnLabel.active = hasNext;
                            this.clickCallback = () => {
                                r();
                            };
                        })
                        .start();
                } else {
                    this.buttonMask.width = targetNode.width;
                    this.buttonMask.height = targetNode.height;
                    this.buttonMask.setPosition(this.buttonMask.parent.convertToNodeSpaceAR(targetNode.convertToWorldSpaceAR(cc.v2(0, 0))));

                    this.titleLabel.string = msg;
                    this.titleLabel.node.x = 0;
                    this.titleLabel.node.y = this.buttonMask.y - this.buttonMask.height * 0.5 - 30;
                    this.goOnLabel.active = hasNext;
                    this.clickCallback = () => {
                        r();
                    };
                }
            } else {
                this.hero.active = true;
                if (this.node.active) {
                    cc.tween(this.buttonMask)
                        .to(0.33, { position: cc.v2(0, 0), width: 0, height: 0 })
                        .call(() => {
                            this.goOnLabel.active = hasNext;
                            this.titleLabel.string = msg;
                            this.titleLabel.node.x = 0;
                            this.titleLabel.node.y = 0;
                            this.clickCallback = () => {
                                r();
                            };
                        })
                        .tart();
                } else {
                    this.goOnLabel.active = hasNext;
                    this.titleLabel.string = msg;
                    this.titleLabel.node.x = 0;
                    this.titleLabel.node.y = 0;
                    this.buttonMask.x = 0;
                    this.buttonMask.y = 0;
                    this.buttonMask.width = 0;
                    this.buttonMask.height = 0;
                    this.clickCallback = () => {
                        r();
                    };
                }
            }
            this.node.active = true;
        });
    },

    hideGuide() {
        console.log('hideGuide');
        this.node.active = false;
    },
    onClick(e) {
        if (this.clickCallback) {
            this.clickCallback();
            this.clickCallback = null;
        }
    }
    // update (dt) {},
});
