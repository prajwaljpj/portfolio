import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const NotesGraph = dynamic(() => import('../components/NotesGraph'), {
  ssr: false,
});

interface NoteNode {
  id: string;
  file: string;
  title: string;
  level: number;
}

interface RoamDB {
  nodes: NoteNode[];
  tags: { node_id: string; tag: string }[];
  links: { source: string; dest: string; pos: number }[];
}

interface SearchResult {
  noteId: string;
  noteTitle: string;
  matchType: 'title' | 'tag' | 'subheading';
  matchText: string;
}

const NotesPage = () => {
  const [db, setDb] = useState<RoamDB | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/assets/roam_db.json')
      .then((res) => res.json())
      .then((data) => setDb(data));
  }, []);

  const searchResults = useMemo((): SearchResult[] => {
    if (!db || !searchTerm) {
      return [];
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results: SearchResult[] = [];
    const addedNotes = new Set<string>();

    db.nodes.forEach((node) => {
      if (node.level === 0 && node.title.toLowerCase().includes(lowerCaseSearchTerm)) {
        results.push({ noteId: node.id, noteTitle: node.title, matchType: 'title', matchText: node.title });
        addedNotes.add(node.id);
      }
    });

    db.nodes.forEach((node) => {
      if (node.level > 0 && node.title.toLowerCase().includes(lowerCaseSearchTerm)) {
        const parentNote = db.nodes.find(n => n.file === node.file && n.level === 0);
        if (parentNote && !addedNotes.has(parentNote.id)) {
          results.push({ noteId: parentNote.id, noteTitle: parentNote.title, matchType: 'subheading', matchText: node.title });
          addedNotes.add(parentNote.id);
        }
      }
    });

    db.tags.forEach((tag) => {
      if (tag.tag.toLowerCase().includes(lowerCaseSearchTerm)) {
        const parentNote = db.nodes.find(n => n.id === tag.node_id && n.level === 0);
        if (parentNote && !addedNotes.has(parentNote.id)) {
          results.push({ noteId: parentNote.id, noteTitle: parentNote.title, matchType: 'tag', matchText: tag.tag });
          addedNotes.add(parentNote.id);
        }
      }
    });

    return results;
  }, [db, searchTerm]);

  return (
    <div className="container mx-auto p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-4">Notes</h1>
      <div className="flex flex-row gap-8">
        {/* Left Column */}
        <div className="w-1/3">
          <div className="relative z-20">
            <input
              type="text"
              placeholder="Search by title, tag, or subheading..."
              className="w-full p-2 mb-4 border border-gray-300 rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            {searchTerm && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-b-md shadow-lg max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map((result) => (
                      <li 
                        key={`${result.noteId}-${result.matchText}`} 
                        className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                        onMouseEnter={() => setFocusedNodeId(result.noteId)}
                        onMouseLeave={() => setFocusedNodeId(null)}
                      >
                        <Link href={`/notes/${result.noteId}`} className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="font-semibold">{result.noteTitle}</span>
                              {result.matchType === 'subheading' && (
                                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                  → {result.matchText}
                                </span>
                              )}
                            </div>
                            {result.matchType === 'tag' && (
                              <span className="bg-gray-200 dark:bg-gray-600 text-xs font-medium px-2 py-0.5 rounded">
                                #{result.matchText}
                              </span>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-gray-500">No results found.</div>
                )}
              </div>
            )}
          </div>
          {!searchTerm && (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-16">
              <p className="text-lg">Start typing to search for notes.</p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="w-2/3 relative z-10">
          {db && (
            <NotesGraph nodes={db.nodes} links={db.links} focusedNodeId={focusedNodeId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;