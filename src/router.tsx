import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    scrollRestorationBehavior: "instant",
    getScrollRestorationKey: (location) =>
      location.pathname === "/" ? "home-always-top" : location.pathname,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
