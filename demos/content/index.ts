import type { ComponentType } from "react";
import type { DemoProps } from "@/components/demo/context";
import CoachMarks from "./CoachMarks";
import DragAndDrop from "./DragAndDrop";
import DropdownMenu from "./DropdownMenu";
import EmptyState from "./EmptyState";
import Fab from "./Fab";
import SwipeActions from "./SwipeActions";
import ProgressiveDisclosure from "./ProgressiveDisclosure";

export const contentDemos: Record<string, ComponentType<DemoProps>> = {
  "empty-state": EmptyState,
  "swipe-actions": SwipeActions,
  "drag-and-drop": DragAndDrop,
  "coach-marks": CoachMarks,
  fab: Fab,
  "dropdown-menu": DropdownMenu,
  "progressive-disclosure": ProgressiveDisclosure,
};
