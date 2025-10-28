"use client";

import Image from "next/image";
import Link from "next/link";
import React, {useState, useEffect} from "react";

import topleft from "@/app/assets/circles_top.svg";
import botright from "@/app/assets/circles_bottom.svg";
import logo from "@/app/assets/logo.svg";
import arrow from "@/app/assets/arrow.svg";
import plus from "@/app/assets/plus.svg";
import delet from "@/app/assets/delete.svg"

export default function AddFieldPage() {
    const [variableName, setVariableName] = useState("");
    const [dataType, setDataType] = useState("string");
    const [variables, setVariables] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = "https://ais.twc1.net/api/dataTypes/";

    // Загрузка существующих переменных с API
    useEffect(() => {
        const fetchVariables = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error("Ошибка при загрузке данных");
                const data = await response.json();
                setVariables(data);
            } catch (error) {
                console.error(error);
                alert("Не удалось загрузить переменные с сервера");
            } finally {
                setLoading(false);
            }
        };

        fetchVariables();
    }, []);


    const handleAddVariable = async () => {
        if (!variableName.trim()) {
            alert("Введите название переменной");
            return;
        }

        const newVariable = {
            name: variableName,
            type_of: dataType,
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newVariable),
            });

            if (!response.ok) throw new Error("Ошибка при добавлении переменной");
            const savedVariable = await response.json();
            setVariables([...variables, savedVariable]);
            setVariableName("");
            setDataType("string");
        } catch (error) {
            console.error(error);
            alert("Не удалось добавить переменную");
        }
    };


    const handleDeleteVariable = async (id) => {
        try {
            const response = await fetch(`${API_URL}${id}/`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Ошибка при удалении переменной");


            setVariables(variables.filter((v) => v.id !== id));
        } catch (error) {
            console.error(error);
            alert("Не удалось удалить переменную");
        }
    };


    return (
        <div className="relative min-h-screen bg-[#EDEEF0] overflow-hidden select-none">

            <div className="absolute inset-0 z-0">
                <Image src={topleft} alt="Top Left" width={500} height={500}
                       className="absolute top-0 left-0 object-contain pointer-events-none select-none"/>
                <Image src={botright} alt="Bottom Right" width={500} height={500}
                       className="absolute bottom-0 right-0 object-contain pointer-events-none select-none"/>
            </div>


            <div className="w-full h-36 flex flex-col items-center relative z-10">
                <div className="bg-[#FF5A00] h-18 w-full text-xl text-white flex justify-center items-center">
                    <p>InsurTech-платформа для логистики</p>
                </div>
                <div className="w-full flex justify-between px-10">
                    <Link href="/">
                        <Image src={logo} alt="InsurTech logo" width={160} height={60} priority className="p-6"/>
                    </Link>
                    <div className="flex justify-start items-center gap-4">
                        <Link
                            className="bg-transparent flex justify-center items-center gap-2 px-6 py-3 hover:underline"
                            href="/">
                            Dashboard
                            <Image src={arrow} alt="arrow"/>
                        </Link>
                        <Link
                            className="bg-transparent flex justify-center items-center gap-2 px-6 py-3 hover:underline"
                            href="/admin">
                            Admin panel
                            <Image src={arrow} alt="arrow"/>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-4/6 flex flex-col items-center relative z-10 py-10 gap-10">
                    <div className="flex flex-col items-center w-full">
                        <div className="bg-white w-5/6 rounded-2xl flex justify-between p-10 flex  gap-6">
                            <div>
                                <label className="block text-gray-700 text-lg font-medium mb-2">Название
                                    переменной</label>
                                <input
                                    type="text"
                                    value={variableName}
                                    onChange={(e) => setVariableName(e.target.value)}
                                    placeholder="Введите имя переменной"
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5A00]"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-lg font-medium mb-2">Тип данных</label>
                                <select
                                    value={dataType}
                                    onChange={(e) => setDataType(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5A00]"
                                >
                                    <option value="string">string</option>
                                    <option value="integer">integer</option>
                                    <option value="float">float</option>
                                    <option value="boolean">boolean</option>
                                    <option value="datetime">datetime</option>
                                </select>
                            </div>


                        </div>
                        <div className="flex justify-start w-5/6 p-4">
                            <button
                                onClick={handleAddVariable}
                                className="flex justify-start gap-3 bg-transparent text-black font-medium py-3 rounded-xl "
                            >
                                <Image src={plus} alt="Добавить" width={20} height={20}/>
                                <span>Добавить переменную</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white w-5/6 rounded-2xl shadow-lg p-10">
                        <h2 className="text-xl font-semibold mb-4">Существующие переменные</h2>
                        {loading ? (
                            <p>Загрузка...</p>
                        ) : (
                            <ul className="space-y-2">
                                {variables.map((v) => (
                                    <li
                                        key={v.id}
                                        className="grid grid-cols-4 items-center gap-4 border-b border-gray-200 py-2"
                                    >
                                        <span className="font-medium truncate col-span-2">{v.name}</span>
                                        <span className="text-gray-500 whitespace-nowrap">{v.type_of}</span>
                                        <button type="button" className="ml-auto" onClick={() => handleDeleteVariable(v.id)}>
                                            <Image src={delet} alt="delete" width={24} height={24}/>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
