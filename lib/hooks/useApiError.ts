'use client'
import { useToast } from './useToast';
import { ApiError } from '@/lib/api/base';
import { ResponseCodeSchema } from '@/lib/models/Api';

export function useApiError() {
    const { error: showError } = useToast();
    const handleError = (error: unknown) => {
        if (error instanceof ApiError) {
            switch (error.code) {
                case ResponseCodeSchema.enum.UNAUTHORIZED:
                    showError('Yetkisiz erişim', 'Bu işlem için yetkiniz bulunmuyor');
                    break;
                case ResponseCodeSchema.enum.NOT_FOUND:
                    showError('Bulunamadı', 'İstenen kaynak bulunamadı');
                    break;
                case ResponseCodeSchema.enum.BAD_REQUEST:
                case ResponseCodeSchema.enum.VALIDATION_ERROR:
                    showError('Geçersiz veri', error.message);
                    break;
                case ResponseCodeSchema.enum.INTERNAL_SERVER_ERROR:
                    showError('Sunucu hatası', 'Bir hata oluştu, lütfen daha sonra tekrar deneyin');
                    break;
                default:
                    showError('Bir hata oluştu', error.message);
            }
        } else {
            showError('Beklenmeyen bir hata oluştu', 'Lütfen tekrar deneyin');
        }
    };

    return { handleError };
}
