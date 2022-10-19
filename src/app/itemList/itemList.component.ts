// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// @ts-ignore
import { Item } from '../model/item.model';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

  // @ts-ignore
  @Input() items: Array<Item>;
  @Output() getAmount: EventEmitter<any> = new EventEmitter<any>();
  @Output() getEditItem: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  // @ts-ignore
  setAmount(value) {
    this.getAmount.emit(value);
  }

  // @ts-ignore
  passEditItem(value) {
    this.getEditItem.emit(value);
  }

}
