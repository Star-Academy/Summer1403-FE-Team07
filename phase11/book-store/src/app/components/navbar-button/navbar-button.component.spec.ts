import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarButtonComponent } from './navbar-button.component';
import { Button } from 'primeng/button';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ButtonData } from '../../models/ButtonData';
import { NgOptimizedImage } from '@angular/common';

describe('NavbarButtonComponent', () => {
  let sut: NavbarButtonComponent;
  let fixture: ComponentFixture<NavbarButtonComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarButtonComponent, Button, NgOptimizedImage],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarButtonComponent);
    sut = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('SHOULD create the component WHEN initialized', () => {
    expect(sut).toBeTruthy();
  });

  it('SHOULD display the correct image attributes WHEN buttonData is set', () => {
    // Arrange
    const buttonData: ButtonData = {
      containerClass: 'test-container',
      imageSrc: 'test-image.jpg',
      alt: 'test image',
      height: 50,
      width: 50,
    };
    sut.buttonDate = buttonData;

    // Act
    fixture.detectChanges();

    // Assert
    const imgElement = debugElement.query(By.css('img'));
    expect(imgElement.nativeElement.src).toContain(buttonData.imageSrc);
    expect(imgElement.nativeElement.alt).toBe(buttonData.alt);
    expect(imgElement.nativeElement.height).toBe(buttonData.height);
    expect(imgElement.nativeElement.width).toBe(buttonData.width);
    expect(imgElement.nativeElement.classList).toContain('test-container__img');
  });

  it('SHOULD apply the correct container class WHEN buttonData is set', () => {
    // Arrange
    const buttonData: ButtonData = {
      containerClass: 'test-container',
      imageSrc: 'test-image.jpg',
      alt: 'test image',
      height: 50,
      width: 50,
    };
    sut.buttonDate = buttonData;

    // Act
    fixture.detectChanges();

    // Assert
    const containerElement = debugElement.query(By.css('div'));
    expect(containerElement.nativeElement.classList).toContain(
      buttonData.containerClass,
    );
  });
});
