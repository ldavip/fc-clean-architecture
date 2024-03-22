import { MockRepository } from "../../../domain/@shared/repository/repository.interface.mock";
import Product from "../../../domain/product/entity/product";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import FindProductUseCase from "./find.product.usecase";

describe("Unit Test find product use case", () => {
  let repository: ProductRepositoryInterface;
  let usecase: FindProductUseCase;

  beforeEach(async () => {
    repository = MockRepository();
    usecase = new FindProductUseCase(repository);
  });

  it("should find an existing product", async () => {
    repository.find = jest
      .fn()
      .mockReturnValue(Promise.resolve(new Product("123", "Product 1", 99.9)));

    const input = {
      id: "123",
    };

    const result = await usecase.execute(input);

    const expectedOutput = {
      id: "123",
      name: "Product 1",
      price: 99.9,
    };

    expect(result).toEqual(expectedOutput);
  });

  it("should throw error when product does not exist", async () => {
    (repository.find as jest.Mock<any, any>).mockImplementation(() => {
      throw new Error("Mock error");
    });

    const input = {
      id: "invalid",
    };

    expect(async () => await usecase.execute(input)).rejects.toThrow(
      "Mock error"
    );
  });
});
