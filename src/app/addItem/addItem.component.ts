import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// @ts-ignore
import { Item } from '../model/item.model';

// noinspection AngularMissingOrInvalidDeclarationInModule,JSUnusedGlobalSymbols
@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

  @Input() item:Item;
  @Output() passItemInfo: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  // @ts-ignore
  setValue(value) {
    this.item[value.key] = value.value;
  }

  getNewItem() {
    this.passItemInfo.emit({
      item: this.item
    })
    this.item = new Item();

  }

}
