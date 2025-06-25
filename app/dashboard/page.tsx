/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarDays, Users, FileText } from "lucide-react";
import TableComponent from "@/components/table";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedMenu, setSelectedMenu] = useState("Agendamentos");

  const agendamentos = [
    { id: 1, data: "2025-06-25", nome: "Henrique", sala: "101", status: "Em análise" },
    { id: 2, data: "2025-06-26", nome: "Lucas", sala: "202", status: "Agendado" },
    { id: 3, data: "2025-06-27", nome: "Joana", sala: "303", status: "Cancelado" },
  ];

  const clientes = [
    {
      id: 1,
      dataCadastro: "2025-06-10",
      nome: "João",
      endereco: "Rua A, 123",
      permissoes: ["Agendamentos", "Logs"],
      status: true,
    },
    {
      id: 2,
      dataCadastro: "2025-06-15",
      nome: "Maria",
      endereco: "Rua B, 456",
      permissoes: ["Agendamentos"],
      status: false,
    },
  ];

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
  }, []);

  if (!user) return <p className="p-4">Carregando...</p>;

  const handleEditar = (id: number) => {
    console.log(`Editar item com id: ${id}`);
  };

  return (
    <div className="flex h-screen">
      {/* Menu Lateral */}
      <aside className="w-64 text-white flex flex-col p-4" style={{ backgroundColor: "#F6F4F1" }}>
        <div className="text-2xl font-bold mb-8">
          <Image src="/logo.png" width={80} height={80} alt="Logo do painel" />
        </div>

        <nav className="space-y-4">
          {["Agendamentos", "Clientes", "Logs"].map((menu) => {
            const Icon = menu === "Agendamentos" ? CalendarDays : menu === "Clientes" ? Users : FileText;
            const isSelected = selectedMenu === menu;
            return (
              <button
                key={menu}
                onClick={() => setSelectedMenu(menu)}
                className={`flex items-center space-x-2 px-2 py-1 rounded ${
                  isSelected ? "bg-black text-white" : ""
                }`}
              >
                <Icon size={20} color={isSelected ? "white" : "black"} />
                <span className={isSelected ? "text-white" : "text-black"}>{menu}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">{selectedMenu}</h1>
          <p className="text-gray-600">
            Acompanhe todos os {selectedMenu.toLowerCase()} de clientes de forma simples
          </p>
        </header>

        {/* Filtro */}
        <div className="flex items-center space-x-4 mb-4">
          <input type="date" className="border border-gray-300 p-2 rounded" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Ajuste de agendamentos
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto border rounded">
          <TableComponent
            tipo={selectedMenu}
            dados={
              selectedMenu === "Agendamentos"
                ? agendamentos
                : selectedMenu === "Clientes"
                ? clientes
                : logs
            }
            onEditar={handleEditar}
          />
        </div>
      </main>
    </div>
  );
}
