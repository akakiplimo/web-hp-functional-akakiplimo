import "./main.css";

import HoverPlayer from "./lib/HoverPlayer";
import { getTopLevelReadableElementsOnPage } from "./lib/parser";

export function Main() {
  getTopLevelReadableElementsOnPage();
  return <HoverPlayer />;
}
