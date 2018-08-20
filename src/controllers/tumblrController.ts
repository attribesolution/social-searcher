import SMP from "./SMP";
import * as tumblr from "tumblr.js";
import * as dotenv from "dotenv";
dotenv.config();

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

  public normalizeResult(data: JSON): JSON[] {
    let resArray = [];
    for (let i = 0; i < data.length; i++) {
      let tm = data[i];
      let params = {
        title: tm.blog_name,
        user: tm.blog_name,
        url: tm.post_url,
        views: tm.note_count,
        desc: tm.summary,
        embed: tm.short_url,
        created_time: tm.date,
      };
      resArray.push(params);
    }
    return resArray;
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
