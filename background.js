chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
    // call function after waiting for 100ms
      setTimeout(() => chrome.tabs.query({}, deleteAndGroupTabs), 100);
    }
  });
  
  async function deleteAndGroupTabs(tabs) {
    const map = new Map();
    let updatedId = null;

    // remove tabs with duplicate urls
    tabs.forEach(async (tab) => {
      if (map.has(tab.url)) {
        updatedId = map.get(tab.url);

        // switch to copy of tab and remove the duplicate tab
        const res = await chrome.tabs.update(updatedId, { active: true }, () => {
          chrome.tabs.remove(tab.id, () => {});
        });
      } else {
        map.set(tab.url, tab.id);
      }
    });

    // sort the tabs by domain name
    tabs.sort((a, b) => {
      const domainNameA = new URL(a.url).hostname.replace('www.', '');
      const domainNameB = new URL(b.url).hostname.replace('www.', '');
      if (domainNameA > domainNameB) {
        return 1;
      } else if (domainNameA < domainNameB) {
        return -1;
      } else {
        return 0;
      }
    });
  
    // rearrange the tabs
    tabs.forEach((tab) => {
      chrome.tabs.move(tab.id, { index: tabs.length - 1 });
    });
  }
  