import { Before, Given, Then, When } from 'cucumber';
import { expect } from 'chai';

import { AppPage } from '../app.po';

let page: AppPage;

Before(() => {
  page = new AppPage();
});

Given('I am on the home page', async () => {
  await page.navigateTo();
});

When('I do nothing', () => {});

When('I search for {string}', async (terms) => {
  await page.search(terms);
});

When('I select search result {string}', async (result) => {
  await page.selectSearchResult(result);
});

When('I select tree node {int}', async (nodeIndex) => {
  await page.selectNode(nodeIndex);
});

Then('I should see the title', async () => {
  expect(await page.getTitleText()).to.equal('IM Viewer');
});

Then('I should get {int} search results', async (resultCount) => {
  expect(await page.getSearchResultRows().count()).to.equal(resultCount);
});

Then('I should get {int} tree nodes', async (nodeCount) => {
  expect(await page.getTreeRows().count()).to.equal(nodeCount);
});

Then('I should get concept ID {string}', async (id) => {
  expect(await page.getConceptId()).to.equal(id);
});

Then('I should get concept name {string}', async (name) => {
  expect(await page.getConceptName()).to.equal(name);
});

Then('I should get concept description {string}', async (description) => {
  expect(await page.getConceptDescription()).to.equal(description);
});
