import { useToast } from "@/components/ui/use-toast";
import { objUrl } from "@/src/1/gen/types/urls";
import { api } from "@/src/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  IconMenu,
  type tIconMenu,
} from "@/src/1/gen/components/icon-dynamic-menu";
import DebugView from "../test/debug-view";
import { titleCase } from "@/src/1/gen/utils/genBasics";
import { cache20Min } from "@/src/1/gen/utils/genQueryCache";

export type NextPageLayoutProps = {
  children: React.ReactNode;
};

export const LayMain = ({ children }: NextPageLayoutProps) => {
  const router = useRouter();
  const toast = useToast();

  // get basic user content, slow refresh
  const userBasic = api.userBasic.currBasic.useQuery(undefined, {
    enabled: true,
    ...cache20Min,
  });

  const authSesDel = api.authCheck.sesDel.useMutation(undefined);
  const authCheckSes = api.authCheck.sesCheck.useQuery(
    { verify: true, throwErr: true },
    {
      enabled: true,
      retry: false,
      onError: (error) => {
        // redirect to auth
        authSesDel.mutate(undefined, {
          onError: (error) => {
            // needs to show a toast.
            console.log("error with mutation to del ses");
            console.log(error.message);
            toast.toast({
              title: "Contact Image Edits",
              description: "Issue deleting session",
            });
          },
          onSuccess: (data) => {
            // doesnt matter, if did delete or not, as long as cookie setting didnt fail
            setTimeout(() => {
              void router.push(objUrl.v1.auth.login.url);
            }, 1000);
          },
        });
      },
      onSuccess: (data) => {
        // Dont need to do anything
      },
    }
  );

  const authSesValid = api.authCheck.sesGet.useQuery(undefined, {
    enabled: true,
    retry: false,
    ...cache20Min,
    onError: (error) => {
      // console.log("authSesValid: error");
      // console.log(error);
    },
    onSuccess: (data) => {
      // Dont need to do anything
    },
  });

  const menuMain = api.genMain.menuContent.useQuery(undefined, {
    enabled: true,
    ...cache20Min,
  });

  // todo make responsive and add hover effects, create specific menu component for menu nav items
  return (
    <>
      <div className="flex h-screen w-screen flex-row bg-background">
        <div className="flex w-1/5 flex-col border-r">
          <div className="mx-4 my-6">Logo Section</div>
          <hr />
          <div className="mx-4 mb-6 mt-2">
            <h3 className="mb-2 text-xs font-medium uppercase text-zinc-200">
              Main
            </h3>
            {/* Menu items here */}
            <ul className="flex flex-col gap-2">
              {menuMain.data?.menuList.map((item, index) => (
                <li key={index}>
                  <div hidden={item.menu_group !== null}>
                    <Link
                      href={item.sub_menu[0]?.page_url as string}
                      hidden={item.menu_group !== null}
                    >
                      <div className="flex flex-row">
                        <IconMenu
                          icon={item.sub_menu[0]?.icon as tIconMenu}
                          size={15}
                          className="my-auto me-2"
                        ></IconMenu>
                        <p>{item.sub_menu[0]?.display_name}</p>
                      </div>
                    </Link>
                  </div>
                  <div hidden={item.menu_group == null}>
                    <Collapsible>
                      <CollapsibleTrigger>
                        <div className="flex flex-row place-content-center">
                          <IconMenu
                            icon={item.group_icon as tIconMenu}
                            size={15}
                            className="my-auto me-2"
                          ></IconMenu>
                          <p>{item.menu_group}</p>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {item.sub_menu.map((item, index) => (
                          <div key={index} className="mx-2 my-2">
                            <Link
                              href={item.page_url}
                              className="flex flex-row"
                            >
                              <IconMenu
                                icon={item.icon as tIconMenu}
                                size={15}
                                className="my-auto me-2"
                              ></IconMenu>
                              {item.display_name}
                            </Link>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* header section */}
        <div className="w-4/5">
          <div className="flex h-14 flex-row items-center justify-end gap-6 bg-background px-6">
            <p>Header section</p>
            <p>
              Welcome Back,{" "}
              {
                titleCase(
                  userBasic.data?.userContent.name_user as string
                ) as string
              }
            </p>
          </div>
          <div className="mx-6 flex min-h-full flex-col rounded-3xl bg-muted p-6">
            {/* children section */}
            {/* children section */}
            <div className="container border border-red-100">{children}</div>
            {true && (
              <>
                <div className="container my-4 rounded-md border border-red-300 bg-red-50 p-2">
                  <p>LAYOUT Test Data</p>
                  <DebugView
                    visible={true}
                    header="User Data"
                    content={userBasic.data}
                  ></DebugView>
                  <DebugView
                    visible={true}
                    header="Session Data"
                    content={authSesValid.data}
                  ></DebugView>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LayMain;
