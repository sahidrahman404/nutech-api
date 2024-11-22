import * as BannerRepositories from '@/banner/repositories';
import type { DB } from '@/database/db';

export function getBanner(db: DB) {
  const transaction = db.transaction(() => BannerRepositories.getBanner(db));
  const banner = transaction();
  return banner;
}

export function getServices(db: DB) {
  const transaction = db.transaction(() => BannerRepositories.getServices(db));
  const services = transaction();
  return services;
}
