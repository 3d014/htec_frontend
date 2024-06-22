export interface Product{
    productId?:string,
    productName:string,
    measuringUnit:string,
    categoryId?:string
}

export interface ProductSumMap {
    [productId: number]: {
      productName: string;
      productSum: number;
    };
  }