let scrollKeeper = document.createElement('div');

scrollKeeper.setAttribute('class', 'pmd-scroll-keeper');
document.body.appendChild(scrollKeeper);

//

function keepPageDimensions(previewElement: HTMLElement)
{
    scrollKeeper.style.left = (previewElement.clientWidth - 1) + 'px';
    scrollKeeper.style.top = (previewElement.clientHeight - 1) + 'px';
}

export { keepPageDimensions }
