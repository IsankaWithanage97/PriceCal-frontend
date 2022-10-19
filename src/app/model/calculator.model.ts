// @ts-ignore
import { Item } from './item.model';

export class Calculator {
  item: Item;
  // @ts-ignore
  amount: number;
  // @ts-ignore
  price: number;
}

export class TotalPriceRequest {
  // @ts-ignore
  itemId: number;
  // @ts-ignore
  amount: number;
}
