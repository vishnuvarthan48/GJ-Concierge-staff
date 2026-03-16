import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import dayjs from "dayjs";

const formatDate = (ts) => (ts == null ? "—" : dayjs(ts).format("DD MMM, HH:mm"));

/**
 * Single request card used in request lists and dashboard recent request.
 * @param { 'service' | 'product' } type
 * @param { object } row - Service: { id, service, status, room, userName, updatedDate }. Product: { id, items, productNames, room, status, userName, updatedDate }
 * @param { boolean } isClosed
 * @param { () => void } onCardClick
 * @param { (e: React.MouseEvent) => void } onUpdateClick
 * @param { boolean } showUpdateButton - If false, hides the Update Status button (e.g. view-only in My requests when not assigned)
 */
export default function RequestCard({ type, row, isClosed, onCardClick, onUpdateClick, showUpdateButton = true }) {
  const title = type === "service" ? row?.service?.name || "—" : row?.productNames || "—";

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={onCardClick}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              {title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: "action.hover",
                fontWeight: 600,
              }}
            >
              {row?.status?.displayName || row?.status?.name || "—"}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Room: {row?.room?.name || "—"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {row?.userName || "—"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(row?.updatedDate)}
          </Typography>
          {showUpdateButton && (
            <Button
              variant="contained"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onUpdateClick(e);
              }}
              disabled={isClosed}
              sx={{ mt: 1, minHeight: 44 }}
            >
              Update Status
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
