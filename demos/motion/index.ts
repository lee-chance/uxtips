import type { ComponentType } from "react";
import type { DemoProps } from "@/components/demo/context";
import Parallax from "./Parallax";
import StickyHeader from "./StickyHeader";
import HideOnScroll from "./HideOnScroll";
import BackToTop from "./BackToTop";
import ContainerTransform from "./ContainerTransform";
import Ripple from "./Ripple";
import SplashScreen from "./SplashScreen";

export const motionDemos: Record<string, ComponentType<DemoProps>> = {
  parallax: Parallax,
  "sticky-header": StickyHeader,
  "hide-on-scroll": HideOnScroll,
  "back-to-top": BackToTop,
  "container-transform": ContainerTransform,
  ripple: Ripple,
  "splash-screen": SplashScreen,
};
