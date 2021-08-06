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
    
    var ServicePlugin = function (element, options) {
        this._id = "ServicePlugin";
        this._plugin_name = "ServicePlugin";
        this._author = "曹大海";
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
    
    ServicePlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            // 用新接口
            var content = DomUtils.newelement(this._element, "div");
            // 原生
            // var content = document.createElement("div");
            // this.element.appendChild(content);

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
        module.exports = ServicePlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return ServicePlugin; });
    } else {
        !("ServicePlugin" in _global) && (_global.ServicePlugin = ServicePlugin);
    }
})();