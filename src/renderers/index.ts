import type Cell from "../model/cell";
import type Grid from "../model/grid";

export { ASCIIRenderer } from "./ascii-renderer";
export { SVGRenderer } from "./svg-renderer";

export type RendererProps = {
  maze: Grid;
  avatar?: Cell;
};

export type RendererFunc = (arg0: RendererProps) => JSX.Element;
