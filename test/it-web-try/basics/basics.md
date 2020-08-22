# System name

System description.

## Entity: Person

### Attributes:

- Id (APK bigint)
- Family name (M text): Doe - The family name of the person.
- Given names (O varchar(30))


## Entity: Location

### Attributes:

- Country (M text)
- City (M text)
- Street (O text)


## Entity: Event

### Attributes:

- Time (M timestamp)
- Person (FK `#Person`)
- Location (n:1 `#Location`)


## Screen: List persons `/persons`

### Form: Search

- Search

### Table:

- Family name
    - Fry
    - Turanga
- Given names
    - Philip
    - Leela


## Screen: Edit person `/persons/edit`

### Form:

- Family name (R): Fry
- Given names: Philip
- [primary: Save](#/persons)

> UC `#PR-100`

- [Cancel](#/persons)


## Actor: User

- Person
    - List persons
    - [Edit person](#PR-100)


## UC: `PR-100` Edit person

- Primary actors: `#User`
- Screen: [Edit person](#/persons/edit)

### Main success scenario:

1. User edits person's data.
2. System updates `#Person` record.
