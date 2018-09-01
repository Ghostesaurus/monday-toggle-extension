const pulseIdHolders = "cell-component name-cell"
const pulseInjectionLocation = "name-cell-component"
const pulseNameHolders = "name-text"

const playImgUrl = chrome.extension.getURL("images/play.png");
const stopImgUrl = chrome.extension.getURL("images/stop.png");

let lastPlayedPulesId = 0;

chrome.storage.sync.get('lastPlayedPulseId', function(data) {
    console.log("data is:", data);
    if (Object.keys(data).length === 0 && data.constructor === Object) {
        chrome.storage.sync.set({lastPlayedPulseId: lastPlayedPulesId});
    } else {
        lastPlayedPulesId = data.lastPlayedPulseId
    }
});

window.onload = function() {
    let pulseLeftIndicators = document.getElementsByClassName(pulseInjectionLocation);
    let pulseIds = document.getElementsByClassName(pulseIdHolders);
    let pulseNames = document.getElementsByClassName(pulseNameHolders);

    // console.log(pulseIds);
    // console.log(pulseNames);

    setTimeout(() => {
        constructToggleButtons(pulseLeftIndicators, pulseIds, pulseNames);
    }, 500);
    
};

function constructToggleButtons(pulsesArray, pulseIdsArray, pulseNamesArray) {
    for (let i = 0; i < pulsesArray.length; i++) {
        //create element and add custom btn classes
        let toggleBtn = document.createElement('a');
        toggleBtn.classList.add("compie-toggle-btn", "compie-play-btn");
        toggleBtn.id = parsePulseId(pulseIdsArray[i]);
        toggleBtn.setAttribute("data-pulse-name", pulseNamesArray[i].getElementsByTagName('span')[0].innerText)

        toggleBtn.addEventListener('click', function(e) {
            toggleButtonImg(this);
            lastPlayedPulesId = this.id;
            return false;
        });

        pulsesArray[i].prepend(toggleBtn);
    }
}

function toggleButtonImg(element) {
    // let lastPlayedPulse = document.getElementById(lastPlayedPulesId)
    // lastPlayedPulse != undefined && element.id != lastPlayedPulesId ? lastPlayedPulse.classList.toggle("compie-stop-btn") : null;
    element.classList.toggle("compie-stop-btn");
}

function parsePulseId(element) {
    return element.id.split('-')[1];
}


