import Grid from "../model/grid";
import styled from 'styled-components';
import Cell from "~js/model/cell";

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
}

export function ASCIIRenderer({ maze, avatar }:AsciiRendererProps) {

  function renderMaze() {
    let output = `+${"---+".repeat(maze.columns)}\n`;
    const rowGen = maze.eachRow();
    for (let row of rowGen) {
      let top = "|";
      let bottom = "+";
      
      row.forEach(cell => {
        const { east, south } = cell.neighbors;
        const isStart = cell.column === maze.start.column && cell.row === maze.start.row;
        const isEnd = cell.column === maze.end.column && cell.row == maze.end.row;
        const isAvatar = avatar && cell.column === avatar.column && cell.row == avatar.row;
        let marker = ' ';
        if (isStart) marker = '✬';
        if (isEnd) marker = '⦿';
        if (isAvatar) marker = '@';

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

  return (
    <>
      <p>Start at ✬ and proceed towards ⦿</p>
      <StyledRenderer style={{"--rows": maze.rows, "--columns": maze.columns}} >{ renderMaze() }</StyledRenderer>
    </>
  );
}