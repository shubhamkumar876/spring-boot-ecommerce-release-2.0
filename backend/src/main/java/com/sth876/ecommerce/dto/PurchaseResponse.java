package com.sth876.ecommerce.dto;

import lombok.Data;

@Data
public class PurchaseResponse {

    // we can use @NotNull instead of final keyword then lombok will also generate constructor for the field
    public final String orderTrackingNumber;

}
