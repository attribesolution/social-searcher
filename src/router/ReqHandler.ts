import {Router, Request, Response, NextFunction} from "express";
import SMP from "../controllers/SMP";
import SMPfactory from "../controllers/SMPFactory";
import {Promise} from "es6-promise";

class RequestHandler {
  public router: Router;

  private smp: SMP;
  constructor() {
    this.router = Router();
    this.routes();
  }

  // the /seearch will redirect to this page and only this method will handle the request
  public handleRequest = (req: Request, res: Response) => {
    // Array of results
    // let result: JSON[] = new Array();
    let smpCreator = new SMPfactory();
    let numSocialMediaAccounts: number = 9;
    let myPromises = new Array(numSocialMediaAccounts);
    let myeditList = [];
    // Cycle through all the user requested smps
    for (var _i = 0; _i < req.body.smpList.length; _i++) {
      // Generate smp
      this.smp = smpCreator.generate(req.body.smpList[_i].name);
      if (this.smp) {
        // Call that smps search and initialize the result var with its result
        //    result.push(null);  // Increase length of result array

        myPromises[_i] = new Promise((resolve, reject) => {
          this.smp.searchByKeyword(
            req.body.smpList[_i].params,
            resolve,
            reject,
          );
        });
        myeditList.push(myPromises[_i]);
      }
    }

    Promise.all(myeditList)
      .then(values => {
        res.send(values);
      })
      .catch(err => {
        console.log("Reject_Error: " + err);
      });
  };

  public routes(): void {
    this.router.post("/", this.handleRequest);
  }
}

// export
const reqHandler = new RequestHandler();
reqHandler.routes();
export default reqHandler.router;
