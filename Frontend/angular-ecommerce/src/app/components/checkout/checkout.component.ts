import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutFormServiceService } from 'src/app/services/checkout-form-service.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  constructor(private formBuilder: FormBuilder,
              private checkoutFormService: CheckoutFormServiceService,
              private cartService: CartService) { }

  ngOnInit(): void {

    this.reviewCartstatus();
    this.cartService.computeCartTotals();

    ////////////////////////////////////////
    this.checkoutFormGroup = this.formBuilder.group ({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required,Validators.minLength(3), 
                                    ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required,Validators.minLength(3),
                                     ShopValidators.notOnlyWhitespace]),
        email: new FormControl('', 
                                [Validators.required,
                                  Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),])
      }),
      shippingAddress: this.formBuilder.group ({
        street: new FormControl('', [Validators.required,Validators.minLength(2), 
                                ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required,Validators.minLength(2), 
                                ShopValidators.notOnlyWhitespace]),
        state:new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,Validators.minLength(6), 
                                  ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group ({
        street: new FormControl('', [Validators.required,Validators.minLength(2), 
                                  ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required,Validators.minLength(2), 
                                ShopValidators.notOnlyWhitespace]),
        state:new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,Validators.minLength(6), 
                                    ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group ({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard:  new FormControl('', [Validators.required,Validators.minLength(3), 
                                        ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      }),
    });

    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("start month = " +  startMonth);

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    this.checkoutFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    this.checkoutFormService.getCountries().subscribe (
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  //////////////////////////////////////////////////

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  /////////////////////////////////////////////////////////

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  /////////////////////////////////////////////////////////

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  /////////////////////////////////////////////////////////


  reviewCartstatus() {

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );


      // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );  

  }


  onSubmit() {

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')!.value);
    console.log("This is the email address - " + this.checkoutFormGroup.get('customer')!.value.email);
    console.log("This is shipping address country is - " + this.checkoutFormGroup.get('shippingAddress')!.value.country.name);
    console.log("This is shipping address state is - " + this.checkoutFormGroup.get('shippingAddress')!.value.state.name);
    
  }

  copyShippingAddressToBillingAddress(event: any) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
            .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

    // bug fix state dropdown not populating in billingAddress 
    this.billingAddressStates = this.shippingAddressStates;
    }

    else {
      this.checkoutFormGroup.controls.billingAddress.reset();

      //same bug fix as "if"
      this.billingAddressStates = [];
    }

  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard')!;

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year equals to the selected year, the start with the current month

    let startMonth: number = 1;

    if (currentYear == selectedYear){
      startMonth = new Date().getMonth() + 1; // 0 based month system in rxjs
    }
    else {
      startMonth = 1;
    }

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup!.value.country.code;
    const countryName = formGroup!.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.checkoutFormService.getStates(countryCode).subscribe(
      data => {

          if (formGroupName === 'shippingAddress') {
            this.shippingAddressStates = data;
          }

          else {
            this.billingAddressStates = data;
          }

          // select first item by default
          formGroup!.get('state')!.setValue(data[0]);
      }
    );
  }

}
