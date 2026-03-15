import { Component, EventEmitter, Input, input, Output, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from "primeng/menu";
import { LoaderComponent } from "../loader/loader.component";
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { TranslationsService } from 'apps/gfw-portal/src/app/core/services/translate.service';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PermissionSystemService } from 'apps/gfw-portal/src/app/core/services/permission.service';

@Component({
  selector: 'lib-cards-list',
  imports: [CommonModule, MenuModule, LoaderComponent, TranslateModule,EmptyStateComponent],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss',
})
export class CardsListComponent {
  @Input() externalAction: { label?: string; toolTip?: string; }|null = null;
  @Output() externalActionEmitter: EventEmitter<any> = new EventEmitter();
  list_title = input<string>();
  @Input() card_title_selector: string = '';
  @Input() card_sub_selector: string = '';
  entityID_Name = input<string>();
  openModal = output<any>();
  total_items = input<any>();
  badge_title = input<string>();
  data_list = input<any[]>();
  items_actions = input<any>();
  view_entityRouter = input<string>();

  loadingState = input<boolean>(false);

  selected_item_emiter = output<any>();
  currentLang!:string
  constructor(private _Router: Router, private translateServices:TranslationsService,private _PermissionSystemService:PermissionSystemService) {
    this.translateServices.selected_lan_sub.subscribe(lang  => this.currentLang = lang)
  }
  handleColumnClick(row: any, i: any) {
   if(!this._PermissionSystemService.can(this.table_actions_permissions()?.module , this.table_actions_permissions()?.feature , this.table_actions_permissions()?.action)) return;
    const route = this.view_entityRouter();
    if (route === 'openModal=true') {
      this.openModal.emit(row);
    } else {
      if(!this.view_entityRouter())return
      this._Router.navigate([
        this.view_entityRouter(),
        row[`${this.entityID_Name()}`],
      ]);
    }
  }

  emitExternalAction(event: Event, item: any) {
    event.stopPropagation();
    this.externalActionEmitter.emit(item);
  }

    table_actions_permissions = input<{ module: string, feature: string, action: string }>({module:'',feature:'',action:''})
}
