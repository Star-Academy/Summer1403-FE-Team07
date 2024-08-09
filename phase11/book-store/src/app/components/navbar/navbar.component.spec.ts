import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { MessageService } from 'primeng/api';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let sut: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    sut = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
    TestBed.resetTestingModule();
  });

  it('component SHOULD be created WHEN ever', () => {
    expect(sut).toBeTruthy();
  });

  it('theme icons SHOULD change WHEN theme button clicked', () => {
    // Arrange
    const themeButtonContainer = fixture.debugElement.query(
      By.css('[data-testid="theme-container"]'),
    );
    const themeIcon = themeButtonContainer.query(By.css('img'));

    // Act
    themeButtonContainer.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Assert
    expect(themeIcon.nativeElement.src).toContain('moon');
  });

  it('theme colors SHOULD change WHEN theme button clicked', fakeAsync(() => {
    // Arrange
    const themeButton = fixture.debugElement.query(
      By.css('[data-testid="theme-container"]'),
    );

    // Act
    themeButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Assert
    const newThemeButtonContainer = fixture.debugElement.query(
      By.css('[data-testid="theme-container"] .theme-container'),
    );

    expect(
      getComputedStyle(newThemeButtonContainer.nativeElement).backgroundColor,
    ).toBe('rgb(245, 245, 255)');
  }));
});
