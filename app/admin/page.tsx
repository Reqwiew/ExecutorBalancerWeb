"use client";

import Image from "next/image";
import topleft from "@/app/assets/circles_top.svg";
import botright from "@/app/assets/circles_bottom.svg";
import logo from "@/app/assets/logo.svg";
import Link from "next/link";
import arrow from "@/app/assets/arrow.svg";
import RequestsDashboard from "@/app/components/dashboard1";
import WebSocketLog from "@/app/components/logs";
import UsersList from "@/app/components/userList";
import React from "react";
import RealTimeRequestsTable from "@/app/components/tableWeb";

export default function adminPage() {
    return (
        <>
            <div className="relative min-h-screen  bg-[#EDEEF0] overflow-hidden select-none">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={topleft}
                        alt="Top Left"
                        width={500}
                        height={500}
                        className="absolute top-0 left-0 object-contain pointer-events-none select-none "
                    />
                    <Image
                        src={botright}
                        alt="Bottom Right"
                        width={500}
                        height={500}
                        className="absolute bottom-0 right-0 object-contain pointer-events-none select-none"
                    />
                </div>


                <div className="w-full h-36 flex flex-col bg-[#EDEEF0]    items-center relative z-10">
                    <div className="bg-[#FF5A00] h-18 w-full text-xl text-white flex justify-center items-center">
                        <p>InsurTech-платформа для логистики</p>
                    </div>
                    <div className="w-full flex justify-between px-10">
                        <Link href="/">
                            <Image
                                src={logo}
                                alt="InsurTech logo"
                                width={160}
                                height={60}
                                priority
                                className="p-6"
                            />
                        </Link>
                        <div className="flex justify-start items-center">
                            <div className="flex justify-center ">

                                <Link className="bg-transparent flex justify-center items-center gap-5 px-6 py-3"
                                      href="/">
                                    Dashboard
                                    <Image src={arrow} alt="arrow"/></Link>
                            </div>
                            <div className="flex justify-center ">

                                <Link className="bg-transparent flex justify-center items-center gap-5 px-6 py-4"
                                      href="/addField">
                                    Add field
                                    <Image src={arrow} alt="arrow"/></Link>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="w-full flex  justify-center relative z-10">
                    <div className=" w-5/6 flex flex-col flex justify-between gap 10 lg:w-3/6 flex-col ">

                        <UsersList/>
                    <RealTimeRequestsTable />


                    </div>
                </div>

            </div>
        </>
    )
}