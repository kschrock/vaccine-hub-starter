CREATE TABLE users (
id          SERIAL PRIMARY KEY,
password    TEXT NOT NULL,
first_name    TEXT NOT NULL,
last_name    TEXT NOT NULL,
email       TEXT NOT NULL UNIQUE CHECK (POSITION('@' IN email) >1),
location  TEXT NOT NULL,
posting_date DATE NOT NULL DEFAULT CURRENT_DATE
);