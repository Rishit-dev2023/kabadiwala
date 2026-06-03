import { createContext, useContext } from "react";

export const RouteContext = createContext({ page: "landing", navigate: () => {} });

export const useRoute = () => useContext(RouteContext);
