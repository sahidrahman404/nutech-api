import type { DB } from '@/database/db';

export function seedDatabase(db: DB) {
  const transaction = db.transaction(() => {
    const bannerCount = db
      .prepare('SELECT COUNT(*) AS count FROM BANNERS')
      .get() as { count: number } | undefined;
    if (!bannerCount) {
      return;
    }
    if (bannerCount.count === 0) {
      const banners = [
        [
          'Banner 1',
          'https://nutech-integrasi.app/dummy.jpg',
          'Lerem Ipsum Dolor sit amet',
        ],
        [
          'Banner 2',
          'https://nutech-integrasi.app/dummy.jpg',
          'Lerem Ipsum Dolor sit amet',
        ],
        [
          'Banner 3',
          'https://nutech-integrasi.app/dummy.jpg',
          'Lerem Ipsum Dolor sit amet',
        ],
        [
          'Banner 4',
          'https://nutech-integrasi.app/dummy.jpg',
          'Lerem Ipsum Dolor sit amet',
        ],
        [
          'Banner 5',
          'https://nutech-integrasi.app/dummy.jpg',
          'Lerem Ipsum Dolor sit amet',
        ],
        [
          'Banner 6',
          'https://nutech-integrasi.app/dummy.jpg',
          'Lerem Ipsum Dolor sit amet',
        ],
      ];
      const insertBanner = db.prepare(
        'INSERT INTO BANNERS (banner_name, banner_image, description) VALUES (?, ?, ?)',
      );
      banners.forEach((banner) =>
        insertBanner.run(banner[0], banner[1], banner[2]),
      );
    }

    const serviceCount = db
      .prepare('SELECT COUNT(*) AS count FROM SERVICES')
      .get() as { count: number } | undefined;
    if (!serviceCount) {
      return;
    }
    if (serviceCount.count === 0) {
      const services = [
        ['PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000],
        ['PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000],
        [
          'PDAM',
          'PDAM Berlangganan',
          'https://nutech-integrasi.app/dummy.jpg',
          40000,
        ],
        ['PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000],
        [
          'PGN',
          'PGN Berlangganan',
          'https://nutech-integrasi.app/dummy.jpg',
          50000,
        ],
        [
          'MUSIK',
          'Musik Berlangganan',
          'https://nutech-integrasi.app/dummy.jpg',
          50000,
        ],
        [
          'TV',
          'TV Berlangganan',
          'https://nutech-integrasi.app/dummy.jpg',
          50000,
        ],
        [
          'PAKET_DATA',
          'Paket data',
          'https://nutech-integrasi.app/dummy.jpg',
          50000,
        ],
        [
          'VOUCHER_GAME',
          'Voucher Game',
          'https://nutech-integrasi.app/dummy.jpg',
          100000,
        ],
        [
          'VOUCHER_MAKANAN',
          'Voucher Makanan',
          'https://nutech-integrasi.app/dummy.jpg',
          100000,
        ],
        ['QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 200000],
        ['ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 300000],
      ];
      const insertService = db.prepare(
        'INSERT INTO SERVICES (service_code, service_name, service_icon, service_tariff) VALUES (?, ?, ?, ?)',
      );
      services.forEach((service) =>
        insertService.run(service[0], service[1], service[2], service[3]),
      );
    }
  });
  transaction();
}
