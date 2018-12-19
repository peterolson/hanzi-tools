# Hanzi Tools 汉字工具

《汉字工具》是四种工具的集合。
Hanzi Tools is a collection of four different tools.

 - `segment` - 分词。 Divide text into words.
 - `pinyinify` - 转换汉字为拼音。 Convert Chinese characters to pinyin. 
 - `simplify` - 转换简体汉字为繁体汉字。 Convert traditional characters to simplified characters.
 - `traditionalize` - 转换繁体汉字为简体汉字。 Convert simplified characters to traditional characters.



## 安装 Installation 

    npm install hanzi-tools

## segment

分词。 Divide text into words.

    var segment = require("hanzi-tools").segment;

    segment("我在青岛市崂山区工作。");
    // [ '我', '在', '青岛市', '崂山区', '工作', '。' ]

## pinyinify

转换汉字为拼音。 Convert Chinese characters to pinyin. 

    var pinyinify = require("hanzi-tools").pinyinify;
    
    pinyinify("转换汉字为拼音。")
    // "zhuǎnhuàn hànzì wéi pīnyīn."
    
    console.log(pinyinify("你好！你今天吃饭了没？"));
    // nǐhǎo! nǐ jīntiān chīfàn le méi?


### 详细输出 Detailed output

    pinyinify("人人生而自由，在尊严和权利上一律平等。", true)
    // { 
    //   segments: ['人人', '生而自由', '，', '在', '尊严', '和', '权利', '上', '一律平等', '。'],
    //   pinyinSegments: ['rénrén', 'shēngérzìyóu', ',', 'zài', 'zūnyán', 'hé', 'quánlì', 'shàng', 'yīlǜpíngděng', '.'],
    //   pinyinSegmentsSyllables: [['rén', 'rén'], ['shēng', 'ér', 'zì', 'yóu'], [','], ['zài'], ['zūn', 'yán'], ['hé'], ['quán', 'lì'], ['shàng'], ['yī', 'lǜ', 'píng', 'děng', '.']],
    //   pinyin: 'rénrén shēngérzìyóu, zài zūnyán hé quánlì shàng yīlǜpíngděng.' 
    // }

## simplify

转换简体汉字为繁体汉字。 Convert traditional characters to simplified characters.

    var simplify = require("hanzi-tools").simplify;
    simplify("有朋自遠方來，不亦樂乎？");
    // 有朋自远方来，不亦乐乎？

## traditionalize

转换繁体汉字为简体汉字。 Convert simplified characters to traditional characters.

    var traditionalize = require("hanzi-tools").traditionalize;
    traditionalize("起来！不愿做奴隶的人们！ 把我们的血肉，筑成我们新的长城！");
    // 起來！不願做奴隸的人們！ 把我們的血肉，築成我們新的長城！