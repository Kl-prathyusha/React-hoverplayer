import { useEffect, useState } from 'react';

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
  element: HTMLElement
): boolean {
  const rect = element.getBoundingClientRect();
  const x = coordinate.x;
  const y = coordinate.y;

  return (
    x >= rect.left + window.scrollX &&
    x <= rect.right + window.scrollX &&
    y >= rect.top + window.scrollY &&
    y <= rect.bottom + window.scrollY
  );
}

/**
 * **TBD:** Implement a function that returns the height of the first line of text in an element
 * We will later use this to size the HTML element that contains the hover player
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
  const temp = document.createElement("span");
  temp.innerText = "Test Line";
  temp.style.visibility = "hidden";
  temp.style.position = "absolute";

  // Inherit text styling
  const style = window.getComputedStyle(element);
  temp.style.fontSize = style.fontSize;
  temp.style.fontFamily = style.fontFamily;
  temp.style.lineHeight = style.lineHeight;

  element.appendChild(temp);
  const height = temp.getBoundingClientRect().height;
  element.removeChild(temp);

  return Math.round(height);
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

export function useHoveredParagraphCoordinate(parsedElements: HTMLElement[]): HoveredElementInfo | null {
  const [hovered, setHovered] = useState<HoveredElementInfo | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const point = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;

      for (const el of parsedElements) {
        if (el.contains(point)) {
          const bounds = getElementBounds(el);
          const height = getLineHeightOfFirstLine(el);

          setHovered({
            element: el,
            top: bounds.top,
            left: bounds.left,
            heightOfFirstLine: height
          });
          return;
        }
      }

      setHovered(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [parsedElements]);

  return hovered;
}
