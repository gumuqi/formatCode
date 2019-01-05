/**
 * 将字符串格式化成JSON格式
 * @param {*} str 
 */
var formatJson = function (json) {
    var formatted = '',     //转换后的json字符串
        padIdx = 0,         //换行后是否增减PADDING的标识
        PADDING = '    ';   //4个空格符
    /**
     * 将对象转化为string
     */
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    }
    /** 
     *利用正则类似将{'name':'ccy','age':18,'info':['address':'wuhan','interest':'playCards']}
     *---> \r\n{\r\n'name':'ccy',\r\n'age':18,\r\n
     *'info':\r\n[\r\n'address':'wuhan',\r\n'interest':'playCards'\r\n]\r\n}\r\n
     */
    json = json.replace(/([\{\}])/g, '\r\n$1\r\n')
                .replace(/([\[\]])/g, '\r\n$1\r\n')
                .replace(/(\,)/g, '$1\r\n')
                .replace(/(\r\n\r\n)/g, '\r\n')
                .replace(/\r\n\,/g, ',');
    /** 
     * 根据split生成数据进行遍历，一行行判断是否增减PADDING
     */
   (json.split('\r\n')).forEach(function (node, index) {
        var indent = 0,
            padding = '';
        if (node.match(/\{$/) || node.match(/\[$/)) indent = 1;
        else if (node.match(/\}/) || node.match(/\]/))  padIdx = padIdx !== 0 ? --padIdx : padIdx;
        else    indent = 0;
        for (var i = 0; i < padIdx; i++)    padding += PADDING;
        formatted += padding + node + '\r\n';
        padIdx += indent;
        console.log('index:'+index+',indent:'+indent+',padIdx:'+padIdx+',node-->'+node);
    });
    return formatted;
};

var Base64 = {
 
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
    /**
     * base64编码
     * @param {*} str 
     */
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = this._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },
 
    /**
     * base64解码
     * @param {*} str 
     */
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = this._utf8_decode(output);
        return output;
    },
 
    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
        return utftext;
    },
 
    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}

$('#json').click(function() {
    let str = $('#textstr').val() || '';
    str = formatJson(str);
    $('#textstr').val(str);
})

$('#encodeBase64').click(function() {
    let str = $('#textstr').val() || '';
    str = Base64.encode(str);
    $('#textstr').val(str);
})

$('#decodeBase64').click(function() {
    let str = $('#textstr').val() || '';
    str = Base64.decode(str);
    $('#textstr').val(str);
})

$('#encodeURIComponent').click(function() {
    let str = $('#textstr').val() || '';
    str = encodeURIComponent(str);
    $('#textstr').val(str);
})

$('#decodeURIComponent').click(function() {
    let str = $('#textstr').val() || '';
    str = decodeURIComponent(str);
    $('#textstr').val(str);
})