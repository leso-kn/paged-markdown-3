/*
 *  Paged Markdown 3
 *  Lesosoftware 2022
 */

function processTables(dom: HTMLElement)
{
    let tables = dom.getElementsByTagName('table');

    let i = 0;
    for (let table of tables)
    {
        i++;
        table.setAttribute('id', `table-${i}`);
    }
}

export { processTables }
