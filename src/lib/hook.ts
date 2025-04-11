import { useEffect, useState } from "react";

/**
 * Gets bounding boxes for an element. This is implemented for you
 */
export function getElementBounds(elem: HTMLElement) {
  const bounds = elem.getBoundingClientRect();
  const top = bounds.top + window.scrollY;
  const left = bounds.left + window.scrollX;

  return {
    x: left,
    y: top,
    top,
    left,
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * **TBD:** Implement a function that checks if a point is inside an element
 */
export function isPointInsideElement(
  coordinate: { x: number; y: number },
  element: HTMLElement,
): boolean {
  const bounds = element.getBoundingClientRect();
  const { x, y } = coordinate;
  return (
    x >= bounds.left &&
    x <= bounds.right &&
    y >= bounds.top &&
    y <= bounds.bottom
  );
}

/**
 * **TBD:** Implement a function that returns the height of the first line of text in an element
 * We will later use this to size the HTML element that contains the hover player
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
  const computedStyle = window.getComputedStyle(element);
  const fontSize = parseFloat(computedStyle.fontSize);
  const lineHeight = parseFloat(computedStyle.lineHeight);

  // If line-height is set in px, use it. Otherwise, calculate it based on font-size.
  const heightOfFirstLine =
    lineHeight === fontSize ? fontSize : lineHeight * fontSize;

  return heightOfFirstLine;
}

export type HoveredElementInfo = {
  element: HTMLElement;
  top: number;
  left: number;
  heightOfFirstLine: number;
};

/**
 * **TBD:** Implement a React hook to be used to help to render hover player
 * Return the absolute coordinates on where to render the hover player
 * Returns null when there is no active hovered paragraph
 * Note: If using global event listeners, attach them window instead of document to ensure tests pass
 */
export function useHoveredParagraphCoordinate(
  parsedElements: HTMLElement[],
): HoveredElementInfo | null {
  const [hoveredInfo, setHoveredInfo] = useState<HoveredElementInfo | null>(
    null,
  );

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      const { clientX, clientY } = event;

      // find the element under the mouse pointer
      const hoveredElement = parsedElements.find((element) =>
        isPointInsideElement({ x: clientX, y: clientY }, element),
      );

      // if hovered element is found do something and set it to state, else, set null
      if (hoveredElement) {
        const bounds = getElementBounds(hoveredElement);
        const heightOfFirstLine = getLineHeightOfFirstLine(hoveredElement);
        setHoveredInfo({
          element: hoveredElement,
          top: bounds.top,
          left: bounds.left,
          heightOfFirstLine,
        });
      } else {
        setHoveredInfo(null);
      }
    }

    // attach event listener to window
    window.addEventListener("mousemove", handleMouseMove);

    // clean up the event listener on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [parsedElements]);

  return hoveredInfo;
}
