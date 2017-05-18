var GameDefine = {}
GameDefine.CardsType = {
    Wrong: -1,				//什么都不是
    Pass: 0, //过
    Single: 1, //单张
    Pair: 2, //一对
    Seq_Pairs: 3, //连对
    Straight: 4, //顺子
    For_Cards: 5, //四张带两张或两对
    Bomb: 6, //炸弹
    GhostBomb: 7, //王炸
    ThreeCards: 8, //三张
    Plane: 9, //双飞
    ThreePlane: 10, //三飞
    FourPlane: 11, //四飞
    FivePlane: 12, //五飞
}



var GameLogic = {
    //card: [3, 3, 4, 4, 4, 5, 5, 5]
}

GameLogic.checkCardType = function (nCount, cards) {

    if (nCount == 0 || nCount == null) {
        return { cardType: GameDefine.CardsType.Pass, cardVelue: 0 }
    }

    let tempCards = JSON.parse(JSON.stringify(cards))
    this.processCards(tempCards)

    let checkResult = { isSucess: false, value: -1, cardType: -1 }

    this.checkSingle(nCount, cards, checkResult)
    if (checkResult.isSucess)
        return checkResult

    this.checkPair(nCount, tempCards, checkResult)
    if (checkResult.isSucess)
        return checkResult

    this.checkGhostBomb(nCount, tempCards, checkResult)
    if (checkResult.isSucess)
        return checkResult

    this.checkThreeCards(nCount, tempCards, checkResult)
    if (checkResult.isSucess)
        return checkResult


    this.checkBomb(nCount, tempCards, checkResult)
    if (checkResult.isSucess)
        return checkResult

    this.checkStraight(nCount, tempCards, checkResult)
    if (checkResult.isSucess)
        return checkResult

    this.checkSeqPairs(nCount, tempCards, checkResult)
    if (checkResult.isSucess)
        return checkResult

    this.checkFourCards(nCount, tempCards, checkResult)
    if (checkResult.isSucess)
        return checkResult

    this.checkPlane(nCount, tempCards, checkResult)
    if (checkResult.isSucess)
        return checkResult



    return checkResult

}

GameLogic.checkSingle = function (nCount, cards, checkResult) {
    if (nCount == 1) {
        checkResult.isSucess = true;
        checkResult.cardType = GameDefine.CardsType.Single
        checkResult.value = cards[0]
        return checkResult
    }
}

GameLogic.checkPair = function (nCount, cards, checkResult) {
    if (nCount == 2 && cards[0] == cards[1]) {
        checkResult.isSucess = true;
        checkResult.cardType = GameDefine.CardsType.Pair;
        checkResult.value = cards[0]
    }
}

GameLogic.checkGhostBomb = function (nCount, cards, checkResult) {
    if (nCount == 2 && cards[0] == 52 && cards[1] == 53) {
        checkResult.isSucess = true;
        checkResult.cardType = GameDefine.CardsType.GhostBomb
        checkResult.value = cards[0]
    }
}

GameLogic.checkThreeCards = function (nCount, cards, checkResult) {
    if (nCount == 3 || nCount == 4 || nCount == 5) {
        let count_array = []
        let i = 0
        while (i++ < 12)
            count_array.push(0)
        for (let i = 0; i < cards.length; ++i)
            count_array[cards[i]] += 1
        let has_three_card = false
        let has_pair_card = false;
        let card_value = -1

        for (let i = 0; i < count_array.length; ++i) {
            if (count_array[i] == 3) {
                has_three_card = true;
                card_value = i
            }

            if (count_array[i] == 2)
                has_pair_card = true;
        }

        if (has_three_card && (nCount == 3 || nCount == 4 || (nCount == 5 && has_pair_card))) {
            checkResult.isSucess = true;
            checkResult.cardType = GameDefine.CardsType.ThreeCards
            checkResult.value = card_value
        }
    }
}

GameLogic.checkBomb = function (nCount, cards, checkResult) {
    if (nCount == 4 && cards[0] == cards[1] && cards[0] == cards[2] && cards[0] == cards[3]) {
        checkResult.isSucess = true;
        checkResult.cardType = GameDefine.CardsType.Bomb
        checkResult.value = cards[0]
    }
}

GameLogic.checkStraight = function (nCount, cards, checkResult) {
    if (cards.length >= 5 && cards.length < 12) {
        cards.sort(function (a, b) {
            return a - b
        })

        let isStraight = true;
        for (let i = cards.length - 1; i >= 1; --i) {
            let difference = Math.abs(cards[i] - cards[i - 1])
            if (cards[i] == 52 || cards[i] == 53 || cards[i] == 12 || difference != 1)
                isStraight = false
        }

        if (isStraight) {
            checkResult.isSucess = isStraight;
            checkResult.cardType = GameDefine.CardsType.Straight
            checkResult.value = cards[0]
        }
    }
}

