function Service(context) {
    this.context = context;
    this.init();
};

Service.prototype = {
    init: function () {

    },
    api: function (s, n) {
        url = this.context+ "/service/s" + s + "/api" + n + "/";
        return url;
    },
    api1: function (s, n) {
        url = "../" + this.context+ "/service/s" + s + "/api" + n + "/";
        return url;
    },
};
