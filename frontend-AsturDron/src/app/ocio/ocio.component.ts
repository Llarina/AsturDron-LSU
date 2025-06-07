import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RankingService, RankingDTO } from '../services/ranking.service';
import { ImageService, ImageDTO } from '../services/image.service';
import { VideoService, VideoDTO } from '../services/video.service';
import { AuthService, User } from '../services/auth.service';
import { AnnouncementService, AnnouncementDTO, AnnouncementCreateRequest } from '../services/announcement.service';
import { CommentService, CommentDTO, CommentCreateRequest } from '../services/comment.service';
import { VideoModalComponent } from '../components/video-modal/video-modal.component';
import { UploadModalComponent } from '../components/upload-modal/upload-modal.component';
import { FormsModule } from '@angular/forms';

/**
 * Componente de Ocio
 * 
 * Este componente maneja la sección de entretenimiento de la aplicación donde los usuarios pueden:
 * - Ver y publicar fotos con paginación
 * - Ver y publicar videos  
 * - Consultar el ranking de usuarios
 * - Acceder al tablón de anuncios para comunicarse entre usuarios
 * 
 * Funcionalidades especiales:
 * - Efecto blur en imágenes para usuarios no logueados
 * - Auto-rellenado de usuario en formularios de subida
 * - Sistema de puntuación visible solo para administradores
 * - Carga automática de contenido al inicializar
 * - Sistema de paginación para imágenes
 * - Tablón de anuncios con CRUD completo para usuarios autenticados
 */
