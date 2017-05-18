// let GameDefine = require("GameDefine")

let GameAI = {
    tar: null,
    selfCards: null,
    cards: null
}

GameAI.findOneBigCard = function (v, num, hasBombs = true) {     // v:牌的权重值，当前牌型的数量
    let { tar, cards, selfCards } = this.initCard();

    // 先找单张拍
    for (let i = cards.length; i >= 0; --i)
        if (cards[i] > v && cards[i] != cards[i - 1] && cards[i] != cards[i + 1]) {
            tar.push([selfCards[i]])
        }

    //没有单张找到随意一张比较大的牌
    if (tar.length == 0)
        for (let i = cards.length; i >= 0; ++i)
            if (cards[i] > v)
                tar.push(cards[i]);


    if (hasBombs == false)
        return tar

    //找炸弹
    // if (tar.length == 0)
    // tar = GameAI.getBombs(-1, tar);


    return tar
}

GameAI.findPair = function (v, num, hasBombs = true) {     // v:牌的权重值，当前牌型的数量
    let { tar, cards, selfCards } = this.initCard()
    //先找纯对
    for (let i = v + 1; i <= 12; ++i) {
        if (this.getNumOfValueInCards(cards, i) == 2) {
            let pos = this.getCardPos(cards, i)
            tar.push([selfCards[pos], selfCards[pos + 1]])
        }
    }

    //然后找三张中的纯对
    for (let i = v + 1; i <= 12; ++i) {
        if (this.getNumOfValueInCards(cards, i) == 3) {
            let pos = this.getCardPos(cards, i)
            tar.push([selfCards[pos], selfCards[pos + 1]])
            tar.push([selfCards[pos + 1], selfCards[pos + 2]])
            tar.push([selfCards[pos], selfCards[pos + 2]])
        }
    }

    if (hasBombs = true)
        return tar

    //然后找炸弹
    // let bombs_tar = GameAI.getBombs(-1, {})
    // tar.push(bombs_tar)
    return tar

}

GameAI.findSeqPairs = function (v, num) {     // v:牌的权重值，当前牌型的数量
    let { tar, cards, selfCards } = this.initCard();

    for (let i = 11; i > v; --i) {   // 11表示A 找顺子
        let bFind = true;
        for (let j = 0; j <= num / 2 - 1; ++j) {
            if (this.getNumOfValueInCards(cards, i - j) < 2) {
                bFind = false;
                break;
            }
        }
        if (bFind) {
            let allSolution = new Array()
            for (let j = 0; j <= num / 2 - 1; ++j) {
                var pos = this.getCardPos(cards, i - j)
                allSolution.push(selfCards[pos])
                allSolution.push(selfCards[pos + 1])
            }
            tar.push(allSolution)
        }
    }
    //然后找炸弹
    // tar = GameAI.getBombs(-1, tar)
    return tar
}

GameAI.findStraight = function (v, num) {      // v:牌的权重值，当前牌型的数量
    let { tar, cards, selfCards } = this.initCard()
    // let n = selfCards.length;
    if (selfCards.length < num) {
        // tar = GameAI.getBombs(-1, tar)
        // return tar
    }

    for (let i = 11; i > v + 1; --i) {  // 11表示A 找顺子没有
        let bFind = true;
        for (let j = 0; j < num; ++j) {
            if (this.getNumOfValueInCards(cards, [i - j]) < 1) {
                bFind = false;
                break;
            }
        }
        if (bFind = true) {
            let one_solution = [];
            let is_solution = true;
            for (let j = 0; j < num; ++j) {
                let pos = this.getCardPos(cards, i - j)
                let card_value = this.selfCards[pos]
                one_solution.push(card_value)
                if (this.getCardWeight(card_value) < v)
                    is_solution = false;

            }
            if (is_solution == true)
                tar.push(one_solution)
        }
    }
    // tar = GameAI.getBombs(-1, tar)
    return tar
}

GameAI.findFourCards = function (v, num) {   // 四带两张牌
    let { tar, cards, selfCards } = this.initCard()
    // 先找到大过的四张牌
    let allFourCards = []
    allFourCards = GameAI.getBombs(v, allFourCards, false)

    for (let i = 0; i < allFourCards.length; ++i)
        if (num == 6) {  // 四带两张单牌
            for (let j = cards.length - 1; j >= 0; --j) {
                for (let k = j - 1; k >= 0; --k) {
                    let card_weight = this.getCardWeight(allFourCards[i][0])
                    if (j != k && card_weight != cards[j] && card_weight != cards[k]) {
                        let four_card_item = this.cloneCards(allFourCards[i])
                        four_card_item.push(selfCards[k])
                        four_card_item.push(selfCards[j])
                        tar.push(four_card_item)
                    }
                }
            }
        } else if (num == 8) {  // 四代两队
            let allPair = this.findPair(-1)  // 找到所有的对子, 过滤掉炸弹和王炸
            for (let j = 0; j < allPair.length; ++j) {
                if (allPair[j].length == 4 || (allPair[j].length == 2 && (allPair[j][0] == 52 || allPair[j][0] == 53))) {
                    allPair.splice(j, 1)
                    j--;
                }
            }
            for (let j = 0; j < allPair.length; ++j)
                for (let k = j + 1; k < allPair.length; ++k) {
                    let four_card_item = this.cloneCards(allFourCards[i])
                    four_card_item.push(allPair[j][0])
                    four_card_item.push(allPair[j][1])
                    four_card_item.push(allPair[k][0])
                    four_card_item.push(allPair[k][1])
                    tar.push(four_card_item)
                }
        }
    // tar = GameAI.getBombs(-1, tar) // 找到炸弹
    return tar
}

