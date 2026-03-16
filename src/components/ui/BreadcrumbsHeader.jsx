import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BreadcrumbsHeader = ({ title, items = [] }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>

      <Breadcrumbs separator=" • ">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return isLast ? (
            <Typography key={item.label} color="text.secondary" fontSize={14}>
              {item.label}
            </Typography>
          ) : (
            <Link
              key={item.label}
              underline="hover"
              color="inherit"
              fontSize={14}
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbsHeader;