@Component({
  selector: 'app-ocio',
  templateUrl: './ocio.component.html',
  styleUrls: ['./ocio.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, VideoModalComponent, UploadModalComponent]
})
export class OcioComponent implements OnInit {
  // === ARRAYS DE DATOS ===
  
  /** Lista de usuarios en el ranking */
  rankings: RankingDTO[] = [];
  
  /** Lista completa de todas las imágenes disponibles */
  allImages: ImageDTO[] = [];
  
  /** Lista de imágenes mostradas en la página actual */
  images: ImageDTO[] = [];
  
  /** Lista de todos los videos disponibles */
  videos: VideoDTO[] = [];

  /** Lista de todos los anuncios */
  announcements: AnnouncementDTO[] = [];

  // === VARIABLES DE ESTADO DE LA INTERFAZ ===
  
  /** Controla si se muestra el ranking completo o solo el top 3 */
  showAllRankings: boolean = false;
  
  /** Controla qué sección está activa ('fotos', 'videos', 'ranking', 'anuncios') */
  activeSection: 'fotos' | 'videos' | 'ranking' | 'anuncios' = 'fotos';
  
  /** Almacena mensajes de error para mostrar al usuario */
  error: string = '';
  
  /** Almacena mensajes de éxito para mostrar al usuario */
  successMessage: string = '';
  
  /** URL del video seleccionado para mostrar en modal (null si no hay ninguno) */
  selectedVideo: string | null = null;
  
  /** Controla la visibilidad del modal de subida de contenido */
  showUploadModal: boolean = false;
  
  /** Información del usuario actualmente logueado (null si no hay sesión) */
  currentUser: User | null = null;
  
  /** Indica si se están cargando las imágenes */
  isLoadingImages: boolean = false;
  
  /** Indica si se están cargando los videos */
  isLoadingVideos: boolean = false;

  /** Indica si se están cargando los anuncios */
  isLoadingAnnouncements: boolean = false;

  // === CONFIGURACIÓN DE PAGINACIÓN PARA IMÁGENES ===
  
  /** Número de imágenes por página */
  imagesPerPage: number = 2;
  
  /** Página actual para imágenes (empezando desde 1) */
  currentImagePage: number = 1;
  
  /** Total de páginas disponibles para imágenes */
  totalImagePages: number = 0;
  
  /** Array con números de páginas para mostrar en controles de imágenes */
  imagePageNumbers: number[] = [];

  // === CONFIGURACIÓN DE PAGINACIÓN PARA VIDEOS ===
  
  /** Lista completa de todos los videos disponibles */
  allVideos: VideoDTO[] = [];
  
  /** Número de videos por página */
  videosPerPage: number = 2;
  
  /** Página actual para videos (empezando desde 1) */
  currentVideoPage: number = 1;
  
  /** Total de páginas disponibles para videos */
  totalVideoPages: number = 0;
  
  /** Array con números de páginas para mostrar en controles de videos */
  videoPageNumbers: number[] = [];

  // === CONFIGURACIÓN DE PAGINACIÓN PARA ANUNCIOS ===
  
  /** Lista completa de todos los anuncios disponibles */
  allAnnouncements: AnnouncementDTO[] = [];
  
  /** Lista de anuncios mostrados en la página actual */
  displayedAnnouncements: AnnouncementDTO[] = [];
  
  /** Número de anuncios por página */
  announcementsPerPage: number = 2;
  
  /** Página actual para anuncios (empezando desde 1) */
  currentAnnouncementPage: number = 1;
  
  /** Total de páginas disponibles para anuncios */
  totalAnnouncementPages: number = 0;
  
  /** Array con números de páginas para mostrar en controles de anuncios */
  announcementPageNumbers: number[] = [];

  // === VARIABLES PARA ANUNCIOS ===
  
  /** Controla si se muestra el formulario de crear anuncio */
  showCreateAnnouncementForm: boolean = false;
  
  /** Controla si se muestra el formulario de editar anuncio */
  showEditAnnouncementForm: boolean = false;
  
  /** Datos del formulario para crear nuevo anuncio */
  newAnnouncement: AnnouncementCreateRequest = {
    title: '',
    content: '',
    username: ''
  };
  
  /** Datos del formulario para editar anuncio existente */
  editingAnnouncement: AnnouncementCreateRequest & { id?: number } = {
    title: '',
    content: '',
    username: ''
  };

  // === VARIABLES PARA COMENTARIOS ===
  
  /** Mapa de comentarios por ID de anuncio */
  commentsByAnnouncement: Map<number, CommentDTO[]> = new Map();
  
  /** Mapa de visibilidad de comentarios por ID de anuncio */
  showCommentsByAnnouncement: Map<number, boolean> = new Map();
  
  /** Mapa de formularios de comentarios por ID de anuncio */
  showCommentFormByAnnouncement: Map<number, boolean> = new Map();
  
  /** Mapa de comentarios en edición por ID de comentario */
  editingCommentsByAnnouncement: Map<number, CommentCreateRequest & { id?: number }> = new Map();
  
  /** Mapa de formularios de nuevo comentario por ID de anuncio */
  newCommentsByAnnouncement: Map<number, CommentCreateRequest> = new Map();
  
  /** Indica si se están cargando comentarios */
  isLoadingComments: boolean = false;

  /**
   * Constructor del componente
   * Inyecta todos los servicios necesarios para la funcionalidad
   */
  constructor(
    private rankingService: RankingService,  // Servicio para gestión de rankings
    private imageService: ImageService,     // Servicio para gestión de imágenes
    private videoService: VideoService,     // Servicio para gestión de videos
    private authService: AuthService,        // Servicio para autenticación y usuario actual
    private announcementService: AnnouncementService,  // Servicio para gestión de anuncios
    private commentService: CommentService  // Servicio para gestión de comentarios
  ) {}

  /**
   * Método del ciclo de vida de Angular
   * Se ejecuta después de inicializar el componente
   * Configura la suscripción al usuario actual y carga datos iniciales
   */
  ngOnInit() {
    // Suscribirse al usuario actual para detectar cambios de sesión
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // Cargar datos inmediatamente al inicializar
    this.activeSection = 'fotos';
    this.clearMessages();
    
    // Pequeño delay para asegurar que la página esté completamente cargada
    setTimeout(() => {
      this.loadImages();
      this.loadVideos();
      this.loadTop3Ranking();
      this.loadAnnouncements(); // Cargar anuncios también al inicializar
    }, 100);
  }

  // === MÉTODOS DE AUTENTICACIÓN ===

  /**
   * Verifica si el usuario está logueado
   * @returns true si hay un usuario logueado, false en caso contrario
   */
  isUserLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // === MÉTODOS DE CARGA DE DATOS ===

  /**
   * Carga todas las imágenes desde el servidor
   * Actualiza el estado de carga y maneja errores
   */
  loadImages() {
    this.isLoadingImages = true;
    this.error = ''; // Limpiar errores previos
    
    this.imageService.getAllImages().subscribe({
      next: (data) => {
        this.allImages = data;
        this.currentImagePage = 1; // Resetear a la primera página
        this.updateImagePagination();
        this.updateDisplayedImages();
        this.error = '';
        this.isLoadingImages = false;
      },
      error: (err) => {
        console.error('Error loading images:', err);
        this.error = 'Error al cargar las imágenes: ' + (err.message || 'Error desconocido');
        this.isLoadingImages = false;
      }
    });
  }

  /**
   * Actualiza los datos de paginación para imágenes basado en el número total
   */
  private updateImagePagination() {
    this.totalImagePages = Math.ceil(this.allImages.length / this.imagesPerPage);
    this.imagePageNumbers = Array.from({ length: this.totalImagePages }, (_, i) => i + 1);
  }

  /**
   * Actualiza las imágenes mostradas basado en la página actual
   */
  private updateDisplayedImages() {
    const startIndex = (this.currentImagePage - 1) * this.imagesPerPage;
    const endIndex = startIndex + this.imagesPerPage;
    this.images = this.allImages.slice(startIndex, endIndex);
  }

  /**
   * Navega a una página específica de imágenes
   * @param page - Número de página a mostrar
   */
  goToImagePage(page: number) {
    if (page >= 1 && page <= this.totalImagePages) {
      this.currentImagePage = page;
      this.updateDisplayedImages();
      // Scroll hacia la sección de imágenes
      const imageSection = document.getElementById('galeria');
      if (imageSection) {
        imageSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  /**
   * Navega a la página anterior de imágenes
   */
  previousImagePage() {
    if (this.currentImagePage > 1) {
      this.goToImagePage(this.currentImagePage - 1);
    }
  }

  /**
   * Navega a la página siguiente de imágenes
   */
  nextImagePage() {
    if (this.currentImagePage < this.totalImagePages) {
      this.goToImagePage(this.currentImagePage + 1);
    }
  }

  /**
   * Obtiene el rango de imágenes mostradas en la página actual
   * @returns Objeto con startItem, endItem y totalItems
   */
  getImagePageInfo() {
    const startItem = (this.currentImagePage - 1) * this.imagesPerPage + 1;
    const endItem = Math.min(this.currentImagePage * this.imagesPerPage, this.allImages.length);
    return {
      startItem,
      endItem,
      totalItems: this.allImages.length
    };
  }

  /**
   * Carga todos los videos desde el servidor
   * Actualiza el estado de carga y maneja errores
   */
  loadVideos() {
    this.isLoadingVideos = true;
    this.videoService.getAllVideos().subscribe({
      next: (data) => {
        this.allVideos = data;
        this.currentVideoPage = 1; // Resetear a la primera página
        this.updateVideoPagination();
        this.updateDisplayedVideos();
        this.error = '';
        this.isLoadingVideos = false;
      },
      error: (err) => {
        console.error('Error loading videos:', err);
        this.error = 'Error al cargar los videos';
        this.isLoadingVideos = false;
      }
    });
  }

  /**
   * Actualiza los datos de paginación para videos basado en el número total
   */
  private updateVideoPagination() {
    this.totalVideoPages = Math.ceil(this.allVideos.length / this.videosPerPage);
    this.videoPageNumbers = Array.from({ length: this.totalVideoPages }, (_, i) => i + 1);
  }

  /**
   * Actualiza los videos mostrados basado en la página actual
   */
  private updateDisplayedVideos() {
    const startIndex = (this.currentVideoPage - 1) * this.videosPerPage;
    const endIndex = startIndex + this.videosPerPage;
    this.videos = this.allVideos.slice(startIndex, endIndex);
  }

  /**
   * Navega a una página específica de videos
   * @param page - Número de página a mostrar
   */
  goToVideoPage(page: number) {
    if (page >= 1 && page <= this.totalVideoPages) {
      this.currentVideoPage = page;
      this.updateDisplayedVideos();
      // Scroll hacia la sección de videos
      const videoSection = document.getElementById('videos');
      if (videoSection) {
        videoSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  /**
   * Navega a la página anterior de videos
   */
  previousVideoPage() {
    if (this.currentVideoPage > 1) {
      this.goToVideoPage(this.currentVideoPage - 1);
    }
  }

  /**
   * Navega a la página siguiente de videos
   */
  nextVideoPage() {
    if (this.currentVideoPage < this.totalVideoPages) {
      this.goToVideoPage(this.currentVideoPage + 1);
    }
  }

  /**
   * Obtiene el rango de videos mostrados en la página actual
   * @returns Objeto con startItem, endItem y totalItems
   */
  getVideoPageInfo() {
    const startItem = (this.currentVideoPage - 1) * this.videosPerPage + 1;
    const endItem = Math.min(this.currentVideoPage * this.videosPerPage, this.allVideos.length);
    return {
      startItem,
      endItem,
      totalItems: this.allVideos.length
    };
  }

  /**
   * Carga el top 3 del ranking de usuarios
   */
  loadTop3Ranking() {
    this.rankingService.getRankingTop3().subscribe({
      next: (data: RankingDTO[]) => {
        this.rankings = data;
        this.error = '';
      },
      error: (err: any) => {
        console.error('Error loading ranking:', err);
        this.error = 'Error al cargar el ranking';
      }
    });
  }

  /**
   * Carga el ranking completo de usuarios
   */
  loadAllRanking() {
    this.rankingService.getAllRanking().subscribe({
      next: (data: RankingDTO[]) => {
        this.rankings = data;
        this.error = '';
      },
      error: (err: any) => {
        console.error('Error loading ranking:', err);
        this.error = 'Error al cargar el ranking';
      }
    });
  }

  // === MÉTODOS DE GESTIÓN DE MODALES ===

  /**
   * Abre el modal para subir contenido (imágenes o videos)
   */
  openUploadModal() {
    this.showUploadModal = true;
  }

  /**
   * Cierra el modal de subida de contenido
   */
  closeUploadModal() {
    this.showUploadModal = false;
  }

  /**
   * Maneja la subida exitosa desde el modal
   * Recarga el contenido y muestra mensaje de éxito
   */
  handleUploadSuccess() {
    this.showSuccess('¡Contenido publicado correctamente!');
    this.showUploadModal = false;
    
    // Recargar el contenido según la sección activa
    if (this.activeSection === 'fotos') {
      this.loadImages();
    } else if (this.activeSection === 'videos') {
      this.loadVideos();
    }
  }

  /**
   * Abre el modal para reproducir un video
   * Solo permite la reproducción si el usuario está autenticado
   * @param videoUrl - URL del video a reproducir
   */
  openVideoModal(videoUrl: string) {
    // Verificar si el usuario está autenticado
    if (!this.isUserLoggedIn()) {
      this.error = 'Debes iniciar sesión para reproducir videos';
      return;
    }
    
    this.selectedVideo = videoUrl;
    this.error = ''; // Limpiar mensajes de error previos
  }

  /**
   * Cierra el modal de reproducción de video
   */
  closeVideoModal() {
    this.selectedVideo = null;
  }

  // === MÉTODOS DE SUBIDA DE CONTENIDO (LEGACY - PARA COMPATIBILIDAD) ===

  /**
   * Sube una imagen al servidor
   * @param username - Nombre del usuario que sube la imagen
   * @param url - URL de la imagen a subir
   */
  uploadImage(username: string, url: string) {
    this.error = ''; // Limpiar error previo
    
    this.imageService.uploadImage(username, url).subscribe({
      next: (response) => {
        this.showSuccess('¡Imagen publicada correctamente!');
        this.loadImages(); // Recargar la lista de imágenes
        this.showUploadModal = false;
      },
      error: (err) => {
        console.error('Error uploading image:', err);
        this.error = 'Error al subir la imagen: ' + (err.error?.message || err.message || `HTTP ${err.status}`);
      }
    });
  }

  /**
   * Sube un video al servidor
   * @param username - Nombre del usuario que sube el video
   * @param videoUrl - URL del video
   * @param miniatureUrl - URL de la miniatura del video
   */
  uploadVideo(username: string, videoUrl: string, miniatureUrl: string) {
    this.error = ''; // Limpiar error previo
    this.videoService.uploadVideo(username, miniatureUrl, videoUrl).subscribe({
      next: (response) => {
        console.log('Video subido exitosamente:', response);
        this.showSuccess('¡Video publicado correctamente!');
        this.loadVideos();
        this.showUploadModal = false;
      },
      error: (err) => {
        console.error('Error uploading video:', err);
        this.error = 'Error al subir el video: ' + (err.error?.message || err.message || 'Error desconocido');
      }
    });
  }

  // === MÉTODOS DE NAVEGACIÓN ===

  /**
   * Cambia la sección activa y carga los datos necesarios
   * @param section - La sección a activar ('fotos', 'videos', 'ranking', 'anuncios')
   */
  setActiveSection(section: 'fotos' | 'videos' | 'ranking' | 'anuncios') {
    this.activeSection = section;
    this.clearMessages();
    
    // Cargar datos específicos según la sección
    if (section === 'fotos') {
      this.loadImages();
    } else if (section === 'videos') {
      this.loadVideos();
    } else if (section === 'ranking') {
      if (this.showAllRankings) {
        this.loadAllRanking();
      } else {
        this.loadTop3Ranking();
      }
    } else if (section === 'anuncios') {
      this.loadAnnouncements();
    }
  }

  /**
   * Alterna entre mostrar el ranking completo o solo el top 3
   */
  toggleRankingView() {
    this.showAllRankings = !this.showAllRankings;
    if (this.showAllRankings) {
      this.loadAllRanking();
    } else {
      this.loadTop3Ranking();
    }
  }

  // === MÉTODOS DE UTILIDAD ===

  /**
   * Muestra un mensaje de éxito temporal
   * El mensaje se oculta automáticamente después de 3 segundos
   * @param message - Mensaje de éxito a mostrar
   */
  private showSuccess(message: string) {
    this.successMessage = message;
    this.error = ''; // Limpiar errores previos
    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  /**
   * Limpia todos los mensajes de error y éxito
   * Utilizado al cambiar de sección o realizar nuevas acciones
   */
  private clearMessages() {
    this.error = '';
    this.successMessage = '';
  }

  /**
   * Extrae el mensaje de error de una respuesta HTTP de forma consistente
   */
  private extractErrorMessage(err: any): string {
    if (err.error) {
      // Si el error viene del backend con nuestro formato ErrorResponseDTO
      if (typeof err.error === 'object' && err.error.message) {
        return err.error.message;
      } 
      // Si el error es un string (respuesta de texto plano)
      else if (typeof err.error === 'string') {
        return err.error;
      }
    } 
    // Si no hay err.error, usar el mensaje del error HTTP
    else if (err.message) {
      return err.message;
    }
    
    return 'Error desconocido';
  }

  // === MÉTODOS DE OPTIMIZACIÓN ===

  /**
   * Función TrackBy para mejorar el rendimiento de ngFor con imágenes
   * @param index - Índice del elemento en el array
   * @param image - Objeto imagen
   * @returns El ID único de la imagen
   */
  trackByImageId(index: number, image: ImageDTO): number {
    return image.id;
  }

  // === MÉTODOS DE MANEJO DE EVENTOS ===

  /**
   * Maneja errores de carga de imágenes
   * @param event - Evento de error de la imagen
   * @param image - Objeto imagen que falló al cargar
   */
  onImageError(event: any, image: ImageDTO) {
    console.error('Error loading image:', image.url);
  }

  /**
   * Maneja la carga exitosa de imágenes
   * @param event - Evento de carga exitosa
   * @param image - Objeto imagen que se cargó correctamente
   */
  onImageLoad(event: any, image: ImageDTO) {
    // Imagen cargada exitosamente
    // Este método se puede usar para analíticas o optimizaciones futuras
  }

  /**
   * Carga los anuncios desde el servidor
   */
  loadAnnouncements() {
    this.isLoadingAnnouncements = true;
    this.error = ''; // Limpiar errores previos
    
    this.announcementService.getAllAnnouncements().subscribe({
      next: (data) => {
        this.allAnnouncements = data;
        this.announcements = data; // Mantener compatibilidad con código existente
        this.currentAnnouncementPage = 1; // Resetear a la primera página
        this.updateAnnouncementPagination();
        this.updateDisplayedAnnouncements();
        this.error = '';
        this.isLoadingAnnouncements = false;
      },
      error: (err) => {
        console.error('Error loading announcements:', err);
        this.error = 'Error al cargar los anuncios: ' + (err.message || 'Error desconocido');
        this.isLoadingAnnouncements = false;
      }
    });
  }

  /**
   * Actualiza los datos de paginación para anuncios basado en el número total
   */
  private updateAnnouncementPagination() {
    this.totalAnnouncementPages = Math.ceil(this.allAnnouncements.length / this.announcementsPerPage);
    this.announcementPageNumbers = Array.from({ length: this.totalAnnouncementPages }, (_, i) => i + 1);
  }

  /**
   * Actualiza los anuncios mostrados basado en la página actual
   */
  private updateDisplayedAnnouncements() {
    const startIndex = (this.currentAnnouncementPage - 1) * this.announcementsPerPage;
    const endIndex = startIndex + this.announcementsPerPage;
    this.displayedAnnouncements = this.allAnnouncements.slice(startIndex, endIndex);
  }

  /**
   * Navega a una página específica de anuncios
   * @param page - Número de página a mostrar
   */
  goToAnnouncementPage(page: number) {
    if (page >= 1 && page <= this.totalAnnouncementPages) {
      this.currentAnnouncementPage = page;
      this.updateDisplayedAnnouncements();
      // Scroll hacia la sección de anuncios para mostrar la nueva página
      const announcementsSection = document.querySelector('.announcements-container');
      if (announcementsSection) {
        announcementsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  /**
   * Navega a la página anterior de anuncios
   */
  previousAnnouncementPage() {
    if (this.currentAnnouncementPage > 1) {
      this.goToAnnouncementPage(this.currentAnnouncementPage - 1);
    }
  }

  /**
   * Navega a la página siguiente de anuncios
   */
  nextAnnouncementPage() {
    if (this.currentAnnouncementPage < this.totalAnnouncementPages) {
      this.goToAnnouncementPage(this.currentAnnouncementPage + 1);
    }
  }

  /**
   * Obtiene el rango de anuncios mostrados en la página actual
   * @returns Objeto con startItem, endItem y totalItems
   */
  getAnnouncementPageInfo() {
    const startItem = (this.currentAnnouncementPage - 1) * this.announcementsPerPage + 1;
    const endItem = Math.min(this.currentAnnouncementPage * this.announcementsPerPage, this.allAnnouncements.length);
    return {
      startItem,
      endItem,
      totalItems: this.allAnnouncements.length
    };
  }

  // === MÉTODOS DE GESTIÓN DE ANUNCIOS ===

  /**
   * Alterna la visibilidad del formulario de crear anuncio
   */
  toggleCreateAnnouncementForm() {
    this.showCreateAnnouncementForm = !this.showCreateAnnouncementForm;
    if (this.showCreateAnnouncementForm) {
      this.resetAnnouncementForm();
      // Auto-rellenar el username del usuario logueado
      if (this.currentUser) {
        this.newAnnouncement.username = this.currentUser.username;
      }
    }
    this.showEditAnnouncementForm = false; // Cerrar formulario de edición si está abierto
  }

  /**
   * Crea un nuevo anuncio
   */
  createAnnouncement() {
    if (!this.isUserLoggedIn()) {
      this.error = 'Debes iniciar sesión para crear anuncios';
      return;
    }

    if (!this.newAnnouncement.title.trim() || !this.newAnnouncement.content.trim()) {
      this.error = 'El título y contenido son obligatorios';
      return;
    }

    // Asegurar que el username sea del usuario logueado
    if (this.currentUser) {
      this.newAnnouncement.username = this.currentUser.username;
    }

    this.announcementService.createAnnouncement(this.newAnnouncement).subscribe({
      next: (createdAnnouncement) => {
        this.showSuccess('Anuncio creado exitosamente');
        this.resetAnnouncementForm();
        this.showCreateAnnouncementForm = false;
        
        // Recargar lista y navegar a la última página después de un momento
        this.loadAnnouncements();
        setTimeout(() => {
          const lastPage = this.totalAnnouncementPages;
          if (lastPage > 0) {
            this.goToAnnouncementPage(lastPage);
          }
        }, 100);
      },
      error: (err) => {
        console.error('Error creating announcement:', err);
        this.error = 'Error al crear el anuncio: ' + (err.error?.message || err.message || 'Error desconocido');
      }
    });
  }

  /**
   * Prepara el formulario para editar un anuncio
   */
  editAnnouncement(announcement: AnnouncementDTO) {
    // Verificar que el usuario puede editar este anuncio
    if (!this.currentUser || (this.currentUser.username !== announcement.username && this.currentUser.username !== 'admin')) {
      this.error = 'No tienes permisos para editar este anuncio';
      return;
    }

    this.editingAnnouncement = {
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      username: announcement.username
    };
    this.showEditAnnouncementForm = true;
    this.showCreateAnnouncementForm = false; // Cerrar formulario de creación
    this.clearMessages();
  }

  /**
   * Actualiza un anuncio existente
   */
  updateAnnouncement() {
    if (!this.editingAnnouncement.id) {
      this.error = 'Error: ID de anuncio no encontrado';
      return;
    }

    if (!this.editingAnnouncement.title.trim() || !this.editingAnnouncement.content.trim()) {
      this.error = 'El título y contenido son obligatorios';
      return;
    }

    this.announcementService.updateAnnouncement(this.editingAnnouncement.id, {
      title: this.editingAnnouncement.title,
      content: this.editingAnnouncement.content,
      username: this.editingAnnouncement.username
    }).subscribe({
      next: (updatedAnnouncement) => {
        this.showSuccess('Anuncio actualizado exitosamente');
        this.showEditAnnouncementForm = false;
        this.resetEditAnnouncementForm();
        this.loadAnnouncements(); // Recargar lista
      },
      error: (err) => {
        console.error('Error updating announcement:', err);
        this.error = 'Error al actualizar el anuncio: ' + (err.error?.message || err.message || 'Error desconocido');
      }
    });
  }

  /**
   * Elimina un anuncio
   */
  deleteAnnouncement(announcement: AnnouncementDTO) {
    // Verificar que el usuario puede eliminar este anuncio
    if (!this.currentUser || (this.currentUser.username !== announcement.username && this.currentUser.username !== 'admin')) {
      this.error = 'No tienes permisos para eliminar este anuncio';
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
      const currentPage = this.currentAnnouncementPage;
      
      this.announcementService.deleteAnnouncement(announcement.id!, this.currentUser.username).subscribe({
        next: () => {
          this.showSuccess('Anuncio eliminado exitosamente');
          
          // Recargar lista y ajustar página si es necesario
          this.loadAnnouncements();
          setTimeout(() => {
            // Si estamos en la última página y ya no hay elementos, ir a la anterior
            if (currentPage > this.totalAnnouncementPages && this.totalAnnouncementPages > 0) {
              this.goToAnnouncementPage(this.totalAnnouncementPages);
            } else if (this.totalAnnouncementPages > 0) {
              this.goToAnnouncementPage(Math.min(currentPage, this.totalAnnouncementPages));
            }
          }, 100);
        },
        error: (err) => {
          console.error('Error deleting announcement:', err);
          this.error = 'Error al eliminar el anuncio: ' + this.extractErrorMessage(err);
        }
      });
    }
  }

  /**
   * Cancela la edición de anuncio
   */
  cancelEditAnnouncement() {
    this.showEditAnnouncementForm = false;
    this.resetEditAnnouncementForm();
    this.clearMessages();
  }

  /**
   * Resetea el formulario de crear anuncio
   */
  resetAnnouncementForm() {
    this.newAnnouncement = {
      title: '',
      content: '',
      username: this.currentUser?.username || ''
    };
  }

  /**
   * Resetea el formulario de editar anuncio
   */
  resetEditAnnouncementForm() {
    this.editingAnnouncement = {
      title: '',
      content: '',
      username: ''
    };
  }

  /**
   * Verifica si el usuario puede editar/eliminar un anuncio
   */
  canEditAnnouncement(announcement: AnnouncementDTO): boolean {
    return this.currentUser !== null && 
           (this.currentUser.username === announcement.username || this.currentUser.username === 'admin');
  }

  /**
   * Formatea la fecha de un anuncio para mostrarla
   */
  formatAnnouncementDate(dateString: string): string {
    if (!dateString) {
      return 'Fecha no disponible';
    }
    
    try {
      const date = new Date(dateString);
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return 'Fecha no disponible';
      }
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha no disponible';
    }
  }

  // === MÉTODOS DE GESTIÓN DE COMENTARIOS ===

  /**
   * Alterna la visibilidad de comentarios para un anuncio
   */
  toggleComments(announcementId: number) {
    const currentlyVisible = this.showCommentsByAnnouncement.get(announcementId) || false;
    
    if (!currentlyVisible) {
      // Si no están visibles, cargar y mostrar
      this.loadComments(announcementId);
    }
    
    this.showCommentsByAnnouncement.set(announcementId, !currentlyVisible);
    
    // Cerrar formulario si se ocultan los comentarios
    if (currentlyVisible) {
      this.showCommentFormByAnnouncement.set(announcementId, false);
    }
  }

  /**
   * Carga los comentarios de un anuncio específico
   */
  loadComments(announcementId: number) {
    this.isLoadingComments = true;
    
    this.commentService.getCommentsByAnnouncementId(announcementId).subscribe({
      next: (comments) => {
        this.commentsByAnnouncement.set(announcementId, comments);
        this.isLoadingComments = false;
      },
      error: (err) => {
        console.error('Error loading comments:', err);
        this.error = 'Error al cargar los comentarios';
        this.isLoadingComments = false;
      }
    });
  }

  /**
   * Alterna el formulario de nuevo comentario
   */
  toggleCommentForm(announcementId: number) {
    if (!this.isUserLoggedIn()) {
      this.error = 'Debes iniciar sesión para comentar';
      return;
    }

    const currentlyVisible = this.showCommentFormByAnnouncement.get(announcementId) || false;
    this.showCommentFormByAnnouncement.set(announcementId, !currentlyVisible);
    
    if (!currentlyVisible) {
      // Inicializar formulario de comentario
      this.newCommentsByAnnouncement.set(announcementId, {
        content: '',
        username: this.currentUser?.username || '',
        announcementId: announcementId
      });
    }
  }

  /**
   * Crea un nuevo comentario
   */
  createComment(announcementId: number) {
    const newComment = this.newCommentsByAnnouncement.get(announcementId);
    
    if (!newComment || !newComment.content.trim()) {
      this.error = 'El contenido del comentario es obligatorio';
      return;
    }

    if (!this.currentUser) {
      this.error = 'Debes iniciar sesión para comentar';
      return;
    }

    newComment.username = this.currentUser.username;

    this.commentService.createComment(newComment).subscribe({
      next: (createdComment) => {
        this.showSuccess('Comentario creado exitosamente');
        this.showCommentFormByAnnouncement.set(announcementId, false);
        this.newCommentsByAnnouncement.delete(announcementId);
        this.loadComments(announcementId); // Recargar comentarios
      },
      error: (err) => {
        console.error('Error creating comment:', err);
        this.error = 'Error al crear el comentario: ' + (err.error?.message || err.message || 'Error desconocido');
      }
    });
  }

  /**
   * Prepara un comentario para edición
   */
  editComment(comment: CommentDTO) {
    if (!this.canEditComment(comment)) {
      this.error = 'No tienes permisos para editar este comentario';
      return;
    }

    this.editingCommentsByAnnouncement.set(comment.id!, {
      id: comment.id,
      content: comment.content,
      username: comment.username,
      announcementId: comment.announcementId
    });
  }

  /**
   * Actualiza un comentario
   */
  updateComment(commentId: number) {
    const editingComment = this.editingCommentsByAnnouncement.get(commentId);
    
    if (!editingComment || !editingComment.content.trim()) {
      this.error = 'El contenido del comentario es obligatorio';
      return;
    }

    this.commentService.updateComment(commentId, {
      content: editingComment.content,
      username: editingComment.username,
      announcementId: editingComment.announcementId
    }).subscribe({
      next: (updatedComment) => {
        this.showSuccess('Comentario actualizado exitosamente');
        this.editingCommentsByAnnouncement.delete(commentId);
        this.loadComments(editingComment.announcementId); // Recargar comentarios
      },
      error: (err) => {
        console.error('Error updating comment:', err);
        this.error = 'Error al actualizar el comentario: ' + (err.error?.message || err.message || 'Error desconocido');
      }
    });
  }

  /**
   * Elimina un comentario
   */
  deleteComment(comment: CommentDTO) {
    if (!this.canEditComment(comment)) {
      this.error = 'No tienes permisos para eliminar este comentario';
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      this.commentService.deleteComment(comment.id!, this.currentUser!.username).subscribe({
        next: () => {
          this.showSuccess('Comentario eliminado exitosamente');
          this.loadComments(comment.announcementId); // Recargar comentarios
        },
        error: (err) => {
          console.error('Error deleting comment:', err);
          this.error = 'Error al eliminar el comentario: ' + (err.error?.message || err.message || 'Error desconocido');
        }
      });
    }
  }

  /**
   * Cancela la edición de un comentario
   */
  cancelEditComment(commentId: number) {
    this.editingCommentsByAnnouncement.delete(commentId);
  }

  /**
   * Verifica si el usuario puede editar/eliminar un comentario
   */
  canEditComment(comment: CommentDTO): boolean {
    return this.currentUser !== null && 
           (this.currentUser.username === comment.username || this.currentUser.username === 'admin');
  }

  /**
   * Obtiene comentarios de un anuncio
   */
  getCommentsForAnnouncement(announcementId: number): CommentDTO[] {
    return this.commentsByAnnouncement.get(announcementId) || [];
  }

  /**
   * Obtiene el número de comentarios para mostrar en el botón
   */
  getCommentCount(announcement: AnnouncementDTO): number {
    // Si ya hemos cargado los comentarios localmente, usar esa cantidad
    const localComments = this.commentsByAnnouncement.get(announcement.id!);
    if (localComments) {
      return localComments.length;
    }
    
    // Si no, usar el conteo del backend
    return announcement.commentCount || 0;
  }

  /**
   * Verifica si los comentarios están visibles para un anuncio
   */
  areCommentsVisible(announcementId: number): boolean {
    return this.showCommentsByAnnouncement.get(announcementId) || false;
  }

  /**
   * Verifica si el formulario de comentario está visible
   */
  isCommentFormVisible(announcementId: number): boolean {
    return this.showCommentFormByAnnouncement.get(announcementId) || false;
  }

  /**
   * Obtiene el formulario de nuevo comentario
   */
  getNewCommentForm(announcementId: number): CommentCreateRequest {
    return this.newCommentsByAnnouncement.get(announcementId) || {
      content: '',
      username: '',
      announcementId: announcementId
    };
  }

  /**
   * Verifica si un comentario está en edición
   */
  isCommentBeingEdited(commentId: number): boolean {
    return this.editingCommentsByAnnouncement.has(commentId);
  }

  /**
   * Obtiene el comentario en edición
   */
  getEditingComment(commentId: number): CommentCreateRequest & { id?: number } {
    return this.editingCommentsByAnnouncement.get(commentId) || {
      content: '',
      username: '',
      announcementId: 0
    };
  }

  /**
   * Formatea la fecha de un comentario para mostrarla
   */
  formatCommentDate(dateString: string): string {
    if (!dateString) {
      return 'Fecha no disponible';
    }
    
    try {
      const date = new Date(dateString);
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return 'Fecha no disponible';
      }
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha no disponible';
    }
  }

  // === MÉTODOS DE DEBUGGING ===

  /**
   * Método de debugging para mostrar el estado de la paginación de anuncios
   * Puedes llamarlo desde la consola del navegador para verificar el estado
   */
  debugAnnouncementsPagination() {
    console.log('=== ESTADO DE PAGINACIÓN DE ANUNCIOS ===');
    console.log('Total anuncios:', this.allAnnouncements.length);
    console.log('Anuncios por página:', this.announcementsPerPage);
    console.log('Página actual:', this.currentAnnouncementPage);
    console.log('Total páginas:', this.totalAnnouncementPages);
    console.log('Anuncios mostrados:', this.displayedAnnouncements.length);
    console.log('Números de página:', this.announcementPageNumbers);
    console.log('Anuncios en página actual:', this.displayedAnnouncements.map(a => ({ id: a.id, title: a.title })));
  }
}
