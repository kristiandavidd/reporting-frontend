import AdminLayout from "@/layout/adminLayout";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function P3k() {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await axios.get(`${apiUrl}/tracking/p3k`);
                console.log("Response Structure:", response.data);  // Log the full response structure
                const fetchedData = response.data.data || [];
                setReports(response.data);
                console.log("Updated Reports:", fetchedData);  // Check the fetched data
            } catch (error) {
                console.error("Error fetching reports:", error.message);
                alert("Failed to load reports: " + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();

    }, []);

    const handleStatusChange = async (reportId, newStatus) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            await axios.put(`${apiUrl}/verification/p3k/${reportId}`, {
                status: newStatus,
            });
            // Update local state with the new status
            setReports((prevReports) =>
                prevReports.map((report) =>
                    report.id === reportId ? { ...report, status: newStatus } : report
                )
            );
        } catch (error) {
            console.error("Error updating status:", error.message);
            alert("Failed to update status: " + error.message);
        }
    };

    if (isLoading) return <p>Loading...</p>;  // Optional loading message

    return (
        <AdminLayout>
            <div className="overflow-x-auto">
                <table className="w-full text-center border border-gray-300 table-auto">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Waktu Pelaporan</th>
                            <th className="p-2 border">Penanggung Jawab</th>
                            <th className="p-2 border">Lantai</th>
                            <th className="p-2 border">Departemen</th>
                            <th className="p-2 border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-2 border">No reports available</td>
                            </tr>
                        ) : (
                            reports.map((report) => (
                                <tr key={report.id}>
                                    <td className="p-2 border">{report.id}</td>
                                    <td className="px-4 py-2 border border-gray-300">
                                        {new Date(report.created_at).toLocaleDateString("id-ID", {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })} Pukul {new Date(report.created_at).toLocaleTimeString("id-ID", {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="p-2 border">{report.penanggungjawab}</td>
                                    <td className="p-2 border">{report.lantai}</td>
                                    <td className="p-2 border">{report.departemen}</td>
                                    <td className="flex justify-center px-4 py-2 ">
                                        <Select
                                            value={report.status}
                                            onValueChange={(value) => handleStatusChange(report.id, value)}
                                        >
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder={report.status} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pengajuan">Pengajuan</SelectItem>
                                                <SelectItem value="PIC K3">PIC K3</SelectItem>
                                                <SelectItem value="Verifikasi">Verifikasi</SelectItem>
                                                <SelectItem value="Proses Penanganan">Proses Penanganan</SelectItem>
                                                <SelectItem value="Selesai">Selesai</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
