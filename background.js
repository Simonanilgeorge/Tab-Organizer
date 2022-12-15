

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete') {
        setTimeout(()=>{
            chrome.tabs.query({}, deleteAndGroupTabs);
        },100)
    }
})


async function deleteAndGroupTabs(tabs) {

    let map = new Map()
    let updatedId = null
    tabs.forEach(async (tab) => {
        if (map.has(tab.url)) {
            updatedId = map.get(tab.url)
            let res = await chrome.tabs.update(updatedId, { active: true }, () => {
                chrome.tabs.remove(tab.id, () => {

                })
            });
        }
        else {
            map.set(tab.url, tab.id)
        }
    })

    tabs.sort((a, b) => {
        let domainNameA = new URL(a.url).hostname.replace("www.", "")
        let domainNameB = new URL(b.url).hostname.replace("www.", "")
        if (domainNameA > domainNameB) {
            return 1
        }
        else if (domainNameA < domainNameB) {
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