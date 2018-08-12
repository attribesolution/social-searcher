import {DailyMotion} from "../controllers/dailymotionController";

describe("TESTING YOUTUBE API", () => {
  it("should pass the test if query is provided", async () => {
    let dailymotion = new DailyMotion();
    let promise = await new Promise((resolve, reject) => {
      dailymotion.searchByKeyword({query: "Imran Khan"}, resolve, reject);
    })
      .then(resolve => {
        expect(resolve).toBeDefined();
      })
      .catch(err => {
        throw new Error(err);
      });
  });
});
