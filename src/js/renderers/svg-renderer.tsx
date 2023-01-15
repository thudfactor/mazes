import Grid from "~js/model/grid";
import Cell from "~js/model/cell";
import { Avatar } from "../characters/avatar";
import styled from 'styled-components';

const cellSize = 10;

const StyledSVG = styled.svg`
  width: 80%;
  height: auto;
`;

type SVGRendererProps = {
  maze: Grid;
  avatar?: Cell; 
}

function renderLandmarks(maze: Grid) {
  const { start, end } = maze;
  return (
    <g className="landmarks">
      <circle 
        fill="green"
        cx={(start.column * cellSize) + (cellSize / 2)}
        cy={(start.row * cellSize) + (cellSize / 2)}
        r={(cellSize / 2) - (cellSize * .1)}
      />
      <rect 
        fill="red"
        x={(end.column * cellSize)}
        y={(end.row * cellSize)}
        width={cellSize - .2}
        height={cellSize - .2}
      />
    </g>
  );
}

function renderWalls(maze: Grid): JSX.Element {
  const cellsList = maze.eachCell();
  let pathdata:string[] = [];
  for (let cell of cellsList) {
    const { row, column, neighbors } = cell;
    const { east, south } = neighbors;
    const eastBoundary = (!east || !cell.linked(east));
    const southBoundary = (!south || !cell.linked(south));
    
    let thisSegment = '';
    if (eastBoundary && southBoundary) {
      thisSegment = `M${column * cellSize},${((row + 1) * cellSize)}h${cellSize}v${-cellSize}`;
    } else if (southBoundary) {
      thisSegment = `M${column * cellSize},${((row + 1) * cellSize)}h${cellSize}`;
    } else if (eastBoundary) {
      thisSegment = `M${(column + 1) * cellSize},${row * cellSize}v${cellSize}`;
    }
    pathdata.push(thisSegment);
  }

  return (
    <g className="walls">
      <path stroke="black" fill="none" strokeWidth="1" d={pathdata.join(' ')} />
    </g>
  );
}

export function SVGRenderer({ maze, avatar }:SVGRendererProps) {
  const { rows, columns } = maze;
  const height = rows * cellSize;
  const width = columns * cellSize;

  return (
    <>
      <p>Start at <span style={{color: "green"}}>◼︎</span> and proceed towards <span style={{color: "red"}}>◼︎</span></p>
      <StyledSVG viewBox={`-.5 -.5 ${width + 1} ${height + 1}`}>
        <line strokeWidth="1" stroke="black" x1={0} y1={0} x2={width} y2={0} />
        <line strokeWidth="1" stroke="black" x1={0} y1={0} x2={0} y2={height} />
        { renderLandmarks(maze) }
        { renderWalls(maze) }
        { avatar && <Avatar x={avatar.column * cellSize} y={avatar.row * cellSize} size={cellSize} /> }
      </StyledSVG>
    </>
  );
}