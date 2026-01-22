export async function applyToProject(
    projectId: string,
    message: string
): Promise<BasicResponse> {
    return mutator({
        url: `/api/v1/projects/${projectId}/applications`,
        method: 'POST',
        body: { message },
        schema: BasicResponseSchema,
    });
}

export async function getProjectApplications(projectId: string) {
    return fetcher({
        url: `/api/v1/projects/${projectId}/applications`,
        schema: z.array(MProjectApplication),
    });
}

export async function withdrawApplication(applicationId: string): Promise<BasicResponse> {
    return mutator({
        url: `/api/v1/applications/${applicationId}`,
        method: 'DELETE',
        schema: BasicResponseSchema,
    });
}
