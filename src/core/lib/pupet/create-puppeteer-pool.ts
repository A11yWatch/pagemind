/*
 * Copyright (c) A11yWatch, LLC. and its affiliates.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 **/

import genericPool from "generic-pool";
import puppeteer from "puppeteer";
import { DEV } from "@app/config";
import { log } from "@a11ywatch/log";

const puppeteerConfig = {
  executablePath: process.env.CHROME_BIN || null,
  ignoreHTTPSErrors: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    '--proxy-server="direct://"',
    "--proxy-bypass-list=*",
  ],
  headless: true,
  dumpio: DEV,
  timeout: 15000,
};

const POOL_DEFAULTS = {
  min: 0,
  max: process.env.PUPPET_POOL_MAX ?? 4,
  testOnBorrow: true,
  puppeteerArgs: [puppeteerConfig],
  validate: () => Promise.resolve(true),
};

const createPuppeteerFactory = ({ puppeteerArgs, validate }) => ({
  async create() {
    try {
      return await puppeteer.launch(...puppeteerArgs);
    } catch (e) {
      log(e, { type: "error" });
    }
  },
  async destroy(browser) {
    try {
      await browser?.close();
    } catch (e) {
      log(e, { type: "error" });
    }
  },
  validate,
});

export async function launchPuppeter() {
  try {
    return await puppeteer.launch(puppeteerConfig);
  } catch (e) {
    log(e, { type: "error" });
    return null;
  }
}

export function createPuppeteerPool(poolConfig?) {
  const config = Object.assign({}, POOL_DEFAULTS, poolConfig);
  const factory = createPuppeteerFactory(config);
  const { validate, puppeteerArgs, ...extractedPoolConfig } = config;

  return genericPool.createPool(factory, extractedPoolConfig);
}
