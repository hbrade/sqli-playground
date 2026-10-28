import Database from 'better-sqlite3'

const db = new Database(':memory:')   // In-Memory-DB, nichts bleibt liegen

// Testdaten
db.exec(`
  CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT);
  INSERT INTO users (username, password, role) VALUES
    ('admin',  'supersecret', 'admin'),
    ('dada',   'pw123',       'user');
`)

// VERWUNDBAR: String-Konkatenation
function loginVulnerable(username, password) {
  const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
  console.log('SQL:', sql)
  return db.prepare(sql).all()
}

console.log('--- normaler Login ---')
console.log(loginVulnerable('dada', 'pw123'))

console.log("--- Angriff: admin'-- ---")
console.log(loginVulnerable("admin'--", 'beliebig'))

console.log("--- Angriff: OR 1=1 ---")
console.log(loginVulnerable("x' OR '1'='1", "x' OR '1'='1"))