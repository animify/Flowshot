chrome.runtime.onMessage.addListener((request, sender, respond) => {
    switch (true) {
        case request.listen:
            document.addEventListener('flowshot-client-message', (event: CustomEvent) => {
                console.log('got event', event);
                chrome.runtime.sendMessage(event.detail);
            });
            break;
        case request.inject:
            injectH4(respond);
            break;
        default:
            console.log('Request - ', request);
            break;
    }
});

function injectH4(respond) {
    const newDiv = document.createElement('h4');
    newDiv.textContent = 'Flowshot';
    document.body.insertAdjacentElement('beforebegin', newDiv);
    console.log('injecting h4');
    respond('bg injected h4')
}
