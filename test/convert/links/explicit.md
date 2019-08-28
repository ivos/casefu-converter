## Entity: Address

## Entity: Customer

## Entity: Supplier

## Entity: Order

Refers to [customer](#Customer) and [order item](#OrderItem).

And also refers to [customer](#Customer) again and implicit link `#Customer`.

And also refers to [address](#Address "Address title") with custom title.

## Entity: Order item

Refers to [order](#Order), [customer](#Customer) and implicit link `#Supplier`.
