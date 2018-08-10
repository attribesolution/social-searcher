import SMP from "./SMP";
import * as tumblr from "tumblr.js";

export class Tumblr implements SMP {
  private client: any;
  private TumblrData: any;

  constructor() {
    this.client = tumblr.createClient({
      consumer_key: process.env.TM_CONSUMER_KEY,
      consumer_secret: process.env.TM_COSNSUMER_SECRET,
      token: process.env.TM_TOKEN,
      token_secret: process.env.TM_TOKEN_SECRET,
    });

    this.TumblrData = "Nothing";
  }

  public searchByKeyword(reqData, resolve, reject) {
    //let myParams = this.checkParameters(reqData);
    this.client.taggedPosts(reqData.query, reqData, (err, response) => {
      if (err) {
        console.log("API returned error: " + JSON.stringify(err));

        reject(err);
      } else {
        this.TumblrData = response;
        resolve(response);
      }
    });
  }

  public normalizeResult(data: JSON) {
    throw new Error("Method not implemented.");
  }

  // public checkParameters(reqData) {
  //   let params = {};

  //   if (reqData.query) {
  //     params.query = reqData.query;
  //   }
  //   if (reqData.tumblr_before) {
  //     params.before = reqData.tumblr_before;
  //   }
  //   if (reqData.tumblr_limit) {
  //     params.limit = reqData.tumblr_limit;
  //   }
  //   if (reqData.tumblr_filter) {
  //     params.filter = reqData.tumblr_filter;
  //   }

  //   return params;
  // }
}
