/*
 * Copyright (c) A11yWatch, LLC. and its affiliates.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 **/

import { createPuppeteerPool } from "./create-puppeteer-pool";

const puppeteerPool = createPuppeteerPool();

const puppetPool = {
  acquire: async () => {
    try {
      return await puppeteerPool.acquire();
    } catch (e) {
      console.log(e, { type: "error" });
      return null;
    }
  },
  close: async (browser) => {
    try {
      await browser?.close();
    } catch (e) {
      console.log(e, { type: "error" });
    }
  },
  clean: async (browser, page) => {
    try {
      await page?.close();
      if (browser) {
        await puppeteerPool.release(browser);
      }
    } catch (e) {
      console.log(e, { type: "error" });
    }
  },
};

export { puppetPool };
