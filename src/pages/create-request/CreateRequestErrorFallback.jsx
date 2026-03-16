import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MODULES } from "../../constants/modules";

export default function CreateRequestErrorFallback() {
  const navigate = useNavigate();
  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        This page could not load. Please try again or go back.
      </Typography>
      <Button variant="contained" onClick={() => navigate(`/${MODULES.DASHBOARD}`)}>
        Back to Dashboard
      </Button>
    </Box>
  );
}
