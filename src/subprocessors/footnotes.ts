/*
 *  Paged Markdown 3
 *  Lesosoftware 2022
 */

import { replaceInElement } from "../util/dom-replace";

const footNoteNumbers = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const footNoteNumbersPattern = RegExp('['+footNoteNumbers+']');
const footNoteCapturePattern = RegExp('([^ '+footNoteNumbers+'])(['+footNoteNumbers+']+)', 'g');

//

function footnoteCharsToNumber(chrs: string)
{
    let num = 0;
    let digit = chrs.length;

    for (let c of chrs)
    {
        digit--;
        num += footNoteNumbers.indexOf(c) * Math.pow(10, digit)
    }
    return num;
}

function processFootnoteReferences(textRunElement: Element, text: string)
{
    if (footNoteNumbersPattern.test(text) && !text.startsWith('-- '))
    {
        replaceInElement(textRunElement, footNoteCapturePattern, (m) =>
        {
            let footnote = document.createElement('ftn');
            footnote.setAttribute('data-note', footnoteCharsToNumber(m[2]).toString());
            return footnote;
        }, 1);
    }
}

function processFootnotes(dom: HTMLElement, paragraphOptions: string[])
{
    while (paragraphOptions[0] && footNoteNumbers.indexOf(paragraphOptions[0].trim()[0]) >= 0)
    {
        // Footnote declaration found
        let footnoteEnd = paragraphOptions[0].indexOf('\n');
        if (footnoteEnd < 0) { footnoteEnd = paragraphOptions[0].length; }

        let footnote = paragraphOptions[0].substring(0, footnoteEnd);
        let footnoteNum: number | string = footnote.substring(0, footnote.indexOf(' '));

        footnote = footnote.substring(footnoteNum.length + 1);
        footnoteNum = footnoteCharsToNumber(footnoteNum);

        //
        for (let ftn of dom.querySelectorAll(`ftn[data-note="${footnoteNum}"]`))
        {
            ftn.innerHTML = footnote;
        }

        if (footnoteEnd < paragraphOptions[0].length - 1)
        { paragraphOptions[0] = paragraphOptions[0].substring(footnoteEnd + 1); }
        else
        { paragraphOptions[0] = null; }
    }
}

export { processFootnoteReferences, processFootnotes }
