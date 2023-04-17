import { Routes } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { adminRoutes } from './admin/admin.routes';
import { MobileModule } from './mobile/mobile.module';
import { mobileRoutes } from './mobile/mobile.routes';

export const appRoutes: Routes = [
  {
    path: 'admin',
    module: AdminModule,
    children: adminRoutes,
  },
  {
    path: 'mobile',
    module: MobileModule,
    children: mobileRoutes,
  },
];
