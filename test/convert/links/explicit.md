## Entity: Customer

## Entity: Supplier

## Entity: Order

Refers to [customer](#Customer) and [order item](#OrderItem).

And also refers to [customer](#Customer) again and implicit link `#Customer`.

## Entity: Order item

Refers to [order](#Order), [customer](#Customer) and implicit link `#Supplier`.
