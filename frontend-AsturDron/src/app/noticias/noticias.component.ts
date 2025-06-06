import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoticeService } from '../services/notice.service';
import { NoticeDTO } from '../services/notice.service';
import { AuthService, User } from '../services/auth.service';
import { AdminService, NoticeCreateRequest } from '../services/admin.service';
import { Subscription } from 'rxjs';

/**
 * Interfaz extendida de NoticeDTO que incluye el estado de visualización de detalles
 */
interface NoticeWithDetails extends NoticeDTO {
  showDetails?: boolean;    /* Controla si se muestran los detalles expandidos de la noticia */
}

/**
 * Componente de Gestión de Noticias
 * 
 * Este componente maneja la visualización y gestión de noticias del sistema.
 * Proporciona diferentes funcionalidades según el tipo de usuario.
 * 
 * Funcionalidades principales para usuarios normales:
 * - Visualización de noticias filtradas por licencia seleccionada
 * - Expansión/contracción de contenido de noticias
 * - Selector de licencia para ver noticias específicas
 * - Paginación para navegar entre páginas de noticias
 * 
 * Funcionalidades adicionales para administradores:
 * - Edición de noticias existentes mediante formulario inline
 * - Eliminación de noticias del sistema
 * - Acceso a todas las noticias sin restricciones
 * 
 * Funcionalidades especiales:
 * - Interfaz diferenciada para admin vs usuarios normales
 * - Estados de carga y mensajes de error/éxito
 * - Filtrado dinámico por tipo de licencia de dron
 * - Formularios reactivos para edición
 * - Sistema de paginación con controles de navegación
 */
