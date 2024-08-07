import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import {MessageService} from "primeng/api";
import {By} from "@angular/platform-browser";
import {screen} from "@testing-library/angular";

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [MessageService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should change theme colors when theme button is clicked', () => {
    const themeButton = fixture.debugElement.query(By.css('[data-testid="theme-button"]'));
    const image = themeButton.query(By.css('img'));

    themeButton.nativeElement.click();

    fixture.detectChanges();

    expect(image.nativeElement.src).toContain('moon');
  })

  it ('should change theme class when theme button is clicked', () => {
    const themeButton = fixture.debugElement.query(By.css('[data-testid="theme-button"]'));

    themeButton.nativeElement.click();

    fixture.detectChanges();
  })

});

// beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       providers: [MessageService],
//     }).compileComponents();
//   })
//
//   test('should render navbar', async () => {
//     await render(NavbarComponent)
//
//     expect(screen).toBeInTheDocument();
//   })
