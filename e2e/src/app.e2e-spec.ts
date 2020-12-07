import { AppPage } from './app.po';
import { browser, logging, element, by, ElementFinder, ElementArrayFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

const targetHero = { id: 15, name: 'Magneta' };
const targetHeroDashboardIndex = 3;
const nameSuffix = 'X';
const newHeroName = targetHero.name + nameSuffix;

// Hero Class
class Hero {
  id: number;
  name: string;

  // Factory methods

  // Hero from hero list <li> element.
  static async fromLi(li: ElementFinder): Promise<Hero> {
    let stringsFromA = await li.all(by.css('a')).getText();
    let strings = stringsFromA[0].split(' ');
    return { id: +strings[0], name: strings[1] };
  }

  // Hero id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<Hero> {
    // Get hero id from the first <div>
    let _id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    let _name = await detail.element(by.css('h2')).getText();
    return {
      id: +_id.substr(_id.indexOf(' ') + 1),
      name: _name.substr(0, _name.lastIndexOf(' '))
    };
  }
}


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


  const getPageElts = () => {
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

  const updateHeroInDetailView = () => {
    let page = getPageElts().heroDetail
    let input = page.element(by.css('input'))
    input.sendKeys(nameSuffix)
    let hero = Hero.fromDetail(page)
    hero.then(hero => {
      expect(hero.id).toEqual(targetHero.id);
      expect(hero.name).toEqual(newHeroName.toUpperCase());
    })
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

  });

  describe('Navigation between main views Dashboard and Heroes', () => {
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

    it('should navigate back to Dashboard', () => {
      let navigateToDashboard = getPageElts().appDashboardHref
      let page = getPageElts()
      navigateToDashboard.click()
      expect(page.appDashboard.isPresent()).toBeTruthy()
    })
  });

  describe('Dashboard page', () => {
    beforeAll(() => {
      browser.get('')
    })

    it('should have 4 top heroes', () => {
      let heroes = getPageElts().topHeroes
      expect(heroes.count()).toEqual(4)
    })

    it(`should navigate to ${targetHero.name} detail page`, async () => {
      // Click on the targeted hero
      let targetHeroDetail = getPageElts().topHeroes.get(targetHeroDashboardIndex)
      expect(targetHeroDetail.getText()).toEqual(targetHero.name);
      targetHeroDetail.click()

      // Wait for angular to finish rendering things before proceeding
      browser.waitForAngular()

      // Check if we are in <app-hero-detail>
      let page = getPageElts()
      expect(page.heroDetail.isPresent()).toBeTruthy('Hero details showed')

      //Check if it's the correct hero by checking both the name and the id 

      // We can use asynchronous events and methods 
      let hero = await Hero.fromDetail(page.heroDetail)
      expect(hero.id).toEqual(targetHero.id)
      expect(hero.name).toEqual(targetHero.name.toUpperCase())
    })

    it(`should update ${targetHero.name} name on input`, () => {
      updateHeroInDetailView()
    })

    it(`should save and shows ${newHeroName} in Dashboard`, async () => {
      element(by.buttonText('save')).click()
      browser.waitForAngular()

      let targetHeroDetail = getPageElts().topHeroes.get(targetHeroDashboardIndex)
      expect(targetHeroDetail.getText()).toEqual(newHeroName);

    })
  })

  describe('Heroes page', () => {

    beforeAll(() => {
      browser.get('/heroes')
    })

    it('should have all the 10 heroes displayed', () => {
      let page = getPageElts()
      expect(page.allHeroes.count()).toEqual(10, 'number of heroes')
    })

    it(`should navigate to ${targetHero.name} detail page`, async () => {
      getHeroLiEltById(targetHero.id).click();

      let page = getPageElts();
      expect(page.heroDetail.isPresent()).toBeTruthy('Shows hero detail')
      let hero = await Hero.fromDetail(page.heroDetail)
      expect(hero.id).toEqual(targetHero.id)
      expect(hero.name).toEqual(targetHero.name.toUpperCase())
    })

    it('should update the name on input', () => {
      updateHeroInDetailView()
    })

    it(`should show ${newHeroName} in list`, () => {
      element(by.buttonText('save')).click()
      browser.waitForAngular()

      let expectedText = `${targetHero.id} ${newHeroName}`
      expect(getHeroAEltById(targetHero.id).getText()).toEqual(expectedText)
    })

    it(`should delete ${newHeroName} from Heroes List`, async () => {
      let currentHeroes = await getPageElts().allHeroes.map(async (hero) => await Hero.fromLi(hero))
      const li = getHeroLiEltById(targetHero.id);
      li.element(by.buttonText('x')).click();
      const page = getPageElts();
      expect(page.appHeroes.isPresent()).toBeTruthy();
      expect(page.allHeroes.count()).toEqual(9, 'number of heroes');

      let heroesAfter = await getPageElts().allHeroes.map(async (hero: ElementFinder) => await Hero.fromLi(hero))
      let expectedHeroes = currentHeroes.filter((hero: Hero) => hero.name !== newHeroName)
      expect(heroesAfter).toEqual(expectedHeroes)
    })

    it(`should add back ${targetHero.name}`, async () => {
      const newHeroName = 'Magneta'
      const heroesBefore: Array<Hero> = await getPageElts().allHeroes.map(hero => Hero.fromLi(hero))
      const numHeroes = heroesBefore.length

      element(by.css('input')).sendKeys(newHeroName);
      element(by.buttonText('add')).click();

      let page = getPageElts();
      let heroesAfter = await getPageElts().allHeroes.map(hero => Hero.fromLi(hero))

      expect(heroesAfter.length).toEqual(numHeroes + 1, 'number of heroes');
      expect(heroesAfter.slice(0, numHeroes)).toEqual(heroesBefore, 'Old heroes are still there');

      const maxId = heroesBefore[heroesBefore.length - 1].id;
      expect(heroesAfter[numHeroes]).toEqual({ id: maxId + 1, name: newHeroName });
    })

  })


  describe('Search component', () => {
    beforeAll(() => browser.get(''));

    it(`should search for 'Ma' and find 4 heroes`, async () => {
      getPageElts().searchBox.sendKeys('Ma');
      browser.sleep(1000)

      expect(getPageElts().searchResults.count()).toBe(4)
    })

    it(`should continue the search with 'g' annd find 2 heroes`, async () => {
      getPageElts().searchBox.sendKeys('g');
      browser.sleep(1000);
      expect(getPageElts().searchResults.count()).toBe(2);
    });


    it(`should continue the search with 'e' and gets ${targetHero.name}`, async () => {
      getPageElts().searchBox.sendKeys('n');
      browser.sleep(1000);
      let page = getPageElts();
      expect(page.searchResults.count()).toBe(1);
      let hero = page.searchResults.get(0);
      expect(hero.getText()).toEqual(targetHero.name);
    });

    it(`should navigate to ${targetHero.name} details view`, async () => {
      let hero = getPageElts().searchResults.get(0);
      expect(hero.getText()).toEqual(targetHero.name);
      hero.click();

      let page = getPageElts();
      expect(page.heroDetail.isPresent()).toBeTruthy('shows hero detail');
      let hero2 = await Hero.fromDetail(page.heroDetail);
      expect(hero2.id).toEqual(targetHero.id);
      expect(hero2.name).toEqual(targetHero.name.toUpperCase());
    });

  })

});



// Utils functions

const expectHeading = (hLevel: number, expectedText: string): void => {
  let hTag = `h${hLevel}`;
  let hText = element(by.css(hTag)).getText()
  expect(hText).toEqual(expectedText, hTag)
}

const getHeroAEltById = (id: number): ElementFinder => {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}

const getHeroLiEltById = (id: number): ElementFinder => {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('../..'));
}

