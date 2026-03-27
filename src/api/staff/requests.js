import axiosServices from "../index";
import { getStaffBaseUrl } from "./index";
import { getStorageItem } from "../../utils/localStorageHandler";
import { STORAGE_KEYS } from "../../constants/storageKeys";
import { resolveTenantId } from "../../utils/resolveTenantId";

const API_VERSION = import.meta.env.VITE_API_VERSION || "v1";

const api = {
  /** Service requests */
  getServiceRequests: async () => {
    const response = await axiosServices.get(
      `/${getStaffBaseUrl()}/service-request`
    );
    return response.data;
  },

  getServiceRequestById: async (id) => {
    const response = await axiosServices.get(
      `/${getStaffBaseUrl()}/service-request/${id}`
    );
    return response.data;
  },

  getServiceRequestStatuses: async () => {
    const tenantId = resolveTenantId(getStorageItem(STORAGE_KEYS.STAFF));
    if (!tenantId) return [];
    const response = await axiosServices.get(
      `/${getStaffBaseUrl()}/service-request/status/tenant/${tenantId}`
    );
    return response.data;
  },

  updateServiceRequestStatus: async (payload) => {
    const response = await axiosServices.put(
      `/${getStaffBaseUrl()}/service-request/${payload.id}/status`,
      payload
    );
    return response.data;
  },

  getServiceRequestCount: async () => {
    const response = await axiosServices.get(
      `/${getStaffBaseUrl()}/service-request/staff-service-count`
    );
    const raw = response.data;
    return raw?.data !== undefined ? raw.data : raw;
  },

  /** Service requests created by the current staff (for "My requests" tab). */
  getMyServiceRequests: async () => {
    const response = await axiosServices.get(
      `/${getStaffBaseUrl()}/service-request/created-by`
    );
    const data = response.data;
    return Array.isArray(data) ? data : data?.list ?? data?.data ?? [];
  },

  /** Create service request as staff (name/phone from token in backend). */
  createServiceRequestByStaff: async (payload) => {
    const response = await axiosServices.post(
      `/${getStaffBaseUrl()}/service-request`,
      payload
    );
    return response.data;
  },

  /** Rooms for staff's location (flat list). Always returns array. */
  getRoomsForStaff: async () => {
    const response = await axiosServices.get(
      `/${getStaffBaseUrl()}/rooms`
    );
    const data = response?.data;
    return Array.isArray(data) ? data : (data?.list ?? []);
  },

  /** Blocks for staff's location (tenantId + locationId from storage). */
  getBlocksForStaff: async () => {
    const tenantId = resolveTenantId(getStorageItem(STORAGE_KEYS.STAFF));
    const locationId = getStorageItem(STORAGE_KEYS.LOCATION_ID);
    const base = `/${getStaffBaseUrl()}/blocks`;
    const params = tenantId && locationId ? `?tenantId=${tenantId}&locationId=${locationId}` : "";
    const response = await axiosServices.get(base + params);
    const data = response?.data;
    return Array.isArray(data) ? data : (data?.list ?? []);
  },

  /** Floors for a block. */
  getFloorsByBlock: async (blockId) => {
    const response = await axiosServices.get(
      `/${getStaffBaseUrl()}/blocks/${blockId}/floors`
    );
    const data = response?.data;
    return Array.isArray(data) ? data : (data?.list ?? []);
  },

  /** Rooms for a floor. */
  getRoomsByFloor: async (floorId) => {
    const response = await axiosServices.get(
      `/${getStaffBaseUrl()}/floors/${floorId}/rooms`
    );
    const data = response?.data;
    return Array.isArray(data) ? data : (data?.list ?? []);
  },

  /** Services for location (for create-request form). Uses user API path. */
  getServicesForLocation: async () => {
    const tenantId = resolveTenantId(getStorageItem(STORAGE_KEYS.STAFF));
    const locationId = getStorageItem(STORAGE_KEYS.LOCATION_ID);
    if (!tenantId || !locationId) return [];
    const response = await axiosServices.get(
      `/${API_VERSION}/user/tenant/${tenantId}/location/${locationId}/services`
    );
    return Array.isArray(response.data) ? response.data : response.data?.list ?? [];
  },

  /** Resolve scanned room and validate it belongs to staff location. */
  getRoomDetailForQr: async (roomId) => {
    const tenantId = resolveTenantId(getStorageItem(STORAGE_KEYS.STAFF));
    const locationId = getStorageItem(STORAGE_KEYS.LOCATION_ID);
    if (!tenantId || !locationId || !roomId) return null;
    const response = await axiosServices.get(
      `/${API_VERSION}/user/tenant/${tenantId}/room/${roomId}`,
      {
        params: { locationId },
      },
    );
    const raw = response?.data;
    const room = raw?.data ?? raw ?? null;
    if (!room?.id) return null;
    const roomLocationId = room?.location?.id ?? room?.locationId ?? null;
    if (roomLocationId && String(roomLocationId) !== String(locationId)) {
      throw new Error("Room not found.");
    }
    return room;
  },

  /** Product requests */
  getProductRequests: async () => {
    const response = await axiosServices.get(
      `/${getStaffBaseUrl()}/product-request`
    );
    return response.data;
  },

  getProductRequestById: async (id) => {
    const response = await axiosServices.get(
      `/${getStaffBaseUrl()}/product-request/${id}`
    );
    return response.data;
  },

  getProductRequestStatuses: async () => {
    const tenantId = resolveTenantId(getStorageItem(STORAGE_KEYS.STAFF));
    if (!tenantId) return [];
    const response = await axiosServices.get(
      `/${getStaffBaseUrl()}/product-request/status/tenant/${tenantId}`
    );
    return response.data;
  },

  updateProductRequestStatus: async (payload) => {
    const response = await axiosServices.put(
      `/${getStaffBaseUrl()}/product-request/${payload.id}/status`,
      payload
    );
    return response.data;
  },

  getProductRequestCount: async () => {
    const response = await axiosServices.get(
      `/${getStaffBaseUrl()}/product-request/staff-service-count`
    );
    const raw = response.data;
    return raw?.data !== undefined ? raw.data : raw;
  },

  /** Product requests created by the current staff (for "My requests" tab). */
  getMyProductRequests: async () => {
    const response = await axiosServices.get(
      `/${getStaffBaseUrl()}/product-request/created-by`
    );
    const data = response.data;
    return Array.isArray(data) ? data : data?.list ?? data?.data ?? [];
  },
};

export { api };
