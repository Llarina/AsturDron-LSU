import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-button" (click)="close()">×</button>
        
        <h2>{{ type === 'image' ? 'Subir Foto' : 'Subir Video' }}</h2>
        
        <!-- Campo temporal hasta implementar gestión de usuarios -->
        <div class="form-group">
          <label>Nombre de usuario:</label>
          <input type="text" [(ngModel)]="username" placeholder="Introduce tu nombre de usuario">
        </div>
        
        <div class="form-group">
          <label>URL {{ type === 'image' ? 'de la imagen' : 'del video' }}:</label>
          <input type="text" [(ngModel)]="url" placeholder="Introduce la URL">
        </div>

        <div class="form-group" *ngIf="type === 'video'">
          <label>URL de la miniatura:</label>
          <input type="text" [(ngModel)]="miniatureUrl" placeholder="Introduce la URL de la miniatura">
        </div>

        <button class="submit-button" (click)="submit()" [disabled]="!isValid">
          Publicar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      position: relative;
      width: 90%;
      max-width: 500px;
      background-color: white;
      border-radius: 8px;
      padding: 20px;
    }

    .close-button {
      position: absolute;
      top: -15px;
      right: -15px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: white;
      border: none;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1001;
    }

    .close-button:hover {
      background-color: #e0e0e0;
    }

    h2 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      color: #666;
    }

    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .submit-button {
      width: 100%;
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }

    .submit-button:hover {
      background-color: #0056b3;
    }

    .submit-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class UploadModalComponent {
  @Input() type: 'image' | 'video' = 'image';
  @Output() closeModal = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<{username: string, url: string, miniatureUrl?: string}>();

  username: string = '';
  url: string = '';
  miniatureUrl: string = '';

  get isValid(): boolean {
    if (!this.username || !this.url) return false;
    
    if (this.type === 'image') {
      return true;
    }
    return !!this.miniatureUrl;
  }

  close() {
    this.closeModal.emit();
  }

  submit() {
    if (!this.isValid) return;

    if (this.type === 'image') {
      this.onSubmit.emit({ username: this.username, url: this.url });
    } else {
      this.onSubmit.emit({ username: this.username, url: this.url, miniatureUrl: this.miniatureUrl });
    }
    this.close();
  }
} 