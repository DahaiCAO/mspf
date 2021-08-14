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
    };
    
    var FileEditorPlugin = function (element, options) {
        this._id = "FileEditorPlugin";
        this._plugin_name = "FileEditorPlugin";
        this._author = "cdh";
        this._datetime = "";
        this._pluginType = "";
        this._keywords = "";
        this._description = "";
        this._version = "1.0 based on plugin template 7.0";
        this._copyright = "";
        // default settings for options
        this._settings = extend({}, defaults, options);
        map[this._settings.currId] = this;

        this._element = element;
        this.init();
    };
    
    FileEditorPlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            this.content = DomUtils.newelement(this._element, "DIV");
            this.content.id = "editor" + this._settings.currId;
            this.content.style.minHeight = this._settings.height;
            this.editor = ace.edit("editor" + this._settings.currId);
            // this.editor.session.setMode("ace/mode/python");
            this.editor.setOptions ({
                enableBasicAutocompletion: true, //
                enableSnippets: true, //
                enableLiveAutocompletion: true, // 补全
            });
            this.editor.setFontSize(14);
            var that = this;
            this.editor.getSession().on ('change', function (e) {
                that.saveFile(that._settings.context, that.editor.getValue());
            });
            // 4. Attach an event listener to handle when the user clicks on some row of the gutter
            //    In this case, the breakpoint will be added in the clicked position of the document
            this.editor.on("guttermousedown", function(e) {
                var target = e.domEvent.target;
                if (target.className.indexOf("ace_gutter-cell") == -1){
                    return;
                }
                if (!e.editor.isFocused()){
                    return; 
                }
                if (e.clientX > 25 + target.getBoundingClientRect().left){
                    return;
                }
                var breakpoints = e.editor.session.getBreakpoints(row, 0);
                var row = e.getDocumentPosition().row;
                // If there's a breakpoint already defined, it should be removed, offering the toggle feature
                if(typeof breakpoints[row] === typeof undefined){
                    e.editor.session.setBreakpoint(row);
                }else{
                    e.editor.session.clearBreakpoint(row);
                }
                //console.log(breakpoints);
                e.stop();
            });
            var modelist = ace.require("ace/ext/modelist");
            var filePath = this._settings.context;
            var mode = modelist.getModeForPath(filePath).mode;
            this.editor.session.setMode(mode) // mode now contains "ace/mode/javascript".
            // default
            if (mode ==  "ace/mode/python") {
                this.editor.setTheme("ace/theme/twilight");
            } else {
                this.editor.setTheme("ace/theme/chrome");
            }
            this.loadFile(this._settings.context);
        },
        loadFile : function(filePath) {
            this.filePath = filePath;
            var that = this;
            $.ajax({
                url: service.api1(0, 15),
                data: {
                    filePath: filePath,
                },
                type: 'POST',
                dataType: 'JSON',
                complete: function (data) {
                    data = data.responseJSON;
                    if (data.fileContent != undefined)
                        that.editor.setValue(data.fileContent, -1);
                },
            });
        },
        saveFile : function(filePath, content) {
            $.ajax({
                url: service.api1(0, 16),
                data: {
                    filePath: filePath,
                    fileContent: content,
                },
                type: 'POST',
                dataType: 'JSON',
                complete: function (data) {
                    data = data.responseJSON;
                    if (data.status != 0)
                        console.log("Save failed");
                },
            });
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
        module.exports = FileEditorPlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return FileEditorPlugin; });
    } else {
        !("FileEditorPlugin" in _global) && (_global.FileEditorPlugin = FileEditorPlugin);
    }
})();