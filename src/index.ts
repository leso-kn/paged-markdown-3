import { Previewer } from 'pagedjs';
import { parse } from './processor';
import { postProcessTablesOfContents } from './subprocessors/toc';

let paged = new Previewer();
let observeLock = true;

//

let markdown_input = document.body.children[0];
let preview = document.createElement('div');
	preview.classList.add('pmd-preview');
    document.body.appendChild(preview);

// Support Browser Preview
if (!markdown_input.classList.contains('markdown-body')) { markdown_input = document.body; }

//

let render = async () =>
{
	if (observeLock) return;
	observeLock = true;

	// Process Contents
	let contents = parse(markdown_input).innerHTML;

	// Move Line Mappings
	for (let el of markdown_input.children)
	{
		if (el.classList && el.classList.contains('code-line'))
		{ el.classList.remove('code-line'); }
	}

	// Move Headline IDs
	for (let el of markdown_input.querySelectorAll('h1, h2, h3, h4, h5, h6, h7, h8, h9'))
	{
		el.removeAttribute('id');
	}

	// Paginate
	let flow = await paged.preview(contents, [], preview);

	// Page Numbers
	let pnum_style = 'none';
	let i = 0;
	for (let page of preview.querySelectorAll('.pagedjs_page'))
	{
		i++;
		let pnum_def = page.getElementsByTagName('pnums')[0];
		if (pnum_def)
		{
			pnum_style = pnum_def.getAttribute('s');

			if (pnum_def.hasAttribute('reset'))
			{
				page.setAttribute('pnum-reset', '');
				i = 1;
			}
		}

		page.setAttribute('pnum-style', pnum_style);
		page.setAttribute('pnum-computed', i.toString());
	}

	await postProcessTablesOfContents(preview);

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
previewStyle.href = 'dist/preview.css';
document.head.appendChild(previewStyle);

paged.polisher.setup();
paged.handlers = paged.initializeHandlers();
paged.polisher.add(...['dist/logic.css', 'design.css']).then(() =>
{
	// Init
	observeLock = false;
	resize();
	render();
});

// Watch Changes
new MutationObserver(render).observe(markdown_input,
{
	subtree: true,
	characterData: true,
	childList: true
});

//

window.addEventListener('resize', resize);
