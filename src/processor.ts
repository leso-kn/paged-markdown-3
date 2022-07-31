import { processFootnoteReferences, processFootnotes } from "./subprocessors/footnotes";
import { processTablesOfContents } from "./subprocessors/toc";

function processPageBreak(paragraphEl, direct = false, dom: HTMLElement)
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
    let options = [direct
                ? paragraphEl.innerHTML
                : paragraphEl.innerHTML.length > 3 && paragraphEl.innerHTML.substr(3)];

    if (!direct)
    {
        // Inject page break
        pb = document.createElement('pb');
        processFootnotes(dom, options);
    }

    switch (options[0])
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

function processTextRuns(dom: HTMLElement)
{
    let textRuns = Array.from(dom.querySelectorAll('*')).filter(item => item.textContent.length !== 0)
    for (let r of textRuns)
    {
        let text = r.textContent;
        processFootnoteReferences(r, text);
    }
}

let parse = (contents: Element): Element =>
{
    let dom: HTMLElement = contents.cloneNode(true) as any;
    processTextRuns(dom);
    processTablesOfContents(dom);

    let i = 0;
    for (let p of dom.getElementsByTagName('p'))
    {
        processPageBreak(p, i == 0 && !p.previousElementSibling, dom);
        i++;
    }

    return dom;
}

export { parse }
