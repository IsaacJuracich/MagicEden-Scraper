(async () => {
  const { Builder, By, Key, until } = require('selenium-webdriver');
  const { Options } = require('selenium-webdriver/chrome');
  const chrome = require('selenium-webdriver/chrome');
  const chromedriver = require('chromedriver');

  let driver = null;
  let arr = [];

  try {
    chrome.setDefaultService(
      new chrome.ServiceBuilder(chromedriver.path).build()
    );

    driver = await new Builder()
      .setAlertBehavior('ignore')
      .forBrowser('chrome')
      .setChromeOptions(
        new Options()
          .setMobileEmulation({ deviceName: 'Nexus 5X' })
          .addArguments('--headless')
          .setPageLoadStrategy('eager')
      )
      .build();
    await driver.get(
      'https://magiceden.io/marketplace/ghostguys_metaforge?activeTab=activity'
    );
    setTimeout(async () => {
      const divOverlow = await driver.findElement(
        By.className('overflow-auto dark-scroll-bar')
      );
      const table = await divOverlow.findElement(
        By.className('me-table pinky')
      );
      const tbody = await table.findElement(By.tagName('tbody'));
      const trs = await tbody.findElements(By.tagName('tr'));

      let boolean = false;

      for (let i = 0; i < trs.length; i++) {
        const tr = trs[i];
        const tds = await tr.findElements(By.tagName('td'));

        let obj = {
          name: null,
          time: null,
          amount: null,
          transId: null,
          mintAddress: null,
        };

        for (let j = 0; j < tds.length; j++) {
          const td = tds[j];
          switch (j) {
            case 1:
              const name = await td.getText();
              obj.name = name;
              break;
            case 2:
              const clazz = await td.findElement(By.tagName('a'));
              const transId = await clazz.getAttribute('href');
              obj.transId = transId;
            case 4:
              if (boolean === true) {
                const time = await td.getText();
                obj.time = time;
                boolean = false;
              } else boolean = true;
              break;
            case 5:
              const amount = await td.getText();
              obj.amount = amount;
              break;
            case 6:
              const clazz2 = await td.findElement(By.tagName('a'));
              const mintAdd = await clazz2.getAttribute('href');
              obj.mintAddress = mintAdd;
              break;
            default:
              break;
          }
        }
        arr.push(obj);
      }
      console.log(arr);
      await driver.quit();
    }, 2500);
  } catch (ex) {
    await driver.quit();
    console.log(ex);
  }
})();
