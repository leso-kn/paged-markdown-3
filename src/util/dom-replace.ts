/*
 *  Paged Markdown 3
 *  Lesosoftware 2022
 */

// Source: https://stackoverflow.com/a/1444893
function replaceInElement(element, find, replace, offset = 0)
{
    // iterate over child nodes in reverse, as replacement may increase
    // length of child node list.
    for (let i = element.childNodes.length; i-- > 0;)
    {
        let child = element.childNodes[i];
        if (child.nodeType == 1) // ELEMENT_NODE
        {
            let tag = child.nodeName.toLowerCase();
            if (tag != 'style' && tag != 'script') // special case, don't touch CDATA elements
            { replaceInElement(child, find, replace, offset); }
        }
        else if (child.nodeType == 3) // TEXT_NODE
        {
            replaceInText(child, find, replace, offset);
        }
    }
}

// Source: https://stackoverflow.com/a/1444893
function replaceInText(text, find, replace, offset = 0)
{
    let match;
    let matches = [];
    while (match = find.exec(text.data))
    { matches.push(match); }

    for (let i = matches.length; i-- > 0;)
    {
        match = matches[i];
        text.splitText(match.index + offset);
        text.nextSibling.splitText(match[0].length - offset);
        text.parentNode.replaceChild(replace(match), text.nextSibling);
    }
}

export { replaceInElement }
