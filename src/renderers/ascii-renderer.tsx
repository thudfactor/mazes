import styled, { CSSProperties } from 'styled-components';
import Cell from "../model/cell";
import Grid from "../model/grid";
import Distances from '../model/distances';

const StyledRenderer = styled.div`
  width: max-content;
  margin: 1rem auto;
  font-family: monospace;
  white-space: pre;
  line-height: 1;
  letter-spacing: -.05em;
  background-color: white;
  font-size: 0.625em;
`;

type AsciiRendererProps = {
  maze: Grid;
  avatar?: Cell;
  showDistance: Boolean
}

export function ASCIIRenderer({ maze, avatar, showDistance = false }:AsciiRendererProps) {
  let distances: Distances | null = null;
  if(maze.start) {
    distances = maze.start.distances();
  }

  function contentOf(cell: Cell):string {
    if (cell.equals(maze.start)) return '✬';
    if (cell.equals(maze.end)) return '⦿';
    if (avatar && cell.equals(avatar)) return '@';
    const thisDistance = distances?.at(cell);
    if (showDistance && thisDistance) {
      return `${(thisDistance < 36) ? thisDistance.toString(36) : ' '}`;
    }
    return ' ';
  }

  function renderMaze() {
    let output = `+${"---+".repeat(maze.columns)}\n`;
    const rowGen = maze.eachRow();
    for (let row of rowGen) {
      let top = "|";
      let bottom = "+";
      
      row.forEach(cell => {
        const { east, south } = cell.neighbors;
        let marker = contentOf(cell);


        const body = ` ${marker} `;
        const east_boundary = (east && cell.linked(east)) ? ' ' : '|';
        top += body + east_boundary;
        const south_boundary = (south && cell.linked(south)) ? '   ' : '---';
        bottom += south_boundary + '+';
      });

      output += `${top}\n${bottom}\n`;
    }
    return output;
  }

  const customProperties = {
    '--rows': maze.rows,
    '--columns': maze.columns
  } as CSSProperties;

  return (
    <>
      <p>Start at ✬ and proceed towards ⦿</p>
      <StyledRenderer style={customProperties} >{ renderMaze() }</StyledRenderer>
    </>
  );
}
