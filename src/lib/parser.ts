/**
 * List of HTML tags that we want to ignore when finding the top level readable elements
 * These elements should not be chosen while rendering the hover player
 */
const IGNORE_LIST = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "BUTTON",
  "LABEL",
  "SPAN",
  "IMG",
  "PRE",
  "SCRIPT",
];

/**
 *  **TBD:**
 *  Implement a function that returns all the top level readable elements on the page, keeping in mind the ignore list.
 *  Start Parsing inside the body element of the HTMLPage.
 *  A top level readable element is defined as follows:
 *      1. The text node contained in the element should not be empty
 *      2. The element should not be in the ignore list (also referred as the block list)
 *      3. The element should not be a child of another element that has only one child.
 *            For example: <div><blockquote>Some text here</blockquote></div>. div is the top level readable element and not blockquote
 *      4. A top level readable element should not contain another top level readable element.
 *            For example: Consider the following HTML document:
 *            <body>
 *              <div id="root"></div>
 *              <div id="content-1">
 *                <article>
 *                  <header>
 *                    <h1 id="title">An Interesting HTML Document</h1>
 *                    <span>
 *                      <address id="test">John Doe</address>
 *                    </span>
 *                  </header>
 *                  <section></section>
 *                </article>
 *              </div>
 *            </body>;
 *            In this case, #content-1 should not be considered as a top level readable element.
 */

// recursively collect elements that meet the criteria
function collectTopLevel(elements: HTMLCollection, result: HTMLElement[]) {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i] as HTMLElement;
    // Check if the element is an HTML element
    // and not a text node or comment node
    // nodeType 1 is for ELEMENT_NODE
    if (element.nodeType === Node.ELEMENT_NODE) {
      // Put tag name in caps to ensure it will match with the ignore list
      const nodeName = element.nodeName;

      // continue to next element if element is in ignore list
      if (IGNORE_LIST.includes(nodeName)) continue;

      // check if the element has text content and is not empty
      const hasTextContent =
        element.textContent && element.textContent.trim() !== "";

      // skip ignored elements or elements without text content
      if (!hasTextContent) continue;

      // check if element contains other top-level readable elements
      const childElements = Array.from(element.children);
      // if all child elements are in the ignore list, skip the element @TODO

      const allChildrenIgnored = childElements.every((child) => {
        const childNodeName = child.nodeName;
        return IGNORE_LIST.includes(childNodeName);
      });

      if (allChildrenIgnored && element.children.length > 0) continue;

      const hasOtherTopLevelElements = childElements.some((child) => {
        const childNodeName = child.nodeName;
        console.log("child", childNodeName);
        const childIsIgnored = IGNORE_LIST.includes(childNodeName);
        const childHasTextContent =
          child.textContent && child.textContent.trim() !== "";
        const childHasMultipleChildren = child.children.length > 1;

        return (
          !childIsIgnored && childHasTextContent && childHasMultipleChildren
        );
      });

      // add the element to the result if it does not contain other top-level readable elements
      if (hasOtherTopLevelElements) {
        // recursively process child elements
        collectTopLevel(element.children, result);
      } else {
        result.push(element);
      }
    }
  }
}

export function getTopLevelReadableElementsOnPage(): HTMLElement[] {
  const body = document.body;
  const result: HTMLElement[] = [];
  collectTopLevel(body.children, result);

  return result;
}
