## Entity: A

### Attributes:

- Code (APK bigserial)
- Created (timestamp)


## Entity: B

### Attributes:

- Code (NPK varchar(15))
- Created (timestamp)


## Entity: C

### Attributes:

- Code (FPK `#B`)
- Created (timestamp)


## Entity: D

### Attributes:

- Code (FPK `#C`)
- Created (timestamp)


## Entity: E

### Attributes:

- Code (PK SERIAL)
- Created (TIMESTAMP)


## Entity: F

### Attributes:

- Name


## Entity: Referring R

### Attributes:

- fk (FK `#A`)
- ofk (OFK [The B](#B))
- N to 1 (n:1 `#C`)
- N to 0..1 (N:0..1 `#D`)
- N to 1..1 (n:1..1 `#E`)
- One to 1 (1:1 `#F`)
- Not a ref (FK varchar(42))


## Entity: Referring S

### Attributes:

- one to n (1:n `#A`)
- one to 0..n (1:0..N `#B`)
- One..1 to 1..n (1..1:1..n `#C`)
- M to n (m:N `#D`)
- One to * (1:* `#E`)
- Zero..1 to 1..* (0..1:1..* `#F`)


## Entity: Master

### Attributes:

- slaves (1:n `#Slave`)


## Entity: Slave

### Attributes:

- master (n:1 `#Master`)
