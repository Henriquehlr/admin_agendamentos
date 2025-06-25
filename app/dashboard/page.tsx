"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarDays, Users, FileText, Search } from "lucide-react";
import TableComponent from "@/components/table";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedMenu, setSelectedMenu] = useState("Agendamentos");
  const [searchTerm, setSearchTerm] = useState("");

  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [clientesApi, setClientesApi] = useState<any[]>([]);

  const logs = [
    {
      id: 1,
      cliente: "João",
      atividade: "Criação de agendamento",
      modulo: "Agendamentos",
      dataHora: "2025-06-25 10:00",
    },
    {
      id: 2,
      cliente: "Maria",
      atividade: "Login",
      modulo: "Autenticação",
      dataHora: "2025-06-24 08:30",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    setUser({ role: "admin" });

    if (selectedMenu === "Agendamentos") {
      fetch("http://localhost:3000/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setAgendamentos(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          console.error("Erro ao buscar agendamentos:", error);
          setAgendamentos([]);
        });
    }

    if (selectedMenu === "Clientes") {
      fetch("http://localhost:3000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setClientesApi(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          console.error("Erro ao buscar clientes:", error);
          setClientesApi([]);
        });
    }
  }, [selectedMenu, router]);

  if (!user) return <p className="p-4">Carregando...</p>;

  const handleEditar = (id: number) => {
    console.log(`Editar item com id: ${id}`);
  };

  const getFilteredData = () => {
    const term = searchTerm.toLowerCase();

    const baseData =
      selectedMenu === "Agendamentos"
        ? agendamentos
        : selectedMenu === "Clientes"
          ? clientesApi
          : logs;

    return baseData.filter((item) => {
      if (selectedMenu === "Agendamentos") {
        const userName = item.user?.name?.toLowerCase() || "";
        const room = item.room?.toLowerCase() || "";
        return userName.includes(term) || room.includes(term);
      } else if ("name" in item) {
        return item.name.toLowerCase().includes(term);
      } else if ("cliente" in item) {
        return item.cliente.toLowerCase().includes(term);
      }
      return false;
    });
  };

  return (
    <div className="flex h-screen">
      {/* Menu Lateral */}
      <aside
        className="w-64 text-white flex flex-col p-4"
        style={{ backgroundColor: "#F6F4F1" }}
      >
        <div className="text-2xl font-bold mb-8">
          <Image src="/logo.png" width={80} height={80} alt="Logo do painel" />
          <hr className="border-t border-gray-300 mt-3" />
        </div>

        <nav className="space-y-4">
          {["Agendamentos", "Clientes", "Logs"].map((menu) => {
            const Icon =
              menu === "Agendamentos"
                ? CalendarDays
                : menu === "Clientes"
                  ? Users
                  : FileText;
            const isSelected = selectedMenu === menu;
            return (
              <button
                key={menu}
                onClick={() => setSelectedMenu(menu)}
                className={`w-full text-left flex items-center space-x-6 px-6 py-2 rounded ${isSelected ? "bg-black text-white" : ""
                  }`}
              >
                <Icon size={20} color={isSelected ? "white" : "black"} />
                <span className={isSelected ? "text-white" : "text-black"}>
                  {menu}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{selectedMenu}</h1>
          <p className="text-gray-600">
            Acompanhe todos os {selectedMenu.toLowerCase()} de clientes de forma
            simples
          </p>
        </header>

        <hr className="border-t border-gray-300 my-4" />

        {/* Filtros */}
        <div className="flex items-center justify-between mb-4 px-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Filtre por nome"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-2 border border-gray-300 rounded w-64"
              />
            </div>

            <input
              type="date"
              className="border border-gray-300 py-2 px-3 rounded w-48"
            />
          </div>

          <button className="bg-black text-white border border-black px-6 py-2 rounded whitespace-nowrap">
            Ajustes de agendamentos
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto border rounded mx-6">
          <TableComponent
            tipo={selectedMenu}
            dados={getFilteredData()}
            onEditar={handleEditar}
          />
        </div>
      </main>
    </div>
  );
}