@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class NoticiasComponent implements OnInit, OnDestroy {
  /* Lista completa de noticias cargadas desde el servidor */
  allNotices: NoticeWithDetails[] = [];
  
  /* Lista de noticias filtradas y mostradas en la página actual */
  notices: NoticeWithDetails[] = [];
  
  /* Almacena mensajes de error para mostrar al usuario */
  error: string = '';
  
  /* Almacena mensajes de éxito para mostrar al usuario */
  successMessage: string = '';
  
  /* Licencia actualmente seleccionada para filtrar noticias */
  selectedLicense: string = 'a1'; // Valor por defecto en minúsculas
  
  /* Usuario actualmente logueado (null si no hay sesión) */
  currentUser: User | null = null;

  /* Indica si se están cargando las noticias */
  isLoading: boolean = false;

  /* Lista de licencias disponibles con sus valores y etiquetas para el selector */
  licenses = [
    { value: 'a1', label: 'A1' },
    { value: 'a2', label: 'A2' },
    { value: 'a3', label: 'A3' },
    { value: 'any', label: 'Todas' }
  ];

  // === CONFIGURACIÓN DE PAGINACIÓN ===
  
  /* Número de noticias por página */
  itemsPerPage: number = 2;
  
  /* Página actual (empezando desde 1) */
  currentPage: number = 1;
  
  /* Total de páginas disponibles */
  totalPages: number = 0;
  
  /* Array con números de páginas para mostrar en controles */
  pageNumbers: number[] = [];

  // === CONTROL DE FORMULARIO DE EDICIÓN ===
  
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

  private subscriptions: Subscription[] = [];

  /**
   * Constructor del componente
   * @param noticeService - Servicio para operaciones básicas con noticias
   * @param authService - Servicio de autenticación para verificar usuario y permisos
   * @param adminService - Servicio para operaciones administrativas (editar/eliminar)
   */
  constructor(
    private noticeService: NoticeService,
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  /**
   * Método del ciclo de vida de Angular
   * Se ejecuta después de inicializar el componente
   * Configura la suscripción al usuario actual y a las noticias actualizadas
   */
  ngOnInit() {
    /* Suscribirse al usuario actual para detectar cambios de sesión */
    const userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.subscriptions.push(userSub);
    
    /* Suscribirse a las noticias para recibir actualizaciones automáticas */
    const noticesSub = this.noticeService.notices$.subscribe(notices => {
      console.log('📰 Noticias actualizadas en componente noticias:', notices);
      this.allNotices = notices.map(notice => ({ ...notice, showDetails: false }));
      this.currentPage = 1; // Resetear a la primera página
      this.updatePagination();
      this.updateDisplayedNotices();
    });
    this.subscriptions.push(noticesSub);
    
    this.loadNotices(); // Carga inicial con filtro
  }

  /**
   * Verifica si el usuario actual es administrador
   * @returns true si el usuario logueado es 'admin', false en caso contrario
   */
  isAdmin(): boolean {
    return this.currentUser?.username === 'admin';
  }

  /**
   * Carga las noticias filtradas por la licencia seleccionada
   * Ahora también verifica las noticias del observable compartido como fallback
   */
  loadNotices() {
    this.isLoading = true;
    this.error = ''; // Limpiar errores previos
    
    this.noticeService.getNoticesByLicense(this.selectedLicense).subscribe({
      next: (data: NoticeDTO[]) => {
        this.allNotices = data.map(notice => ({ ...notice, showDetails: false }));
        this.currentPage = 1; // Resetear a la primera página
        this.updatePagination();
        this.updateDisplayedNotices();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading notices:', err);
        console.log('🔄 Usando noticias del observable compartido como fallback');
        // Fallback: usar las noticias del observable compartido
        this.noticeService.notices$.subscribe(notices => {
          this.allNotices = notices.map(notice => ({ ...notice, showDetails: false }));
          this.currentPage = 1;
          this.updatePagination();
          this.updateDisplayedNotices();
        });
        this.error = 'Error al cargar las noticias (usando datos locales)';
        this.isLoading = false;
      }
    });
  }

  /**
   * Actualiza los datos de paginación basado en el número total de noticias
   */
  private updatePagination() {
    this.totalPages = Math.ceil(this.allNotices.length / this.itemsPerPage);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /**
   * Actualiza las noticias mostradas basado en la página actual
   */
  private updateDisplayedNotices() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.notices = this.allNotices.slice(startIndex, endIndex);
  }

  /**
   * Navega a una página específica
   * @param page - Número de página a mostrar
   */
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedNotices();
      // Scroll hacia arriba para mostrar la nueva página
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Navega a la página anterior
   */
  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  /**
   * Navega a la página siguiente
   */
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  /**
   * Obtiene el rango de elementos mostrados en la página actual
   * @returns Objeto con startItem, endItem y totalItems
   */
  getPageInfo() {
    const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endItem = Math.min(this.currentPage * this.itemsPerPage, this.allNotices.length);
    return {
      startItem,
      endItem,
      totalItems: this.allNotices.length
    };
  }

  /**
   * Alterna la visibilidad de los detalles de una noticia específica
   * @param notice - La noticia cuyo estado de detalle se quiere cambiar
   */
  toggleDetails(notice: NoticeWithDetails) {
    notice.showDetails = !notice.showDetails;
  }

  /**
   * Maneja el cambio de licencia seleccionada
   * @param license - Nueva licencia seleccionada
   */
  onLicenseChange(license: string) {
    this.selectedLicense = license;
    this.isLoading = true; // Indicar que está cargando
    this.error = ''; // Limpiar errores
    this.successMessage = ''; // Limpiar mensajes de éxito
    this.loadNotices();
  }

  // === MÉTODOS DE EDICIÓN (SOLO ADMIN) ===

  /**
   * Prepara el formulario de edición con los datos de una noticia existente
   * Solo disponible para administradores
   * @param notice - La noticia que se quiere editar
   */
  editNotice(notice: NoticeWithDetails) {
    this.editingNotice = {
      id: notice.id,
      titular: notice.titular,
      notice: notice.notice,
      dateYear: notice.dateYear,
      miniature: notice.miniature || '',
      license: 'any' /* Valor por defecto ya que NoticeDTO no incluye license */
    };
    this.showEditNoticeForm = true;
  }

  /**
   * Actualiza una noticia existente en el sistema
   * Solo disponible para administradores
   */
  updateNotice() {
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

    this.adminService.updateNotice(this.editingNotice.id, this.editingNotice).subscribe({
      next: () => {
        this.showSuccess('Noticia actualizada correctamente');
        this.showEditNoticeForm = false;
        this.resetEditForm();
        this.loadNotices();
      },
      error: (err: any) => {
        this.handleError('Error al actualizar la noticia', err);
      }
    });
  }

  /**
   * Elimina una noticia del sistema de forma permanente
   * Solo disponible para administradores
   * @param notice - La noticia a eliminar
   */
  deleteNotice(notice: NoticeWithDetails) {
    /* Verificar que la noticia tenga un ID válido */
    if (!notice.id) {
      this.handleError('No se puede eliminar esta notice', { 
        message: 'El backend no proporcionó un ID válido para esta notice.' 
      });
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar esta notice? Esta acción es PERMANENTE.')) {
      this.adminService.deleteNotice(notice.id).subscribe({
        next: () => {
          this.showSuccess('Notice eliminada correctamente');
          this.loadNotices();
        },
        error: (err: any) => {
          this.handleError('Error al eliminar notice', err);
        }
      });
    }
  }

  /**
   * Cancela la edición de noticia y cierra el formulario
   */
  cancelEdit() {
    this.showEditNoticeForm = false;
    this.resetEditForm();
  }

  /**
   * Reinicia el formulario de edición con valores por defecto
   */
  resetEditForm() {
    this.editingNotice = {
      titular: '',
      notice: '',
      dateYear: new Date().getFullYear().toString(),
      miniature: '',
      license: 'any'
    };
  }

  // === MÉTODOS DE UTILIDAD ===

  /**
   * Maneja errores de forma centralizada
   * @param message - Mensaje principal del error
   * @param error - Objeto de error recibido
   */
  private handleError(message: string, error: any) {
    console.error(message, error);
    this.error = message + ': ' + (error.error?.message || error.message || 'Error desconocido');
  }

  /**
   * Muestra un mensaje de éxito temporal
   * @param message - Mensaje de éxito a mostrar
   */
  private showSuccess(message: string) {
    this.successMessage = message;
    this.error = '';
    /* Auto-ocultar después de 3 segundos */
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
