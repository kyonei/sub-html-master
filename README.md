# sub-html-master
截取指定长度的HTML文本

## 用法
#### use in Node.js
    var subHtml = require("所在路径/index.js");

#### use in Html
    <script type="text/javascript" src="所在路径/index.js"></script>
例子： 

    var o = subHtml(html, { limit: 150, moreText: "...", delUnMatchTags: false });
    
## Options
#### limit
用于指定你要截取的文本长度， 默认为100  
#### preserveTags
是否保留HTML标签。 默认为true， 如果指定为false，则会去掉所有HTML标签后再截取文本。
#### delUnMatchTags
是否删除没有匹配到的HTML标签。默认情况下会自动补全未匹配的HTML标签，但是，如果截取的文本位置正好是在Table等标签中，就会出现Table显示不完全的情况，所以，这个选项为true的时候，会忽略当前文本位置而向上截取到一个完整的标签处。
#### moreText
如果指定此选项，可以在最后生成的文本后面追加一个想要显示的文字。例如：...，>>>，显示全部文章，等等。
#### moreLink
如果指定此选项，追加的显示文字会以Html link的形式显示，可以用来做一些特殊的处理，如转移到详细页面等等。

## 参考
trim html  
[https://github.com/brankosekulic/trimHtml](https://github.com/brankosekulic/trimHtml)

subHtml.js
````javascript
/**
 * 文件名：SubHtml.js
 * 说　明：带HTML标签根据HTML内容截取指定长度的HTML文本，并自动补齐截取后的标签
 */
(function (o) { ...
````

