/**
 * This is workflow entity abstract class.
 *
 * Author Dahai Cao on 20160124
 */

function Utils() {
};

Utils.highLight = function () {
    return "#f9fff9";
};

Utils.formatBytes = function (bytes, decimals) {
    if (0 == bytes)
        return '0 Bytes';
    var k = 1024, dm = decimals || 2, sizes = ['Bytes', 'KB', 'MB', 'GB',
        'TB', 'PB', 'EB', 'ZB', 'YB'], i = Math.floor(Math.log(bytes)
        / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};


Utils.fetchetQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

Utils.getCookie = function (name) {
    var strcookie = document.cookie;//获取cookie字符串
    var arrcookie = strcookie.split("; ");//分割
    //遍历匹配
    for ( var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name){
            return arr[1];
        }
    }
    return "";
};

Utils.setCookie = function (name, value) {
    document.cookie=name+"="+value+";max-age=3600;path=/";
};

Utils.getRandomNumber = function () {
    var num = "";
    for (var i = 0; i < 8; i++) {
        num += Math.floor(Math.random() * 10);
    }
    return num;
};

Utils.blockNonNumbers = function (obj, e, allowDecimal, allowNegative) {
    var key;
    var isCtrl = false;
    var keychar;
    var reg;

    if (window.event) {
        key = e.keyCode;
        isCtrl = window.event.ctrlKey
    } else if (e.which) {
        key = e.which;
        isCtrl = e.ctrlKey;
    }

    if (isNaN(key))
        return true;

    keychar = String.fromCharCode(key);

    // check for backspace or delete, or if Ctrl was pressed
    if (key == 8 || isCtrl) {
        return true;
    }

    reg = /\d/;
    var isFirstD = allowDecimal ? keychar == '.'
        && obj.value.indexOf('.') == -1 : false;
    var isFirstN = allowNegative ? keychar == '-'
        && obj.value.indexOf('-') == -1 : false;
    if (!(isFirstN || isFirstD || reg.test(keychar))) {
        e.preventDefault();
    }
};

Utils.replacer = function (key, value) {
    if (key == "expression" || key == "dom" || key == "mycontainer")
        return undefined;
    else
        return value;
};

Utils.stringify = function (stringvalue) {
    if (stringvalue != null && stringvalue != "") {
        return $('<div/>').text(stringvalue).html();
    } else {
        return "";
    }
};

Utils.parse = function (stringvalue) {
    if (stringvalue != null && stringvalue != "") {
        return $('<div/>').html(stringvalue).text();
    } else {
        return "";
    }
};

Utils.stopDefault = function (e) {
    e.preventDefault();
};

Utils.stopDefaultEvent = function (evt) {
    // code below prevents the mouse down from having an effect on the main
    // browser window:
    if (evt.preventDefault) {
        evt.preventDefault();
    } // standard
    else if (evt.returnValue) {
        evt.returnValue = false;
    } // older IE
};

Utils.stopBubble = function (e) {
    if (e && e.stopPropagation)
        e.stopPropagation();
    else
        window.event.cancelBubble = true;
};

Utils.getCurrentDateTime = function () {
    var date = new Date();
    var months = date.getMonth();
    months = months + 1;
    months = months < 10 ? '0' + months : months;
    var days = date.getDate();
    days = days < 10 ? '0' + days : days;
    var hours = date.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var seconds = date.getSeconds();
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var d = date.getFullYear() + "-" + months + "-" + days + " " + hours + ":"
        + minutes + ":" + seconds;
    return d;
};

Utils.getDateTime = function (a) {
    if (Utils.isInt(a) && a != -1 && a != 0) {
        var date = new Date(a);
        var months = date.getMonth();
        months = months + 1;
        months = months < 10 ? '0' + months : months;
        var days = date.getDate();
        days = days < 10 ? '0' + days : days;
        var hours = date.getHours();
        hours = hours < 10 ? '0' + hours : hours;
        var minutes = date.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var seconds = date.getSeconds();
        seconds = seconds < 10 ? '0' + seconds : seconds;
        var d = date.getFullYear() + "-" + months + "-" + days + " " + hours
            + ":" + minutes + ":" + seconds;
        return d;
    }
    return a;
};

