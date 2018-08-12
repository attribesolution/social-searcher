// import * as twit from "twitter";
import * as twit from "twit";
import SMP from "./SMP";

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

  normalizeResult(data: JSON) {
    throw new Error("Method not implemented.");
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
