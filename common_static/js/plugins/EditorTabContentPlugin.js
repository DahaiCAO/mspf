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
        myParent: "", // parent plugin object
        settingPane : "",
    };

    var EditorTabContentPlugin = function (element, options) {
        this._id = "SP_00000000000004N0";
        this._plugin_name = "tabs-plugin";
        this._author = "cdh";
        this._datetime = "20210506";
        this._description = "该插件是一个页签插件，可以用于主界面也可以用于对话框的界面设计";
        this._version = "1.0";
        // default settings for options
        this._settings = extend({}, defaults, options);
        this._element = element;
        this._type = "tabs";
        this._currTabId;
        this.init();
    };

    EditorTabContentPlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            var content = DomUtils.newelement(this._element, "div");
            content.className = "content p-1";
            var contentFluid = DomUtils.newelement(content, "div");
            contentFluid.className = "container-fluid";
            var col = DomUtils.newelement(contentFluid, "div");
            col.className = "col-12 no-gutters";

            this.tabNav = DomUtils.newelement(col, "ul");
            this.tabNav.className = "nav nav-tabs mb-1";
            this.tabNav.setAttribute("role", "tablist");
            this.tabNav.id = "mainTabNav";

            this.tabContent = DomUtils.newelement(col, "div");
            this.tabContent.className = "tab-content";
            this.tabContent.id = "mainTabContent";

            this.dropdown = this.createDropdown(this.tabNav);
        },
        createDropdown: function(parent) {
            var div = DomUtils.newelement(parent, "div");
            div.className = "nav-item dropdown";

            var a = DomUtils.newelement(div, "a");
            a.className = "nav-link dropdown-toggle";
            a.href = "#";
            a.setAttribute("role", "button");
            a.setAttribute("data-bs-toggle", "dropdown");
            a.setAttribute("aria-expanded", "false");
            a.innerHTML = "...";

            var ul = DomUtils.newelement(div, "ul");
            ul.className = "dropdown-menu";

            var li = DomUtils.newelement(ul, "li");
            this.a0 = DomUtils.newelement(li, "a");
            this.a0.className = "dropdown-item";
            this.a0.href = "#";
            this.a0.innerHTML = "全部关闭";
            this.a0.addEventListener("click", this, false);

            var li1 = DomUtils.newelement(ul, "li");
            this.a1 = DomUtils.newelement(li1, "a");
            this.a1.className = "dropdown-item";
            this.a1.href = "#";
            this.a1.innerHTML = "关闭当前";
            this.a1.addEventListener("click", this, false);

            var li2 = DomUtils.newelement(ul, "li");
            this.a2 = DomUtils.newelement(li2, "a");
            this.a2.className = "dropdown-item";
            this.a2.href = "#";
            this.a2.innerHTML = "刷新";
            this.a2.addEventListener("click", this, false);

            // var li3 = DomUtils.newelement(ul, "li");
            // var hr = DomUtils.newelement(li3, "hr");
            // hr.className = "dropdown-divider";

            // var li4 = DomUtils.newelement(ul, "li");
            // li4.className = "dropdown-item";
            // li4.href = "#";
            // li4.innerHTML = "搜索";

            return div;
        },
        createTabHead: function(parent, id, icon, tabtext) {
            // create a tab header
            var li = DomUtils.newelement(parent, "li");
            DomUtils.insertElement(parent, li, this.dropdown);
            li.className = "nav-item d-flex flex-row";
            li.setAttribute("role", "presentation");

            var a = DomUtils.newelement(li, "a");
            a.className = "nav-link " + icon;
            a.id = id + "-tab";
            a.setAttribute("aria-obj-id", id);

            var label = DomUtils.newelement(a, "span");
            label.innerHTML = tabtext;
            label.className = "px-1";
            label.setAttribute("tab-id", id);
            var that = this;
            label.addEventListener('click', function (e) {
                var c = e.target // newly activated tab
                //var p = event.relatedTarget // previous active tab
                var ccid = this.getAttribute("tab-id");
                that._currTabId = ccid;
                that.selectTab(ccid);
            }, false);

            var closei = DomUtils.newelement(a, "i");
            closei.className = "fa fa-times text-danger";
            closei.setAttribute("aria-hidden", "true");
            closei.id = "cl_" + id;
            var that = this;
            closei.addEventListener("click", function (e) {
                var id = this.id;
                id = id.substr(3, id.length);
                that.closeTab(id);
            }, false);
            return li;
        },
        createTabContent: function(parent, pluginPath, grants, id, context, theme) {
            // create a tab content
            var tabPane = DomUtils.newelement(parent, "div");
            tabPane.className = "tab-pane fade";
            tabPane.id = "M" + id;
            tabPane.setAttribute("aria-obj-id", id);
            tabPane.setAttribute("role", "tabpanel");
            tabPane.setAttribute("aria-labelledby", id + "-tab");
            var that = this;
            DomUtils.dynamicLoadScript(pluginPath, function(){
                // get pluginName.js from pluginPath
                var pluginName = pluginPath.substr(pluginPath.lastIndexOf("/") + 1, pluginPath.length);
                // get plugin name from pluginName.js
                pluginName = pluginName.substr(0, pluginName.length - 3); // remove '.js' from pluginName.js
                var content = new (eval(pluginName))(tabPane, {
                    currId: id,
                    context: context,
                    ownerId: that._settings.ownerId,
                    height: "calc(100vh - 9rem)",
                    grant: grants,
                });
                if (content.setContainer != undefined &&
                    typeof content.setContainer === "function") {
                    content.setContainer(that);
                }
            });
            return tabPane;
        },
        closeAllTab : function() {
            var ul = this.tabNav;
            // remove tab header
            var child = ul.firstElementChild;
            while (child) {
                if (this.dropdown != ul.firstElementChild) {
                    ul.removeChild(child);
                    child = ul.firstElementChild;
                } else {
                    break;
                }
            }
            // remove tab content
            var cont = this.tabContent;
            while (cont.lastElementChild) {
                var cid = cont.lastElementChild.getAttribute("aria-obj-id");
                delete map[cid];
                cont.removeChild(cont.lastElementChild);
            }
        },
        closeCurrTab : function() {
            var ul = this.tabNav;
            var list = ul.children;
            var siblingId = "";
            // remove tab header
            var i;
            for(i = 0; i < list.length-1; i++) {
                if (list[i].children[0].id == this._currTabId + "-tab") {
                    ul.removeChild(list[i]);
                    break;
                }
            }
            // remove tab content
            var list1 = this.tabContent.children;
            for(var j = 0; j < list1.length; j++) {
                var id = list1[j].getAttribute("aria-obj-id");
                if (id == this._currTabId) {
                    cont.removeChild(list1[j]);
                    delete map[this._currTabId];
                    break;
                }
            }
            var list = ul.children;
            // selects the previous or next sibling tab before removing if exsiting two or more tabs
            if (list.length >= 2) {
                if (i == list.length - 1) {
                    siblingId = list[i - 1].children[0].getAttribute("aria-obj-id");
                } else {
                    siblingId = list[i].children[0].getAttribute("aria-obj-id");
                }
                this.selectTab(siblingId);
            }
        },
        refreshAllTabs : function() {
            // refresh all tab contents
            var cont = this.tabContent;
            var list1 = cont.children;
            for(var j = 0; j < list1.length; j++) {
                var cid = list1[j].getAttribute("aria-obj-id");
                if (map[cid].refresh != undefined &&
                    typeof map[cid].refresh === "function")
                    map[cid].refresh();
            }
        },
        closeTab : function(id) {
            var ul = this.tabNav;
            var list = ul.children;
            var siblingId = "";
            // remove tab header
            var i;
            for(i = 0; i < list.length; i++) {
                if (list[i].children[0].id == id + "-tab") {
                    var curr = list[i];
                    ul.removeChild(curr);
                    break;
                }
            }
            // remove tab content
            var list1 = this.tabContent.children;
            for(var j = 0; j < list1.length; j++) {
                var cid = list1[j].getAttribute("aria-obj-id");
                if (cid == id) {
                    this.tabContent.removeChild(list1[j]);
                    delete map[id];
                    break;
                }
            }
            var list = ul.children;
            // selects the previous or next sibling tab before removing if exsiting two or more tabs
            if (list.length >= 2) {
                if (i == list.length - 1) {
                    siblingId = list[i - 1].children[0].getAttribute("aria-obj-id");
                } else {
                    siblingId = list[i].children[0].getAttribute("aria-obj-id");
                }
                this.selectTab(siblingId);
            }
        },
        selectTab: function(id) {
            var list = this.tabNav.children;
            var list1 = this.tabContent.children;
            // remove active from tab headers
            for(var i = 0; i < list.length-1; i++) {
                list[i].children[0].classList.remove("active");
            }
            // remove active from tab contents
            for(var j = 0; j < list1.length; j++) {
                if (list1[j].classList.contains("active")) {
                    list1[j].classList.remove("active");
                    list1[j].classList.remove("show");
                }
            }
            // add  active to tab header
            // var head = document.getElementById(id + "-tab");
            // if (!head.classList.contains("active")) {
            //     head.classList.add("active");
            // }
            // var tab = document.getElementById("M" + id);
            // if (!tab.classList.contains("active")) {
            //     tab.classList.add("active");
            //     tab.classList.add("show");
            // }
            for(var i = 0; i < list.length-1; i++) {
                if (list[i].children[0].id == id + "-tab") {
                    if (!list[i].children[0].classList.contains("active")) {
                        list[i].children[0].classList.add("active");
                        //list[i].children[0].setAttribute("aria-selected", "true");
                        //console.log(list[i].children[0]);
                        break;
                    }
                }
            }
            // add  active to tab content
            for(var j = 0; j < list1.length; j++) {
                var cid = list1[j].getAttribute("aria-obj-id");
                if (cid == id) {
                    if (!list1[j].classList.contains("active")) {
                        list1[j].classList.add("active");
                        list1[j].classList.add("show");
                        //console.log(list1[j]);
                        break;
                    } 
                }
            }

        },
        updateTabHead : function(currId, name) {
            var header = document.getElementById(currId+"-tabhead");
            header.innerHTML = name;
        },
        show: function(editingPluginPath, ownerId, currId, name, icon, grants, context) {
            //item.id, item.name, item.icon, item.grantOperations
            this.createTabHead(this.tabNav, currId, icon, name);
            this.createTabContent(this.tabContent, editingPluginPath, grants, currId, context);
            this.selectTab(currId);
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
            if (item == this.a0) {
                e.preventDefault();
                this.closeAllTab();
            } else if (item == this.a1) {
                e.preventDefault();
                this.closeCurrTab();
            } else if (item == this.a2) {
                e.preventDefault();
                this.refreshAllTabs();
            }
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
        module.exports = EditorTabContentPlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return EditorTabContentPlugin; });
    } else {
        !("EditorTabContentPlugin" in _global) && (_global.EditorTabContentPlugin = EditorTabContentPlugin);
    }
})();