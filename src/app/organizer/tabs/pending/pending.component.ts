import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusTranslatePipe } from '../../../status-translate.pipe';
import { ListEventsService } from '../../services/list-events.service';
import { RouterModule } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [CommonModule, StatusTranslatePipe, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css']
})
export class PendingComponent implements OnInit {
  @Input() events: any[] = [];

  selectedEvent: any = null;
  isEditing = false;
  isLoadingDetail = false;

  logoFile: File | null = null;
  backgroundFile: File | null = null;

  logoPreview: string | null = null;
  backgroundPreview: string | null = null;

  eventForm!: FormGroup;

  constructor(
    private listEventsService: ListEventsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
  console.log('PendingComponent ngOnInit');
    this.eventForm = this.fb.group({
      eventName: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      addressName: ['', Validators.required],
      provinces: ['', Validators.required],
      districts: ['', Validators.required],
      wardId: ['', Validators.required],
      addressDetail: ['', Validators.required],
      category: ['', Validators.required],
      description: ['']
    }, { validators: this.validateTimeOrder });
  }

  /** Lọc sự kiện đang chờ duyệt */
  get pendingEvents() {
  console.log('Lọc sự kiện đang chờ duyệt:', this.events);
    return this.events?.filter(event => event.approvalStatus === 'pending') || [];
  }

  /** Mở chi tiết sự kiện */
  openDetail(event: any) {
  console.log('openDetail called with:', event);
    if (!event?.eventId) return;

    const eventId = event.eventId;
    this.isLoadingDetail = true;

    this.listEventsService.getEventById(eventId.toString()).subscribe({
      next: (res) => {
        this.selectedEvent = {
          ...res.data,
          provinceList: res.data.provinceList || [],
          districtList: res.data.districtList || [],
          wardList: res.data.wardList || []
        };
        this.isLoadingDetail = false;
      },
      error: () => {
        this.isLoadingDetail = false;
      }
    });
  }

  /** Đóng modal chi tiết */
  closeDetail() {
  console.log('Đóng modal chi tiết');
    this.selectedEvent = null;
    this.isEditing = false;
    this.logoFile = null;
    this.backgroundFile = null;
    this.logoPreview = null;
    this.backgroundPreview = null;
    this.eventForm.reset();
  }

  /** Bật chế độ chỉnh sửa và đổ dữ liệu vào form */
  toggleEdit() {
  console.log('toggleEdit, isEditing:', this.isEditing, 'selectedEvent:', this.selectedEvent);
    if (!this.selectedEvent) return;

    if (!this.isEditing) {
      // Bật chế độ chỉnh sửa
      this.isEditing = true;
      this.eventForm.patchValue({
        eventName: this.selectedEvent.eventName || '',
        startTime: this.formatDateTimeForInput(this.selectedEvent.startTime),
        endTime: this.formatDateTimeForInput(this.selectedEvent.endTime),
        addressName: this.selectedEvent.addressName || '',
        provinces: this.selectedEvent.provinces || '',
        districts: this.selectedEvent.districts || '',
        wardId: this.selectedEvent.wardId || '',
        addressDetail: this.selectedEvent.addressDetail || '',
        category: this.selectedEvent.category || '',
        description: this.selectedEvent.description || ''
      });
      this.logoPreview = this.selectedEvent.logoUrl || null;
      this.backgroundPreview = this.selectedEvent.backgroundUrl || null;
    } else {
      // Tắt chế độ chỉnh sửa
      this.isEditing = false;
      this.logoFile = null;
      this.backgroundFile = null;
      this.logoPreview = this.selectedEvent.logoUrl || null;
      this.backgroundPreview = this.selectedEvent.backgroundUrl || null;
      this.eventForm.reset();
    }
  }

