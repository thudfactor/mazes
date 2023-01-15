import Grid from "~js/model/grid";
import styled from 'styled-components';
import Cell from "~js/model/cell";

const cellSize = 10;

const StyledSVG = styled.svg`
  width: 80%;
  height: auto;
`;

type SVGRendererProps = {
  maze: Grid;
}

type SVGCellProps = {
  cell: Cell;
}

function SVGCell({cell}:SVGCellProps) {

}

function renderCells(maze: Grid): JSX.Element[] {
  const cellsList = maze.eachCell();
  const list:JSX.Element[] = [];
  for (let cell of cellsList) {
    const { row, column, neighbors } = cell;
    const { east, south } = neighbors;
    const isStart = (cell.column === maze.start.column && cell.row === maze.start.row);
    const isEnd = (cell.column === maze.end.column && cell.row === maze.end.row);
    const key=`r${row}c${column}`;
    if (isStart || isEnd) {
      list.push(
        <rect 
          key={`${key}-${(isStart) ? "start" : "end"}`}
          fill={(isStart) ? "green" : "red"} 
          x={.5 + (cellSize * column)} 
          y={.5 + (cellSize * row)} 
          width={cellSize} 
          height={cellSize} 
        />
      )
    }
    if (!east || !cell.linked(east)) {
      list.push(
        <line 
          key={`${key}-east`}
          x1={cellSize + (column * cellSize)}
          y1={row * cellSize}
          x2={cellSize + (column * cellSize)}
          y2={cellSize + (row * cellSize)}
          strokeWidth="1" 
          stroke="black" />
      )
    }
    if (!south || !cell.linked(south)) {
      list.push(
        <line 
          key={`${key}-south`}
          x1={column * cellSize}
          y1={cellSize + (row * cellSize)}
          x2={cellSize + (column * cellSize)}
          y2={cellSize + (row * cellSize)}
          strokeWidth="1" 
          stroke="black" />
      )
    }
  }
  return list;
}

export function SVGRenderer({ maze }:SVGRendererProps) {
  const { rows, columns } = maze;
  const height = rows * cellSize;
  const width = columns * cellSize;

  return (
    <>
      <p>Start at <span style={{color: "green"}}>◼︎</span> and proceed towards <span style={{color: "red"}}>◼︎</span></p>
      <StyledSVG viewBox={`0 0 ${width} ${height}`}>
        <line strokeWidth="1" stroke="black" x1={0} y1={0} x2={width} y2={0} />
        <line strokeWidth="1" stroke="black" x1={0} y1={0} x2={0} y2={height} />
        <g>
          { renderCells(maze).map(c => c) }
        </g>
      </StyledSVG>
    </>
  );
}