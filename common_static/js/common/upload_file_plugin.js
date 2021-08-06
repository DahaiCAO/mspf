/**
 * This class is used to upload a file to cloud platform.
 * 
 * @author Dahai Cao created at 15:43 on 2018-07-10
 */
function UploadAction(parent, url, opt) {
	this.uploadLimit = 1024 * 1024 * 100;// default is 100M
	this.parent = parent;
	this.url = url;
	this.opt = opt;
	this.completed = 0;// 0:incompleted;1:completed
};

UploadAction.prototype.doCancel = function(evt) {
	this.reader.abort();
};

// create a file reader for reading
UploadAction.prototype.doReadandUpload = function(f, loaded, total) {
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		var that = this;
		if (f.size > this.uploadLimit) {
			// if (this.parent != null && this.parent.setStatus != undefined) {
			// 	this.parent.setStatus(0, "每个上传文件大小不能超100M");
			// 	return;
			// }
		}
		this.reader = new FileReader();
		// Read in the image file as a binary string.
		this.reader.onloadstart = function(e) {
		};
		this.reader.onload = function(e) {
			// it is replaced by onloadend;
		};
		this.reader.onloadend = function(e) {
			if (e.target.readyState == FileReader.DONE) { // DONE == 2
				that.completed = 1;
				that.upload(f, e.target.result, function(data) {////>>>>>
					if (that.parent != null
							&& that.parent.complete != undefined) {
						that.parent.complete(f, e.loaded, total, data);
					}
				});
			}
		};
		this.reader.onerror = function(e) {
			if (that.parent != null && that.parent.errorHandler != undefined) {
				that.parent.errorHandler(e, that);
			}
		};
		this.reader.onprogress = function(e) {
			// e is an ProgressEvent.
			if (e.lengthComputable) {
				// evt.loaded / evt.total
				var percentLoaded = Math
						.round(((e.loaded + loaded) * 1.0 / total) * 100);
				// Increase the progress bar length.
				if (percentLoaded < 100) {
					if (that.parent != null
							&& that.parent.updateProgress != undefined) {
						that.parent.updateProgress(e, percentLoaded)
					}
				}
			}
		};
		this.reader.onabort = function(e) {
			that.setStatus(0, "文件上传取消");
		};
		this.reader.readAsArrayBuffer(f);
	} else {
		alert('The File APIs are not fully supported in this browser.');
	}
};

UploadAction.prototype.setTargetPath = function(targetPath) {
    this.path = targetPath;
};

UploadAction.prototype.upload = function(f, fb, onSuccess) {
	var blob = new Blob([ fb ]);
	var fd = new FormData();
	this.fb = fb;
	fd.append('file', blob);
	fd.append('filename', encodeURI(f.name));
	fd.append('flen', f.size);
    if (this.path != undefined && this.path != null && this.path != "")
        fd.append('path', this.path); // upload target path
	// extra parameters, it is object format
	if (this.opt != undefined && this.opt != null && this.opt != "") {
		for (x in this.opt) {
			fd.append(x, this.opt[x]);
		}
	}
	var xhr = new XMLHttpRequest();
	xhr.open('post', this.url, true);
	xhr.onreadystatechange = function(e) {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var data = JSON.parse(xhr.responseText);
			if (onSuccess) {
				onSuccess(data);
			}
		}
	}
	xhr.send(fd);
};

function DownloadAction(url) {
	this.url = url;
};

DownloadAction.prototype.doCancel = function(evt) {
	this.reader.abort();
};

DownloadAction.prototype.downloadFile = function (owner, path, fname) {
    var that = this;
    var fd = new FormData();
    fd.append('oid', owner);
    fd.append('path', path);
    fd.append('filename', fname);
    var xhh = new XMLHttpRequest();
    xhh.open("post", this.url, true);
    xhh.responseType = 'blob'
    xhh.onreadystatechange = function () {
        if (xhh.readyState == 4) {
            if (xhh.status == 200) {
                var contenttype = xhh.getResponseHeader("Content-Type");
                var name = xhh.getResponseHeader("Content-disposition");
                if (name != null) {
                    var filename = name.substring(20, name.length);
                    filename = decodeURI(filename, "utf-8");
                    that.saveFile(this.response, filename, contenttype);
                }
            }
        }
    };
    xhh.send(fd);
};

