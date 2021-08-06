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
        grant: "", // 1|1|1|1, add|delete|update|query, it can be changed.
        objects: [],
        name: "",
        logo: "",
        pluginVersion: "",
        developer: "",
        pluginDescription:"",
        useCounting:"",
        likeCounting:"",
        keywords:"",
        defaultOptions:"",
        isFree:"",
        pricing:"",
        banned:"",
        createDatetime:"",
        lastupdate:"",
        license:"",
    };
    
    var PluginCardLabelPlugin = function (element, options) {
        this._id = "CardPlugin";
        this._plugin_name = "CardPlugin";
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
    
    PluginCardLabelPlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            var card = DomUtils.newelement(this._element, "div");
            card.className = "card";
            if (this._settings.logo == "")
                this.createCardImage(card, "static/img/plugin_logo_100x100.png", 100, 100, "插件");
            else
                this.createCardImage(card, this._settings.logo, 100, 100, "插件");

            var cardBody1 = this.createCardBodyContainer(card);
            this.createCardBodyHead(cardBody1, this._settings.name, "h5");
            this.createCardBodyLabel(cardBody1, this._settings.pluginVersion);
            this.createCardBodyLabel(cardBody1, " | ");
            this.createCardBodyLabel(cardBody1, this._settings.developer);
            this.createCardBodyParagraph(cardBody1, this._settings.pluginDescription)
            var p = this.createCardBodyParagraph(cardBody1, "");
            this.createCardBodyLabel(p, this._settings.lastupdate);
            
            var cardBody2 = this.createCardBodyContainer(card);
            var linkA = this.createCardLink(cardBody2, "#", "预览", "");
            this.editIcon = this.createCardLinkIcon(linkA, "bi bi-globe");
            this.editIcon.addEventListener('click', this, false);

            var linkA1 = this.createCardLink(cardBody2, "#", "编辑", "");
            this.editIcon1 = this.createCardLinkIcon(linkA1, "bi bi-pencil-square");
            this.editIcon1.addEventListener('click', this, false);
            var linkA2 = this.createCardLink(cardBody2, "#", "修改代码", "");
            this.editIcon5 = this.createCardLinkIcon(linkA2, "bi bi-file-code");
            this.editIcon5.addEventListener('click', this, false);
            var linkA3 = this.createCardLink(cardBody2, "#", "删除", "");
            this.editIcon3 = this.createCardLinkIcon(linkA3, "bi bi-trash");
            this.editIcon3.addEventListener('click', this, false);
            var linkA4 = this.createCardLink(cardBody2, "#", "引用量", "");
            linkA4.classList.add("text-decoration-none");
            this.editIcon4 = this.createCardLinkIcon(linkA4, "bi bi-cloud-download");
            this.editIcon4.addEventListener('click', this, false);
            // linkA4.appendChild(document.createTextNode(" "+this._settings.useCounting));
            // this._settings.likeCounting
            var fivestar = this.createCardLink(cardBody2, "#", "评价", "");
            this.createFiveStars(fivestar, 0,0,5);

        },
        createCardImage(parent, src, width, height, alt) {
            var cardImgDiv = DomUtils.newelement(parent, "div");
            cardImgDiv.className = "d-flex justify-content-center";
            var cardImg = DomUtils.newelement(cardImgDiv, "img");
            cardImg.src = src;
            cardImg.style.width = width+"px";
            cardImg.style.height = height+"px";
            cardImg.alt = alt;
            return cardImgDiv;
        },
        createCardBodyContainer(parent) {
            var cardBody = DomUtils.newelement(parent, "div");
            cardBody.className = "card-body";
            return cardBody;
        },
        createCardBodyHead(parent, title, head) {
            var cardBodyHead = DomUtils.newelement(parent, head);
            cardBodyHead.className = "card-title";
            cardBodyHead.innerHTML = title;
            return cardBodyHead;
        },
        createCardBodyLabel(parent, label) {
            var cardBodyLabel = DomUtils.newelement(parent, "small");
            cardBodyLabel.className = "text-muted";
            cardBodyLabel.innerHTML = label;
            return cardBodyLabel
        },
        createCardBodyParagraph(parent, content) {
            var paragraph = DomUtils.newelement(parent, "p");
            paragraph.className = "card-text";
            if (content != "") {
                paragraph.innerHTML = content;
            }
            return paragraph;
        },
        createCardLink(parent, url, title, content) {
            var a = DomUtils.newelement(parent, "a");
            a.href = url;
            a.className = "card-link";
            a.title = title;
            if (content != "")
                a.innerHTML = content;
            return a;
        },
        createCardLinkIcon(parent, icon) {
            var i = DomUtils.newelement(parent, "i");
            i.className = icon;
            return i; 
        },
        createFiveStars(parent, a, b, c) {
            if (a>0) {
                for (var i=0;i<a;i++) {
                    var cardBodyAi5 = DomUtils.newelement(parent, "i");
                    cardBodyAi5.className = "bi bi-star-fill";
                    cardBodyAi5.style.color = "red";
                }
            }
            if (b>0) {
                var cardBodyAi53 = DomUtils.newelement(parent, "i");
                cardBodyAi53.className = "bi bi-star-half";
                cardBodyAi53.style.color = "red";
            }
            if (c>0) {
                for (var i=0;i<c;i++) {
                    var cardBodyAi54 = DomUtils.newelement(parent, "i");
                    cardBodyAi54.className = "bi bi-star";
                    cardBodyAi54.style.color = "red";
                }
            }
        },
        createButtons : function(parent, name, text) {
            this.okButton = DomUtils.newelement(parent, "button");
            this.okButton.type = "button";
            this.okButton.name = name;
            this.okButton.className = "btn btn-primary";
            this.okButton.innerHTML = text;
            this.okButton.addEventListener('click', this, false);
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
            var that = this;
            if (target == this.editIcon1) { // 编辑插件
                DomUtils.dynamicLoadScript("static/js/common/resizable_modal_dialog_plugin.js", function(){
                    that.newPluginDialog = new ResizableModalDialogPlugin(that._element, {
                        currId: that._settings.currId,
                        title : "编辑插件",
                        icon : "bi bi-plug",
                        size : "large",
                        cancelButtonText : "取消",
                        pluginPathList : ["static/js/plugins/PluginDetailEditPlugin.js"],
                    });
                    that.newPluginDialog.setParent(that);
                    that.newPluginDialog.createHandleButtons("createPlugin", "保存");
                    that.newPluginDialog.setEntity(new Object());
                    that.newPluginDialog.show();
                });
            } else if (target == this.editIcon3) { // 删除插件
                DomUtils.dynamicLoadScript("static/js/common/confirm_dialog_plugin.js", function(){
                    that.removePluginDialog = new ConfirmModalDialogPlugin(that._element, {
                        title : "删除插件",
                        icon : "bi bi-info-circle-fill",
                    });
                    that.removePluginDialog.setParent(that);
                    that.removePluginDialog.show("删除该插件将不可恢复，确认删除该插件吗？");
                });
            } else if (target == this.editIcon4) { // 下载插件
                var downplugin = new DownloadAction(service.api(0, 6));
                downplugin.downloadFile("", "", this._settings.currId);
            } else if (target == this.editIcon5) { // 编辑插件代码
                window.open("/master/pluginEditor?id="+this._settings.currId, "_blank");
            } else if (target == this.okButton) { // 保存
                var o = this.newPluginDialog.fetchEntity();
                $.ajax({
                    url: service.api(0, 3),
                    data: {
                        id: this._settings.currId,
                        pluginName: o.pluginName,
                        developer: o.developer,
                        version: o.version,
                        copyright: o.copyright,
                        description: o.description,
                        keywords: o.keywords,
                        logo: o.logo,
                        defaultOptions: o.defaultOptions,
                        pricing: o.pricing,
                        banned: o.banned,
                    },
                    type: 'POST',
                    dataType: 'JSON',
                    complete: function (data) {
                        data = data.responseJSON;
                        that.newPluginDialog.hide();
                        window.location.reload();
                    },
                });
            } else if (target == this.editIcon) { // 预览
                window.open("/plugins."+this._settings.currId, "_blank");
            }
        },
        doYesAction : function(e) {
            $.ajax({
                url: service.api(0, 4),
                data: {
                    id: this._settings.currId,
                },
                type: 'POST',
                dataType: 'JSON',
                complete: function (data) {
                    data = data.responseJSON;
                    window.location.reload();
                },
            });
        },
        hasGranted : function(g) {
            if (this._settings.grant != undefined && 
                typeof this._settings.grant === 'string') {
                var ary = this._settings.grant.split("|");
                for (var i=0; i<ary.length; i++) {
                    if (ary[i] == g) {
                        return true;
                    }
                }
            }
            return false;
        },
    };
    
    _global = (function(){return this || (0, eval)('this');}());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = PluginCardLabelPlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return PluginCardLabelPlugin; });
    } else {
        !("PluginCardLabelPlugin" in _global) && (_global.PluginCardLabelPlugin = PluginCardLabelPlugin);
    }
})();