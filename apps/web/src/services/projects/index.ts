'use server';

import { and, count, db, desc, eq, inArray, schema } from "@designr/db";
import { getCurrentUser } from "../users";
import { BadRequestError, UnauthorizedError } from "@designr/api-errors";
import { z } from "zod";

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

type FetchType = 'community' | 'starred' | 'mine';

const fetchProjects = async (
    type: FetchType = 'community',
    page = 1,
) => {
    const user = await getCurrentUser();

    const limit = 20;
    const offset = (page - 1) * limit;

    if (type === 'mine') {
        const {
            data: designs,
            total
        } = await db.transaction(async (tx) => {
            const data = await tx
                .select({
                    id: schema.projects.id,
                    name: schema.projects.name,
                    canView: schema.projects.canView,
                    isTemplate: schema.projects.isTemplate,
                    width: schema.projects.width,
                    height: schema.projects.height,
                    updatedAt: schema.projects.updatedAt,
                })
                .from(schema.projects)
                .where(
                    and(
                        eq(schema.projects.userId, user.id),
                        eq(schema.projects.organizationId, user.activeOrganizationId ?? '')
                    )
                )
                .orderBy(desc(schema.projects.updatedAt))
                .limit(limit)
                .offset(offset);

            const total = await tx
                .select({ count: count() })
                .from(schema.projects)
                .where(
                    and(
                        eq(schema.projects.userId, user.id),
                        eq(schema.projects.organizationId, user.activeOrganizationId ?? '')
                    )
                );
            return {
                data,
                total: Number(total[0]?.count ?? 0)
            }
        });

        return {
            data: designs,
            page,
            totalPages: Math.ceil(total / limit),
            type: 'success' as const
        };
    }

    const {
        data: projects,
        total
    } = await db.transaction(async (tx) => {
        const baseSelect = tx
            .select({
                id: schema.projects.id,
                name: schema.projects.name,
                image: schema.projects.thumbnailUrl,
                createdBy: {
                    name: schema.users.name,
                    image: schema.users.imageUrl,
                },
                isPro: schema.projects.isProTemplate,
                isStarred: schema.templateFavourites.projectId,
                height: schema.projects.height,
                width: schema.projects.width,
            })
            .from(schema.projects)
            .innerJoin(schema.users, eq(schema.projects.userId, schema.users.id));

        let dataQuery;
        let countQuery;

        if (type === 'starred') {
            dataQuery = baseSelect
                .innerJoin(schema.templateFavourites, and(
                    eq(schema.templateFavourites.projectId, schema.projects.id),
                    eq(schema.templateFavourites.userId, user.id)
                ))
                .where(eq(schema.projects.isTemplate, true))
                .orderBy(desc(schema.projects.createdAt))
                .limit(limit)
                .offset(offset);

            countQuery = tx
                .select({ count: count() })
                .from(schema.templateFavourites)
                .innerJoin(schema.projects, eq(schema.templateFavourites.projectId, schema.projects.id))
                .where(eq(schema.templateFavourites.userId, user.id));
        } else {
            dataQuery = baseSelect
                .leftJoin(schema.templateFavourites, and(
                    eq(schema.templateFavourites.projectId, schema.projects.id),
                    eq(schema.templateFavourites.userId, user.id)
                ))
                .where(eq(schema.projects.isTemplate, true))
                .orderBy(desc(schema.projects.createdAt))
                .limit(limit)
                .offset(offset);

            countQuery = tx
                .select({ count: count() })
                .from(schema.projects)
                .where(eq(schema.projects.isTemplate, true));
        }

        const data = await dataQuery.execute();
        const total = await countQuery.execute();
        return {
            data,
            total: Number(total[0]?.count ?? 0)
        };
    });

    return {
        data: projects.map(({ width, height, ...project }) => ({
            ...project,
            isStarred: !!project.isStarred,
            isPro: !!project.isPro,
            dimensions: `${width}x${height}`,
        })),
        page,
        totalPages: Math.ceil(total / limit),
        type: 'success' as const
    };
};
const createANewProject = async ({
    width,
    height,
    name,
    initialData = ''
}: {
    width: number,
    height: number,
    name: string,
    initialData?: string | null
}) => {
    const user = await getCurrentUser();
    const createdProject = await db
        .insert(schema.projects)
        .values({
            data: initialData ?? '',
            height,
            width,
            organizationId: user.activeOrganizationId,
            userId: user.id,
            name
        })
        //@ts-ignore
        .returning({
            id: schema.projects.id,
            organizationId: schema.projects.organizationId,
            name: schema.projects.name,
        });
    return {
        id: createdProject[0]?.id,
        organizationId: createdProject[0]?.organizationId,
        name: createdProject[0]?.name,
        type: "success" as const
    }
}
const duplicateAProject = async ({ oldProjectId }: {
    oldProjectId: string
}) => {
    const user = await getCurrentUser();
    const project = await db
        .select()
        .from(schema.projects)
        .where(
            and(
                eq(schema.projects.id, oldProjectId),
                eq(schema.projects.userId, user.id),
                eq(schema.projects.organizationId, user.activeOrganizationId ?? '')
            )
        )
        .limit(1);
    if (project.length === 0) {
        throw new BadRequestError('Project not found');
    }
    const createdProject = await createANewProject({
        width: project[0].width,
        height: project[0].height,
        /* original name(copy)(date) */
        name: project[0].name + '(copy)' + new Date().toISOString()
            .split('T')[0]
    })
    return { ...createdProject, type: 'success' as const };
}
const deleteProjects = async (ids: string[]) => {
    // its an array of ids user might want to do multi select delete
    const user = await getCurrentUser();
    // check if the user owns all the projects and is within their organization
    if (ids.length === 0) {
        throw new BadRequestError('No projects selected');
    }
    if (ids.length > 10) {
        throw new BadRequestError('Too many projects selected, max of 10');
    }
    const projects = await db
        .select()
        .from(schema.projects)
        .where(
            and(
                eq(schema.projects.userId, user.id),
                eq(schema.projects.organizationId, user.activeOrganizationId ?? ''),
                inArray(schema.projects.id, ids)
            )
        );
    if (projects.length !== ids.length) {
        throw new UnauthorizedError("User does not own all the projects");
    }
    // perform deletion
    await db
        .delete(schema.projects)
        .where(
            and(
                eq(schema.projects.userId, user.id),
                eq(schema.projects.organizationId, user.activeOrganizationId ?? ''),
                inArray(schema.projects.id, ids)
            )
        );
    return {
        message: 'Projects deleted successfully',
        ids
    }
}
const saveProject = async (data: {
    projectId: string,
    data?: string,
    width?: number,
    height?: number,
    name?: string,
    canView?: typeof schema.ProjectViewEnum.enumValues[number],
    canEdit?: typeof schema.ProjectEditEnum.enumValues[number],
}) => {
    if (!data.projectId) {
        throw new BadRequestError('Project ID is required');
    }
    const user = await getCurrentUser();
    // use old values in case of undefined
    const project = await db
        .select(
            {
                id: schema.projects.id,
                name: schema.projects.name,
                data: schema.projects.data,
                height: schema.projects.height,
                width: schema.projects.width,
                canView: schema.projects.canView,
                canEdit: schema.projects.canEdit,
            }
        )
        .from(schema.projects)
        .where(
            and(
                eq(schema.projects.id, data.projectId),
                eq(schema.projects.userId, user.id),
                eq(schema.projects.organizationId, user.activeOrganizationId ?? '')
            )
        )
        .limit(1);
    if (project.length === 0) {
        throw new BadRequestError('Project not found');
    }
    await db
        .update(schema.projects)
        .set({
            data: data.data ?? project[0].data,
            height: data.height ?? project[0].height,
            width: data.width ?? project[0].width,
            name: data.name ?? project[0].name,
            canView: data.canView ?? project[0].canView,
            canEdit: data.canEdit ?? project[0].canEdit
        })
        .where(
            and(
                eq(schema.projects.id, data.projectId),
                eq(schema.projects.userId, user.id),
                eq(schema.projects.organizationId, user.activeOrganizationId ?? '')
            )
        );
    return {
        message: 'Project updated successfully',
        projectId: data.projectId
    }
}

