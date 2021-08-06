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
    
    var CreateFilePlugin = function (element, options) {
        this._id = "CreateFilePlugin";
        this._plugin_name = "新建文件插件";
        this._author = "cdh";
        this._datetime = "20210728";
        this._pluginType = "";
        this._keywords = "";
        this._description = "在一个已知的目录下面新建一个文件";
        this._version = "1.0 based on plugin template 7.0";
        this._copyright = "";
        // default settings for options
        this._settings = extend({}, defaults, options);
        this._element = element;
        this.init();
    };
    
    CreateFilePlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            var modalBody = DomUtils.newelement(this._element, "div");
            modalBody.className = "modal-body";
            var row1 = DomUtils.newelement(modalBody, "div");
            row1.className = "row";
            var col1 = DomUtils.newelement(row1, "div");
            col1.className = "col";
            this.parentFolder = DomUtils.createTextInput(col1, "parentFolder", "新建文件所在目录", "", "目录名称");
            this.parentFolder[0].readOnly = true;
            var row2 = DomUtils.newelement(modalBody, "div");
            row2.className = "row";
            var col2 = DomUtils.newelement(row2, "div");
            col2.className = "col";
            this.newFileName = DomUtils.createTextInput(col2, "newFileName", "新建文件名", "", "文件名称");

            var row3 = DomUtils.newelement(this._element, "div");
            row3.className = "modal-footer";
            DomUtils.createCancelButton(row3);
            this.createButton = DomUtils.newCreateButton(row3);
            this.createButton.addEventListener("click", this, false);
            
        },
        setEntity : function(entity) {
            this.entity = entity;
            this.parentFolder[0].value = this.entity.dirName;
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
            if (target == this.createButton) {
                var that = this;
                $.ajax({
                    url: service.api1(0, 11),
                    data: {
                        parentFolder: this.parentFolder[0].value,
                        name: this.newFileName[0].value,
                        type: 0,
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
        module.exports = CreateFilePlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return CreateFilePlugin; });
    } else {
        !("CreateFilePlugin" in _global) && (_global.CreateFilePlugin = CreateFilePlugin);
    }
})();