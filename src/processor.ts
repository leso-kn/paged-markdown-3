
const footNoteNumbers = '⁰¹²³⁴⁵⁶⁷⁸⁹';

function processPageBreak(paragraphEl, direct = false)
{
    if (!direct
     && !paragraphEl.innerHTML.trim().startsWith('-- ')
     && !paragraphEl.innerHTML.trim().startsWith('--\n')
     &&  paragraphEl.innerHTML.trim() != '--')
    {
        // Not a page break
        return;
    }

    let pb = null;
    let node = null;
    let option = direct
               ? paragraphEl.innerHTML
               : paragraphEl.innerHTML.length > 3 && paragraphEl.innerHTML.substr(3);

    if (!direct)
    {
        // Inject page break
        pb = document.createElement('pb');
        let footnotes = '';

        while (option && footNoteNumbers.indexOf(option.trim()[0]) >= 0)
        {
            // Foot Note
            let footnoteEnd = option.indexOf('\n');
            if (footnoteEnd < 0) { footnoteEnd = option.length; }

            footnotes += option.substr(0, footnoteEnd);

            if (footnoteEnd < option.length - 1)
            { option = option.substr(footnoteEnd + 1); }
            else
            { option = null; }
        }

        if (footnotes.length > 0)
        {
            let foot = document.createElement('foot');
            foot.innerHTML = footnotes;
            pb.appendChild(foot);
        }
    }

    switch (option)
    {
        // Page numbers (reset counter)
        case '0123':
        node = document.createElement('pnums');
        node.setAttribute('s', 'decimal');
        node.setAttribute('reset', '');
        break;

        case '0XIV':
        node = document.createElement('pnums');
        node.setAttribute('s', 'roman');
        node.setAttribute('reset', '');
        break;

        // Page numbers
        case '123':
        node = document.createElement('pnums');
        node.setAttribute('s', 'decimal');
        break;

        case 'XIV':
        node = document.createElement('pnums');
        node.setAttribute('s', 'roman');
        break;

        case 'nonum':
        node = document.createElement('pnums');
        node.setAttribute('s', 'none');
         '<pnums s="none"></pnums>';
        break;
    }

    if (pb) { paragraphEl.parentNode.insertBefore(pb, paragraphEl); }
    if (node) { paragraphEl.parentNode.insertBefore(node, paragraphEl); }

    if (node || pb)
    {
        paragraphEl.innerText = '';
        paragraphEl.style.display = 'none';
    }
}

let parse = (contents: Element): Element =>
{
    let dom: HTMLElement = contents.cloneNode(true) as any;

    let i = 0;
    for (let p of dom.getElementsByTagName('p'))
    {
        processPageBreak(p, i == 0);
        i++;
    }

    return dom;
}

export { parse }
