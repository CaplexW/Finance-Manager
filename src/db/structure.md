# Collections
- User
- Operation
- DefaultCategory
- Category
- Goal
- Account
- Icon
- Token

## User
- e-mail: String
- password: Hashed_Password
- name: String
- image: String
- operations: [${Operation._id}]
- categories: [${DefaultCategory._id & Category._id}]
- goals: [${Goal._id}]
- accounts: [${Account._id}]

## Operation
- name: String
- amount: Number
- category: ${Category._id}
- user: ${User._id}

## Category
- name: String
- isIncome: Boolean
- color: String
- icon: ${Icon._id}

## DefaultCategory
- ...Category
- user: null

## Goal
- name: String
- balance: Number
- status: Boolean
- goalPoint: Number
- user: ${User._id}
- account?: ${Account._id}

## Account
- name: String
- balance: Number
- percent?: Number
- type: enum[credit, debit, savings]
- user: ${User._id}
- goal?: ${Goal._id}

## Icon
- name?: String
- src: SVGElement

## Token
- refreshToken: String
- user: ${User._id}