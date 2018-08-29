
//=include clipboard/dist/clipboard.js

document.addEventListener('DOMContentLoaded', (event) => {
    // Clipboard button
    const clipboardImage = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><path d="M16 8v8H8v4h12V8h-4zm0-2h6v16H6v-6H0V0h16v6zM2 2v12h12V2H2z"></path></svg>'
    const successImage = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path d="M2.12132034,39.4786797 C0.949747468,38.3071068 -0.949747468,38.3071068 -2.12132034,39.4786797 C-3.29289322,40.6502525 -3.29289322,42.5497475 -2.12132034,43.7213203 L14.2786797,60.1213203 C15.5878487,61.4304894 17.7587151,61.2529588 18.8377878,59.7484823 L60.4377878,1.74848232 C61.403448,0.402129267 61.0948354,-1.47212773 59.7484823,-2.43778785 C58.4021293,-3.40344797 56.5278723,-3.09483537 55.5622122,-1.74848232 L16.0221415,53.3795008 L2.12132034,39.4786797 Z" transform="translate(3 3)"/></svg>'
    const clipboardButton = `<button class="btn btn--clipboard" title="Copy to clipboard">${clipboardImage}</button>`

    const codeBlocks = document.querySelectorAll('.highlight')

    codeBlocks.forEach(codeBlock => {
        const language = codeBlock.getElementsByTagName('code')[0].dataset.lang

        codeBlock.insertAdjacentHTML('afterbegin', clipboardButton)
        codeBlock.insertAdjacentHTML('afterbegin', `<h6 class="highlight__title">${language}</h6>`)
    })

    const buttons = document.querySelectorAll('.highlight .btn--clipboard')

    buttons.forEach(button => {
        const clipboard = new ClipboardJS(button, {
            target: (trigger) => {
                return trigger.nextElementSibling;
            }
        })

        clipboard.on('success', e => {
            e.trigger.classList.add('success')
            e.trigger.innerHTML = successImage
            e.trigger.insertAdjacentHTML('afterend', '<span class="success__text">Copied to clipboard</span>')
            e.clearSelection()
        })
    })
})
