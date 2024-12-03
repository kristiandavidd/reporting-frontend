import AdminLayout from "@/layout/adminLayout"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import axios from "axios"
import React, { useState, useEffect } from 'react'

export default function Insiden() {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await axios.get(`${apiUrl}/tracking/incident`);
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
            await axios.put(`${apiUrl}/verification/incident/${reportId}`, {
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
                <h2 className="mb-4 text-xl font-bold">Submitted Reports</h2>
                <table className="w-full text-center border border-collapse border-gray-200 table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border border-gray-300">No</th>
                            <th className="px-4 py-2 border border-gray-300">Waktu Kejadian</th>
                            <th className="px-4 py-2 border border-gray-300">Pelapor</th>
                            <th className="px-4 py-2 border border-gray-300">Kategori</th>
                            <th className="px-4 py-2 border border-gray-300">Lokasi</th>
                            <th className="px-4 py-2 border border-gray-300">Resiko Bahaya</th>
                            <th className="px-4 py-2 border border-gray-300">Tingkat Keparahan</th>
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
                                    {new Date(report.waktu_kejadian).toLocaleDateString("id-ID", {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })} Pukul {new Date(report.waktu_kejadian).toLocaleTimeString("id-ID", {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {report.nama_pelapor}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {report.kategori}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {report.lokasi_insiden}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {report.jenis_insiden}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                    {report.tingkat_keparahan ? ["Ringan", "Sedang", "Berat", "Fatal"][report.tingkat_keparahan] : "Ringan"}
                                </td>
                                <td className="flex justify-center px-4 py-2 border border-gray-300">
                                    <Select
                                        value={report.status}
                                        onValueChange={(value) => handleStatusChange(report.id, value)}
                                    >
                                        <SelectTrigger className="w-40">
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
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    )
}
