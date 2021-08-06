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
        title : "静态对话框",
        icon : "",
        iconColor: "text-primary",
        cancelButtonText : "知道了",
    };

    var StaticModalDialogPlugin = function (element, options) {
        this._id = "StaticModalDialogPlugin";
        this._plugin_name = "静态模态对话框";
        this._author = "cdh";
        this._datetime = "20210626";
        this._pluginType = "通用插件";
        this._keywords = "静态，对话框";
        this._description = "可以静态打开，除非点击取消或确定按钮，否则不会自动关闭";
        this._version = "1.0 based on plugin template 7.0";
        this._copyright = "2021";
        // default settings for options
        this._settings = extend(true, {}, defaults, options);
        this._element = element;
        this.init();
    };

    StaticModalDialogPlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            // modal
            this.dialog = document.createElement("div");
            this._element.appendChild(this.dialog);
            this.dialog.className = "modal fade";
            this.dialog.id = "staticBackdrop" + this.id;
            this.dialog.tabIndex = "-1";
            this.dialog.setAttribute("data-bs-backdrop", "static");
            this.dialog.setAttribute("data-bs-keyboard", "false");
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

            var modalDialog = document.createElement("div");
            this.dialog.appendChild(modalDialog);
            modalDialog.className = "modal-dialog";

            var modalContent = document.createElement("div");
            modalDialog.appendChild(modalContent);
            modalContent.className = "modal-content";

            var modalHeader = document.createElement("div");
            modalContent.appendChild(modalHeader);
            modalHeader.className = "modal-header";

            var h5 = document.createElement("h5");
            modalHeader.appendChild(h5);
            h5.className = "modal-title";
            h5.id = "staticBackdropLabel" + this.id;
            if (this._settings.icon != "") {
                var icon = document.createElement("i");
                h5.appendChild(icon);
                icon.className = this._settings.icon + " " + this._settings.iconColor;
                h5.appendChild(document.createTextNode(" " + this._settings.title));
            } else {
                h5.appendChild(document.createTextNode(this._settings.title));
            }

            var closeButton = document.createElement("button");
            modalHeader.appendChild(closeButton);
            closeButton.type = "button";
            closeButton.className = "btn-close";
            closeButton.setAttribute("data-bs-dismiss", "modal");
            closeButton.setAttribute("aria-label", "Close");

            this.modalBody = document.createElement("div");
            modalContent.appendChild(this.modalBody);
            this.modalBody.className = "modal-body";

            this.modalFooter = document.createElement("div");
            modalContent.appendChild(this.modalFooter);
            this.modalFooter.className = "modal-footer";

            var cancelButton = document.createElement("button");
            this.modalFooter.appendChild(cancelButton);
            cancelButton.type = "button";
            cancelButton.className = "btn btn-secondary";
            cancelButton.setAttribute("data-bs-dismiss", "modal");
            cancelButton.innerHTML = this._settings.cancelButtonText;
        },
        setParent : function(parent) {
            this.parent = parent;
        },
        show : function(msg) {
            var myModal = new bootstrap.Modal(this.dialog, {
                keyboard: false
            });
            this.modalBody.innerHTML = msg;
            myModal.show();
        },
        hide: function() {
            $(this.dialog).modal('hide');
        },
        dispose: function() {
            var myModal = new bootstrap.Modal(this.dialog, {
                keyboard: false
            });
            myModal.dispose();
        },
        setEntity : function(entity) {
            this.entity = entity;
        },
        fetchEntity : function() {
            return this.entity;
        },
        // this is main content panel
        setMainContentPane : function(mainContent) {
            this.mainContent = mainContent;
        },
    };

    _global = (function(){return this || (0, eval)('this');}());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = StaticModalDialogPlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return StaticModalDialogPlugin; });
    } else {
        !("StaticModalDialogPlugin" in _global) && (_global.StaticModalDialogPlugin = StaticModalDialogPlugin);
    }
})();