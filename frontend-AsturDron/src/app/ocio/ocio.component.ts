import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingService, RankingDTO } from '../services/ranking.service';

@Component({
  selector: 'app-ocio',
  templateUrl: './ocio.component.html',
  styleUrls: ['./ocio.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class OcioComponent implements OnInit {
  rankings: RankingDTO[] = [];
  showAllRankings: boolean = false;
  activeSection: 'fotos' | 'videos' | 'ranking' = 'fotos';
  error: string = '';

  constructor(private rankingService: RankingService) {}

  ngOnInit() {
    this.loadTop3Ranking();
  }

  loadTop3Ranking() {
    this.rankingService.getRankingTop3().subscribe({
      next: (data) => {
        this.rankings = data;
        this.showAllRankings = false;
      },
      error: (err) => {
        console.error('Error loading top 3 ranking:', err);
        this.error = 'Error al cargar el ranking';
      }
    });
  }

  loadAllRanking() {
    this.rankingService.getAllRanking().subscribe({
      next: (data) => {
        this.rankings = data;
        this.showAllRankings = true;
      },
      error: (err) => {
        console.error('Error loading all ranking:', err);
        this.error = 'Error al cargar el ranking completo';
      }
    });
  }

  toggleRankingView() {
    if (this.showAllRankings) {
      this.loadTop3Ranking();
    } else {
      this.loadAllRanking();
    }
  }

  setActiveSection(section: 'fotos' | 'videos' | 'ranking') {
    this.activeSection = section;
    if (section === 'ranking') {
      this.loadTop3Ranking();
    }
  }
}
