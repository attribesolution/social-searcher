import {VimeoModule} from "../controllers/vimeoController";

describe("TESTING YOUTUBE API", () => {
  it("should pass the test if query is provided", async () => {
    let vimeo = new VimeoModule();
    let promise = await new Promise((resolve, reject) => {
      vimeo.searchByKeyword({query: "Imran Khan"}, resolve, reject);
    })
      .then(resolve => {
        expect(resolve).toBeDefined();
      })
      .catch(err => {
        throw new Error(err);
      });
  });
});
