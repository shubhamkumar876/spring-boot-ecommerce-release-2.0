import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { 
    this.cartItems = JSON.parse(sessionStorage.getItem('cartItems')!) != null ? JSON.parse(sessionStorage.getItem('cartItems')!):[];
  }

  persistCartItems(){
    sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  addToCart(theCartItem: CartItem){

    // check if we already have the item in our cart
    let  theproduct: Product = new Product();
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = new CartItem(theproduct);

    console.log("existingCartItem = " + existingCartItem);

    if (this.cartItems.length > 0){

      // find the itme in the cart based on itemid
      existingCartItem = this.cartItems.find (tempCartItem => tempCartItem.id === theCartItem.id)!;
      console.log("existing cart item = " + existingCartItem);
    
      //check if found it
      alreadyExistsInCart = (existingCartItem != undefined);}

      console.log("alreadyExistsInCart = " + alreadyExistsInCart);

      if (alreadyExistsInCart){

        //increment the quantity
        existingCartItem.quantity++;
      }

      else{
        //just add the item to the array
          this.cartItems.push(theCartItem);
      }

      //compute the cart total price and total quantity
      this.computeCartTotals();

    }
    
  
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
 
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += (currentCartItem.quantity * currentCartItem.unitPrice);
      totalQuantityValue += currentCartItem.quantity;
    }
 
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
 
    this.logCartData(totalPriceValue, totalQuantityValue);
    this.persistCartItems();
 
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    
    console.log('contents of the cart item :-');
    for (let tempcartItem of this.cartItems) {
      const subTotalPrice = tempcartItem.quantity * tempcartItem.unitPrice;
      console.log(`name: ${tempcartItem.name}, quantity=${tempcartItem.quantity}, unitPrice=${tempcartItem.unitPrice} , subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log("----------------------------");
  }

  decrementQuantity(theCartItem: CartItem) {
    
    theCartItem.quantity--;

    if (theCartItem.quantity == 0) {
      this.remove(theCartItem);
    }

    else {
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    
    // get the index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id == theCartItem.id);

    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {

      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

}