GameAI.findPlanes = function (v, num, planenum) {
    let { tar, cards, selfCards } = this.initCard()
    //牌不够直接找炸弹
    if (selfCards.length < num) {
        return GameAI.getBombs(-1, tar)
    }

    for (let i = v + 1; i < 12; ++i) {
        let bFind = true;
        for (let j = 0; j < planenum; ++j) {
            if (this.getNumOfValueInCards(cards, i + j) < 3) {
                bFind = false
                break;
            }
        }

        if (bFind) {
            let plane_item = []
            for (let j = 0; j < planenum; ++j) {
                let pos = this.getCardPos(cards, i + j)
                for (let k = 0; k < 3; ++k)
                    plane_item.push(this.selfCards[pos + k])
            }

            let extra_num = num - planenum * 3
            if (extra_num == 0) {
                tar.push(plane_item)
            } else if (extra_num == planenum) {
                let all_one_cards = this.findOneBigCard(-1, 0, false)
                for (let j = 0; j < all_one_cards.length; ++j) {
                    for (let k = j + 1; k < all_one_cards.length; ++k) {
                        let v_1 = all_one_cards[k]
                        let v_2 = all_one_cards[j]
                        // if (all_one_cards[k] != && all_one_cards[k] != && all_one_cards[k] != && all_one_cards[k] != )
                        let copy_plane_item = this.cloneCards(plane_item)
                        copy_plane_item.push(all_one_cards[j][0])
                        copy_plane_item.push(all_one_cards[k][0])
                        tar.push(copy_plane_item)
                    }
                }
            } else if (extra_num == planenum * 2) {
                let all_pair_cards = this.findPair(-1, 0, false)
                for (let j = 0; j < all_pair_cards.length; ++j)
                    for (let k = j + 1; k < all_pair_cards.length; ++k) {
                        let copy_plane_item = this.cloneCards(plane_item)
                        copy_plane_item.push(all_pair_cards[j][0])
                        copy_plane_item.push(all_pair_cards[j][1])
                        copy_plane_item.push(all_pair_cards[k][0])
                        copy_plane_item.push(all_pair_cards[k][1])
                        tar.push(copy_plane_item)
                    }
            }
        }
    }

    return tar
}


GameAI.getBombs = function (v, bombs, hasJoker = true) {
    let { tar, cards, selfCards } = this.initCard()
    // 找到一般的王炸
    for (let i = v + 1; i <= 12; i++) {     // 12 牌的权重牌的值
        if (this.getNumOfValueInCards(cards, i) == 4) {
            let pos = this.getCardPos(cards, i)
            let bomb_item = []
            for (let j = pos; j < pos + 4; ++j)
                bomb_item.push(this.selfCards[j])
            tar.push(bomb_item)
        }
    }
    // 王炸
    if (hasJoker == true && selfCards[0] == 53 && selfCards[1] == 52)
        tar.push(selfCards[0], selfCards[1])

    return tar
}

GameAI.initCard = function () {
    this.tar = new Array()
    // this.selfCards = [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 0, 0, 1, 1].reverse() /*SelfData.getCards()*/
    this.cards = this.cloneCards(this.selfCards)
    this.processCards(this.cards)
    return { tar: this.tar, cards: this.cards, selfCards: this.selfCards }
}

GameAI.cloneCards = function (cards) {
    return JSON.parse(JSON.stringify(cards))
}

GameAI.processCards = function (cards) {
    for (let i = 0; i < cards.length; ++i)
        cards[i] = this.getCardWeight(cards[i])
}

GameAI.getCardWeight = function (card_value) {
    if (card_value < 52) {
        card_value = (card_value % 13) - 2
        if (card_value == -2) {
            card_value = 11
        }
        if (card_value == -1) {
            card_value = 12
        }
    }
    return card_value
}

GameAI.getNumOfValueInCards = function (cards, v) {//获取cards当中值为v的牌的数量, cards是事先排好序的
    let num = 0;
    for (let i = 0; i < cards.length; ++i)
        if (cards[i] == v)
            num = num + 1
        else if (cards[i] < v)
            break;
    return num
}

GameAI.getCardPos = function (cards, v) {	//获取cards中值为v的牌的位置
    for (let i = 0; i < cards.length; ++i)
        if (cards[i] == v)
            return i
    return 0
}
GameAI.selfCards = [2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 0, 1].reverse() /*SelfData.getCards()*/

GameAI.initCard()

// console.log(GameAI.selfCards)
console.log(GameAI.cards)
// let ss = GameAI.findOneBigCard(-1, 0)
// let ss = GameAI.findPair(0)
// let ss = GameAI.findSeqPairs(3, 20)
// let ss = GameAI.findStraight(3, 5)
// let ss = GameAI.findFourCards(0, 8)
let ss = GameAI.findPlanes(0, 10, 2)
console.log(ss)
exports = GameAI