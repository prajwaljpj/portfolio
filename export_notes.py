import sqlite3
import json
import os

def clean_db_string(s):
    """Removes the extra quotes from strings in the db dump."""
    return s.strip('"') if s else ''

def dump_org_roam_db(db_path, output_path):
    """
    Connects to an org-roam SQLite database, reads all data,
    and dumps it to a JSON file, including the content of each note file.
    """
    db_path = os.path.expanduser(db_path)
    if not os.path.exists(db_path):
        print(f"Error: Database file not found at {db_path}")
        return

    con = sqlite3.connect(db_path)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    db_data = {}

    # Get all tables
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cur.fetchall()]

    for table_name in tables:
        cur.execute(f"SELECT * FROM {table_name}")
        rows = [dict(row) for row in cur.fetchall()]
        
        # If this is the 'nodes' table, also read file contents
        if table_name == 'nodes':
            for row in rows:
                file_path_str = clean_db_string(row.get('file'))
                if file_path_str:
                    # The path in the DB is absolute, so we can use it directly
                    file_path = os.path.expanduser(file_path_str)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            row['content'] = f.read()
                    except FileNotFoundError:
                        print(f"Warning: File not found for note: {file_path}")
                        row['content'] = 'File not found.'
                    except Exception as e:
                        print(f"Warning: Could not read file {file_path}: {e}")
                        row['content'] = f'Error reading file: {e}'
                else:
                    row['content'] = ''

        db_data[table_name] = rows

    con.close()

    # Create directory for output file if it doesn't exist
    output_dir = os.path.dirname(output_path)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with open(output_path, 'w') as f:
        json.dump(db_data, f, indent=2)

    print(f"Successfully dumped all data, including note content, to {output_path}")


if __name__ == '__main__':
    db_path = '~/Dropbox/org/org-roam.db'
    output_json_path = 'public/assets/roam_db.json'
    dump_org_roam_db(db_path, output_json_path)