Utils.formatDateTime = function (a) {
    var date = new Date(a);
    var months = date.getMonth();
    months = months + 1;
    months = months < 10 ? '0' + months : months;
    var days = date.getDate();
    days = days < 10 ? '0' + days : days;
    var hours = date.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var seconds = date.getSeconds();
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var d = date.getFullYear() + "-" + months + "-" + days + " " + hours
        + ":" + minutes + ":" + seconds;
    return d;
};

Utils.parseDateTime = function (a) {
    if (Number(a) == NaN) {
        return a;
    }
    var date = new Date(Number(a));
    var months = date.getMonth();
    months = months + 1;
    months = months < 10 ? '0' + months : months;
    var days = date.getDate();
    days = days < 10 ? '0' + days : days;
    var hours = date.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var seconds = date.getSeconds();
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var d = date.getFullYear() + "-" + months + "-" + days + " " + hours
        + ":" + minutes + ":" + seconds;
    return d;
};

Utils.convertGMTDateTime = function (a) {
    var date = new Date(a);
    return date.toLocaleString();
};

Utils.isInt = function (n) {
    return Number(n) === n && n % 1 === 0;
};

Utils.isFloat = function (n) {
    return Number(n) === n && n % 1 !== 0;
};

Utils.getDate = function (a) {
    if (Utils.isInt(a) && a != -1 && a != 0) {
        var date = new Date(a);
        var months = date.getMonth();
        months = months + 1;
        months = months < 10 ? '0' + months : months;
        var days = date.getDate();
        days = days < 10 ? '0' + days : days;
        var d = date.getFullYear() + "-" + months + "-" + days;
        return d;
    }
    return a;
};

Utils.getCurrentDate = function () {
    var date = new Date();
    var months = date.getMonth();
    months = months + 1;
    months = months < 10 ? '0' + months : months;
    var days = date.getDate();
    days = days < 10 ? '0' + days : days;
    var d = date.getFullYear() + "-" + months + "-" + days;
    return d;
};

Utils.isArray = function (o) {
    return Object.prototype.toString.call(o) === '[object Array]';
};

Utils.toDataType = function (type) {
    return datatype[type];
};

Utils.getY = function (context, text, x, maxWidth, lineHeight) {
    var rows = 1;
    var line = '';
    for (var n = 0; n < text.length; n++) {
        var testLine = line + text.charAt(n);
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            line = text.charAt(n);
            rows++;
        } else {
            line = testLine;
        }
    }
    return rows;
};

Utils.outputText = function (context, text, x, y, maxWidth, lineHeight,
                             alignment) {
    var line = '';
    var s = Utils.parse(text);
    for (var n = 0; n < s.length; n++) {
        var testLine = line + s.charAt(n);
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y); // write text from left to right
            line = s.charAt(n);
            y += lineHeight; // add a new row
        } else {
            line = testLine;
        }
    }
    var x0 = 0;
    if (alignment == "L") { // left
        x0 = x;
    } else if (alignment == "C") { // center
        var m = context.measureText(line); // last line
        var w = Math.floor(m.width / 2) + 0.5;
        x0 = Math.floor((x + x + maxWidth) / 2 - w) + 0.5;
    } else if (alignment == "R") { // right
        var m = context.measureText(line); // last line
        x0 = x + maxWidth - m.width;
    }
    context.fillText(line, x0, y);
};

