import { useSelector } from "react-redux";
import styled, { CSSProperties } from "styled-components";
import type { RendererProps } from ".";
import Cell from "../model/cell";
import Distances from "../model/distances";
import { selectShowDistance } from "../store/options-slice";

const StyledRenderer = styled.div`
  width: max-content;
  margin: 1rem auto;
  font-family: monospace;
  white-space: pre;
  line-height: 1;
  letter-spacing: -0.05em;
  background-color: white;
  font-size: 0.625em;
`;

export function ASCIIRenderer({ maze, avatar }: RendererProps) {
  const showDistance = useSelector(selectShowDistance);

  let distances: Distances | null = null;
  if (maze.start) {
    distances = maze.start.distances();
  }

  function contentOf(cell: Cell): string {
    if (cell.equals(maze.start)) return "✬";
    if (cell.equals(maze.end)) return "⦿";
    if (avatar && cell.equals(avatar)) return "@";
    const thisDistance = distances?.at(cell);
    if (showDistance && thisDistance) {
      return `${thisDistance < 36 ? thisDistance.toString(36) : " "}`;
    }
    return " ";
  }

  function renderMaze() {
    let output = `+${"---+".repeat(maze.columns)}\n`;
    const rowGen = maze.eachRow();
    for (const row of rowGen) {
      let top = "|";
      let bottom = "+";

      row.forEach((cell) => {
        const { east, south } = cell.neighbors;
        const marker = contentOf(cell);

        const body = ` ${marker} `;
        const east_boundary = east && cell.linked(east) ? " " : "|";
        top += body + east_boundary;
        const south_boundary = south && cell.linked(south) ? "   " : "---";
        bottom += south_boundary + "+";
      });

      output += `${top}\n${bottom}\n`;
    }
    return output;
  }

  const customProperties = {
    "--rows": maze.rows,
    "--columns": maze.columns,
  } as CSSProperties;

  return (
    <>
      <p>Start at ✬ and proceed towards ⦿</p>
      <StyledRenderer style={customProperties}>{renderMaze()}</StyledRenderer>
    </>
  );
}
