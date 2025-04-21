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


const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Login route
  { path: 'dashboard', component: DashboardComponent }, // Dashboard route
  { path: 'navbarSetting', component: NavbarSettingsComponent }, // Dashboard route
  { path: 'landing-page', component: LandingPageSettingsComponent }, // Dashboard route
  { path: 'feature-page', component: FeaturePageSettingComponent }, // Dashboard route
  { path: 'about-page', component: AboutPageSettingComponent }, // Dashboard route
  { path: 'client-page', component: ClientPageSettingComponent }, // Dashboard route
  { path: 'process-page', component: ProcessPageSettingComponent }, // Dashboard route
  { path: 'case-study', component: CaseStudySettingComponent }, // Dashboard route
  { path: 'contact-booking', component: ContactBookingSettingComponent }, // Dashboard route
  { path: 'tech-page', component: TechPageSettingComponent }, // Dashboard route
  { path: 'faqs-page', component: FaqsPageSettingComponent }, // Dashboard route
  { path: 'booking', component: BookingComponent }, // Dashboard route


  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login by default
  { path: '**', redirectTo: '/login' } // Handle undefined routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
