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
        expect("我受不了了").becomes("wǒ shòubùliǎo le");
        expect("我觉得睡觉是很重要的。我睡了一个好觉有很好的感觉。").becomes("wǒ juéde shuìjiào shì hěn zhòngyào de. wǒ shuì le yígè hǎo jiào yǒu hěn hǎo de gǎnjué.");
        expect("你看她干吗？她是你的女朋友吗？").becomes("nǐ kàn tā gànmá? tā shì nǐ de nǚpéngyou ma?");
        expect("他给我发了个短信：“我长大的时候我的头发很长。但是现在我喜欢理发。”").becomes("tā gěiwǒfā le gè duǎnxìn: ``wǒ zhǎngdà de shíhou wǒ de tóufa hěn cháng. dànshì xiànzài wǒ xǐhuan lǐfà.\"");
        expect("我们都想去首都玩。").becomes("wǒmen dōu xiǎng qù shǒudū wán.");
    });

    it("converts punctuation and spacing", () => {
        expect("什么？！我绝对 不 想 去！！你问我“你想去吗”干吗 不要问我了。哎哟（哈哈）晚安~")
            .becomes("shénme?! wǒ juéduì  bù  xiǎng  qù!! nǐ wèn wǒ ``nǐ xiǎng qù ma\" gànmá  bùyào wèn wǒ le. āiyō (hāhā) wǎnān~");          
    });

    it("doesn't mangle numbers or non-Chinese text", () =>{
        expect("我有2个。他有540！50%的意思是百分之五十。").becomes("wǒ yǒu 2 gè. tā yǒu 540! 50% de yìsi shì bǎifēnzhīwǔshí.");
        expect("我叫Dr. Smith。他是Señor López。他是Владимир Влидимирович给我们介绍的。", "wǒ jiào Dr. Smith. tā shì Señor López. tā shì Владимир Влидимирович gěi wǒmen jièshào de.");
    });
});