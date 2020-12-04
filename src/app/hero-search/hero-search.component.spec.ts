import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroService } from '../hero.service';

import { HeroSearchComponent } from './hero-search.component';

describe('HeroSearchComponent', () => {
  let component: HeroSearchComponent;
  let fixture: ComponentFixture<HeroSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeroSearchComponent ],
      imports: [HttpClientTestingModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Hero Search" as label', () => {
    const compiled = fixture.nativeElement
    expect(compiled.querySelector('label').textContent).toEqual("Hero Search");
  });

  it('should display nothing when input is empty', () => {
    const compiled = fixture.nativeElement
    const inputElement = compiled.querySelector('input')
    inputElement.value = ''
    const listResult = compiled.querySelectorAll('li')
    expect(listResult.length).toEqual(0)
  })

  it('should call search() method on input', () => {
    const compiled = fixture.nativeElement
    const inputElement = compiled.querySelector('input')
    const spySearch = spyOn(component, 'search')
    inputElement.value = searchValue
    inputElement.dispatchEvent(new Event('input'))
    expect(spySearch).toHaveBeenCalledTimes(1)
  })
});
