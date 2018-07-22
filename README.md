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

    pinyinify("人人生出嚟就系自由慨，喺尊严同权利上一律平等。", true)
    // { 
    //   segments: [ '人人', '生出', '嚟', '就', '系', '自由', '慨', '，', '喺', '尊严', '同', '权利', '上', '一律平等', '。' ],
    //   pinyinSegments: [ 'rénrén', 'shēngchū', 'lì', 'jiù', 'xì', 'zìyóu', 'kǎi', ',', 'xǐ', 'zūnyán', 'tóng', 'quánlì', 'shàng', 'yīlǜpíngděng', '.' ],
    //   pinyin: 'rénrén shēngchū lì jiù xì zìyóu kǎi, xǐ zūnyán tóng quánlì shàng yīlǜpíngděng.' 
    // }