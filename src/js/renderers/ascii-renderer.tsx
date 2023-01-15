import Grid from "../model/grid";
import styled from 'styled-components';

const StyledRenderer = styled.div`
  width: max-content;
  margin: 1rem auto;
  font-family: monospace;
  white-space: pre;
  line-height: 1;
  letter-spacing: -.05em;
`;

type AsciiRendererProps = {
  maze: Grid;
}

export function AsciiRenderer({ maze }:AsciiRendererProps) {
  return (
    <>
      <p>Start at ✬ and proceed towards ⦿</p>
      <StyledRenderer className="ascii-renderer">{ maze.toString() }</StyledRenderer>
    </>
  );
}