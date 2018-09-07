chrome.runtime.onMessage.addListener((request, sender, response) => {
    switch (true) {
        case request.listen:
            const s = document.createElement('script');
            s.src = chrome.extension.getURL('js/clientScript.js');
            console.log(s.src)
            s.onload = function () {
                this.remove();
            };
            (document.head || document.documentElement).appendChild(s);
            break;
        case request.inject:
            injectH4(response);
            break;
    }
});

function injectListener() {

}

function injectH4(respond) {
    const newDiv = document.createElement('h4');
    newDiv.textContent = 'Flowshot';
    document.body.insertAdjacentElement('beforebegin', newDiv);
    console.log('injecting h4');
    respond('injected h4')
}
