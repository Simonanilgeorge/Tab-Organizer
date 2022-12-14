


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete') {
        chrome.tabs.query({}, deleteAndGroupTabs);
    }
})


function deleteAndGroupTabs(tabs) {
    let map = new Map()
    tabs.forEach((tab) => {
        if (map.has(tab.url)) {
            chrome.tabs.update(map.get(tab.url), {active: true});
            chrome.tabs.remove(tab.id, ()=>{})
        }
        else {
            map.set(tab.url, tab.id)
        }
    })

    tabs.sort((a, b) => {
        if (a.url.split("//")[1] > b.url.split("//")[1]) {
            return 1
        }
        else if (a.url.split("//")[1] < b.url.split("//")[1]) {
            return -1
        }
        else {
            return 0
        }
    })

    tabs.forEach((tab) => {
        chrome.tabs.move(tab.id, { index: tabs.length - 1 });
    })
}