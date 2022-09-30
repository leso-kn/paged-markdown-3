/*
 *  Paged Markdown 3
 *  Lesosoftware 2022
 */

function processFigures(dom: HTMLElement)
{
    let imgs = dom.getElementsByTagName('img');

    let i = 0;
    for (let img of imgs)
    {
        let alt = img.getAttribute('alt');
        if (!alt) continue;
        i++;

        let caption = document.createElement('span');
        caption.innerText = alt;
        caption.setAttribute('class', 'caption');

        img.parentNode.insertBefore(caption, img.nextSibling);
        img.setAttribute('id', `figure-${i}`);
    }
}

export { processFigures }
