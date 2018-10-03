# pinyinify

转换汉字为拼音。 Convert Chinese characters to pinyin. 

    > pinyinify("转换汉字为拼音。")
    "zhuǎnhuàn hànzì wéi pīnyīn."

## 安装 Installation 

    npm install pinyinify
    
## 用法 Usage

    var pinyinify = require("pinyinify");
    console.log(pinyinify("你好！你今天吃饭了没？"));
    // nǐhǎo! nǐ jīntiān chīfàn le méi?


## 详细输出 Detailed output

    pinyinify("人人生而自由，在尊严和权利上一律平等。", true)
    // { 
    //   segments: ['人人', '生而自由', '，', '在', '尊严', '和', '权利', '上', '一律平等', '。'],
    //   pinyinSegments: ['rénrén', 'shēngérzìyóu', ',', 'zài', 'zūnyán', 'hé', 'quánlì', 'shàng', 'yīlǜpíngděng', '.'],
    //   pinyinSegmentsSyllables: [['rén', 'rén'], ['shēng', 'ér', 'zì', 'yóu'], [','], ['zài'], ['zūn', 'yán'], ['hé'], ['quán', 'lì'], ['shàng'], ['yī', 'lǜ', 'píng', 'děng', '.']],
    //   pinyin: 'rénrén shēngérzìyóu, zài zūnyán hé quánlì shàng yīlǜpíngděng.' 
    // }