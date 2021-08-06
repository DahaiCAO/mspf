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
        grant: "", // insert(A)|delete(D)|update(U)|query(Q), it can be changed.
    };

    var TreeTablePlugin = function (element, options) {
        this._id = "TreeTablePlugin";
        this._plugin_name = "Tree table plugin";
        this._author = "cdh";
        this._datetime = "20210606";
        this._pluginType = "通用树表插件";
        this._keywords = "树表插件";
        this._description = "树表插件是用于构建左树右表的形式界面";
        this._version = "1.0 based on plugin template 7.0";
        this._copyright = "Cao Dahai 2021";
        // default settings for options
        this._settings = extend(true, {}, defaults, options);
        this._element = element;
        this.currPage; // 装载后的原始数据都存在这里
        this.objects = [];// 更新后的数据都存在这里，这是个缓存
        this.pagesize = 30;
        this.rowCusor = 0;
        this.treeDepth = 0;
        this.headersize = 0;
        this.selectIndex = -1;
        this.init();
    };

    TreeTablePlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            this.id = this._settings.currId;

            var editorPanel = document.createElement("div");
            this._element.appendChild(editorPanel);

            var toolbarRow = document.createElement("div");
            editorPanel.appendChild(toolbarRow);
            toolbarRow.className = "row mb-1";

            this.toolbarCol = document.createElement("div");
            toolbarRow.appendChild(this.toolbarCol);
            this.toolbarCol.className = "btn-toolbar";
            this.toolbarCol.setAttribute("role", "toolbar");

            var painterRow = document.createElement("div");
            editorPanel.appendChild(painterRow);
            painterRow.className = "row";

            var contentCol = document.createElement("div");
            painterRow.appendChild(contentCol);
            contentCol.className = "col card p-0 mx-2 table-responsive";
            if (this._settings.height != "")
                contentCol.style.height = this._settings.height;
            contentCol.style.overflowY = "auto";

            this.tableList = document.createElement("table");
            contentCol.appendChild(this.tableList);
            this.tableList.className = "table table-sm table-striped table-hover";

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
            //this.createNavigationGroup(this.toolbarCol);
            //this.createSearchGroup(this.toolbarCol);
            // next
            if (this.parent.addRearExtraButtons != undefined) {
                this.parent.addRearExtraButtons(this.toolbarCol);
            }
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
            button.className = "btn " + style + " rounded-circle " + classname;
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
        createCellWithCheckbox : function(row, colNum, obj, checkboxValue, depth) {
            var cell = row.insertCell(colNum);
            cell.setAttribute("nowrap", "true");
            for (var i=0; i < depth; i++) {
                var e = document.createElement("div");
                cell.appendChild(e);
                e.style.display = "inline-block";
                e.style.marginRight = "1rem";
                e.innerHTML = "&nbsp;";
            }
            var ei = document.createElement("span");
            cell.appendChild(ei);
            ei.style.display = "inline-block";
            ei.style.marginRight = "1rem";
            ei.id = "ARROW_" + obj.id;
            ei.innerHTML = "&nbsp;";
            var that = this;
            if (obj.children.length > 0) {
                ei.classList.add("tree-table-submenu");
                ei.classList.add("active");
                ei.setAttribute("node-expanded", "true");
                ei.addEventListener("click", function (e) {
                    that.expandChildrenEvent(e, obj);
                }, false);
            }

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
            input.addEventListener("click", function (ev) {
                that.checkParentIndeterminate(obj);
                if (obj.children.length > 0) {
                    that.checkChildren(obj.children, this.checked);
                }
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
        checkParentIndeterminate : function(obj) {
            if (obj.parent != null) {
                var el = document.getElementById("CHECK_" + obj.parent);
                var p = this.seek(obj.parent);
                var allChecked = true;
                var allNotChecked = true;
                // get all check box;
                for (var i = 0; i < p.children.length; i++) {
                    var tmp = document.getElementById("CHECK_" + p.children[i].id);
                    if (!tmp.checked) {
                        allChecked = false;
                    }
                    if (tmp.checked || tmp.indeterminate) {
                        allNotChecked = false;
                    }
                }
                if (!allChecked && !allNotChecked) {
                    el.indeterminate = true;
                    el.checked = false;
                } else if (allChecked && !allNotChecked) {
                    el.indeterminate = false;
                    el.checked = true;
                } else if (!allChecked && allNotChecked) {
                    el.indeterminate = false;
                    el.checked = false;
                }
                this.checkParentIndeterminate(p);
            }
        },
        checkChildren : function(objs, checked) {
            for (var i = 0; i < objs.length; i++) {
                var el = document.getElementById("CHECK_" + objs[i].id);
                el.checked = checked;
                if (objs[i].children.length > 0) {
                    this.checkChildren(objs[i].children, checked);
                }
            }
        },
        seek: function(id) {
            var f = null;
            for (var i = 0; i < this.objects.length; i++) {
                f = this.seekById(this.objects[i], id);
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
        expandChildrenEvent: function(e, obj) {
            var target = e.target;
            if (target.classList.contains("active")) {
                target.classList.remove("active");
                target.setAttribute("node-expanded", "false");
                this.hideChildren(e, obj.children);
            } else {
                target.classList.add("active");
                target.setAttribute("node-expanded", "true");
                this.showChildren(e, obj.children);
            }
        },
        hideChildren: function(e, children) {
            for (var i = 0; i < children.length; i++) {
                var el = document.getElementById("tr_tb_"+children[i].id);
                el.style.display = "none";
                this.hideChildren(e, children[i].children);
            }
        },
        showChildren: function(e, children) {
            for (var i = 0; i < children.length; i++) {
                var el = document.getElementById("tr_tb_"+children[i].id);
                el.style.display = "table-row";
                var target = document.getElementById("ARROW_"+children[i].id);
                var exp = target.getAttribute("node-expanded");
                if (exp == "true") {
                    this.showChildren(e, children[i].children);
                }
            }
        },
        // showAllChildren: function(e, children) {
        //     for (var i = 0; i < children.length; i++) {
        //         var el = document.getElementById("tr_tb_"+children[i].id);
        //         el.style.display = "table-row";
        //         var target = document.getElementById("ARROW_"+children[i].id);
        //         target.setAttribute("node-expanded", "true");
        //         this.showChildren(e, children[i].children);
        //     }
        // },
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
        createHeaderByArrayWithSelectAll : function(row, headers) {
            if (headers != undefined &&
                headers != null &&
                typeof headers === 'object' &&
                Object.prototype.toString.call(headers) === '[object Array]') {
                this.createSelectAllHead(row, headers[0]);
                for (var i = 1; i<headers.length; i++) {
                    this.createHead(headers[i], row);
                }
                this.headersize = headers.length+1;
            }
        },
        createSelectAllHead : function(row, labels) {
            var th = document.createElement('th');
            th.setAttribute("nowrap", "true");
            var formCheck = document.createElement("div");
            th.appendChild(formCheck);
            formCheck.className = "form-check form-check-inline";
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
                // other handling...
                if (that.parent != undefined) {
                    that.parent.handleOtherSelectAllEvent(evt);
                }
            }, false);
            if (labels!="") {
                var label = document.createElement("label");
                formCheck.appendChild(label);
                label.className = "form-check-label";
                label.innerHTML = labels;
            }
            input.type = "checkbox";
            row.appendChild(th);
        },
        addListHeader : function(header) {
            var row = header.insertRow(0);
            if (this.parent != null)
                this.parent.createHeaders(row);
        },
        loading : function(condition, ownerID) {
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
            this.rowCusor = 0;
            if (this.objects != null && this.objects.length > 0) {
                this.createTreeRows(this.objects, 0, tbody);
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
        createTreeRows : function(objects, depth, tbody) {
            for (var i = 0; i < objects.length; i++) {
                if (this.parent != null) {
                    this.treeDepth = depth;
                    this.parent.createRow(objects[i], this.rowCusor, depth, tbody);
                    this.rowCusor += 1;
                    if (objects[i].children.length>0) {
                        this.treeDepth += 1;
                        this.createTreeRows(objects[i].children, this.treeDepth, tbody);
                    }
                }
            }
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
        setParent : function(parent) {
            this.parent = parent;
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
            if (item == this.refreshHButton) {
                if (this.parent.getData != undefined) {
                    this.parent.getData("", this._settings.ownerId);
                }
            }
        },
        hasGranted : function(g) {
            if (this._settings.grant != undefined &&
                typeof this._settings.grant === 'string') {
                var ary = this._settings.grant.split("|");
                for (var i=0; i< ary.length; i++) {
                    if (ary[i] == g) {
                        return true;
                    }
                }
            }
            return false;
        },
        enableButton : function(button) {
            button.disabled = false;
        },
        disableButton : function(button) {
            button.disabled = true;
        },
    };

    _global = (function(){return this || (0, eval)('this');}());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = TreeTablePlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return TreeTablePlugin; });
    } else {
        !("TreeTablePlugin" in _global) && (_global.TreeTablePlugin = TreeTablePlugin);
    }
})();