import type { ComponentType } from "react";
import type { DemoProps } from "@/components/demo/context";
import { loadingDemos } from "./loading";
import { feedbackDemos } from "./feedback";
import { overlayDemos } from "./overlay";
import { inputDemos } from "./input";
import { navigationDemos } from "./navigation";
import { contentDemos } from "./content";
import { motionDemos } from "./motion";

/** slug → 데모 컴포넌트. 카테고리 폴더의 index.ts에 등록한다. */
export const demos: Record<string, ComponentType<DemoProps>> = {
  ...loadingDemos,
  ...feedbackDemos,
  ...overlayDemos,
  ...inputDemos,
  ...navigationDemos,
  ...contentDemos,
  ...motionDemos,
};
