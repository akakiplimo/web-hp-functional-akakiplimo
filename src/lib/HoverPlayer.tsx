import { useEffect, useState } from "react";
import { useHoveredParagraphCoordinate } from "./hook";
import { getTopLevelReadableElementsOnPage } from "./parser";
import { speechify } from "./play";

// This is a simple play button SVG that you can use in your hover player
const PlayButton = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    id="play-icon"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      cursor: "pointer",
      background: "#6B78FC",
      borderRadius: "50%",
    }}
    {...props}
  >
    <path
      d="M16.3711 11.3506C16.8711 11.6393 16.8711 12.361 16.3711 12.6497L10.3711 16.1138C9.87109 16.4024 9.24609 16.0416 9.24609 15.4642L9.24609 8.53603C9.24609 7.95868 9.87109 7.59784 10.3711 7.88651L16.3711 11.3506Z"
      fill="white"
    />
  </svg>
);

/**
 * **TBD:**
 * Implement a hover player that appears next to the paragraph when the user hovers over it
 * The hover player should contain a play button that when clicked, should play the text of the paragraph
 * This component should make use of the useHoveredParagraphCoordinate hook to get information about the hovered paragraph
 */
export default function HoverPlayer() {
  const [parsedElements, setParsedElements] = useState<HTMLElement[]>([]);
  const hoveredInfo = useHoveredParagraphCoordinate(parsedElements);

  console.log(hoveredInfo);

  useEffect(() => {
    // Parse the top-level readable elements on the page
    const elements = getTopLevelReadableElementsOnPage();
    setParsedElements(elements);
  }, []);

  if (!hoveredInfo) {
    return null; // Do not render anything if no paragraph is hovered
  }

  const { top, left, element } = hoveredInfo;

  const handlePlayClick = () => {
    // Call logic to play the text of the paragraph

    speechify(element); // Play the text of the hovered paragraph
  };

  return (
    <div
      style={{
        position: "absolute",
        top: top, // Position vertically centered to the first line
        left: left, // Position to the left of the paragraph
        transform: "translateY(-50%)", // Center the button vertically
        zIndex: 1000,
      }}
    >
      <PlayButton onClick={handlePlayClick} />
    </div>
  );
}
