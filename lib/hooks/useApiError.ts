'use client'
import { useToast } from './useToast';
import { ApiError } from '@/lib/api/base';
import { ResponseCodeSchema } from '@/lib/models/Api';

export function useApiError() {
    const { error: showError } = useToast();
    const handleError = (error: unknown) => {
        if (error instanceof ApiError) {
            switch (error.code) {
                case ResponseCodeSchema.enum.Unauthenticated:
                    showError('Oturum süreniz doldu', 'Lütfen tekrar giriş yapın');
                    //Redirect to login
                    window.location.href = '/login';
                    break;
                case ResponseCodeSchema.enum.Unauthorized:
                case ResponseCodeSchema.enum.Forbidden:
                    showError('Yetkisiz erişim', 'Bu işlem için yetkiniz bulunmuyor');
                    break;
                case ResponseCodeSchema.enum.NotFound:
                    showError('Bulunamadı', 'İstenen kaynak bulunamadı');
                    break;
                case ResponseCodeSchema.enum.InvalidRequest:
                    showError('Geçersiz veri', error.message);
                    break;
                case ResponseCodeSchema.enum.InternalError:
                case ResponseCodeSchema.enum.ServiceSpecified:
                    showError('Sunucu hatası', 'Bir hata oluştu, lütfen daha sonra tekrar deneyin');
                    break;
                case ResponseCodeSchema.enum.Exists:
                    showError('Kayıt zaten mevcut', error.message);
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

