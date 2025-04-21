import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPageSettingComponent } from './client-page-setting.component';

describe('ClientPageSettingComponent', () => {
  let component: ClientPageSettingComponent;
  let fixture: ComponentFixture<ClientPageSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientPageSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientPageSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
