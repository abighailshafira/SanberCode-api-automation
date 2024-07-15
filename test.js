// Import libraries
import request from "supertest"; // for HTTP request
import { expect } from "chai"; // for assertion

const baseUrl = "https://kasir-api.belajarqa.com";

// Test suite for registration
describe("Registration", () => {
  // Positive test case
  it("Successfully register", async () => {
    const payload = {
      name: "toko-tiki",
      email: "tokotiki@gmail.com",
      password: "password",
    };

    const response = await request(baseUrl).post("/registration").send(payload);

    // Assertion
    expect((await response).status).to.equal(201);
    expect((await response).body.status).to.equal("success");
    expect((await response).body.message).to.equal("Toko berhasil didaftarkan");
    expect((await response).body.data).to.have.property("name", "toko-tiki");
    expect((await response).body.data).to.have.property("email", "tokotiki@gmail.com");

    // console.log(response.body);
  });

  // Negative test case
  it("Fail to register with invalid email", async () => {
    const payload = {
      name: "toko-tiki",
      email: "invalidemail",
      password: "password123!",
    };

    const response = await request(baseUrl).post("/registration").send(payload);

    // Assertion
    expect((await response).status).to.equal(400);
    expect((await response).body.status).to.equal("fail");
    expect((await response).body.message).to.equal('"email" must be a valid email');
  });
});

// Test suite for login
describe("Login", () => {
  // Positive test case
  it("Successfully login", async () => {
    const payload = {
      email: "tokotiki@gmail.com",
      password: "password",
    };

    const response = await request(baseUrl).post("/authentications").send(payload);

    // Assertion
    expect((await response).status).to.equal(201);
    expect((await response).body.status).to.equal("success");
    expect((await response).body.message).to.equal("Authentication berhasil ditambahkan");
    expect((await response).body.data)
      .to.have.property("accessToken")
      .to.be.a("string");
    expect((await response).body.data)
      .to.have.property("refreshToken")
      .to.be.a("string");
  });

  // Negative test case
  it("Fail to register with unregistered email", async () => {
    const payload = {
      email: "unregistered@gmail.com",
      password: "password",
    };

    const response = await request(baseUrl).post("/authentications").send(payload);

    // Assertion
    expect((await response).status).to.equal(401);
    expect((await response).body.status).to.equal("fail");
    expect((await response).body.message).to.equal("Kredensial yang Anda berikan salah");
  });
});
