/*
牌的编码规则：一副牌54张编码成0 - 53
0- 12为方块，0为方块3, 11为方块A，12为方块2
13- 25为梅花，13为梅花3, 24为梅花A，25为梅花2
26- 38为红桃，26为红桃3, 37为红桃A，38为红桃2
39- 51为黑桃，39为黑桃3, 50为黑桃A，51为黑桃2
52为小王，53为大王
*/
//牌型定义
GameDefine = {}
GameDefine.CardsType = {
    Wrong = -1,				//什么都不是
    Pass = 0, //过
    Single = 1, //单张
    Pair = 2, //一对
    Seq_Pairs = 3, //连对
    Straight = 4, //顺子
    For_Cards = 5, //四张带两张或两对
    Bomb = 6, //炸弹
    GhostBomb = 7, //王炸
    ThreeCards = 8, //三张
    Plane = 9, //双飞
    ThreePlane = 10, //三飞
    FourPlane = 11, //四飞
    FivePlane = 12, //五飞
    SixPlane = 13, //六飞
};
exports = GameDefine;