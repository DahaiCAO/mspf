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
    
    var CopyMoveToPlugin = function (element, options) {
        this._id = "CopyMoveToPlugin";
        this._plugin_name = "创建目录插件";
        this._author = "cdh";
        this._datetime = "20210730";
        this._pluginType = "";
        this._keywords = "";
        this._description = "Copy and move to other directory";
        this._version = "1.0 based on plugin template 7.0";
        this._copyright = "";
        // default settings for options
        this._settings = extend({}, defaults, options);
        this._element = element;
        this.init();
    };
    
    CopyMoveToPlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            var modalBody = DomUtils.newelement(this._element, "div");
            modalBody.className = "modal-body";
            var row1 = DomUtils.newelement(modalBody, "div");
            row1.className = "row";
            var col1 = DomUtils.newelement(row1, "div");
            col1.className = "col";
            this.srcFolderFile = DomUtils.createTextInput(col1, "srcFolderFile", "源目录或源文件", "", "目录或文件名称");
            this.srcFolderFile[0].readOnly = true;
            var row2 = DomUtils.newelement(modalBody, "div");
            row2.className = "row";
            var col2 = DomUtils.newelement(row2, "div");
            col2.className = "col";
            this.distFolder = DomUtils.createSelect(col2, "distFolder", "目标目录");
            DomUtils.addOptions(this.distFolder[0], "- 请选择 -", "-1", 0);
            this.distFolder[0].addEventListener("change", this, false);

            var row3 = DomUtils.newelement(this._element, "div");
            row3.className = "modal-footer";
            DomUtils.createCancelButton(row3);
            this.okButton = DomUtils.createOKButton(row3);
            this.okButton.addEventListener("click", this, false);
            this.okButton.disabled = true;

        },
        loadDistDirectories : function(dirname) {
            var that = this;
            $.ajax({
                url: service.api1(0, 13),
                data: {
                    dirname: dirname,
                    pluginId: this._settings.currId,
                },
                type: 'POST',
                dataType: 'JSON',
                complete: function (data) {
                    data = data.responseJSON;
                    for (var i = 0; i < data.length; i++) {
                        DomUtils.addOptions(that.distFolder[0], data[i], data[i], i+1);
                    }
                },
            });
        },
        setEntity : function(entity) {
            this.entity = entity;
            this.srcFolderFile[0].value = this.entity.context
            this.loadDistDirectories(this.entity.dirName);
        },
        getEntity: function() {
        },
        handleEvent : function(e) {
            switch (e.type) {
                case "click":
                    this.doClick(e);
                    break;
                case "change":
                    this.doChange(e);
                    break;
            }
        },
        doChange : function(e) {
            var target = e.target;
            if (target == this.distFolder[0]) {
                if (this.distFolder[0].value != "-1")
                    this.okButton.disabled = false;
                else 
                    this.okButton.disabled = true;
            }
        },
        doClick : function(e) {
            var target = e.target;
            if (target == this.okButton) {
                var that = this;
                $.ajax({
                    url: service.api1(0, 14),
                    data: {
                        srcFolder: this.srcFolderFile[0].value,
                        distFolder: this.distFolder[0].value,
                        operation: this._settings.parent._settings.operation,
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
        module.exports = CopyMoveToPlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return CopyMoveToPlugin; });
    } else {
        !("CopyMoveToPlugin" in _global) && (_global.CopyMoveToPlugin = CopyMoveToPlugin);
    }
})();