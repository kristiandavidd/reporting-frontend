import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useUser } from '@/context/userContext';
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

export default function UserLayout({ children, head, className = '' }) {
    const router = useRouter();
    const { user, setUser } = useUser();
    const [isAuthorized, setIsAuthorized] = useState(false);

    const handleLogout = async () => {
        setUser(null);
        localStorage.removeItem('token');
        router.push('/login');
    };

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Convert to seconds
            return decoded.exp < currentTime; // True if token is expired
        } catch (error) {
            return true; // Treat invalid token as expired
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token || isTokenExpired(token)) {
            localStorage.removeItem('token');
            router.push('/login');
            return;
        }

        try {
            const { role } = jwtDecode(token);
            if (role !== 0) {
                router.push('/admin');
            }
            setIsAuthorized(true);
        } catch (error) {
            console.log('Invalid token', error);
            router.push('/login');
        }
    }, [router]);

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className={`md:flex w-full ${className}`}>
            <Head>
                <title>{head}</title>
            </Head>

            <div className="w-full min-h-screen p-12 bg-transparent">
                <div className='flex items-center w-full px-6 py-2 mb-8 bg-white rounded-lg'>

                    <div className='flex items-center justify-between w-full gap-10 p-2'>
                        <Link href={"/dashboard"} className="flex items-center gap-4 ">

                            <Image alt={"logao"} src={"/logo_k3.png"} width={200} height={200} />
                        </Link>
                        {/* Dropdown Menu for Pelaporan Pengadaan */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className='duration-300 ease-in-out hover:bg-primary/20' asChild>
                                <div
                                    className={`flex gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname.includes('/pengadaan') ? 'bg-primary text-white' : 'text-black'
                                        }`}
                                >
                                    <IconFireExtinguisher strokeWidth={1.4} />
                                    Pelaporan Pengadaan
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-44">
                                <DropdownMenuItem
                                    onClick={() => router.push('/pengadaan/apar')}
                                    className={router.pathname === '/pengadaan/apar' ? 'bg-primary text-white' : ''}
                                >
                                    Pengadaan APAR
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => router.push('/pengadaan/p3k')}
                                    className={router.pathname === '/pengadaan/p3k' ? 'bg-primary text-white' : ''}
                                >
                                    Pengadaan P3K
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Menu Pelaporan Insiden */}
                        <Link
                            href="/insiden"
                            className={`flex duration-300 ease-in-out hover:bg-primary/20 gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/insiden' ? 'bg-primary text-white' : 'text-black'
                                }`}
                        >
                            <IconFirstAidKit strokeWidth={1.4} />
                            Pelaporan Insiden
                        </Link>

                        {/* Menu Pelaporan Potensi Bahaya */}
                        <Link
                            href="/potensi-bahaya"
                            className={`flex duration-300 ease-in-out hover:bg-primary/20 gap-2 px-4 py-2 rounded-md items-center cursor-pointer ${router.pathname === '/potensi-bahaya' ? 'bg-primary text-white' : 'text-black'
                                }`}
                        >
                            <IconAlertTriangle strokeWidth={1.4} />
                            Pelaporan Potensi Bahaya
                        </Link>
                        <Button onClick={handleLogout}>Logout</Button>
                    </div>

                    {/* Logout Button */}
                </div>

                {children}
            </div>
        </div>
    );
}
