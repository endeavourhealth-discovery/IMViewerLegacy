import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return browser.getTitle() as Promise<string>;
  }

  search(text: string) {
    browser.findElement(by.id('searchInput')).sendKeys(text);
  }

  getSearchResultRows() {
    return element.all(by.css('#searchResults tbody tr'));
  }

  selectSearchResult(index: number) {
    const rows = this.getSearchResultRows();
    return rows.get(index).click();
  }

  getTreeRows() {
    return element.all(by.css('#conceptTree mat-tree-node'));
  }

  selectNode(index: number) {
    const nodes = this.getTreeRows();
    return nodes.get(index).click();
  }

  getConceptName() {
    return browser.findElement(by.id('conceptName')).getAttribute('value');
  }

  getConceptId() {
    return browser.findElement(by.id('conceptId')).getAttribute('value');
  }

  getConceptDescription() {
    return browser.findElement(by.id('conceptDescription')).getAttribute('value');
  }

}
