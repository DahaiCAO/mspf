;(function (undefined) {
    "use strict"
    
    var _global;
    
    function DomUtils() {};

    DomUtils.newelement = function (parent, elName) {
        var el = document.createElement(elName);
        parent.appendChild(el);
        return el;
    };

    DomUtils.insertElement = function (parent, elName1, elName2) {
        parent.insertBefore(elName1, elName2);
    };
    
    DomUtils.removeChildren = function(parent) {
        while (parent.hasChildNodes()) {
            parent.removeChild(parent.lastChild);
        }
    };

    DomUtils.createCancelButton = function(parent) {
        var cancelButton = DomUtils.newelement(parent, "button");
        cancelButton.type = "button";
        cancelButton.className = "btn btn-secondary";
        cancelButton.setAttribute("data-bs-dismiss", "modal");
        cancelButton.innerHTML = "取消";
        return cancelButton;
    };

    DomUtils.newCreateButton = function(parent) {
        var createButton = DomUtils.newelement(parent, "button");
        createButton.type = "button";
        createButton.className = "btn btn-success";
        createButton.innerHTML = "创建";
        return createButton;
    };

    DomUtils.createOKButton = function(parent) {
        var okButton = DomUtils.newelement(parent, "button");
        okButton.type = "button";
        okButton.className = "btn btn-primary";
        okButton.innerHTML = "确定";
        return okButton;
    };

    DomUtils.createButton = function(parent, name, buttonText, propName) {
        var label = document.createElement("label");
        parent.appendChild(label);
        label.className = "form-label";
        label.setAttribute("for", name);
        var small = document.createElement("small");
        label.appendChild(small);
        small.innerHTML = propName;

        var div = DomUtils.newelement(parent, "div");

        var button = document.createElement("button");
        div.appendChild(button);
        button.name = name;
        button.innerHTML = buttonText;
        button.className = "btn btn-primary btn-sm";

        var feedback = document.createElement("div");
        div.appendChild(feedback);
        feedback.name = name + "Feedback";
        feedback.innerHTML = "";
        feedback.className = "";
        feedback.style.display = "block";
        return [button, feedback];
    };

    DomUtils.createTextInput = function(parent, name, propName, value, placeholder) {
        var label = document.createElement("label");
        parent.appendChild(label);
        label.className = "form-label";
        label.setAttribute("for", name);
        var small = document.createElement("small");
        label.appendChild(small);
        small.innerHTML = propName;
        var input = document.createElement("input");
        parent.appendChild(input);
        input.name = name;
        input.type = "text";
        input.className = "form-control form-control-sm";
        input.value = value;
        input.setAttribute("placeholder", placeholder);

        var feedback = document.createElement("div");
        parent.appendChild(feedback);
        feedback.name = name + "Feedback";
        feedback.innerHTML = "";
        feedback.className = "";
        feedback.style.display = "block";
        return [input, feedback];
    };

    DomUtils.createTextInputNoLabel = function(parent, name, value, placeholder, idclass) {
        var input = document.createElement("input");
        parent.appendChild(input);
        input.id = name;
        input.name = name;
        input.type = "text";
        input.className = "form-control form-control-sm "+idclass;
        input.value = value;
        input.setAttribute("placeholder", placeholder);

        var feedback = document.createElement("div");
        parent.appendChild(feedback);
        feedback.name = name + "Feedback";
        feedback.innerHTML = "";
        feedback.className = "";
        feedback.style.display = "block";
        return [input, feedback];
    };

    DomUtils.createCheckboxInput = function(parent, name, id, labels, value, inline) {
        var formCheck = document.createElement("div");
        parent.appendChild(formCheck);
        if (inline) {
            formCheck.className = "form-check form-check-inline";
        } else {
            formCheck.className = "form-check";
        }
        var input = document.createElement("input");
        formCheck.appendChild(input);
        input.className = "form-check-input";
        input.type = "checkbox";
        input.name = name + id;
        input.id = id;
        input.value = value;
        //input.addEventListener("click", this, false);
        if (labels!="") {
            var label = document.createElement("label");
            formCheck.appendChild(label);
            label.className = "form-check-label";
            label.innerHTML = labels;
        }
        return formCheck;
    };

    DomUtils.createSelect = function(parent, name, propName) {
        var label = document.createElement("label");
        parent.appendChild(label);
        label.className = "form-label";
        label.setAttribute("for", name);
        var small = document.createElement("small");
        label.appendChild(small);
        small.innerHTML = propName;
        var select = document.createElement("select");
        parent.appendChild(select);
        select.name = name;
        select.className = "form-control form-control-sm";

        var feedback = document.createElement("div");
        parent.appendChild(feedback);
        feedback.name = name + "Feedback";
        feedback.innerHTML = "";
        feedback.className = "";
        feedback.style.display = "block";
        return [select, feedback];
    };

    DomUtils.createNormalSelect = function(parent, name, propName) {
        var label = document.createElement("label");
        parent.appendChild(label);
        label.className = "form-label";
        label.setAttribute("for", name);
        var small = document.createElement("small");
        label.appendChild(small);
        small.innerHTML = propName;
        var select = document.createElement("select");
        parent.appendChild(select);
        select.name = name;
        select.className = "form-control";
        return select;
    }

    DomUtils.addOptions = function(parent, title, value, index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    DomUtils.propRow = function(parent) {
        var row = DomUtils.newelement(parent, "div");
        row.className = "row px-2 mb-1";
        var col = DomUtils.newelement(row, "div");
        col.className = "col";
        return col;
    };

    DomUtils.createTextArea = function(parent, name, propName, value, placeholder) {
        if (propName != "") {
            var label = document.createElement("label");
            parent.appendChild(label);
            label.className = "form-label";
            label.setAttribute("for", name);
            var small = document.createElement("small");
            label.appendChild(small);
            small.innerHTML = propName;
        }
        var input = document.createElement("textarea");
        parent.appendChild(input);
        input.name = name;
        input.className = "form-control form-control-sm";
        input.value = value;
        input.rows = "3";
        input.setAttribute("placeholder", placeholder);
        input.addEventListener("change", this, false);

        var feedback = DomUtils.newelement(parent, "div");
        feedback.name = name+"Feedback";
        feedback.innerHTML = "";
        feedback.className = "";
        feedback.style.display = "block";
        return [input, feedback];
    };

    DomUtils.createSwitch = function(parent, name, propName) {
        var formCheck = document.createElement("div");
        parent.appendChild(formCheck);
        formCheck.className = "form-check form-switch";
        var formCheckInput = document.createElement("input");
        formCheck.appendChild(formCheckInput);
        formCheckInput.className = "form-check-input";
        formCheckInput.type = "checkbox";
        formCheckInput.name = name;
        var formCheckLabel = document.createElement("label");
        formCheck.appendChild(formCheckLabel);
        formCheckLabel.className = "form-check-label";
        formCheckLabel.innerHTML = propName;
        return formCheckInput;
    };

    DomUtils.createGroup = function(parent, desc) {
        var group = document.createElement("DIV");
        parent.appendChild(group);
        group.className = "btn-group btn-group-sm me-2";
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", desc);
        return group;
    };

    DomUtils.createButton = function(parent, style, icon, text, title) {
        var button = document.createElement("button");
        parent.appendChild(button);
        button.type = "button";
        button.className = "btn " + style + " " + icon;
        button.innerHTML = text;
        button.setAttribute("title", title);
        return button;
    };

    DomUtils.createButtonGroupSplit = function(parent, style, icon, text, isdark) {
        var buttonGroup = document.createElement("div");
        parent.appendChild(buttonGroup);
        buttonGroup.className = "btn-group";

        var button = document.createElement("button");
        buttonGroup.appendChild(button);
        button.type = "button";
        button.className = "btn" + " " + style + " " + icon;
        button.innerHTML = text;

        var button1 = document.createElement("button");
        buttonGroup.appendChild(button1);
        button1.type = "button";
        button1.className = "btn " + style + " dropdown-toggle dropdown-toggle-split";
        button1.setAttribute("data-bs-toggle", "dropdown");
        button1.setAttribute("aria-expanded", "false");

        var visuallyHidden = document.createElement("span");
        button1.appendChild(visuallyHidden);
        visuallyHidden.className = "visually-hidden";
        visuallyHidden.innerHTML = "Toggle Dropdown";

        var ul = document.createElement("span");
        buttonGroup.appendChild(ul);
        if (isdark)
            ul.className = "dropdown-menu dropdown-menu-dark";
        else
            ul.className = "dropdown-menu";

        return ul;
    };

    DomUtils.createButtonGroup = function(parent, style, icon, text, isdark) {
        var buttonGroup = document.createElement("div");
        parent.appendChild(buttonGroup);
        buttonGroup.className = "btn-group";

        var button = document.createElement("button");
        buttonGroup.appendChild(button);
        button.type = "button";
        button.className = "btn " + style + " dropdown-toggle " + icon;
        button.innerHTML = text;
        button.setAttribute("data-bs-toggle", "dropdown");
        button.setAttribute("aria-expanded", "false");

        var ul = document.createElement("span");
        buttonGroup.appendChild(ul);
        if (isdark)
            ul.className = "dropdown-menu dropdown-menu-dark";
        else
            ul.className = "dropdown-menu";

        return ul;
    };

    DomUtils.createDropdownItem = function(parent, icon, url, text) {
        var li = document.createElement("li");
        parent.appendChild(li);
        var a = document.createElement("A");
        li.appendChild(a);
        a.className = "dropdown-item";
        a.href = url;
        if (icon != "") {
            var i = document.createElement("i");
            a.appendChild(i);
            i.className = icon;
        }
        a.appendChild(document.createTextNode(text));
        return a;
    };

    DomUtils.createTool = function(group, id, title, style, fonttag, fontclass) {
        var button = document.createElement("button");
        group.appendChild(button);
        button.className = style + " " + fontclass;
        button.setAttribute("title", title);
        button.type = "button";
        button.id = id;
        button.appendChild(document.createTextNode(title));
        return button;
    };

    DomUtils.buttonGroup = function(parent, groupName){
        var buttonGroup = document.createElement("div");
        parent.appendChild(buttonGroup);
        buttonGroup.className = "btn-group btn-group-sm me-2";
        buttonGroup.setAttribute("role", "group");
        buttonGroup.setAttribute("aria-label", groupName);
        return buttonGroup;
    };

    DomUtils.toolbar = function(parent, toobarname){
        var toolbar = document.createElement("div");
        parent.appendChild(toolbar);
        toolbar.className = "btn-toolbar mt-2";
        toolbar.setAttribute("role", "toolbar");
        toolbar.setAttribute("aria-label", toobarname);
        return toolbar;
    };

    DomUtils.enableButton = function(button) {
        button.disabled = false;
    };

    DomUtils.disableButton = function(button) {
        button.disabled = true;
    };
    
    DomUtils.newSrOnly = function (parent) {
        var el = document.createElement("span");
        parent.appendChild(el);
        el.className = "sr-only";
        el.innerHTML = "(current)";
    }
    
    DomUtils.dynamicLoadCss = function(url) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.type='text/css';
        link.rel = 'stylesheet';
        link.href = url;
        head.appendChild(link);
    }
    
    DomUtils.dynamicLoadIframe = function (url,callback,style) {
        var body = document.getElementsByTagName('body')[0];
        var iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style=style||'display:none;width:0px;height:0px;';
        if(typeof(callback)=='function'){
            // Others       // IE
            iframe.onload = iframe.onreadystatechange = function () {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                    callback();
                    iframe.onload = iframe.onreadystatechange = null;
                }
            };
        }
        body.appendChild(iframe);
    }
    
    DomUtils.dynamicLoadScript = function (url, callback){
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = false;
        document.head.appendChild(script);
        if(typeof(callback)=='function'){
            // Others       // IE
            script.onload = script.onreadystatechange = function () {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete"){
                    callback();
                    script.onload = script.onreadystatechange = null;
                }
            };
        }
        script.src = url;
        head.appendChild(script);
    };

    DomUtils.browserType = function() {
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
    };

    // this codes in this method are from Internet, it is working.
    DomUtils.isIE = function() {
        var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
        var isIE = userAgent.indexOf("compatible") > -1
            && userAgent.indexOf("MSIE") > -1 && !isOpera; // 判断是否IE浏览器
        if (isIE) {
            return "1";
        } else {
            return "-1";
        }
    };


   
    _global = (function(){return this || (0, eval)('this');}());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = DomUtils;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return DomUtils; });
    } else {
        !("DomUtils" in _global) && (_global.DomUtils = DomUtils);
    }
})();