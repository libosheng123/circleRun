const Types = require('./../publicUtils/types');
const GroupType = Types.GroupType;

cc.Class({
    extends: cc.Component,

    properties: {
        money: 0
    },


    onLoad() {
        this.node.wall = this;
    },

    start() {

    },

    onCollisionEnter(other, self) {

    },

    onCollisionExit(other, self) {
        if (other.node.group == GroupType.group_gold) {
            other.node.gold.goldRecycle();
            this.money++;
            let moneyNum = cc.sys.localStorage.getItem('moneyNum');
            let moneyTotal = JSON.parse(moneyNum) + this.money;
            cc.sys.localStorage.setItem('moneyNum', moneyTotal);
            cc.log('钱: ', moneyTotal);
        }
    },
    update(dt) {

    },
});
