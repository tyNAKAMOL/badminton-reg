"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";


interface Applicant {
  id: string;
  teamName: string;
  category: string;
  player1: string;
  player2: string;
  createdAt: string;
}

export default function Home() {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });
  
  const [activeTab, setActiveTab] = useState(0);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (activeTab === 1) {
      setLoading(true);
      fetch("/api/applicants")
        .then((res) => res.json())
        .then((data) => setApplicants(data))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);
  
  const columns: GridColDef[] = [
    { field: "id", headerName: "No.", flex: 1 },
    { field: "teamName", headerName: "ชื่อทีม", flex: 1 },
    { field: "category", headerName: "ประเภท", flex: 1 },
    { field: "player1", headerName: "ผู้เล่น 1", flex: 1 },
    { field: "player2", headerName: "ผู้เล่น 2", flex: 1 },
    { field: "createdAt", headerName: "วันที่สมัคร", flex: 1 },
  ];
  

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-6">
      <Box sx={{ width: "100%", maxWidth: 800 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleChangeTab}
            textColor="primary"
            indicatorColor="primary"
            centered
          >
            <Tab label="หน้าแรก" />
            <Tab label="ข้อมูลผู้สมัคร" />
          </Tabs>

          {/* หน้าแรก */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <img
                src="/images/ABC.png"
                alt="rules"
                width={600}
                style={{ margin: "0 auto", display: "block" }}
              />
              <Box display="flex" alignItems="center" gap={2} mt={2}>
                <img
                  src="/images/logo.png"
                  alt="logo"
                  width={100}
                  style={{ borderRadius: 8 }}
                />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    ABC Badminton Tournament 2025
                  </Typography>
                  <Typography>4 ตุลาคม 2568</Typography>
                  <Typography>ทวิมุขแบดมินตัน รามคำแหง 36/1</Typography>
                </Box>
              </Box>
              <Box mt={3}>
                <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                  variant="contained"
                  color="primary"
                  href="/register"
                  sx={{ mt: 2 }}
                >
                  สมัครเลย!
                </Button>
              </Box>
            </Box>
          )}

          {/* ข้อมูลผู้สมัคร */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                ข้อมูลผู้สมัคร
              </Typography>
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
  rows={applicants}
  columns={columns}
  paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  loading={loading}
  getRowId={(row) => row.id}
/>

              </div>
            </Box>
          )}
        </Paper>
      </Box>
    </main>
  );
}
