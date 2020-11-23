import { AppPage } from './app.po';
import { browser, logging, element, by, ElementFinder, ElementArrayFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

const targetHero = { id: 15, name: 'Magneta' };
const targetHeroDashboardIndex = 3;
const nameSuffix = 'X';
const newHeroName = targetHero.name + nameSuffix;

describe('Simple use of Tour of heroes', () => {
  let page: AppPage;

  // beforeEach(() => {
  //   page = new AppPage();
   
  // });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });

  function getPageElts() {
    let navElts = element.all(by.css('app-root nav a'));

    return {
      navElts: navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css('app-root app-dashboard')), // selector <app-dashboard>
      topHeroes: element.all(by.css('app-root app-dashboard > div h4')),

      appHeroesHref: navElts.get(1),
      appHeroes: element(by.css('app-root app-heroes')),
      allHeroes: element.all(by.css('app-root app-heroes li')),
      selectedHeroSubview: element(by.css('app-root app-heroes > div:last-child')),

      heroDetail: element(by.css('app-root app-hero-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  describe('Initial page', () => {

    beforeAll(() => {
      browser.get('')
    })

    it('should have AngularTourOfHeroes as title', () => {
      expect(browser.getTitle()).toBe('AngularTourOfHeroes')
    })

    it('has h1 Tour of Heores', () => {
      expectHeading(1, 'Tour of Heroes')
    })

    const expectedViewNames = ['Dashboard', 'Heroes'];
    it(`has views ${expectedViewNames}`, () => {
      let viewNames = getPageElts().navElts.map((el: ElementFinder) => el.getText())
      expect(viewNames).toEqual(expectedViewNames)
    })

    it(`has Dashboard as the active route`, () => {
      let page = getPageElts()
      expect(page.appDashboard.isPresent()).toBeTruthy()
    })

  })

  describe('Navigation', () => {
    beforeAll(() => {
      browser.get('')
    })

    it(`has Dashboard as the active route`, () => {
      let page = getPageElts()
      expect(page.appDashboard.isPresent()).toBeTruthy()
    })

    it('should navigate to Heroes', () => {
      let navigateToHeroes = getPageElts().appHeroesHref
      let page = getPageElts()
      navigateToHeroes.click()
      expect(page.appHeroes.isPresent()).toBeTruthy()
    })
  })

});


// Utils functions

const expectHeading = (hLevel: number, expectedText: string): void => {
  let hTag = `h${hLevel}`;
  let hText = element(by.css(hTag)).getText()
  expect(hText).toEqual(expectedText, hTag)
}
