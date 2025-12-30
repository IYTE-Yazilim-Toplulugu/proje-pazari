'use client'
import { useEffect } from 'react';
import { useToast } from './useToast';
import { ApiError } from '@/lib/api/base';

export function useApiError(){
    const{ error:showError} = useToast(); 
    const handleError = (error: unknown) => {
        if (error instanceof ApiError){
            switch (error.code){
                case 401:
                    showError('Oturum süreniz doldu', 'Lütfen tekrar giriş yapın');
                    //Redirect to login
                    window.location.href = '/login';
                    break;
                case 403:
                    showError('Yetkisiz erişim', 'Bu işlem için yetkiniz bulunmuyor');
                    break;
                case 404:
                    showError('Bulunamadı', 'İstenen kaynak bulunamadı');
                    break;
                case 422:
                    showError('Geçersiz veri', error.message);
                    break;
                case 429:
                    showError('Çok fazla istek', 'Lütfen bir süre bekleyip tekrar deneyin');
                    break;
                case 500:
                case 502:
                case 503:
                    showError('Sunucu hatası', 'Bir hata oluştu, lütfen daha sonra tekrar deneyin');
                    break;
                default:
                    showError('Bir hata oluştu', error.message);

            }

        }else{
            showError('Beklenmeyen bir hata oluştu', 'Lütfen tekrar deneyin');
        }


    };


    return {handleError};
}
