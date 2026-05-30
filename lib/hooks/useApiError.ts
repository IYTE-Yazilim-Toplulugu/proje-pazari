'use client'
import { useToast } from './useToast';
import { ApiError } from '@/lib/api/base';
import { ErrorCode } from '@/lib/models/Api';

/**
 * Localized, user-safe toast text per backend {@link ErrorCode}.
 *
 * Branching happens on the stable `errorCode` string — never on the raw
 * backend `message`, which is display-only and may change wording.
 */
const ERROR_MESSAGES: Partial<Record<string, { title: string; description: string }>> = {
    [ErrorCode.VALIDATION_ERROR]: { title: 'Geçersiz veri', description: 'Lütfen girdiğiniz bilgileri kontrol edin' },
    [ErrorCode.MALFORMED_REQUEST]: { title: 'Geçersiz istek', description: 'İstek işlenemedi' },
    [ErrorCode.MISSING_PARAMETER]: { title: 'Geçersiz istek', description: 'Eksik bilgi gönderildi' },
    [ErrorCode.INVALID_ARGUMENT]: { title: 'Geçersiz veri', description: 'Lütfen girdiğiniz bilgileri kontrol edin' },
    [ErrorCode.UNAUTHORIZED]: { title: 'Yetkisiz erişim', description: 'Bu işlem için yetkiniz bulunmuyor' },
    [ErrorCode.ACCESS_DENIED]: { title: 'Erişim reddedildi', description: 'Bu işlem için yetkiniz bulunmuyor' },
    [ErrorCode.USER_NOT_FOUND]: { title: 'Bulunamadı', description: 'Kullanıcı bulunamadı' },
    [ErrorCode.PROJECT_NOT_FOUND]: { title: 'Bulunamadı', description: 'Proje bulunamadı' },
    [ErrorCode.APPLICATION_NOT_FOUND]: { title: 'Bulunamadı', description: 'Başvuru bulunamadı' },
    [ErrorCode.FLAGGED_CONTENT_NOT_FOUND]: { title: 'Bulunamadı', description: 'İçerik bildirimi bulunamadı' },
    [ErrorCode.EMAIL_NOT_VERIFIED]: { title: 'E-posta doğrulanmamış', description: 'Lütfen e-posta adresinizi doğrulayın' },
    [ErrorCode.EMAIL_ALREADY_VERIFIED]: { title: 'Zaten doğrulanmış', description: 'E-posta adresiniz zaten doğrulanmış' },
    [ErrorCode.VERIFICATION_TOKEN_EXPIRED]: { title: 'Bağlantı süresi doldu', description: 'Doğrulama bağlantısının süresi dolmuş' },
    [ErrorCode.INVALID_VERIFICATION_TOKEN]: { title: 'Geçersiz bağlantı', description: 'Geçersiz veya kullanılmış doğrulama bağlantısı' },
    [ErrorCode.EMAIL_SEND_FAILED]: { title: 'E-posta gönderilemedi', description: 'Lütfen daha sonra tekrar deneyin' },
    [ErrorCode.FILE_TOO_LARGE]: { title: 'Dosya çok büyük', description: 'Dosya boyutu izin verilen sınırı aşıyor' },
    [ErrorCode.FILE_VALIDATION_FAILED]: { title: 'Geçersiz dosya', description: 'Dosya doğrulanamadı' },
    [ErrorCode.FILE_STORAGE_ERROR]: { title: 'Dosya hatası', description: 'Dosya işlenirken bir hata oluştu' },
    [ErrorCode.ILLEGAL_USER_STATE]: { title: 'İşlem yapılamadı', description: 'Hesap bu işlem için uygun durumda değil' },
    [ErrorCode.ILLEGAL_APPLICATION_STATE]: { title: 'İşlem yapılamadı', description: 'Başvuru bu işlem için uygun durumda değil' },
    [ErrorCode.INVALID_CREDENTIALS]: { title: 'Giriş başarısız', description: 'Geçersiz e-posta veya şifre' },
    [ErrorCode.ACCOUNT_DEACTIVATED]: { title: 'Hesap devre dışı', description: 'Hesabınız devre dışı bırakılmış' },
    [ErrorCode.APPLICATION_ALREADY_EXISTS]: { title: 'Başvuru mevcut', description: 'Bu projeye zaten başvurdunuz' },
    [ErrorCode.INTERNAL_ERROR]: { title: 'Sunucu hatası', description: 'Bir hata oluştu, lütfen daha sonra tekrar deneyin' },
};

const GENERIC_ERROR = { title: 'Bir hata oluştu', description: 'Lütfen tekrar deneyin' };

export function useApiError() {
    const { error: showError } = useToast();
    const handleError = (error: unknown) => {
        if (error instanceof ApiError) {
            // Resolve by stable errorCode; unknown/missing codes fall back to a
            // generic message — the raw backend message is never shown directly.
            const mapped = (error.errorCode && ERROR_MESSAGES[error.errorCode]) || GENERIC_ERROR;
            showError(mapped.title, mapped.description);
        } else {
            showError('Beklenmeyen bir hata oluştu', 'Lütfen tekrar deneyin');
        }
    };

    return { handleError };
}
