// import * as twit from "twitter";
import * as twit from "twit";
import SMP from "./SMP";
import * as dotenv from "dotenv";
dotenv.config();
export class Twitter implements SMP {
  private result: Object;
  private api: twit;
  constructor() {
    this.config();
  }

  public searchByKeyword(params: JSON, resolve, reject) {
    this.api.get(
      "search/tweets",
      params as twit.Params,
      (err, data, response) => {
        if (err) {
          console.log("API returned error: " + JSON.stringify(err));
          reject(err);
        } else {
          this.result = data;
          //console.log(data);
          resolve(data);
        }
      },
    );
  }
  public normalizeResult(data: JSON): JSON[] {
    let filteredParams = [];
    for (let i = 0; i < data.statuses.length; i++) {
      let tweet = data.statuses[i];
      let params = {
        title: tweet.user.name,
        user: tweet.user.name,
        url: tweet.sources,
        views: tweet.retweet_count,
        desc: tweet.text,
        created_time: tweet.created_at,
      };
      filteredParams.push(params);
    }
    return filteredParams;
  }

  public config() {
    this.api = new twit({
      // access_token_key: "1009470072056840192-RymIYBTusOOMKVApihFbyQ2CHA9t1I",
      access_token: process.env.TW_ACCESS_TOKEN,
      access_token_secret: process.env.TW_TOKEN_SECRET,
      consumer_key: process.env.TW_CONSUMER_KEY,
      consumer_secret: process.env.TW_CONSUMER_SECRET,
    });
  }
}
