import { LINKS } from "#/constants/links";

const handleProjectRedirect = (
    {
        openInNewTab,
        projectId,
        organizationId
    }: {
        openInNewTab?: boolean;
        projectId: string;
        organizationId: string;
    },
) => {
    const projectUrl = `${LINKS.EDITOR}/${organizationId}/${projectId}`;
    const baseUrl = window.location.origin
    // keep the origin and just change the path
    if (openInNewTab) {
        window.open(baseUrl + projectUrl, '_blank');
    } else {
        window.location.assign(projectUrl);
    }
};
export {
    handleProjectRedirect
}