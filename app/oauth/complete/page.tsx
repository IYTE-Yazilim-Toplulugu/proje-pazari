'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { authModel } from '@/lib/models';
import { useRegister } from '@/lib/hooks/authHooks';
import { GStatusSchema } from '@/lib/models/Auth';

export default function OAuthCompletePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { mutate: registerUser } = useRegister();
    const [isProcessing, setIsProcessing] = useState(true);
    const hasProcessed = useRef(false);

    useEffect(() => {
        // Prevent duplicate execution
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        const queryParams = {
            status: searchParams.get('status'),
            name: searchParams.get('name'),
            surname: searchParams.get('surname'),
            email: searchParams.get('email'),
            vcode: searchParams.get('vcode'),
            token: searchParams.get('token'),
            rtoken: searchParams.get('rtoken'),
            msg: searchParams.get('msg'),
            code: searchParams.get('code'),
            provider: searchParams.get('provider'),
        };

        console.log('OAuth callback parameters:', queryParams);

        const result = authModel.OAuthCompleteQuerySchema.safeParse(queryParams);

        if (!result.success) {
            console.error('Invalid OAuth callback params:', result.error);
            alert('OAuth doğrulama sırasında geçersiz parametreler.');
            router.push('/login');
            setIsProcessing(false);
            return;
        }

        setProcessed(true);
        const { status, name, surname, email, vcode, token, rtoken, msg, code } = result.data;

        // Handle OAuth status inside useEffect to avoid dependency issues
        const handleOAuthStatus = () => {
            switch (status) {
                case GStatusSchema.enum.SuccessfulJwtTokenProvided:
                    console.log('OAuth login başarılı, tokenlar kaydediliyor...');

                    if (token && rtoken) {
                        try {
                            if (typeof window === 'undefined' || !window.localStorage) {
                                throw new Error('localStorage is not available in this environment.');
                            }

                            window.localStorage.setItem('access_token', token);
                            window.localStorage.setItem('refresh_token', rtoken);

                            alert('Başarıyla giriş yaptınız!');
                            router.push('/dashboard');
                        } catch (error) {
                            console.error('Tokenlar localStorage içine kaydedilirken bir hata oluştu:', error);
                            alert('Oturum bilgileri saklanırken bir hata oluştu. Lütfen tekrar giriş yapın.');
                            router.push('/login');
                        }
                    } else {
                        alert('Token bilgileri eksik');
                        router.push('/login');
                    }
                    setIsProcessing(false);
                    break;

                case GStatusSchema.enum.SuccessfulUserNeedsRegister:
                    console.log('Yeni kullanıcı, kayıt işlemi başlıyor...');

                    if (name && surname && email && vcode) {
                        registerUser(
                            {
                                name,
                                surname,
                                email,
                                oauth_code: vcode,
                            },
                            {
                                onSuccess: () => {
                                    console.log('Kayıt Başarılı');
                                    alert('Kayıt başarılı! Hoş geldiniz.');
                                    router.push('/dashboard');
                                    setIsProcessing(false);
                                },
                                onError: (error) => {
                                    console.error('Kayıt başarısız:', error);
                                    alert('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
                                    router.push('/register');
                                    setIsProcessing(false);
                                },
                            }
                        );
                    } else {
                        alert('Kullanıcı bilgileri eksik');
                        router.push('/register');
                        setIsProcessing(false);
                    }
                    break;

                case GStatusSchema.enum.SessionGenerationError:
                    console.error('Session error:', msg);
                    alert(`Oturum Hatası: ${msg || 'Bilinmeyen hata'}`);
                    router.push('/login');
                    setIsProcessing(false);
                    break;

                case GStatusSchema.enum.AuthenticationError:
                    console.error('Authentication error:', code);
                    alert(`Kimlik Doğrulama Hatası: ${code || 'Bilinmeyen hata'}`);
                    router.push('/login');
                    setIsProcessing(false);
                    break;

                default:
                    console.error('Unknown status:', status);
                    alert('Beklenmeyen bir durum oluştu.');
                    router.push('/login');
                    setIsProcessing(false);
            }
        };

        handleOAuthStatus();
    }, [searchParams, registerUser, router]);

    if (isProcessing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Kimlik Doğrulaması Yapılıyor
                    </h2>
                    <p className="text-gray-600">
                        Lütfen bekleyin, bilgileriniz işleniyor...
                    </p>
                </div>
            </div>
        );
    }

    return null;
}
