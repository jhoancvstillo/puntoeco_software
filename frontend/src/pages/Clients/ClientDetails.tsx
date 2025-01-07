// import React from 'react';
// import { Cliente } from '@/types/client';

// interface ClienteDetailsProps {
//   cliente: Cliente | null;
// }

// export const ClienteDetails: React.FC<ClienteDetailsProps> = ({ cliente }) => {
//   if (!cliente) return null;

//   return (
//     <div className="space-y-4">
//       <div>
//         <h4 className="font-semibold">Nombre</h4>
//         <p>{cliente.name}</p>
//       </div>
//       <div>
//         <h4 className="font-semibold">Email</h4>
//         <p>{cliente.mail}</p>
//       </div>
//       <div>
//         <h4 className="font-semibold">Teléfono</h4>
//         <p>{cliente.phoneNumber}</p>
//       </div>
//       {cliente.address && (
//         <div>
//           <h4 className="font-semibold">Dirección</h4>
//           <p>{cliente.address}</p>
//         </div>
//       )}
//     </div>
//   );
// };
