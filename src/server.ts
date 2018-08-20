import * as express from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
dotenv.config();
// import routers
import {RequestHandler} from "./router/ReqHandler";
// server class
class Server {
  public app: express.Application;
  public req: RequestHandler;
  constructor() {
    this.app = express();
    this.req = new RequestHandler();
    this.config();
    this.routes();
  }

  public config() {
    // config
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: true}));
  }

  public routes(): void {
    let router: express.Router;
    router = express.Router();

    // this.app.get("/", router);
    this.app.post("/search", this.req.handleAllRequest);
    this.app.post("/socialsearch", this.req.handleSocialSearchRequest);
  }
}

export default new Server().app;
