import Link from 'next/link';
import React from 'react';

interface RoamDB {
  nodes: any[];
}

interface RoamLinkProps {
  db: RoamDB;
  id: string;
  children?: React.ReactNode;
}

const RoamLink: React.FC<RoamLinkProps> = ({ db, id, children }) => {
  const node = db.nodes.find((n) => n.id === id);

  // If the linked note exists, render a Next.js Link
  if (node) {
    return (
      <Link href={`/notes/${id}`} className="text-blue-500 hover:underline">
        {children}
      </Link>
    );
  }

  // If the linked note does not exist, render the text in red
  return <span className="text-red-500">{children || id}</span>;
};

export default RoamLink;