CREATE TYPE task_status AS ENUM ('belum', 'selesai');

CREATE TABLE users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama VARCHAR(200) NOT NULL CHECK (length(trim(nama)) > 0),
  email VARCHAR(254) NOT NULL UNIQUE CHECK (email = lower(trim(email))),
  password_hash TEXT NOT NULL
);

CREATE TABLE courses (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL CHECK (length(trim(name)) > 0),
  kode VARCHAR(50) NOT NULL DEFAULT '',
  dosen VARCHAR(200) NOT NULL DEFAULT '',
  UNIQUE (user_id, id)
);

CREATE TABLE tasks (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mata_kuliah_id INTEGER NOT NULL,
  judul VARCHAR(300) NOT NULL CHECK (length(trim(judul)) > 0),
  deskripsi TEXT NOT NULL DEFAULT '',
  deadline TIMESTAMPTZ NOT NULL CHECK (isfinite(deadline)),
  status task_status NOT NULL DEFAULT 'belum',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now() CHECK (isfinite(created_at)),
  FOREIGN KEY (user_id, mata_kuliah_id) REFERENCES courses(user_id, id) ON DELETE CASCADE
);

CREATE INDEX tasks_user_created_idx ON tasks (user_id, created_at DESC, id DESC);
CREATE INDEX tasks_course_owner_idx ON tasks (user_id, mata_kuliah_id);
