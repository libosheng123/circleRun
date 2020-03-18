cc.Class({
    extends: cc.Component,

    properties: {
        length: {
            get() {
                return this._length;
            },
            set(v) {
                this._length = v;
                this.node.width = v;
                let boxCollider = this.node.getComponent(cc.BoxCollider);
                boxCollider.size = cc.size(v, 10);
                boxCollider.offset = cc.v2(v * 0.5, 0);
            }
        }
    },


    onLoad() {
        this.node.line = this;
    },

    lineRecycle() {
        let pool = this.node.pool;
        if (pool) {
            this.node.pool.put(this.node);
            this.node.pool = null;
            // cc.log('line recycle');
        }
    },



    start() {
    },
    // update (dt) {},
});
