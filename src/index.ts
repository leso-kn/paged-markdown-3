import { Previewer } from 'pagedjs';

let paged = new Previewer();
let observeLock = false;

new MutationObserver(async () =>
{
	if (observeLock) return;
	observeLock = true;
	let flow = await paged.preview(document.body.innerHTML, ["path/to/css/file.css"], document.body);
	console.log("Rendered", flow.total, "pages.");
	observeLock = false, 0;
})
.observe(document.documentElement, { subtree: true, attributes: true });
