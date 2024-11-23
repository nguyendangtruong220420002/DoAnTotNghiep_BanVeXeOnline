import { useContext } from "react";
import { AuthContext } from "./useContext";

// Use Auth
export const useAuth = () => {
    // Context
    const context = useContext(AuthContext);

    if (!context) throw new Error('Không tìm thấy dữ liệu lưu trữ');

    // Return
    return context;
};
