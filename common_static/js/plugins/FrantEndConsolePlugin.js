/**
 * 
 * Designer: Dahai Cao designed version 8 in Beijing at 13：41 on 2021-05-14
 */
 ;(function (undefined) {
    "use strict"
    
    var _global;
    
    var defaults = {
        userName: "",// user full name
        userId: "", // user Id
        ownerId: "", // owner Id, such as organization Id
        ownerName: "", // owner name, such as organization Id
        sessionId: "", // session Id
        currId: "",
        grant: "", // 1|1|1|1, add|delete|update|query, it can be changed.
    };
    
    var FrantEndConsolePlugin = function (element, options) {
        this._id = "FrantEndConsolePlugin";
        this._plugin_name = "FrantEndConsolePlugin";
        this._author = "cdh";
        this._datetime = "";
        this._pluginType = "";
        this._keywords = "";
        this._description = "";
        this._version = "1.0 based on plugin template 8.0";
        this._copyright = "";
        // default settings for options
        this._settings = extend({}, defaults, options);
        this._element = element;
        this.init();
    };
    
    FrantEndConsolePlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            // 用新接口
            var content = DomUtils.newelement(this._element, "div");
            // 原生
            // var content = document.createElement("div");
            // this.element.appendChild(content);

        },

        rundata : function() {  
            // //获取输入框内的数据  
            // var text = document.getElementById('editor').innerText;  
            // // 先清空iframe
            // if(document.getElementById("iframe1").contentWindow.document.body!=null){
            //     var iframe = document.getElementById("iframe1").contentWindow.document.body.innerText = "";
            // }
            // //添加script标签，去掉开头的行号
            // var ctext = "<script>"+text.replace(/\d\n/g, "")+'<\/script>';
            // console.log(ctext);
            // //替换控制台打印(伪装效果)
            // if(ctext.indexOf("console.log")>0){
            //     ctext = ctext.replace("console.log", "document.write");
            // }
            // console.log(ctext);
            // //将输入框内的数据传给iframe  
            // iframe = document.getElementById('iframe1').contentDocument.write(ctext);
        },
        handleEvent : function(e) {
            switch (e.type) {
                case "click":
                    this.doClick(e);
                    break;

            }
        },
        doClick : function(e) {
            var target = e.target;

        },
        hasGranted : function(g) {
            if (this._settings.grant != undefined && 
                typeof this._settings.grant === 'string') {
                var ary = this._settings.grant.split("|");
                for (var i=0; i<ary.length; i++) {
                    if (ary[i] == g) {
                        return true;
                    }
                }
            }
            return false;
        },
    };
    
    _global = (function(){return this || (0, eval)('this');}());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = FrantEndConsolePlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return FrantEndConsolePlugin; });
    } else {
        !("FrantEndConsolePlugin" in _global) && (_global.FrantEndConsolePlugin = FrantEndConsolePlugin);
    }
})();