const makeProjectATemplate = async (
    {
        projectId,
        thumbnailUrl,
        showUserIdentity,
    }: {
        projectId: string,
        thumbnailUrl: string,
        showUserIdentity: boolean
    }
) => {
    // if the user is on pro the project is a pro template no excuses man must chop :)
    const user = await getCurrentUser();
    // check if the project is already a template
    const project = await db
        .select()
        .from(schema.projects)
        .where(
            and(
                eq(schema.projects.id, projectId),
                eq(schema.projects.userId, user.id),
                eq(schema.projects.organizationId, user.activeOrganizationId ?? ''),
                eq(schema.projects.isTemplate, true)
            )
        )
        .limit(1);
    if (project.length > 0) {
        throw new BadRequestError('Project is already a template');
    }
    await db
        .update(schema.projects)
        .set({
            isTemplate: true,
            thumbnailUrl,
            showUserIdentity,
            isProTemplate: user.isPro
        });
    return {
        message: "Project has been made a template",
        projectId
    }

}
const getProjectForEditor = async (projectId: string) => {
    const user = await getCurrentUser();
    const project = await db
        .select(
            {
                id: schema.projects.id,
                name: schema.projects.name,
                data: schema.projects.data,
                height: schema.projects.height,
                width: schema.projects.width,

            }
        )
        .from(schema.projects)
        .where(
            and(
                eq(schema.projects.id, projectId),
                eq(schema.projects.userId, user.id),
                eq(schema.projects.organizationId, user.activeOrganizationId ?? '')
            )
        )
        .limit(1);
    if (project.length === 0) {
        throw new BadRequestError('Project not found');
    }
    return project[0];
}
const saveUserMedia = async (media: {
    mediaType: 'IMG' | 'VIDEO',
    url: string,
}[]) => {
    // perform zod validation on the media data
    const user = await getCurrentUser();
    const mediaSchema = z.object({
        mediaType: z.enum(['IMG', 'VIDEO']),
        url: z.string().url()
    });
    const mediaArraySchema = z.array(mediaSchema);
    const parsedMedia = mediaArraySchema.parse(media);
    // save the media for the particular user
    const data = await db
        .insert(schema.userMedia)
        .values(parsedMedia.map((media) => ({
            userId: user.id,
            ...media
        })))
        //@ts-ignore
        .returning({
            id: schema.userMedia.id,
            mediaType: schema.userMedia.mediaType,
            url: schema.userMedia.url,
        })
        ;
    return {
        message: 'Media saved successfully',
        media: data
    }
}
export {
    toggleTemplateStar,
    createProjectFromTemplate,
    fetchProjects,
    deleteProjects,
    duplicateAProject,
    saveProject,
    makeProjectATemplate,
    saveUserMedia,
    getProjectForEditor,
    createANewProject
}