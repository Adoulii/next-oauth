import { toast } from "react-toastify";

const useToast = () => {
  const showError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: true,
      theme: "light",
    });
  };

  const showSuccess = (message) => {    
    toast.success(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: true,
      theme: "light",
    });
  };

  return { showError, showSuccess };
};

export default useToast;
