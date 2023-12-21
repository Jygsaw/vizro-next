import sql from "app/_db/db";
import { RESPONSES } from "app/api/_lib/routeUtils";

import type { DynamicRoute } from "app/_types/site";

function publishCheck(draft: any) {
    return draft.name && draft.description && draft.imageLink;
}

export async function PATCH(_: never, { params: { id } }: DynamicRoute) {
    try {
        const select = await sql `
            SELECT *
            FROM contents
            WHERE draft_of = ${id}
        `;

        if (!select[0]) return RESPONSES.NOT_FOUND;

        if (!publishCheck(select[0])) return RESPONSES.INVALID_DATA;

        if (select[0].draftOf === select[0].contentId) {
            await sql `
                UPDATE contents
                SET draft_of = null
                WHERE draft_of = ${id}
            `;

            return RESPONSES.NO_CONTENT;
        } else {
            await sql `
                WITH draft AS (
                    SELECT *
                    FROM contents
                    WHERE draft_of = ${id}
                )
                UPDATE contents
                SET
                    draft_of = null,
                    name = draft.name,
                    slug = draft.slug,
                    image_link = draft.image_link,
                    description = draft.description,
                    content = draft.content
                FROM draft
                WHERE contents.content_id = ${id}
            `;

            await sql `
                DELETE
                FROM contents
                WHERE draft_of = ${id}
            `;

            return RESPONSES.NO_CONTENT;
        }
    } catch (error) {
        return RESPONSES.SERVER_ERROR;
    }
}
