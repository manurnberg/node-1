import fs from "fs";
import { promisify } from "util";

const readFileAsync = promisify(fs.readFile);


export const loadSecretKey = async (secretKeyPath: string) => {
    try {
      const secretKey = await readFileAsync(secretKeyPath, 'utf8');
      return secretKey.trim();
    } catch (err) {
      console.error('Error al cargar la clave secreta:', err);
      throw new Error('No se pudo cargar la clave secreta');
    }
  };