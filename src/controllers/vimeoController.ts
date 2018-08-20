import SMP from "./SMP";
import * as vimeoModule from "../../node_modules/vimeo";
const Vimeo = vimeoModule.Vimeo;
import * as dotenv from "dotenv";
dotenv.config();
interface Param {
  query?: string;
  page?: number;
  sort?: string;
  direction?: string;
  per_page: number;
  filter?: any;
}

export class VimeoModule implements SMP {
  private VimeoData: any;

  constructor() {}

  public makeRequest(lib, params, resolve, reject) {
    // Make an API request
    lib.request(
      {
        // This returns the first page of videos containing the term "vimeo staff".
        // These videos will be sorted by most relevant to least relevant.
        path: "/videos",
        query: params,
        sort: params.sort,
      },
      (error, body, statusCode, headers) => {
        if (error) {
          console.log("\nerror: " + error);
          reject("not done vimeo");
        } else {
          this.VimeoData = body.data;
          resolve(body.data);
        }
      },
    );
  }

  public normalizeResult(data: JSON): JSON[] {
    let resArray = [];
    for (let i = 0; i < data.length; i++) {
      let vm = data[i];
      let params = {
        title: vm.name,
        user: vm.user.name,
        url: vm.link,
        views: vm.metadata.connections.likes.total,
        desc: vm.description,
        embed: vm.embed.html,
        created_time: vm.created_time,
      };
      resArray.push(params);
    }
    return resArray;
  }

  public searchByKeyword(reqData, resolve, reject) {
    let myParams = this.checkParameters(reqData);

    let lib = new Vimeo(process.env.VM_CLIENT_ID, process.env.VM_CLIENT_SECRET);

    if (process.env.VM_ACCESS_TOKEN) {
      lib.setAccessToken(process.env.VM_ACCESS_TOKEN);
      this.makeRequest(lib, myParams, resolve, reject);
    } else {
      // Unauthenticated API requests must request an access token. You should not request a new access token for each
      // request, you should request an access token once and use it over and over.
      lib.generateClientCredentials("public", (err, response) => {
        if (err) {
          throw err;
        }

        // Assign the access token to the library
        lib.setAccessToken(response.access_token);

        this.makeRequest(lib, myParams, resolve, reject);
      });
    }
  }

  public checkParameters(reqData) {
    let params: Param = {
      per_page: 5,
      sort: "relevant",
    };
    if (reqData.query) {
      params.query = reqData.query;
    }
    // if (reqData.vimeo_uris) { params.uris = reqData.vimeo_uris; console.log("\nid: " + params.uris); }
    // else {params.uris='';}
    // if (reqData.vimeo_links) { params.links = reqData.vimeo_links; console.log("\nid: " + params.links); }
    // else {params.links='';}
    if (reqData.page) {
      params.page = reqData.page;
    } else {
      params.page = 1;
    }
    if (reqData.sort) {
      params.sort = reqData.sort;
    }
    if (reqData.direction) {
      params.direction = reqData.direction;
    } else {
      params.direction = "asc";
    }
    if (reqData.per_page) {
      params.per_page = reqData.per_page;
    }
    if (reqData.filter) {
      params.filter = reqData.filter;
    } else {
      params.filter = null;
    }

    return params;
  }
}
