## Entity: A

### Attributes:

- Att A1
- Att A2 `a2`
- Att A3 `a3`

## Entity: Entity B

### Attributes:

- Att B1
- Att B2 `b2`
- Att B3 `b3`

## Entity: C

Refers to `#A.attA1`, `#A.a2`, `#EntityB.attB1` and `#EntityB.b3` implicitly.

Also refers to `#A.a2` again and explicit link to [a a3](`#A.a3`).

## Entity: D

Refers to `#EntityB.b3`, `#A.a3` and explicit link [b att1](#EntityB.attB1).
