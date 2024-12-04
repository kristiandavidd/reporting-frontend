import AdminLayout from "@/layout/adminLayout";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function ReportDetail() {
    const [report, setReport] = useState(null);
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query; // Mengambil ID dari URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (!id) return; // Menunggu ID tersedia sebelum melakukan fetch
        const fetchReport = async () => {
            try {
                const response = await axios.get(`${apiUrl}/verification/apar/${id}`);
                setReport(response.data.data);
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
            await axios.put(`${apiUrl}/verification/apar/${reportId}`, {
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
                        <h2 className="text-xl font-bold ">Detail Laporan</h2>
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
                {report.img_url && (
                    <div className="mt-6">
                        <p className="font-semibold text-center">Gambar</p>
                        <Image
                            src={`${apiUrl}/${report.img_url}`}
                            alt="Report Image"
                            width={300}
                            height={300}
                            className="mx-auto mt-2 rounded-md"
                        />
                    </div>
                )}
                <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2">
                    <div>
                        <p className="font-semibold">Departemen:</p>
                        <p>{report.dept || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Ruang:</p>
                        <p>{report.ruang || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Lantai:</p>
                        <p>{report.lantai || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Jenis:</p>
                        <p>{report.jenis || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Ukuran:</p>
                        <p>{report.ukuran || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Tanggal Pembelian:</p>
                        <p>{new Date(report.tgl_beli).toLocaleDateString("id-ID") || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Tanggal Isi:</p>
                        <p>{new Date(report.tgl_isi).toLocaleDateString("id-ID") || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Tanggal Expirasi:</p>
                        <p>{new Date(report.tgl_exp).toLocaleDateString("id-ID") || "N/A"}</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
