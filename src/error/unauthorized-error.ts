import AppError from '@/error/app-error';

export function unauthorizedError() {
  return new AppError(401, {
    status: 108,
    message: 'Token tidak tidak valid atau kadaluwarsa',
  });
}
