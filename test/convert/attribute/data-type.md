### Attributes:

- Default data type

- Data type only (data type value 123)
- With status as full code (primaryKey string 654)
- With status as short code (M string 14)
- With whitespaces ( 	data	 type	 48 	)
- With status and whitespaces ( 	foreignKey	 data	 type	 49 	)

- Parens in data type (varchar(30))
- Data type in parens (M (varchar 30))
- Status and parens in data type (O varchar(32) after 	)

- Implicit local reference (`#OtherEntity`)
- Generic code (`OtherEntity`)
- Explicit local reference ([some entity label](#SomeEntity))
- Explicit outside reference ([some label](/path/url))

- Spaced dash in type (string 4 - 14)
- Spaced dash in type with description (string 6 - 16) - Spaced dash description
- Parens ( varchar ( ( 30 - 40 )  ) ) - Desc ( d1 )

- Enum without status (enum: created, preApproved, postApproved, disabled)
- Enum full (M enum: active , disabled): `active` - An enum attribute.
- Enum with whitespaces (M enum: disabled, some white  space   included value)
