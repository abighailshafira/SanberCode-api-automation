// Import libraries
import request from "supertest"; // for HTTP request
import { expect } from "chai"; // for assertion

const baseUrl = "https://kasir-api.belajarqa.com";

let token;
let userId;

const getAuthToken = async () => {
  await request(baseUrl).post("/registration").send({
    name: "toko-tiki",
    email: "tokotiki@gmail.com",
    password: "password",
  });

  const response = await request(baseUrl).post("/authentications").send({
    email: "tokotiki@gmail.com",
    password: "password",
  });

  const accessToken = (await response).body.data.accessToken;
  return accessToken;
};

// Get authentication token before running tests
before(async () => {
  token = await getAuthToken();
});

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

// Test suite for create user
describe("Create User", () => {
  // Positive test case
  it("Successfully create user", async () => {
    const payload = {
      name: "kasir-tokotiki",
      email: "kasirtokotiki@gmail.com",
      password: "password",
    };

    const response = await request(baseUrl)
      .post("/users") // Endpoint
      .send(payload) // Request body
      .set("Authorization", `Bearer ${token}`); // Header

    // Assertions
    expect((await response).status).to.equal(201);
    expect((await response).body.status).to.equal("success");
    expect((await response).body.message).to.equal("User berhasil ditambahkan");
    expect((await response).body.data).to.be.an("object");
    expect((await response).body.data)
      .to.have.property("userId")
      .to.be.a("string");
    expect((await response).body.data).to.have.property("name", "kasir-tokotiki");

    userId = response.body.data.userId;
  });

  // Negative test case
  it("Fail to create user with empty field", async () => {
    const payload = {
      name: "",
      email: "kasirtokotiki@gmail.com",
      password: "password",
    };

    const response = await request(baseUrl)
      .post("/users") // Endpoint
      .send(payload) // Request body
      .set("Authorization", `Bearer ${token}`); // Header

    // Assertions
    expect((await response).status).to.equal(400);
    expect((await response).body.status).to.equal("fail");
    expect((await response).body.message).to.equal('"name" is not allowed to be empty');
  });
});

// Test suite for get user detail
describe("Get User Detail", () => {
  // Positive test case
  it("Successfully get user detail", async () => {
    const response = await request(baseUrl)
      .get(`/users/${userId}`) // Endpoint
      .set("Content-Type", "application/json") // Header
      .set("Authorization", `Bearer ${token}`); // Header

    // Assertions
    expect((await response).status).to.equal(200);
    expect((await response).body.status).to.equal("success");
    expect((await response).body.data).to.have.property("user");
    expect((await response).body.data.user)
      .to.have.property("id")
      .to.be.a("string");
    expect((await response).body.data.user).to.have.property("name", "kasir-tokotiki");
    expect((await response).body.data.user).to.have.property("email", "kasirtokotiki@gmail.com");
    expect((await response).body.data.user).to.have.property("role", "kasir");
  });

  // Negative test case
  it("Fail to create user with invalid user ID", async () => {
    const invalidUserId = "invaliduserid";

    const response = await request(baseUrl)
      .get(`/users/${invalidUserId}`) // Endpoint
      .set("Content-Type", "application/json") // Header
      .set("Authorization", `Bearer ${token}`); // Header

    // Assertions
    expect((await response).status).to.equal(404);
    expect((await response).body.status).to.equal("fail");
    expect((await response).body.message).to.equal("id tidak valid");
  });
});

// Test suite for get user list
describe("Get User List", () => {
  // Positive test case
  it("Successfully get users", async () => {
    const response = await request(baseUrl)
      .get("/users") // Endpoint
      .set("Authorization", `Bearer ${token}`) // Header
      .query({ q: "kasir tokotiki", p: 1 }); // Query params

    // Assertions
    expect((await response).status).to.equal(200);
    expect((await response).body.status).to.equal("success");
    expect((await response).body.data)
      .to.have.property("users")
      .to.be.an("array");

    (await response).body.data.users.forEach((user) => {
      expect(user).to.have.property("id").to.be.a("string");
      expect(user).to.have.property("name").to.be.a("string");
      expect(user).to.have.property("email").to.be.a("string");
      expect(user).to.have.property("role").to.be.a("string");
    });
  });
});

// Test suite for update user
describe("Update User", () => {
  // Positive test case
  it("Successfully update user", async () => {
    const payload = {
      name: "kasir-tokotuku",
      email: "kasirtokotuku@gmail.com",
    };

    const response = await request(baseUrl)
      .put(`/users/${userId}`) // Endpoint
      .send(payload) // Request body
      .set("Authorization", `Bearer ${token}`); // Header

    // Assertions
    expect((await response).status).to.equal(200);
    expect((await response).body.status).to.equal("success");
    expect((await response).body.message).to.equal("User berhasil diupdate");
    expect((await response).body.data).to.have.property("name", "kasir-tokotuku");
  });

  // Negative test case
  it("Fail to update user with invalid user ID", async () => {
    const invalidUserId = "invaliduserid";

    const payload = {
      name: "kasir-tokotuku",
      email: "kasirtokotuku@gmail.com",
    };

    const response = await request(baseUrl)
      .put(`/users/${invalidUserId}`) // Endpoint
      .send(payload) // Request body
      .set("Authorization", `Bearer ${token}`); // Header

    // Assertions
    expect((await response).status).to.equal(404);
    expect((await response).body.status).to.equal("fail");
    expect((await response).body.message).to.equal("id tidak valid");
  });
});

// Test suite for delete user
describe("Delete User", () => {
  // Positive test case
  it("Successfully delete user", async () => {
    const response = await request(baseUrl)
      .delete(`/users/${userId}`) // Endpoint
      .set("Authorization", `Bearer ${token}`); // Header

    // Assertions
    expect((await response).status).to.equal(200);
    expect((await response).body.status).to.equal("success");
    expect((await response).body.message).to.equal("User berhasil dihapus");
  });

  // Negative test case
  it("Fail to delete user with invalid user ID", async () => {
    const invalidUserId = "invaliduserid";

    const response = await request(baseUrl)
      .delete(`/users/${invalidUserId}`) // Endpoint
      .set("Authorization", `Bearer ${token}`); // Header

    // Assertions
    expect((await response).status).to.equal(404);
    expect((await response).body.status).to.equal("fail");
    expect((await response).body.message).to.equal("id tidak valid");
  });
});
