import type { Application } from '@/lib/models';

interface ApplicationsListProps {
    applications: Application[];
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export default function ApplicationsList({ applications, onApprove, onReject }: ApplicationsListProps) {
    return (
        <div className="space-y-4">
            {applications.map((app) => (
                <div
                    key={app.applicationId}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                {app.applicantName}
                            </h3>
                        </div>
                        <span className="text-sm text-gray-500">
                            {app.createdAt ? new Date(app.createdAt).toLocaleDateString('tr-TR') : ''}
                        </span>
                    </div>

                    {app.status === 'PENDING' && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => onApprove(app.applicationId!)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                            >
                                Onayla
                            </button>
                            <button
                                onClick={() => onReject(app.applicationId!)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            >
                                Reddet
                            </button>
                        </div>
                    )}

                    {app.status && app.status !== 'PENDING' && (
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                            app.status === 'APPROVED'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}>
                            {app.status}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
