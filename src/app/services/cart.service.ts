import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    cartItems: CartItem[] = [];

    totalPrice: Subject<number> = new Subject<number>();
    totalQuantity: Subject<number> = new Subject<number>();

    constructor() {
        this.cartItems = JSON.parse(sessionStorage.getItem('cartItems')) != null ? JSON.parse(sessionStorage.getItem('cartItems')) : [];
    }

    addToCart(theCartItem: CartItem) {

        // check if we already have the item in our cart
        let alreadyExistInCart: boolean = false;
        let existingCartItem: CartItem = undefined;

        if (this.cartItems.length > 0) {

            // find the item in the cart based on item id
            for (let tempCartItem of this.cartItems) {
                existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
            }

            // check if we found it
            alreadyExistInCart = (existingCartItem != undefined);
        }

        if (alreadyExistInCart) {
            existingCartItem.quantity++;
        } else {
            this.cartItems.push(theCartItem);
        }

        // compute cart total price and total quantity
        this.computeCartTotal();
    }

    computeCartTotal() {

        let totalPriceValue: number = 0;
        let totalQuantityValue: number = 0;

        for (let currentCartItem of this.cartItems) {
            totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
            totalQuantityValue += currentCartItem.quantity;
        }

        // publish the new values (all subscriber will receive the new data)
        this.totalPrice.next(totalPriceValue);
        this.totalQuantity.next(totalQuantityValue);

        // log cart data for debugging
        this.logCartData(totalPriceValue, totalQuantityValue)
        this.persistCartItems();
    }

    logCartData(totalPriceValue: number, totalQuantityValue: number) {
        console.log('Contents of the cart');
        for (let tempCartItem of this.cartItems) {
            const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
            console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice}, subTotalPrice: ${subTotalPrice}`);
        }
        console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
        console.log('=============');
    }

    persistCartItems() {
        sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    decrementQuantity(theCartItem: CartItem) {
        theCartItem.quantity--;
        
        if (theCartItem.quantity === 0) {
            this.remove(theCartItem);
        }
        else {
            this.computeCartTotal();
        }
    }
    remove(theCartItem: CartItem) {
        
        // get index of item in the array 
        const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

        // if found, remove the item from the array at the given index
        if(itemIndex > -1) {
            this.cartItems.splice(itemIndex, 1);
            this.computeCartTotal();
        }
    }
}
