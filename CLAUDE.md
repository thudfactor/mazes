# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive maze generation and solving application built with React, TypeScript, and Redux. Users can generate mazes using different algorithms, visualize them, and navigate through them using WASD keys.

## Development Commands

- `npm start` - Start development server (React)
- `npm test` - Run tests in watch mode
- `npm run test-coverage` - Run tests with coverage report (no watch)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint on src directory

### Testing Individual Files
```bash
npm test -- path/to/test-file.test.ts
```

## Architecture

### Core Model (src/model/)
- **Grid**: The maze grid structure containing cells, handles pathfinding and solution generation
  - Uses generator iterators (`eachCell()`, `eachRow()`) for efficient traversal
  - `longestPath()` finds the longest path in a maze and sets it as start/end
  - `pathFrom(start, goal)` calculates shortest path using distances
- **Cell**: Individual maze cell with linking system for creating passages
  - Cells link bidirectionally to create passages between them
  - `linked(cell)` checks if passage exists
  - `distances()` uses Dijkstra-like algorithm to calculate distances from this cell
- **Distances**: Distance calculation and pathfinding helper

### Maze Generation Strategies (src/strategies/)
All strategies are generator functions that yield Grid at each step:
- `aldousBroder`: Random walk algorithm
- `binaryTree`: Simple binary tree carving
- `huntKill`: Hunts for unvisited cells
- `recursiveBacktracker`: Depth-first with backtracking (default)
- `sidewinder`: Row-based algorithm
- `wilsons`: Loop-erased random walk

Add new strategies by:
1. Creating generator function in `src/strategies/[name].ts`
2. Export from `src/strategies/index.tsx`
3. Add enum entry to `MazeStrategy` in `src/store/options-slice.ts`
4. Add to `mazeMatcher` object in same file

### Rendering (src/renderers/)
- **ASCIIRenderer**: Text-based maze representation
- **SVGRenderer**: Visual SVG rendering with avatar

Both implement `RendererFunc` interface accepting `{ maze, avatar }` props.

### State Management (src/store/)
Redux Toolkit slice (`options-slice.ts`) manages:
- Maze size (grid dimensions)
- Generation strategy selection
- Renderer selection (ASCII vs SVG)
- Solution and distance visualization toggles

### Navigation
App component handles keyboard input (WASD) to navigate avatar through the maze. Avatar can only move to linked (connected) cells. Win condition triggers when avatar reaches `maze.end`.

## Key Patterns

- **Cell Linking**: Bidirectional links between cells create passages. The linking system is the core of maze generation.
- **Generator Functions**: Maze strategies use generators to enable step-by-step visualization if needed
- **Distance Caching**: Cell distance calculations are cached and invalidated when links change
- **Longest Path as Challenge**: Generated mazes automatically find and set the longest path as start/end points for maximum difficulty
