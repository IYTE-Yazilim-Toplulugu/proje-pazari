declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

export function reportWebVitals(metric: any) {
    if (process.env.NODE_ENV === 'production') {
        const { id, name, label, value } = metric;

        if (window.gtag) {
            window.gtag('event', name, {
                event_category: label === 'web-vital' ? 'Web Vitals' : 'Next.js metric',
                value: Math.round(name === 'CLS' ? value * 1000 : value),
                event_label: id,
                non_interaction: true,
            });
        }
    }
}
