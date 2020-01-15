import React, { MemoExoticComponent, lazy, Suspense } from 'react';
import { Redirect } from "react-router-dom";
import Home from '../application/Home';
import { RouteConfig, RouteConfigComponentProps } from 'react-router-config';


const RecommendComponent = lazy(() => import("../application/Recommend/"));
const SingersComponent = lazy(() => import("../application/Singers/"));
const RankComponent = lazy(() => import("../application/Rank/"));
const AlbumComponent = lazy(() => import("../application/Album/"));
const SingerComponent = lazy(() => import("./../application/Singer/"));
const SearchComponent = lazy(() => import("./../application/Search/"));

interface MyRouteConfig extends RouteConfig {
    component?: React.ComponentType<RouteConfigComponentProps<any>> | React.ComponentType | MemoExoticComponent<any>
}

const SuspenseComponent = (Component: React.ComponentType<RouteConfigComponentProps<any>> | React.ComponentType | MemoExoticComponent<any>) => (props: any) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Component {...props}></Component>
        </Suspense>
    )
}

const routes: Array<MyRouteConfig> = [
    {
        path: "/",
        component: Home,
        routes: [
            {
                path: "/",
                exact: true,
                render: () => (
                    <Redirect to={"/recommend"} />
                )
            },
            {
                path: "/recommend",
                component: SuspenseComponent(RecommendComponent),
                key: 'recommend',
                routes: [
                    {
                        path: "/recommend/:id",
                        component: SuspenseComponent(AlbumComponent)
                    }
                ]
            },
            {
                path: "/singers",
                component: SuspenseComponent(SingersComponent),
                key: "singers",
                routes: [
                    {
                        path: "/singers/:id",
                        component: SuspenseComponent(SingerComponent)
                    }
                ]
            },
            {
                path: "/rank",
                component: SuspenseComponent(RankComponent),
                key: "rank",
                routes: [
                    {
                        path: "/rank/:id",
                        component: SuspenseComponent(AlbumComponent)
                    }
                ]
            },
            {
                path: "/album/:id",
                exact: true,
                key: "album",
                component: SuspenseComponent(AlbumComponent)
            },
            {
                path: "/search",
                exact: true,
                key: "search",
                component: SuspenseComponent(SearchComponent)
            }
        ]
    }
]

export default routes