'use client';
import Image from "next/image";
import RequestsDashboard from "@/app/components/dashboard1";
import logo from "./assets/logo.svg";
import topleft from "./assets/circles_top.svg";
import botright from "./assets/circles_bottom.svg";
import arrow from "./assets/arrow.svg"
import Link from "next/link";
import React from "react";


export default function Main() {
    return (
        <div className="relative min-h-screen  bg-[#EDEEF0]  overflow-hidden select-none">
            <div className="absolute inset-0 z-1">
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


            <div className="w-full h-36 flex flex-col items-center relative z-10">
                <div className="bg-[#FF5A00] h-18 w-full text-xl text-white flex justify-center items-center">
                    <p>InsurTech-платформа для логистики</p>
                </div>
                <div className="w-full flex justify-between px-10">
                    <Link href="/" >
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
                                  href="/admin">
                                Admin panel
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
                <div className="w-5/6 lg:w-4/6">
                    <RequestsDashboard/>
                </div>
            </div>
        </div>
    );
}
