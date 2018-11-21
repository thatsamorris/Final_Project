import sqlite3

conn = sqlite3.connect('ourdatabase.db')

c = conn.cursor()

c.execute("CREATE TABLE IF NOT EXISTS countries (id varchar(3), data json)")

import json

for country in countries:
    c.execute("insert into countries values (?, ?)", [country['id'], json.dumps(country)])
    conn.commit()

# Close db connection
conn.close()