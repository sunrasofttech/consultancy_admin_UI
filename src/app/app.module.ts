import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { FormsModule } from '@angular/forms'; // Import FormsModule if needed
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';  // Import NavbarComponent
import { SidebarComponent } from './sidebar/sidebar.component';  // Import SidebarComponent
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { NavbarSettingsComponent } from './navbar-settings/navbar-settings.component';
import { LandingPageSettingsComponent } from './landing-page-settings/landing-page-settings.component';
import { FeaturePageSettingComponent } from './feature-page-setting/feature-page-setting.component';
import { AboutPageSettingComponent } from './about-page-setting/about-page-setting.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ClientPageSettingComponent } from './client-page-setting/client-page-setting.component';
import { ProcessPageSettingComponent } from './process-page-setting/process-page-setting.component';
import { CaseStudySettingComponent } from './case-study-setting/case-study-setting.component';
import { ContactBookingSettingComponent } from './contact-booking-setting/contact-booking-setting.component';
import { TechPageSettingComponent } from './tech-page-setting/tech-page-setting.component';
import { FaqsPageSettingComponent } from './faqs-page-setting/faqs-page-setting.component';
import { BookingComponent } from './booking/booking.component';
import { FooterPageSettingComponent } from './footer-page-setting/footer-page-setting.component';
import { SupportSubscriptionSettingsComponent } from './support-subscription-settings/support-subscription-settings.component';
import { ClientComponent } from './client/client.component';
import { VideoSectionSettingComponent } from './video-section-setting/video-section-setting.component';
import { PaymentGatewayComponent } from './payment-gateway/payment-gateway.component';
import { ReactiveFormsModule } from '@angular/forms'; 

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,  // Declare NavbarComponent
    SidebarComponent,
    DashboardComponent,
    LoginComponent,
    NavbarSettingsComponent,
    LandingPageSettingsComponent,
    FeaturePageSettingComponent,
    AboutPageSettingComponent,
    ClientPageSettingComponent,
    ProcessPageSettingComponent,
    CaseStudySettingComponent,
    ContactBookingSettingComponent,
    TechPageSettingComponent,
    FaqsPageSettingComponent,
    BookingComponent,
    FooterPageSettingComponent,
    SupportSubscriptionSettingsComponent,
    ClientComponent,
    VideoSectionSettingComponent,
    PaymentGatewayComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,  // Add this
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    ToastrModule.forRoot(),  // And this
    ReactiveFormsModule 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
