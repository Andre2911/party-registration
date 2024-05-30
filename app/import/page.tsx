'use client'

import React, {useState} from "react";
import * as xlsx from 'xlsx';
import {getAllUsers, insertMultipleUsers, syncEmailById} from "@/app/lib/actions";

export default function Page(){

    const [items, setItems] = useState([]);
    const handleImageUpload = async (event: any) => {
        const file = event.target.files[0];

        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            fileReader.onload = (e) => {
                const bufferArray = e.target.result;
                const wb = xlsx.read(bufferArray, {
                    type: "buffer"
                });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = xlsx.utils.sheet_to_json(ws);
                // console.log(data);
                resolve(data);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
        promise.then((d) => {
            setItems(d);

        });
    }

    const handlegetItems = async () => {


        const uniqueItemsMap = new Map();

        for (const item of items) {
            // Si el DNI ya está en el mapa, o si alguno de los campos requeridos es undefined, se salta al siguiente
            if (item.DNI && !uniqueItemsMap.has(item.DNI)) {
                if (item.APELLIDOS && item.NOMBRES) { // Asegurarse de que los campos necesarios no sean undefined
                    uniqueItemsMap.set(item.DNI, {
                        dni: item.DNI,
                        apellidos: item.APELLIDOS,
                        nombres: item.NOMBRES,
                        tipo_documento: "", // Asignar tipo_documento vacío o el valor que necesites
                        es_invitado: true,
                        email: item.Email
                    });
                }
            }
        }
        const newArray = Array.from(uniqueItemsMap.values());
        const userValues = newArray.map(u =>
            `(${u.dni}, '${u.apellidos}', '${u.nombres}', ${u.es_invitado})`
        );
        try {
            await insertMultipleUsers(newArray);
            alert('Data successfully uploaded!');
        } catch (error) {
            console.error('Failed to upload data:', error);
            alert('Failed to upload data.');
        }
    }


    const handleExport = async () => {

        try {
            const data = await getAllUsers();
            alert('Data successfully uploaded!');
            const ws = xlsx.utils.json_to_sheet(data);
            const wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
            xlsx.writeFile(wb, "export.xlsx");
        } catch (error) {
            console.error('Failed to upload data:', error);
            alert('Failed to upload data.');
        }

    }

    const handleSyncEmail = async () => {
        console.log(items)
        try {
            const data = await syncEmailById(items);
            alert('Emails successfully synced!');
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    return (
        <div>
            <input type="file" onChange={handleImageUpload}/>
            <button onClick={handlegetItems}>Upload</button>
            <button onClick={handleSyncEmail}>Sync Emails</button>
            <button onClick={handleExport}>Export</button>
        </div>
    )
}