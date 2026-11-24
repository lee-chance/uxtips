import type { ComponentType } from "react";
import type { DemoProps } from "@/components/demo/context";
import Toast from "./Toast";
import Snackbar from "./Snackbar";
import Banner from "./Banner";
import InlineValidation from "./InlineValidation";
import Badge from "./Badge";
import Tooltip from "./Tooltip";
import Undo from "./Undo";
import SuccessState from "./SuccessState";
import ErrorMessage from "./ErrorMessage";

export const feedbackDemos: Record<string, ComponentType<DemoProps>> = {
  toast: Toast,
  snackbar: Snackbar,
  banner: Banner,
  "inline-validation": InlineValidation,
  badge: Badge,
  tooltip: Tooltip,
  undo: Undo,
  "success-state": SuccessState,
  "error-message": ErrorMessage,
};
