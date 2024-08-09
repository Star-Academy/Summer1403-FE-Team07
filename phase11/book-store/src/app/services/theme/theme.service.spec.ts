import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('service SHOULD be created WHEN ever', () => {
    expect(service).toBeTruthy();
  });

  it('onToggle method SHOULD be defined WHEN ever', () => {
    expect(service.onToggle).toBeDefined();
  });

  it('onToggle method SHOULD toggle theme WHEN called', () => {
    // Arrange

    // Act
    service.toggleTheme(false);

    // Assert
    expect(document.body.getAttribute('data-theme')).toBe('dark');
  });
});
