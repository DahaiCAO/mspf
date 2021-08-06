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
        tableName : "",
        height: "",
        pluginList: [], // property setting list
        hasBorder: false,
    };

    var SimpleTableViewerPlugin = function(element, options) {
        this._id = "SimpleTableViewerPlugin";
        this._plugin_name = "Simple table viewer";
        this._author = "cdh";
        this._datetime = "20210517";
        this._description = "一个简单的通用的表格插件，是在上一代的插件基础上更新而来的。";
        this._version = "2.0 based on plugin template 7.0";
        // default settings for options
        this._settings = extend(true, {}, defaults, options);
        this._element = element;
        this.currPage; // 装载后的原始数据都存在这里
        this.objects = [];// 更新后的数据都存在这里，这是个缓存
        this.headersize = 0;
        this.selectIndex = -1;
        this.init();

    };

    SimpleTableViewerPlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            this.id = this._settings.currId;
            var painterRow = DomUtils.newelement(this._element, "div");
            painterRow.className = "row";
            var painterCol = DomUtils.newelement(painterRow, "div");
            painterCol.className = "col p-0 mx-2 table-responsive";
            if (this._settings.hasBorder)
                painterCol.classList.add("card");
            if (this._settings.height != "")
                painterCol.style.height = this._settings.height;
            painterCol.style.overflowY = "auto";
            this.tableList = DomUtils.newelement(painterCol, "table");
            this.tableList.className = "table table-sm table-striped table-hover";

        },
        setParent : function(parent) {
            this.parent = parent;
        },
        refresh : function() {
            this.doNextPageAction();
        },
        loading : function(condition, ownerID) {
            // if(typeof callback == "function")
            //     callback(parent, pageno, pagesize, condition, ownerID);
            // return this;
            if (this.parent.getData != undefined) {
                this.parent.getData(condition, ownerID);
            }
        },
        loadData : function(jsonobj) {
            $(this.tableList).children().remove();
            this.objects = jsonobj;
            var header = this.tableList.createTHead();
            this.addListHeader(header);
            var tbody = this.tableList.createTBody();
            if (this.objects != null && this.objects.length > 0) {
                 for (var i = 0; i < this.objects.length; i++) {
                    if (this.parent != null) {
                        this.parent.createRow(this.objects[i], i, tbody);
                    }
                 }
            } else {
                 this.initList(tbody);
            }
            if (this.objects.length > 0) {
                var f = false;
                if (this.objects != null && this.objects.length > 0) {
                    for (var i = 0; i < this.objects.length; i++) {
                        if (this.objects[i] != null &&
                            this.objects[i].id == this.selectIndex) {
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
            var defaultRows = 30;
            if (this.objects != null && this.objects.length > 0)
                defaultRows = this.objects.length;
            for (var i = 0; i < defaultRows; i++) {
                var row = tbody.insertRow(i);
                for (var j = 0; j < this.headersize; j++) {
                    var cell1 = row.insertCell(j);
                    cell1.innerHTML = "&nbsp;";
                }
            }
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
        createHeaderByArrayWithSelectAll : function(row, headers, selectAllLabel) {
            if (headers != undefined &&
                headers != null &&
                typeof headers === 'object' &&
                Object.prototype.toString.call(headers) === '[object Array]') {
                this.createSelectAllHead(row, selectAllLabel);
                for (var i= 0; i<headers.length; i++) {
                    this.createHead(headers[i], row);
                }
                this.headersize = headers.length + 1;
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
        createSelectAllHead : function(row, labels) {
            var th = document.createElement('th');
            th.setAttribute("nowrap", "true");
            var formCheck = document.createElement("div");
            th.appendChild(formCheck);
            var input = document.createElement("input");
            formCheck.appendChild(input);
            input.className = "form-check-input";
            input.name = this._settings.tableName+"_all";
            input.type = "checkbox";
            input.value = "all";
            var that = this;
            input.addEventListener("click", function (evt) {
                var checkBoxes = document.getElementsByName(that._settings.tableName+"_CHECK");
                if (evt.target.checked){
                    for (var i=0;i<checkBoxes.length;i++) {
                        checkBoxes[i].checked = true;
                    }
                } else {
                    for (var i=0;i<checkBoxes.length;i++) {
                        checkBoxes[i].checked = false;
                    }
                }
                if (that.parent != undefined) {
                    that.parent.handleOtherSelectAllEvent(evt);
                }
            }, false);
            if (label!="") {
                var label = document.createElement("label");
                formCheck.appendChild(label);
                label.className = "form-check-label";
                label.innerHTML = labels;
            }
            input.type = "checkbox";
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
        createCellWithCheckbox : function(colNum, obj, checkboxValue, row) {
            var cell = row.insertCell(colNum);
            cell.setAttribute("nowrap", "true");
            var formCheck = document.createElement("div");
            cell.appendChild(formCheck);
            formCheck.className = "form-check form-check-inline";

            var input = document.createElement("input");
            formCheck.appendChild(input);
            input.className = "form-check-input";

            input.type = "checkbox";
            input.name = this._settings.tableName + "_CHECK";
            input.id = "CHECK_" + obj.id;
            input.value = checkboxValue;
            var that = this;
            input.addEventListener("click", function (ev) {
                // handle other check event
                if (that.parent != undefined) {
                    that.parent.handleOtherCheckboxEvent(ev, obj);
                }
            }, false);
            if (obj.name!="") {
                var label = document.createElement("label");
                formCheck.appendChild(label);
                label.className = "form-check-label";
                label.innerHTML = obj.name;
            }
            return input;
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
                return false;
            }
        },
        doDblClick : function(evt) {
            if (evt.target.tagName == "TD") {
                this.tableList.focus();
            }
        },
        doClick : function(evt) {
            if (evt.target.tagName == "TD") {
                var table = evt.target.parentElement.parentElement;
                this.clearSelectionRows(table);
                evt.target.parentElement.style.background = "#d1d1e0";
                var r = evt.target.parentElement;
                this.selectRow(r.getAttribute("key"));
            }
        },
        doNextPageAction : function() {
            if (this.parent.getData != undefined) {
                this.parent.getData("", this._settings.ownerId);
            }
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
        clearSelectionRows : function(table) {
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
        module.exports = SimpleTableViewerPlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return SimpleTableViewerPlugin; });
    } else {
        !("SimpleTableViewerPlugin" in _global) && (_global.SimpleTableViewerPlugin = SimpleTableViewerPlugin);
    }
})();
