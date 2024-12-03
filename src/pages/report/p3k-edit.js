import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from "@/components/ui/select";
import UserLayout from "@/layout/userLayout";

const P3kEdit = () => {
    const router = useRouter();
    const { id } = router.query; // Ambil ID dari URL
    const [report, setReport] = useState(null); // State untuk data report
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch data report berdasarkan ID
    useEffect(() => {
        if (id) {
            const fetchReport = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/p3k/${id}`);
                    if (!response.ok) throw new Error("Failed to fetch report data");
                    const data = await response.json();
                    setReport(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchReport();
        }
    }, [id]);

    // Handle form submit untuk update data
    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await fetch(`${apiUrl}/report/p3k/${id}`, {
                method: "PUT", // Gunakan metode yang sesuai
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(report),
            });

            if (!response.ok) throw new Error("Failed to update report");
            alert("Report successfully updated!");
            router.push("/pengadaan/p3k"); // Kembali ke halaman Tracking
        } catch (error) {
            console.error("Error updating report:", error);
            alert("Failed to update report, please try again.");
        }
    };

    // Handle perubahan nilai input
    const handleChange = (index, field, value) => {
        const updatedItems = [...report.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setReport({ ...report, items: updatedItems });
    };

    // Fallback values for missing properties
    const getItemValue = (item, field, defaultValue = "") => item && item[field] !== undefined ? item[field] : defaultValue;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <UserLayout>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h1 className="mb-6 text-xl font-bold">Edit Report P3K</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold" htmlFor="penanggungjawab">
                            Penanggung Jawab
                        </label>
                        <Input
                            id="penanggungjawab"
                            name="penanggungjawab"
                            className="mt-2"
                            value={getItemValue(report, "penanggungjawab")}
                            onChange={(e) => handleChange(-1, "penanggungjawab", e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-semibold" htmlFor="lantai">
                            Lantai
                        </label>
                        <Input
                            id="lantai"
                            name="lantai"
                            value={getItemValue(report, "lantai")}
                            onChange={(e) => handleChange(-1, "lantai", e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-semibold" htmlFor="departemen">
                            Departemen
                        </label>
                        <Input
                            id="departemen"
                            name="departemen"
                            value={getItemValue(report, "departemen")}
                            onChange={(e) => handleChange(-1, "departemen", e.target.value)}
                            required
                        />
                    </div>

                    <h2 className="mb-4 text-lg font-bold">Items</h2>
                    <table className="w-full border border-gray-300 table-auto">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2">Nama Item</th>
                                <th className="px-4 py-2">Stock</th>
                                <th className="px-4 py-2">Kondisi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.items?.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2">
                                        <Input
                                            id={`item-name-${index}`}
                                            name="name"
                                            value={getItemValue(item, "name")}
                                            onChange={(e) => handleChange(index, "name", e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <Input
                                            id={`item-stock-${index}`}
                                            name="stock"
                                            type="number"
                                            value={getItemValue(item, "stock", 0)}
                                            onChange={(e) => handleChange(index, "stock", e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <Select
                                            value={getItemValue(item, "condition", "")}
                                            onValueChange={(value) => handleChange(index, "condition", value)} // Use onValueChange here
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

                    <Button type="submit" className="mt-4">
                        Save Changes
                    </Button>
                </form>
            </div>
        </UserLayout>
    );
};

export default P3kEdit;