DownloadAction.prototype.saveFile = function (blob, fileName, contenttype) {
    var b = Utils.getBrowserType();
    if (b == "Chrome") {
        var link = document.createElement('a');
        var file = new Blob([blob], {
            type: contenttype
        });
        link.href = window.URL.createObjectURL(file);
        link.download = fileName;
        link.click();
    } else if (b == "FF") {
        var file = new File([blob], fileName, {
            type: contenttype
        });
        var url = window.URL.createObjectURL(file);
        // window.location.href = url;
        parent.location.href = url;
    } else if (Utils.isIE()) {
        var file = new Blob([blob], {
            type: 'application/force-download'
        });
        window.navigator.msSaveBlob(file, fileName);
    }
};

/**
 * This plug in is used to upload a file to cloud platform.
 *
 * @author Dahai Cao created at 15:43 on 2018-07-10
 */
;
(function ($, window, document, undefined) {
    var pluginName = "fmUploadFilesPlugin";
    var defaults = {
        id: "", // plugin id
        url: "", // uploading arget url
        actnow: "", // if 1, dochange method will work
        filter: "", // image.* or image/gif, image/jpeg
        multiple: "", // if 1, input will can select multiple files
        parent: "", // parent plugin
        height: 0,
    };

    var UploadPlugin = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "", // plugin id
            url: "", // uploading arget url
            actnow: "", // if 1, dochange method will work
            filter: "", // image.* or image/gif, image/jpeg
            multiple: "", // if 1, input will can select multiple files
            parent: "", // parent plugin
            height: 0,
        }, defaults, options);
        this._defaults = defaults;
        this.extpara = null;
        this._name = pluginName;
        this.init(options);
    };

    UploadPlugin.prototype.init = function (options) {
        var mainframe = document.createElement("DIV");
        this.element.appendChild(mainframe);

        this.form = document.createElement("FORM");
        mainframe.appendChild(this.form);

        var fileInputDiv = document.createElement("DIV");
        this.form.appendChild(fileInputDiv);

        this.fileInput = document.createElement("INPUT");
        fileInputDiv.appendChild(this.fileInput);
        this.fileInput.type = "file";
        this.fileInput.id = "file";
        this.fileInput.className = "d-none";
        if (options.multiple == "1") {
            this.fileInput.multiple = true;
        }
        if (options.filter != "") {
            this.fileInput.accept = options.filter;
        }
        if (options.actnow == "1") {
            this.fileInput.addEventListener('change', this, false);
        }

        var infobar = document.createElement("DIV");
        fileInputDiv.appendChild(infobar);
        infobar.style.width = options.width;
        infobar.style.height = options.height;
        infobar.style.border = "1px #5599FF dashed";
        infobar.style.borderRadius = "5px";
        infobar.style.background = "white";

        // 这两个DIV互相切换显示：this.uploadTip和this.progress互换显示。
        this.uploadTip = document.createElement("DIV");
        infobar.appendChild(this.uploadTip);
        this.uploadTip.style.height = (options.height - 4) + "px";
        this.uploadTip.className = "fs-5 fw-bolder text-center p-4 bi bi-cloud-upload";
        this.uploadTip.style.display = "";
        this.uploadTip.innerHTML = " 单击或将文件拖拽到此处";
        this.uploadTip.addEventListener("click", this, false);
        this.uploadTip.addEventListener('dragover', this, false);
        this.uploadTip.addEventListener('drop', this, false);

        this.msgbar = document.createElement("DIV");
        infobar.appendChild(this.msgbar);
        this.msgbar.style.height = "27px";
        this.msgbar.style.display = "none";

        this.progress = document.createElement("DIV");
        infobar.appendChild(this.progress);
        this.progress.style.margin = "4px";
        this.progress.style.height = (options.height - 31) + "px";
        this.progress.style.backgroundColor = "white";
        this.progress.style.textAlign = "center";
        this.progress.style.display = "none";
        //
        this.progressBar = document.createElement("DIV");
        this.progressBar.style.width = "100%";
        this.progress.appendChild(this.progressBar);
        this.progressBar.innerHTML = "0%";
        this.progressBar.style.textAlign = "center";
        this.progressBar.style.height = (options.height - 33) + "px";

        this.uploadAction = new UploadAction(this, options.url, options.extpara);

    };

    UploadPlugin.prototype.setTargetPath = function (path) {
        this.uploadAction.setTargetPath(path);
    };

    UploadPlugin.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
            case "change":
                this.doChange(e);
                break;
            case "dragover":
                this.handleDragOver(e);
                break;
            case "drop":
                this.handleFileSelect(e);
                break;
        }
    };

    UploadPlugin.prototype.doChange = function (evt) {
        if (evt.target == this.fileInput) {
            this.uploadAction.opt = this.extpara;
            if (this.fileInput.files.length > 0) {
                this.uploading(evt.target.files); // FileList object
            }
        }
    };

    UploadPlugin.prototype.start = function () {
        if (this.fileInput.files.length > 0) {
            this.uploading(this.fileInput.files);
        }
    };

    UploadPlugin.prototype.doClick = function(evt) {
        var type = "";
        if (evt.target == this.uploadTip) {
            this.uploadAction.opt = this.extpara;
            this.fileInput.click();
        }
    };

    UploadPlugin.prototype.hasUploadedFiles = function () {
        return this.fileInput.files.length;
    };

    UploadPlugin.prototype.handleDragOver = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    };

    UploadPlugin.prototype.handleFileSelect = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var files = evt.dataTransfer.files; // FileList object.
        this.uploadAction.opt = this.extpara;
        this.uploading(files);
    };

    UploadPlugin.prototype.uploading = function (files) {
        this.uploadAction.opt = this.extpara;
        var total = 0;
        for (var i = 0, f; f = files[i]; i++) {
            total = total + f.size;
        }
        for (var i = 0, f; f = files[i]; i++) {
            this.startProgress(f);
            this.uploadAction.doReadandUpload(f, this.totalloaded, total);
        }
    };

    UploadPlugin.prototype.complete = function (f, loaded, total, data) {
        this.form.reset();
        if (this.options.parent != null
            && this.options.parent.complete != undefined) {
            this.options.parent.complete(f, loaded, total, data, this);
        }
        this.totalloaded = this.totalloaded + loaded;
        if (this.totalloaded == total) {
            this.endProgress();
        }
    };

    UploadPlugin.prototype.startProgress = function (f) {
        this.totalloaded = 0;
        this.fileInput.style.display = "none";
        this.uploadTip.style.display = "none";
        this.progress.style.display = "";
        this.msgbar.style.display = "";
        this.msgbar.innerHTML = "正在上传" + f.name + "(" + Utils.formatBytes(f.size, 2) + ")";
        // Reset progress indicator on new file selection.
        this.progressBar.style.backgroundColor = "#2eb82e";
        this.progressBar.style.width = '0%';
        this.setStatus(1, "0%");
    };

    UploadPlugin.prototype.endProgress = function () {
        this.progressBar.style.width = '100%';
        this.progressBar.innerHTML = '100%';
        this.progress.style.display = "none";
        this.msgbar.style.display = "none";
        this.msgbar.innerHTML = "";
        this.uploadTip.style.display = "";
        this.fileInput.style.display = "";
    };

    UploadPlugin.prototype.updateProgress = function (evt, percentLoaded) {
        this.progressBar.style.width = percentLoaded + '%';
        this.progressBar.innerHTML = percentLoaded + '%';
    };

    UploadPlugin.prototype.setStatus = function (s, msg) {
        if (s == 1) { // normal
            this.progress.style.border = "solid 1px #2eb82e";
            this.progressBar.style.backgroundColor = "#2eb82e";
        } else if (s == 0) { // exception
            this.progress.style.border = "solid 1px red";
            this.progressBar.style.backgroundColor = "red";
            this.progressBar.style.width = '100%';
        }
        this.progressBar.innerHTML = msg;
    };

    UploadPlugin.prototype.errorHandler = function (evt, parent) {
        if (evt.target.error != null) {
            switch (evt.target.error.code) {
                case evt.target.error.NOT_FOUND_ERR:
                    parent.setStatus(0, "文件没找到！");
                    break;
                case evt.target.error.NOT_READABLE_ERR:
                    parent.setStatus(0, "文件不可读");
                    break;
                case evt.target.error.ABORT_ERR:
                    break; // noop
                default:
                    parent.setStatus(0, "读文件错！");
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new UploadPlugin(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);