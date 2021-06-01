import React from "react";
import { IResponseGetPeople } from "../hooks";

export const PeopleContext = React.createContext<IResponseGetPeople>({
    list: [],
    errorMessage: '',
    refresh: () => {},
});