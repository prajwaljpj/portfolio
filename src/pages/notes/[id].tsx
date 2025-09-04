import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { processOrgFile } from '../../utils/org-processor';

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
  links: any[];
  tags: { node_id: string; tag: string }[];
  refs: any[];
}

interface NotePageProps {
  note: NoteNode | null;
  content: string | null;
  db: RoamDB | null;
}

const NotePage = ({ note, content, db }: NotePageProps) => {
  if (!note || !content || !db) {
    return <div>Note not found.</div>;
  }

  const body = processOrgFile(content, db);

  const fileTags = db.tags.filter((tag) => tag.node_id === note.id);

  const backlinks = db.links
    .filter((link) => link.dest === note.id)
    .map((link) => db.nodes.find((n) => n.id === link.source))
    .filter((node): node is NoteNode => node !== undefined);

  return (
    <div className="container mx-auto p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-2">{note.title}</h1>
      
      {fileTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {fileTags.map(({ tag }) => (
            <span key={tag} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="prose dark:prose-invert max-w-none">{body}</div>

      {backlinks.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Backlinks</h2>
          <ul className="space-y-2">
            {backlinks.map((backlink) => (
              <li key={backlink.id} className="p-2 border rounded hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                <Link href={`/notes/${backlink.id}`} className="text-blue-500 hover:underline">
                  {backlink.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <Link href="/notes" className="text-blue-500 hover:underline">
          Back to all notes
        </Link>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? `https://${context.req.headers.host}`
      : 'http://localhost:3000';

  const dbRes = await fetch(`${baseUrl}/assets/roam_db.json`);
  const db = await dbRes.json();

  const note = db.nodes.find((n: NoteNode) => n.id === id);

  if (!note) {
    return { props: { note: null, content: null, db: null } };
  }

  try {
    const contentRes = await fetch(`${baseUrl}${note.file}`);
    if (!contentRes.ok) {
      throw new Error(`Failed to fetch note content from ${note.file}`);
    }
    const content = await contentRes.text();
    return { props: { note, content, db } };
  } catch (error) {
    console.error(error);
    return { props: { note, content: 'Could not load note content.', db } };
  }
};

export default NotePage;