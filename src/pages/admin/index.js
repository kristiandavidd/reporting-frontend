import AdminLayout from "@/layout/adminLayout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { IconAlertTriangle, IconFireExtinguisher, IconFirstAidKit, IconReportMedical, IconTriangle } from "@tabler/icons-react"
import Link from "next/link"

export default function Dashboard() {
    const router = useRouter();
    const handleLogout = async () => {
        setUser(null);
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <AdminLayout head={"Admin"}>
            <div className="flex w-3/4 gap-4 mx-auto">
                <Link href={"admin/pengadaan/apar"} className="flex flex-col items-center justify-center w-full p-10 text-xl font-semibold text-center duration-300 ease-in-out bg-white rounded-lg hover:bg-primary/50">
                    <IconFireExtinguisher size={80} strokeWidth={0.8} />
                    Verifikasi Pengadaan APAR
                </Link>
                <Link href={"admin/pengadaan/p3k"} className="flex flex-col items-center justify-center w-full gap-2 p-10 text-xl font-semibold text-center duration-300 ease-in-out bg-white rounded-lg hover:bg-primary/50">
                    <IconReportMedical size={80} strokeWidth={0.8} />
                    Verifikasi Pengadaan P3K
                </Link>
            </div>
            <div className="flex w-2/3 gap-4 mx-auto mt-6">

                <Link href={"admin/insiden"} className="flex flex-col items-center justify-center w-full gap-2 p-10 text-xl font-semibold text-center duration-300 ease-in-out bg-white rounded-lg hover:bg-primary/50">
                    <IconFirstAidKit size={80} strokeWidth={0.8} />
                    Verifikasi Insiden
                </Link>
                <Link href={"admin/potensi-bahaya"} className="flex flex-col items-center justify-center w-full gap-2 p-10 text-xl font-semibold text-center duration-300 ease-in-out bg-white rounded-lg hover:bg-primary/50">
                    <IconAlertTriangle size={80} strokeWidth={0.8} />
                    Verifikasi Potensi Bahaya
                </Link>
            </div>

        </AdminLayout>
    )
}