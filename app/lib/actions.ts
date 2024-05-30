'use server'
import { sql } from '@vercel/postgres';

interface User{
    name: string;
    lastName: string;
    isInvited: boolean;
    hasEntered: string | null
  }


export const getUserData = async (dni: string) => {

  try{
    const userExists  = await sql`SELECT * FROM usuarios WHERE dni = ${dni}`
    if(userExists.rows.length > 0){
        const user = userExists.rows[0];
        const hasEntered = user.hora_ingreso != null;
        if (!hasEntered) {
            await sql`UPDATE usuarios SET hora_ingreso = NOW() WHERE dni = ${dni}`;
        }
        return {
            is_invited: true,
            name: user.nombre,
            lastName: user.apellido,
            hasEntered: hasEntered ? "Ya ingresó" : "Primer ingreso", // Informa si ya ingresó antes o no
        }
    }else{
        return{
            is_invited: false,
            name: "Usuario",
            lastName: "no Registrado",
        }


    }
    
  }catch(e){
    console.error(e)
    throw new Error('Failed to fetch invoice.');
  }
  // return responseArtificial
}

export async function insertMultipleUsers(users:Array<{ dni: string, tipo_documento: string, apellidos: string, nombres: string, es_invitado: boolean, email: string }>) {
    const userValues = users.map(u =>
        `(${u.dni}, '${u.apellidos}', '${u.nombres}', ${u.es_invitado}, '${u.email}')`
    );

    const combinedQuery =  'INSERT INTO usuarios (dni, apellido, nombre, es_invitado, email) VALUES  ' + userValues +";";
    console.log(combinedQuery);
    // userValues.reduce((acc, val) => acc.append(sql`,`).append(val), sql`INSERT INTO usuarios (dni, tipo_documento, apellidos, nombres) VALUES `).append(userValues[0]);
    try {
        await sql`${combinedQuery}`;
        console.log('Inserción masiva exitosa');
    } catch (error) {
        console.error('Error al insertar datos:', error);
    }
}


export async function getAllUsers() {
    try {
        const users = await sql`SELECT * FROM usuarios WHERE hora_ingreso IS NOT NULL`;
        return users.rows;
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}

export async function syncEmailById(items: Array<{ DNI: string, Email: string }>) {
    // console.log(items)
    try {
        // Generar consultas SQL para actualizar cada registro
        const queries = items.map(item => sql`
            UPDATE usuarios
            SET email = ${item.Email}
            WHERE dni = ${item.DNI}
        `);

        // Ejecutar todas las consultas en paralelo
        await Promise.all(queries);

        console.log('Sincronización de emails exitosa');
    } catch (error) {
        console.error('Error al sincronizar emails:', error);
    }
}