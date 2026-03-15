import { AuthService } from 'libs/features/auth/src/services/auth.service';
import { Component, ElementRef, EventEmitter, Input, input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { a } from '@angular/cdk/scrolling-module.d-ud2XrbF8';
import PerfectScrollbar from 'perfect-scrollbar';
import { ButtonModule } from 'primeng/button';
import * as moment from 'moment';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { MenuModule } from 'primeng/menu';
import { TranslateModule } from '@ngx-translate/core';
import { ImgSystemComponent } from '../img-system/img-system.component';

@Component({
  selector: 'lib-comment-section',
  imports: [CommonModule, ButtonModule , FormsModule,MenuModule,TranslateModule,ImgSystemComponent],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.scss',
})
export class CommentSectionComponent implements OnInit,OnChanges{

  constructor(private authService: AuthService,private _SharedService:SharedService) { }
  ngOnChanges(changes: SimpleChanges): void {
     if (changes['relatedColumnId']){
      this.showComments()
     }
  }
  @Input() isExternal:boolean = false
  dataEntity_id = input()
  relatedEntityId=input<any>()
  relatedColumnId=input<any>()
  data_id = input()
  action_items = input<any[]>();
  @Output() deleteCommentEvent = new EventEmitter<any>();
  @Output() updateCommentEvent = new EventEmitter<{message:any, newContent:string}>();

  current_user_id: number = 3;

  messages: any[] = []
  editingMessage: any = null;

  ngOnInit(): void {
    console.log("" , this.dataEntity_id);
    this.current_user_id=this.authService.current_login_user_data.value?.userId;
    console.log(this.current_user_id , "Current User ID");
    this.showComments()
    this.action_itemsArray=this.action_items()
  }
  showComments(){
    this._SharedService.getComments(this.relatedEntityId(),this.relatedColumnId()).subscribe((res:any)=>{
      this.messages = res.data;
      this.groupCommentsByDate();
      this.scrollToBottom()
      console.log("groupComments" , this.groupedComments);

    },(err)=>{
      console.error("Error fetching comments", err);
    })
  }



  action_itemsArray:any

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  private ps!: PerfectScrollbar;

    ngAfterViewInit(): void {
    this.scrollToBottom();
  }


    scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer && this.scrollContainer.nativeElement) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }

  message_text: string = '';
  groupedComments:any
  groupCommentsByDate() {
    const today = moment(new Date());
    const yesterday = moment(today).subtract(1, 'days');

    const grouped = this.messages.reduce((acc, comment) => {
      const commentDate = moment(comment.createAt);
      let dateKey: string;

      if (commentDate.isSame(today, 'day')) {
        dateKey = 'Today';
      } else if (commentDate.isSame(yesterday, 'day')) {
        dateKey = 'Yesterday';
      } else {
        dateKey = commentDate.format('MMM D, YYYY');
      }

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(comment);
      return acc;
    }, {} as { [key: string]: Comment[] });

    this.groupedComments = Object.keys(grouped)
      .map(key => ({
        date: key,
        comments: grouped[key].sort((a:any, b:any) =>
          moment(a.createAt).diff(moment(b.createAt))
        ),
      }))
      .sort((a, b) => {
        if (a.date === 'Today') return -1;
        if (b.date === 'Today') return 1;
        if (a.date === 'Yesterday') return -1;
        if (b.date === 'Yesterday') return 1;
        return moment(b.comments[0].createAt).diff(moment(a.comments[0].createAt));
      }).reverse()
  }

  formatTime(date: string): string {
    return moment(date).format('HH:mm:ss');
  }

handleAddMessage(newMessage: string): void {
  if (!newMessage.trim()) return;

  if (this.editingMessage) {
    const updated = { ...this.editingMessage, content: newMessage };
    updated.commentId = updated['commentID'];

    this._SharedService.updateComment(
      updated.commentId,
      updated.commentId,
      updated.content
    ).subscribe(() => {
      console.log('Comment updated');
      this.showComments();
      this.editingMessage = null;
      this.message_text = '';
    });

  } else {
    const payload = {
      dataEntityTypeID: this.relatedEntityId(),
      content: newMessage,
      dataEntityID:this.relatedColumnId(),
      commentGroupID: +this.relatedEntityId()
    };

    this._SharedService.createComment(payload,this.isExternal).subscribe(() => {
      this.showComments();
      this.message_text = '';
    });
  }
}

getActionItems(message: any) {
  return [
    {
      label: 'Delete comment',
      icon: 'fi fi-rr-trash',
      command: () => {
        this.deleteCommentEvent.emit(message);
      }
    },
    {
      label: 'Update comment',
      icon: 'fi fi-rr-pencil',
       command: () => {
        this.editingMessage = message;
        this.message_text = message.content;
      }
    }
  ];
}

}
