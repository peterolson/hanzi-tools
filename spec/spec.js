let pinyinify = require("./../pinyinify");

let customMatchers = {
    becomes: function (util, customTesters) {
        return {
            compare: (input, expected) => {
                var result = {};
                var actual = pinyinify(input);
                result.pass = util.equals(actual, expected, customTesters);
                if (!result.pass) result.message = `Expected ${expected} but got ${actual}.`;
                return result;
            }
        };
    }
};

describe("Pinyinify", () => {
    beforeEach(function () {
        jasmine.addMatchers(customMatchers);
    });

    it("works on very simple input", () => {
        expect("好").becomes("hǎo");
        expect("妈").not.becomes("mǎ");
    });

    it("selects the correct pronunciation for 多音字", () => {
        expect("我受不了了").becomes("wǒ shòu​bù​liǎo le");
        expect("我觉得睡觉是很重要的。我睡了一个好觉有很好的感觉。").becomes("wǒ jué​de shuì​jiào shì hěn zhòng​yào de. wǒ shuì le yī​gè hǎo jiào yǒu hěn hǎo de gǎn​jué.");
        expect("你看她干吗？她是你的女朋友吗？").becomes("nǐ kàn tā gàn​má? tā shì nǐ de nǚ​péng​you ma?");
        expect("他给我发了个短信：“我长大的时候我的头发很长。但是现在我喜欢理发。”").becomes("tā gěi​wǒ​fā le gè duǎn​xìn: ``wǒ zhǎng​dà de shí​hou wǒ de tóu​fa hěn cháng. dàn​shì xiàn​zài wǒ xǐ​huan lǐ​fà.\"");
        expect("我们都想去首都玩。").becomes("wǒ​men dōu xiǎng qù shǒu​dū wán.");
        expect("不要应该睡觉时不睡觉。").becomes("bù​yào yīng​gāi shuì​jiào​shí bù shuì​jiào.");
    });

    it("converts punctuation and spacing", () => {
        expect("什么？！我绝对 不 想 去！！你问我“你想去吗”干吗 不要问我了。哎哟（哈哈）晚安~")
            .becomes("shén​me?! wǒ jué​duì  bù  xiǎng  qù!! nǐ wèn wǒ ``nǐ xiǎng qù ma\" gàn​má  bù​yào wèn wǒ le. āi​yō (hā​hā) wǎn​ān~");
    });

    it("doesn't mangle numbers or non-Chinese text", () => {
        expect("我有2个。他有540！50%的意思是百分之五十。").becomes("wǒ yǒu 2 gè. tā yǒu 540! 50% de yì​si shì bǎi​fēn​zhī​wǔ​shí.");
        expect("我叫Dr. Smith。他是Señor López。他是Владимир Влидимирович给我们介绍的。", "wǒ jiào Dr. Smith. tā shì Señor López. tā shì Владимир Влидимирович gěi wǒmen jièshào de.");
    });

    it("returns detailed output when given a second parameter", () => {
        let details = pinyinify("他们为什么没有这样做？这真是他所想要的吗？", true);
        expect(details.segments).toEqual(['他们', '为什么', '没有', '这样', '做', '？', '这', '真是', '他', '所', '想要', '的', '吗', '？']);
        expect(details.pinyinSegments).toEqual(['tā​men', 'wèi​shén​me', 'méi​yǒu', 'zhè​yàng', 'zuò', '?', 'zhè', 'zhēn​shi', 'tā', 'suǒ', 'xiǎng​yào', 'de', 'ma', '?']);
        expect(details.pinyinSegmentsSyllables).toEqual([['tā', 'men'],
        ['wèi', 'shén', 'me'],
        ['méi', 'yǒu'],
        ['zhè', 'yàng'],
        ['zuò'],
        ['?'],
        ['zhè'],
        ['zhēn', 'shi'],
        ['tā'],
        ['suǒ'],
        ['xiǎng', 'yào'],
        ['de'],
        ['ma'],
        ['?']]);
        expect(details.pinyin).toEqual('tā​men wèi​shén​me méi​yǒu zhè​yàng zuò? zhè zhēn​shi tā suǒ xiǎng​yào de ma?');


        details = pinyinify("我们是五个太好的门。", true);
        expect(details.pinyinSegmentsSyllables).toEqual([['wǒ', 'men'],
        ['shì'],
        ['wǔ', 'gè'],
        ['tài'],
        ['hǎo'],
        ['de'],
        ['mén'],
        ['.']]);
    });
});