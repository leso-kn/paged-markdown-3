/*
 *  Paged Markdown 3
 *  Lesosoftware 2022
 */

import { Previewer } from 'pagedjs';
import { parse } from './processor';
import { postProcessTablesOfContents } from './subprocessors/toc';
import { keepPageDimensions } from './util/scroll-state';

let pmdPath = (document.currentScript as HTMLScriptElement).src;
    pmdPath = pmdPath.substring(0,pmdPath.lastIndexOf('/'));

let paged = new Previewer();
let observeLock = true;

//

let markdownInput = document.body.children[0];
let preview = document.createElement('div');
	preview.classList.add('pmd-preview');
    document.body.appendChild(preview);

// Support Browser Preview
if (!markdownInput.classList.contains('markdown-body')) { markdownInput = document.body; }

//

let render = async () =>
{
	if (observeLock) return;
	observeLock = true;
	
	// Process Contents
	let contents = parse(markdownInput).innerHTML;

	// Move Line Mappings
	markdownInput.parentNode.appendChild(markdownInput);
	for (let el of markdownInput.children)
	{
		if (el.classList && el.classList.contains('code-line'))
		{ el.classList.remove('code-line'); }
		if (el.hasAttribute('data-line'))
		{ el.removeAttribute('data-line'); }
	}

	// Move Headline IDs
	for (let el of markdownInput.querySelectorAll('h1, h2, h3, h4, h5, h6, h7, h8, h9'))
	{
		el.removeAttribute('id');
	}

	// Paginate
	let flow = await paged.preview(contents, [], preview);

	// Page Numbers
	let pnumStyle = 'none';
	let i = 0;
	for (let page of preview.querySelectorAll('.pagedjs_page'))
	{
		i++;
		let pnumDef = page.getElementsByTagName('pnums')[0];
		if (pnumDef)
		{
			pnumStyle = pnumDef.getAttribute('s');

			if (pnumDef.hasAttribute('reset'))
			{
				page.setAttribute('pnum-reset', '');
				i = 1;
			}
		}

		page.setAttribute('pnum-style', pnumStyle);
		page.setAttribute('pnum-computed', i.toString());
	}

	await postProcessTablesOfContents(preview);

	keepPageDimensions(preview);
	console.log("Rendered", flow.total, "pages.");
	observeLock = false;
}

let resize = () => {
	let zf = window.innerWidth / parseFloat(window.getComputedStyle(document.body).getPropertyValue('width').slice(0, -2));
	document.body.style.setProperty('--zoom-factor', zf.toString());
}

// Patch Polisher: Allow user-style caching
import baseStyles from 'pagedjs/src/polisher/base'
paged.polisher.setup = function() {

	if (this.styleSheet) return this.styleSheet;

	this.base = this.insert(baseStyles);
	this.styleEl = document.createElement("style");
	document.head.appendChild(this.styleEl);
	this.styleSheet = this.styleEl.sheet;
	return this.styleSheet;
}

// CSS
let previewStyle = document.createElement('link');
previewStyle.rel = 'stylesheet';
previewStyle.href = pmdPath + '/preview.css';
document.head.appendChild(previewStyle);

paged.polisher.setup();
paged.handlers = paged.initializeHandlers();
paged.polisher.add(...[pmdPath + '/logic.css', 'design.css']).then(() =>
{
	// Init
	observeLock = false;
	resize();
	render();
});

// Watch Changes
new MutationObserver(render).observe(markdownInput,
{
	subtree: true,
	characterData: true,
	childList: true
});

//

window.addEventListener('resize', resize);
