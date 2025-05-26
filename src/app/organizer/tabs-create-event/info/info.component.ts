import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface EventForm {
  eventName: string;
  eventType: 'offline' | 'online';
  venueName: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  onlineLink: string;
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
  imports: [FormsModule, CommonModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  @ViewChild('eventLogoInput') eventLogoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('eventBackgroundInput') eventBackgroundInput!: ElementRef<HTMLInputElement>;
  @ViewChild('organizationLogoInput') organizationLogoInput!: ElementRef<HTMLInputElement>;

  // Form data
  eventForm: EventForm = {
    eventName: '',
    eventType: 'offline',
    venueName: '',
    province: '',
    district: '',
    ward: '',
    streetAddress: '',
    onlineLink: '',
    category: '',
    description: '',
    organizationName: '',
    organizationInfo: '',
    organizationDescription: ''
  };

  // Image previews
  eventLogoPreview: string | null = null;
  eventBackgroundPreview: string | null = null;
  organizationLogoPreview: string | null = null;

  // Character counts
  charCounts: { [key: string]: number } = {
    eventName: 0,
    venueName: 0,
    organizationName: 0,
    organizationInfo: 0,
    organizationDescription: 0
  };

  // Location data
  provinces: LocationData[] = [
    { code: 'HN', name: 'Hà Nội' },
    { code: 'HCM', name: 'TP. Hồ Chí Minh' },
    { code: 'DN', name: 'Đà Nẵng' },
    // Add more provinces as needed
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

  // Trigger file input
  triggerFileInput(inputType: string): void {
    switch (inputType) {
      case 'eventLogo':
        this.eventLogoInput.nativeElement.click();
        break;
      case 'eventBackground':
        this.eventBackgroundInput.nativeElement.click();
        break;
      case 'organizationLogo':
        this.organizationLogoInput.nativeElement.click();
        break;
    }
  }

  // Handle image selection
  onImageSelected(event: Event, imageType: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh!');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB!');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        switch (imageType) {
          case 'eventLogo':
            this.eventLogoPreview = result;
            break;
          case 'eventBackground':
            this.eventBackgroundPreview = result;
            break;
          case 'organizationLogo':
            this.organizationLogoPreview = result;
            break;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Update character count
  updateCharCount(field: string, event: Event): void {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.charCounts[field] = input.value.length;
  }

  // Get character count
  getCharCount(field: string): number {
    return this.charCounts[field] || 0;
  }

  // Handle province change
  onProvinceChange(): void {
    // Load districts based on selected province
    // This would typically call an API
    this.districts = [
      { code: 'D1', name: 'Quận 1' },
      { code: 'D2', name: 'Quận 2' },
      // Add more districts
    ];
    this.eventForm.district = '';
    this.eventForm.ward = '';
    this.wards = [];
  }

  // Handle district change
  onDistrictChange(): void {
    // Load wards based on selected district
    this.wards = [
      { code: 'W1', name: 'Phường 1' },
      { code: 'W2', name: 'Phường 2' },
      // Add more wards
    ];
    this.eventForm.ward = '';
  }

  // Form submission
  onSubmit(): void {
    if (this.validateForm()) {
      // Handle form submission
      console.log('Event Form Data:', this.eventForm);
      console.log('Images:', {
        eventLogo: this.eventLogoPreview,
        eventBackground: this.eventBackgroundPreview,
        organizationLogo: this.organizationLogoPreview
      });
      
      // Here you would typically send data to your API
      alert('Sự kiện đã được tạo thành công!');
    }
  }

  // Form validation
  private validateForm(): boolean {
    if (!this.eventForm.eventName.trim()) {
      alert('Vui lòng nhập tên sự kiện!');
      return false;
    }

    if (this.eventForm.eventType === 'offline') {
      if (!this.eventForm.venueName.trim()) {
        alert('Vui lòng nhập tên địa điểm!');
        return false;
      }
    } else if (this.eventForm.eventType === 'online') {
      if (!this.eventForm.onlineLink.trim()) {
        alert('Vui lòng nhập link tham gia!');
        return false;
      }
    }

    if (!this.eventForm.category) {
      alert('Vui lòng chọn thể loại sự kiện!');
      return false;
    }

    return true;
  }

  // Cancel form
  onCancel(): void {
    if (confirm('Bạn có chắc chắn muốn hủy? Tất cả dữ liệu sẽ bị mất!')) {
      this.resetForm();
    }
  }

  // Reset form
  private resetForm(): void {
    this.eventForm = {
      eventName: '',
      eventType: 'offline',
      venueName: '',
      province: '',
      district: '',
      ward: '',
      streetAddress: '',
      onlineLink: '',
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