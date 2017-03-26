/**
 * 截取带HTML样式的字符串，并保留并自动补齐HTML标签
 * @param {String} html 
 * @param {Object} options 
 */
function subHtml(html, options) {

    options = options || {};
    const limit = options.limit || 100;
    const preserveTags = options.preserveTags || true;
    const delUnMatchTags = options.delUnMatchTags || false;
    const moreText = options.moreText;
    const moreLink = options.moreLink;

    /**
     * 判断所给的值是否在数组中
     * @param {Array} arr 
     * @param {String} val 
     */
    function _inArray(arr, val) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === val) {
                return true;
            }
        }
        return false;
    }

    function _toText(html) {
        if (typeof html === "string") {
            return html.replace(/(^\s*)|(\s*$)/g, "").replace(/<[^<^>]*>/g, "").replace(/[\r\n]/g, "");
        } else {
            return "";
        }
    }

    // 如果不保留HTML标签，将去掉HTML标签后再截取文本。
    if (!preserveTags) {
        if (limit > 0) {
            return _toText(html).substring(0, limit);
        } else {
            return _toText(html);
        }
    }

    var rgx1 = /<[^<^>^\/]+>/;      //前标签(<a>的href属性中可能会有“//”符号，先移除再判断)
    var rgx2 = /<\/[^<^>^\/]+>/;    //后标签
    var rgx3 = /<[^<^>^\/]+\/>/;    //自标签
    var rgx4 = /<[^<^>]+>/;         //所有标签
    var selfTags = "hr,br,img,input,meta".split(",");


    if (typeof html !== "string") {
        return "";
    }

    html = html.replace(/(^\s*)|(\s*$)/g, "").replace(/[\r\n]/g, "");
    let oStr = html.replace(/<[^<^>]*>/g, "");
    let olen = oStr.length;
    if (!/^\d+$/.test(limit) || olen <= limit) {
        return html;
    }

    let tStr = html;
    let index = 0;
    let matchs = [];

    while (rgx4.test(tStr)) {
        let m = {};
        m.index = index + tStr.search(rgx4);
        m.string = tStr.match(rgx4).toString();
        let len = tStr.search(/<[^<^>]+>/) + tStr.match(/<[^<^>]+>/)[0].length;
        tStr = tStr.substr(len);
        index += len;
        matchs.push(m);
    }

    //console.info("oStr=%s", oStr);

    tStr = oStr.substr(0, limit);

    //console.info("before: tStr=%s", tStr);
    //console.info("matchs:%o", matchs);

    let startTags = [];
    let txtPosition = "";       // 0: 截取位置在HTML标签处 1: 截取位置在文本部分
    for (let i = 0; i < matchs.length; i++) {
        let mc = matchs[i];
        if (tStr.length <= mc.index) {
            //tStr += matchs[i].string;
            //console.info("final tStr: %s tStr.length: %s match.index: %s", tStr, tStr.length, mc.index);
            matchs = matchs.slice(0, i);
            break;
        } else {
            tStr = tStr.substring(0, mc.index) + mc.string + tStr.substr(mc.index);
            //console.info("tStr: %s mc.string: %s", tStr, mc.string);
            if (rgx1.test(mc.string.replace(/(\/\/)/g, ""))) {
                let name = mc.string.replace(/[<>]/g, "").split(" ");
                if (name.length > 0) {
                    name = name[0];
                    if (!_inArray(selfTags, name)) {
                        //startTags.push(name);
                        startTags.push({ index: mc.index, name: name });
                    }
                }
            } else if (rgx2.test(mc.string)) {
                let name = mc.string.replace(/[<\/>]/g, "");
                if (startTags.length > 0 && startTags[startTags.length - 1].name === name) {
                    startTags.pop();
                }
            }
        }
    }

    //console.info("startTags: %o", startTags);

    if (startTags.length > 0) {
        if (delUnMatchTags) {
            tStr = tStr.substring(0, startTags[0].index);
        } else {
            for (var i = startTags.length - 1; i >= 0; i--) {
                tStr += '</' + startTags[i].name + '>';
            }
        }
    }

    let more = false;
    if (tStr.length < html.length) {
        more = true;
    }

    if (moreText) {
        if (moreLink) {
            tStr += '<a href="' + moreLink + '" style="display:inline">' + moreText + '</a>';
        } else {
            tStr += "<span>" + moreText + "</span>";
        }
    }

    //console.info("tStr:%s", tStr);

    return {
        html: tStr,
        more: more
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = subHtml;
}