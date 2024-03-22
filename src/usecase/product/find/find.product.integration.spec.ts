import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./find.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Integration test find product use case", () => {
  let sequelize: Sequelize;
  let repository = new ProductRepository();
  let usecase = new FindProductUseCase(repository);

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

  it("should find a product", async () => {
    const product = new Product("123", "Product 1", 99.9);

    await repository.create(product);

    const input = {
      id: "123",
    };

    const expectedOutput = {
      id: "123",
      name: "Product 1",
      price: 99.9,
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(expectedOutput);
  });

  it("should throw error when product does not exist", async () => {
    const input = {
      id: "invalid",
    };

    expect(async () => await usecase.execute(input)).rejects.toThrow(
      "Product not found"
    );
  });
});
