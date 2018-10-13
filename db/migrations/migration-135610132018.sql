DROP TABLE cards;
DROP TABLE decks;
DROP TABLE users;

CREATE TABLE IF NOT EXISTS cards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type BOOLEAN,
  cost BOOLEAN,
  offense INT,
  defense INT,
  alignment VARCHAR(255) NOT NULL,
  portrait_file VARCHAR(255),
  class VARCHAR(255),
  rules_text TEXT,
  keywords VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_digest TEXT NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS decks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  type BOOLEAN,
  cards TEXT,
  user_id integer references users(id) NOT NULL
);
