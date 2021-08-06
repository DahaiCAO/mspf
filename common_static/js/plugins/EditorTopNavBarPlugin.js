/**
 * This is top navbar plugin.
 * Designer: Dahai Cao designed in Beijing at 2021-02-21 10:40
 */
;(function (undefined) {
    "use strict"
    
    var _global;
    
    var defaults = {
        userName: "",// user full name
        userId: "", // user Id
        ownerId: "", // owner Id, such as organization Id
        ownerName: " XX公司", // owner name, such as organization Id
        sessionId: "", // session Id
        theme: "light", // "dark" theme, "light" theme, "dark-light" theme, by default.
        hasLogo: true, // true: has; false: no;
        logoImg: "", // logo image name;
        logoImgUrl: "", // logo image url;
        ownerUrl: "#", // organization official website URL;
        hasNotify: true, // true: includes system notify function; false: not includes;
        hasMe: true, // true: includes me function; false: not includes;
        togTarId: "", // toggle target left side navbar Id,
        hasLeftNavbar: false, // has left side navbar. if true, there will be a toggler on this bar.
        topLeftMenuItems: [], // if it is not empty, there will be a toggler on this bar.
        topRightMenuItems: [], // if it is not empty, there will be a toggler on this bar.
        center: false,
    };
    
    var EditorTopNavBarPlugin = function (element, options) {
        this.id = "SP_00000000000004MD";
        this._plugin_name = "顶部菜单条插件";
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

        this.frontCSS = "navbar-light";
        this.bgCSS = "bg-light";
        if (typeof this._settings.theme === "string") {
            if (this._settings.theme == "dark") {
                this.frontCSS = "navbar-dark";
                this.bgCSS = "bg-dark";
            } else if (this._settings.theme == "light") {
                this.frontCSS = "navbar-light";
                this.bgCSS = "bg-light";
                this.bgCSSDropdown = ""
            } else if (this._settings.theme == "dark-light") {
                this.frontCSS = "navbar-dark";
                this.bgCSS = "bg-dark";
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
    
    EditorTopNavBarPlugin.prototype = {
        constructor: this || (0, eval)('this'),
        init: function() {
            // top navbar frame
            var nav = DomUtils.newelement(this._element, "nav");
            nav.className = "navbar navbar-expand-md shadow-lg";
            nav.classList.add(this.frontCSS);
            nav.classList.add(this.bgCSS);
            
            var navDiv = DomUtils.newelement(nav, "div");
            navDiv.className = "container-fluid";
            
            // left navbar toggler button
            this.createLeftNavbarToggler(navDiv, this.toggleTargetId);
            
            // brand url
            this.createBrand(navDiv);

            // top navbar toggler button
            if (this.topLeftMenuItems != null && this.topLeftMenuItems.length>0) {
                this.createTopNavbarToggler(navDiv);

                // create top left navbar item
                var topNavbar = DomUtils.newelement(navDiv, "div");
                topNavbar.className = "collapse navbar-collapse";
                topNavbar.id = "top-navbar" + this.id;

                var topNavbarUl = DomUtils.newelement(topNavbar, "ul");
                topNavbarUl.className = "navbar-nav me-auto";

                for (var i = 0; i < this.topLeftMenuItems.length; i++) {
                    this.createNavbarItem(topNavbarUl, "#" + this.topLeftMenuItems[i].targetId,
                        this.topLeftMenuItems[i].icon, " " + this.topLeftMenuItems[i].name);
                }
            }

            // top right navbar toggler button
            if (this.topRightMenuItems != null && this.topRightMenuItems.length>0) {
                this.createTopRightNavbarToggler(navDiv);

                var upRightNavbarDiv = DomUtils.newelement(navDiv, "div");
                upRightNavbarDiv.className = "collapse navbar-collapse";
                upRightNavbarDiv.id = "top-navbar";

                var upRightNavbarUl = DomUtils.newelement(upRightNavbarDiv, "ul");
                upRightNavbarUl.className = "nav navbar-nav navbar-align ms-md-auto";

                for (var i=0;i<this.topRightMenuItems.length;i++) {
                    this.createNavbarItem(upRightNavbarUl, "#"+this.topRightMenuItems[i].targetId,
                                          this.topRightMenuItems[i].icon, " "+this.topRightMenuItems[i].name);
                }
            }
            
            // create toppest right tray navbar
            var trayNavbar = DomUtils.newelement(navDiv, "ul");
            trayNavbar.className = "nav navbar-nav navbar-align ms-md-auto";

            // this.createSubsystemButton(trayNavbar);

            // create setting button
            this.createSettingButton(trayNavbar);
            


        },
        createBrand: function(parent) {
            // brand url
            var brandA = DomUtils.newelement(parent, "a");
            brandA.className = "navbar-brand ms-2";
            brandA.href = this._settings.brandUrl;
            if (this._settings.hasLogo) {
                if (this.imgsrc != "") {
                    var img = DomUtils.newelement(brandA, "img");
                    img.src = this.imgsrc;
                    img.style.height = "23px";
                    img.style.width = "23px";
                } else {
                    var strong = DomUtils.newelement(brandA, "strong");
                    var i = DomUtils.newelement(strong, "i");
                    i.className = "bi bi-bootstrap-fill";
                    i.setAttribute("aria-hidden", "true");
                }
            } 
            if (this._settings.ownerName != "") {
                var strong = DomUtils.newelement(brandA, "strong");
                strong.appendChild(document.createTextNode(" "+this._settings.ownerName));
            }
        },
        createSettingButton: function(parent) {
            var settingLi = DomUtils.newelement(parent, "li");
            settingLi.className = "nav-item show-navbar-nav-top-right";
            var settingLiA = DomUtils.newelement(settingLi, "a");
            settingLiA.href = "#";
            settingLiA.className = "nav-link bi bi-gear";
            settingLiA.setAttribute("aria-hidden", "true");
            //settingLiA.appendChild(document.createTextNode(" 设置"));
            $('.show-navbar-nav-top-right').on('click', function () {
                $('.navbar-nav-top-right').addClass('active');
            });
        },
        createSubsystemButton: function(parent) {
            var settingLi = DomUtils.newelement(parent, "li");
            settingLi.className = "nav-item";
            this.settingLiA = DomUtils.newelement(settingLi, "a");
            this.settingLiA.href = "#";
            this.settingLiA.className = "nav-link bi bi-grid-3x3-gap";
            this.settingLiA.setAttribute("aria-hidden", "true");
            this.settingLiA.addEventListener("click", this, false);
        },
        createLeftNavbarToggler: function(parent, id) {
            var left_button = DomUtils.newelement(parent, "button");
            left_button.className = "navbar-nav-left-toggler mr-2";
            left_button.type = "button";
            left_button.setAttribute("data-bs-toggle", ""); // collapse
            left_button.setAttribute("data-bs-target", "#left-navbar"+id);
            left_button.setAttribute("aria-controls", "left-navbar"+id);
            left_button.setAttribute("aria-expanded", "false");
            left_button.setAttribute("aria-label", "Toggle navigation");
            
            var span = DomUtils.newelement(left_button, "span");
            span.className = "navbar-toggler-icon";
        },
        createTopNavbarToggler: function(parent) {
            var left_button = DomUtils.newelement(parent, "button");
            left_button.className = "navbar-toggler";
            left_button.type = "button";
            left_button.setAttribute("data-bs-toggle", "collapse");
            left_button.setAttribute("data-bs-target", "#top-navbar"+this.id);
            left_button.setAttribute("aria-controls", "top-navbar"+this.id);
            left_button.setAttribute("aria-expanded", "false");
            left_button.setAttribute("aria-label", "Toggle navigation");
            
            var span = DomUtils.newelement(left_button, "span");
            span.className = "navbar-toggler-icon";
        },
        createNavbarItem: function(parent, action, fontclass, itemtext) {
            var li = DomUtils.newelement(parent, "li");
            li.className = "nav-item";
            
            var liA = DomUtils.newelement(li, "a");
            liA.className = "nav-link";
            liA.href = action;
            
            var liAI = DomUtils.newelement(liA, "i");
            liAI.className = fontclass;
            liAI.setAttribute("aria-hidden", "true");
            
            liA.appendChild(document.createTextNode(itemtext));
            
            DomUtils.newSrOnly(liA);
        },
        createTopRightNavbarToggler: function(parent) {
            var left_button = DomUtils.newelement(parent, "button");
            left_button.className = "navbar-toggler";
            left_button.type = "button";
            left_button.setAttribute("data-bs-toggle", "collapse");
            left_button.setAttribute("data-bs-target", "#top-right-navbar"+this.id);
            left_button.setAttribute("aria-controls", "top-right-navbar"+this.id);
            left_button.setAttribute("aria-expanded", "false");
            left_button.setAttribute("aria-label", "Toggle navigation");
            
            var span = DomUtils.newelement(left_button, "span");
            span.className = "navbar-toggler-icon";
        },
        handleEvent : function(e) {
            switch (e.type) {
                case "click":
                    this.doClick(e);
                    break;
            }
        },
        doClick : function(e) {

        },
    };
    
    _global = (function(){return this || (0, eval)('this');}());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = EditorTopNavBarPlugin;
    } else if (typeof define === "function" && define.amd) {
        define(function(){ return EditorTopNavBarPlugin; });
    } else {
        !("EditorTopNavBarPlugin" in _global) && (_global.EditorTopNavBarPlugin = EditorTopNavBarPlugin);
    }
})();