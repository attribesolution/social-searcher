var query;
(function (query) {
    query[query["YOUTUBE"] = 0] = "YOUTUBE";
    query["FLICKR"] = "query";
    query["TWITTER"] = "q";
})(query || (query = {}));
var count;
(function (count) {
    count["YOUTUBE"] = "maxResults";
    count["TWITTER"] = "count";
})(count || (count = {}));
function f(str) {
    var _query;
    var params = {};
    if (str === "YOUTUBE") {
        _query = query.YOUTUBE;
    }
    else if (str === "TWITTER") {
        _query = query.TWITTER;
    }
    params[_query] = "Imran Khan";
    return params;
}
// console.log(f("TWITTER"));
// console.log(f("YOUTUBE"));
console.log(f1("FLICKR"));
//Short Version
function f1(str) {
    var params = {};
    params[query[str]] = "Imran Khan";
    params[count[str]] = 2;
    return params;
}
