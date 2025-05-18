'use server';

import { and, db, desc, eq, schema } from "@designr/db";
import { getCurrentUser } from "../users";

/* {
    id: "1",
    name: "Modern Portfolio",
    image: "https://placehold.co/800x600",
    createdBy: { name: "Elanathan", image: "/user.jpg" },
    isPro: true,
    isStarred: false
}, */
const getCommunityProjects = async (page = 1) => {
    const user = await getCurrentUser();
    const limit = 20;
    const offset = (page - 1) * limit;
    const communityProjects = await db.select({
        id: schema.projects.id,
        name: schema.projects.name,
        image: schema.projects.thumbnailUrl,
        createdBy: {
            name: schema.users.name,
            image: schema.users.imageUrl
        },
        isPro: schema.projects.isProTemplate,
        isStarred: schema.templateFavourites.projectId,
        height: schema.projects.height,
        width: schema.projects.width
    })
        .from(schema.projects)
        .innerJoin(schema.users, eq(schema.projects.userId, schema.users.id))
        .leftJoin(schema.templateFavourites, and(
            eq(schema.templateFavourites.projectId, schema.projects.id),
            eq(schema.templateFavourites.userId, user.id)
        ))
        .where(eq(schema.projects.isTemplate, true))
        .orderBy(desc(schema.projects.createdAt))
        .limit(limit)
        .offset(offset);
    return communityProjects.map(({ width, height, ...project }) => ({
        ...project,
        isStarred: !!project.isStarred,
        isPro: !!project.isPro,
        dimensions: `${width}x${height}`
    }));
};
const toggleTemplateStar = async ({
    projectId,
    shouldStar
}: {
    projectId: string,
    shouldStar: boolean
}) => {
    const user = await getCurrentUser();

    if (shouldStar) {
        await db
            .insert(schema.templateFavourites)
            .values({ userId: user.id, projectId })
            .onConflictDoNothing();
    } else {
        await db
            .delete(schema.templateFavourites)
            .where(
                and(
                    eq(schema.templateFavourites.userId, user.id),
                    eq(schema.templateFavourites.projectId, projectId)
                )
            );
    }
    return {
        projectId,
        shouldStar
    }
}
const createProjectFromTemplate = async (templateId: string) => {
    const user = await getCurrentUser();
    // find the template details 
    const res = await db.select({
        isProTemplate: schema.projects.isProTemplate,
        width: schema.projects.width,
        height: schema.projects.height,
        data: schema.projects.data,
        name: schema.projects.name
    }).from(schema.projects).where(and(
        eq(schema.projects.id, templateId),
        eq(schema.projects.isTemplate, true)
    )).limit(1);
    const template = res?.[0] ?? null
    if (template === null) {
        throw Error("Template not found");
    }
    if (template.isProTemplate && !user.isPro) {
        throw Error("Upgrade your subscription to access template")
    }
    const createdProject = await db
        .insert(schema.projects)
        .values({
            data: template.data,
            height: template.height,
            width: template.width,
            organizationId: user.activeOrganizationId,
            userId: user.id,
            name: template.name
        })
        //@ts-ignore
        .returning({
            id: schema.projects.id,
            organizationId: schema.projects.organizationId
        });
    return {
        id: createdProject[0]?.id,
        organizationId: createdProject[0]?.organizationId
    }


}
export {
    getCommunityProjects,
    toggleTemplateStar,
    createProjectFromTemplate
}