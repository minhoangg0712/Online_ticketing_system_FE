import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageCropperModule, ImageCroppedEvent } from 'ngx-image-cropper';

interface EventForm {
  eventName: string;
  venueName: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  category: string;
  description: string;
  organizationName: string;
  organizationInfo: string;
  organizationDescription: string;
}

interface LocationData {
  code: string;
  name: string;
}

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [FormsModule, CommonModule, ImageCropperModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  @ViewChild('eventLogoInput') eventLogoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('eventBackgroundInput') eventBackgroundInput!: ElementRef<HTMLInputElement>;
  @ViewChild('organizationLogoInput') organizationLogoInput!: ElementRef<HTMLInputElement>;

  // Form
  eventForm: EventForm = {
    eventName: '',
    venueName: '',
    province: '',
    district: '',
    ward: '',
    streetAddress: '',
    category: '',
    description: '',
    organizationName: '',
    organizationInfo: '',
    organizationDescription: ''
  };

  // Previews
  eventLogoPreview: string | null = null;
  eventBackgroundPreview: string | null = null;
  organizationLogoPreview: string | null = null;

  // Cropper
  imageChangedEvent: any = '';
  croppedImage: string = '';
  croppingType: 'eventLogo' | 'eventBackground' | 'organizationLogo' | null = null;

  // Character counts
  charCounts: { [key: string]: number } = {
    eventName: 0,
    venueName: 0,
    organizationName: 0,
    organizationInfo: 0,
    organizationDescription: 0
  };

  // Location
  provinces: LocationData[] = [
    { code: 'HN', name: 'Hà Nội' },
    { code: 'HCM', name: 'TP. Hồ Chí Minh' },
    { code: 'DN', name: 'Đà Nẵng' },
  ];

  districts: LocationData[] = [];
  wards: LocationData[] = [];

  defaultEventDescription = `Thông tin sự kiện (mẫu) [Trình bày ngắn gọn sự kiện 10% Nội dung chính...]

CÁC LƯU Ý KHI TẠO SỰ KIỆN:
- Khán giả: [Thông tin khách mời...]
- Thời gian/dự kiến diễn ra sự kiện: [Thời gian, quà tặng...]

ĐỊA ĐIỂM DIỄN RA SỰ KIỆN:
[Địa chỉ cụ thể]
Lưu ý: dự kiến khách mời
Lưu ý: dự kiến khách VVIP`;

  constructor() {
    this.eventForm.description = this.defaultEventDescription;
  }

  triggerFileInput(inputType: string): void {
    switch (inputType) {
      case 'eventLogo':
        this.croppingType = 'eventLogo';
        this.eventLogoInput.nativeElement.click();
        break;
      case 'eventBackground':
        this.croppingType = 'eventBackground';
        this.eventBackgroundInput.nativeElement.click();
        break;
      case 'organizationLogo':
        this.croppingType = 'organizationLogo';
        this.organizationLogoInput.nativeElement.click();
        break;
    }
  }

  onImageSelected(event: Event, imageType: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB!');
      return;
    }

    this.imageChangedEvent = event;
    this.croppingType = imageType as any;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64!;
  }

  saveCroppedImage(): void {
    switch (this.croppingType) {
      case 'eventLogo':
        this.eventLogoPreview = this.croppedImage;
        break;
      case 'eventBackground':
        this.eventBackgroundPreview = this.croppedImage;
        break;
      case 'organizationLogo':
        this.organizationLogoPreview = this.croppedImage;
        break;
    }
    this.cancelCrop();
  }

  cancelCrop(): void {
    this.imageChangedEvent = '';
    this.croppedImage = '';
    this.croppingType = null;
  }

  updateCharCount(field: string, event: Event): void {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.charCounts[field] = input.value.length;
  }

  getCharCount(field: string): number {
    return this.charCounts[field] || 0;
  }

  onProvinceChange(): void {
    this.districts = [
      { code: 'D1', name: 'Quận 1' },
      { code: 'D2', name: 'Quận 2' },
    ];
    this.eventForm.district = '';
    this.eventForm.ward = '';
    this.wards = [];
  }

  onDistrictChange(): void {
    this.wards = [
      { code: 'W1', name: 'Phường 1' },
      { code: 'W2', name: 'Phường 2' },
    ];
    this.eventForm.ward = '';
  }

  onSubmit(): void {
    if (this.validateForm()) {
      console.log('Event Form Data:', this.eventForm);
      console.log('Images:', {
        eventLogo: this.eventLogoPreview,
        eventBackground: this.eventBackgroundPreview,
        organizationLogo: this.organizationLogoPreview
      });
      alert('Sự kiện đã được tạo thành công!');
    }
  }

  private validateForm(): boolean {
    if (!this.eventForm.eventName.trim()) {
      alert('Vui lòng nhập tên sự kiện!');
      return false;
    }
    if (!this.eventForm.venueName.trim()) {
      alert('Vui lòng nhập tên địa điểm!');
      return false;
    }

    if (!this.eventForm.category) {
      alert('Vui lòng chọn thể loại sự kiện!');
      return false;
    }
    return true;
  }

  onCancel(): void {
    if (confirm('Bạn có chắc chắn muốn hủy? Tất cả dữ liệu sẽ bị mất!')) {
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.eventForm = {
      eventName: '',
      venueName: '',
      province: '',
      district: '',
      ward: '',
      streetAddress: '',
      category: '',
      description: this.defaultEventDescription,
      organizationName: '',
      organizationInfo: '',
      organizationDescription: ''
    };
    this.eventLogoPreview = null;
    this.eventBackgroundPreview = null;
    this.organizationLogoPreview = null;
    this.charCounts = {
      eventName: 0,
      venueName: 0,
      organizationName: 0,
      organizationInfo: 0,
      organizationDescription: 0
    };
  }
}
