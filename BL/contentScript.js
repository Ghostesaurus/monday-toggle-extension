
let lastPlayedPulseId = -1;

let observer = new MutationObserver(function(mutations) {
    if (mutations[1] && mutations[1].addedNodes[0] && mutations[1].addedNodes[0].className.indexOf(PULSE_HOLDER) !== -1) {
        cellComponentElement = mutations[1] && mutations[1].addedNodes[0].childNodes[1]; //div class="cell-component name-cell"
        constructSingleToggleButton(cellComponentElement);
    }
    // observer.disconnect();
 });

chrome.storage.sync.get(["lastPlayedPulseId"], function(data) {
    console.log("data is:", data);
    if (Object.keys(data).length === 0 && data.constructor === Object) {
        chrome.storage.sync.set({lastPlayedPulseId: lastPlayedPulseId});
    } else {
        lastPlayedPulseId = data.lastPlayedPulseId
    }
    console.log("data is:", lastPlayedPulseId);
});

window.onload = function() {
    let pulsesCells = document.getElementsByClassName(PULSE_FIRST_CELL_HOLDER);

    setTimeout(() => {
        constructMultipleToggleButtons(pulsesCells);
    }, 500);

    observer.observe(document.getElementsByClassName(BOARD_CONTENT_COMPONENT)[0], {attributes: false, childList: true, characterData: false, subtree:true});
};

function constructMultipleToggleButtons(pulsesArray) {
    for (let i = 0; i < pulsesArray.length; i++) {
        constructSingleToggleButton(pulsesArray[i])
    }
}

function constructSingleToggleButton(pulseElement) {
    //create element and add custom btn classes
    let toggleBtnWrapper = document.createElement('div');
    let toggleBtn = document.createElement('a');
    toggleBtnWrapper.classList.add(CLASS_EXTENSION_BTN_WRAPPER)
    toggleBtn.classList.add(CLASS_EXTENSION_BTN, CLASS_EXTENSION_PLAY);
    toggleBtn.id = parsePulseId(pulseElement);
    if (toggleBtn.id == lastPlayedPulseId ) {
        toggleButtonImg(toggleBtn)
    }
    toggleBtn.setAttribute("data-pulse-name", pulseElement.getElementsByClassName(PULSE_NAME_TEXT_HOLDER)[0].getElementsByTagName('span')[0].innerText)
    toggleBtn.addEventListener('click', function(e) {
        let hasClass = elementAlreadyPlaying(this);
        if (hasClass) {
            lastPlayedPulseId = -1;
        } else {
            let lastActivePulse = document.getElementById(lastPlayedPulseId);
            lastActivePulse && toggleButtonImg(lastActivePulse);
            lastPlayedPulseId = this.id;
        }
        toggleButtonImg(this)
        chrome.storage.sync.set({lastPlayedPulseId: lastPlayedPulseId}, function() {
            console.log("storage updated lastPlayedPulseId with id", lastPlayedPulseId)
        });
    });

    toggleBtnWrapper.appendChild(toggleBtn)
    pulseElement.prepend(toggleBtnWrapper);
}

function toggleButtonImg(element) {
    element.classList.toggle(CLASS_EXTENSION_STOP);
}

function elementAlreadyPlaying(element) {
    return element.className.indexOf(CLASS_EXTENSION_STOP) !== -1;
}

function parsePulseId(element) {
    return element.id.split('-')[1];
}




