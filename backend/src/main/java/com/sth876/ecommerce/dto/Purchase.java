package com.sth876.ecommerce.dto;

import com.sth876.ecommerce.entity.Customer;
import com.sth876.ecommerce.entity.Order;
import com.sth876.ecommerce.entity.OrderItem;
import lombok.Data;
import com.sth876.ecommerce.entity.Address;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    public Address shippingAddress;
    public Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
