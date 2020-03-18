var PrefabPool = cc.Class({
    name: "PrefabPool",
    properties: {
        name: '',
        prefab: cc.Prefab,
        initCount: 1
    }
});

cc.Class({
    extends: cc.Component,
    properties: {
        prefabPools: {
            default: [],
            type: PrefabPool
        }
    },

    onLoad() {
        this.node.nodePoolUtil = this;
        for (let i = 0; i < this.prefabPools.length; i++) {
            let prefabPool = this.prefabPools[i];
            if (!this[prefabPool.name]) {
                this[prefabPool.name] = new cc.NodePool();
                this[prefabPool.name].prefab = prefabPool.prefab;
            }
            for (let j = 0; j < prefabPool.initCount; j++) {
                this[prefabPool.name].put(cc.instantiate(this[prefabPool.name].prefab));
            }
        }
    },
    start() {

    },
    getPrefab(poolName) {
        let prefabPool = this[poolName];
        if (!prefabPool) {
            return;
        }
        let prefab = prefabPool.get();
        if (!prefab) {
            prefab = cc.instantiate(prefabPool.prefab);
        }
        prefab.pool = prefabPool;
        return prefab;
    },
    putPrefab(poolName, prefab) {
        if (this[poolName]) {
            this[poolName].put(prefab);
        }
    },
    putNode(node) {
        let pool = node.pool;
        node.pool = null;
        if (pool) {
            pool.put(node);
        }
    }
    // update (dt) {},
});
