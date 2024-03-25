import Product from "./product";

describe("Product unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => new Product("", "Product 1", 100)).toThrowError(
      "Product: Id is required"
    );
  });

  it("should throw error when name is empty", () => {
    expect(() => new Product("123", "", 100)).toThrowError(
      "Product: Name is required"
    );
  });

  it("should throw error when price is not greater than zero", () => {
    expect(() => new Product("123", "Name", -1)).toThrowError(
      "Product: Price must be greater than zero"
    );
    expect(() => new Product("123", "Name", 0)).toThrowError(
      "Product: Price must be greater than zero"
    );
  });

  it("should throw error when fields are invalid", () => {
    expect(() => new Product("", "", 0)).toThrowError(
      "Product: Id is required,Product: Name is required,Product: Price must be greater than zero"
    );
  });

  it("should change name", () => {
    const product = new Product("123", "Product 1", 100);
    expect(product.name).toBe("Product 1");

    product.changeName("Product 2");
    expect(product.name).toBe("Product 2");
  });

  it("should change price", () => {
    const product = new Product("123", "Product 1", 100);
    expect(product.price).toBe(100);

    product.changePrice(150);
    expect(product.price).toBe(150);
  });
});
