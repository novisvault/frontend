import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public Routes (Wrapped with Unified Public Layout)
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./modules/public/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./modules/public/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'personal',
        loadComponent: () => import('./modules/public/personal/personal.component').then(m => m.PersonalComponent)
      },
      {
        path: 'business',
        loadComponent: () => import('./modules/public/business/business.component').then(m => m.BusinessComponent)
      },
      {
        path: 'loans',
        loadComponent: () => import('./modules/public/loans/loans.component').then(m => m.LoansComponent)
      },
      {
        path: 'cards',
        loadComponent: () => import('./modules/public/cards/cards-public.component').then(m => m.CardsPublicComponent)
      },
      {
        path: 'grants',
        loadComponent: () => import('./modules/public/grants/grants-public.component').then(m => m.GrantsPublicComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./modules/public/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'terms',
        loadComponent: () => import('./modules/public/terms/terms.component').then(m => m.TermsComponent)
      },
      {
        path: 'privacy',
        loadComponent: () => import('./modules/public/privacy/privacy.component').then(m => m.PrivacyComponent)
      },
      {
        path: 'faq',
        loadComponent: () => import('./modules/public/faq/faq.component').then(m => m.FaqComponent)
      }
    ]
  },

  // Auth Routes
  {
    path: 'auth/login',
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./modules/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'auth/admin/login',
    loadComponent: () => import('./modules/auth/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
  },

  // User Dashboard Routes (Protected)
  {
    path: 'user',
    loadComponent: () => import('./layouts/user-layout/user-layout.component').then(m => m.UserLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/user/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'transfers',
        loadComponent: () => import('./modules/user/transfer/transfer.component').then(m => m.TransferComponent)
      },
      {
        path: 'cards',
        loadComponent: () => import('./modules/user/cards/cards.component').then(m => m.CardsComponent)
      },
      {
        path: 'grants',
        loadComponent: () => import('./modules/user/grant/grant.component').then(m => m.GrantComponent)
      },
      {
        path: 'irs-refund',
        loadComponent: () => import('./modules/user/irs-refund/irs-refund.component').then(m => m.IrsRefundComponent)
      },
      {
        path: 'deposits',
        loadComponent: () => import('./modules/user/deposits/deposits.component').then(m => m.DepositsComponent)
      },
      {
        path: 'transactions',
        loadComponent: () => import('./modules/user/transactions/transactions.component').then(m => m.TransactionsComponent)
      },
      {
        path: 'loans',
        loadComponent: () => import('./modules/user/loans/loans.component').then(m => m.LoansComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./modules/user/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'plans',
        loadComponent: () => import('./modules/user/plans/plans.component').then(m => m.PlansComponent)
      }
    ]
  },

  // Admin Dashboard Routes (Protected)
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./modules/admin/users/admin-users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'createnewuser',
        loadComponent: () => import('./modules/admin/create-user/admin-create-user.component').then(m => m.AdminCreateUserComponent)
      },
      {
        path: 'transfers',
        loadComponent: () => import('./modules/admin/transfers/admin-transfers.component').then(m => m.AdminTransfersComponent)
      },
      {
        path: 'deposits',
        loadComponent: () => import('./modules/admin/deposits/admin-deposits.component').then(m => m.AdminDepositsComponent)
      },
      {
        path: 'loans',
        loadComponent: () => import('./modules/admin/loans/admin-loans.component').then(m => m.AdminLoansComponent)
      },
      {
        path: 'cards',
        loadComponent: () => import('./modules/admin/cards/admin-cards.component').then(m => m.AdminCardsComponent)
      },
      {
        path: 'generator',
        loadComponent: () => import('./modules/admin/generator/admin-generator.component').then(m => m.AdminGeneratorComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./modules/admin/settings/admin-settings.component').then(m => m.AdminSettingsComponent)
      }
    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: ''
  }
];
 