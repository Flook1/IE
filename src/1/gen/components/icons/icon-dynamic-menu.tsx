import { z } from "zod";
import {
  Folder,
  FolderTree,
  Home,
  LogOut,
  PackagePlus,
  Users,
  User,
  UserCircle,
  CircleDollarSign,
  Tag,
  LayoutGrid,
  Landmark,
  Aperture,
  UserCheck,
  Wrench,
  SlidersHorizontal,
  UserCog,
  Grid,
  Cog,
  FilePlus,
  Clipboard,
  MessageSquare,
  Accessibility,

} from "lucide-react";

const zIconMenu = z.enum([
"bi bi-wrench",
"bi bi-tool",
"bi bi-tag-fill",
"bi bi-sliders",
"bi bi-person-workspace",
"bi bi-person-lines-fill",
"bi bi-person-badge-fill",
"bi bi-people-fill",
"bi bi-grid-fill",
"bi bi-gear-fill",
"bi bi-folder-fill",
"bi bi-file-earmark-plus-fill",
"bi bi-clipboard2-fill",
"bi bi-clipboard-data-fill",
"bi bi-chat-left-text-fill",
"bi bi-cart-check-fill",
"bi bi-briefcase-fill",
"bi bi-bag-check-fill",
"bi bi-incognito",

]);
export type tIconMenu = z.infer<typeof zIconMenu>;

interface tProps {
  icon: tIconMenu;
  size: number
  className?: string
}


export const IconMenu = (props: tProps) => {
  const Icon = props.icon;

  if (Icon == "bi bi-wrench") {
    return (
      <>
        <Wrench size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-tool") {
    return (
      <>
        <Wrench size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-tag-fill") {
    return (
      <>
        <Tag size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-sliders") {
    return (
      <>
        <SlidersHorizontal size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-person-workspace") {
    return (
      <>
        <PackagePlus size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-person-lines-fill") {
    return (
      <>
        <UserCog size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-person-badge-fill") {
    return (
      <>
        <UserCheck size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-people-fill") {
    return (
      <>
        <Users size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-grid-fill") {
    return (
      <>
        <Home size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-gear-fill") {
    return (
      <>
        <Cog size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-folder-fill") {
    return (
      <>
        <FolderTree size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-file-earmark-plus-fill") {
    return (
      <>
        <FilePlus size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-clipboard2-fill") {
    return (
      <>
        <Clipboard size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-clipboard-data-fill") {
    return (
      <>
        <Clipboard size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-chat-left-text-fill") {
    return (
      <>
        <MessageSquare size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-cart-check-fill") {
    return (
      <>
        <PackagePlus size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-briefcase-fill") {
    return (
      <>
        <Landmark size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-bag-check-fill") {
    return (
      <>
        <Accessibility size={props.size} className={props.className}/>
      </>
    );
  }
  if (Icon == "bi bi-incognito") {
    return (
      <>
        <Grid size={props.size} className={props.className}/>
      </>
    );
  }

  return null
};
