import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

describe("Integration test update product use case", () => {
  let sequelize: Sequelize;
  let repository = new ProductRepository();
  let usecase = new UpdateProductUseCase(repository);

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

  it("should update a product", async () => {
    const existingProduct = ProductFactory.create("a", "Product 1", 99.9);

    await repository.create(existingProduct);

    const input = {
      id: existingProduct.id,
      name: "Product 1 Updated",
      price: 99.99,
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(input);
  });

  it("should throw error when product does not exist", async () => {
    const input = {
      id: "invalid",
      name: "Product 1 Updated",
      price: 99.99,
    };

    expect(async () => await usecase.execute(input)).rejects.toThrow(
      "Product not found"
    );
  });
});
