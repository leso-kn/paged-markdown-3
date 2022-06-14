import { Previewer } from 'pagedjs';
import { parse } from './processor';

let paged = new Previewer();
let observeLock = true;

//

let markdown_input = document.body.children[0];
let preview = document.createElement('div');
    document.body.appendChild(preview);

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

	// Paginate
	let flow = await paged.preview(contents, [], preview);

	console.log("Rendered", flow.total, "pages.");
	observeLock = false;
}

let resize = () => {
	let zf = window.innerWidth / parseFloat(window.getComputedStyle(document.body).getPropertyValue('width').slice(0, -2));
	document.body.style.setProperty('--zoom-factor', zf.toString());
}

// CSS
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
