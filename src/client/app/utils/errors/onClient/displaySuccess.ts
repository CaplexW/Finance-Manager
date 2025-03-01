import { toast } from "react-toastify";

export default function displaySuccess(message: string) {
  toast.success(message);
}
