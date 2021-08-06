/**
 * 
 * Designer: Dahai Cao designed version 8 in Beijing at 13：41 on 2021-05-14
 */
 ;(function (undefined) {
    "use strict"
    
    var _global;
    
    var defaults = {
    };
    
    var MasterIndexPlugin = function (element, options) {
        this._id = "MainPlugin";
        this._plugin_name = "MainPlugin";
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
    
    MasterIndexPlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            // 用新接口
            var content = DomUtils.newelement(this._element, "div");
            content.className = "col-lg-8 mx-auto p-3 py-md-5";
            var header = DomUtils.newelement(content, "header");
            header.className = "d-flex align-items-center pb-3 mb-4 border-bottom";
            var a = DomUtils.newelement(header, "a");
            a.href = "/";
            a.className = "d-flex align-items-center text-dark text-decoration-none";
            var img = DomUtils.newelement(a, "img");
            img.src = "static/img/logo_32x32.png";
            img.style.height = "32px";
            img.style.width = "32px";
            var title = DomUtils.newelement(a, "title");
            title.innerHTML = "Micro service plugin framework";
            var span = DomUtils.newelement(a, "span");
            span.className = "fs-4";
            span.innerHTML = "Micro service plugin framework (Mspf) 0.1.0";

            var main = DomUtils.newelement(content, "main");
            var h1 = DomUtils.newelement(main, "h1");
            h1.innerHTML = "使用Mspf快速构建基于Python的微服务";

            var p = DomUtils.newelement(main, "p");
            p.className = "fs-5 col";
            p.innerHTML = "Mspf是一个基于Django的支持快速开发Python微服务插件的框架。Python微服务插件前端是html，后端是RESTful接口，让你能够快速搭建自己的Python应用.";
            var p1 = DomUtils.newelement(main, "p");
            p1.className = "fs-5 col";
            var small = DomUtils.newelement(p1, "small");
            small.className = "text-muted";
            small.innerHTML = "当前版本：0.1.0";
            
            var buttonsdiv = DomUtils.newelement(main, "div");
            buttonsdiv.className = "d-flex align-items-stretch mb-4";

            var btn1 = DomUtils.newelement(buttonsdiv, "a");
            btn1.src = "docs/";
            btn1.className = "btn btn-light btn-lg p-4 me-2 bi bi-signpost-split fw-bolder";
            btn1.innerHTML = " 快速入门";

            var btn2 = DomUtils.newelement(buttonsdiv, "a");
            btn2.src = "docs/PaaSPluginFwk.zip";
            btn2.className = "btn btn-primary btn-lg p-4 me-2 bi bi-cloud-download fw-bolder";
            btn2.innerHTML = " 下载 Mspf";

            this.tryitbtn = DomUtils.newelement(buttonsdiv, "button");
            this.tryitbtn.className = "btn btn-success btn-lg px-4 me-2 bi bi-cloud-plus fw-bolder";
            this.tryitbtn.type = "button";
            this.tryitbtn.innerHTML = " 创建微服务插件";
            this.tryitbtn.addEventListener("click", this, false);

            var that = this;
            DomUtils.dynamicLoadScript(cpath + "upload_file_plugin.js", function(){
                var pp = $(buttonsdiv).fmUploadFilesPlugin({
                    id : "upload0167A", // plugin id
                    url : service.api(0, 5),
                    extpara : "", // extra parameters for uploading
                    actnow : "1", // if 1, dochange method will work
                    filter : "application/zip,application/x-zip,application/x-zip-compressed", 
                    multiple : "1", // if 1, input will can select multiple files
                    parent : that, // parent plugin
                    ownerId : "",
                    width: "300px",
                    height : 80,
                });
                that.upld = pp.data("fmUploadFilesPlugin");
            });

            var row1 = DomUtils.newelement(main, "div");
            row1.className = "row d-flex justify-content-center";
            var col8 = DomUtils.newelement(row1, "div");
            col8.className = "col-12";
            var form = DomUtils.newelement(col8, "div");
            form.className = "input-group";
            var searchInput = DomUtils.newelement(form, "input");
            searchInput.className = "form-control";
            searchInput.type = "search";
            searchInput.placeholder = "搜索感兴趣的插件";
            searchInput.setAttribute("aria-label", "Search");
            var searchButton = DomUtils.newelement(form, "button");
            searchButton.className = "btn btn-primary bi bi-search";
            searchButton.type = "button";

            var cardRow = DomUtils.newelement(main, "div");
            cardRow.className = "row row-cols-1 row-cols-md-4 g-4 mt-3";
            this.loadAllPlugins(cardRow);

            var footer = DomUtils.newelement(main, "footer");
            footer.className = "pt-5 my-5 text-muted border-top";
            footer.innerHTML = "Designed and developed by the Dahai Cao &middot; &copy; 2021";

        },
        loadAllPlugins: function(cardRow) {
            var that = this;
            $.ajax({
                url: service.api(0, 1),
                data: {
                },
                type: 'GET',
                dataType: 'JSON',
                complete: function (data) {
                    data = data.responseJSON;
                    DomUtils.dynamicLoadScript(jspath + "PluginCardLabelPlugin.js", function(){
                        for (var i=0;i<data.length;i++) {
                            var cardCol = DomUtils.newelement(cardRow, "div");
                            cardCol.className = "col";
                            new PluginCardLabelPlugin(cardCol, {
                                currId: data[i].id,
                                name: data[i].name,
                                logo: data[i].logo,
                                pluginVersion: data[i].pluginVersion,
                                developer: data[i].developer,
                                pluginDescription: data[i].pluginDescription,
                                useCounting: data[i].useCounting,
                                likeCounting: data[i].likeCounting,
                                keywords: data[i].keywords,
                                defaultOptions: data[i].defaultOptions,
                                isFree: data[i].isFree,
                                pricing: data[i].pricing,
                                banned: data[i].banned,
                                createDatetime: Utils.formatDateTime(data[i].createDatetime),
                                lastupdate: Utils.formatDateTime(data[i].lastupdate),
                                license: data[i].license,
                            });
                        }
                    });
                },
            });
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
            var item = e.target;
            var that = this;
            if (item == this.tryitbtn) {
                DomUtils.dynamicLoadScript(cpath + "resizable_modal_dialog_plugin.js", function(){
                    that.newPluginDialog = new ResizableModalDialogPlugin(that._element, {
                        currId: 0,
                        ownerId: that._settings.ownerId,
                        title : "创建新插件",
                        icon : "bi bi-plug",
                        size : "large",
                        cancelButtonText : "取消",
                        pluginPathList : [jspath + "PluginDetailEditPlugin.js"],
                    });
                    that.newPluginDialog.setParent(that);
                    that.newPluginDialog.createHandleButtons("createPlugin", "添加");
                    that.newPluginDialog.setEntity(new Object());
                    that.newPluginDialog.show();
                });
            } else if (item == this.okButton) {
                var o = this.newPluginDialog.fetchEntity();
                $.ajax({
                    url: service.api(0, 0),
                    data: {
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
                    complete: function (data) {
                        data = data.responseJSON;
                        that.newPluginDialog.hide();
                        window.location.reload();
                    },
                    dataType: 'JSON',
                });
            }
        },
        complete : function(f, loaded, total, data, parent) {
            window.location.reload();
        },

    };
    
    _global = (function(){return this || (0, eval)('this');}());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = MasterIndexPlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return MasterIndexPlugin; });
    } else {
        !("MasterIndexPlugin" in _global) && (_global.MasterIndexPlugin = MasterIndexPlugin);
    }
})();