import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";

describe("Integration test create product use case", () => {
  let sequelize: Sequelize;
  let repository = new ProductRepository();
  let usecase = new CreateProductUseCase(repository);

  jest.spyOn(repository, "create");

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const input = {
      type: "b",
      name: "Product 1",
      price: 99.9,
    };

    const output = await usecase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price * 2,
    });

    const expectedProduct = {
      id: output.id,
      name: input.name,
      price: input.price * 2,
    };

    const createdProduct = await repository.find(output.id);

    expect(createdProduct.id).toEqual(expectedProduct.id);
    expect(createdProduct.name).toEqual(expectedProduct.name);
    expect(createdProduct.price).toEqual(expectedProduct.price);

    expect(repository.create).toBeCalledTimes(1);
  });

  it("should throw an error when name is missing", async () => {
    const inputWithoutName = {
      type: "a",
      name: "",
      price: 99.9,
    };

    await expect(usecase.execute(inputWithoutName)).rejects.toThrow(
      "Name is required"
    );

    expect(repository.create).toBeCalledTimes(0);
  });

  it("should throw an error when price is not greater than zero", async () => {
    const inputWithPriceNegative = {
      type: "a",
      name: "Product 1",
      price: -1,
    };

    await expect(usecase.execute(inputWithPriceNegative)).rejects.toThrow(
      "Price must be greater than zero"
    );

    const inputWithPriceZero = {
      type: "a",
      name: "Product 1",
      price: 0,
    };

    await expect(usecase.execute(inputWithPriceZero)).rejects.toThrow(
      "Price must be greater than zero"
    );

    expect(repository.create).toBeCalledTimes(0);
  });
});
