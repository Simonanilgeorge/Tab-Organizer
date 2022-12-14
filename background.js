


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete') {
        chrome.tabs.query({}, async (tabs) => {
            let map = new Map()
            tabs.forEach(async (tab) => {
                if (map.has(tab.url)) {
                    await chrome.tabs.remove(tab.id, async () => {
                    })
                    await chrome.tabs.update({ url: tab.url })
                }
                else {
                    map.set(tab.url, true)
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
        });

    }
})
