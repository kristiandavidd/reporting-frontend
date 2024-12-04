import React, { useState } from 'react';
import UserLayout from '@/layout/userLayout';
import { ProgressTracker2 } from '@/components/progressTracker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import axios from 'axios';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/router';

export default function Apar() {
    const router = useRouter();
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        dept: '',
        ruang: '',
        lantai: '',
        jenis: '',
        ukuran: '',
        tgl_beli: '',
        tgl_isi: '',
        tgl_exp: '',
        img_url: null,
    });

    const [activeTab, setActiveTab] = useState('pelaporan'); // State untuk tab aktif

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, img_url: file })); // Store the file in the state
    };

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;

                const response = await axios.get(`${apiUrl}/tracking/apar`);

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
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, date) => {
        setFormData((prev) => ({ ...prev, [name]: format(date, 'yyyy-MM-dd') }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Create a new FormData instance
        const formDataToSend = new FormData();

        // Append form fields to FormData
        for (let key in formData) {
            if (formData.hasOwnProperty(key)) {
                formDataToSend.append(key, formData[key]);
            }
        }

        // Append the img_url file if it exists
        // if (formData.img_url) {
        //     formDataToSend.append('img_url', formData.img_url);
        // }

        console.log('Data to send:', formDataToSend); // Log FormData contents for debugging

        // Log FormData contents for debugging
        for (let [key, value] of formDataToSend.entries()) {
            console.log(key, value); // This will show each field and its value
        }

        try {
            const response = await fetch(`${apiUrl}/report/apar`, {
                method: 'POST',
                body: formDataToSend, // Send the FormData directly
            });

            // Check if the response is OK
            if (!response.ok) {
                alert('Failed to submit data, please try again.');
                return;
            }

            // If the response is not JSON, handle it accordingly
            if (response.headers.get('content-type').includes('application/json')) {
                const result = await response.json(); // Parse JSON if the response is JSON
                alert('Data successfully submitted!');
                console.log(result);
            } else {
                const textResult = await response.text(); // Handle non-JSON response (like text or file)
                alert('Data successfully submitted!');
                console.log(textResult); // Log the plain text result
            }

            // Reset the form after submission
            setFormData({
                dept: '',
                ruang: '',
                lantai: '',
                jenis: '',
                ukuran: '',
                tgl_beli: '',
                tgl_isi: '',
                tgl_exp: '',
                img_url: null,
                status: '',
            });
            setActiveTab('tracking');
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Failed to submit data, please try again.');
        }
    };




    if (isLoading) return <p>Loading...</p>;
    if (!Array.isArray(reports) || reports.length === 0) return <p>No reports available.</p>;

    return (
        <UserLayout head="Pelaporan Pengadaan APAR">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="pelaporan">Pelaporan</TabsTrigger>
                    <TabsTrigger value="tracking">Tracking</TabsTrigger>
                </TabsList>

                {/* Tab Pelaporan */}
                <TabsContent value="pelaporan">
                    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
                        <h1 className="mb-6 text-xl font-bold">Form Pelaporan Pengadaan APAR</h1>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Department */}
                            <div>
                                <Label htmlFor="dept">Departemen</Label>
                                <Input
                                    type="text"
                                    id="dept"
                                    name="dept"
                                    value={formData.dept}
                                    onChange={handleInputChange}
                                    className="mt-2"
                                    placeholder="Masukkan departemen"
                                    required
                                />
                            </div>

                            {/* Ruang */}
                            <div>
                                <Label htmlFor="ruang">Ruang</Label>
                                <Input
                                    type="text"
                                    id="ruang"
                                    name="ruang"
                                    value={formData.ruang}
                                    className="mt-2"
                                    onChange={handleInputChange}
                                    placeholder="Masukkan ruang"
                                    required
                                />
                            </div>

                            {/* Lantai */}
                            <div>
                                <Label htmlFor="lantai">Lantai</Label>
                                <Input
                                    type="number"
                                    id="lantai"
                                    name="lantai"
                                    value={formData.lantai}
                                    className="mt-2"
                                    onChange={handleInputChange}
                                    placeholder="Masukkan lantai"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="jenis">Jenis APAR</Label>
                                <Select
                                    value={formData.jenis}
                                    name='jenis'
                                    id='jenis'
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, jenis: value }))}
                                >
                                    <SelectTrigger className="w-full mt-2">
                                        <SelectValue placeholder="Masukkan jenis APAR" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Powder">Powder</SelectItem>
                                        <SelectItem value="HFC">HFC</SelectItem>
                                        <SelectItem value="Foam">Foam</SelectItem>
                                        <SelectItem value="CO2">CO2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Ukuran */}
                            <div>
                                <Label htmlFor="ukuran">Ukuran (kg)</Label>
                                <Input
                                    type="number"
                                    id="ukuran"
                                    name="ukuran"
                                    value={formData.ukuran}
                                    className="mt-2"
                                    onChange={handleInputChange}
                                    placeholder="Masukkan ukuran (kg)"
                                    required
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <Label htmlFor="img_url">Image Upload</Label>
                                <Input
                                    type="file"
                                    id="img_url"
                                    name="img_url"
                                    onChange={handleFileChange}
                                    className="mt-2"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-around mt-4 text-center">
                            <div>
                                <Label htmlFor="tgl_beli">Tanggal Beli</Label>
                                <Input
                                    id="tgl_beli"
                                    name="tgl_beli"
                                    className="mt-2"
                                    type="date"
                                    value={formData.tgl_beli}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="tgl_isi">Tanggal Isi</Label>
                                <Input
                                    id="tgl_isi"
                                    name="tgl_isi"
                                    className="mt-2"
                                    type="date"
                                    value={formData.tgl_isi}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="tgl_exp">Tanggal Kadaluarsa</Label>
                                <Input
                                    id="tgl_exp"
                                    name="tgl_exp"
                                    className="mt-2"
                                    type="date"
                                    value={formData.tgl_exp}
                                    onChange={handleInputChange}
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
                    <div className='p-6 bg-white rounded-lg'>
                        <h2 className="mb-4 text-xl font-bold">Laporan Terkini</h2>
                        <table className="w-full text-center border border-collapse border-gray-200 table-auto">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 border border-gray-300">No</th>
                                    <th className="px-4 py-2 border border-gray-300">Waktu Pelaporan</th>
                                    <th className="px-4 py-2 border border-gray-300">Departemen</th>
                                    <th className="px-4 py-2 border border-gray-300">Ruang</th>
                                    <th className="px-4 py-2 border border-gray-300">Lantai</th>
                                    <th className="px-4 py-2 border border-gray-300">Jenis</th>
                                    <th className="px-4 py-2 border border-gray-300">Status</th>
                                    <th className="px-4 py-2 border border-gray-300">Aksi</th>
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
                                        <td className="px-4 py-2 border border-gray-300">
                                            <ProgressTracker2 currentStatus={report.status} />
                                        </td>
                                        <td className="px-4 py-2 border border-gray-300">
                                            <Button onClick={() => router.push(`/report/apar-edit?id=${report.id}`)}>Edit</Button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>
            </Tabs>
        </UserLayout>
    );
}
