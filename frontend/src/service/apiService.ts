import axios from "axios";
import type { IAadhaarData } from "../interfaces/IAadhaar"

export const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URI || "http://localhost:8080";


export const extractAadhaarData = async (
    frontImage: File,
    backImage: File
): Promise<IAadhaarData> => {
    const formData = new FormData();
    formData.append('front', frontImage);
    formData.append('back', backImage);

    const response = await axios.post(`${API_BASE_URL}/extract-data`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
    });

    return response.data.data;


}