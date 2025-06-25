import { Component, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CreateEventsService } from '../../services/create-events.service';
import { LocationService, Location as LocationData } from '../../services/location.service';
import { HttpClientModule } from '@angular/common/http';

interface EventForm {
  eventName: string;
  venueName: string;
  province: number | '';
  district: number | '';
  ward: number | '';
  streetAddress: string;
  category: string;
  description: string;
  organizationName: string;
  organizationInfo: string;
  organizationDescription: string;
}

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ImageCropperModule,
    HttpClientModule
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent implements OnInit {
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

  // Files for upload
  eventLogoFile: File | null = null;
  eventBackgroundFile: File | null = null;
  organizationLogoFile: File | null = null;
  private selectedFileForCropping: File | null = null;

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
  provinces: LocationData[] = [];
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

  @Output() formChange = new EventEmitter<any>();

  constructor(
    private createEventService: CreateEventsService,
    private locationService: LocationService
  ) {
    this.eventForm.description = this.defaultEventDescription;
  }

  ngOnInit(): void {
    this.loadProvinces();
  }

  loadProvinces(): void {
    this.locationService.getProvinces().subscribe({
      next: (data) => {
        this.provinces = data;
      },
      error: (err) => {
        console.error('Lỗi khi tải tỉnh/thành phố:', err);
        alert('Không thể tải danh sách tỉnh/thành phố. Vui lòng thử lại sau.');
      }
    });
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

    this.selectedFileForCropping = file;
    this.imageChangedEvent = event;
    this.croppingType = imageType as any;
    this.emitFormChange();
  }

  imageCropped(event: any) {
    this.croppedImage = event.base64!;
  }

  saveCroppedImage(): void {
    if (!this.croppingType || !this.croppedImage || !this.selectedFileForCropping) {
      this.cancelCrop();
      return;
    }

    const imageFile = this.base64ToFile(this.croppedImage, this.selectedFileForCropping.name);

    switch (this.croppingType) {
      case 'eventLogo':
        this.eventLogoPreview = this.croppedImage;
        this.eventLogoFile = imageFile;
        break;
      case 'eventBackground':
        this.eventBackgroundPreview = this.croppedImage;
        this.eventBackgroundFile = imageFile;
        break;
      case 'organizationLogo':
        this.organizationLogoPreview = this.croppedImage;
        this.organizationLogoFile = imageFile;
        break;
    }
    this.cancelCrop();
    this.emitFormChange();
  }

  cancelCrop(): void {
    this.imageChangedEvent = '';
    this.croppedImage = '';
    this.croppingType = null;
    this.selectedFileForCropping = null;
  }

  updateCharCount(field: string, event: Event): void {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.charCounts[field] = input.value.length;
    this.emitFormChange();
  }

  getCharCount(field: string): number {
    return this.charCounts[field] || 0;
  }

  onProvinceChange(): void {
    const provinceId = this.eventForm.province;
    this.districts = [];
    this.wards = [];
    this.eventForm.district = '';
    this.eventForm.ward = '';

    if (provinceId) {
      this.locationService.getDistricts(provinceId).subscribe({
        next: (data) => {
          this.districts = data;
        },
        error: (err) => {
          console.error('Lỗi khi tải quận/huyện:', err);
          alert('Không thể tải danh sách quận/huyện. Vui lòng thử lại sau.');
        }
      });
    }
    this.emitFormChange();
  }

  onDistrictChange(): void {
    const districtId = this.eventForm.district;
    this.wards = [];
    this.eventForm.ward = '';

    if (districtId) {
      this.locationService.getWards(districtId).subscribe({
        next: (data) => {
          this.wards = data;
        },
        error: (err) => {
          console.error('Lỗi khi tải phường/xã:', err);
          alert('Không thể tải danh sách phường/xã. Vui lòng thử lại sau.');
        }
      });
    }
    this.emitFormChange();
  }

  onSubmit(): void {
    if (this.validateForm()) {
      if (!this.eventLogoFile || !this.eventBackgroundFile) {
        alert('Vui lòng cung cấp logo và ảnh nền cho sự kiện!');
        return;
      }

      const eventData = {
        eventName: this.eventForm.eventName,
        description: this.eventForm.description,
        provinces: this.eventForm.province,
        districts: this.eventForm.district,
        wardId: this.eventForm.ward,
        addressDetail: this.eventForm.streetAddress,
        addressName: this.eventForm.venueName,
        category: this.eventForm.category,
        organizationName: this.eventForm.organizationName,
        organizationInfo: this.eventForm.organizationInfo,
        organizationDescription: this.eventForm.organizationDescription,
      };

      this.createEventService.createEvent(eventData, this.eventLogoFile, this.eventBackgroundFile)
        .subscribe({
          next: (response) => {
            console.log('Sự kiện đã được tạo thành công:', response);
            alert('Sự kiện đã được tạo thành công!');
            this.resetForm();
          },
          error: (error) => {
            console.error('Lỗi khi tạo sự kiện:', error);
            alert('Đã có lỗi xảy ra khi tạo sự kiện. Vui lòng thử lại.');
          }
        });
    }
    this.emitFormChange();
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
    this.eventLogoFile = null;
    this.eventBackgroundFile = null;
    this.organizationLogoFile = null;
  }

  private base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    if (arr.length < 2) {
      throw new Error('Invalid base64 string');
    }
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || mimeMatch.length < 2) {
      throw new Error('Could not determine mime type from base64 string');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  emitFormChange() {
    this.formChange.emit({
      ...this.eventForm,
      eventLogoFile: this.eventLogoFile,
      eventBackgroundFile: this.eventBackgroundFile,
      organizationLogoFile: this.organizationLogoFile
    });
  }
}