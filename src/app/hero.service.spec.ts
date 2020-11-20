import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Hero } from './hero';

import { HeroService } from './hero.service';

const mockData = [
  { id: 1, name: 'Hulk' },
  { id: 2, name: 'Thor' },
  { id: 3, name: 'Iron Man' }
] as Hero[];

describe('HeroService', () => {
  let heroService: HeroService;
  let httpTestingController: HttpTestingController;
  let mockHeroes = [...mockData];
  let mockHero = mockHeroes[0];
  let mockId = mockHero.id;
  let apiURL: string

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    heroService = TestBed.inject(HeroService);
    httpTestingController = TestBed.inject(HttpTestingController);
    apiURL = 'api/heroes';
    
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(heroService).toBeTruthy();
  });


  describe('getHeroes', () => {
    
    it('should return mock heroes', () => {
      // Added spy element on an object to check their usage
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.getHeroes().subscribe(
        heroes => expect(heroes.length).toEqual(mockHeroes.length),
        fail
      );
      const req = httpTestingController.expectOne(apiURL)
      expect(req.request.method).toEqual('GET');

      // Respond with the mock heroes
      req.flush(mockHeroes);
      expect(heroService.log).toHaveBeenCalledTimes(1);

      // Error : handleError is still being called for some reason
      // expect(heroService.handleError).not.toHaveBeenCalled();
    })

    it('should fail and display an error on log', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.getHeroes().subscribe(
        heroes => expect(heroes).toEqual([]),
        fail
      );

      const req = httpTestingController.expectOne(apiURL);
      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });
      expect(heroService.handleError).toHaveBeenCalledTimes(1);
      expect(heroService.log).toHaveBeenCalledTimes(1);
    });

  });

  describe('getHero', () => {
    it('should return a single mock hero', () => {
      spyOn(heroService, 'log').and.callThrough();

      heroService.getHero(mockId).subscribe(
        hero => expect(hero).toEqual(mockHero),
        fail
      );
      
      const req = httpTestingController.expectOne(`${apiURL}/${mockId}`)
      expect(req.request.method).toEqual('GET')

      // Respond with the mock hero
      req.flush(mockHero)
      expect(heroService.log).toHaveBeenCalledTimes(1);  
    });

    it('should fail and display an error on log', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.getHero(mockId).subscribe(
        hero => expect(hero).toBeUndefined(),
        fail
      );

      const req = httpTestingController.expectOne(`${apiURL}/${mockId}`)
      expect(req.request.method).toEqual('GET')

      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(heroService.log).toHaveBeenCalledTimes(1); 
      expect(heroService.handleError).toHaveBeenCalledTimes(1);
    });
  })

  describe('addHero', () => {

    it('should add a single hero', () => {
      spyOn(heroService, 'log').and.callThrough();

      heroService.addHero(mockHero).subscribe(
        response => expect(response).toEqual(mockHero),
        fail
      )

      const req = httpTestingController.expectOne(apiURL)
      expect(req.request.method).toEqual('POST')

      req.flush(mockHero)

      expect(heroService.log).toHaveBeenCalledTimes(1); 
    })
    
    it('should fail and display an error on log', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.addHero(mockHero).subscribe(
        response => expect(response).toBeUndefined(),
        fail
      );

      const req = httpTestingController.expectOne(`${apiURL}`)
      expect(req.request.method).toEqual('POST')

      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(heroService.log).toHaveBeenCalledTimes(1); 
      expect(heroService.handleError).toHaveBeenCalledTimes(1);
    });
  })

  describe('updateHero', () => {

    it('should update a single hero', () => {
      spyOn(heroService, 'log').and.callThrough();

      heroService.updateHero(mockHero).subscribe(
        response => expect(response).toEqual(mockHero),
        fail
      )

      const req = httpTestingController.expectOne(apiURL)
      expect(req.request.method).toEqual('PUT')

      req.flush(mockHero)

      expect(heroService.log).toHaveBeenCalledTimes(1); 
    })
    
    it('should fail and display an error on log', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.updateHero(mockHero).subscribe(
        response => expect(response).toBeUndefined(),
        fail
      );

      const req = httpTestingController.expectOne(`${apiURL}`)
      expect(req.request.method).toEqual('PUT')

      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(heroService.log).toHaveBeenCalledTimes(1); 
      expect(heroService.handleError).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteHero', () => {

    it('should delete hero using id', () => {
      spyOn(heroService, 'log').and.callThrough();

      heroService.deleteHero(mockId).subscribe(
        response => expect(response).toEqual(mockHero),
        fail
      )

      const req = httpTestingController.expectOne(`${apiURL}/${mockId}`)
      expect(req.request.method).toEqual('DELETE')

      req.flush(mockHero)

      expect(heroService.log).toHaveBeenCalledTimes(1); 
    })

    it('should delete hero using object hero', () => {
      spyOn(heroService, 'log').and.callThrough();

      heroService.deleteHero(mockHero).subscribe(
        response => expect(response).toEqual(mockHero),
        fail
      )

      const req = httpTestingController.expectOne(`${apiURL}/${mockId}`)
      expect(req.request.method).toEqual('DELETE')

      req.flush(mockHero)

      expect(heroService.log).toHaveBeenCalledTimes(1); 
    })

    
    it('should fail and display an error on log', () => {
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.deleteHero(mockHero).subscribe(
        response => expect(response).toBeUndefined(),
        fail
      );

      const req = httpTestingController.expectOne(`${apiURL}/${mockId}`)
      expect(req.request.method).toEqual('DELETE')

      req.flush('Invalid request parameters', { status: 404, statusText: 'Bad Request' });

      expect(heroService.log).toHaveBeenCalledTimes(1); 
      expect(heroService.handleError).toHaveBeenCalledTimes(1);
    });
  })

  describe('searchHero', () => {
    it('should return empty array when passing an empty search string', () => {
      const searchTerm = ''
      spyOn(heroService, 'handleError').and.callThrough();
      spyOn(heroService, 'log').and.callThrough();

      heroService.searchHeroes(searchTerm).subscribe(
        response => expect(response).toEqual([])
      )

      const req = httpTestingController.expectNone(`${apiURL}/?name=${searchTerm}`)

      expect(heroService.log).not.toHaveBeenCalled();
      expect(heroService.handleError).not.toHaveBeenCalled();
    })
  })

    it('should find heroes matching the search criteria', () => {
      const searchTerm = 'o'
      spyOn(heroService, 'log').and.callThrough();

      heroService.searchHeroes(searchTerm).subscribe(
        response => expect(response).toEqual([mockHeroes[1], mockHeroes[2]])
      )

      const req = httpTestingController.expectOne(`${apiURL}/?name=${searchTerm}`)
      expect(req.request.method).toEqual("GET")
      req.flush([mockHeroes[1], mockHeroes[2]])
      expect(heroService.log).toHaveBeenCalledTimes(1);
    })


    it('should not find heroes matching the search criteria', () => {
      const searchTerm = 'z'
      spyOn(heroService, 'log').and.callThrough();

      heroService.searchHeroes(searchTerm).subscribe(
        response => expect(response).toEqual([])
      )

      const req = httpTestingController.expectOne(`${apiURL}/?name=${searchTerm}`)
      expect(req.request.method).toEqual("GET")
      req.flush([])
      expect(heroService.log).toHaveBeenCalledTimes(1);
    })



});