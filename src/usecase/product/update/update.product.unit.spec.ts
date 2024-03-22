import { MockRepository } from "../../../domain/@shared/repository/repository.interface.mock";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import UpdateProductUseCase from "./update.product.usecase";

describe("Unit test for product update use case", () => {
  let productRepository: ProductRepositoryInterface;
  let usecase: UpdateProductUseCase;

  beforeEach(async () => {
    productRepository = MockRepository();
    usecase = new UpdateProductUseCase(productRepository);
  });

  it("should update a product", async () => {
    const existingProduct = ProductFactory.create("a", "Product 1", 99.9);

    productRepository.find = jest
      .fn()
      .mockReturnValue(Promise.resolve(existingProduct));

    const input = {
      id: existingProduct.id,
      name: "Product 1 Updated",
      price: 99.99,
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(input);
  });

  it("should throw error when product does not exist", async () => {
    (productRepository.find as jest.Mock<any, any>).mockImplementation(() => {
      throw new Error("Mock error");
    });

    const input = {
      id: "invalid",
      name: "Product 1 Updated",
      price: 99.99,
    };

    expect(async () => await usecase.execute(input)).rejects.toThrow(
      "Mock error"
    );
  });
});
