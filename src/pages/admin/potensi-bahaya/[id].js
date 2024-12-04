import AdminLayout from "@/layout/adminLayout";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function HazardPotentialReportDetail() {
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query; // Getting ID from the URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (!id) return; // Wait for ID before making the fetch request
        const fetchReport = async () => {
            try {
                const response = await axios.get(`${apiUrl}/verification/potential-danger/${id}`);
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
            await axios.put(`${apiUrl}/verification/potential-danger/${reportId}`, {
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
                        <h2 className="text-xl font-bold">Detail Laporan Potensi Bahaya</h2>
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
                                <SelectContent>
                                    <SelectItem value="Pengajuan">Pengajuan</SelectItem>
                                    <SelectItem value="PIC K3">PIC K3</SelectItem>
                                    <SelectItem value="Verifikasi">Verifikasi</SelectItem>
                                    <SelectItem value="Proses Penanganan">Proses Penanganan</SelectItem>
                                    <SelectItem value="Selesai">Selesai</SelectItem>
                                </SelectContent>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {report.bukti_foto && (
                    <div className="mt-6">
                        <p className="font-semibold text-center">Bukti Foto</p>
                        <Image
                            src={`${apiUrl}/${report.bukti_foto}`}
                            alt="Hazard Image"
                            width={300}
                            height={300}
                            className="mx-auto mt-2 rounded-md"
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2">
                    <div>
                        <p className="font-semibold">Nama Pelapor:</p>
                        <p>{report.nama_pelapor || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Nomor Identitas:</p>
                        <p>{report.id_number || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Nomor Telepon:</p>
                        <p>{report.no_telp || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Waktu Kejadian:</p>
                        <p>{new Date(report.waktu_kejadian).toLocaleString("id-ID") || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Kategori:</p>
                        <p>{report.kategori || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Institusi:</p>
                        <p>{report.institusi || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Tujuan:</p>
                        <p>{report.tujuan || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Lokasi Insiden:</p>
                        <p>{report.lokasi_insiden || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Potensi Bahaya:</p>
                        <p>{report.potensi_bahaya || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Resiko Bahaya:</p>
                        <p>{report.resiko_bahaya || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Perbaikan:</p>
                        <p>{report.perbaikan || "N/A"}</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
