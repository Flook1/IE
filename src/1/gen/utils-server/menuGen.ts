import { type ctxMain } from "@/src/server/api/trpc";
import { prisma } from "@/src/server/db";

    export interface tMenuParent {
        menu_group: null | string;
        menu_item:  string;
        group_icon: string;
        sort_order: number;
        sub_menu:   MenuSub[];
    }

    export interface MenuSub {
        menu_group:   null | string;
        menu_item:    string;
        page_name:    string;
        display_name: string;
        page_url:     string;
        group_icon:   string;
        icon:         string;
        sort_order:   number;
    }




export const menuContent = async (opts: ctxMain, userId: string) => {
  const menCon:tMenuParent[] = await prisma.$queryRaw`
          SELECT
    menu_group,
    menu_item,
    group_icon,
    MIN(sort_order) AS sort_order,
    ARRAY_TO_JSON(ARRAY_AGG(X)) AS sub_menu
FROM
    (
        SELECT
            auth_rule.menu_group,
            COALESCE(auth_rule.menu_group, auth_rule.rule_name) AS menu_item,
            auth_rule.rule_name AS page_name,
            display_name,
            auth_rule.page_url,
            auth_rule.group_icon,
            auth_rule.icon,
            auth_rule.sort_order
        FROM
            auth_rule
            JOIN auth_rr_role_rule auth_rr ON auth_rr.rule_name = auth_rule.rule_name
            JOIN user_main on user_main.role_id = auth_rr.role_id
        WHERE
            user_main.user_id = ${userId}
            AND auth_rule.deleted_on IS NULL
            AND auth_rr.r
            AND auth_rule.sort_order IS NOT NULL
            AND rule_group = 'page'
        ORDER BY
            auth_rule.sort_order
    ) X
GROUP BY
    menu_group,
    menu_item,
    group_icon
ORDER BY
    sort_order
    `;

  return menCon;
};


/* -------------------------------------------------------------------------- */
// Example returned json from above
// admin example
const exampleMenuJsonExample = [
		{
			"menu_group": null,
			"menu_item": "dashboard",
			"group_icon": null,
			"sort_order": 20,
			"sub_menu": [
				{
					"menu_group": null,
					"menu_item": "dashboard",
					"page_name": "dashboard",
					"display_name": "Dashboard",
					"page_url": "/dashboard",
					"group_icon": null,
					"icon": "bi bi-grid-fill",
					"sort_order": 20
				}
			]
		},
		{
			"menu_group": null,
			"menu_item": "projects",
			"group_icon": null,
			"sort_order": 30,
			"sub_menu": [
				{
					"menu_group": null,
					"menu_item": "projects",
					"page_name": "projects",
					"display_name": "Projects",
					"page_url": "/projects",
					"group_icon": null,
					"icon": "bi bi-folder-fill",
					"sort_order": 30
				}
			]
		},
		{
			"menu_group": "Jobs",
			"menu_item": "Jobs",
			"group_icon": "bi bi-incognito",
			"sort_order": 40,
			"sub_menu": [
				{
					"menu_group": "Jobs",
					"menu_item": "Jobs",
					"page_name": "job posts",
					"display_name": "Job Posts",
					"page_url": "/job-posts",
					"group_icon": "bi bi-incognito",
					"icon": "bi bi-clipboard2-fill",
					"sort_order": 40
				},
				{
					"menu_group": "Jobs",
					"menu_item": "Jobs",
					"page_name": "editor bus services",
					"display_name": "Editor Bus Services",
					"page_url": "/editor-bus-services",
					"group_icon": "bi bi-incognito",
					"icon": "bi bi-person-workspace",
					"sort_order": 70
				},
				{
					"menu_group": "Jobs",
					"menu_item": "Jobs",
					"page_name": "editor user services",
					"display_name": "Editor User Services",
					"page_url": "/editor-user-services",
					"group_icon": "bi bi-incognito",
					"icon": "bi bi-person-lines-fill",
					"sort_order": 80
				}
			]
		},
		{
			"menu_group": "Orders",
			"menu_item": "Orders",
			"group_icon": "bi bi-incognito",
			"sort_order": 50,
			"sub_menu": [
				{
					"menu_group": "Orders",
					"menu_item": "Orders",
					"page_name": "orders",
					"display_name": "Orders",
					"page_url": "/orders",
					"group_icon": "bi bi-incognito",
					"icon": "bi bi-cart-check-fill",
					"sort_order": 50
				}
			]
		},
		{
			"menu_group": "Billing",
			"menu_item": "Billing",
			"group_icon": "bi bi-incognito",
			"sort_order": 60,
			"sub_menu": [
				{
					"menu_group": "Billing",
					"menu_item": "Billing",
					"page_name": "discounts",
					"display_name": "Discounts",
					"page_url": "/discounts",
					"group_icon": "bi bi-incognito",
					"icon": "bi bi-tag-fill",
					"sort_order": 140
				},
				{
					"menu_group": "Billing",
					"menu_item": "Billing",
					"page_name": "invoices",
					"display_name": "Invoices",
					"page_url": "/invoices",
					"group_icon": "bi bi-incognito",
					"icon": "bi bi-file-earmark-plus-fill",
					"sort_order": 60
				}
			]
		},
		{
			"menu_group": "Service Info",
			"menu_item": "Service Info",
			"group_icon": "bi bi-incognito",
			"sort_order": 90,
			"sub_menu": [
				{
					"menu_group": "Service Info",
					"menu_item": "Service Info",
					"page_name": "service categories",
					"display_name": "Service Categories",
					"page_url": "/service-categories",
					"group_icon": "bi bi-incognito",
					"icon": "bi bi-clipboard-data-fill",
					"sort_order": 90
				},
				{
					"menu_group": "Service Info",
					"menu_item": "Service Info",
					"page_name": "service types",
					"display_name": "Service Types",
					"page_url": "/service-types",
					"group_icon": "bi bi-incognito",
					"icon": "bi bi-chat-left-text-fill",
					"sort_order": 100
				},
				{
					"menu_group": "Service Info",
					"menu_item": "Service Info",
					"page_name": "services",
					"display_name": "Services",
					"page_url": "/services",
					"group_icon": "bi bi-incognito",
					"icon": "bi bi-gear-fill",
					"sort_order": 110
				}
			]
		},
		{
			"menu_group": "Other",
			"menu_item": "Other",
			"group_icon": "bi bi-incognito",
			"sort_order": 120,
			"sub_menu": [
				{
					"menu_group": "Other",
					"menu_item": "Other",
					"page_name": "users",
					"display_name": "Users",
					"page_url": "/users",
					"group_icon": "bi bi-incognito",
					"icon": "bi bi-people-fill",
					"sort_order": 150
				},
				{
					"menu_group": "Other",
					"menu_item": "Other",
					"page_name": "roles",
					"display_name": "Roles",
					"page_url": "/roles",
					"group_icon": "bi bi-incognito",
					"icon": "bi bi-person-badge-fill",
					"sort_order": 170
				},
				{
					"menu_group": "Other",
					"menu_item": "Other",
					"page_name": "business info",
					"display_name": "Business Info",
					"page_url": "/business-info",
					"group_icon": "bi bi-incognito",
					"icon": "bi bi-briefcase-fill",
					"sort_order": 120
				}
			]
		}
	]

