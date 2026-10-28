import Database from 'better-sqlite3'

const db = new Database(':memory:')
db.exec(`
  CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT);
  INSERT INTO users (username, password, role) VALUES
    ('admin', 'supersecret', 'admin'),
    ('dada',  'pw123',       'user');
`)

// SICHER: parametrisierte Query (Platzhalter ?)
function loginSafe(username, password) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?')
  return stmt.all(username, password)   // Werte getrennt übergeben
}

console.log('--- normaler Login ---')
console.log(loginSafe('dada', 'pw123'))

console.log("--- Angriff: admin'-- ---")
console.log(loginSafe("admin'--", 'beliebig'))

console.log("--- Angriff: OR 1=1 ---")
console.log(loginSafe("x' OR '1'='1", "x' OR '1'='1"))