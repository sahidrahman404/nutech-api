import AppError from '@/error/app-error';

export function imageFormatError() {
  return new AppError(400, {
    status: 102,
    message: 'Format Image tidak sesuai',
  });
}