Utils.createMarks = function (x0, y0, x1, y1) {
    var marks = [];
    // north-west
    var mark = new CornerMark();
    mark.x0 = x0 - mark.half;
    mark.y0 = y0 - mark.half;
    mark.name = "nw-resize";
    marks.push(mark);
    // north
    mark = new CornerMark();
    mark.x0 = Math.floor((x0 + x1) / 2) + 0.5 - mark.half;
    mark.y0 = y0 - mark.half;
    mark.name = "n-resize";
    marks.push(mark);
    // south
    mark = new CornerMark();
    mark.x0 = Math.floor((x0 + x1) / 2) + 0.5 - mark.half;
    mark.y0 = y1 - mark.half;
    mark.name = "s-resize";
    marks.push(mark);
    // south-west
    mark = new CornerMark();
    mark.x0 = x0 - mark.half;
    mark.y0 = y1 - mark.half;
    mark.name = "sw-resize";
    marks.push(mark);
    // north-east
    mark = new CornerMark();
    mark.x0 = x1 - mark.half;
    mark.y0 = y0 - mark.half;
    mark.name = "ne-resize";
    marks.push(mark);
    // west
    mark = new CornerMark();
    mark.x0 = x0 - mark.half;
    mark.y0 = Math.floor((y0 + y1) / 2) + 0.5 - mark.half;
    mark.name = "w-resize";
    marks.push(mark);
    // south-east
    mark = new CornerMark();
    mark.x0 = x1 - mark.half;
    mark.y0 = y1 - mark.half;
    mark.name = "se-resize";
    marks.push(mark);
    // east
    mark = new CornerMark();
    mark.x0 = x1 - mark.half;
    mark.y0 = Math.floor((y0 + y1) / 2) + 0.5 - mark.half;
    mark.name = "e-resize";
    marks.push(mark);
    return marks;
};

Utils.createRelMarks = function (x0, y0, x1, y1, hx, hy) {
    var marks = [];
    // north
    var mark = new CornerMark();
    mark.x0 = x0 - mark.half;
    mark.y0 = y0 - mark.half;
    mark.name = "s-size";
    marks.push(mark);
    // center
    mark = new CornerMark();
    mark.width = 10;
    mark.height = 10;
    mark.half = 5;
    mark.x0 = hx - mark.half;
    mark.y0 = hy - mark.half;
    mark.name = "pointer";
    marks.push(mark);
    // south
    mark = new CornerMark();
    mark.x0 = x1 - mark.half;
    mark.y0 = y1 - mark.half;
    mark.name = "n-size";
    marks.push(mark);
    return marks;
}

Utils.drawSelection = function (marks, context) {
    var tmp = context.strokeStyle;
    context.strokeStyle = 'black';
    context.lineWidth = 0.5;
    // this.context.lineJoin = 'round';
    var tmp1 = context.fillStyle;
    context.fillStyle = 'white';

    for (var i = 0; i < marks.length; i++) {
        context.fillRect(marks[i].x0, marks[i].y0, marks[i].width,
            marks[i].height);
        context.strokeRect(marks[i].x0, marks[i].y0, marks[i].width,
            marks[i].height);
    }
    context.fillStyle = tmp1;
    context.strokeStyle = tmp; // resume old color
};

Utils.drawTransitionSelection = function (marks, context) {
    var tmp = context.strokeStyle;
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    // this.context.lineJoin = 'round';
    var tmp1 = context.fillStyle;
    context.fillStyle = 'white';

    context.fillRect(marks[0].x0, marks[0].y0, marks[0].width, marks[0].height);
    context.strokeRect(marks[0].x0, marks[0].y0, marks[0].width,
        marks[0].height);

    context.fillStyle = 'red';

    context.fillRect(marks[1].x0, marks[1].y0, marks[1].width, marks[1].height);
    context.strokeRect(marks[1].x0, marks[1].y0, marks[1].width,
        marks[1].height);

    context.fillStyle = 'white';

    context.fillRect(marks[2].x0, marks[2].y0, marks[2].width, marks[2].height);
    context.strokeRect(marks[2].x0, marks[2].y0, marks[2].width,
        marks[2].height);

    context.fillStyle = tmp1;
    context.strokeStyle = tmp; // resume old color
};

