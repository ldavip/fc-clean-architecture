import { MockRepository } from "../../../domain/@shared/repository/repository.interface.mock";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import ListProductUseCase from "./list.product.usecase";

describe("Unit test for listing products use case", () => {
  let productRepository: ProductRepositoryInterface;
  let usecase: ListProductUseCase;

  beforeEach(async () => {
    productRepository = MockRepository();
    usecase = new ListProductUseCase(productRepository);
  });

  it("should list empty products", async () => {
    productRepository.findAll = jest.fn().mockReturnValue(Promise.resolve([]));

    const output = await usecase.execute({});

    expect(output.products.length).toBe(0);
  });

  it("should list all products", async () => {
    const product1 = ProductFactory.create("a", "Product 1", 20);
    const product2 = ProductFactory.create("b", "Product 2", 10);

    productRepository.findAll = jest
      .fn()
      .mockReturnValue(Promise.resolve([product1, product2]));

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
