import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { ServicesComponent } from './pages/services/services';
import { AboutComponent } from './pages/about/about';
import { PortfolioComponent } from './pages/portfolio/portfolio';
import { DevelopmentComponent } from './pages/development/development';
import { ContactComponent } from './pages/contact/contact';
import { TermsComponent } from './pages/terms-of-service/terms-of-service'
import { PrivacyComponent } from './pages/privacy-policy/privacy-policy'
import { CookieComponent } from './pages/cookie-policy/cookie-policy';
import { ServiceLevelAgreementComponent } from './pages/service-level-agreement/service-level-agreement';
import { AcceptableUseComponent } from './pages/acceptable-use-policy/acceptable-use-policy';
import { DisclaimerComponent } from './pages/disclaimer/disclaimer';
import { ErrorComponent } from './pages/error-page/error-page'

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'about', component: AboutComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'in-development', component: DevelopmentComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'terms-of-service', component: TermsComponent },
  { path: 'privacy-policy', component: PrivacyComponent },
  { path: 'cookie-policy', component: CookieComponent },
  { path: 'service-level-agreement', component: ServiceLevelAgreementComponent },
  { path: 'acceptable-use-policy', component: AcceptableUseComponent },
  { path: 'disclaimer', component: DisclaimerComponent },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }