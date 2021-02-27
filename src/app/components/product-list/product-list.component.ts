import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  currentCategoryName: string;


  constructor(private productListService: ProductService, 
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    // check if "id" parameter is availabele
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId) {
      //get the "id" param string. convert string to a number using the '+' symbol
      this.currentCategoryId = + this.route.snapshot.paramMap.get("id");

      //get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get("name");
    } else {
      // no category id available, default id to 1, name to books
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }

    //get the products for the given category id
    this.productListService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

}
