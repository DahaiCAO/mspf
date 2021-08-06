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
    
    var CreateFolderPlugin = function (element, options) {
        this._id = "CreateFolderPlugin";
        this._plugin_name = "创建目录插件";
        this._author = "cdh";
        this._datetime = "20210728";
        this._pluginType = "";
        this._keywords = "";
        this._description = "在一个已知的目录下，新建一个目录。";
        this._version = "1.0 based on plugin template 7.0";
        this._copyright = "";
        // default settings for options
        this._settings = extend({}, defaults, options);
        this._element = element;
        this.init();
    };
    
    CreateFolderPlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            var modalBody = DomUtils.newelement(this._element, "div");
            modalBody.className = "modal-body";
            var row1 = DomUtils.newelement(modalBody, "div");
            row1.className = "row";
            var col1 = DomUtils.newelement(row1, "div");
            col1.className = "col";
            this.parentFolder = DomUtils.createTextInput(col1, "parentFolder", "新建目录所在目录", "", "目录名称");
            this.parentFolder[0].readOnly = true;
            var row2 = DomUtils.newelement(modalBody, "div");
            row2.className = "row";
            var col2 = DomUtils.newelement(row2, "div");
            col2.className = "col";
            this.newFolder = DomUtils.createTextInput(col2, "newFolder", "新建目录", "", "目录名称");

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
                        name: this.newFolder[0].value,
                        type: 1,
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
        module.exports = CreateFolderPlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return CreateFolderPlugin; });
    } else {
        !("CreateFolderPlugin" in _global) && (_global.CreateFolderPlugin = CreateFolderPlugin);
    }
})();