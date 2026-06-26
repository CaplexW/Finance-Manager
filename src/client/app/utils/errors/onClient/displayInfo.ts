import { toast } from "react-toastify";

export default function displayInfo(message: string) {
  return toast.info(message, { toastId: 'passwordRequirements' });
}
