import React, { useState, useEffect } from 'react'
import UserLayout from '@/layout/userLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from 'axios';
import { useUser } from '@/context/userContext';
import { Badge } from '@/components/ui/badge';

export default function InsidenBahaya() {
    const [activeTab, setActiveTab] = useState('pelaporan');
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUser();

    const [formData, setFormData] = useState({
        nama_pelapor: user && user ? user.name : "",
        id_number: user && user ? user.id_number : "",
        no_telp: "",
        waktu_kejadian: "",
        kategori: "",
        institusi: "",
        tujuan: "",
        lokasi_insiden: "",
        potensi_bahaya: "",
        resiko_bahaya: "",
        perbaikan: "",
        bukti_foto: null,
    });

    useEffect(() => {
        if (user) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                nama_pelapor: user.name,
                id_number: user.id_number,
            }));
        }
    }, [user]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                console.log(`Fetching from: ${apiUrl}/tracking/potential-danger`);
                const response = await axios.get(`${apiUrl}/tracking/potential-danger`);
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
        if (activeTab === 'tracking') {
            setIsLoading(true); // Reset loading indikator
            fetchReports();
        }
    }, [activeTab]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

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
            const response = await fetch(`${apiUrl}/report/potential-danger`, {
                method: "POST",
                body: formDataToSubmit,
            });

            if (!response.ok) throw new Error("Error submitting data");



            setActiveTab('tracking');
            setFormData({
                nama_pelapor: "",
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
                        <h1 className="mb-6 text-xl font-bold">Form Laporan Potensi Bahaya</h1>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label htmlFor="nama_pelapor">Nama Pelapor</Label>
                                <Input
                                    id="nama_pelapor"
                                    name="nama_pelapor"
                                    type="text"
                                    value={user ? user.name : ""}
                                    disabled
                                    className="mt-2"
                                    onChange={handleInputChange}
                                    placeholder="Masukkan nama pelapor"
                                />
                            </div>
                            <div>
                                <Label className="mt-0" htmlFor="id_number">Nomor Identitas</Label>
                                <Input
                                    id="id_number"
                                    name="id_number"
                                    type="text"
                                    value={user ? user.id_number : ""}
                                    disabled
                                    className="mt-2"
                                    onChange={handleInputChange}
                                    placeholder="Masukkan Nomor Identitas"
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
                                <Label htmlFor="waktu_kejadian">Waktu Kejadian</Label>
                                <Input
                                    id="waktu_kejadian"
                                    name="waktu_kejadian"
                                    className="mt-2"
                                    type="datetime-local"
                                    value={formData.waktu_kejadian}
                                    onChange={handleInputChange}
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
                                <Label htmlFor="institusi">Institusi yang dikunjungi</Label>
                                <Input
                                    id="institusi"
                                    name="institusi"
                                    type="text"
                                    className="mt-2"
                                    value={formData.institusi}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan institusi yang dikunjungi"
                                />
                            </div>
                            <div>
                                <Label htmlFor="tujuan">Tujuan</Label>
                                <Textarea
                                    id="tujuan"
                                    name="tujuan"
                                    className="mt-2"
                                    value={formData.tujuan}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan tujuan"
                                />
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
                            <div>
                                <Label htmlFor="potensi_bahaya">Potensi bahaya</Label>
                                <RadioGroup
                                    id="potensi_bahaya"
                                    defaultValue=""
                                    name="potensi_bahaya"
                                    className="mt-2"
                                    value={formData.potensi_bahaya}
                                    onValueChange={(value) => setFormData({ ...formData, potensi_bahaya: value })}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="fisik" id="fisik" />
                                        <Label htmlFor="fisik">Fisik</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="kimiawi" id="kimiawi" />
                                        <Label htmlFor="kimiawi">Kimiawi</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="biologis" id="biologis" />
                                        <Label htmlFor="biologis">Biologis</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="ergonomis" id="ergonomis" />
                                        <Label htmlFor="ergonomis">Ergonomis</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="psikologis" id="psikologis" />
                                        <Label htmlFor="psikologis">Psikologis</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="lainnya" id="lainnya2" />
                                        <Label htmlFor="lainnya2">Lainnya</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div>
                                <Label htmlFor="resiko_bahaya">Resiko Bahaya</Label>
                                <Textarea
                                    className="mt-2"
                                    id="resiko_bahaya"
                                    name="resiko_bahaya"
                                    value={formData.resiko_bahaya}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan resiko bahaya"
                                />
                            </div>
                            <div>
                                <Label htmlFor="perbaikan">Usulan perbaikan</Label>
                                <Textarea
                                    id="perbaikan"
                                    name="perbaikan"
                                    className="mt-2"
                                    value={formData.perbaikan}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan usulan perbaikan"
                                />
                            </div>
                            <div>
                                <Label htmlFor="bukti_foto">Upload Bukti Foto</Label>
                                <Input
                                    id="bukti_foto"
                                    name="bukti_foto"
                                    type="file"
                                    className="mt-2"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center w-full mt-6 ">
                            <Button type="submit" className="px-20">Submit</Button>
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
                                            {report.resiko_bahaya}
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
    )
}