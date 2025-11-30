import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "../store/createStore";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
