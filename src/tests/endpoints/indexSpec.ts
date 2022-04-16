import myApp from "../../index";
import supertest from "supertest";
const request = supertest(myApp);

describe("Test endpoint responses for running server", () => {
  it("server is running successfully", async () => {
    const response = await request.get("/");
    expect(response.status).toBe(200);
  });
});
