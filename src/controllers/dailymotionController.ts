// const DMClient = require("./index").client;
import SMP from "./SMP";
import * as dotenv from "dotenv";
dotenv.config();
const DM = require("dailymotion-sdk");
const DMClient = DM.client;
let client: any;

export class DailyMotion implements SMP {
  private clientId: any;
  private clientSecret: any;
  private scope: any;
  private dailymotionData: any;

  public normalizeResult(data: JSON): JSON[] {
    let resArray = [];
    for (let i = 0; i < data.list.length; i++) {
      let dm = data.list[i];
      let params = {
        title: dm.title,
        user: dm.title,
        url: dm.url,
        views: dm.views_total,
        desc: dm.description,
        embed: dm.embed_html,
        created_time: dm.created_time,
      };
      resArray.push(params);
    }
    return resArray;
  }

  constructor() {
    this.clientId = process.env.DM_CLIENT_ID; // Fill yours
    this.clientSecret = process.env.DM_CLIENT_SECRET; // Fill yours
    this.scope = [
      // 'desired scopes',
      // 'refer to API documentation',
      "email",
      // 'userinfo',
      "feed",
      "manage_videos",
    ];

    client = new DMClient(this.clientId, this.clientSecret, this.scope);

    // For authorization there are several ways possible in the API
    // First being using login/password : 'password'
    client.setCredentials(DMClient.GRANT_TYPES.PASSWORD, {
      password: process.env.DM_PASSWORD,
      username: process.env.DM_USERNAME,
    });

    // Then there is 'client_credentials' using only client ID/Secret pair to access unauthorized API parts only
    client.setCredentials(DMClient.GRANT_TYPES.CLIENT_CREDENTIALS);
  }

  public searchByKeyword(reqData: any, resolve: any, reject: any) {
    // this.resolve=resolve;
    // this.reject=reject;
    //let myParams = this.checkParameters(reqData);
    const self = this;
    new Promise((res, rej) => {
      client.createToken(() => this.next(resolve, reject, reqData));
    });
  }

  private checkParameters(reqData: any) {
    let myParams = {};

    if (reqData.query) {
      myParams.search = reqData.query;
    }

    if (reqData.sort) {
      myParams.sort = reqData.sort;
    }

    if (reqData.maxResults) {
      myParams.limit = reqData.maxResults;
    }

    return myParams;
  }

  // If you're using 'password' or 'authorzation_code' (with uri/code pair)
  // you must create an access token prior making any requests
  // Otherwise, refresh your access_token/refresh_token pair
  // client.refreshToken(next);
  private next(resolve: any, reject: any, reqData: any) {
    // Now you should be able to make fully authenticated requests to the DM API
    // console.log(datum);
    const self = this;
    client.get(
      "/videos",
      {
        fields: [
          "thumbnail_240_url",
          "description",
          "id",
          "url",
          "embed_html",
          "created_time",
          "title",
          "views_total",
          "moods",
        ],
        // fields: ['list']
        limit: reqData.limit || 10,
        search: reqData.query,
        sort: reqData.sort || "relevance",
      },
      (err: any, req: any, data: any) => {
        if (err) {
          console.log(err);
          return reject("not done");
        }
        //  console.log(req); // req is the original request object, useful to get headers, debug stuff and so on
        //  console.log(data);
        self.dailymotionData = data; // the api response is here
        resolve(data);
      },
    );
  }
}
