import UserLayout from "@/layout/userLayout"
import { IconAlertTriangle, IconFireExtinguisher, IconFirstAidKit, IconReportMedical, IconTriangle } from "@tabler/icons-react"
import Link from "next/link"


export default function Dashboard() {

    return (
        <UserLayout head={"Dashboard"}>
            <div className="flex w-3/4 gap-4 mx-auto">
                <Link href={"pengadaan/apar"} className="flex flex-col items-center justify-center w-full p-10 text-xl font-semibold text-center duration-300 ease-in-out bg-white rounded-lg hover:bg-primary/50">
                    <IconFireExtinguisher size={80} strokeWidth={0.8} />
                    Pelaporan Pengadaan APAR
                </Link>
                <Link href={"pengadaan/p3k"} className="flex flex-col items-center justify-center w-full gap-2 p-10 text-xl font-semibold text-center duration-300 ease-in-out bg-white rounded-lg hover:bg-primary/50">
                    <IconReportMedical size={80} strokeWidth={0.8} />
                    Pelaporan Pengadaan P3K
                </Link>
            </div>
            <div className="flex w-2/3 gap-4 mx-auto mt-6">

                <Link href={"insiden"} className="flex flex-col items-center justify-center w-full gap-2 p-10 text-xl font-semibold text-center duration-300 ease-in-out bg-white rounded-lg hover:bg-primary/50">
                    <IconFirstAidKit size={80} strokeWidth={0.8} />
                    Pelaporan Insiden
                </Link>
                <Link href={"potensi-bahaya"} className="flex flex-col items-center justify-center w-full gap-2 p-10 text-xl font-semibold text-center duration-300 ease-in-out bg-white rounded-lg hover:bg-primary/50">
                    <IconAlertTriangle size={80} strokeWidth={0.8} />
                    Pelaporan Potensi Bahaya
                </Link>
            </div>

        </UserLayout>
    )
}