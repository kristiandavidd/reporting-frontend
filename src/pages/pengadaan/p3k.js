import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import UserLayout from "@/layout/userLayout";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from "next/router";

const itemList = [
    "Perban 5cm",
    "Perban 10cm",
    "Sarung Tangan Lateks",
    "Gunting",
    "Povidone Iodine",
    "Alkohol",
    "Salep Luka Bakar",
    "Plester Roll",
    "Plester Luka",
    "Antiseptik",
    "Kain Perban",
    "Obat Merah",
    "Paracetamol",
    "Masker Medis",
    "Obat Mata",
    "Obat Maag",
];

export default function ReportP3KForm() {
    const router = useRouter()
    const [metadata, setMetadata] = useState({
        penanggungjawab: "",
        lantai: "",
        departemen: "",
    });

    const [activeTab, setActiveTab] = useState('pelaporan'); // State untuk tab aktif
    const [formData, setFormData] = useState(
        itemList.map((item) => ({
            item_name: item,
            stock: 0,
            condition: "baik",
        }))
    );

    const handleChange = (index, key, value) => {
        const updatedData = [...formData];
        updatedData[index][key] = value;
        setFormData(updatedData);
    };

    const [reportData, setReportData] = useState([]); // State untuk menyimpan data report

    const fetchReportData = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${apiUrl}/tracking/p3k`);
            if (!response.ok) throw new Error("Failed to fetch data");
            const data = await response.json();
            setReportData(data);
        } catch (error) {
            console.error("Error fetching report data:", error);
            alert("Failed to fetch report data.");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const payload = {
            penanggungjawab: metadata.penanggungjawab,
            lantai: metadata.lantai,
            departemen: metadata.departemen,
            items: formData.map((item) => ({
                name: item.item_name, // Kirimkan item_name sebagai name
                stock: item.stock,
                condition: item.condition,
            })),
        };

        try {
            const response = await fetch(`${apiUrl}/report/p3k`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to submit data");

            alert("Data successfully submitted!");
            setMetadata({ penanggungjawab: "", lantai: "", departemen: "" }); // Reset form metadata
            setFormData(
                itemList.map((item) => ({
                    item_name: item,
                    stock: 0,
                    condition: "baik",
                }))
            ); // Reset form data
            setActiveTab("tracking"); // Pindah ke tab tracking
            fetchReportData(); // Refresh data untuk tab tracking
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to submit data, please try again.");
        }
    };


    useEffect(() => {
        if (activeTab === "tracking") {
            fetchReportData();
        }
    }, [activeTab]);

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
                        <h1 className="mb-6 text-xl font-bold">Form Pelaporan P3K</h1>
                        <div className="mb-6">
                            <Label htmlFor="penanggungjawab">Penanggung Jawab</Label>
                            <Input
                                id="penanggungjawab"
                                type="text"
                                className="mt-2"
                                value={metadata.penanggungjawab}
                                onChange={(e) => setMetadata({ ...metadata, penanggungjawab: e.target.value })}
                                placeholder="Nama Penanggung Jawab"
                            />
                        </div>
                        <div className="mb-6">
                            <Label htmlFor="lantai">Lantai</Label>
                            <Input
                                id="lantai"
                                type="number"
                                className="mt-2"
                                value={metadata.lantai}
                                onChange={(e) => setMetadata({ ...metadata, lantai: parseInt(e.target.value, 10) || 0 })}
                                placeholder="Lantai"
                            />
                        </div>
                        <div className="mb-6">
                            <Label htmlFor="departemen">Departemen</Label>
                            <Input
                                id="departemen"
                                type="text"
                                className="mt-2"
                                value={metadata.departemen}
                                onChange={(e) => setMetadata({ ...metadata, departemen: e.target.value })}
                                placeholder="Nama Departemen"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-300 table-auto">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="p-2 border">Nama Barang</th>
                                        <th className="p-2 border">Stok</th>
                                        <th className="p-2 border">Keadaan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.map((item, index) => (
                                        <tr key={index}>
                                            <td className="p-2 border">{item.item_name}</td>
                                            <td className="p-2 border">
                                                <Input
                                                    type="number"
                                                    value={item.stock}
                                                    onChange={(e) =>
                                                        handleChange(index, "stock", parseInt(e.target.value, 10) || 0)
                                                    }
                                                    placeholder="Stok"
                                                />
                                            </td>
                                            <td className="p-2 border">
                                                <Select
                                                    value={item.condition}
                                                    onValueChange={(value) => handleChange(index, "condition", value)} // Gunakan onValueChange
                                                >
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Kondisi" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="baik">Baik</SelectItem>
                                                        <SelectItem value="kadaluarsa">Kadaluarsa</SelectItem>
                                                        <SelectItem value="rusak">Rusak</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center w-full mt-6 ">
                            <Button type="submit" className="px-20">Submit</Button>
                        </div>
                    </form>
                </TabsContent>


                {/* Tab Tracking */}
                <TabsContent value="tracking">
                    <h1 className="mb-6 text-xl font-bold">Tracking Report P3K</h1>
                    <div className="overflow-x-auto">
                        <table className="w-full text-center border border-gray-300 table-auto">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-2 border">ID</th>
                                    <th className="p-2 border">Penanggung Jawab</th>
                                    <th className="p-2 border">Lantai</th>
                                    <th className="p-2 border">Departemen</th>
                                    <th className="p-2 border">Status</th>
                                    <th className="p-2 border">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((report, index) => (
                                    <tr key={index}>
                                        <td className="p-2 border">{report.id}</td>
                                        <td className="p-2 border">{report.penanggungjawab}</td>
                                        <td className="p-2 border">{report.lantai}</td>
                                        <td className="p-2 border">{report.departemen}</td>
                                        <td className="p-2 border"><Badge>{report.status}</Badge></td>
                                        <td className="p-2 border">
                                            <td className="flex justify-center px-4 py-2">
                                                <Button onClick={() => router.push(`/report/p3k-edit?id=${report.id}`)}>Edit</Button>
                                            </td>
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
