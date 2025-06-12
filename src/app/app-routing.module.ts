// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarSettingsComponent } from './navbar-settings/navbar-settings.component';
import { LandingPageSettingsComponent } from './landing-page-settings/landing-page-settings.component';
import { FeaturePageSettingComponent } from './feature-page-setting/feature-page-setting.component';
import { AboutPageSettingComponent } from './about-page-setting/about-page-setting.component';
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


// Import the AuthGuard
import { AuthGuard } from './auth.guard';




const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Login route
  { path: 'dashboard', component: DashboardComponent , canActivate: [AuthGuard] }, // Dashboard route
  { path: 'navbarSetting', component: NavbarSettingsComponent , canActivate: [AuthGuard] }, // Dashboard route
  { path: 'landing-page', component: LandingPageSettingsComponent , canActivate: [AuthGuard] }, // Dashboard route
  { path: 'feature-page', component: FeaturePageSettingComponent , canActivate: [AuthGuard] }, // Dashboard route
  { path: 'about-page', component: AboutPageSettingComponent , canActivate: [AuthGuard] }, // Dashboard route
  { path: 'client-page', component: ClientPageSettingComponent , canActivate: [AuthGuard] }, // Dashboard route
  { path: 'process-page', component: ProcessPageSettingComponent , canActivate: [AuthGuard] }, // Dashboard route
  { path: 'case-study', component: CaseStudySettingComponent , canActivate: [AuthGuard] }, // Dashboard route
  { path: 'contact-booking', component: ContactBookingSettingComponent , canActivate: [AuthGuard] }, // Dashboard route
  { path: 'tech-page', component: TechPageSettingComponent , canActivate: [AuthGuard] }, // Dashboard route
  { path: 'faqs-page', component: FaqsPageSettingComponent , canActivate: [AuthGuard] }, // Dashboard route
  { path: 'booking', component: BookingComponent , canActivate: [AuthGuard] }, // Dashboard route
  { path: 'supportSetting', component: SupportSubscriptionSettingsComponent , canActivate: [AuthGuard] }, // Dashboard route
  { path: 'clients', component: ClientComponent , canActivate: [AuthGuard] }, // Dashboard route

  { path: 'video-section', component: VideoSectionSettingComponent , canActivate: [AuthGuard] }, // Dashboard route

  { path: 'footer-page', component: FooterPageSettingComponent , canActivate: [AuthGuard] }, // Dashboard route
  { path: 'payment-gateway', component: PaymentGatewayComponent , canActivate: [AuthGuard] }, // Dashboard route

  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login by default
  { path: '**', redirectTo: '/login' } // Handle undefined routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
