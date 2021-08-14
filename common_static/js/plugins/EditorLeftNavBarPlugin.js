/**
 * this is left side navbar plugin.
 * Designer: Dahai Cao designed in Beijing at 2021-02-21 10:40
 */
;(function (undefined) {
    "use strict"

    var _global;

    var defaults = {
        userId: "", // user Id
        userName: "",// user full name
        ownerId: "", // owner Id, such as organization Id
        ownerName: "", // owner name, such as organization Id
        sessionId: "", // session Id
        theme: "light", // "dark" theme, "light" theme, "dark-light" theme, by default.
        hasLogo: false, // true: has logo; false: no;
        logoImg: "", // logo image name;
        logoImgUrl: "", // logo image url;
        ownerUrl: "#", // organization official website URL;
        expendAllNodes: false,
        uploadUrl: "",
        downloadUrl: "",
        removeFileFolderUrl: "",
        sidebarUrl: "",
        sidebarParam: "",
        currId: "",
        menuItems: [],
    };

    var EditorLeftNavBarPlugin = function (element, options) {
        this.id = "SP_00000000000004ME";
        this._plugin_name = "左侧菜单条插件";
        this._author = "cdh";
        this._datetime = "";
        this._pluginType = "";
        this._keywords = "";
        this._description = "这个左侧菜单插件是专门针对文件管理树而开发的一个插件，"+
                            "能够以树形结构形式展示一个目录下的所有的目录和文件。";
        this._version = "1.0 based on plugin template 7.0";
        this._copyright = "";
        // default settings for options
        this._settings = extend({}, defaults, options);
        this._element = element;
        this.selectedNode = "";
        // default settings for options
        if (typeof options === 'object' || options !== null)
            this._settings = extend(true, {}, defaults, options);

        this.frontCSS = "navbar-light";
        this.bgCSS = "bg-light";
        if (typeof this._settings.theme === "string") {
            if (this._settings.theme == "dark") {
                this.frontCSS = "navbar-dark";
                this.bgCSS = "left-nav-bg-dark";
            } else if (this._settings.theme == "light") {
                this.frontCSS = "navbar-light";
                this.bgCSS = "left-nav-bg-light";
            } else if (this._settings.theme == "dark-light") {
                this.frontCSS = "navbar-dark";
                this.bgCSS = "left-nav-bg-dark";
            }
        }
        this.imgsrc = "";
        if (typeof this._settings.logoImgUrl === "string" && this._settings.logoImgUrl != "") {
            this.imgsrc = this._settings.logoImgUrl;
        } else if (typeof this._settings.logoImg === "string" && this._settings.logoImg != "") {
            this.imgsrc = this._settings.logoImg; // local image;
        }
        if (typeof this._settings.menuItems === 'object' &&
            Object.prototype.toString.call(this._settings.menuItems) === '[object Array]') {
            this.menuItems = this._settings.menuItems;
        } else {
            this.menuItems = [];
        }
        this.init();
    };

    EditorLeftNavBarPlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            var nav = DomUtils.newelement(this._element, "nav");
            nav.className = "navbar-nav-left";
            nav.id = "left-navbar" + this.id;
            nav.classList.add(this.frontCSS);
            nav.classList.add(this.bgCSS);
            // create brand logo.
            this.crateBrand(nav);
            // create toolbar for managing tree
            var toolbar = DomUtils.newelement(nav, "div");
            toolbar.className = "btn-group btn-group-sm m-1";
            toolbar.setAttribute("role", "group");

            var addButtonUl = DomUtils.createButtonGroup(toolbar, "btn-primary", 
                "bi bi-plus", " 新建", true);
            this.liItem1 = DomUtils.createDropdownItem(addButtonUl, "bi bi-folder-plus", "#", " 新建目录");
            this.liItem1.addEventListener("click", this, false);
            this.liItem2 = DomUtils.createDropdownItem(addButtonUl, "bi bi-file-earmark-plus", "#", " 新建文件");
            this.liItem2.addEventListener("click", this, false);

            this.refreshButton = DomUtils.createButton(toolbar,
                "btn-success", "bi bi-arrow-clockwise", " 刷新", "刷新所有的文件或目录");
            this.refreshButton.addEventListener("click", this, false);

            this.copyButton = DomUtils.createButton(toolbar,
                "btn-primary", "bi bi-clipboard", " 拷贝", "拷贝一个文件或目录到另一个目录");
            this.copyButton.addEventListener("click", this, false);

            this.moveButton = DomUtils.createButton(toolbar,
                "btn-primary", "bi bi-box-arrow-in-up-right", " 移动", "移动文件或目录到另一个目录");
            this.moveButton.addEventListener("click", this, false);

            this.renameButton = DomUtils.createButton(toolbar,
                "btn-primary", " bi bi-pencil-square", " 重命名", "重新命名文件或目录");
            this.renameButton.addEventListener("click", this, false);

            // create toolbar for searching ...
            var toolbar1 = DomUtils.newelement(nav, "div");
            toolbar1.className = "row p-1";
            var toolbarCol = DomUtils.newelement(toolbar1, "div");
            toolbarCol.className = "col";
            var inputGroup = DomUtils.newelement(toolbarCol, "div");
            inputGroup.className = "input-group input-group-sm";
            var inputGroupText = DomUtils.newelement(inputGroup, "span");
            inputGroupText.className = "input-group-text bi bi-search";
            inputGroupText.innerHTML = "";
            var inputsearch = DomUtils.newelement(inputGroup, "input");
            inputsearch.type = "text";
            inputsearch.className = "form-control";
            inputsearch.setAttribute("placeholder", "搜索文件...");
            inputsearch.setAttribute("aria-label", "搜索文件");
            inputsearch.setAttribute("aria-describedby", "");

            // create toolbar for upload
            var toolbar2 = DomUtils.newelement(nav, "div");
            toolbar2.className = "row p-1";
            var toolbarCol2 = DomUtils.newelement(toolbar2, "div");
            toolbarCol2.className = "col";

            var that = this;
            DomUtils.dynamicLoadScript(cjspath + "upload_file_plugin.js", function(){
                var pp = $(toolbarCol2).fmUploadFilesPlugin({
                    id : "upload0168A", // plugin id
                    url : that._settings.uploadUrl,
                    extpara : "", // extra parameters for uploading
                    actnow : "1", // if 1, dochange method will work
                    filter : "*", 
                    multiple : "1", // if 1, input will can select multiple files
                    parent : that, // parent plugin
                    ownerId : "",
                    width: "",
                    height : 80,
                });
                that.uploadPlugin = pp.data("fmUploadFilesPlugin");
            });

            var treeView = DomUtils.newelement(nav, "div");
            treeView.className = "side-nav-left";

            // menu construction starting...
            this.ul = DomUtils.newelement(treeView, "ul");
            this.ul.className = "list-unstyled nav-left";
            this.ul.id = "";
            var overlay = DomUtils.newelement(this._element, "div");
            overlay.className = "left-navbar-nav-overlay";

            $(".side-nav-left").mCustomScrollbar({
                theme: "minimal"
            });
            $('.navbar-nav-left').hover(function () { // mouseenter
            }, function () { // mouseout
                $('.navbar-nav-left').removeClass('active');
                $('.left-navbar-nav-overlay').removeClass('active');
            });
            $('.navbar-nav-left-toggler').click(function () {
                if (!$('.navbar-nav-left').hasClass('active')) {
                    $('.navbar-nav-left').addClass('active');
                    $('.left-navbar-nav-overlay').addClass('active');
                } else {
                    $('.navbar-nav-left').removeClass('active');
                    $('.left-navbar-nav-overlay').removeClass('active');
                }
            });
            $('.left-navbar-nav-overlay').on('click', function () {
                $('.navbar-nav-left').removeClass('active');
                $('.left-navbar-nav-overlay').removeClass('active');
            });
            if (this._settings.expendAllNodes)
                this.expendAllNodes(this.menuItems);
            this.assemblyTreeNodes(this.menuItems);
            this.createMenu(this.menuItems);
        },
        refresh: function() {
            if (this._settings.sidebarUrl != "") {
                var that = this;
                $.ajax({
                    url: this._settings.sidebarUrl,
                    data: {
                        pluginId : this._settings.currId,
                    },
                    type:'POST',
                    dataType:'JSON',
                    complete:function(data) {
                        that.menuItems = data.responseJSON;
                        if (that._settings.expendAllNodes)
                            that.expendAllNodes(that.menuItems);
                        DomUtils.removeChildren(that.ul);
                        that.assemblyTreeNodes(that.menuItems);
                        that.createMenu(that.menuItems);
                    },
                });
            } else {
                DomUtils.removeChildren(this.ul);
                this.createMenu(this.menuItems);
            }
        },
        assemblyTreeNodes : function(menuItems) {
            var map = {}
            for (var i = 0; i < menuItems.length; i++) {
                var o = menuItems[i];
                map[o.id] = o
            }
            for (var i = 0; i < menuItems.length; i++) {
                var o = menuItems[i];
                if (map[o.parent] != null)
                    map[o.parent].children.push(o)
            }
            var items = [];
            items.push(this.menuItems[0]);
            this.menuItems = items;
            this.selectedNode = items[0];
        },
        expendAllNodes : function(menuItems) {
            for (var i = 0; i < menuItems.length; i++) {
                menuItems[i].expended = 1;
            }
        },
        addMenuItem: function(parent, item) {
            var f = false;
            for (var i = 0; i < parent.children.length; i++) {
                if (parent.children[i].id == item.id) {
                    f = true;
                    break;
                }
            }
            if (!f) {
                item.parent = parent.id;
                parent.children.push(item);
            }
        },
        moveItem: function(currId, oldPid, newPid) {
            var node = this.seek(currId);
            var newparent = this.seek(newPid);
            var oldparent = this.seek(oldPid);
            this.removeMenuItem(oldparent, node);
            this.addMenuItem(newparent, node);
            this.refresh();
        },
        removeMenuItem: function(parent, item) {
            for (var i = 0; i < parent.children.length; i++) {
                if (parent.children[i].id == item.id) {
                    //item.parent = null;
                    parent.children.splice(i, 1);
                    break;
                }
            }
        },
        removeMenuItemById: function(parent, id) {
            for (var i = 0; i < parent.children.length; i++) {
                if (parent.children[i].id == id) {
                    parent.children.splice(i, 1);
                    break;
                }
            }
        },
        seek: function(id) {
            var f = null;
            for (var i = 0; i < this.menuItems.length; i++) {
                f = this.seekById(this.menuItems[i], id);
                if (f)
                    return f;
            }
        },
        seekById : function(node, id) {
            if (node.id == id) {
                return node;
            } else {
                var n;
                if (node.children.length > 0) {
                    var nodes = node.children;
                    for (var i=0; i < nodes.length; i++) {
                        n = this.seekById(nodes[i], id);
                        if (n != null)
                            break;
                    }
                }
                return n;
            }
        },
        createMenu: function(items) {
            if (typeof items === 'object' &&
                Object.prototype.toString.call(items) === '[object Array]') {
                // 先找到森林中的每个根节点
                this.menuItems = items;
                for (var i = 0; i < items.length; i++) {
                    this.createMenuItems(this.ul, items[i]);
                }
            }
        },
        createMenuItems : function (parElement, item) {
            if (item.children.length > 0) {
                var submenu = this.createMenuItemWithSubmenu(parElement, item);
                for (var i=0;i<item.children.length;i++) {
                     this.createMenuItems(submenu, item.children[i]);
                }
            } else {
                this.createMenuItem(parElement, item);
            }
        },
        createMenuItemWithSubmenu: function(parent, item) {
            // create container including menu item and its submenu.
            var li = DomUtils.newelement(parent, "li");
            li.className = "submenu";
            if (item.expended == 1)
                li.classList.add("active")
            // create menu item
            var liA = DomUtils.newelement(li, "a");
            liA.href = "#SUBMENU_" + item.id;
            liA.title = item.description;
            liA.id = item.id;
            liA.setAttribute("data-bs-toggle", "collapse");
            if (item.expended == 1) {
                liA.setAttribute("aria-expanded", "true");
                liA.classList.remove("collapsed");
            } else {
                liA.setAttribute("aria-expanded", "false");
                liA.classList.add("collapsed");
            }
            var that = this;
            liA.addEventListener("click", function (e) {
                that.selectedNode = item;
                that.uploadPlugin.setTargetPath(item.context);
                if (this.parentElement.classList.contains("active")) {
                    this.parentElement.classList.remove("active");
                } else {
                    this.parentElement.classList.add("active");
                }
            }, false);
            var liAI = DomUtils.newelement(liA, "i");
            liAI.className = item.icon;
            liAI.setAttribute("aria-hidden", "true");
            var liASpan = DomUtils.newelement(liA, "span");
            liASpan.className = "menu-text";
            liASpan.appendChild(document.createTextNode(item.name));
            liASpan.setAttribute("target-id", item.targetId);
            liASpan.setAttribute("grants", item.grantOperations);
            liASpan.setAttribute("type", item.context);
            liASpan.addEventListener("click", function (e) {
                that.openEidtor(this, item);
            }, false);
            this.createMenuItemTools(liA, item);
            // create submenu
            var ul = this.createSubmenu(li, item);
            return ul;
        },
        createSubmenu: function(parent, item) {
            var ul = DomUtils.newelement(parent, "ul");
            ul.className = "collapse list-unstyled";
            if (item.expended == 1) {
                ul.classList.add("show");
            }
            ul.id = "SUBMENU_" + item.id;
            ul.setAttribute("sid", item.id);
            return ul;
        },
        createMenuItemTools: function(parent, item) {
            // if (item.badgeNum > 0) {
            //     var liASpanB = DomUtils.newelement(liA, "span");
            //     liASpanB.className = "badge rounded-pill " + item.badgeClass;
            //     liASpanB.appendChild(document.createTextNode(""+item.badgeNum));
            // }
            if (item.id != this._settings.currId) {
                var liASpanC = DomUtils.newelement(parent, "span");
                liASpanC.className = "text-white fa fa-cloud-download me-1";
                liASpanC.setAttribute("title", "下载该文件或目录中文件");
                var that = this;
                liASpanC.addEventListener("click", function (e) {
                    var downplugin = new DownloadAction(that._settings.downloadUrl);
                    downplugin.downloadFile(that._settings.currId, item.context.replace("\\", "/"),item.name);
                }, false);
                var liASpanB = DomUtils.newelement(parent, "span");
                liASpanB.className = "text-danger fa fa-trash";
                liASpanB.setAttribute("title", "删除文件或目录");
                liASpanB.addEventListener("click", function (e) {
                    that.selectedNode = item;
                    DomUtils.dynamicLoadScript(cjspath + "confirm_dialog_plugin.js", function(){
                        that.removePluginDialog = new ConfirmModalDialogPlugin(that._element, {
                            title : "删除...",
                            icon : "bi bi-info-circle-fill",
                        });
                        that.removePluginDialog.setParent(that);
                        that.removePluginDialog.show("删除该文件或目录将不可恢复，确认删除吗？");
                    });
                }, false);
            }
        },
        createMenuItem: function(parent, item) {
            // create container including menu item.
            var li = DomUtils.newelement(parent, "li");
            // create menu item
            var liA = DomUtils.newelement(li, "a");
            liA.href = "#"+item.targetId;
            liA.title = item.description;
            liA.id = item.id;
            var that = this;
            liA.addEventListener("click", function (e) {
                that.selectedNode = item;
                that.uploadPlugin.setTargetPath(item.context);
            });
            var that = this;
            var liAI = DomUtils.newelement(liA, "i");
            liAI.className = item.icon;
            liAI.setAttribute("aria-hidden", "true");
            var liASpan = DomUtils.newelement(liA, "span");
            liASpan.className = "menu-text";
            liASpan.appendChild(document.createTextNode(item.name));
            liASpan.setAttribute("target-id", item.targetId);
            liASpan.setAttribute("grants", item.grantOperations);
            liASpan.setAttribute("type", item.menuItemType);
            liASpan.addEventListener("click", function (e) {
                that.openEidtor(this, item);
            }, false);
            this.createMenuItemTools(liA, item);
            return li;
        },
        openEidtor : function(p, item) {
            var tarid = item.targetId;
            var type = item.menuItemType;
            if (type == 1)
                return;
            // var extName = item.name.substr(item.name.lastIndexOf(".") + 1, item.name.length);
            tarid = jspath + "FileEditorPlugin.js";
            if (tarid != undefined && tarid != "") {
                if (map[item.id] == undefined) {
                    this.main.showPane(tarid, this._settings.ownerId,
                        item.id, item.name, item.icon, item.grantOperations, item.context);
                }

            }
        },
        crateBrand: function(parent) {
            if (this._settings.hasLogo && this._settings.ownerName != "") {
                // brand url
                var brandDiv = DomUtils.newelement(parent, "div");
                brandDiv.className = "row p-3";
                var brandA = DomUtils.newelement(brandDiv, "a");
                brandA.className = "navbar-brand";
                brandA.href = this._settings.ownerUrl;
                if (this._settings.hasLogo) {
                    if (this.imgsrc != "") {
                        var img = DomUtils.newelement(brandA, "img");
                        img.src = this.imgsrc;
                        img.style.height = "20px";
                        img.style.width = "20px";
                    } else {
                        var strong = DomUtils.newelement(brandA, "strong");
                        var i = DomUtils.newelement(strong, "i");
                        i.className = "bi bi-bank";
                        i.setAttribute("aria-hidden", "true");
                    }
                }
                if (this._settings.ownerName != "") {
                    var strong = DomUtils.newelement(brandA, "strong");
                    strong.appendChild(document.createTextNode(" " + this._settings.ownerName));
                }
            }
        },
        updateBadge: function(id, badgenum) {
            var spans = document.getElementsByTagName("span");
            for (var i=0;i<spans.length;i++) {
                if (spans[i].getAttribute("target-id") == id) {
                    spans[i].innerHTML = badgenum;
                    break;
                }
            }
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
            if (target == this.liItem1) {
                DomUtils.dynamicLoadScript(cjspath + "ResizableStaticModalDialogPlugin.js", function(){
                    that.newFolderDialog = new ResizableStaticModalDialogPlugin(that._element, {
                        currId: 0,
                        ownerId: that._settings.ownerId,
                        title : "新目录",
                        icon : "bi bi-folder-plus",
                        size : "normal",
                        caller: that,
                        entity: that.selectedNode,
                        pluginPathList : [jspath + "CreateFolderPlugin.js"],
                    });
                    that.newFolderDialog.show();
                });
                if (this.newFolderDialog != undefined) {
                    this.newFolderDialog.setEntity(this.selectedNode);
                }
            } else if (target == this.liItem2) {
                DomUtils.dynamicLoadScript(cjspath + "ResizableStaticModalDialogPlugin.js", function(){
                    that.newFileDialog = new ResizableStaticModalDialogPlugin(that._element, {
                        currId: 0,
                        ownerId: that._settings.ownerId,
                        title : "新文件",
                        icon : "bi bi-file-earmark-plus",
                        size : "normal",
                        caller: that,
                        entity: that.selectedNode,
                        pluginPathList : [jspath + "CreateFilePlugin.js"],
                    });
                    that.newFileDialog.show();
                });
                if (this.newFileDialog != undefined)
                    this.newFileDialog.setEntity(this.selectedNode);
            } else if (target == this.refreshButton) {
                this.refresh();
            } else if (target == this.copyButton) {
                DomUtils.dynamicLoadScript(cjspath + "ResizableStaticModalDialogPlugin.js", function(){
                    that.newFileDialog = new ResizableStaticModalDialogPlugin(that._element, {
                        currId: that._settings.currId,
                        ownerId: that._settings.ownerId,
                        title : "拷贝到...",
                        icon : "bi bi-pencil-square",
                        size : "normal",
                        caller: that,
                        operation: "copyto",
                        entity: that.selectedNode,
                        pluginPathList : [jspath + "CopyMoveToPlugin.js"],
                    });
                    that.newFileDialog.show();
                });
                if (this.newFileDialog != undefined)
                    this.newFileDialog.setEntity(this.selectedNode);
            } else if (target == this.moveButton) {
                DomUtils.dynamicLoadScript(cjspath + "ResizableStaticModalDialogPlugin.js", function(){
                    that.newFileDialog = new ResizableStaticModalDialogPlugin(that._element, {
                        currId: that._settings.currId,
                        ownerId: that._settings.ownerId,
                        title : "移动到...",
                        icon : "bi bi-pencil-square",
                        size : "normal",
                        caller: that,
                        operation: "moveto",
                        entity: that.selectedNode,
                        pluginPathList : [jspath + "CopyMoveToPlugin.js"],
                    });
                    that.newFileDialog.show();
                });
                if (this.newFileDialog != undefined)
                    this.newFileDialog.setEntity(this.selectedNode);
            } else if (target == this.renameButton) {
                DomUtils.dynamicLoadScript(cjspath + "ResizableStaticModalDialogPlugin.js", function(){
                    that.newFileDialog = new ResizableStaticModalDialogPlugin(that._element, {
                        currId: 0,
                        ownerId: that._settings.ownerId,
                        title : "重命名",
                        icon : "bi bi-pencil-square",
                        size : "normal",
                        caller: that,
                        entity: that.selectedNode,
                        pluginPathList : [jspath + "RenameFileFolderPlugin.js"],
                    });
                    that.newFileDialog.show();
                });
                if (this.newFileDialog != undefined)
                    this.newFileDialog.setEntity(this.selectedNode);
            }

        },
        doYesAction : function(e) {
            var that = this;
            $.ajax({
                url: this._settings.removeFileFolderUrl,
                data: {
                    context: this.selectedNode.context.replace("\\", "/"),
                },
                type:'POST',
                dataType:'JSON',
                complete:function(data) {
                    that.refresh();
                },
            });
        },
        complete : function(f, loaded, total, data, parent) {
            this.refresh();
        },
        setMainContentPane : function(main) {
            this.main = main;
        },
    };

    _global = (function(){return this || (0, eval)('this');}());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = EditorLeftNavBarPlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return EditorLeftNavBarPlugin; });
    } else {
        !("EditorLeftNavBarPlugin" in _global) && (_global.EditorLeftNavBarPlugin = EditorLeftNavBarPlugin);
    }
})();