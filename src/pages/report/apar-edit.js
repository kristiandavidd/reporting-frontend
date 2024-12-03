import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UserLayout from '@/layout/userLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import axios from 'axios';

export default function AparEdit() {
    const router = useRouter();
    const { id } = router.query; // ID dari URL
    const [formData, setFormData] = useState({
        dept: '',
        ruang: '',
        lantai: '',
        jenis: '',
        ukuran: '',
        tgl_beli: '',
        tgl_isi: '',
        tgl_exp: '',
        img_url: '',
        status: '',
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            if (!id) return; // Tunggu hingga ID tersedia

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await axios.get(`${apiUrl}/report/apar/edit/${id}`);
                setFormData(response.data || {}); // Mengisi form dengan data yang ada
            } catch (error) {
                console.error("Error fetching report:", error);
                alert("Failed to load report data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReport();
    }, [id]);

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

        try {
            const response = await fetch(`${apiUrl}/report/apar/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                alert('Failed to update data, please try again.');
                return;
            }

            const result = await response.json();
            alert('Data successfully updated!');
            console.log(result);

            // Redirect kembali ke halaman tracking
            router.push('/pengadaan/apar');
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Failed to update data, please try again.');
        }
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <UserLayout head="Edit Pelaporan Pengadaan APAR">
            <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
                <h1 className="mb-6 text-xl font-bold">Form Edit Pengadaan APAR</h1>

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

                    {/* Jenis */}
                    <div>
                        <Label htmlFor="jenis">Jenis</Label>
                        <Input
                            type="text"
                            id="jenis"
                            name="jenis"
                            value={formData.jenis}
                            className="mt-2"
                            onChange={handleInputChange}
                            placeholder="Masukkan jenis APAR"
                            required
                        />
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

                    <div>
                        <Label htmlFor="img_url">Image Upload</Label>
                        <Input
                            type="file"
                            id="img_url"
                            name="img_url"
                            onChange={handleInputChange}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="flex justify-between mt-4 text-center">
                    {/* Tanggal Beli */}
                    <div>
                        <Label htmlFor="tgl_beli">Tanggal Beli</Label>
                        <Calendar
                            mode="single"
                            selected={formData.tgl_beli ? new Date(formData.tgl_beli) : undefined}
                            onSelect={(date) => handleDateChange('tgl_beli', date)}
                        />
                    </div>

                    {/* Tanggal Isi */}
                    <div>
                        <Label htmlFor="tgl_isi">Tanggal Isi</Label>
                        <Calendar
                            mode="single"
                            selected={formData.tgl_isi ? new Date(formData.tgl_isi) : undefined}
                            onSelect={(date) => handleDateChange('tgl_isi', date)}
                        />
                    </div>

                    {/* Tanggal Exp */}
                    <div>
                        <Label htmlFor="tgl_exp">Tanggal Exp</Label>
                        <Calendar
                            mode="single"
                            selected={formData.tgl_exp ? new Date(formData.tgl_exp) : undefined}
                            onSelect={(date) => handleDateChange('tgl_exp', date)}
                        />
                    </div>
                </div>

                <div className="flex justify-center w-full mt-6">
                    <Button type="submit" className="px-20">Update</Button>
                </div>
            </form>
        </UserLayout>
    );
}
