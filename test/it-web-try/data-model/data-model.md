## Entity: Person

### Attributes:

- Id (APK bigserial)
- Personal number (NK text)
- Family name (M text): Doe - The family name of the person.
- Given names (O varchar(30))
- User name (U text)
- Email (OU text)
- Sex (O enum: male, female)


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

## Entity: Other A

## Entity: Other B

## Entity: Other C

## Entity: Other D

## Entity: Other E


## Entity: Event

### Attributes:

- Time (M timestamp)
- Status (M enum: active, preApproved, disabled,     multi    word )
- Persons (1:n `#Person`)
- Location (n:1 `#Location`)
- Other variants (0..1:1..n `#PlainPk`)
- One to one (1:1 `#SomeExplicitCode`)
- One to one empty (0..1:0..1 `#Empty`)
- Many to many (n:n `#OtherA`)
- Many to many as m n (m:n `#OtherB`)
- Many to many mandatory (1..n:1..n `#OtherC`)
- Many to many left mandatory (1..n:n `#OtherD`)
- Many to many right mandatory (n:1..n `#OtherE`)
