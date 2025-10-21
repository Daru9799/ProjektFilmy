import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { ApiError } from "../models/ApiError";

type ApiErrorDisplayProps = {
  apiError: ApiError | null;
  showToast?: boolean;
  children?: React.ReactNode;
};

const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({ apiError, showToast = true, children }) => {
  useEffect(() => {
    if (apiError && showToast) {
      toast.error(`[${apiError.statusCode}] ${apiError.message}`);
    }
  }, [apiError, showToast]);

  if (!apiError) return <>{children}</>;

  return (
    <div className="text-center my-5">
      {apiError.statusCode && (
        <div className="display-1 text-danger fw-bold mb-3">
          {apiError.statusCode}
        </div>
      )}
      <div className="h5 text-secondary text-danger">
        Wystąpił błąd: {apiError.message}
      </div>
    </div>
  );
};

export default ApiErrorDisplay;
