import { Component, OnInit } from '@angular/core';
import { FooterPageSettingService } from '../services/footer-page-setting.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer-page-setting',
  templateUrl: './footer-page-setting.component.html',
  styleUrls: ['./footer-page-setting.component.css']
})
export class FooterPageSettingComponent implements OnInit {
  footerContent: any = {}; // Store footer content
  editingField: string | null = null; // Track which field is being edited
  baseImageUrl: string = environment.image_url;

  editingIconId: number | null = null; // Currently editing icon ID

  updatedFooterSocialIcon: any = {
    platform_name: '',
    link_url: '',
    icon: null
  };
  
  newFooterSocialIcon: any = {
    platform_name: '',
    link_url: '',
    icon: null
  }; // Data model for creating a new footer social icon

  footerSocialIcons: any[] = []; // Store the list of icons

  constructor(private footerService: FooterPageSettingService) {}

  ngOnInit() {
    this.loadFooterContent();
    this.loadFooterSocialIcons(); // Fetch the icons
  }

  // Function to fetch footer content from the service
  loadFooterContent(): void {
    this.footerService.getFooterContent().subscribe((data: any) => {
      this.footerContent = data.footerContent;
    }, error => {
      console.error('Error fetching footer content:', error);
    });
  }

  editField(fieldName: string, value: string) {
    this.editingField = fieldName;
  }

  saveEdit(fieldName: string) {
    const footerContentId = this.footerContent.id; // Get the ID of the footer content
    this.footerService.updateFooterContent(footerContentId, this.footerContent).subscribe((response) => {
      this.editingField = null;
    });
  }


  // Handle file selection for the icon upload
  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.newFooterSocialIcon.icon = file;
  }

  // Create a new footer social icon
  createFooterSocialIcon(): void {
    const formData = new FormData();
    formData.append('platform_name', this.newFooterSocialIcon.platform_name);
    formData.append('link_url', this.newFooterSocialIcon.link_url);
    formData.append('icon', this.newFooterSocialIcon.icon);

    this.footerService.createFooterSocialIcon(formData).subscribe(
      (response) => {
        console.log('Footer social icon created successfully:', response);
        // Optionally refresh the content after creation
        this.loadFooterContent();
        this.loadFooterSocialIcons();
        // Reset the form
        this.newFooterSocialIcon = { platform_name: '', link_url: '', icon: null };
      },
      (error) => {
        console.error('Error creating footer social icon:', error);
      }
    );
  }

  loadFooterSocialIcons(): void {
    this.footerService.getFooterSocialIcons().subscribe(
      (res: any) => {
        this.footerSocialIcons = res.data || [];
      },
      error => {
        console.error('Error fetching footer social icons:', error);
      }
    );
  }


  editIcon(icon: any) {
    this.editingIconId = icon.id;
    this.updatedFooterSocialIcon = {
      platform_name: icon.platform_name,
      link_url: icon.link_url,
      icon: null // New icon optional
    };
  }
  
  onUpdateFileChange(event: any): void {
    const file = event.target.files[0];
    this.updatedFooterSocialIcon.icon = file;
  }
  
  saveIconEdit(): void {
    if (!this.editingIconId) return;
  
    const formData = new FormData();
    formData.append('platform_name', this.updatedFooterSocialIcon.platform_name);
    formData.append('link_url', this.updatedFooterSocialIcon.link_url);
    if (this.updatedFooterSocialIcon.icon) {
      formData.append('icon', this.updatedFooterSocialIcon.icon);
    }
  
    this.footerService.updateFooterSocialIcon(this.editingIconId, formData).subscribe(
      res => {
        this.loadFooterSocialIcons();
        this.editingIconId = null;
        this.updatedFooterSocialIcon = { platform_name: '', link_url: '', icon: null };
      },
      err => {
        console.error('Error updating icon:', err);
      }
    );
  }
  


}
