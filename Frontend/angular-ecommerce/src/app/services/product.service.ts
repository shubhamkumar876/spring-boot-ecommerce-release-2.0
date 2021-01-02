import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import {map} from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]> {

    //build URL based on the category id ......
    const searchUrl = `${this.baseUrl}/search/findBycategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]>{

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => 
        {
          //console.log(response._embedded.productCategory);
        return response._embedded.productCategory
      } )
    );
  }

  getProductListPaginate(thePage: number, thePageSize: number,
                          theCategoryId: number): Observable<GetResponseProducts> {

    //build URL based on the category id ......
    const searchUrl = `${this.baseUrl}/search/findBycategoryId?id=${theCategoryId}`
                          + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]>{

    //need to build the url based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    // return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(

    //   map(response =>
    //     {
    //     console.log(response._embedded.products);

    //     return response._embedded.products
    //   }));
    console.log(`serach() theKeyword = ${theKeyword}`);
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number, thePageSize: number,  
                        keyword: string): Observable<GetResponseProducts> {

  //build URL based on the keyword ......
  const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`
      + `&page=${thePage}&size=${thePageSize}`;

  return this.httpClient.get<GetResponseProducts>(searchUrl);
}

  getProduct(theProductId: number):Observable<Product> {
    
    //need to build the url based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => {
       console.log("resposne = " + response._embedded.products);
       return response._embedded.products
      }));
  }

}

interface GetResponseProducts{
  _embedded:{
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory{
  _embedded:{
    productCategory: ProductCategory[];
  }
}