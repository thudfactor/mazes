import styled from "styled-components";

const Wrapper = styled.div`
  button {
    display: inline-block;
    font-size: 2rem;
    margin: 0.5rem;
  }
`;

type NavigatorProps = {
  navigate: (direction: string) => void;
};

export const Navigator = ({ navigate }: NavigatorProps) => {
  return (
    <Wrapper>
      <legend>Navigate</legend>
      <p>Or use WASD keys to move</p>
      <button onClick={() => navigate("north")}>↑</button>
      <br />
      <button onClick={() => navigate("west")}>←</button> <button onClick={() => navigate("east")}>→</button>
      <br />
      <button onClick={() => navigate("south")}>↓</button>
    </Wrapper>
  );
};
