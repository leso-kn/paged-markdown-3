/*
 *  Paged Markdown 3
 *  Lesosoftware 2022
 */

function findAncestorWithClass(element: Element, className: string)
{
    let ancestor = element.parentNode as Element;
    if (!ancestor) return null;

    if (ancestor.classList && ancestor.classList.contains(className))
    { return ancestor; }
    else
    { return findAncestorWithClass(ancestor, className); }
}

export { findAncestorWithClass }
