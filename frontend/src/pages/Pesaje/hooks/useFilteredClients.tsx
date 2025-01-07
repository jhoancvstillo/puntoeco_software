import { Cliente } from "@/types/client";
import { useEffect, useState } from "react";


export function useFilteredClients(clients : Cliente[], searchTerm : string) {
    const [filteredClients, setFilteredClients] = useState<Cliente[]>(clients)
    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase()
        const filtered = clients.filter(
          (client) =>
            client.name.toLowerCase().includes(lowerSearch) ||
            client.rut.toLowerCase().includes(lowerSearch)
        )
        setFilteredClients(filtered)
    }, [searchTerm, clients])


    return filteredClients
}

