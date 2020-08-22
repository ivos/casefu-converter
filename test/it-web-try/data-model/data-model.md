## Entity: Person

### Attributes:

- Id (APK bigserial)
- Personal number (NK text)
- Family name (M text): Doe - The family name of the person.
- Given names (O varchar(30))
- User name (U text)
- Email (OU text)


## Entity: Multiple word default code

### Attributes:

- Natural primary key (NPK text)
- Description (O text)
- Person (FK `#Person`)


## Entity: Explicit code `SomeExplicitCode`

### Attributes:

- Foreign primary key (FPK `#Person`)
- Description (O text)


## Entity: Plain PK

### Attributes:

- Primary key (PK bigint)
- Business key (BK text)
- Description (O text)
- Maybe person (OFK `#Person`)


## Entity: Location

### Attributes:

- Name


## Entity: Empty


## Entity: Event

### Attributes:

- Time (M timestamp)
- Persons (1:n `#Person`)
- Location (n:1 `#Location`)
- Other variants (0..1:1..n `#PlainPk`)
- One to one (1:1 `#SomeExplicitCode`)
- One to one empty (0..1:0..1 `#Empty`)
