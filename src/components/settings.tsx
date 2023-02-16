import { useDispatch, useSelector } from 'react-redux';
import { ASCIIRenderer } from '../renderers/ascii-renderer';
import { SVGRenderer } from '../renderers/svg-renderer';
import {
  Renderer, selectRenderer, selectShowDistance,
  selectShowSolution,
  selectSize, selectStrategy, setRenderer, setSize, setStrategy, Strategy, toggleShowDistance,
  toggleShowSolution
} from '../store/options-slice';
import AldousBroder from '../strategies/aldous-broder';
import BinaryTree from '../strategies/binary-tree';
import HuntKill from '../strategies/hunt-kill';
import Sidewinder from '../strategies/sidewinder';
import Wilsons from '../strategies/wilsons';

export const Settings = () => {
  const dispatch = useDispatch();
  const RenderElement = useSelector(selectRenderer);
  const builder = useSelector(selectStrategy);
  const showDistance = useSelector(selectShowDistance) as boolean;
  const showSolution = useSelector(selectShowSolution) as boolean;
  const size = useSelector(selectSize) as number;

  return (
    <form onSubmit={(e) => e.preventDefault()}>
    <fieldset>
      <legend>Renderer</legend>
      <label><input
        onChange={() => dispatch(setRenderer(Renderer.SVG))}
        checked={RenderElement === SVGRenderer}
        type="radio"
        name="renderer"
        value="svg" /> SVG</label><br/>
      <label><input
        onChange={() => dispatch(setRenderer(Renderer.ASCII))}
        checked={RenderElement === ASCIIRenderer}
        type="radio"
        name="renderer"
        value="ascii" /> ASCII</label>
    </fieldset>
    <fieldset>
      <legend>Spoilers</legend>
      <label><input
        onChange={() => dispatch(toggleShowSolution())}
        checked={showSolution || false}
        disabled={RenderElement === ASCIIRenderer}
        type="checkbox"
        name="show-solution"
        value="show-solution"
      /> Show Solution</label><br />
      <label><input
        onChange={() => dispatch(toggleShowDistance())}
        checked={showDistance || false}
        type="checkbox"
        name="show-distance"
        value="show-distance"
      /> Show Distance</label>
    </fieldset>
    <fieldset>
      <legend>Build Strategy</legend>
      <p>Changing this will reset the maze.</p>
      <label><input
        onChange={() => dispatch(setStrategy(Strategy.HuntKill))}
        checked={builder === HuntKill.on}
        type="radio"
        name="builder"
        value="huntkill" /> Hunt and Kill</label><br/>
      <label><input
        onChange={() => dispatch(setStrategy(Strategy.Wilsons))}
        checked={builder === Wilsons.on}
        type="radio"
        name="builder"
        value="wilsons" /> Wilsons</label><br/>
      <label><input
        onChange={() => dispatch(setStrategy(Strategy.AldousBroder))}
        checked={builder === AldousBroder.on}
        type="radio"
        name="builder"
        value="aldous" /> Aldous-Broder</label><br/>
      <label><input
        onChange={() => dispatch(setStrategy(Strategy.Sidewinder))}
        checked={builder === Sidewinder.on}
        type="radio"
        name="builder"
        value="sidewinder" /> Sidewinder</label><br/>
      <label><input
        onChange={() => dispatch(setStrategy(Strategy.BinaryTree))}
        checked={builder === BinaryTree.on}
        type="radio"
        name="builder"
        value="binarytree" /> Binary Tree</label>
    </fieldset>
    <fieldset>
      <legend>Maze Attributes</legend>
      <p>Changing this will reset the maze.</p>
      <label><input
        type="range"
        value={size}
        onChange={(e) => dispatch(setSize(parseInt(e.target.value)))}
        min={5}
        max={50}
        step={5} /> Size ({size})</label>
    </fieldset>
    </form>
  )
}
