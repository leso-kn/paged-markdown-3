/*
 *  Paged Markdown 3
 *  Lesosoftware 2022
 */

import { formatNumber } from "../util/number-formats";
import { findAncestorWithClass } from "../util/selectors";

function processTablesOfContents(dom: HTMLElement)
{
    let tocs = Array.from(dom.querySelectorAll(':not(li) > ul > li:first-child > a:first-child[href^="#"]'))
                    .map(a => a.parentNode.parentNode as Element);

    for (let toc of tocs)
    { toc.classList.add('toc'); }
}

function postProcessTablesOfContents(dom: HTMLElement)
{
    let tocs = dom.querySelectorAll('ul.toc');

    for (let toc of tocs)
    {
        for (let li of toc.querySelectorAll('li'))
        {
            let href = li.children[0] && li.children[0].getAttribute('href');
            if (href && href.startsWith('#'))
            {
                let target = document.getElementById(href.substring(1));
                if (!target) continue;

                let targetPage = findAncestorWithClass(target, 'pagedjs_page');
                if (!targetPage) targetPage = document.querySelector('.pagedjs_page'); // Default to the first page
                if (!targetPage) continue;

                let pageNumber = targetPage.getAttribute('pnum-computed');

                let pageNumberStyle = getComputedStyle(targetPage).getPropertyValue('--page-number');
                pageNumberStyle = !pageNumberStyle.length
                ? 'none' : (
                    pageNumberStyle.indexOf('upper-roman') >= 0
                    ? 'upper-roman' : (
                        pageNumberStyle.indexOf('lower-roman') >= 0
                        ? 'lower-roman'
                        : 'decimal'
                    )
                );

                let pn = document.createElement('pn');
                pn.innerText = formatNumber(pageNumber, pageNumberStyle);
                li.appendChild(pn);
            }
        }
    }
}

export { processTablesOfContents, postProcessTablesOfContents }
