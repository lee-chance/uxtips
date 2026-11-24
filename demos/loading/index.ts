import type { ComponentType } from "react";
import type { DemoProps } from "@/components/demo/context";
import CircularProgress from "./CircularProgress";
import IndeterminateProgress from "./IndeterminateProgress";
import OptimisticUI from "./OptimisticUI";
import ProgressBar from "./ProgressBar";
import PullToRefresh from "./PullToRefresh";
import Skeleton from "./Skeleton";
import Spinner from "./Spinner";
import Stepper from "./Stepper";

export const loadingDemos: Record<string, ComponentType<DemoProps>> = {
  skeleton: Skeleton,
  spinner: Spinner,
  "progress-bar": ProgressBar,
  "circular-progress": CircularProgress,
  "indeterminate-progress": IndeterminateProgress,
  "pull-to-refresh": PullToRefresh,
  stepper: Stepper,
  "optimistic-ui": OptimisticUI,
};
