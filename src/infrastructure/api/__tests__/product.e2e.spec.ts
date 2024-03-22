import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const input = {
      type: "a",
      name: "Product 1",
      price: 99.9,
    };

    const response = await request(app).post("/product").send(input);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product 1");
    expect(response.body.price).toBe(99.9);
  });

  it("should not create a product", async () => {
    const input = {
      type: "a",
      name: "Product 1",
    };

    const response = await request(app).post("/product").send(input);

    expect(response.status).toBe(500);
  });

  it("should list all product", async () => {
    const input1 = {
      type: "a",
      name: "Product 1",
      price: 99.9,
    };

    const response = await request(app).post("/product").send(input1);
    expect(response.status).toBe(200);

    const input2 = {
      type: "a",
      name: "Product 2",
      price: 99.99,
    };

    const response2 = await request(app).post("/product").send(input2);
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);

    const customer = listResponse.body.products[0];
    expect(customer.name).toBe("Product 1");
    expect(customer.price).toBe(99.9);

    const customer2 = listResponse.body.products[1];
    expect(customer2.name).toBe("Product 2");
    expect(customer2.price).toBe(99.99);
  });
});
