"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarDays, Users, FileText, Search, ChevronDown } from "lucide-react";
import TableComponent from "@/components/table";
import AjustesModal from "@/components/modalScheduling";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedMenu, setSelectedMenu] = useState("Agendamentos");
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [clientesApi, setClientesApi] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    fetch("http://localhost:3000/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((userData) => {
        setUser(userData); 
      })
      .catch((err) => {
        console.error("Erro ao buscar perfil", err);
        router.push("/login");
      });

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

    if (selectedMenu === "Logs") {
      fetch("http://localhost:3000/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const logsFormatados = data.map((log: any) => {
            const datetimeObj = new Date(log.datetime);
            const dataHora = `${datetimeObj.toLocaleDateString("pt-BR")} às ${datetimeObj.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}`;

            return {
              id: log.id,
              cliente: log.name,
              tipo: log.role || "cliente",
              atividade: log.activityType,
              modulo: log.module,
              dataHora,
            };
          });

          setLogs(logsFormatados);
        })
        .catch((error) => {
          console.error("Erro ao buscar logs:", error);
          setLogs([]);
        });
    }
  }, [selectedMenu, router]);

  const handleEditar = (id: number) => {
    console.log(`Editar item com id: ${id}`);
  };

  const handleAtualizarPermissao = async (userId: number, permissao: string, adicionar: boolean) => {
    const token = localStorage.getItem("token");
    const usuario = clientesApi.find((u) => u.id === userId);
    if (!usuario) return;

    const novasPermissoes = adicionar
      ? [...(usuario.permissions || []), permissao]
      : (usuario.permissions || []).filter((p: string) => p !== permissao);

    try {
      const res = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ permissions: novasPermissoes }),
      });

      if (res.ok) {
        setMensagemSucesso("Permissões atualizadas com sucesso!");

        setClientesApi((prev) =>
          prev.map((cli) =>
            cli.id === userId ? { ...cli, permissions: novasPermissoes } : cli
          )
        );

        setTimeout(() => setMensagemSucesso(""), 3000);
      }
    } catch (err) {
      console.error("Erro ao atualizar permissão", err);
    }
  };

  const handleToggleStatus = (userId: number) => {
    setClientesApi((prev) =>
      prev.map((cli) =>
        cli.id === userId ? { ...cli, status: !cli.status } : cli
      )
    );
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
      if (selectedMenu === "Agendamentos" || selectedMenu === "Clientes") {
        const userName = item.user?.name?.toLowerCase() || item.name?.toLowerCase() || "";
        const room = item.room?.toLowerCase() || "";
        const dataMatch = filtroData ? item.date === filtroData : true;
        return (userName.includes(term) || room.includes(term)) && dataMatch;
      } else if ("cliente" in item) {
        return item.cliente.toLowerCase().includes(term);
      }
      return false;
    });
  };

  const getSubtitulo = () => {
    switch (selectedMenu) {
      case "Agendamentos":
        return "Acompanhe todos os agendamentos de clientes de forma simples";
      case "Clientes":
        return "Overview de todos os clientes";
      case "Logs":
        return "Acompanhe todas as logs de clientes";
      default:
        return "";
    }
  };

  if (!user) return <p className="p-4">Carregando...</p>;

  return (
    <div className="flex flex-wrap min-h-screen">
      <aside className="w-full md:w-64 text-white flex flex-col p-4" style={{ backgroundColor: "#F6F4F1" }}>
        <div className="text-2xl font-bold mb-8 flex items-center justify-between">
          <Image src="/logo.png" width={60} height={60} alt="Logo do painel" />
        </div>
        <nav className="space-y-4">
          <hr className="border-t border-gray-300 w-full mt-1" />
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
                className={`w-full text-left flex items-center space-x-4 px-4 py-2 rounded ${isSelected ? "bg-black text-white" : ""}`}
              >
                <Icon size={20} color={isSelected ? "white" : "black"} />
                <span className={isSelected ? "text-white" : "text-black"}>{menu}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-300">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between px-4 py-2 rounded text-black hover:bg-gray-100"
          >
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-xs text-gray-500">{user.role}</div>
            </div>
            <ChevronDown size={16} />
          </button>

          {showDropdown && (
            <div className="bg-white shadow rounded mt-2 mx-4 border border-gray-200">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 overflow-auto w-full">
        <header className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">{selectedMenu}</h1>
          <p className="text-gray-600 text-sm sm:text-base">{getSubtitulo()}</p>
        </header>

        {mensagemSucesso && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
            {mensagemSucesso}
          </div>
        )}

        <hr className="border-t border-gray-300 my-4" />

        <div className="flex flex-wrap gap-4 justify-between mb-4 px-0 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Filtre por nome"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-2 border border-gray-300 rounded w-48 sm:w-64"
              />
            </div>

            <input
              type="date"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
              className="border border-gray-300 py-2 px-3 rounded w-40 sm:w-48"
            />
          </div>

          {selectedMenu === "Agendamentos" && (
            <button
              onClick={() => setOpenModal(true)}
              className="bg-black text-white border border-black px-4 sm:px-6 py-2 rounded"
            >
              Ajustes de agendamentos
            </button>
          )}
        </div>

        <div className="overflow-x-auto border rounded px-2 sm:px-6">
          <TableComponent
            tipo={selectedMenu as "Agendamentos" | "Clientes" | "Logs"}
            dados={getFilteredData()}
            onEditar={handleEditar}
            onAtualizarPermissao={handleAtualizarPermissao}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </main>

      <AjustesModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
