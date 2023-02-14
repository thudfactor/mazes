import { createSlice } from '@reduxjs/toolkit';
import { ASCIIRenderer } from '../renderers/ascii-renderer';
import { SVGRenderer } from '../renderers/svg-renderer';
import AldousBroder from '../strategies/aldous-broder';
import BinaryTree from '../strategies/binary-tree';
import Sidewinder from '../strategies/sidewinder';
import Wilsons from '../strategies/wilsons';

export enum Renderer {
  ASCII,
  SVG
}

export enum Strategy {
  AldousBroder,
  BinaryTree,
  Sidewinder,
  Wilsons
}

const optionsSlice = createSlice({
  name: 'options',
  initialState: {
    size: 20,
    strategy: Strategy.Wilsons,
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
    setSize(state, action) {
      state.size = action.payload;
    },
    setRenderer(state, action ) {
      state.renderer = action.payload;
    },
    setStrategy(state, action) {
      state.strategy = action.payload;
    }
  }
});

export const {
  toggleShowSolution,
  toggleShowDistance,
  setSize,
  setRenderer,
  setStrategy
} = optionsSlice.actions;

export const selectSize = (state: any): number => state.options.size;

export const selectShowDistance = (state: any): boolean => state.options.showDistance;

export const selectShowSolution = (state: any): boolean => state.options.showSolution;

export const selectStrategy = (state: any): Function => {
  switch (state.options.strategy) {
    case Strategy.AldousBroder:
      return AldousBroder.on;
    case Strategy.BinaryTree:
      return BinaryTree.on;
    case Strategy.Sidewinder:
      return Sidewinder.on;
    case Strategy.Wilsons:
      return Wilsons.on;
    default:
      return AldousBroder;
  }
}

export const selectRenderer = (state: any): Function => {
  switch (state.options.renderer) {
    case Renderer.ASCII:
      return ASCIIRenderer;
    case Renderer.SVG:
      return SVGRenderer;
    default:
      return ASCIIRenderer;
  }
}

export default optionsSlice.reducer;
