import AdminLayout from "@/layout/adminLayout";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function IncidentReportDetail() {
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query; // Get the ID from the URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (!id) return; // Wait for ID to be available before fetching
        const fetchReport = async () => {
            try {
                const response = await axios.get(`${apiUrl}/verification/incident/${id}`);
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

    const tingkatKeparahanLabels = {
        0: "Ringan (Tanpa perawatan klinik)",
        1: "Sedang (Perlu perawatan klinik)",
        2: "Berat (Perlu dirujuk ke RS)",
        3: "Fatal (Meninggal dunia)"
    };

    // Render the appropriate label based on report.tingkat_keparahan
    const tingkatKeparahanLabel = tingkatKeparahanLabels[report?.tingkat_keparahan] || "N/A"; // Default to "N/A" if no matching value

    if (isLoading) return <div>Loading...</div>;
    if (!report) return <div>No report found</div>;

    const handleStatusChange = async (reportId, newStatus) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            await axios.put(`${apiUrl}/verification/incident/${reportId}`, {
                status: newStatus,
            });
            // Update the status directly after the PUT request
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
                        <h2 className="text-xl font-bold">Detail Laporan Insiden</h2>
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
                            alt="Incident Image"
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
                        <p className="font-semibold">Kategori:</p>
                        <p>{report.kategori || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Departemen:</p>
                        <p>{report.departemen || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Lokasi Insiden:</p>
                        <p>{report.lokasi_insiden || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Jenis Kelamin:</p>
                        <p>{report.jenis_kelamin || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Waktu Kejadian:</p>
                        <p>{new Date(report.waktu_kejadian).toLocaleString("id-ID") || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">No. Telp:</p>
                        <p>{report.no_telp || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Jenis Insiden:</p>
                        <p>{report.jenis_insiden || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Penyebab Insiden:</p>
                        <p>{report.penyebab_insiden || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Penjelasan:</p>
                        <p>{report.penjelasan || "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Melibatkan bahan kimia:</p>
                        <p>{report.isKimia ? "Ya" : "Tidak"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Masalah Penyebab:</p>
                        <p>{report.masalah_penyebab.length ? report.masalah_penyebab.join(", ") : "N/A"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Tingkat Keparahan:</p>
                        <p>{tingkatKeparahanLabel}</p>
                    </div>
                </div>


            </div>
        </AdminLayout>
    );
}
