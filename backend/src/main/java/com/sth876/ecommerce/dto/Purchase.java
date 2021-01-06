package com.sth876.ecommerce.dto;

import com.sth876.ecommerce.entity.Address;
import com.sth876.ecommerce.entity.Customer;
import com.sth876.ecommerce.entity.Order;
import com.sth876.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
