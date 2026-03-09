import ProjectCardSkeleton from './ProjectCardSkeleton';

export default function ProjectsGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <ProjectCardSkeleton key={i} />
            ))}
        </div>
    );
}
