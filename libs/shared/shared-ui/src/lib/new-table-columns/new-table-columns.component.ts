import { Component, effect, input, OnInit, output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from "primeng/dropdown";
import { OverlayPanel, OverlayPanelModule } from "primeng/overlaypanel";
import { newProfile } from '../../models/newProfiles';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { ButtonModule } from "primeng/button";
import { SharedService } from '../../services/shared.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Column } from '../../models/columns.model';
import { DialogModule } from "primeng/dialog";
import { Observable } from 'rxjs/internal/Observable';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { finalize } from 'rxjs';

@Component({
  selector: 'lib-new-table-columns',
  imports: [CommonModule,
    InputTextModule,
    DragDropModule,
    CdkDropList,
    InputSwitchModule,
    CdkDrag,
    ReactiveFormsModule,
    DropdownModule, FormsModule, TranslateModule, OverlayPanelModule, ButtonModule, DialogModule],
  templateUrl: './new-table-columns.component.html',
  styleUrl: './new-table-columns.component.scss',
})
export class NewTableColumnsComponent implements OnInit {


  dataViewId = input.required<number>()
  columns_afterResize = input<{isResize:boolean , columns: Column[]}>();
  columns_data_emiter = output<Column[]>()

  ngOnInit(): void {
    console.log("dataViewId changed init", this.dataViewId());
    this.current_dataViewId = this.dataViewId()
    this.getEntityColumns()

  }

  current_dataViewId: number = 0;

  columns: Column[] = [];
  edit_column_flag: boolean = false;
  profiles: newProfile[] = [];
  defultProfileDeep!: newProfile;
  showPin: boolean = true;
  defultProfile!: newProfile
  profile_name: string = ''

  getEntityColumns() {
    this._SharedService.getDataEntityColumns(this.dataViewId()).subscribe((res: any) => {
      console.log("res columns", res);

      this.defultProfile = {
        profileId: 0,
        profileName: 'Defult Profile',
        isDefult: false,
        columns: res?.data?.columnDefinitions
      }

      this.defultProfileDeep = JSON.parse(JSON.stringify(this.defultProfile ?? {} as newProfile))

      const profiles = res?.data?.userColumnProfiles.map((profile: newProfile) => {
        return {
          ...profile,
          columns: profile.columns.map((col: any, i) => {
            return {
              ...col,
              displayName: res?.data?.columnDefinitions?.find((colD: any) => colD?.id == col?.id)?.label,
              dataMap: res?.data?.columnDefinitions?.find((colD: any) => colD?.id == col?.id)?.dataMap,
              filed: res?.data?.columnDefinitions?.find((colD: any) => colD?.id == col?.id)?.filed
            }
          })
        }

      })


      this.profiles = [this.defultProfile, ...profiles];

      const isSelected = this.profiles.find((prof: any) => prof?.profileId == res?.data?.selectedProfileID)
      if (isSelected && isSelected?.profileId != 0) {
        this.selectedProfile.set(isSelected)
        this.columns = this.selectedProfile()?.columns
        this.edit_column_flag = true
      } else {
        this.selectedProfile.set(this.defultProfile)
        this.columns = this.selectedProfile()?.columns;

        this.edit_column_flag = false
      }


      this.columns_data_emiter.emit(this.columns)

    })
  }

  constructor(private _SharedService: SharedService, private _MessageService: MessageService) {
    effect(() => {
      if (this.show_overlay()?.isShow) {
        this.table_columns.toggle(this.show_overlay().event)
      }



    })


    effect(() => {

      if (this.dataViewId() != this.current_dataViewId) {
        console.log("dataViewId changed effect", this.dataViewId());
        this.getEntityColumns()
        this.current_dataViewId = this.dataViewId()
      }
    })



    effect(()=>{
      if(this.columns_afterResize() && this.columns_afterResize()?.isResize){
        this.columns = this.columns_afterResize()?.columns || [];
      }
    })



  }


  show_overlay = input.required<{ isShow: boolean, event: PointerEvent }>()

  @ViewChild('table_columns') table_columns!: OverlayPanel


  getShownGolumns(): number {
    const shownColumns = this.columns?.filter((col: any) => col?.isShown)

    return shownColumns?.length
  }
  selectedProfile = signal<newProfile>({} as newProfile);

  handleSelectedColumnProfile(event: any) {
    console.log("event selec6ted ", event.value);
    this.columns = event.value.columns
    if (event?.value?.profileId == 0) {
      this.edit_column_flag = false
    } else {
      this.edit_column_flag = true;
    }



    this.columns_data_emiter.emit(this.columns)
  }

  isAllColumnsChecked: boolean = false;
  handleChangeCheckAllColumns() {
    if (this.isAllColumnsChecked) {
      this.columns.map((col: any) => {
        col.isShown = true
      })
    } else {
      this.columns.map((col: any, i: number) => {
        if (i > 2) {

          col.isShown = false
        } else {
          col.isShown = true
        }
      })
    }

    this.columns_data_emiter.emit(this.columns)
  }


  drop(event: CdkDragDrop<any[]>) {
    const prev = this.columns[event.previousIndex];
    const curr = this.columns[event.currentIndex];

    if (prev.isFixed || curr.isFixed) {
      return;
    }

    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.columns_data_emiter.emit(this.columns)

  }


  handleFixedColumn(col: any) {




    if (col.isFixed) {
      col.isFixed = false;
      col.isResizable = true;
      const fixed = this.columns.filter((c: any) => c.isFixed);
      if (fixed.length < 2) {
        this.showPin = true;
        return;
      }
    } else {

      col.isFixed = true;
      col.isResizable = false;
      const fixed = this.columns.filter((c: any) => c.isFixed);
      if (fixed.length == 2) {
        this.showPin = false;
        return;
      }

    }

    this.columns_data_emiter.emit(this.columns)



  }


  showProfileName: boolean = false
  loadSaveProfileColumn: boolean = false

  shouldDisableSwitch(col: any): boolean {
    if (col.isFixed) return true;

    const activeCount = this.columns.filter((c: { isShown: any; isFixed: any; }) => c.isShown && !c.isFixed).length;
    if (col.isShown && activeCount <= 3) {
      return true;
    }

    return false;
  }


  handledRestColumns() {
    this.profiles[0] = JSON.parse(JSON.stringify(this.defultProfileDeep ?? {} as newProfile))
    this.selectedProfile.set(JSON.parse(JSON.stringify(this.defultProfileDeep ?? {} as newProfile)))
    this.columns = this.selectedProfile().columns
    this.edit_column_flag = false;
    this.columns_data_emiter.emit(this.columns)

  }



  handledToggleStatusColumnProfile() {
    if (this.edit_column_flag) {
      this.profile_name = this.selectedProfile().profileName
    } else {
      this.profile_name = ''
    }
  }


  handleSaveProfile() {
    this.loadSaveProfileColumn = true
    const req: any = {
      dataViewID: this.dataViewId(),
      profileName: this.profile_name,
      columns: this.selectedProfile().columns.map((col: any) => {
        return {
          "id": col.id,
          "isFixed": col.isFixed,
          "isShown": col.isShown,
          "isSortable": col.isSortable,
          "isResizable": col.isResizable,
          "filed": col.filed,
          "width":col.width || 100
        }
      })
    }

    if (this.edit_column_flag) {
      req.columnProfileID = this.selectedProfile().profileId;
      delete req.dataViewID
    }

    const API_CALL$: Observable<any> = this.edit_column_flag ? this._SharedService.updateProfileColumns(req) : this._SharedService.addNewProfileColumns(req)

    API_CALL$.pipe(finalize(() => this.loadSaveProfileColumn = false)).subscribe((res) => {
      this.profiles[0] = this.defultProfileDeep
      this.loadSaveProfileColumn = false
      this.showProfileName = false
      this._MessageService.add({ severity: 'success', summary: 'Success', detail: this.edit_column_flag ? 'Column Profile Updated Successfully' : 'Column Profile Added Successfully' })
      const new_profile = {
        profileId: this.edit_column_flag ? Number(this.selectedProfile().profileId) : Number(this.profiles[this.profiles.length - 1].profileId + 14),
        profileName: this.profile_name,
        isDefult: false,
        columns: this.selectedProfile().columns
      }


      if (this.edit_column_flag) {
        const current_index = this.profiles.findIndex((prof: any) => prof.profileId == this.selectedProfile().profileId)

        this.profiles[current_index] = new_profile;
        this.selectedProfile.set(new_profile)
      } else {
        this.profiles.push(new_profile)
        this.selectedProfile.set(new_profile)
        this.edit_column_flag = true
      }
    })


  }

  loadingDeleteProfile: boolean = false
  handleDeleteColumnProfile() {
    this.loadingDeleteProfile = true
    this._SharedService.deleteProfileColumns(this.selectedProfile()?.profileId).pipe((finalize(() => this.loadingDeleteProfile = false))).subscribe((res) => {
      const i = this.profiles.findIndex((prof: any) => prof?.profileId == this.selectedProfile()?.profileId)
      this.profiles.splice(i, 1)
      this.selectedProfile.set(this.profiles[0])
      this.columns = this.selectedProfile().columns
      this.edit_column_flag = false;
      this.columns_data_emiter.emit(this.columns)
      this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'Profile deleted successfully.' })
    })
  }
}
