import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from "primeng/button";
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { AttachUiComponent } from "../attach-ui/attach-ui.component";
@Component({
  selector: 'lib-attachment-list',
  imports: [CommonModule, Button, TranslateModule, DialogModule, AttachUiComponent],
  templateUrl: './attachment-list.component.html',
  styleUrl: './attachment-list.component.scss',
})
export class AttachmentListComponent {

  dataList:any[] =[
    {
      id:1,
      name:"Tech design requirements.pdf",
      FileType:"pdf",
      size:"1.2 MB",
      AttachType:"Restricted"
    },
    {
      id:2,
      name:"Project plan.docx",
      FileType:"docx",
      size:"500 KB",
      AttachType:"Public"
    },
    {
      id:3,
      name:"Budget report.xlsx",
      FileType:"xlsx",
      size:"2.5 MB",
      AttachType:"Restricted"
    },
    {
      id:4,
      name:"Meeting notes.txt",
      FileType:"txt",
      size:"200 KB",
      AttachType:"Public"
    },
    {
      id:5,
      name:"Design mockup.png",
      FileType:"png",
      size:"1.8 MB",
      AttachType:"Restricted"
    }
  ];


  addAttachmentVisible:boolean = false;


}
