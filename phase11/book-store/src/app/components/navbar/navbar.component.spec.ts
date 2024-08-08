import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {NavbarComponent} from './navbar.component';
import {MessageService} from "primeng/api";
import {By} from "@angular/platform-browser";

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

  it('should change theme colors when theme button is clicked', () => {
    // Arrange
    const themeButton = fixture.debugElement.query(By.css('[data-testid="theme-button"]'));
    const image = themeButton.query(By.css('img'));

    // Act
    themeButton.triggerEventHandler('click');
    fixture.detectChanges();

    // Assert
    expect(image.nativeElement.src).toContain('moon');
  })

  it('should change theme class when theme button is clicked', fakeAsync(() => {
    const themeButton = fixture.debugElement.query(By.css('[data-testid="theme-button"]'));

    themeButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    themeButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const newThemeButtonContainer = fixture.debugElement.query(By.css('[data-testid="theme-button"]'));
    const newThemeButton = newThemeButtonContainer.query(By.css('.theme-container'));

    expect(getComputedStyle(newThemeButton.nativeElement).backgroundColor).toBe('rgb(245, 245, 255)');
  }));
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
