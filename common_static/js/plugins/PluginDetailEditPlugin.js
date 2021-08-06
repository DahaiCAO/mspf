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
    };
    
    var PluginDetailEditPlugin = function (element, options) {
        this._id = "PluginDetailEditPlugin";
        this._plugin_name = "PluginDetailEditPlugin";
        this._author = "cdh";
        this._datetime = "";
        this._pluginType = "";
        this._keywords = "";
        this._description = "";
        this._version = "1.0 based on plugin template 7.0";
        this._copyright = "";
        // default settings for options
        this._settings = extend({}, defaults, options);
        this._element = element;
        this.init();
    };
    
    PluginDetailEditPlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            var row1 = DomUtils.newelement(this._element, "div");
            row1.className = "row";
            var col1 = DomUtils.newelement(row1, "div");
            col1.className = "col";
            this.pluginName = DomUtils.createTextInput(col1, "pluginName", "插件名称", "", "插件名称");
            var col2 = DomUtils.newelement(row1, "div");
            col2.className = "col";
            this.developer = DomUtils.createTextInput(col2, "developer", "开发者", "", "开发者");

            var row2 = DomUtils.newelement(this._element, "div");
            row2.className = "row";
            var col21 = DomUtils.newelement(row2, "div");
            col21.className = "col";
            this.version = DomUtils.createTextInput(col21, "version", "版本", "", "v0.0.1");
            var col22 = DomUtils.newelement(row2, "div");
            col22.className = "col";
            this.copyright = DomUtils.createTextInput(col22, "copyright", "版权所有", "", "版权所有者全称");

            var row3 = DomUtils.newelement(this._element, "div");
            row3.className = "row";
            var col3 = DomUtils.newelement(row3, "div");
            col3.className = "col";
            this.description = DomUtils.createTextArea(col3, "description", "描述", "", "描述");

            var row4 = DomUtils.newelement(this._element, "div");
            row4.className = "row";
            var col41 = DomUtils.newelement(row4, "div");
            col41.className = "col";
            this.keywords = DomUtils.createTextInput(col41, "keywords", "关键词", "", "关键词以空格分离");

            var row5 = DomUtils.newelement(this._element, "div");
            row5.className = "row";
            var col42 = DomUtils.newelement(row5, "div");
            col42.className = "col";
            this.logo = DomUtils.createTextInput(col42, "logo", "商标URL", "", "商标URL，http://...");

            var row6 = DomUtils.newelement(this._element, "div");
            row6.className = "row";
            var col61 = DomUtils.newelement(row6, "div");
            col61.className = "col";
            this.defaultOptions = DomUtils.createTextArea(col61, "defaultOptions", "默认选项", "", "默认选项或参数");

            var row7 = DomUtils.newelement(this._element, "div");
            row7.className = "row";
            var col71 = DomUtils.newelement(row7, "div");
            col71.className = "col";
            this.pricing = DomUtils.createTextInput(col71, "pricing", "价格（元）", "0.00",  "0.00");

            var row8 = DomUtils.newelement(this._element, "div");
            row8.className = "row";
            var col81 = DomUtils.newelement(row8, "div");
            col81.className = "col";
            this.banned = DomUtils.createNormalSelect(col81, "banned", "状态");
            DomUtils.addOptions(this.banned, "未禁", "0", 0);
            DomUtils.addOptions(this.banned, "已禁", "1", 1);

            if (this._settings.currId != 0) {
                this.loadPlugin(this._settings.currId);
            }
            //this.banned.addEventListener("change", this, false);
        },
        loadPlugin : function(pluginId) {
            var that = this;
            $.ajax({
                url: service.api(0, 2),
                data: {
                    pluginId: pluginId,
                },
                type: 'GET',
                dataType: 'JSON',
                complete: function (data) {
                    data = data.responseJSON;
                    that.pluginName[0].value = data.name;
                    that.developer[0].value = data.developer;
                    that.version[0].value = data.pluginVersion;
                    that.copyright[0].value = data.copyright;
                    that.description[0].value = data.pluginDescription;
                    that.keywords[0].value = data.keywords;
                    that.logo[0].value = data.logo;
                    that.defaultOptions[0].value = data.defaultOptions;
                    that.pricing[0].value = data.pricing;
                    that.banned.value = data.banned;
                },
            });
        },
        handleEvent : function(e) {
            switch (e.type) {
                case "click":
                    this.doClick(e);
                    break;

            }
        },
        doClick : function(e) {
            var item = e.target;
        },
        getEntity: function() {
            var o = {
                pluginName: this.pluginName[0].value,
                developer: this.developer[0].value,
                version: this.version[0].value,
                copyright: this.copyright[0].value,
                description: this.description[0].value,
                keywords: this.keywords[0].value,
                logo: this.logo[0].value,
                defaultOptions: this.defaultOptions[0].value,
                pricing: this.pricing[0].value,
                banned: this.banned.value,
            }
            return o;
        },
    };
    
    _global = (function(){return this || (0, eval)('this');}());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = PluginDetailEditPlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return PluginDetailEditPlugin; });
    } else {
        !("PluginDetailEditPlugin" in _global) && (_global.PluginDetailEditPlugin = PluginDetailEditPlugin);
    }
})();