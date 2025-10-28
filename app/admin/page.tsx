"use client";

import Image from "next/image";
import topleft from "@/app/assets/circles_top.svg";
import botright from "@/app/assets/circles_bottom.svg";
import logo from "@/app/assets/logo.svg";
import Link from "next/link";
import arrow from "@/app/assets/arrow.svg";
import UsersList from "@/app/components/userList";
import RealTimeRequestsTable from "@/app/components/tableWeb";
import React, { useState } from "react";

function AddExecutorModal({ open, onClose, onAdded}: { open: boolean; onClose: () => void;onAdded: () => void; }) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        first_name: "",

        last_name: "",
        max_daily_requests: "",
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("https://ais.twc1.net/api/users/", {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    params: {

                    },
                    max_daily_requests: Number(formData.max_daily_requests || 0),
                }),

            });

            if (!res.ok) throw new Error("Ошибка при добавлении исполнителя");

            onAdded();
        } catch (err) {

            console.error(err);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-[400px] relative">
                <h2 className="text-2xl font-semibold mb-4 text-center text-[#FF5A00]">Добавить исполнителя</h2>

                <form onSubmit={handleSubmit} className="flex flex-col text-gray-600 gap-3">
                    <input name="username" placeholder="Username" value={formData.username} onChange={handleChange}
                           className="border p-2 rounded-lg" required/>
                    <input name="password" placeholder="Password" type="password" value={formData.password}
                           onChange={handleChange}
                           className="border p-2 rounded-lg" required/>
                    <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange}
                           className="border p-2 rounded-lg" required/>
                    <input name="first_name" placeholder="Имя" value={formData.first_name} onChange={handleChange}
                           className="border p-2 rounded-lg"/>
                    <input name="last_name" placeholder="Фамилия" value={formData.last_name} onChange={handleChange}
                           className="border p-2 rounded-lg"/>
                    <input
                        name="max_daily_requests"
                        placeholder="Макс. заявок в день"
                        type="number"
                        value={formData.max_daily_requests}
                        onChange={handleChange}
                        className="border p-2 rounded-lg"
                    />


                    <div className="flex justify-between mt-4">
                        <button type="button" onClick={onClose}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">
                            Отмена
                        </button>
                        <button type="submit"
                                className="px-4 py-2 bg-[#FF5A00] text-white rounded-lg hover:bg-orange-600 transition">
                            Добавить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function adminPage() {
    const [modalOpen, setModalOpen] = useState(false);

    const [refreshCount, setRefreshCount] = useState(0);

    const handleExecutorAdded = () => {
        setRefreshCount((c) => c + 1);
        setModalOpen(false);
    };

    return (
        <>
            <div className="relative min-h-screen bg-[#EDEEF0] overflow-hidden select-none">
                <div className="absolute inset-0 z-0">
                    <Image src={topleft} alt="Top Left" width={500} height={500}
                           className="absolute top-0 left-0 object-contain pointer-events-none select-none " />
                    <Image src={botright} alt="Bottom Right" width={500} height={500}
                           className="absolute bottom-0 right-0 object-contain pointer-events-none select-none" />
                </div>

                <div className="w-full h-36 flex flex-col bg-[#EDEEF0] items-center relative z-10">
                    <div className="bg-[#FF5A00] h-18 w-full text-xl text-white flex justify-center items-center">
                        <p>InsurTech-платформа для логистики</p>
                    </div>
                    <div className="w-full flex justify-between px-10">
                        <Link href="/">
                            <Image src={logo} alt="InsurTech logo" width={160} height={60} priority className="p-6" />
                        </Link>

                        <div className="flex items-center gap-3">
                            <Link className="flex text-black items-center gap-2 px-6 py-3" href="/">
                                Dashboard <Image src={arrow} alt="arrow" />
                            </Link>
                            <Link className="flex text-black items-center gap-2 px-6 py-4" href="/addField">
                                Add field <Image src={arrow} alt="arrow" />
                            </Link>


                            <button
                                onClick={() => setModalOpen(true)}
                                className="bg-[#FF5A00] text-white px-5 py-3 rounded-xl hover:bg-orange-600 transition"
                            >
                                + Добавить исполнителя
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center relative z-10">
                    <div className="w-5/6 h-[800px] flex flex-col justify-between gap-10">
                        <div className="h-[400px] w-full flex flex-center">
                            <UsersList refreshTrigger={refreshCount} />
                        </div>
                        <RealTimeRequestsTable />
                    </div>
                </div>


                <AddExecutorModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onAdded={handleExecutorAdded}
                />
            </div>
        </>
    );
}
