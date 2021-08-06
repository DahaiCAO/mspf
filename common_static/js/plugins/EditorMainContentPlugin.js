/**
 *
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
        showType: 0, // 0: general; 1: tabs
    };

    var EditorMainContentPlugin = function (element, options) {
        this._id = "SP_00000000000004N2";
        this._plugin_name = "编辑器的主编辑区";
        this._author = "cdh";
        this._datetime = "20210516";
        this._description = "显示主界面，一种是页签形式的，一种是非页签形式的";
        this._version = "1.0";
        // default settings for options
        this._settings = extend({}, defaults, options);
        this._element = element;
        this._mainPane = null;
        this.init();
    };

    EditorMainContentPlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            var that = this;
            var content = DomUtils.newelement(this._element, "div");
            content.className = "w-100";
            if (this._settings.showType == 0) { // non-tab content

            } else if (this._settings.showType == 1) { // tab content
                DomUtils.dynamicLoadScript(jspath + "EditorTabContentPlugin.js", function(){
                    that._mainPane = new EditorTabContentPlugin(managerbody, {
                        ownerId : that._settings.ownerId,
                    });
                    // set property setting panel
                    that._mainPane.setSettingPane(that.settingPane);
                    // set left side menu
                    that._mainPane.setLeftMenu(that.leftMenu);
                });
            }
        },
        showPane: function(editingPluginPath, ownerId, currId, name, icon, grantOperations, context) {
            // editingPluginPath, ownerId, currId, name, icon, grants, context
            this._mainPane.show(editingPluginPath, ownerId, currId, name, icon, grantOperations, context);
        },
        update: function() {
            this.init();
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
        setSettingPane : function(settingPane) {
            this.settingPane = settingPane;
        },
        setLeftMenu : function(leftMenu) {
            this.leftMenu = leftMenu;
        },
    };

    _global = (function(){return this || (0, eval)('this');}());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = EditorMainContentPlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return EditorMainContentPlugin; });
    } else {
        !("EditorMainContentPlugin" in _global) && (_global.EditorMainContentPlugin = EditorMainContentPlugin);
    }
})();