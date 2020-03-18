cc.Class({
    extends: cc.Component,

    properties: {
    },


    onLoad() {
        this.node.gold = this;
    },

    goldRecycle() {
        let pool = this.node.pool;
        if (pool) {
            this.node.pool.put(this.node);
            this.node.pool = null;
            // cc.log('gold recycle');
        }
    },



    start() {
    },
    // update (dt) {},
});
