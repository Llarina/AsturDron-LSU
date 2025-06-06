import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminService, NoticeCreateRequest } from '../services/admin.service';
import { User } from '../services/auth.service';
import { NoticeDTO, NoticeService } from '../services/notice.service';
import { ImageDTO } from '../services/image.service';
import { VideoDTO } from '../services/video.service';
import { ImageService } from '../services/image.service';
import { VideoService } from '../services/video.service';

/**
 * Componente del Panel de Administración
 * 
 * Este componente proporciona una interfaz completa para que el administrador
 * pueda gestionar usuarios, noticias, imágenes y videos del sistema.
 * 
 * Funcionalidades principales:
 * - Gestión de usuarios (ver y eliminar)
 * - Gestión de noticias (ver, crear, editar y eliminar)
 * - Gestión de imágenes (ver, puntuar y eliminar)
 * - Gestión de videos (ver, puntuar y eliminar)
 */
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminComponent implements OnInit, OnDestroy {
  // === VARIABLES DE ESTADO DE LA INTERFAZ ===

  /* Controla qué pestaña está actualmente activa en la interfaz */
  activeTab: 'users' | 'notices' | 'images' | 'videos' = 'users';

  /* Indica si hay una operación de carga en curso */
  loading = false;

  /* Almacena mensajes de error para mostrar al usuario */
  error = '';

  /* Almacena mensajes de éxito para mostrar al usuario */
  successMessage = '';

  // === ARRAYS DE DATOS ===

  /* Lista de todos los usuarios del sistema (excepto admin) */
  users: User[] = [];

  /* Lista de todas las noticias del sistema */
  notices: NoticeDTO[] = [];

  /* Lista de todas las imágenes del sistema */
  images: ImageDTO[] = [];

  /* Lista de todos los videos del sistema */
  videos: VideoDTO[] = [];

  // === CONTROL DE FORMULARIOS ===

  /* Controla si se muestra el formulario de crear noticia */
  showCreateNoticeForm = false;

  /* Datos del formulario para crear una nueva noticia */
  newNotice: NoticeCreateRequest = {
    titular: '',
    notice: '',
    dateYear: new Date().getFullYear().toString(),
    miniature: '',
    license: 'any'
  };

  /* Controla si se muestra el formulario de editar noticia */
  showEditNoticeForm = false;

  /* Datos del formulario para editar una noticia existente */
  editingNotice: NoticeCreateRequest & { id?: number } = {
    titular: '',
    notice: '',
    dateYear: new Date().getFullYear().toString(),
    miniature: '',
    license: 'any'
  };

  // === CONTROL DE SUBIDA DE ARCHIVOS ===

  /* Controla si usar subida de archivos en formulario de crear (true) o URL (false) */
  useFileUploadForCreate: boolean = false;

  /* Controla si usar subida de archivos en formulario de editar (true) o URL (false) */
  useFileUploadForEdit: boolean = false;

  /* Archivo seleccionado para miniatura en formulario de crear */
  selectedCreateFile: File | null = null;

  /* Archivo seleccionado para miniatura en formulario de editar */
  selectedEditFile: File | null = null;

  /* URL para previsualización de imagen en formulario de crear */
  createPreviewUrl: string | null = null;

  /* URL para previsualización de imagen en formulario de editar */
  editPreviewUrl: string | null = null;

  /* Indica si hay una subida en progreso */
  isUploading: boolean = false;

  // === VARIABLES PARA CARGA DE IMÁGENES ===
  
  /* Controla si se muestra el formulario de subir imagen */
  showUploadImageForm: boolean = false;
  
  /* Indica si se está subiendo una imagen */
  isUploadingImage: boolean = false;
  
  /* Almacena errores específicos de carga de imagen */
  imageError: string = '';
  
  /* Archivo seleccionado para subir imagen */
  selectedImageFile: File | null = null;
  
  /* URL para previsualización de la imagen */
  imagePreviewUrl: string | null = null;
  
  /* Datos del formulario para subir imagen */
  newImageUpload = {
    username: ''
  };

  // === VARIABLES PARA CARGA DE VIDEOS ===
  
  /* Controla si se muestra el formulario de subir video */
  showUploadVideoForm: boolean = false;
  
  /* Indica si se está subiendo un video */
  isUploadingVideo: boolean = false;
  
  /* Almacena errores específicos de carga de video */
  videoError: string = '';
  
  /* Archivo seleccionado para video */
  selectedVideoFile: File | null = null;
  
  /* Archivo seleccionado para miniatura del video */
  selectedVideoThumbnailFile: File | null = null;
  
  /* URL para previsualización de la miniatura del video */
  videoThumbnailPreviewUrl: string | null = null;
  
  /* Datos del formulario para subir video */
  newVideoUpload = {
    username: ''
  };

  // === CONTROL DE SUSCRIPCIONES ===
  private noticesSubscription: any = null;

  /*Constructor del componente. Inyecta los servicios necesarios para la gestión de datos*/
  constructor(
    private adminService: AdminService,      // Servicio para operaciones administrativas
    private imageService: ImageService,     // Servicio específico para imágenes
    private videoService: VideoService,     // Servicio específico para videos
    private http: HttpClient,               // Cliente HTTP para subida de archivos
    private noticeService: NoticeService    // Servicio compartido de noticias
  ) { }

  /* Método del ciclo de vida de Angular. Se ejecuta después de inicializar el componente */
  ngOnInit() {
    console.log('🔄 AdminComponent ngOnInit iniciado');
    console.log('🎯 Pestaña activa inicial:', this.activeTab);
    
    // Suscribirse a las noticias desde el inicio para tener datos siempre actualizados
    this.noticesSubscription = this.noticeService.notices$.subscribe(notices => {
      this.notices = notices;
      console.log('📰 Noticias actualizadas en admin:', notices);
      console.log('📊 Cantidad de noticias:', notices.length);
    });
    
    this.loadData(); // Cargar datos iniciales según la pestaña activa
    console.log('✅ AdminComponent ngOnInit completado');
  }

  ngOnDestroy() {
    // Limpiar suscripción al destruir el componente
    if (this.noticesSubscription) {
      this.noticesSubscription.unsubscribe();
    }
  }

  // === MÉTODOS DE NAVEGACIÓN ===

  /* Cambia la pestaña activa en la interfaz. @param tab - La pestaña que se quiere activar */
  setActiveTab(tab: 'users' | 'notices' | 'images' | 'videos') {
    this.activeTab = tab;
    this.clearMessages();  // Limpiar mensajes anteriores
    this.loadData();       // Cargar datos de la nueva pestaña
  }

  /* Carga los datos correspondientes según la pestaña activa. Este método actúa como un dispatcher que llama al método apropiado */
  loadData() {
    console.log('🔍 loadData() iniciado para pestaña:', this.activeTab);
    this.loading = true;
    this.clearMessages();

    switch (this.activeTab) {
      case 'users':
        console.log('👥 Cargando usuarios...');
        this.loadUsers();
        break;
      case 'notices':
        // Las noticias ya están disponibles vía suscripción en ngOnInit
        // Solo necesitamos marcar que terminó la carga
        console.log('📰 Noticias ya disponibles:', this.notices.length);
        this.loading = false;
        break;
      case 'images':
        console.log('🖼️ Cargando imágenes...');
        this.loadImages();
        break;
      case 'videos':
        console.log('🎥 Cargando videos...');
        this.loadVideos();
        break;
    }
  }

  // === MÉTODOS DE CARGA DE DATOS ===

  /* Filtra automáticamente el usuario 'admin' para que no aparezca en la lista */
  loadUsers() {
    console.log('🚀 loadUsers() ejecutándose...');
    console.log('🌐 Intentando conectar con:', 'http://localhost:8080/User');
    
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        console.log('✅ Usuarios recibidos del servidor:', data);
        console.log('📊 Tipo de datos recibidos:', typeof data);
        console.log('📊 Es array?:', Array.isArray(data));
        
        // Filtrar el usuario admin de la lista ya que no debe gestionarse
        this.users = data.filter(user => user.username !== 'admin');
        console.log('👥 Usuarios filtrados (sin admin):', this.users);
        console.log('👥 Cantidad final de usuarios:', this.users.length);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar usuarios:', err);
        console.error('❌ Detalles del error:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        
        // Si hay error de backend, cargar datos de prueba
        console.log('🔄 Cargando usuarios de prueba como fallback...');
        this.users = [
          { id: 1, username: 'usuario1', userEmail: 'user1@test.com', license: 'a1', score: 100 },
          { id: 2, username: 'usuario2', userEmail: 'user2@test.com', license: 'a2', score: 200 },
          { id: 3, username: 'usuario3', userEmail: 'user3@test.com', license: 'a3', score: 150 }
        ];
        console.log('👥 Usuarios de prueba cargados:', this.users);
        this.loading = false;
        
        this.handleError('Error al cargar usuarios (usando datos de prueba)', err);
      }
    });
  }

  /* Carga la lista de imágenes desde el servidor. Incluye todas las imágenes (incluso las del admin) para permitir su gestión */
  loadImages() {
    this.adminService.getAllImagesAdmin().subscribe({
      next: (data) => {
        this.images = data;
        this.loading = false;
      },
      error: (err) => {
        this.handleError('Error al cargar imágenes', err);
      }
    });
  }

  /* Carga la lista de videos desde el servidor. Incluye todos los videos (incluso los del admin) para permitir su gestión */
  loadVideos() {
    this.adminService.getAllVideosAdmin().subscribe({
      next: (data) => {
        this.videos = data;
        this.loading = false;
      },
      error: (err) => {
        this.handleError('Error al cargar videos', err);
      }
    });
  }

  // === MÉTODOS DE ELIMINACIÓN ===

  /* Elimina un usuario del sistema de forma permanente. @param username - Nombre de usuario a eliminar */
  deleteUser(username: string) {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${username}? Esta acción es PERMANENTE y eliminará al usuario de la base de datos.`)) {
      this.adminService.deleteUser(username).subscribe({
        next: () => {
          this.showSuccess(`Usuario ${username} eliminado permanentemente de la base de datos`);
          this.loadUsers(); // Recargar desde el servidor
        },
        error: (err) => {
          this.handleError('Error al eliminar usuario de la base de datos', err);
        }
      });
    }
  }

  /* Elimina una noticia del sistema de forma permanente. @param notice - Objeto noticia a eliminar. 
  @param index - Índice de la noticia en el array (no se usa, pero se mantiene por compatibilidad) */

  deleteNotice(notice: NoticeDTO, index: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta notice?')) {
      // Eliminar usando el servicio compartido
      if (notice.id) {
        this.noticeService.removeNoticeLocal(notice.id);
        this.showSuccess('Noticia eliminada correctamente');
      }
    }
  }

  /* Elimina una imagen del sistema de forma permanente. @param image - Objeto imagen a eliminar.
  @param index - Índice de la imagen en el array (no se usa, pero se mantiene por compatibilidad) */

  deleteImage(image: ImageDTO, index: number) {
    // Verificar que la imagen tenga un ID válido
    if (!image.id) {
      this.handleError('No se puede eliminar esta imagen', {
        message: 'El backend no proporcionó un ID válido para esta imagen. Los DTOs del backend necesitan incluir el campo ID.'
      });
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar esta imagen? Esta acción es PERMANENTE y eliminará la imagen de la base de datos para todos los usuarios.')) {
      this.adminService.deleteImage(image.id).subscribe({
        next: () => {
          this.showSuccess('Imagen eliminada permanentemente de la base de datos');
          this.loadImages(); // Recargar desde el servidor
        },
        error: (err) => {
          this.handleError('Error al eliminar imagen de la base de datos', err);
        }
      });
    }
  }

  /* Elimina un video del sistema de forma permanente. @param video - Objeto video a eliminar.
  @param index - Índice del video en el array (se usa para actualización local) */
  deleteVideo(video: VideoDTO, index: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este video?')) {
      this.adminService.deleteVideo(video.id).subscribe({
        next: () => {
          this.videos.splice(index, 1); // Actualización local inmediata
          this.showSuccess('Video eliminado correctamente');
        },
        error: (err: any) => {
          this.handleError('Error al eliminar video', err);
        }
      });
    }
  }

  // === MÉTODOS DE GESTIÓN DE FORMULARIOS DE NOTICIAS ===

  /* Alterna la visibilidad del formulario de crear noticia, si se muestra, reinicia el formulario con valores por defecto. */
  toggleCreateNoticeForm() {
    this.showCreateNoticeForm = !this.showCreateNoticeForm;
    if (this.showCreateNoticeForm) {
      this.resetNoticeForm();
    }
  }

  /* Crea una nueva noticia con el formulario actual */
  createNotice() {
    console.log('🚀 createNotice() llamado');
    console.log('📝 Datos del formulario:', this.newNotice);
    
    /* Validación de campos obligatorios */
    if (!this.newNotice.titular || !this.newNotice.notice) {
      const errorMsg = 'Título y contenido son obligatorios';
      this.error = errorMsg;
      console.log('❌ Validación fallida:', errorMsg);
      return;
    }

    this.isUploading = true;
    this.clearMessages();
    console.log('📰 Iniciando creación de noticia...');

    try {
      // Si hay archivo seleccionado, usar el endpoint de subida de archivos
      if (this.useFileUploadForCreate && this.selectedCreateFile) {
        console.log('📁 Subiendo noticia con archivo al backend...');
        
        const formData = new FormData();
        formData.append('titular', this.newNotice.titular);
        formData.append('notice', this.newNotice.notice);
        formData.append('dateYear', this.newNotice.dateYear);
        formData.append('license', this.newNotice.license || 'any');
        formData.append('miniatureFile', this.selectedCreateFile);

        this.http.post<{success: boolean, message: string, id?: number, url?: string}>(
          'http://localhost:8080/Notice/upload-file',
          formData
        ).subscribe({
          next: (response) => {
            if (response.success) {
              console.log('✅ Noticia con archivo creada exitosamente:', response);
              this.showSuccess('Noticia creada exitosamente');
              this.resetNoticeForm();
              this.showCreateNoticeForm = false;
              // Recargar noticias desde el backend
              this.noticeService.reloadNotices();
            } else {
              this.error = response.message || 'Error al crear la noticia';
            }
            this.isUploading = false;
          },
          error: (err) => {
            console.error('❌ Error al subir noticia con archivo:', err);
            this.error = 'Error al crear la noticia: ' + (err.error?.message || err.message);
            this.isUploading = false;
          }
        });
        
      } else {
        // Sin archivo, crear noticia usando solo JSON (modo URL)
        console.log('🌐 Creando noticia sin archivo usando JSON...');
        
        const noticeData: NoticeDTO = {
          titular: this.newNotice.titular,
          notice: this.newNotice.notice,
          dateYear: this.newNotice.dateYear,
          miniature: this.newNotice.miniature || '',
          username: 'admin',
          license: this.newNotice.license || 'any'
        };
        
        console.log('💾 Datos de noticia a crear:', noticeData);
        
        this.noticeService.addNoticeLocal(noticeData);
        console.log('✅ Noticia enviada al servicio');
        
        this.showSuccess('Noticia creada exitosamente');
        this.resetNoticeForm();
        this.showCreateNoticeForm = false;
        this.isUploading = false;
        
        console.log('🎉 Noticia creada y formulario resetado');
        // Recargar noticias desde el backend
        this.noticeService.reloadNotices();
      }
    } catch (error) {
      console.error('💥 Error en createNotice:', error);
      this.error = 'Error al crear la noticia: ' + error;
      this.isUploading = false;
    }
  }

  /**
   * Actualiza una noticia existente
   */
  updateNotice() {
    console.log('🔄 updateNotice() llamado');
    console.log('📝 Datos de edición:', this.editingNotice);
    
    /* Validación de campos obligatorios */
    if (!this.editingNotice.titular || !this.editingNotice.notice) {
      this.error = 'Título y contenido son obligatorios';
      return;
    }

    /* Validación de ID */
    if (!this.editingNotice.id) {
      this.error = 'Error: ID de noticia no encontrado';
      return;
    }

    this.isUploading = true;
    this.clearMessages();
    console.log('📰 Iniciando actualización de noticia...');

    try {
      // Si hay archivo seleccionado, usar el endpoint de subida de archivos
      if (this.useFileUploadForEdit && this.selectedEditFile) {
        console.log('📁 Actualizando noticia con archivo al backend...');
        
        const formData = new FormData();
        formData.append('titular', this.editingNotice.titular);
        formData.append('notice', this.editingNotice.notice);
        formData.append('dateYear', this.editingNotice.dateYear);
        formData.append('license', this.editingNotice.license || 'any');
        formData.append('miniatureFile', this.selectedEditFile);

        this.http.put<{success: boolean, message: string, id?: number, url?: string}>(
          `http://localhost:8080/Notice/${this.editingNotice.id}/upload-file`,
          formData
        ).subscribe({
          next: (response) => {
            if (response.success) {
              console.log('✅ Noticia con archivo actualizada exitosamente:', response);
              this.showSuccess('Noticia actualizada exitosamente');
              this.showEditNoticeForm = false;
              this.resetEditForm();
              // Recargar noticias desde el backend
              this.noticeService.reloadNotices();
            } else {
              this.error = response.message || 'Error al actualizar la noticia';
            }
            this.isUploading = false;
          },
          error: (err) => {
            console.error('❌ Error al actualizar noticia con archivo:', err);
            this.error = 'Error al actualizar la noticia: ' + (err.error?.message || err.message);
            this.isUploading = false;
          }
        });
        
      } else {
        // Sin archivo nuevo, actualizar usando solo JSON
        console.log('🌐 Actualizando noticia sin archivo usando JSON...');
        
        const updatedData: Partial<NoticeDTO> = {
          titular: this.editingNotice.titular,
          notice: this.editingNotice.notice,
          dateYear: this.editingNotice.dateYear,
          miniature: this.editingNotice.miniature,
          license: this.editingNotice.license || 'any'
        };
        
        console.log('🔄 Datos de noticia a actualizar:', updatedData);
        
        this.noticeService.updateNoticeLocal(this.editingNotice.id, updatedData);
        console.log('✅ Noticia actualizada en servicio');
        
        this.showSuccess('Noticia actualizada exitosamente');
        this.showEditNoticeForm = false;
        this.resetEditForm();
        this.isUploading = false;
        
        console.log('🎉 Actualización completada');
        // Recargar noticias desde el backend
        this.noticeService.reloadNotices();
      }
    } catch (error) {
      console.error('💥 Error en updateNotice:', error);
      this.error = 'Error al actualizar la noticia: ' + error;
      this.isUploading = false;
    }
  }

  // === MÉTODOS DE CONTROL DE SUBIDA DE ARCHIVOS ===

  /**
   * Cambia el método de subida para crear noticia
   */
  setCreateUploadMethod(useFile: boolean) {
    this.useFileUploadForCreate = useFile;
    this.clearCreateFileData();
  }

  /**
   * Cambia el método de subida para editar noticia
   */
  setEditUploadMethod(useFile: boolean) {
    this.useFileUploadForEdit = useFile;
    this.clearEditFileData();
  }

  /**
   * Maneja la selección de archivo en formulario de crear
   */
  onCreateFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tamaño (50MB máximo)
    if (file.size > 50 * 1024 * 1024) {
      this.error = 'El archivo es demasiado grande. Máximo 50MB permitido.';
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.error = 'Solo se permiten archivos de imagen.';
      return;
    }

    this.selectedCreateFile = file;
    this.generateCreatePreview(file);
    this.clearMessages();
  }

  /**
   * Maneja la selección de archivo en formulario de editar
   */
  onEditFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tamaño (50MB máximo)
    if (file.size > 50 * 1024 * 1024) {
      this.error = 'El archivo es demasiado grande. Máximo 50MB permitido.';
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.error = 'Solo se permiten archivos de imagen.';
      return;
    }

    this.selectedEditFile = file;
    this.generateEditPreview(file);
    this.clearMessages();
  }

  /**
   * Genera previsualización para archivo de crear
   */
  private generateCreatePreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.createPreviewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Genera previsualización para archivo de editar
   */
  private generateEditPreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.editPreviewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
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
   * Limpia datos de archivo en formulario de crear
   */
  private clearCreateFileData() {
    this.selectedCreateFile = null;
    this.createPreviewUrl = null;
  }

  /**
   * Limpia datos de archivo en formulario de editar
   */
  private clearEditFileData() {
    this.selectedEditFile = null;
    this.editPreviewUrl = null;
  }

  /* Resetea el formulario de crear noticia a su estado inicial */
  resetNoticeForm() {
    this.newNotice = {
      titular: '',
      notice: '',
      dateYear: new Date().getFullYear().toString(),
      miniature: '',
      license: 'any'
    };
    // NO cerrar el formulario aquí, solo resetear los datos
    this.clearCreateFileData();
    this.useFileUploadForCreate = false;
  }

  /* Resetea el formulario de editar noticia a su estado inicial */
  resetEditForm() {
    this.editingNotice = {
      titular: '',
      notice: '',
      dateYear: new Date().getFullYear().toString(),
      miniature: '',
      license: 'any'
    };
    this.clearEditFileData();
    this.useFileUploadForEdit = false;
  }

  /* Prepara el formulario de edición con los datos de una noticia existente */
  editNotice(notice: NoticeDTO) {
    this.editingNotice = {
      id: notice.id,
      titular: notice.titular,
      notice: notice.notice,
      dateYear: notice.dateYear,
      miniature: notice.miniature || '',
      license: 'any' // Valor por defecto ya que no se almacena en el DTO
    };
    this.showEditNoticeForm = true;
    this.showCreateNoticeForm = false; // Cerrar formulario de creación si está abierto
    this.clearEditFileData(); // Limpiar datos de archivo previos
    this.useFileUploadForEdit = false; // Resetear a modo URL por defecto
  }

  /* Cancela la edición de noticia y cierra el formulario */
  cancelEdit() {
    this.showEditNoticeForm = false;
    this.resetEditForm();
  }

  // === MÉTODOS DE PUNTUACIÓN ===

  /* Verifica si una imagen o video es puntuable (el contenido del admin no debe ser puntuable) 
  @param username - Nombre del usuario propietario del contenido. @returns true si el contenido es puntuable, false si no */

  isScoreable(username: string): boolean {
    return username !== 'admin';
  }

  /* Asigna una puntuación a una imagen. @param image - La imagen a puntuar. @param score - La puntuación del 1 al 5 */
  scoreImage(image: ImageDTO, score: number) {
    // Verificación adicional de seguridad
    if (!this.isScoreable(image.username)) {
      this.handleError('Error', { message: 'No se pueden puntuar las imágenes del administrador' });
      return;
    }

    this.imageService.scoreImage(image.id, score).subscribe({
      next: () => {
        image.score = score; // Actualización local inmediata
        this.showSuccess(`Imagen puntuada con ${score} puntos`);
      },
      error: (err: any) => {
        this.handleError('Error al puntuar imagen', err);
      }
    });
  }

  /* Asigna una puntuación a un video. @param video - El video a puntuar. @param score - La puntuación del 1 al 5 */

  scoreVideo(video: VideoDTO, score: number) {
    // Verificación adicional de seguridad
    if (!this.isScoreable(video.username)) {
      this.handleError('Error', { message: 'No se pueden puntuar los videos del administrador' });
      return;
    }

    this.videoService.scoreVideo(video.id, score).subscribe({
      next: () => {
        video.score = score; // Actualización local inmediata
        this.showSuccess(`Video puntuado con ${score} puntos`);
      },
      error: (err: any) => {
        this.handleError('Error al puntuar video', err);
      }
    });
  }

  /* bGenera un array con las opciones de puntuación (1-5). Utilizado en el template para crear los botones de puntuación @returns Array con números del 1 al 5 */
  getScoreOptions(): number[] {
    return [1, 2, 3, 4, 5];
  }

  // === MÉTODOS DE UTILIDAD ===

  /*Maneja errores de forma centralizada
  Formatea el mensaje de error y actualiza el estado de carga. @param message - Mensaje principal del error. @param error - Objeto de error recibido */

  private handleError(message: string, error: any) {
    console.error(message, error);
    this.error = message + ': ' + (error.error?.message || error.message || 'Error desconocido');
    this.loading = false;
  }

  /* Muestra un mensaje de éxito temporal. El mensaje se oculta automáticamente después de 3 segundos. @param message - Mensaje de éxito a mostrar */
  private showSuccess(message: string) {
    this.successMessage = message;
    this.error = ''; // Limpiar errores previos
    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  /* Limpia todos los mensajes de error y éxito utilizado al cambiar de pestaña o realizar nuevas acciones */
  private clearMessages() {
    this.error = '';
    this.successMessage = '';
  }

  // === MÉTODOS PARA CARGA DE IMÁGENES ===

  /**
   * Alterna la visibilidad del formulario de subir imagen
   */
  toggleUploadImageForm() {
    this.showUploadImageForm = !this.showUploadImageForm;
    if (!this.showUploadImageForm) {
      this.resetImageUploadForm();
    }
  }

  /**
   * Maneja la selección de archivo de imagen
   */
  onImageFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tamaño (50MB máximo)
    if (file.size > 50 * 1024 * 1024) {
      this.imageError = 'El archivo es demasiado grande. Máximo 50MB permitido.';
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.imageError = 'Solo se permiten archivos de imagen.';
      return;
    }

    this.selectedImageFile = file;
    this.generateImagePreview(file);
    this.imageError = '';
  }

  /**
   * Genera una previsualización de la imagen seleccionada
   */
  private generateImagePreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Verifica si el formulario de imagen es válido
   */
  isImageUploadValid(): boolean {
    return !!(this.newImageUpload.username && this.selectedImageFile);
  }

  /**
   * Sube una imagen con archivo
   */
  uploadImageFile() {
    if (!this.isImageUploadValid()) {
      this.imageError = 'Usuario y archivo son obligatorios';
      return;
    }

    this.isUploadingImage = true;
    this.imageError = '';

    // CÓDIGO REAL - Backend activado
    const formData = new FormData();
    formData.append('imageFile', this.selectedImageFile!);

    this.http.post<{success: boolean, message: string, id?: number, url?: string}>(
      `http://localhost:8080/images/upload-file/${this.newImageUpload.username}`,
      formData
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccess('Imagen subida exitosamente');
          this.resetImageUploadForm();
          this.loadImages();
        } else {
          this.imageError = response.message || 'Error al subir la imagen';
        }
      },
      error: (err) => {
        console.warn('Backend no disponible, usando modo prueba');
        // MODO PRUEBA: Simular respuesta exitosa como fallback
        setTimeout(() => {
          this.showSuccess('Imagen subida exitosamente (modo prueba - backend no disponible)');
          this.resetImageUploadForm();
          this.loadImages();
        }, 1000);
      },
      complete: () => {
        this.isUploadingImage = false;
      }
    });
  }

  /**
   * Cancela la subida de imagen
   */
  cancelImageUpload() {
    this.showUploadImageForm = false;
    this.resetImageUploadForm();
  }

  /**
   * Resetea el formulario de subida de imagen
   */
  private resetImageUploadForm() {
    this.newImageUpload = {
      username: ''
    };
    this.selectedImageFile = null;
    this.imagePreviewUrl = null;
    this.imageError = '';
    this.isUploadingImage = false;
  }

  // === MÉTODOS PARA CARGA DE VIDEOS ===

  /**
   * Alterna la visibilidad del formulario de subir video
   */
  toggleUploadVideoForm() {
    this.showUploadVideoForm = !this.showUploadVideoForm;
    if (!this.showUploadVideoForm) {
      this.resetVideoUploadForm();
    }
  }

  /**
   * Resetea el formulario de subida de video
   */
  private resetVideoUploadForm() {
    this.newVideoUpload = {
      username: ''
    };
    this.selectedVideoFile = null;
    this.selectedVideoThumbnailFile = null;
    this.videoThumbnailPreviewUrl = null;
    this.videoError = '';
    this.isUploadingVideo = false;
  }

  /**
   * Maneja la selección de archivo de video
   */
  onVideoFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tamaño (200MB máximo para videos)
    if (file.size > 200 * 1024 * 1024) {
      this.videoError = 'El archivo es demasiado grande. Máximo 200MB permitido.';
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('video/')) {
      this.videoError = 'Solo se permiten archivos de video.';
      return;
    }

    this.selectedVideoFile = file;
    this.videoError = '';
  }

  /**
   * Maneja la selección de miniatura para video
   */
  onVideoThumbnailSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tamaño (50MB máximo)
    if (file.size > 50 * 1024 * 1024) {
      this.videoError = 'El archivo de miniatura es demasiado grande. Máximo 50MB permitido.';
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.videoError = 'Solo se permiten archivos de imagen para la miniatura.';
      return;
    }

    this.selectedVideoThumbnailFile = file;
    this.generateVideoThumbnailPreview(file);
    this.videoError = '';
  }

  /**
   * Genera una previsualización de la miniatura del video
   */
  private generateVideoThumbnailPreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.videoThumbnailPreviewUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Verifica si el formulario de video es válido
   */
  isVideoUploadValid(): boolean {
    return !!(this.newVideoUpload.username && this.selectedVideoFile && this.selectedVideoThumbnailFile);
  }

  /**
   * Sube un video con archivos
   */
  uploadVideoFile() {
    if (!this.isVideoUploadValid()) {
      this.videoError = 'Usuario, archivo de video y miniatura son obligatorios';
      return;
    }

    this.isUploadingVideo = true;
    this.videoError = '';

    // CÓDIGO REAL - Backend activado
    const formData = new FormData();
    formData.append('videoFile', this.selectedVideoFile!);
    formData.append('miniatureFile', this.selectedVideoThumbnailFile!);

    this.http.post<{success: boolean, message: string, id?: number, url?: string}>(
      `http://localhost:8080/Videos/upload-file/${this.newVideoUpload.username}`,
      formData
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccess('Video subido exitosamente');
          this.resetVideoUploadForm();
          this.loadVideos();
        } else {
          this.videoError = response.message || 'Error al subir el video';
        }
      },
      error: (err) => {
        console.warn('Backend no disponible, usando modo prueba');
        // MODO PRUEBA: Simular respuesta exitosa como fallback
        setTimeout(() => {
          this.showSuccess('Video subido exitosamente (modo prueba - backend no disponible)');
          this.resetVideoUploadForm();
          this.loadVideos();
        }, 1000);
      },
      complete: () => {
        this.isUploadingVideo = false;
      }
    });
  }

  /**
   * Cancela la subida de video
   */
  cancelVideoUpload() {
    this.showUploadVideoForm = false;
    this.resetVideoUploadForm();
  }
} 