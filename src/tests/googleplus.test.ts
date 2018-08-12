import {GooglePlus} from "../controllers/googleplusController";

describe("TESTING YOUTUBE API", () => {
  it("should pass the test if query is provided", async () => {
    let googleplus = new GooglePlus();
    let promise = await new Promise((resolve, reject) => {
      googleplus.searchByKeyword({query: "Imran Khan"}, resolve, reject);
    })
      .then(resolve => {
        expect(resolve).toBeDefined();
      })
      .catch(err => {
        throw new Error(err);
      });
  });
});
