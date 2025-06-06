import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

/**
 * Componente Modal de Subida de Contenido
 * 
 * Este componente proporciona una interfaz modal para que los usuarios suban
 * imágenes y videos al sistema desde archivos locales únicamente.
 * 
 * Funcionalidades principales:
 * - Auto-rellenado del username con el usuario logueado
 * - Subida solo desde archivos locales
 * - Validación de campos obligatorios y tipos de archivo
 * - Diferenciación entre subida de imágenes y videos
 * - Previsualización de archivos seleccionados
 * - Prevención de subida para usuarios no logueados
 * 
 * Funcionalidades especiales:
 * - Validación de tipos de archivo permitidos
 * - Previsualización de imágenes antes de subir
 * - Indicador de progreso durante la subida
 * - Limpieza automática de formulario al cerrar
 */
@Component({
  selector: 'app-upload-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.css']
})
export class UploadModalComponent implements OnInit {
  /* Controla la visibilidad del modal - recibido del componente padre */
  @Input() showModal: boolean = false;
  
  /* Tipo de contenido a subir - determina qué campos mostrar */
  @Input() type: 'image' | 'video' = 'image';
  
  /* Evento emitido cuando se solicita cerrar el modal */
  @Output() closeModal = new EventEmitter<void>();
  
  /* Evento emitido cuando se completa la subida con éxito */
  @Output() uploadSuccess = new EventEmitter<void>();

  // === CAMPOS DEL FORMULARIO ===
  
  /* Nombre de usuario que sube el contenido - auto-rellenado si está logueado */
  username: string = '';

  /* Archivo principal seleccionado (imagen o video) */
  selectedFile: File | null = null;

  /* Archivo de miniatura seleccionado (solo para videos) */
  selectedMiniatureFile: File | null = null;

  /* URL para previsualización de imagen */
  previewUrl: string | null = null;

  /* Usuario actualmente logueado (null si no hay sesión) */
  currentUser: User | null = null;

  /* Indica si hay una subida en progreso */
  isUploading: boolean = false;

  /* Mensaje de error a mostrar */
  errorMessage: string = '';

  /**
   * Constructor del componente
   * @param authService - Servicio de autenticación para obtener usuario actual
   * @param http - Cliente HTTP para realizar subidas de archivos
   */
  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  /**
   * Método del ciclo de vida de Angular
   * Se ejecuta después de inicializar el componente
   * Configura la suscripción al usuario actual y auto-rellena el username
   */
  ngOnInit() {
    /* Suscribirse a cambios del usuario actual para actualizar automáticamente */
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.username = user.username;  /* Auto-rellenar con usuario logueado */
      } else {
        this.username = '';             /* Limpiar si no hay usuario */
        this.clearForm();
      }
    });
  }

  /**
   * Maneja la selección de archivos
   */
  onFileSelected(event: any, fileType: 'main' | 'miniature') {
    const file = event.target.files[0];
    if (!file) return;

    this.errorMessage = '';

    // Validar tamaño (50MB máximo)
    if (file.size > 50 * 1024 * 1024) {
      this.errorMessage = 'El archivo es demasiado grande. Máximo 50MB permitido.';
      return;
    }

    if (fileType === 'main') {
      this.selectedFile = file;
      
      // Generar previsualización para imágenes
      if (this.type === 'image' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrl = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    } else {
      this.selectedMiniatureFile = file;
    }
  }

  /**
   * Formatea el tamaño del archivo en formato legible
   */
  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Verifica si el formulario es válido para permitir la subida
   */
  get isValid(): boolean {
    if (!this.username.trim()) return false;
    if (!this.selectedFile) return false;
    if (this.type === 'video' && !this.selectedMiniatureFile) return false;
    return true;
  }

  /**
   * Obtiene el texto del botón de envío según el estado
   */
  getSubmitButtonText(): string {
    if (this.isUploading) return 'Subiendo...';
    if (!this.currentUser) return 'Debes iniciar sesión';
    if (!this.isValid) return 'Completa los campos';
    return this.type === 'image' ? 'Subir Foto' : 'Subir Video';
  }

  /**
   * Maneja la acción de subir contenido
   */
  async submit() {
    if (!this.isValid || this.isUploading || !this.currentUser) return;

    this.isUploading = true;
    this.errorMessage = '';

    try {
      await this.uploadFiles();
      this.uploadSuccess.emit();
      this.close();
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al subir el archivo';
    } finally {
      this.isUploading = false;
    }
  }

  /**
   * Sube archivos al servidor
   */
  private async uploadFiles(): Promise<void> {
    const formData = new FormData();
    formData.append('username', this.username);

    if (this.type === 'image') {
      formData.append('image', this.selectedFile!);
      await this.http.post('http://localhost:8080/Image', formData).toPromise();
    } else {
      formData.append('video', this.selectedFile!);
      formData.append('miniature', this.selectedMiniatureFile!);
      await this.http.post('http://localhost:8080/Video', formData).toPromise();
    }
  }

  /**
   * Maneja la acción de cerrar el modal
   */
  close() {
    this.clearForm();
    this.closeModal.emit();
  }

  /**
   * Limpia todos los campos del formulario
   */
  private clearForm() {
    this.selectedFile = null;
    this.selectedMiniatureFile = null;
    this.previewUrl = null;
    this.errorMessage = '';
    this.isUploading = false;
  }
} 