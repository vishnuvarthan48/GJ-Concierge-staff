import axiosServices from "../index";

const API_VERSION = import.meta.env.VITE_API_VERSION || "v1";
const STAFF_ATTACHMENT_PATH = `/${API_VERSION}/staff/attachment`;

/**
 * Upload a file (image) for status update attachments.
 * @param {File} file
 * @returns {Promise<{ id: string }>} attachment id
 */
export const uploadAttachment = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosServices.post(STAFF_ATTACHMENT_PATH, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const data = response?.data;
  return data?.id ? { id: data.id } : data;
};
