import {index, route, type RouteConfig} from "@react-router/dev/routes";

export default [
    index("routes/page.tsx"),
    route("feedback/start", "routes/feedback/start/page.tsx"),
    route("feedback/run", "routes/feedback/run/page.tsx"),
    route("feedback/end", "routes/feedback/end/page.tsx"),
] satisfies RouteConfig;
