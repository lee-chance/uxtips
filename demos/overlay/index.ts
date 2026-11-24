import type { ComponentType } from "react";
import type { DemoProps } from "@/components/demo/context";
import Modal from "./Modal";
import Alert from "./Alert";
import BottomSheet from "./BottomSheet";
import ActionSheet from "./ActionSheet";
import Drawer from "./Drawer";
import Popover from "./Popover";
import FullscreenOverlay from "./FullscreenOverlay";

export const overlayDemos: Record<string, ComponentType<DemoProps>> = {
  modal: Modal,
  alert: Alert,
  "bottom-sheet": BottomSheet,
  "action-sheet": ActionSheet,
  drawer: Drawer,
  popover: Popover,
  "fullscreen-overlay": FullscreenOverlay,
};
