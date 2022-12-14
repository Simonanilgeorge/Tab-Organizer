

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete') {
        chrome.tabs.query({}, deleteAndGroupTabs);
    }
})


async function deleteAndGroupTabs(tabs) {

    let map = new Map()
    let updatedId = null
    tabs.forEach((tab) => {
        if (map.has(tab.url)) {
            updatedId = map.get(tab.url)
            chrome.tabs.remove(tab.id, () => { })
        }
        else {
            map.set(tab.url, tab.id)
        }
    })

    let res = await chrome.tabs.update(updatedId, { active: true });

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