import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";

describe("Integration test list product use case", () => {
  let sequelize: Sequelize;
  let repository = new ProductRepository();
  let usecase = new ListProductUseCase(repository);

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

  it("should list all products", async () => {
    const product1 = ProductFactory.create("a", "Product 1", 20);
    const product2 = ProductFactory.create("b", "Product 2", 10);

    await repository.create(product1);
    await repository.create(product2);

    const output = await usecase.execute({});

    expect(output.products.length).toBe(2);
    expect(output.products[0].id).toBe(product1.id);
    expect(output.products[0].name).toBe("Product 1");
    expect(output.products[0].price).toBe(20);
    expect(output.products[1].id).toBe(product2.id);
    expect(output.products[1].name).toBe("Product 2");
    expect(output.products[1].price).toBe(20);
  });
});
