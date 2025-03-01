import { Id, toast } from "react-toastify";

export default function displayLoading(message: string): Id {
  return toast.loading(message);
}
