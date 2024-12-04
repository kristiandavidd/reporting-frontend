import AdminLayout from "@/layout/adminLayout";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function P3KReportDetail() {
    const [report, setReport] = useState(null);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query; // Get ID from URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (!id) return; // Wait for ID before making the fetch request

        const fetchReport = async () => {
            try {
                const response = await axios.get(`${apiUrl}/verification/p3k/${id}`);
                setReport(response.data.data.report);
                setItems(response.data.data.items);
            } catch (error) {
                console.error("Error fetching report:", error.message);
                alert("Failed to load report details: " + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReport();
    }, [id, apiUrl]);

    if (isLoading) return <div>Loading...</div>;
    if (!report) return <div>No report found</div>;

    const handleStatusChange = async (reportId, newStatus) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            await axios.put(`${apiUrl}/verification/p3k/${reportId}`, {
                status: newStatus,
            });
            // Directly update the status of the current report
            setReport((prevReport) => ({
                ...prevReport,
                status: newStatus,
            }));
        } catch (error) {
            console.error("Error updating status:", error.message);
            alert("Failed to update status: " + error.message);
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 bg-white rounded-lg">
                <div className="flex justify-between">
                    <div className="flex items-center gap-4">
                        <Button onClick={() => router.back()}>
                            <IconChevronLeft size={20} />
                        </Button>
                        <h2 className="text-xl font-bold">Detail Laporan P3K</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <p>Ubah Status</p>
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
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2">
                    <div>
                        <p className="font-semibold">Nama Penanggungjawab:</p>
                        <p>{report.name || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Departemen:</p>
                        <p>{report.departemen || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Lantai:</p>
                        <p>{report.lantai || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Tanggal:</p>
                        <p>{new Date(report.date).toLocaleDateString("id-ID") || "N/A"}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-xl font-semibold">Kelengkapan Barang P3K</h3>
                    <table className="w-full mt-4 text-center border border-gray-300 table-auto">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-center border border-gray-300">Nama</th>
                                <th className="px-4 py-2 text-center border border-gray-300">Stock</th>
                                <th className="px-4 py-2 text-center border border-gray-300">Kondisi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 border border-gray-300">{item.name || "N/A"}</td>
                                    <td className="px-4 py-2 border border-gray-300">{item.stock || "0"}</td>
                                    <td className="px-4 py-2 border border-gray-300">{item.condition || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
