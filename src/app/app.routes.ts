import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { ngxPermissionsGuard } from 'ngx-permissions';

export const routes: Routes = [
    {
        path:'',
        canActivate:[authGuard],
        loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent)
    },
    {
        path:'login',
        loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent) 
    },
    {
        path:'register',
        loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent)
    },
    {
        path:'cart',
        loadComponent: () => import('./components/cart/cart.component').then(c => c.CartComponent),
        canActivate:[authGuard]
    },
    {
        path:'view-product/:id',
        loadComponent: () => import('./components/view-product/view-product.component').then(c => c.ViewProductComponent),
        canActivate:[authGuard]
    },
    {
        path:'profile',
        loadComponent: () => import('./components/customer-profile/customer-profile-layout.component').then(c => c.CustomerProfileComponent),
        canActivate:[authGuard],
        children: [
            {
                path:'',
                loadComponent: () => import('./components/customer-profile/personal-information/personal-information.component').then(c => c.PersonalInformationComponent)
            },
            {
                path:'addresses',
                loadComponent: () => import('./components/customer-profile/addresses/addresses.component').then(c => c.AddressesComponent)
            }
        ]
    },
    {
        path:'checkout',
        loadComponent: () => import('./components/checkout/checkout.component').then(c => c.CheckoutComponent),
        canActivate:[authGuard]
    },
    {
        path:'seller-registration',
        loadComponent: () => import('./components/seller-registration/seller-registration.component').then(c => c.SellerRegistrationComponent),
    },

    // {
    //     path:'add-product',
    //     loadComponent: () => import('./admin/products/add-product/add-product.component').then(c => c.AddProductComponent),
    //     canActivate:[authGuard],
    // },
    // {
    //     path:'edit-product',
    //     loadComponent: () => import('./admin/products/add-product/add-product.component').then(c => c.AddProductComponent),
    //     canActivate:[authGuard],
    // },
    {
        path:'admin',
        children:[
            {
                path:'',
                loadComponent: () => import('./admin/dashboard/dashbaord/dashbaord.component').then(c => c.DashbaordComponent),
                canActivate:[authGuard, ngxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['SELLER']
                    }
                }
            },
            // {
            //     path:'add-product',
            //     loadComponent: () => import('./admin/products/add-product/add-product.component').then(c => c.AddProductComponent),
            //     canActivate:[authGuard],
            //     data: {
            //         // permissions: {
            //         //     only: ['SELLER']
            //         // }
            //     }
            // },
            // {
            //     path:'edit-product/:id',
            //     loadComponent: () => import('./admin/products/add-product/add-product.component').then(c => c.AddProductComponent),
            //     canActivate:[authGuard],
            //     data: {
            //         isEditProduct: true,
            //         permissions: {
            //             only: ['SELLER']
            //         }   
            //     }
            // },
        ]
    } 
];
