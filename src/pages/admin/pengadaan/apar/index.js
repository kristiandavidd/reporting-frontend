import AdminLayout from "@/layout/adminLayout"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import axios from "axios"
import React, { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button";

export default function Apar() {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await axios.get(`${apiUrl}/tracking/apar`);
                console.log("Response data:", response.data);
                setReports(response.data.data || []); // Pastikan data diinisialisasi sebagai array
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
            await axios.put(`${apiUrl}/verification/apar/${reportId}`, {
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

    return (
        <AdminLayout>
            <div className="p-6 bg-white rounded-lg">
                <h2 className="mb-4 text-xl font-bold">Laporan Terkini</h2>
                <table className="w-full text-center border border-collapse border-gray-200 table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border border-gray-300">No</th>
                            <th className="px-4 py-2 border border-gray-300">Waktu Pelaporan</th>
                            <th className="px-4 py-2 border border-gray-300">Departemen</th>
                            <th className="px-4 py-2 border border-gray-300">Ruang</th>
                            <th className="px-4 py-2 border border-gray-300">Lantai</th>
                            <th className="px-4 py-2 border border-gray-300">Ruangan</th>
                            <th className="px-4 py-2 border border-gray-300">Status</th>

                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report, index) => (
                            <tr key={report.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-center border border-gray-300">
                                    {index + 1}
                                </td>
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
                                <td className="px-4 py-2 border border-gray-300">
                                    {report.dept}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {report.ruang}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {report.lantai}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {report.jenis}
                                </td>
                                <td className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300">
                                    <Link href={`/admin/pengadaan/apar/${report.id}`} className="px-4 py-1 text-white rounded-lg bg-primary ">
                                        Detail
                                    </Link>
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
                                            <SelectItem value="Selesai">Selesai</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    )
}
