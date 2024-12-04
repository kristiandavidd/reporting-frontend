import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useUser } from '@/context/userContext';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
    const [id_number, setIdNumber] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useUser();
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const { role } = decoded;

                if (role === 1) {
                    router.push('/admin');
                } else if (role === 0) {
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!id_number || !password) {
            setError('Number Identity and password are required');
            return;
        }

        try {
            const apiUrl = process.env.NODE_ENV === 'production'
                ? process.env.NEXT_PUBLIC_API_PROD_URL
                : process.env.NEXT_PUBLIC_API_URL;

            const res = await axios.post(`${apiUrl}/auth/login`, { id_number, password });

            const { token, user: { name, role, } } = res.data;
            console.log("token login", token);

            localStorage.setItem('token', token);

            setUser({ id_number, name, role, });

            if (role === 1) {
                router.push('/admin');
            } else if (role === 0) {
                router.push('/dashboard');
            } else {
                setError('Unknown user role');
            }
        } catch (error) {
            setError('Invalid credentials');
        }
    };

    return (
        <Card className='w-full m-auto my-10 sm:w-1/2 lg:w-1/3'>
            <Head>
                <title>Login</title>
            </Head>
            <CardHeader className="flex flex-col items-center justify-center text-center">
                <Image src='/logo_undip.png' width={100} height={100} alt='Pelaporan K3 FT' className='my-1' />
                <CardDescription className="w-2/3 text-md font-medium">Selamat Datang di Sistem informasi Pelaporan K3 FT Undip</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='id_number'>Nomor Identitas</Label>
                        <Input type="id_number" id="id_number" value={id_number} onChange={(e) => setIdNumber(e.target.value)} placeholder="Identity Number" />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='password'>Password</Label>
                        <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    </div>
                    <div className='flex flex-col gap-2'>
                        {error && <p className='text-sm text-red-500'>{error}</p>}
                        <Button type="submit">Login</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
