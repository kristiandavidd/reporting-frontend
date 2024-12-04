import AdminLayout from "@/layout/adminLayout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { IconAlertTriangle, IconFireExtinguisher, IconFirstAidKit, IconReportMedical, IconTriangle } from "@tabler/icons-react"
import Link from "next/link"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { useUser } from "@/context/userContext"

export default function Dashboard() {
    const { user, setUser } = useUser();
    const router = useRouter();
    const handleLogout = async () => {
        setUser(null);
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <AdminLayout head={"Admin"}>
            <div className="flex w-3/4 gap-4 mx-auto mb-4 ">
                <div className="flex flex-col items-center justify-center w-1/3 gap-2 p-6 bg-white rounded-lg">
                    <Avatar>
                        <AvatarImage src="/placeholder.png" alt="@shadcn" />
                        <AvatarFallback>AVA</AvatarFallback>
                    </Avatar>
                    <p className="text-lg font-semibold">{user ? user.name : ""}</p>
                    <p className="text-sm text-gray-600">{user ? user.id_number : ""}</p>
                </div>
                <div className="flex flex-col justify-center w-2/3 gap-2 p-6 bg-white rounded-lg">
                    <div>
                        <p className="text-lg font-semibold">Hai {user ? user.name : ""},</p>
                        <p className="text-lg font-semibold"> Selamat Datang di Sistem Informasi Pelaporan K3 FT Undip</p>
                    </div>
                    <p className="text-sm">Segera hubungi kami jika anda melihat kejadian-kejadian yang termasuk ke dalam insiden atau berpotensi bahaya di sekitar anda.</p>
                </div>
            </div>
            <div className="flex w-3/4 gap-4 mx-auto">
                <Link href={"admin/pengadaan/apar"} className="flex flex-col items-center justify-center w-full p-10 text-xl font-semibold text-center duration-300 ease-in-out bg-white rounded-lg hover:bg-primary/50">
                    <IconFireExtinguisher size={80} strokeWidth={0.8} />
                    Verifikasi Pengadaan APAR
                </Link>
                <Link href={"admin/pengadaan/p3k"} className="flex flex-col items-center justify-center w-full gap-2 p-10 text-xl font-semibold text-center duration-300 ease-in-out bg-white rounded-lg hover:bg-primary/50">
                    <IconReportMedical size={80} strokeWidth={0.8} />
                    Verifikasi Pengadaan P3K
                </Link>
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