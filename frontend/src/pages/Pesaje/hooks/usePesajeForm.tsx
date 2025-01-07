// "use client";

// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { PesajeProps, pesajeSchema } from "../components/form/schema";
// import { getClients, getDrivers } from "@/api/clients";
// import { certificadosAPI } from "@/api/pesaje";
// import { UsePesajeFormProps } from "../types/weight-ticket";

// const usePesajeForm = ({onSubmit, defaultValues}: UsePesajeFormProps) => {
//   {
//   // Estado local
//   const [clients, setClients] = useState<{id: number ; name: string; rut: string }[]>([]);
//   const [drivers, setDrivers] = useState<{id: Number; name: string; rut: string }[]>([]);

//   // Instanciamos RHF
//   const form = useForm<PesajeProps>({
//     resolver: zodResolver(pesajeSchema),
//     defaultValues,
//   });
  


//   /**
//    * Función para traer clientes
//    */
//   const fetchClients = async (searchTerm: string = "") => {
//     try {
//       const data = await getClients(1, 10, searchTerm);
//       setClients(data.results || []);
//     } catch (error) {
//       console.error("Error fetching clients:", error);
//     }
//   };

//   const fetchDrivers = async (searchTerm: string = "") => {
//     try {
//       const data = await getDrivers(1, 10, searchTerm);
//       setDrivers(data.results || []);
//       console.log("data desde usePesajeForm", data);
//     } catch (error) {
//       console.error("Error fetching drivers:", error);
//     }
//   };

//   // Cargamos los clientes y conductores al montar
//   useEffect(() => {
//     fetchClients();
//     fetchDrivers();
//   }, []);

//   /**
//    * Submit final del formulario
//    */
//   const handleSubmit = async (data: PesajeProps) => {
//     try {
//       // Transformar datos

//       // Llamamos a tu API con los datos transformados
//       await certificadosAPI.create(data);

//       // Avisar al padre
//       onSubmit(data);
//     } catch (error) {
//       console.error("Error creando certificado:", error);
//     }
//   };

//   return {
//     form,
//     clients,
//     drivers,
//     fetchClients,
//     fetchDrivers,
//     handleSubmit,
//   };
// }
// }


// export default usePesajeForm;
