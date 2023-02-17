import styled from "styled-components";

export const StyledMaze = styled.div`
  padding: 1rem;
  text-align: center;
  background-color: #ccc;
  display: grid;
  place-content: center;
  overflow: auto;

  svg {
    margin: auto;
    height: 80vmin;
    width: 80vmin;
  }
`;

export const StyledControls = styled.div`
  padding: 1rem;
  display: grid;
  place-content: center;
  text-align: center;

  fieldset {
    text-align: left;
  }
`

export const StyledMeta = styled.div`
  padding: 1rem;
  display: grid;
  place-content: center;
  text-align: center;
`;

export const StyledLayout = styled.div`
  position: absolute;
  inset: 0;
  background-color: white;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;

  ${StyledMaze} {
    grid-column: 1/3;
    grid-row: 1/3;
  }

  ${StyledControls} {
    grid-column: 3/4;
    grid-row: 1/2;
  }

  ${StyledMeta} {
    grid-column: 3/4;
    grid-row: 2/3;
  }
`


