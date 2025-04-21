import { Component, OnInit } from '@angular/core';
import { FaqsPageService } from 'src/app/services/faqs-page.service';
import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: 'app-faqs-page-setting',
  templateUrl: './faqs-page-setting.component.html',
  styleUrls: ['./faqs-page-setting.component.css']
})
export class FaqsPageSettingComponent implements OnInit {
  title: string = '';
  subheading: string = '';
  faqPageId: number | null = null;
  isSubmitting = false;

  faqList: any[] = [];
  isQnsAnsSubmitting = false;

  newQuestion: string = '';
  newAnswer: string = '';
  isCreatingFaq = false;

  constructor(private faqsService: FaqsPageService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchFaqPageContent();
    this.fetchFaqQnsAnsPageContent();
  }

  showSnackbar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

  fetchFaqPageContent() {
    this.faqsService.getFaqPage().subscribe({
      next: (res: any) => {
        if (res.status && res.data) {
          this.title = res.data.title;
          this.subheading = res.data.subheading;
          this.faqPageId = res.data.id;
        }
      },
      error: (err) => {
        console.error('Failed to fetch FAQ page content:', err);
        this.showSnackbar('Error fetching FAQ page content');
      }
    });
  }

  createFaqQnsAns() {
    if (!this.newQuestion || !this.newAnswer) return;
  
    this.isCreatingFaq = true;
  
    const payload = {
      question: this.newQuestion,
      answer: this.newAnswer
    };
  
    this.faqsService.createFaqQnsAns(payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.showSnackbar('New FAQ added successfully!');
          this.newQuestion = '';
          this.newAnswer = '';
          this.fetchFaqQnsAnsPageContent(); // Refresh list
        }else {
          this.showSnackbar('Failed to add new FAQ');
        }
        this.isCreatingFaq = false;
      },
      error: (err) => {
        console.error('Error creating new FAQ:', err);
        this.showSnackbar('Error while adding new FAQ');
        this.isCreatingFaq = false;
      }
    });
  }

  updateFaqPage() {
    if (!this.faqPageId || !this.title || !this.subheading) return;

    this.isSubmitting = true;
    const payload = { title: this.title, subheading: this.subheading };

    this.faqsService.updateFaqPage(this.faqPageId, payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.showSnackbar('FAQ page content updated successfully!');
        } else {
          this.showSnackbar('Failed to update FAQ page content');
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error updating FAQ page:', err);
        this.showSnackbar('Error while updating FAQ page content');
        this.isSubmitting = false;
      }
    });
  }

  fetchFaqQnsAnsPageContent() {
    this.faqsService.getFaqQnsAns().subscribe({
      next: (res: any) => {
        if (res.status && res.data) {
          this.faqList = res.data;
        }else {
          this.showSnackbar('Failed to load FAQs');
        }
      },
      error: (err) => {
        console.error('Failed to fetch FAQ questions and answers:', err);
        this.showSnackbar('Error loading FAQ Q&A');
      }
    });
  }

  updateFaqQnsAnsPage(faq: any) {
    this.isQnsAnsSubmitting = true;
  
    const payload = {
      question: faq.question,
      answer: faq.answer
    };
  
    this.faqsService.updateQnsAns(faq.id, payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.showSnackbar(`FAQ ID ${faq.id} updated successfully!`);
        } else {
          this.showSnackbar(`Failed to update FAQ ID ${faq.id}`);
        }
        this.isQnsAnsSubmitting = false;
      },
      error: (err) => {
        console.error('Error updating FAQ question/answer:', err);
        this.showSnackbar(`Error updating FAQ `);
        this.isQnsAnsSubmitting = false;
      }
    });
  }
  
}
