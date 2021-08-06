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
    
    var RenameFileFolderPlugin = function (element, options) {
        this._id = "RenameFileFolderPlugin";
        this._plugin_name = "RenameFileFolderPlugin";
        this._author = "cdh";
        this._datetime = "20210730";
        this._pluginType = "";
        this._keywords = "";
        this._description = "rename a file or folder";
        this._version = "1.0 based on plugin template 7.0";
        this._copyright = "";
        // default settings for options
        this._settings = extend({}, defaults, options);
        this._element = element;
        this.init();
    };
    
    RenameFileFolderPlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            var modalBody = DomUtils.newelement(this._element, "div");
            modalBody.className = "modal-body";
            
            var row2 = DomUtils.newelement(modalBody, "div");
            row2.className = "row";
            var col2 = DomUtils.newelement(row2, "div");
            col2.className = "col";
            this.renameFolderFile = DomUtils.createTextInput(col2, "renameFolderFile", "重命名", "", "目录或文件名称");

            var row3 = DomUtils.newelement(this._element, "div");
            row3.className = "modal-footer";
            DomUtils.createCancelButton(row3);
            this.okButton = DomUtils.createOKButton(row3);
            this.okButton.addEventListener("click", this, false);

        },
        setEntity : function(entity) {
            this.entity = entity;
            this.renameFolderFile[0].value = this.entity.name;
        },
        getEntity: function() {
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
            if (target == this.okButton) {
                var that = this;
                $.ajax({
                    url: service.api1(0, 12),
                    data: {
                        oldFolderFileName: this.entity.context,
                        oldName: this.entity.name,
                        newFolderFileName: this.renameFolderFile[0].value,
                    },
                    type: 'POST',
                    dataType: 'JSON',
                    complete: function (data) {
                        that._settings.parent.hide();
                        that._settings.caller.refresh();
                    },
                });
            }
        },
    };
    
    _global = (function(){return this || (0, eval)('this');}());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = RenameFileFolderPlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return RenameFileFolderPlugin; });
    } else {
        !("RenameFileFolderPlugin" in _global) && (_global.RenameFileFolderPlugin = RenameFileFolderPlugin);
    }
})();