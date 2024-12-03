import React, { useState, useEffect } from 'react'
import UserLayout from '@/layout/userLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from 'axios';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/context/userContext';

export default function ReportInsidentForm() {
    const [activeTab, setActiveTab] = useState('pelaporan');
    const { user } = useUser();
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        nama_pelapor: user ? user.name : "",
        kategori: "",
        lokasi_insiden: "",
        jenis_kelamin: "",
        waktu_kejadian: "",
        no_telp: "",
        jenis_insiden: "",
        penyebab_insiden: "",
        penjelasan: "",
        isKimia: "",
        masalah_penyebab: [],
        tingkat_keparahan: "",
        bukti_foto: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        if (user) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                nama_pelapor: user.name,
            }));
        }
    }, [user]);

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;

        setFormData((prev) => {
            const updatedMasalah = checked
                ? [...prev.masalah_penyebab, value]  // Add item if checked
                : prev.masalah_penyebab.filter((item) => item !== value); // Remove item if unchecked

            return { ...prev, masalah_penyebab: updatedMasalah };
        });
    };

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;

                const response = await axios.get(`${apiUrl}/tracking/incident`);

                setReports(response.data.data || []); // Pastikan data diinisialisasi sebagai array
            } catch (error) {
                console.error("Error fetching reports:", error.message);
                alert("Failed to load reports: " + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
        if (activeTab === 'tracking') {
            setIsLoading(true); // Reset loading indikator
            fetchReports();
        }
    }, [activeTab]);

    const handleFileChange = (e) => {
        setFormData({ ...formData, bukti_foto: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a new FormData instance for file upload
        const formDataToSubmit = new FormData();

        // Append the selected checkboxes and file to the FormData object
        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((item) => formDataToSubmit.append(key, item)); // Handle array fields like checkboxes
            } else if (value) {
                formDataToSubmit.append(key, value); // Handle non-array fields
            }
        });

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await fetch(`${apiUrl}/report/incident`, {
                method: "POST",
                body: formDataToSubmit,
            });

            console.log(formData.masalah_penyebab)
            if (!response.ok) throw new Error("Error submitting data");

            setActiveTab('tracking');
            setFormData({
                nama_pelapor: user ? user.name : "",
                kategori: "",
                lokasi_insiden: "",
                jenis_kelamin: "",
                waktu_kejadian: "",
                no_telp: "",
                jenis_insiden: "",
                penyebab_insiden: "",
                penjelasan: "",
                isKimia: "",
                masalah_penyebab: [],
                tingkat_keparahan: "",
                bukti_foto: null,
            });
            alert("Report successfully submitted!");
        } catch (error) {
            console.error(error);
            alert("Failed to submit report. Please try again.");
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (!Array.isArray(reports) || reports.length === 0) return <p>No reports available.</p>;

    return (
        <UserLayout>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="pelaporan">Pelaporan</TabsTrigger>
                    <TabsTrigger value="tracking">Tracking</TabsTrigger>
                </TabsList>

                {/* Tab Pelaporan */}
                <TabsContent value="pelaporan">
                    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
                        <h1 className="mb-6 text-xl font-bold">Form Laporan Insiden</h1>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label htmlFor="nama_pelapor">Nama Pelapor</Label>
                                <Input
                                    id="nama_pelapor"
                                    name="nama_pelapor"
                                    type="text"
                                    disabled
                                    className="mt-2"
                                    value={user ? user.name : formData.nama_pelapor}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan nama pelapor"
                                />
                            </div>

                            <div>
                                <Label>Kategori</Label>
                                <RadioGroup
                                    className="mt-2"
                                    value={formData.kategori}
                                    onValueChange={(value) => setFormData({ ...formData, kategori: value })}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="mahasiswa" id="mahasiswa" />
                                        <Label htmlFor="mahasiswa">Mahasiswa</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="dosen" id="dosen" />
                                        <Label htmlFor="dosen">Dosen</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="karyawan" id="karyawan" />
                                        <Label htmlFor="karyawan">Karyawan</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="tamu" id="tamu" />
                                        <Label htmlFor="tamu">Tamu</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="lainnya" id="lainnya" />
                                        <Label htmlFor="lainnya">Lainnya</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div>
                                <Label htmlFor="lokasi_insiden">Lokasi Insiden</Label>
                                <Input
                                    id="lokasi_insiden"
                                    name="lokasi_insiden"
                                    type="text"
                                    className="mt-2"
                                    value={formData.lokasi_insiden}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan lokasi insiden"
                                />
                            </div>

                            {/* Jenis Kelamin */}
                            <div>
                                <Label>Jenis Kelamin</Label>
                                <RadioGroup
                                    className="mt-2"
                                    value={formData.jenis_kelamin}
                                    onValueChange={(value) => setFormData({ ...formData, jenis_kelamin: value })}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Laki-laki" id="laki-laki" />
                                        <Label htmlFor="laki-laki">Laki-laki</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Perempuan" id="perempuan" />
                                        <Label htmlFor="perempuan">Perempuan</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div>
                                <Label htmlFor="waktu_kejadian">Waktu Kejadian</Label>
                                <Input
                                    id="waktu_kejadian"
                                    name="waktu_kejadian"
                                    type="datetime-local"
                                    className="mt-2"
                                    value={formData.waktu_kejadian}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <Label htmlFor="no_telp">Nomor Telepon</Label>
                                <Input
                                    id="no_telp"
                                    name="no_telp"
                                    type="text"
                                    className="mt-2"
                                    value={formData.no_telp}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan nomor telepon"
                                />
                            </div>

                            <div>
                                <Label htmlFor="jenis_insiden">Jenis Insiden</Label>
                                <RadioGroup
                                    id="jenis_insiden"
                                    defaultValue=""
                                    className="mt-2"
                                    name="jenis_insiden"
                                    value={formData.jenis_insiden}
                                    onValueChange={(value) => setFormData({ ...formData, jenis_insiden: value })}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="pingsan" id="pingsan" />
                                        <Label htmlFor="pingsan">Pingsan</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="serangan jantung" id="serangan jantung" />
                                        <Label htmlFor="serangan jantung">Serangan Jantung</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="asma" id="asma" />
                                        <Label htmlFor="asma">Asma</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="pendarahan" id="pendarahan" />
                                        <Label htmlFor="pendarahan">Pendarahan</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="keracunan" id="keracunan" />
                                        <Label htmlFor="keracunan">Keracunan</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="cidera" id="cidera" />
                                        <Label htmlFor="cidera">Cidera</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="lainnya" id="lainnya2" />
                                        <Label htmlFor="lainnya2">Lainnya</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div>
                                <Label htmlFor="penyebab_insiden">Penyebab Insiden</Label>
                                <Textarea
                                    id="penyebab_insiden"
                                    name="penyebab_insiden"
                                    className="mt-2"
                                    value={formData.penyebab_insiden}
                                    onChange={handleInputChange}
                                    placeholder="Jelaskan penyebab insiden"
                                />
                            </div>

                            <div>
                                <Label htmlFor="penjelasan">Penjelasan</Label>
                                <Textarea
                                    id="penjelasan"
                                    name="penjelasan"
                                    className="mt-2"
                                    value={formData.penjelasan}
                                    onChange={handleInputChange}
                                    placeholder="Berikan penjelasan detail"
                                />
                            </div>

                            <div>
                                <Label htmlFor="isKimia">Apakah insiden melibatkan bahan kimia?</Label>
                                <RadioGroup
                                    className="mt-2"
                                    value={formData.isKimia}
                                    onValueChange={(value) => setFormData({ ...formData, isKimia: value })}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="0" id="ya" />
                                        <Label htmlFor="ya">Ya</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="1" id="tidak" />
                                        <Label htmlFor="tidak">Tidak</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="2" id="mungkin" />
                                        <Label htmlFor="mungkin">Mungkin</Label>
                                    </div>

                                </RadioGroup>
                            </div>

                            {/* Checkbox Masalah Penyebab */}
                            <div>
                                <Label htmlFor="masalah_penyebab">Masalah penyebab</Label>
                                {["Licin", "Tidak Mengikuti Prosedur", "Kegagalan Perlengkapan", "Kurang latihan", "Tidak ada alat pelindung diri", "Kesalahan perorangan", "Lainnya"].map((item) => (
                                    <div key={item}>
                                        <input
                                            type="checkbox"
                                            className="mt-2 text-sm"
                                            value={item}  // Menggunakan value yang sesuai
                                            onChange={handleCheckboxChange}
                                            checked={formData.masalah_penyebab.includes(item)}  // Memastikan state checkbox ter-sinkronisasi
                                        />
                                        <label htmlFor={item} className="ml-2 text-sm font-semibold">
                                            {item}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {/* Tingkat Keparahan */}
                            <div>
                                <Label>Tingkat Keparahan</Label>
                                <RadioGroup
                                    className="mt-2"
                                    value={formData.tingkat_keparahan}
                                    onValueChange={(value) => setFormData({ ...formData, tingkat_keparahan: value })}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="0" id="ringan" />
                                        <Label htmlFor="ringan">Ringan (Tanpa perawatan klinik)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="1" id="sedang" />
                                        <Label htmlFor="sedang">Sedang (Perlu perawatan klinik)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="2" id="berat" />
                                        <Label htmlFor="berat">Berat (Perlu dirujuk ke RS)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="3" id="fatal" />
                                        <Label htmlFor="fatal">Fatal (Meninggal dunia)</Label>
                                    </div>
                                </RadioGroup>
                            </div>



                            <div>
                                <Label htmlFor="bukti_foto">Upload Bukti Foto</Label>
                                <Input
                                    id="bukti_foto"
                                    name="bukti_foto"
                                    className="mt-2"
                                    type="file"
                                    onChange={handleFileChange}

                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </TabsContent>

                {/* Tab Tracking */}
                <TabsContent value="tracking">
                    <div>
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
                                        <td className="px-4 py-2 border border-gray-300">
                                            <Badge>{report.status}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>
            </Tabs >
        </UserLayout >
    );
}
