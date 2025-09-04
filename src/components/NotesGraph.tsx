import React, { useRef, useEffect, useMemo, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useRouter } from 'next/router';
import * as d3 from 'd3';
import { forceCluster } from 'd3-force-cluster';

interface NoteNode {
  id: string;
  title: string;
}

interface Link {
  source: string;
  dest: string;
  pos: number;
}

interface NotesGraphProps {
  nodes: NoteNode[];
  links: Link[];
  focusedNodeId?: string | null;
}

const NotesGraph: React.FC<NotesGraphProps> = ({ nodes, links, focusedNodeId }) => {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const { graphData, neighbors } = useMemo(() => {
    const nodeIds = new Set(nodes.map(n => n.id));
    const filteredLinks = links.filter(l => nodeIds.has(l.source) && nodeIds.has(l.dest));

    const nodesWithDegree = nodes.map(node => ({
      ...node,
      degree: filteredLinks.filter(l => l.source === node.id || l.dest === node.id).length
    }));
    
    const localNeighbors = new Map<string, Set<string>>();
    filteredLinks.forEach(link => {
        if (!localNeighbors.has(link.source)) localNeighbors.set(link.source, new Set());
        if (!localNeighbors.has(link.dest)) localNeighbors.set(link.dest, new Set());
        localNeighbors.get(link.source)?.add(link.dest);
        localNeighbors.get(link.dest)?.add(link.source);
    });

    return {
      graphData: {
        nodes: nodesWithDegree.map(node => ({ id: node.id, name: node.title, val: node.degree * 2.5 + 6 })),
        links: filteredLinks.map(link => ({ source: link.source, target: link.dest, id: `${link.source}-${link.dest}-${link.pos}` })),
      },
      neighbors: localNeighbors
    };
  }, [nodes, links]);

  const handleNodeClick = (node: any) => {
    router.push(`/notes/${node.id}`);
  };

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge').strength(-800);
      fgRef.current.d3Force('link').strength(0.08).distance(150);
      fgRef.current.d3Force('cluster', (forceCluster as any)().strength(0.05));
    }
  }, [fgRef, graphData]);

  useEffect(() => {
    if (fgRef.current) {
      if (focusedNodeId) {
        const node = graphData.nodes.find(n => n.id === focusedNodeId);
        if (node) {
          const neighborIds = neighbors.get(focusedNodeId) || new Set();
          const nodesToFocus = [node, ...Array.from(neighborIds).map(id => graphData.nodes.find(n => n.id === id)).filter(Boolean)];
          
          if (nodesToFocus.length > 0) {
            const bbox = {
              x1: Math.min(...nodesToFocus.map((n: any) => n.x || 0)),
              y1: Math.min(...nodesToFocus.map((n: any) => n.y || 0)),
              x2: Math.max(...nodesToFocus.map((n: any) => n.x || 0)),
              y2: Math.max(...nodesToFocus.map((n: any) => n.y || 0)),
            };

            const width = dimensions.width;
            const height = dimensions.height;
            const scale = 0.8 / Math.max((bbox.x2 - bbox.x1) / width, (bbox.y2 - bbox.y1) / height);
            const x = (bbox.x1 + bbox.x2) / 2;
            const y = (bbox.y1 + bbox.y2) / 2;

            fgRef.current.centerAt(x, y, 1000);
            fgRef.current.zoom(scale, 1000);
          }
        }
      } else {
        fgRef.current.zoomToFit(400, 50);
      }
    }
  }, [focusedNodeId, graphData, neighbors, fgRef, dimensions]);

  return (
    <div ref={containerRef} className="border rounded-lg overflow-hidden dark:border-gray-700 flex justify-center h-[600px] w-full">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeVal="val"
        onNodeClick={handleNodeClick}
        cooldownTicks={200}
        onEngineStop={() => {
          if (focusedNodeId) {
            const node = graphData.nodes.find(n => n.id === focusedNodeId);
            if (node) {
              const neighborIds = neighbors.get(focusedNodeId) || new Set();
              const nodesToFocus = [node, ...Array.from(neighborIds).map(id => graphData.nodes.find(n => n.id === id)).filter(Boolean)];
              
              if (nodesToFocus.length > 0) {
                const bbox = {
                  x1: Math.min(...nodesToFocus.map((n: any) => n.x || 0)),
                  y1: Math.min(...nodesToFocus.map((n: any) => n.y || 0)),
                  x2: Math.max(...nodesToFocus.map((n: any) => n.x || 0)),
                  y2: Math.max(...nodesToFocus.map((n: any) => n.y || 0)),
                };
    
                const width = dimensions.width;
                const height = dimensions.height;
                const scale = 0.8 / Math.max((bbox.x2 - bbox.x1) / width, (bbox.y2 - bbox.y1) / height);
                const x = (bbox.x1 + bbox.x2) / 2;
                const y = (bbox.y1 + bbox.y2) / 2;
    
                fgRef.current.centerAt(x, y, 0);
                fgRef.current.zoom(scale, 0);
              }
            }
          } else {
            fgRef.current.zoomToFit(400, 50);
          }
        }}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkWidth={link => (focusedNodeId && (link.source.id === focusedNodeId || link.target.id === focusedNodeId)) ? 2 : 1}
        linkColor={link => (focusedNodeId && (link.source.id === focusedNodeId || link.target.id === focusedNodeId)) ? 'red' : '#999999'}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          
          const isDarkMode = document.documentElement.classList.contains('dark');
          let nodeColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(31, 41, 55, 0.8)';
          let textColor = isDarkMode ? '#fff' : '#333';

          if (focusedNodeId) {
            if (node.id === focusedNodeId) {
              nodeColor = 'red';
            } else if (!neighbors.get(focusedNodeId)?.has(node.id as string)) {
              nodeColor = 'rgba(100, 100, 100, 0.1)';
              textColor = 'rgba(150, 150, 150, 0.2)';
            }
          }

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
          ctx.fillStyle = nodeColor;
          ctx.fill();

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = textColor;
          ctx.fillText(label, node.x, node.y + node.val + fontSize);
        }}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
};

export default NotesGraph;