enum query {
  YOUTUBE,
  FLICKR = "query",
  TWITTER = "q",
}
enum count {
  YOUTUBE = "maxResults",
  TWITTER = "count",
}

// function f(str: string): {} {
//   let _query: string;
//   let params = {};
//   if (str === "YOUTUBE") {
//     _query = query.YOUTUBE;
//   } else if (str === "TWITTER") {
//     _query = query.TWITTER;
//   }
//   params[_query] = "Imran Khan";
//   return params;
// }

// console.log(f("TWITTER"));
console.log(f1("FLICKR"));

//Short Version
function f1(str: string): {} {
  let params = {};
  params[query[str]] = "Imran Khan";
  params[count[str]] = 2;
  return params;
}
