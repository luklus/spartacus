import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  I18nTestingModule,
  Permission,
  Period,
  PermissionService,
} from '@spartacus/core';
import { ModalService, TableModule } from '@spartacus/storefront';
import { UrlTestingModule } from 'projects/core/src/routing/configurable-routes/url-translation/testing/url-testing.module';
import { IconTestingModule } from 'projects/storefrontlib/src/cms-components/misc/icon/testing/icon-testing.module';
import { SplitViewTestingModule } from 'projects/storefrontlib/src/shared/components/split-view/testing/spit-view-testing.module';
import { of } from 'rxjs';
import { PermissionType } from '../form/permission-form.service';
import { PermissionDetailsComponent } from './permission-details.component';

import createSpy = jasmine.createSpy;

const permissionCode = 'b1';

const mockPermission: Permission = {
  code: permissionCode,
  orderApprovalPermissionType: {
    code: PermissionType.TIMESPAN,
    name: 'Type',
  },
  threshold: 10000,
  currency: {
    symbol: '$',
    isocode: 'USD',
  },
  periodRange: Period.WEEK,
  orgUnit: { name: 'orgName', uid: 'orgCode' },
};
class MockPermissionService implements Partial<PermissionService> {
  loadPermission = createSpy('loadPermission');
  get = createSpy('get').and.returnValue(of(mockPermission));
  update = createSpy('update');
}

class MockActivatedRoute {
  params = of({ code: permissionCode });

  snapshot = {};
}

class MockModalService {
  open() {}
}

describe('PermissionDetailsComponent', () => {
  let component: PermissionDetailsComponent;
  let fixture: ComponentFixture<PermissionDetailsComponent>;
  // let permissionService: PermissionService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        I18nTestingModule,
        UrlTestingModule,
        SplitViewTestingModule,
        TableModule,
        IconTestingModule,
      ],
      declarations: [PermissionDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: PermissionService, useClass: MockPermissionService },
        { provide: ModalService, useClass: MockModalService },
      ],
    }).compileComponents();

    // permissionService = TestBed.inject(PermissionService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});