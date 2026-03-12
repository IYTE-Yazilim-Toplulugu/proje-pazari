import { getTranslations } from 'next-intl/server';

export default async function ProjectDetailPage() {
    const t = await getTranslations('projects');
    return (
        <div className="">
            <h1>{t('title')}</h1>
        </div>
    );
}