Utils.drawDashedLine = function (canvas, defaultX, defaultY, x, y) {
    var drawDashes = function () {
        var cxt = canvas.getContext("2d");
        cxt.strokeStyle = 'black';
        var dashes = "2 2";// the first is dash, the second is gap
        var dashGapArray = dashes.replace(/^\s+|\s+$/g, '').split(/\s+/);
        if (!dashGapArray[0]
            || (dashGapArray.length == 1 && dashGapArray[0] == 0))
            return;
        cxt.lineWidth = "0.5";
        cxt.lineCap = "round";
        cxt.beginPath();
        cxt.strokeStyle = 'black'
        cxt.dashedLine(defaultX, defaultY, x, y, dashGapArray);
        cxt.closePath();
        cxt.stroke();
    };
    drawDashes();
};

Utils.drawingDashedLine = function (cxt, color, defaultX, defaultY, x, y) {
    var drawDashes = function () {
        cxt.strokeStyle = color;
        var dashes = "2 2";// the first is dash, the second is gap
        var dashGapArray = dashes.replace(/^\s+|\s+$/g, '').split(/\s+/);
        if (!dashGapArray[0]
            || (dashGapArray.length == 1 && dashGapArray[0] == 0))
            return;
        cxt.lineWidth = "0.5";
        cxt.lineCap = "round";
        cxt.beginPath();
        cxt.strokeStyle = 'black'
        cxt.dashedLine(defaultX, defaultY, x, y, dashGapArray);
        cxt.closePath();
        cxt.stroke();
    };
    drawDashes();
};

function transitionIcon32x32(context, x1, y1) {
    var tfs = context.fillStyle;
    var tss = context.strokeStyle;
    var lw = context.lineWidth;

    var radius = 16;
    var x0 = x1;
    var y0 = y1;
    context.moveTo(x0 + 1, y0 + 16);
    context.lineTo(x0 + 30, y0 + 16); // vertex
    context.lineTo(x0 + 20, y0 + 10); // arrow top
    context.lineTo(x0 + 23, y0 + 16); // arrow tail
    context.lineTo(x0 + 20, y0 + 22); // arrow bottom
    context.lineTo(x0 + 30, y0 + 16);
    context.lineTo(x0 + 1, y0 + 16);
    context.lineJoin = "round";
    context.closePath();
    context.fillStyle = '#FFFFFF';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#000000';
    context.stroke();

    context.fillStyle = tfs;
    context.strokeStyle = tss;
    context.lineWidth = lw;
};

// ----
// runtime characters
Utils.toTransitionLineColor = function (status) {
    if (status == 1) {// ENABLED
        return '#1aff66';
    } else if (status == 2) {// COMPLETED
        return '#86592d';
    } else if (status == 3) {// UNUSED
        return '#e6e6e6';
    } else if (status == 4) {// EXCEPTION
        return '#ff0000';
    }
    return '#000';
};

Utils.toTaskBgColor = function (status) {
    if (status == 1) {// enabled
        return '#1aff66';
    } else if (status == 2) {// running
        return '#00b33c';
    } else if (status == 3) {// completed
        return '#86592d';
    } else if (status == 4) {// unused
        return '#e6e6e6';
    } else if (status == 5) {// exception
        return '#ff0000';
    } else if (status == 6) {// skipped
        return '#cccc00';
    } else if (status == 7) {// terminated
        return '#5c8a8a';
    }
    return '#ffffff';
};

// ----

