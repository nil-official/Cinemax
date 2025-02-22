import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../axiosConfig";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  useTheme,
  CircularProgress,
} from "@mui/material";
import RevenueChart from "./RevenueChart";

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [revenueData, setRevenueData] = useState({ x: [], y: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBookings, setTotalBookings] = useState(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        setError(null);

        const startDate = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0];
        const endDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0];

        const response = await axios.post("/dashboard/revenue", {
          startDate,
          endDate,
        });
        if (response.data.status === "success") {
          const x = response.data.data.map((item) => item.date);
          const y = response.data.data.map((item) => item.revenue);
          setRevenueData({ x, y });
        } else {
          throw new Error("Failed to fetch revenue data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  useEffect(() => {
    const fetchTotalBookings = async () => {
      try {
        const response = await axios.get("/dashboard/total-bookings/");

        if (response.data.status === "success") {
          setTotalBookings(response.data.data);
        } else {
          throw new Error("Failed to fetch total bookings");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTotalBookings();
  }, []);

  const totalRevenueLast30Days = revenueData.y.reduce((sum, value) => sum + value, 0);

  const handleCardClick = (days) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);
    const endDate = new Date(today);

    navigate(`/admin/bookings?startDate=${startDate.toISOString().split("T")[0]}&endDate=${endDate.toISOString().split("T")[0]}`);
  };

  return (
    <Box sx={{ padding: "24px" }}>
      <Typography
        variant="h4"
        sx={{
          fontSize: {
            xs: "1.5rem",
            sm: "2rem",
            md: "2.25rem",
          },
          marginBottom: "24px",
        }}
      >
        Dashboard
      </Typography>

      {revenueData.x.length > 0 && revenueData.y.length > 0 ? (
        <Grid container spacing={3}>
          {[{
            title: "Today's Revenue", value: `₹ ${revenueData.y[0]}`, days: 0
          }, {
            title: "Revenue for Last 30 Days", value: `₹ ${totalRevenueLast30Days}`, days: 30
          }, {
            title: "Today's Bookings", value: totalBookings !== null ? totalBookings : "-", days: 0
          }].map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                onClick={() => handleCardClick(stat.days)}
                sx={{
                  borderRadius: "12px",
                  boxShadow: 3,
                  transition: "0.3s",
                  cursor: "pointer",
                  "&:hover": { boxShadow: 6, backgroundColor: "#212a47" },
                }}
              >
                <CardContent>
                  <Typography variant="h4" fontWeight="bold" textAlign="center">
                    {stat.value}
                  </Typography>
                </CardContent>
                <CardHeader
                  title={stat.title}
                  sx={{ textAlign: "center", paddingTop: "0" }}
                  titleTypographyProps={{ sx: { fontSize: "16px" } }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography textAlign="center">No data available</Typography>
      )}

      <Card sx={{ borderRadius: "12px", boxShadow: 3, marginTop: "24px" }}>
        <CardHeader title="Revenue Overview" sx={{ padding: "30px 0 0 30px" }} />
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          ) : (
            <RevenueChart x={revenueData.x} y={revenueData.y} />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
