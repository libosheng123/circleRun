const GroupType = cc.Enum({
    group_default: 'default',
    group_loop: 'loop',
    group_line: 'line',
    group_viewer: 'viewer',
    group_wall: 'wall',
    group_gold: 'gold'
});

const GetColor = [
    //cc.tintTo(0.5, 230, 64, 64),
    // cc.tintTo(0.5, 230, 128, 32),
    // cc.tintTo(0.5, 230, 230, 32),
    // cc.tintTo(0.5, 64, 230, 64),
    // cc.tintTo(0.5, 32, 230, 230),
    // cc.tintTo(0.5, 64, 64, 230),
    // cc.tintTo(0.5, 230, 32, 230)
];

const GameEvent = {

};

const Platforms = {
    QQ: "QQ",
    WX: "WX",
    TT: "TT",
    OP: "OP",
    VO: "VO"
};

module.exports = {
    GameEvent,
    Platforms,
    GroupType,
    GetColor
};