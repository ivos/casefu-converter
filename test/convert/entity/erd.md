## Screen: Screen 1

Refers to `#Entity_2`.

## Screen: Screen 2

## Entity: Entity 1

## Entity: Entity 2

Refers to `#/screen/2`.

### Attributes:
- Att 21
- Att 22 (M data type 22)
- Att 23 (O data type 23)
- Att 24 (PK data type 24)
- Att 25 (foreignKey data type 25)
- Att 26 (FK `#Entity_1`)
- Att 27 (1:n [Entity 2](#Entity_2))
- Att 28 (n:1 `#Entity_3`)

## Entity: Entity 3
### Attributes:
- Att 31
- Att 32 (APK bigint)
- Att 33 (FK `#Entity_1`)
- Att 34 (1:n `#Entity_2`)

## Entity: Entity 4
### Attributes:
- Att 41 (`#Entity_2`)
