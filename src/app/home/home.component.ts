// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, OnInit } from '@angular/core';
// @ts-ignore
import { Item } from '../model/item.model';
// @ts-ignore
import { BaseService } from '../base.service';
import { environment } from 'src/environments/environment';
// @ts-ignore
import { Calculator, TotalPriceRequest } from '../model/calculator.model';
declare const $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  newItem: Item = new Item();
  avilableItems: Array<Item> = new Array<Item>();
  calculatedItemList: Array<Calculator> = new Array<Calculator>();
  // @ts-ignore
  totalPrice: number;

  constructor(private service: BaseService) {

  }

  ngOnInit() {
    this.loadAvailableItems();
  }

  loadModalNewItem() {
    this.newItem = new Item();
    $('#newItem').modal('show');
  }

  loadAvailableItems() {
    this.avilableItems = [];
    // @ts-ignore
    this.service.get(environment.itemsApi, false).subscribe(response => {
      // @ts-ignore
      response.forEach(item => {
        const newItem = new Item();
        newItem.id = item.id;
        newItem.discountPrecentage = item.discountPrecentage;
        newItem.imageUrl = item.imageUrl;
        newItem.increasedPrecentage = item.increasedPrecentage;
        newItem.itemName = item.itemName;
        newItem.minCartoonAmountToDiscount = item.minCartoonAmountToDiscount;
        newItem.noOfUnitsInCartoon = item.noOfUnitsInCartoon;
        newItem.priceOFSingleCartoon = item.priceOFSingleCartoon;
        this.avilableItems.push(newItem);
      });
    });
  }

  // @ts-ignore
  passAmount(value) {
    if (value.isCarton) {
      value.amount = value.amount * value.item.noOfUnitsInCartoon;
    }
    let isPurchasedBefore = false;
    this.calculatedItemList.forEach(calculatedItem => {
      if (calculatedItem.item.id == value.item.id) {
        isPurchasedBefore = true;
        if (value.action == 'add') {
          value.amount = calculatedItem.amount + value.amount;
        }
        if (value.action == 'reduce') {
          value.amount = calculatedItem.amount - value.amount;
        }
        if (value.amount < 0) {
          value.amount = 0;
        }
      }
    });
    // @ts-ignore
    this.service.get(environment.itemsApi + 'calculate_price/single/' + value.item.id + '/' + value.amount, false).subscribe(response => {
      if (isPurchasedBefore) {
        this.calculatedItemList.forEach(calculatedItem => {
          // tslint:disable-next-line:triple-equals
          if (calculatedItem.item.id == value.item.id) {
            calculatedItem.amount = value.amount;
            calculatedItem.price = response.price;
          }
        });
      } else {
        const newCalculatedItem = new Calculator();
        newCalculatedItem.item = value.item;
        newCalculatedItem.amount = value.amount;
        newCalculatedItem.price = response.price;
        this.calculatedItemList.push(newCalculatedItem);
      }
      const requestBody = new Array<TotalPriceRequest>();
      // this.totalPrice = 0;
      this.calculatedItemList.forEach(calculatedItem => {
        const request = new TotalPriceRequest();
        request.itemId = calculatedItem.item.id;
        request.amount = calculatedItem.amount;
        // this.totalPrice = this.totalPrice + calculatedItem.price;
        requestBody.push(request);
      });
      // @ts-ignore
      this.service.post(environment.itemsApi + 'calculate_price/all', false, requestBody).subscribe(responseTwo => {
        this.totalPrice = responseTwo.price;
      });
    });
  }

  // @ts-ignore
  changeAmount(value) {
    const changedItem: Calculator = value.item;
    // @ts-ignore
    this.service.get(environment.itemsApi + 'calculate_price/single/' + changedItem.item.id + '/' + changedItem.amount, false).subscribe(response => {
      this.calculatedItemList.forEach(calculatedItem => {
        if (calculatedItem.item.id == changedItem.item.id) {
          calculatedItem.amount = changedItem.amount;
          calculatedItem.price = response.price;
        }
      });
      const requestBody = new Array<TotalPriceRequest>();
      // this.totalPrice = 0;
      this.calculatedItemList.forEach(calculatedItem => {
        const request = new TotalPriceRequest();
        request.itemId = calculatedItem.item.id;
        request.amount = calculatedItem.amount;
        // this.totalPrice = this.totalPrice + calculatedItem.price;
        requestBody.push(request);
      });
      // @ts-ignore
      this.service.post(environment.itemsApi + 'calculate_price/all', false, requestBody).subscribe(responseTwo => {
        this.totalPrice = responseTwo.price;
      });
    });
  }

  // @ts-ignore
  removeItem(value) {
    const removeItem: Calculator = value.item;
    this.calculatedItemList = this.calculatedItemList.filter(obj => obj !== removeItem);
    const requestBody = new Array<TotalPriceRequest>();
    // this.totalPrice = 0;
    this.calculatedItemList.forEach(calculatedItem => {
      const request = new TotalPriceRequest();
      request.itemId = calculatedItem.item.id;
      request.amount = calculatedItem.amount;
      // this.totalPrice = this.totalPrice + calculatedItem.price;
      requestBody.push(request);
    });
    // @ts-ignore
    this.service.post(environment.itemsApi + 'calculate_price/all', false, requestBody).subscribe(responseTwo => {
      this.totalPrice = responseTwo.price;
    });
  }

  // @ts-ignore
  getNewItemDetails(value) {
    // @ts-ignore
    this.service.post(environment.itemsApi, true, value.item).subscribe(response => {
      this.loadAvailableItems();
      $('#newItem').modal('hide');
    });
  }

  // @ts-ignore
  getEditItemInfo(value) {
    this.newItem = value.item;
    $('#newItem').modal('show');
  }
}
