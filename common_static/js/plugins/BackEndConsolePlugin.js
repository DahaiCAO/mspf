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
    
    var BackEndConsolePlugin = function (element, options) {
        this._id = "BackEndConsolePlugin";
        this._plugin_name = "BackEndConsolePlugin";
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
    
    BackEndConsolePlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            var col1 = DomUtils.propRow(this._element);
            var toolbar = DomUtils.toolbar(col1, "toolbar");
            var group1 = DomUtils.buttonGroup(toolbar, "button group");
            this.button1 = DomUtils.createButton(group1, "btn-outline-primary", "bi bi-eraser-fill", " 清空", "清空控制台");
            this.button2 = DomUtils.createButton(group1, "btn-outline-primary", "bi bi-clipboard", " 拷贝", "拷贝数据");
            var group2 = DomUtils.buttonGroup(toolbar, "button group");
            this.button3 = DomUtils.createButton(group2, "btn-success", "bi bi-plus", " 新建", "新建控制台");
      
            var col2 = DomUtils.propRow(this._element);
            this.textarea = DomUtils.createTextArea(col2, "backendConsole", "", "", "");
            this.textarea[0].rows = "10";



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
        module.exports = BackEndConsolePlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return BackEndConsolePlugin; });
    } else {
        !("BackEndConsolePlugin" in _global) && (_global.BackEndConsolePlugin = BackEndConsolePlugin);
    }
})();