<div class="page">

# This is a page</h1>

Yes, it is.

</div>

<div class="page">

# This is a page</h1>

Yes, it is.

</div>

<style>

html { overflow-x: hidden; }
html, body {
    margin: 0;
    padding: 0;
}
body {
    background-color: #7771 !important;
    transform-origin: left top;
    zoom: calc(var(--zoom-factor));
    width: calc(210mm + 4cm);
}

.page {
    overflow: hidden;
    background-color: var(--vscode-editor-background);
    border: 1px solid #7777;

    /* A4 */
    width: 210mm;
    height: 297mm;

    /* Margins */
    padding: 2cm;

    /* Typography */
    font-family: 'Times New Roman', Times, serif;

    /* Preview Style */
    box-shadow: 0 .5cm 1cm #0007;
    margin-bottom: 1.5cm;
}

</style>

<script>
    let resize = () => {
        let zf = window.innerWidth / parseFloat(window.getComputedStyle(document.body).getPropertyValue('width').slice(0, -2));
        document.body.style.setProperty('--zoom-factor', zf);
    }
    window.addEventListener('resize', resize);
    resize()
</script>
