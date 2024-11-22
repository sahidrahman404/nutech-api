import type { DB } from '@/database/db';

export function getBanner(tx: DB) {
  const selectStmt = tx.prepare(
    `SELECT banner_name, banner_image, description FROM BANNERS`,
  );
  return selectStmt.all() as {
    banner_name: string;
    banner_image: string;
    description: string;
  }[];
}

export function getServices(tx: DB) {
  const selectStmt = tx.prepare(
    `SELECT service_code, service_name, service_icon, service_tariff FROM SERVICES`,
  );
  return selectStmt.all() as {
    service_code: string;
    service_name: string;
    service_icon: string;
    service_tariff: number;
  }[];
}
