import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NoteNode {
  id: string;
  file: string;
  title: string;
  level: number;
  pos: number;
  properties: string;
}

interface RoamDB {
  nodes: NoteNode[];
}

const NotesPage = () => {
  const [db, setDb] = useState<RoamDB | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/assets/roam_db.json')
      .then((res) => res.json())
      .then((data) => {
        setDb(data);
      });
  }, []);

  const filteredNodes = db?.nodes.filter((node) =>
    node.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-4">Notes</h1>
      <input
        type="text"
        placeholder="Search notes..."
        className="w-full p-2 mb-4 border border-gray-300 rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredNodes ? (
        <ul className="space-y-2">
          {filteredNodes.map((node) => (
            <li key={node.id} className="p-2 border rounded hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
              <Link href={`/notes/${node.id}`} className="text-blue-500 hover:underline">
                {node.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading notes...</p>
      )}
    </div>
  );
};

export default NotesPage;