import { MockRepository } from "../../../domain/@shared/repository/repository.interface.mock";
import ProductB from "../../../domain/product/entity/product-b";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import CreateProductUseCase from "./create.product.usecase";

describe("Unit test create product use case", () => {
  let productRepository: ProductRepositoryInterface;
  let usecase: CreateProductUseCase;

  beforeEach(async () => {
    productRepository = MockRepository();
    usecase = new CreateProductUseCase(productRepository);
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

    const expectedProduct = new ProductB(output.id, input.name, input.price);

    expect(productRepository.create).toHaveBeenCalledWith(expectedProduct);
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
  });
});
