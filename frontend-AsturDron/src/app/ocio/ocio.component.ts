import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingService, RankingDTO } from '../services/ranking.service';
import { ImageService, ImageDTO } from '../services/image.service';
import { VideoService, VideoDTO } from '../services/video.service';
import { VideoModalComponent } from '../components/video-modal/video-modal.component';
import { UploadModalComponent } from '../components/upload-modal/upload-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ocio',
  templateUrl: './ocio.component.html',
  styleUrls: ['./ocio.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, VideoModalComponent, UploadModalComponent]
})
export class OcioComponent implements OnInit {
  rankings: RankingDTO[] = [];
  images: ImageDTO[] = [];
  videos: VideoDTO[] = [];
  showAllRankings: boolean = false;
  activeSection: 'fotos' | 'videos' | 'ranking' = 'fotos';
  error: string = '';
  selectedVideo: string | null = null;
  showUploadModal: boolean = false;

  constructor(
    private rankingService: RankingService,
    private imageService: ImageService,
    private videoService: VideoService
  ) {}

  ngOnInit() {
    this.loadTop3Ranking();
    this.loadImages();
  }

  loadImages() {
    this.imageService.getAllImages().subscribe({
      next: (data) => {
        this.images = data;
        this.error = '';
      },
      error: (err) => {
        console.error('Error loading images:', err);
        this.error = 'Error al cargar las imágenes';
      }
    });
  }

  loadVideos() {
    this.videoService.getAllVideos().subscribe({
      next: (data) => {
        this.videos = data;
        this.error = '';
      },
      error: (err) => {
        console.error('Error loading videos:', err);
        this.error = 'Error al cargar los videos';
      }
    });
  }

  openUploadModal() {
    this.showUploadModal = true;
  }

  closeUploadModal() {
    this.showUploadModal = false;
  }

  handleUpload(data: {username: string, url: string, miniatureUrl?: string}) {
    this.error = ''; // Limpiar error previo
    
    if (this.activeSection === 'fotos') {
      this.uploadImage(data.username, data.url);
    } else if (this.activeSection === 'videos' && data.miniatureUrl) {
      this.uploadVideo(data.username, data.url, data.miniatureUrl);
    }
  }

  uploadImage(username: string, url: string) {
    this.error = ''; // Limpiar error previo
    this.imageService.uploadImage(username, url).subscribe({
      next: () => {
        this.loadImages();
        this.showUploadModal = false;
      },
      error: (err) => {
        console.error('Error uploading image:', err);
        this.error = 'Error al subir la imagen: ' + (err.error?.message || err.message || 'Error desconocido');
      }
    });
  }

  uploadVideo(username: string, videoUrl: string, miniatureUrl: string) {
    this.error = ''; // Limpiar error previo
    this.videoService.uploadVideo(username, miniatureUrl, videoUrl).subscribe({
      next: (response) => {
        console.log('Video subido exitosamente:', response);
        this.loadVideos();
        this.showUploadModal = false;
      },
      error: (err) => {
        console.error('Error uploading video:', err);
        this.error = 'Error al subir el video: ' + (err.error?.message || err.message || 'Error desconocido');
      }
    });
  }

  loadTop3Ranking() {
    this.rankingService.getRankingTop3().subscribe({
      next: (data) => {
        this.rankings = data;
        this.showAllRankings = false;
        this.error = '';
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
        this.error = '';
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
      if (this.showAllRankings) {
        this.loadAllRanking();
      } else {
        this.loadTop3Ranking();
      }
    } else if (section === 'fotos') {
      this.loadImages();
    } else if (section === 'videos') {
      this.loadVideos();
    }
  }

  openVideo(videoUrl: string) {
    this.selectedVideo = videoUrl;
  }

  closeVideoModal() {
    this.selectedVideo = null;
  }
}