// The code is copied from
// http://stackoverflow.com/questions/4576724/dotted-stroke-in-canvas
// it is very good.
var CP = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
if (CP && CP.lineTo) {
    CP.dashedLine = function (x, y, x2, y2, dashArray) {
        if (!dashArray)
            dashArray = [10, 5];
        if (dashLength == 0)
            dashLength = 0.001; // Hack for Safari
        var dashCount = dashArray.length;
        this.moveTo(x, y);
        var dx = (x2 - x), dy = (y2 - y);
        var slope = dx ? dy / dx : 1e15;
        var distRemaining = Math.sqrt(dx * dx + dy * dy);
        var dashIndex = 0, draw = true;
        while (distRemaining >= 0.1) {
            var dashLength = dashArray[dashIndex++ % dashCount];
            if (dashLength > distRemaining)
                dashLength = distRemaining;
            var xStep = Math
                .sqrt(dashLength * dashLength / (1 + slope * slope));
            if (dx < 0)
                xStep = -xStep;
            x += xStep
            if (dy > 0)
                y += slope * xStep;
            else
                y -= slope * xStep;
            this[draw ? 'lineTo' : 'moveTo'](x, y);
            distRemaining -= dashLength;
            draw = !draw;
        }
        // Ensure that the last segment is closed for proper stroking
        this.moveTo(0, 0);
    }
}
;

// this codes in this method are from Internet, it is working.
Utils.browserType = function () {
    var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1; // 判断是否Opera浏览器
    var isIE = userAgent.indexOf("compatible") > -1
        && userAgent.indexOf("MSIE") > -1 && !isOpera; // 判断是否IE浏览器
    var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1
        && !isIE; // 判断是否IE的Edge浏览器
    var isFF = userAgent.indexOf("Firefox") > -1; // 判断是否Firefox浏览器
    var isSafari = userAgent.indexOf("Safari") > -1
        && userAgent.indexOf("Chrome") == -1; // 判断是否Safari浏览器
    var isChrome = userAgent.indexOf("Chrome") > -1
        && userAgent.indexOf("Safari") > -1; // 判断Chrome浏览器
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion >= 8) {
            return "IE";
        } else {
            return "0";
        } // IE版本过低
    } // isIE end
    if (isFF) {
        return "FF";
    }
    if (isOpera) {
        return "Opera";
    }
    if (isSafari) {
        return "Safari";
    }
    if (isChrome) {
        return "Chrome";
    }
    if (isEdge) {
        return "Edge";
    }
};

// this codes in this method are from Internet, it is working.
Utils.isIE = function () {
    var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1
        && userAgent.indexOf("MSIE") > -1 && !isOpera; // 判断是否IE浏览器
    if (isIE) {
        return "1";
    } else {
        return "-1";
    }
};

// this codes in this method are from Internet, it is working.
Utils.getBrowserType = function () {
    var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1; // 判断是否Opera浏览器
    var isIE = userAgent.indexOf("compatible") > -1
        && userAgent.indexOf("MSIE") > -1 && !isOpera; // 判断是否IE浏览器
    var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1
        && !isIE; // 判断是否IE的Edge浏览器
    var isFF = userAgent.indexOf("Firefox") > -1; // 判断是否Firefox浏览器
    var isSafari = userAgent.indexOf("Safari") > -1
        && userAgent.indexOf("Chrome") == -1; // 判断是否Safari浏览器
    var isChrome = userAgent.indexOf("Chrome") > -1
        && userAgent.indexOf("Safari") > -1; // 判断Chrome浏览器

    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return "IE7";
        } else if (fIEVersion == 8) {
            return "IE8";
        } else if (fIEVersion == 9) {
            return "IE9";
        } else if (fIEVersion == 10) {
            return "IE10";
        } else if (fIEVersion == 11) {
            return "IE11";
        } else {
            return "0"
        } // IE版本过低
    } // isIE end

    if (isFF) {
        return "FF";
    }
    if (isOpera) {
        return "Opera";
    }
    if (isSafari) {
        return "Safari";
    }
    if (isChrome) {
        return "Chrome";
    }
    if (isEdge) {
        return "Edge";
    }
}; // myBrowser() end