GameLogic.checkSeqPairs = function (nCount, cards, checkResult) {
    if (cards.length >= 6 && cards.length < 16 && cards.length % 2 == 0) {
        cards.sort(function (a, b) {
            return a - b
        })

        let isSeqPairs = true;
        for (let i = 1; i < cards.length; i += 2) {
            let difference_1 = Math.abs(cards[i] - cards[i - 1]) // 两队相等
            let difference_2 = (i == cards.length - 1) ? 1 : Math.abs(cards[i] - cards[i + 1])  // 相差必须为一
            if (cards[i] == 52 || cards[i] == 53 || cards[i] == 12 || difference_1 != 0 || difference_2 != 1)
                isSeqPairs = false
        }

        if (isSeqPairs) {
            checkResult.isSucess = isSeqPairs;
            checkResult.cardType = GameDefine.CardsType.Seq_Pairs
            checkResult.value = cards[0]
        }
    }
}

GameLogic.checkFourCards = function (nCount, cards, checkResult) {  // 检测四代两队
    if (nCount == 6 || nCount == 8) {
        let count_array = []
        for (let i = 0; i <= 12; ++i)
            count_array.push(0)
        for (let i = 0; i < cards.length; ++i)
            count_array[cards[i]]++


        count_array.sort(function (a, b) { return b - a })
        if (count_array[0] == 4 && (nCount == 6 || (nCount == 8 && count_array[1] == 2 && count_array[2] == 2))) {
            checkResult.isSucess = true;
            checkResult.cardType = GameDefine.CardsType.For_Cards
            checkResult.value = cards[0]
        }
    }
}

GameLogic.checkPlane = function (nCount, cards, checkResult) {
    if (nCount >= 6) {
        // cards = [3, 4, 4, 4, 5, 6, 6, 6, 6, 7, 7, 7]
        let count_array = []
        //统计每个配置相应的牌的个数
        for (let i = 0; i <= 12; ++i)
            count_array.push([i, 0])
        for (let i = 0; i < cards.length; ++i)
            count_array[cards[i]][1]++
        count_array.sort(function (a, b) {
            if (b[1] == a[1])
                return a[0] - b[0]
            else
                return b[1] - a[1]
        })
        console.log(count_array)

        let statistic_array = [0, 0, 0, 0, 0]   // 统计出现4/3/2/1张牌的个数
        let is_three_seq = false
        for (let i = 0; i < count_array.length; i++) {
            if (count_array[i][1] > 0) {
                let count = count_array[i][1]
                statistic_array[count]++
                if (count_array[i][1] == 3 && count_array[i + 1] != null && count_array[i + 1][1] == 3) {
                    if (count_array[i + 1][0] - count_array[i][0] == 1) {
                        is_three_seq = true;
                    }
                }
            }
        }
        // bug: 没有344445556 这种牌型能不能出牌
        if (is_three_seq == true && statistic_array[4] == 0) {   //判断有没有三顺，有没有四张牌
            let only_has_three_card = (statistic_array[1] == 0) && (statistic_array[2] == 0) && (statistic_array[3] >= 2);
            let only_with_one_card = (statistic_array[1] != 0) && (statistic_array[2] == 0) && (statistic_array[3] == statistic_array[1]);
            let only_with_pair = (statistic_array[1] == 0) && (statistic_array[2] == 1) && (statistic_array[3] == statistic_array[2] * 2);
            let only_with_two_card = (statistic_array[1] == 0) && (statistic_array[2] != 0) && (statistic_array[3] == statistic_array[2]);
            let with_one_two_card = (statistic_array[1] != 0) && (statistic_array[2] != 0) && (statistic_array[3] == statistic_array[2] * 2 + count_array[1]);

            if (only_has_three_card || only_with_pair || only_with_one_card || only_with_two_card || with_one_two_card) {
                checkResult.isSucess = true;
                checkResult.cardType = GameDefine.CardsType.Plane
                checkResult.value = count_array[statistic_array[3] - 1]
            }
        }
    }
}

GameLogic.getCardWeight = function (card_value) {
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

GameLogic.processCards = function (cards) {
    for (let i = 0; i < cards.length; ++i)
        cards[i] = this.getCardWeight(cards[i])
}
module.exports = GameLogic;