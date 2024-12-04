import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { IconFireExtinguisher, IconAlertTriangle, IconFirstAidKit } from "@tabler/icons-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Image from "next/image"
import { useUser } from '@/context/userContext';


export default function AdminLayout({ children, head, className = '' }) {
    const router = useRouter();
    const { user, setUser } = useUser();
    const [isAuthorized, setIsAuthorized] = useState(false);

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Convert to seconds
            console.log(currentTime);
            return decoded.exp < currentTime; // True if token is expired
        } catch (error) {
            return true; // Treat invalid token as expired
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (isTokenExpired(token)) {
            localStorage.removeItem('token');
            router.push('/login');
        }

        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const { role } = jwtDecode(token);
            if (role !== 1) {
                router.push('/dashboard');
                return;
            }
            setIsAuthorized(true);
        } catch (error) {
            router.push('/login');
        }
    }, [router]);

    if (!isAuthorized) {
        return null;
    }

    const handleLogout = async () => {
        setUser(null);
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className={`md:flex w-full ${className}`}>
            <Head>
                <title>{head}</title>
            </Head>

            <div className='w-full min-h-screen p-12 bg-gray-100'>
                <div className='flex items-center justify-between w-full px-6 py-2 mb-8 bg-white rounded-lg'>

                    <div className='flex items-center justify-between w-full gap-10 p-2'>
                        <Link href={"/dashboard"} className="flex items-center gap-4 ">

                            <Image alt={"logo"} src={"/logo_undip.png"} width={40} height={40} />
                            <p className="text-2xl font-bold">K3 FT</p>
                        </Link>
                        {/* Dropdown Menu for Pelaporan Pengadaan */}
                        <DropdownMenu >
                            <DropdownMenuTrigger className="duration-300 ease-in-out hover:bg-primary/20" asChild>
                                <div
                                    className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname.includes('/admin/pengadaan') ? 'bg-primary text-white' : 'text-black'
                                        }`}
                                >
                                    <IconFireExtinguisher strokeWidth={1.4} />
                                    Verifikasi Pengadaan
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-44">
                                <DropdownMenuItem
                                    onClick={() => router.push('/admin/pengadaan/apar')}
                                    className={router.pathname === '/admin/pengadaan/apar' ? 'bg-primary text-white' : ''}
                                >
                                    Verifikasi APAR
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => router.push('/admin/pengadaan/p3k')}
                                    className={router.pathname === '/admin/pengadaan/p3k' ? 'bg-primary text-white' : ''}
                                >
                                    Verifikasi P3K
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Menu Pelaporan Insiden */}
                        <Link
                            href="/admin/insiden"
                            className={`duration-300 ease-in-out hover:bg-primary/20 flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/admin/insiden' ? 'bg-primary text-white' : 'text-black'
                                }`}
                        >
                            <IconFirstAidKit strokeWidth={1.4} />
                            Verifikasi Insiden
                        </Link>

                        {/* Menu Pelaporan Potensi Bahaya */}
                        <Link
                            href="/admin/potensi-bahaya"
                            className={`flex duration-300 ease-in-out hover:bg-primary/20 gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/admin/potensi-bahaya' ? 'bg-primary text-white' : 'text-black'
                                }`}
                        >
                            <IconAlertTriangle strokeWidth={1.4} />
                            Verifikasi Potensi Bahaya
                        </Link>
                        <Button onClick={handleLogout}>Logout</Button>
                    </div>

                    {/* Logout Button */}
                </div>

                {children}
            </div>
        </div >
    );
}
