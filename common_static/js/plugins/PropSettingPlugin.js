/**
 * This is service plugin for system setting.
 * Designer: Dahai Cao designed in Beijing at 2021-02-21 10:40
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
        myParent: "", // parent plugin object
        width: "", // width settings
        height: "", // height settings
        theme: "light", // "dark" theme, "light" theme, "dark-light" theme, by default.
        title: "",
    };
    
    var PropSettingPlugin = function (element, options) {
        this.id = "PropSettingPlugin";
        this._plugin_name = "PropSettingPlugin";
        this._author = "cdh";
        this._datetime = "";
        this._pluginType = "";
        this._keywords = "";
        this._description = "";
        this._version = "1.0 based on plugin template 7.0";
        this._copyright = "";
        // default settings for options
        if (typeof options === 'object' || options !== null)
            this._settings = extend({}, defaults, options);
        this.frontCSS = "navbar-light";
        this.bgCSS = "bg-light";
        if (typeof this._settings.theme === "string") {
            if (this._settings.theme == "dark") {
                this.frontCSS = "navbar-dark";
                this.bgCSS = "right-nav-bg-dark";
            } else if (this._settings.theme == "light") {
                this.frontCSS = "navbar-light";
                this.bgCSS = "right-nav-bg-light";
            } else if (this._settings.theme == "dark-light") {
                this.frontCSS = "navbar-dark";
                this.bgCSS = "right-nav-bg-dark";
            } else if (this._settings.theme == "red") { // other custom themes
                
            }
        }
        this.element = element;
        this.init();
    };
    
    PropSettingPlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            var propContent = DomUtils.newelement(this.element, "div");
            propContent.className = "navbar-nav-top-right";
            propContent.classList.add(this.frontCSS);
            propContent.classList.add(this.bgCSS);

            var settingPane = DomUtils.newelement(propContent, "div");
            settingPane.className = "setting-pane";
            
            var settingTitle = DomUtils.newelement(settingPane, "div");
            settingTitle.className = "setting-title py-3 px-2";
            
            var settingTitle = DomUtils.newelement(settingTitle, "span");
            settingTitle.innerHTML = this._settings.title;
            
            var settingToggler = DomUtils.newelement(settingTitle, "span");
            settingToggler.className = "navbar-nav-top-right-toggler";
            
            var settingI = DomUtils.newelement(settingToggler, "i");
            settingI.className = "fa fa-chevron-circle-right";
            settingI.setAttribute("aria-hidden", "true");

            this.settingContent = DomUtils.newelement(settingPane, "div");
            this.settingContent.className = "settings-content";

            var overlay = DomUtils.newelement(this.element, "div");
            overlay.className = "right-navbar-nav-overlay";
            
            $(".settings-content").mCustomScrollbar({
                theme: "minimal"
            });

            $('.navbar-nav-top-right-toggler, .right-navbar-nav-overlay').on('click', function () {
                $('.navbar-nav-top-right').removeClass('active');
                $('.right-navbar-nav-overlay').removeClass('active');
            });

            $('.show-navbar-nav-top-right').on('click', function () {
                $('.navbar-nav-top-right').addClass('active');
                $('.right-navbar-nav-overlay').addClass('active');
            });
        },
        setProperty : function(editor, pathList, entity) {
            if (typeof pathList === 'object' &&
                Object.prototype.toString.call(pathList) === '[object Array]') {
                this.pluginNameList = pathList;
            }
            DomUtils.removeChildren(this.settingContent);
            var that = this;
            for (var i = 0;i<this.pluginNameList.length;i++) {
                var pluginPath = this.pluginNameList[i];
                DomUtils.dynamicLoadScript(pluginPath, function(){
                    // pluginPath is /path/path/pluginName.js
                    var pluginName = pluginPath.substr(pluginPath.lastIndexOf("/") + 1, pluginPath.length); // get pluginName.js from pluginPath
                    pluginName = pluginName.substr(0, pluginName.length - 3); // remove '.js' from pluginName.js
                    var my = new (eval(pluginName))(that.settingContent, {
                        ownerId: that._settings.ownerId,
                    });
                    if (typeof my.setEntity === "function") {
                        my.setEntity(entity);
                    }
                    if (typeof my.setMainContentPane === "function") {
                        my.setMainContentPane(editor);
                    }
                });
            }
            //this.show();
        },
        show: function() {
            $('.navbar-nav-top-right').addClass('active');
            $('.right-navbar-nav-overlay').addClass('active');
        },
    };
    
    _global = (function(){return this || (0, eval)('this');}());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = PropSettingPlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return PropSettingPlugin; });
    } else {
        !("PropSettingPlugin" in _global) && (_global.PropSettingPlugin = PropSettingPlugin);
    }
})();