  /** Chuyển datetime sang định dạng input[type=datetime-local] */
  formatDateTimeForInput(dateTimeString: string): string {
  console.log('formatDateTimeForInput:', dateTimeString);
    const date = new Date(dateTimeString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }

  /** Xử lý chọn ảnh */
  onFileSelected(event: any, fileType: 'logo' | 'background') {
  console.log('onFileSelected:', event, fileType);
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (fileType === 'logo') {
        this.logoFile = file;
        this.logoPreview = reader.result as string;
      } else {
        this.backgroundFile = file;
        this.backgroundPreview = reader.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  /** Lưu thay đổi */
  saveChanges() {
  console.log('saveChanges called');
  console.log('eventForm value:', this.eventForm.value);
  console.log('selectedEvent:', this.selectedEvent);
    if (this.eventForm.invalid || !this.selectedEvent) {
      this.eventForm.markAllAsTouched();
      return;
    }

    // Build updateDto similar to create-event.component.ts
    const updateDto: any = {
      eventName: this.eventForm.value.eventName,
      description: this.eventForm.value.description,
      provinces: this.eventForm.value.provinces,
      districts: this.eventForm.value.districts,
      wardId: this.eventForm.value.wardId,
      addressDetail: this.eventForm.value.addressDetail,
      addressName: this.eventForm.value.addressName,
      category: this.eventForm.value.category,
      organizationName: this.selectedEvent.organizationName || '',
      organizationInfo: this.selectedEvent.organizationInfo || '',
      organizationDescription: this.selectedEvent.organizationDescription || '',
      startTime: this.eventForm.value.startTime,
      endTime: this.eventForm.value.endTime,
      saleStart: this.selectedEvent.saleStart || '',
      saleEnd: this.selectedEvent.saleEnd || '',
      tickets: this.selectedEvent.ticketTypes
        ? this.selectedEvent.ticketTypes.map((ticket: any) => ({
            ticketType: ticket.name || ticket.ticketType,
            quantityTotal: ticket.quantityTotal || ticket.quantity,
            price: ticket.price
          }))
        : [],
      discounts: this.selectedEvent.discounts || []
    };

    const eventId = this.selectedEvent.eventId;

    this.listEventsService.updateEvent(
      eventId,
      updateDto,
      this.logoFile || undefined,
      this.backgroundFile || undefined
    ).subscribe({
      next: () => {
        const updatedEvent = {
          ...this.selectedEvent,
          ...updateDto,
          logoUrl: this.logoPreview || this.selectedEvent.logoUrl,
          backgroundUrl: this.backgroundPreview || this.selectedEvent.backgroundUrl
        };

        const index = this.events.findIndex(e => e.eventId === eventId);
        if (index !== -1) {
          this.events[index] = updatedEvent;
        }

        this.selectedEvent = updatedEvent;
        this.isEditing = false;
        this.logoFile = null;
        this.backgroundFile = null;
        console.log('Cập nhật sự kiện thành công!');
      },
      error: (err) => {
        console.error('Cập nhật lỗi:', err);
        console.log('Cập nhật sự kiện thất bại!');
      }
    });
  }

  /** Danh sách giá vé hiển thị */
  get ticketPriceList(): { type: string; price: number }[] {
  console.log('ticketPriceList getter:', this.selectedEvent?.ticketPrices);
    if (!this.selectedEvent?.ticketPrices) return [];
    return Object.entries(this.selectedEvent.ticketPrices).map(([type, price]) => ({
      type,
      price: Number(price)
    }));
  }

  /** Validate: startTime < endTime */
  validateTimeOrder(group: AbstractControl): ValidationErrors | null {
  console.log('validateTimeOrder:', group.get('startTime')?.value, group.get('endTime')?.value);
    const start = new Date(group.get('startTime')?.value);
    const end = new Date(group.get('endTime')?.value);
    return start < end ? null : { timeOrderInvalid: true };
  }

  /** trackBy giúp tăng hiệu suất *ngFor */
  trackByEventId(index: number, event: any): any {
  console.log('trackByEventId:', index, event);
    return event?.eventId || index;
  }

  /** Ép kiểu số (nếu cần trong template) */
  asNumber(value: unknown): number {
  console.log('asNumber:', value);
    return Number(value);
  }
}
