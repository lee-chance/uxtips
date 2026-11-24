import type { ComponentType } from "react";
import type { DemoProps } from "@/components/demo/context";
import Accordion from "./Accordion";
import Breadcrumb from "./Breadcrumb";
import Carousel from "./Carousel";
import InfiniteScroll from "./InfiniteScroll";
import LoadMore from "./LoadMore";
import Pagination from "./Pagination";
import TabBar from "./TabBar";
import Tabs from "./Tabs";
import FacetedFilter from "./FacetedFilter";
import MegaMenu from "./MegaMenu";
import PageControl from "./PageControl";

export const navigationDemos: Record<string, ComponentType<DemoProps>> = {
  tabs: Tabs,
  "tab-bar": TabBar,
  breadcrumb: Breadcrumb,
  pagination: Pagination,
  "infinite-scroll": InfiniteScroll,
  "load-more": LoadMore,
  accordion: Accordion,
  carousel: Carousel,
  "mega-menu": MegaMenu,
  "page-control": PageControl,
  "faceted-filter": FacetedFilter,
};
