
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/createStore";

export default function useAppDispatch() {
  return useDispatch<AppDispatch>();
}
