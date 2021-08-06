/**
 * 
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
        height: "",
        pluginList: [], // property setting list
    };

	var TableViewerPlugin = function(element, options) {
        this._id = "TableViewerPlugin";
        this._plugin_name = "通用表格插件";
        this._author = "曹大海";
        this._datetime = "20210517";
        this._description = "一个通用的表格插件，是在上一代的插件基础上更新而来的。";
        this._version = "2.0 based on plugin template 7.0";
        // default settings for options
        this._settings = extend(true, {}, defaults, options);
        this._element = element;
        this.currPage; // 装载后的原始数据都存在这里
        this.objects = [];// 更新后的数据都存在这里，这是个缓存
        this.pagesize = 30;
        this.headersize = 0;
        this.selectIndex = -1;
        this.init();

	};

    TableViewerPlugin.prototype = {
        constructor: this || (0, eval)('this'),
		init: function() {
            this.id = this._settings.currId;

			var editorPanel = DomUtils.newelement(this._element, "div");
			var toolbarRow = DomUtils.newelement(editorPanel, "div");
            toolbarRow.className = "row mb-1";
			this.toolbarCol = DomUtils.newelement(toolbarRow, "div");
            this.toolbarCol.className = "btn-toolbar";
            this.toolbarCol.setAttribute("role", "toolbar");

			var tableRow = DomUtils.newelement(editorPanel, "div");
            tableRow.className = "row";
			var tableCol = DomUtils.newelement(tableRow, "div");
            tableCol.className = "col card p-0 mx-2 table-responsive";
			if (this._settings.height != "")
                tableCol.style.height = this._settings.height;
            tableCol.style.overflowY = "auto";
			this.tableList = DomUtils.newelement(tableCol, "table");
			this.tableList.className = "table table-sm table-striped table-hover";

		},
		setParent : function(parent) {
        	this.parent = parent;
        },
		refresh : function() {
            this.doNextPageAction(this.currPage.pageNo);
        },
        loading : function(pageno, condition, ownerID) {
            // if(typeof callback == "function")
            //     callback(parent, pageno, pagesize, condition, ownerID);
            // return this;
            if (this.parent.getData != undefined) {
                this.parent.getData(pageno, condition, ownerID);
            }
        },
        loadData : function(jsonobj) {
            $(this.tableList).children().remove();
            this.objects = [];
            this.currPage = new Page();
            var header = this.tableList.createTHead();
            this.addListHeader(header);
            var tbody = this.tableList.createTBody();
            if (jsonobj != null && jsonobj.pageEntities != null
                && jsonobj.pageEntities.length > 0) {
                this.currPage.parseFromJSON(jsonobj);
                var objs = this.currPage.pageEntities;
                if (objs != null && objs.length > 0) {
                    for (var i = 0; i < objs.length; i++) {
                        if (this.parent != null) {
                            this.parent.createRows(objs[i], i, tbody);
                        }
                    }
                    if (objs.length < this.pagesize) {
                        for (var i = objs.length; i < this.pagesize; i++) {
                            var row = tbody.insertRow(i);
                            for (var j = 0; j < this.headersize; j++) {
                                this.createCell(j, "&nbsp;", row);
                            }
                        }
                    }
                } else {
                    this.initList(tbody);
                }
            } else {
                this.initList(tbody);
            }
            this.pageno.innerHTML = "第" + this.currPage.pageNo + "页";
            this.totalpage.innerHTML = "/共" + this.currPage.allPagesCount + "页";
            if (this.currPage.allPagesCount <= 1) {
                this.disableButton(this.firstPageHButton);
                this.disableButton(this.previousPageHButton);
                this.disableButton(this.nextPageHButton);
                this.disableButton(this.lastPageHButton);
            } else if (this.currPage.allPagesCount > 1) {
                if (this.currPage.pageNo == 1) {
                    this.disableButton(this.firstPageHButton);
                    this.disableButton(this.previousPageHButton);
                    this.enableButton(this.nextPageHButton);
                    this.enableButton(this.lastPageHButton);
                } else if (this.currPage.pageNo == this.currPage.allPagesCount) {
                    this.enableButton(this.firstPageHButton);
                    this.enableButton(this.previousPageHButton);
                    this.disableButton(this.nextPageHButton);
                    this.disableButton(this.lastPageHButton);
                } else if (this.currPage.pageNo > 1
                    && this.currPage.pageNo < this.currPage.allPagesCount) {
                    this.enableButton(this.firstPageHButton);
                    this.enableButton(this.previousPageHButton);
                    this.enableButton(this.nextPageHButton);
                    this.enableButton(this.lastPageHButton);
                }
            }
            if (this.objects.length > 0) {
                var f = false;
                if (objs != null && objs.length > 0) {
                    for (var i = 0; i < objs.length; i++) {
                        if (objs[i] != null && objs[i].id == this.selectIndex) {
                            f = true;
                            break;
                        }
                    }
                }
                if (f) {
                    this.selectRow(this.selectIndex);
                } else {
                    this.selectIndex = -1;
                    this.selectRow(this.objects[0].id);
                }
            } else {
                this.selectIndex = -1;
                ///this.setPropertySheet(null);
            }
        },
        getObjectById : function(id) {
            var objs = this.objects;
            if (objs != null && objs.length > 0) {
                for (var i = 0; i < objs.length; i++) {
                    if (objs[i] != null && objs[i].id == id) {
                        return objs[i];
                    }
                }
            }
            return null;
        },
        getCurrentSelected : function() {
            var objs = this.objects;
            if (objs != null && objs.length > 0) {
                for (var i = 0; i < objs.length; i++) {
                    if (objs[i] != null && objs[i].id == this.selectIndex) {
                        return objs[i];
                    }
                }
            }
            return null;
        },
        initList : function(tbody) {
            for (var i = 0; i < this.pagesize; i++) {
                var row = tbody.insertRow(i);
                for (var j = 0; j < this.headersize; j++) {
                    var cell1 = row.insertCell(j);
                    cell1.innerHTML = "&nbsp;";
                }
            }
        },
        addListHeader : function(header) {
            var row = header.insertRow(0);
            if (this.parent != null)
                this.parent.createHeaders(row);
        },
        createHead : function(content, row) {
            var th = document.createElement('th');
            th.setAttribute("nowrap", "true");
            th.innerHTML = content;
            row.appendChild(th);
        },
        createCell : function(no, cellname, row) {
            var cell = row.insertCell(no);
            cell.setAttribute("nowrap", "true");
            if (cellname != null && cellname != "") {
                cell.innerHTML = cellname;
            }
            return cell;
        },
        createToolbar : function() {
            // pre
            if (this.parent.addPreExtraButtons != undefined) {
                this.parent.addPreExtraButtons(this.toolbarCol);
            }
            var g1 = this.createGroup(this.toolbarCol);
            this.refreshHButton = this.createTool(g1, "refreshS" + this.id,
                " 刷新", "btn btn-success btn-sm", "bi bi-arrow-clockwise");
            this.enableButton(this.refreshHButton);
            this.createNavigationGroup(this.toolbarCol);
            this.createSearchGroup(this.toolbarCol);
            // next
            if (this.parent.addRearExtraButtons != undefined) {
                this.parent.addRearExtraButtons(this.toolbarCol);
            }
        },
        createNavigationGroup : function(parent) {
            var g = this.createGroup(parent);
            this.firstPageHButton = this.createTool(g, "firstPageS" + this.id,
				" 首页", "btn btn-primary btn-sm", "bi bi-skip-start");
            this.previousPageHButton = this.createTool(g, "previousPageS" + this.id,
				" 前一页", "btn btn-primary btn-sm","bi bi-skip-backward");
            this.nextPageHButton = this.createTool(g, "nextPageS" + this.id,
				" 后一页", "btn btn-primary btn-sm", "bi bi-skip-forward");
            this.lastPageHButton = this.createTool(g, "lastPageS" + this.id,
				" 末页", "btn btn-primary btn-sm", "bi bi-skip-end");
            this.disableButton(this.firstPageHButton);
            this.disableButton(this.previousPageHButton);
            this.disableButton(this.nextPageHButton);
            this.disableButton(this.lastPageHButton);

            var g2 = this.createGroup(parent);
            this.pageno = this.createLabel(g2, "Sl1" + this.id, "");
            this.totalpage = this.createLabel(g2, "Sl2" + this.id, "");
        },
        createLabel : function(group, id, title) {
            var label = document.createElement("Label");
            group.appendChild(label);
            label.innerHTML = title;
            label.id = id;
            return label;
        },
        createSearchGroup : function(parent) {
            var group = document.createElement("DIV");
            parent.appendChild(group);
            group.className = "input-group input-group-sm me-2";

            this.search = document.createElement("input");
            group.appendChild(this.search);
            this.search.type = "text";
            this.search.className = "form-control"; //  form-control-sm
            this.search.setAttribute("placeholder", "搜索...");
            this.search.setAttribute("aria-label", "搜索...");
            this.search.setAttribute("aria-describedby", "searchS" + this.id);
            this.search.addEventListener('keydown', this, false);// 为回车键加监听事件
            this.searchBtn = this.createTool(group, "searchS" + this.id,
				" 查找", "btn btn-primary btn-sm", "bi bi-search");
        },
        createGroup : function(parent) {
            var group = document.createElement("DIV");
            parent.appendChild(group);
            group.className = "btn-group btn-group-sm me-2";
            group.setAttribute("role", "group");
            group.setAttribute("aria-label", "");
            return group;
        },
        createTool : function(group, id, title, style, fontclass) {
            var button = document.createElement("button");
            group.appendChild(button);
            button.className = style + " " + fontclass;
            button.setAttribute("title", title);
            button.type = "button";
            button.name = id;
            button.innerHTML = title;
            button.addEventListener('click', this, false);
            return button;
        },
        createExtraTool : function(group, id, title, style, fontclass) {
            var button = document.createElement("button");
            group.appendChild(button);
            button.className = style + " " + fontclass;
            button.setAttribute("title", title);
            button.type = "button";
            button.name = id;
            button.innerHTML = title;
            return button;
        },
        createIcon : function(parent, id, num, classname, name, title, style) {
            var button = document.createElement("BUTTON");
            parent.appendChild(button);
            button.id = name + id + num;
            button.className = "btn "+style+" rounded-circle " + classname;
            button.style.width = "24px";
            button.style.height = "24px";
            button.style.padding = "0px";
            button.title = title;
            button.name = name;
            var that = this;
            button.addEventListener("click", function(evt) {
                var key = this.parentElement.parentElement.getAttribute("key");
                var obj = that.getObjectById(key);
                if (that.parent != undefined) {
                    that.parent.handleIconEvent(evt, obj, name);
                }
                Utils.stopBubble(evt);
            });
            return button;
        },
        createHeaderByArray : function(row, headers) {
            if (headers != undefined &&
                headers != null &&
                typeof headers === 'object' &&
                Object.prototype.toString.call(headers) === '[object Array]') {
                for (var i= 0; i<headers.length; i++) {
                    this.createHead(headers[i], row);
                }
                this.headersize = headers.length;
            }
        },
        enableButton : function(button) {
            button.disabled = false;
        },
        disableButton : function(button) {
            button.disabled = true;
        },
        setPropertySheet : function(obj) {
            if (obj == null && this.objects != null && this.objects.length > 0) {
                obj = this.objects[0];
            }
            if (this.parent.settingPane != undefined) {
                this.parent.settingPane.setProperty(this, this._settings.pluginList, obj);
            }
        },
        handleEvent : function(e) {
            switch (e.type) {
                case "click":
                    this.doClick(e);
                    break;
                case "dblclick":
                    this.doDblClick(e);
                    break;
                case "keydown":
                    this.doKeydown(e);
                    break;
            }
            Utils.stopBubble(e);
        },
        doKeydown : function(evt) {
            var e = window.event ? window.event : (evt ? evt : arguments[0]);
            var key = e.keyCode || e.which;
            if (key == 13) {// 回车键
                evt.preventDefault();// 阻止该事件
                this.doNextPageAction(1);
                return false;
            }
        },
        doDblClick : function(evt) {
            if (evt.target.tagName == "TD") {
                this.tableList.focus();
            }
        },
        doClick : function(evt) {
            if (evt.target == this.firstPageHButton || (evt.target.name == ("firstPageS" + this.id))) {
                this.doNextPageAction(1);
            } else if (evt.target == this.previousPageHButton || (evt.target.name == ("previousPageS" + this.id))) {
                this.doNextPageAction(this.currPage.pageNo - 1);
            } else if (evt.target == this.nextPageHButton || (evt.target.name == ("nextPageS" + this.id))) {
                this.doNextPageAction(this.currPage.pageNo + 1);
            } else if (evt.target == this.lastPageHButton || (evt.target.name == ("lastPageS" + this.id))) {
                this.doNextPageAction(this.currPage.allPagesCount);
            } else if (evt.target == this.refreshHButton || (evt.target.name == ("refreshS" + this.id))) {
                this.doNextPageAction(this.currPage.pageNo);
            } else if (evt.target == this.searchBtn || (evt.target.name == ("searchS" + this.id))) {
                this.doNextPageAction(1);
            } else if (evt.target.tagName == "TD") {
                var table = evt.target.parentElement.parentElement;
                this.clearSelections(table);
                evt.target.parentElement.style.background = "#d1d1e0";
                var r = evt.target.parentElement;
                this.selectRow(r.getAttribute("key"));
            }
        },
        doNextPageAction : function(pageno) {
            this.loading(pageno, this.search.value, this._settings.ownerId);
        },
        selectRow : function(id) {
            if (this.tableList.rows.length > 1) {
                for (var i = 0; i < this.tableList.rows.length; i++) {
                    if (this.tableList.rows[i].getAttribute("key") == id) {
                        this.tableList.rows[i].style.background = "#d1d1e0";
                        this.selectIndex = id;
                        break;
                    }
                }
            }
            for (var i = 0; i < this.objects.length; i++) {
                if (this.objects[i].id == id) {
                    //this.setPropertySheet(this.objects[i]);
                    if (this.parent != undefined &&
                        this.parent.setSelection != undefined &&
                        typeof this.parent.setSelection === "function") {
                        this.parent.setSelection(this.objects[i]);
                    }
                    break;
                }
            }
        },
        clearSelections : function(table) {
            if (table.rows.length > 0) {
                for (var i = 0; i < table.rows.length; i++) {
                    table.rows[i].style.background = "";
                }
                this.selectIndex = -1;
            }
        },
	};

    _global = (function(){return this || (0, eval)('this');}());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = TableViewerPlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return TableViewerPlugin; });
    } else {
        !("TableViewerPlugin" in _global) && (_global.TableViewerPlugin = TableViewerPlugin);
    }
})();
