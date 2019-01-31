# Hanzi Tools 汉字工具

《汉字工具》是四种工具的集合。
Hanzi Tools is a collection of four different tools.

 - `segment` - 分词。 Divide text into words.
 - `pinyinify` - 转换汉字为拼音。 Convert Chinese characters to pinyin. 
 - `simplify` - 转换简体汉字为繁体汉字。 Convert traditional characters to simplified characters.
 - `traditionalize` - 转换繁体汉字为简体汉字。 Convert simplified characters to traditional characters.
 - `tag` - 词性标注。 Part-of-speech tagging.



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

## tag

词性标注。 Part-of-speech tagging.

        var tag = require("hanzi-tools").tag;
        tag("你是我最喜欢的人。");
        // [ { word: '你', tag: 'r' },
        // { word: '是', tag: 'v' },
        //  { word: '我', tag: 'r' },
        //  { word: '最', tag: 'd' },
        //  { word: '喜欢', tag: 'v' },
        //  { word: '的', tag: 'uj' },
        //  { word: '人', tag: 'n' },
        //  { word: '。', tag: 'x' } ]

### 词性编码表 Part-of-speech codes

| 代码 Code | 名称 Meaning | 举例 Example |
| --------- | ----------- | ------------ |
| a | 形容词 Adjective | **小**冰箱**很脏**。 |
| ad | 副形词 Adverbial adjective | 你一直**努力**工作。 |
| ag | 形语素 Adjectival morpheme |   |
| an | 名形词 Nounal adjective | 现在没有**危险**了。 |
| b | 区别词 Attributive | **所有**鸟都会飞吗？  |
| c | 连词 Conjunction | 你不**和**我吻别吗？ |
| d | 副词 Adverb | 我**还**没收到他的信。 |
| df | 副词不要 Adverb "不要" | **不要**客气。 |
| dg | 副语素 Adverbial morpheme | 尽管证据**俱**在，他们却装作好象没插手这事。 |
| e | 叹词 Interjection | **嗨** 你干什么呢 不想活了？ |
| f | 方位词 Location word | 我从梦**中**醒来。 |
| g | 语素 Isolated morpheme |  |
| h | 前缀 Prefix | **非**工作人员禁止入内。 |
| i | 成语 Idiom | 不快乐**不请自来**。 |
| j | 简称略语 Abbreviation | 日本办过多少次**奥运会**？ |
| k | 后缀 Suffix | 亲爱的朋友**们**！ |
| l | 习用语 Idiomatic phrase | 我累得再也**走不动**了。 |
| m | 数词 Quantity | 我怀孕**四个**月了。 |
| mq | 数量词 Measure word | **这件**事你告诉他妈没？ |
| n | 名词 Noun | **电池**快没电了。 |
| ng | 名语素 Noun morpheme  | 你看着像**猴**。 |
| nr | 人名 Name of a person | 我一出门就碰上**老王**了。 |
| nrfg | 汉语名字 Chinese name | 中国国家主席**习近平**会见美国国务卿约翰·克里。 |
| nrt | 音译人名 Transliterated name | **彼得**看起来很年轻。 |
| ns | 地名 Place name | **伦敦**现在七点了。 |
| nt | 机构团体 Group name | 我自愿加入**中国共产党**。 |
| nz | 其他专名 Other proper nouns  | 他会讲一点点**英语**。 |
| o | 拟声词 Onomatopoeia | 我的肚子在**咕咕**叫。 |
| p | 介词 Preposition | 我**向**你保证。 |
| q | 量词 Isolated measure word | 我不是**个**老师。 |
| r | 代词 Pronoun | **你**明白**我**的意思吗？ |
| rg | 代词性语素 Pronoun-like morpheme | **兹**向大会转递委员会的此份报告。 |
| rr | 人称代词 Personal pronoun | 不用担心**其他人**。 |
| rz | 指示代词 Demonstrative pronoun | **这位**女士应该知道！ |
| s | 处所词 Place word | **天下**没有免费的午餐。 |
| t | 时间词 Time word  | 他**今天**可能会来。 |
| tg | 时语素 Time morpheme | 你**晚**一会就能明白。 |
| u | 助词 Function word | 如果可能**的话** |
| ud | 结构助词得 Structural particle "得" | 他玩**得**很好。 |
| ug | 时态助词过 Temporal particle "过" | 我见**过**你的女朋友。 |
| uj | 结构助词的 Structural particle "的" | 他们是我**的**兄弟。 |
| ul | 时态助词了 Temporal particle "了" | 已经很完美**了**。 |
| uv | 结构助词地 Structural particle "地" | 请安静**地**关门。 |
| uz | 时态助词着 Temporal particle "着"| 让土地闲置**着**很浪费。 |
| v | 动词 Verb | **看**，我**发现**了这个！ |
| vd | 副动词 Adverbial form of verb | 只能**持续**十五分钟。  |
| vg | 动词性语素 Verb-like morpheme | 我每周游一次**泳**。。 |
| vi | 不及物动词 Intransitive verb | 乌克兰经济上**等同于**失败的国家。  |
| vn | 名动词 Noun-like verb | 他习惯了**旅行**。 |
| vq | 动词去过 Verb "去过"  | 我**去过**罗马。 |
| x | 非语素字 Non-morpheme | 。？！ |
| y | 语气词 Modal particle | 你不会害怕**吗**？ |
| z | 状态词 Status word  | 我还**晕晕乎乎**的。 |
| zg | 状态语素 Status morpheme | 我**很**抱歉。 |