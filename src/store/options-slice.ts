import { createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import { ASCIIRenderer } from "../renderers/ascii-renderer";
import { SVGRenderer } from "../renderers/svg-renderer";
import * as Mazes from "../strategies";

export enum Renderer {
  ASCII = "ascii",
  SVG = "svg",
}

export enum MazeStrategy {
  aldousBroder = "aldousBroder",
  binaryTree = "binaryTree",
  huntKill = "huntKill",
  sidewinder = "sidewinder",
  wilsons = "wilsons",
}

const mazeMatcher = {
  aldousBroder: Mazes.aldousBroder,
  binaryTree: Mazes.binaryTree,
  huntKill: Mazes.huntKill,
  sidewinder: Mazes.sidewinder,
  wilsons: Mazes.wilsons,
};

const rendererMatcher = {
  ascii: ASCIIRenderer,
  svg: SVGRenderer,
};

const optionsSlice = createSlice({
  name: "options",
  initialState: {
    size: 20,
    strategy: MazeStrategy.huntKill,
    renderer: Renderer.SVG,
    showSolution: false,
    showDistance: false,
  },
  reducers: {
    toggleShowSolution(state) {
      state.showSolution = !state.showSolution;
    },
    toggleShowDistance(state) {
      state.showDistance = !state.showDistance;
    },
    setSize(state, action: { type: string; payload: number }) {
      state.size = action.payload;
    },
    setRenderer(state, action: { type: string; payload: Renderer }) {
      state.renderer = action.payload;
    },
    setStrategy(state, action: { type: string; payload: MazeStrategy }) {
      state.strategy = action.payload;
    },
  },
});

export const { toggleShowSolution, toggleShowDistance, setSize, setRenderer, setStrategy } = optionsSlice.actions;

export const selectSize = (state: RootState): number => state.options.size;
export const selectShowDistance = (state: RootState): boolean => state.options.showDistance;
export const selectShowSolution = (state: RootState): boolean => state.options.showSolution;
export const selectStrategy = (state: RootState): Mazes.MazeFunction => mazeMatcher[state.options.strategy];
export const selectRenderer = (state: RootState): Function => rendererMatcher[state.options.renderer];

export default optionsSlice.reducer;
