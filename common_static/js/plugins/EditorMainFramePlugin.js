/**
 * This is UI editor plugin. It integrates top navbar plugin, left side navbar plugin, main content plugin.
 * Designer: Dahai Cao designed in Beijing at 2021-02-21 10:40
 */
;(function (undefined) {
    "use strict"
    
    var _global;
    
    var defaults = {
        currId: "", // current Subsystem Id
        userName: "",// user full name
        userId: "", // user Id
        ownerId: "", // owner Id, such as organization Id
        ownerName: "", // owner name, such as organization Id
        sessionId: "", // session Id
        sidebarUrl: "",
        sidebarParam: "",
        theme: "",
        topbar: "", // 
        sidebar: "", //
    };
    
    var EditorMainFramePlugin = function (element, options) {
        this._id = "SP_00000000000004MO";
        this._plugin_name = "主界面框架插件";
        this._author = "cdh";
        this._datetime = "20210521";
        this._description = "主界面插件包含顶部菜单插件，左侧菜单插件，右侧属性设置插件，以及中间主界面的插件";
        this._version = "2.0 based on plugin template 7.0";
        // default settings for options
        this._settings = extend({}, defaults, options);
        this._element = element;
        this.init();
    };
    
    EditorMainFramePlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            // top navbar plugin
            var that = this;
            DomUtils.dynamicLoadScript(jspath + "EditorTopNavBarPlugin.js", function(){
                new EditorTopNavBarPlugin(that._element, {
                    userId: that._settings.userId,
                    ownerId: that._settings.ownerId,
                    theme: that._settings.theme,
                    currId: that._settings.currId,
                    hasLogo : true,
                    logoImg : imgpath + "logo_32x32.png",
                    ownerName: that._settings.ownerName,
                    userName: that._settings.userName,
                    hasNotify: false,
                    hasMe: false,
                    hasLeftNavbar: true,
                    togTarId: "EditorLeftNavBarPlugin",
                    topLeftMenuItems: [],
                    topRightMenuItems: that._settings.topbarMenuItems,
                    center: false,
                    sessionId: "",
                });
            });
            // left-side navbar plugin
            this.lmenu = null;
            DomUtils.dynamicLoadScript(jspath + "EditorLeftNavBarPlugin.js", function(){
                that.lmenu = new EditorLeftNavBarPlugin(that._element, {
                    theme: that._settings.theme,
                    hasLogo : false,
                    logoImg: imgpath + "logo_32x32.png",
                    brandUrl: "",
                    currId: that._settings.currId,
                    downloadUrl: that._settings.downloadUrl,
                    uploadUrl: that._settings.uploadUrl,
                    sidebarUrl: that._settings.sidebarUrl,
                    sidebarParam: that._settings.sidebarParam,
                    removeFileFolderUrl: that._settings.removeFileFolderUrl,
                    newFileFolderUrl: that._settings.newFileFolderUrl,
                    expendAllNodes : false,
                    userId: that._settings.userId, // user Id
                    ownerId: that._settings.ownerId,
                    ownerName: that._settings.ownerName,
                    menuItems: that._settings.sidebarMenuItems,
                });
            });

            // setting plugin
            var setting;
            DomUtils.dynamicLoadScript(jspath + "PropSettingPlugin.js", function(){
                setting = new PropSettingPlugin(that._element, {
                    title: "控制台",
                    theme: "light",
                    userId: that._settings.userId, // user Id
                    ownerId: that._settings.ownerId,
                    sessionId: that._settings.sessionId,
                });
                setting.setProperty(null, [jspath + "BackEndConsolePlugin.js",], null)
            });

            // main content panel
            var mainPane = null;
            DomUtils.dynamicLoadScript(jspath + "EditorMainContentPlugin.js", function(){
                mainPane = new EditorMainContentPlugin(that._element, {
                    showType: 1,
                    ownerId: that._settings.ownerId,
                    userId: that._settings.userId, // user Id
                    sessionId: that._settings.sessionId,
                });
                that.lmenu.setMainContentPane(mainPane);
                mainPane.setSettingPane(setting);
                mainPane.setLeftMenu(that.lmenu);
            });
        }
    };
    
    _global = (function(){return this || (0, eval)('this');}());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = EditorMainFramePlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return EditorMainFramePlugin; });
    } else {
        !("EditorMainFramePlugin" in _global) && (_global.EditorMainFramePlugin = EditorMainFramePlugin);
    }
})();