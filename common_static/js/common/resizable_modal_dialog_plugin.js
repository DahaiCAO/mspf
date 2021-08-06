/**
 *
 * Designer: Dahai Cao designed version 7 in Beijing at 13：41 on 2021-05-14
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
        size: "", // extra_large, large, normal, small
        title : "对话框",
        icon : "",
        iconColor: "text-primary",
        cancelButtonText : "取消",
        pluginPathList : [],
    };

    var ResizableModalDialogPlugin = function (element, options) {
        this._id = "ResizableModalDialogPlugin";
        this._plugin_name = "ResizableModalDialogPlugin";
        this._author = "cdh";
        this._datetime = "20210519";
        this._description = "这个对话框是一个可伸缩的对话框。";
        this._version = "1.0 based on plugin template 7.0";
        // default settings for options
        this._settings = extend(true, {}, defaults, options);
        this._element = element;
        this.id;
        this.init();
    };

    ResizableModalDialogPlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            this.dialog = DomUtils.newelement(this._element, "div");
            this.dialog.className = "modal fade";
            this.dialog.id = "dialog" + this.id;
            this.dialog.tabindex = -1;
            this.dialog.setAttribute("data-bs-backdrop", "static");
            this.dialog.setAttribute("data-bs-keyboard", "false");
            this.dialog.setAttribute("role", "dialog");
            this.dialog.setAttribute("aria-labelledby", "staticBackdropLabel" + this.id);
            this.dialog.setAttribute("aria-hidden", "true");
            var that = this;
            this.dialog.addEventListener('show.bs.modal', function (event) {
                $('.modal-dialog').draggable({
                    handle: ".modal-header",
                    cursor: 'move',
                });
                $('.modal-content').resizable();
                if (that.parent != undefined && that.parent.loading) {
                    that.parent.loading();
                }
            })
            this.dialog.addEventListener('hidden.bs.modal', function (event) {
                if (that.parent != undefined && that.parent.unloading) {
                    that.parent.unloading();
                }
            });

            var modalDialog = DomUtils.newelement(this.dialog, "div");
            modalDialog.className = "modal-dialog";
            if (this._settings.size == "extra_large") {
                modalDialog.classList.add("modal-xl");
            } else if (this._settings.size == "large") {
                modalDialog.classList.add("modal-lg");
            } else if (this._settings.size == "small") {
                modalDialog.classList.add("modal-sm");
            }

            var modalContent = DomUtils.newelement(modalDialog, "div");
            modalContent.className = "modal-content modal-dialog-scrollable";

            var modalHeader = DomUtils.newelement(modalContent, "div");
            modalHeader.className = "modal-header";

            var h5 = DomUtils.newelement(modalHeader, "h5");
            h5.className = "modal-title";
            h5.id = "staticBackdropLabel" + this.id;
            if (this._settings.icon != "") {
                var icon = DomUtils.newelement(h5, "i");
                icon.className = this._settings.icon + " " + this._settings.iconColor;
                h5.appendChild(document.createTextNode(" " + this._settings.title));
            } else {
                h5.appendChild(document.createTextNode(this._settings.title));
            }

            var closeButton = DomUtils.newelement(modalHeader, "button");
            closeButton.type = "button";
            closeButton.className = "btn-close";
            closeButton.setAttribute("data-bs-dismiss", "modal");
            closeButton.setAttribute("aria-label", "Close");

            var modalBody = DomUtils.newelement(modalContent, "div");
            modalBody.className = "modal-body";

            var that = this;
            this.my = null;
            for (var i = 0; i < this._settings.pluginPathList.length; i++) {
                var pluginPath = this._settings.pluginPathList[i];
                DomUtils.dynamicLoadScript(pluginPath, function(){
                    // pluginPath is /path/path/pluginName.js
                    var pluginName = pluginPath.substr(pluginPath.lastIndexOf("/")+1, pluginPath.length); // get pluginName.js from pluginPath
                    pluginName = pluginName.substr(0, pluginName.length-3); // remove '.js' from pluginName.js
                    that.my = new (eval(pluginName))(modalBody, {
                        ownerId: that._settings.ownerId,
                        currId: that._settings.currId,
                    });
                    if (that.my.setEntity != undefined &&
                        typeof that.my.setEntity === "function") {
                        that.my.setEntity(that.entity);
                    }
                    if (that.my.setMainContentPane != undefined &&
                        typeof that.my.setMainContentPane === "function") {
                            that.my.setMainContentPane(that.mainContent);
                    }
                    if (that.my.setParent != undefined &&
                        typeof that.my.setParent === "function") {
                            that.my.setParent(that.parent);
                    }
                });
            }

            this.modalFooter = DomUtils.newelement(modalContent, "div");
            this.modalFooter.className = "modal-footer";

            var cancelButton = DomUtils.newelement(this.modalFooter, "button");
            cancelButton.type = "button";
            cancelButton.className = "btn btn-secondary";
            cancelButton.setAttribute("data-bs-dismiss", "modal");
            cancelButton.innerHTML = this._settings.cancelButtonText;
        },
        setParent : function(parent) {
            this.parent = parent;
        },
        createHandleButtons : function(name, text) {
            if (this.parent != undefined && this.parent.createButtons) {
                this.parent.createButtons(this.modalFooter, name, text);
            }
        },
        show : function() {
            var myModal = new bootstrap.Modal(this.dialog, {
                keyboard: false
            });
            myModal.show();
        },
        hide: function() {
            // var myModal = new bootstrap.Modal(this.dialog, {
            //     keyboard: false
            // });
            // myModal.hide();
            $(this.dialog).modal('hide');
        },
        dispose: function() {
            var myModal = new bootstrap.Modal(this.dialog, {
                keyboard: false
            });
            myModal.dispose();
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
        setEntity : function(entity) {
            this.entity = entity;
            if (this.my != undefined) 
                this.my.setEntity(this.entity);
        },
        fetchEntity : function() {
            return this.my.getEntity();
        },
        // this is main content panel
        setMainContentPane : function(mainContent) {
            this.mainContent = mainContent;
        },

    };

    _global = (function(){return this || (0, eval)('this');}());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = ResizableModalDialogPlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return ResizableModalDialogPlugin; });
    } else {
        !("ResizableModalDialogPlugin" in _global) && (_global.ResizableModalDialogPlugin = ResizableModalDialogPlugin);
    }
})();