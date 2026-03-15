import { OnChanges, OnInit, SimpleChanges } from '@angular/core';
/* eslint-disable @nx/enforce-module-boundaries */
import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';
export interface ITabs {
  name: string;
  router: string;
  icon: string;
  visible?: () => boolean;
}
@Component({
  selector: 'lib-shared-tabs',
  imports: [
    CommonModule,
    MenuModule,
    TranslateModule,
    RouterLink,
    RouterLinkActive,
  ],
  standalone: true,
  templateUrl: './shared-tabs.component.html',
  styleUrl: './shared-tabs.component.scss',
})
export class SharedTabsComponent implements OnChanges,OnInit {
  constructor(private _PermissionSystemService: PermissionSystemService) {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['tabs']) {
      console.log('tabs changes: ', simpleChanges['tabs']);
      console.log('tabs: ', this.tabs);

      this.handleTabs();
    }
  }

  ngOnInit() {
    const hasNoTabsYet = !this.tabs || this.tabs.length === 0;
    console.log('hasNoTabsYet: ',hasNoTabsYet);
    
    if (hasNoTabsYet) {
      this.initDefaultTabs();
    }
    
  }
  handleTabs() {
    const defaultTabs: ITabs[] = [];
    if (!this.dynamicOverView) {
      defaultTabs.push({
        name: 'TABS.OVERVIEW',
        router: 'overview',
        icon: 'fi-rr-apps',
        visible: () =>
          this._PermissionSystemService.can(
            this.permissionFeature().module,
            this.permissionFeature().feature,
            'VIEW'
          ),
      });
    }
    this.totalTabs = [...defaultTabs, ...this.tabs];
    if (this.hasComments) {
      this.totalTabs.push({
        name: 'TABS.COMMENTS',
        router: 'comments',
        icon: 'fi-rr-comment',
        visible: () =>
          this._PermissionSystemService.can(
            this.permissionFeature().module,
            this.permissionFeature().feature + '_COMMENT',
            'VIEW'
          ),
      });
    }

    if (this.hasAttachments) {
      this.totalTabs.push({
        name: 'TABS.ATTACHMENTS',
        router: 'attachments',
        icon: 'fi fi-rr-clip-file',
        visible: () =>
          this._PermissionSystemService.can(
            this.permissionFeature().module,
            this.permissionFeature().feature + '_ATTACHMENT',
            'VIEW'
          ),
      });
    }
  }

  initDefaultTabs() {
    const defaultTabs: ITabs[] = [];
    if (!this.dynamicOverView) {
      defaultTabs.push({
        name: 'TABS.OVERVIEW',
        router: 'overview',
        icon: 'fi-rr-apps',
        visible: () =>
          this._PermissionSystemService.can(
            this.permissionFeature().module,
            this.permissionFeature().feature,
            'VIEW'
          ),
      });
    }
    if (this.hasComments) {
      defaultTabs.push({
        name: 'TABS.COMMENTS',
        router: 'comments',
        icon: 'fi-rr-comment',
        visible: () =>
          this._PermissionSystemService.can(
            this.permissionFeature().module,
            this.permissionFeature().feature + '_COMMENT',
            'VIEW'
          ),
      });
    }

    if (this.hasAttachments) {
      defaultTabs.push({
        name: 'TABS.ATTACHMENTS',
        router: 'attachments',
        icon: 'fi fi-rr-clip-file',
        visible: () =>
          this._PermissionSystemService.can(
            this.permissionFeature().module,
            this.permissionFeature().feature + '_ATTACHMENT',
            'VIEW'
          ),
      });
    }
    this.totalTabs = defaultTabs;
  }
  @Input() hasComments: boolean = true;
  @Input() hasAttachments: boolean = true;
  @Input() dynamicOverView: boolean = false;
  @Input() tabs: ITabs[] = [];
  totalTabs: ITabs[] = [];
  permissionFeature = input<{ module: string; feature: string }>({
    module: '',
    feature: '',
  });
}
