# SQL Injection Playground

A minimal, self-contained demo of **SQL injection and its prevention** in
Node.js with SQLite. Two scripts behave identically for valid input but differ
completely in security: one is injectable, the other is not.

This is a defensive learning project — it demonstrates *why* parameterized
queries matter by showing the attack working against vulnerable code and
failing against safe code.

## Run

```bash
npm install
node vulnerable.mjs   # string concatenation → injectable
node safe.mjs         # prepared statement → safe
```

Both scripts seed an in-memory database with two users and run the same inputs:
one normal login and two attacks.

## The one difference that matters

```js
// vulnerable.mjs — input becomes part of the SQL string
`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`

// safe.mjs — input stays data, never code
db.prepare('SELECT * FROM users WHERE username = ? AND password = ?')
  .all(username, password)
```

With concatenation (`${}`), a `'` ends the string and the rest of the input is
interpreted as SQL. With a prepared statement (`?` + separate values), the query
structure is parsed first and the input is only ever inserted as data.

## Attacks demonstrated

| Input | Against vulnerable | Against safe |
|---|---|---|
| `admin'--` | returns admin row (auth bypass) | no match |
| `' OR '1'='1` | returns all users + passwords | no match |

## Why it works / why it fails

```
vulnerable:  WHERE username = 'admin'--' AND password = '...'
             the -- comments out the password check → bypass

safe:        searches literally for a user named "admin'--"
             no such user exists → empty result
```

## Takeaway

The fix is the same in every language and database: **separate data from
code**. Parameterized queries / prepared statements make SQL injection
structurally impossible, because user input can never change the query
structure — it is only ever a value.

## Stack

- Node.js (ES modules)
- better-sqlite3 (in-memory database)

## License

MIT