import React, { useEffect, useState, ComponentType, useCallback, useMemo, Fragment } from 'react';
import { Orga } from '@orgajs/react';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';

// Helper function to remove extra quotes from a string
const cleanString = (s: string | null) => (s ? s.replace(/^"|"$/g, '') : '');

// Simple regex to remove the properties drawer from the content string
const removePropertiesDrawer = (content: string): string => {
  return content.replace(/:PROPERTIES:[\s\S]*?:END:/, '').trim();
};

const NotesGraph = () => {
  const [ForceGraph, setForceGraph] = useState<ComponentType<any> | null>(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [status, setStatus] = useState('Loading components...');

  useEffect(() => {
    import('aframe').then(() => {
      import('react-force-graph').then(module => {
        setForceGraph(() => module.ForceGraph2D);
      });
    });

    fetch('/assets/roam_db.json')
      .then(res => res.json())
      .then(dbData => {
        const { nodes: antdNodes, links: antdLinks } = dbData;
        
        const nodes = antdNodes.map(node => ({
          id: cleanString(node.file),
          title: cleanString(node.title),
          content: node.content || 'No content found.',
          dbId: cleanString(node.id)
        }));

        const idToFileMap = nodes.reduce((acc, node) => {
          acc[node.dbId] = node.id;
          return acc;
        }, {});

        const links = antdLinks
          .filter(link => cleanString(link.type) === 'id')
          .map(link => ({
            source: idToFileMap[cleanString(link.source)],
            target: idToFileMap[cleanString(link.dest)],
          }))
          .filter(link => link.source && link.target);

        setGraphData({ nodes, links });
        setStatus('Ready');
      });
  }, []);

  const handleNodeClick = useCallback(node => {
    setSelectedNode(node);
  }, []);

  const drawNode = useCallback((node, ctx, globalScale) => {
    const label = node.title;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    
    ctx.beginPath();
    ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = node === selectedNode ? 'orange' : 'lightblue';
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(label, node.x, node.y + 10);
  }, [selectedNode]);

  const renderedContent = useMemo(() => {
    if (!selectedNode) return null;

    const components = {
      a: ({ href, children }) => {
        const isOrgLink = href.startsWith('id:');
        if (isOrgLink) {
          const id = href.substring(3);
          const targetNode = graphData.nodes.find(n => n.dbId === id);
          if (targetNode) {
            return <a href="#" onClick={(e) => {
              e.preventDefault();
              setSelectedNode(targetNode);
            }}>{children}</a>;
          }
        }
        return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
      }
    };
    
    const contentWithoutProps = removePropertiesDrawer(selectedNode.content);

    return <Orga components={components}>{contentWithoutProps}</Orga>;
  }, [selectedNode, graphData.nodes]);

  if (status !== 'Ready') {
    return <div style={{ padding: '20px' }}>{status}</div>;
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        {!ForceGraph ? (
          <div>Loading graph component...</div>
        ) : (
          <ForceGraph
            graphData={graphData}
            nodeLabel="title"
            nodeCanvasObject={drawNode}
            onNodeClick={handleNodeClick}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.25}
          />
        )}
      </div>
      {selectedNode && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '350px',
          maxHeight: 'calc(100vh - 20px)',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '15px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          overflowY: 'auto',
          zIndex: 1000
        }}>
          <button
            onClick={() => setSelectedNode(null)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              border: 'none',
              background: 'transparent',
              fontSize: '1.5em',
              cursor: 'pointer'
            }}
          >
            &times;
          </button>
          <h2 style={{ marginTop: 0, marginBottom: '10px' }}>{selectedNode.title}</h2>
          <div className="org-content">
            {renderedContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesGraph;