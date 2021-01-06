package com.sth876.ecommerce.service;

import com.sth876.ecommerce.dto.Purchase;
import com.sth876.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder (Purchase purchase);
}
