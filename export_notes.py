import sqlite3
import json
import os
import shutil
import re

def clean_db_string(s):
    """
    Aggressively cleans strings from the database by removing leading/trailing
    whitespace and any surrounding quotes.
    """
    if s:
        return s.strip().strip('"')
    return ''

def find_and_copy_assets(content, org_roam_base_dir, images_output_dir):
    """Finds all file and attachment links in the note content and copies them to the public assets directory."""
    asset_links = re.findall(r'\[\[(file|attachment):([^\]]+)\]\]', content)
    
    for link_type, link_path in asset_links:
        asset_name = os.path.basename(link_path)
        new_asset_path = os.path.join(images_output_dir, asset_name)
        
        original_asset_path = None
        if link_type == 'file':
            original_asset_path = os.path.expanduser(link_path)
        elif link_type == 'attachment':
            original_asset_path = os.path.join(org_roam_base_dir, 'data', asset_name)

        if original_asset_path and os.path.exists(original_asset_path):
            try:
                if not os.path.exists(new_asset_path):
                    shutil.copy2(original_asset_path, new_asset_path)
            except Exception as e:
                print(f"Warning: Could not copy asset {original_asset_path}: {e}")
        else:
            print(f"Warning: Asset not found at {original_asset_path}")

def dump_org_roam_db(db_path, json_output_path, notes_output_dir, images_output_dir, org_roam_source_dir):
    """
    Exports the org-roam DB to JSON and copies all org files and media
    from the source directory to their respective public directories.
    """
    db_path = os.path.expanduser(db_path)
    org_roam_source_dir = os.path.expanduser(org_roam_source_dir)

    if not os.path.exists(db_path):
        print(f"Error: Database file not found at {db_path}")
        return
    if not os.path.exists(org_roam_source_dir):
        print(f"Error: Org roam source directory not found at {org_roam_source_dir}")
        return

    for d in [notes_output_dir, images_output_dir, os.path.dirname(json_output_path)]:
        if d:
            os.makedirs(d, exist_ok=True)

    if os.path.exists(notes_output_dir):
        shutil.rmtree(notes_output_dir)
    os.makedirs(notes_output_dir)
    
    if os.path.exists(images_output_dir):
        shutil.rmtree(images_output_dir)
    os.makedirs(images_output_dir)

    print(f"Copying files from {org_roam_source_dir}...")
    for filename in os.listdir(org_roam_source_dir):
        source_path = os.path.join(org_roam_source_dir, filename)
        if not os.path.isfile(source_path):
            continue
        if filename.endswith('.org'):
            shutil.copy2(source_path, os.path.join(notes_output_dir, filename))
        else:
            shutil.copy2(source_path, os.path.join(images_output_dir, filename))
    print("File copying complete.")

    print(f"Exporting database from {db_path}...")
    con = sqlite3.connect(db_path)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    db_data = {}
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cur.fetchall()]

    for table_name in tables:
        cur.execute(f"SELECT * FROM {table_name}")
        rows = [dict(row) for row in cur.fetchall()]
        
        # Clean all string values in all rows
        for row in rows:
            for key, value in row.items():
                if isinstance(value, str):
                    row[key] = clean_db_string(value)

        # Update file paths in the 'nodes' table to be web-accessible
        if table_name == 'nodes':
            for row in rows:
                original_file_path_str = row.get('file')
                if original_file_path_str:
                    file_name = os.path.basename(original_file_path_str)
                    new_path = os.path.join(notes_output_dir, file_name)
                    if os.path.exists(new_path):
                        row['file'] = f"/{os.path.relpath(new_path, 'public')}"
                    else:
                        row['file'] = None

        db_data[table_name] = rows

    con.close()

    with open(json_output_path, 'w') as f:
        json.dump(db_data, f, indent=2)
    print(f"Database export complete. JSON saved to {json_output_path}")

if __name__ == '__main__':
    db_path = '~/Dropbox/org/org-roam.db'
    org_roam_source_dir = '~/Dropbox/org/roam'
    output_json_path = 'public/assets/roam_db.json'
    output_notes_dir = 'public/roam_notes'
    output_images_dir = 'public/assets/roam_images'
    
    dump_org_roam_db(db_path, output_json_path, output_notes_dir, output_images_dir, org_roam_source_dir)