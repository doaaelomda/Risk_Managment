import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IQuiz } from '../../types/quiz.interface';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CampaignService } from '../../services/campaign.service';
import { finalize } from 'rxjs';
import { SkeletonModule } from "primeng/skeleton";

@Component({
  selector: 'app-quizzes',
  imports: [CommonModule, InputTextModule, FormsModule, TranslateModule, SkeletonModule],
  templateUrl: './quizzes.component.html',
  styleUrl: './quizzes.component.scss',
})
export class QuizzesComponent implements OnInit {
  constructor(
    private router: Router,
    private campaignService: CampaignService
  ) {
    this.language = localStorage.getItem('user-language') || 'en';
  }
  ngOnInit() {
    this.getQuizzes();
  }
  language: string = 'en';
  quizzes: IQuiz[] = [];
  baseQuizzes: IQuiz[] = [];
  searchTerm: string = '';

  searchQuiz() {
    if (!this.searchTerm) {
      this.quizzes = this.baseQuizzes;
      return;
    }
    this.quizzes = this.baseQuizzes.filter((quiz) => {
      const matchedTitle = quiz.name
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const matchedDescription = quiz.description
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      return matchedTitle || matchedDescription;
    });
  }

  goToQuiz(quizId: number) {
    console.log('navigating to quiz: ', quizId);
    const url = `/campaigns/${quizId}`;
    this.router.navigate([url]);
  }
  gettingCampaigns:boolean = false
  getQuizzes() {
    this.gettingCampaigns = true
    this.campaignService.getUserCampaigns().pipe((finalize(() => this.gettingCampaigns = false))).subscribe({
      next: (res) => {
        console.log(res, 'got user campaigns');
        this.quizzes = res.data;
        this.baseQuizzes = res.data;
      },
    });
  }
}
