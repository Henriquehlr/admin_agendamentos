"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  TablePagination,
} from "@mui/material";
import { Check, X } from "lucide-react";

type TableComponentProps = {
  tipo: "Agendamentos" | "Clientes" | "Logs";
  dados: any[];
  onEditar: (id: number) => void;
  onAtualizarPermissao?: (
    userId: number,
    permissao: string,
    adicionar: boolean
  ) => void;
  onToggleStatus?: (userId: number) => void;
};

export default function TableComponent({
  tipo,
  dados,
  onEditar,
  onAtualizarPermissao,
  onToggleStatus,
}: TableComponentProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatAgendamentoDataHora = (date: string, time: string) => {
    const d = new Date(`${date}T${time}`);
    return `${d.toLocaleDateString("pt-BR")} às ${d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const renderStatusRowColor = (status: string) => {
    switch (status) {
      case "Em análise":
        return "bg-white";
      case "Agendado":
        return "bg-green-100";
      case "Cancelado":
        return "bg-red-100";
      default:
        return "";
    }
  };

  const renderStatusStyle = (status: string) => {
    switch (status) {
      case "Em análise":
        return "border border-[#9c9c9c] rounded-full px-3 py-1 text-[#5a5757] inline-block min-w-[100px] text-center";
      case "Agendado":
        return "border border-[#3ba091] rounded-full px-3 py-1 text-[#005045] inline-block min-w-[100px] text-center";
      case "Cancelado":
        return "border border-[#FF0000] rounded-full px-3 py-1 text-[#FF0000] inline-block min-w-[100px] text-center";
      default:
        return "";
    }
  };

  const handleAprovar = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:3000/bookings/${id}/approve`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (err) {
      console.error("Erro ao aprovar agendamento:", err);
    }
  };

  const handleCancelar = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:3000/bookings/${id}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (err) {
      console.error("Erro ao cancelar agendamento:", err);
    }
  };

  const paginatedData = dados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {tipo === "Agendamentos" && (
              <>
                <TableCell>Data Agendamento</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Sala de agendamento</TableCell>
                <TableCell>Status Transação</TableCell>
                <TableCell>Ação</TableCell>
              </>
            )}
            {tipo === "Clientes" && (
              <>
                <TableCell>Data Cadastro</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Endereço</TableCell>
                <TableCell>Permissões</TableCell>
                <TableCell>Status</TableCell>
              </>
            )}
            {tipo === "Logs" && (
              <>
                <TableCell>Cliente</TableCell>
                <TableCell>Tipo de Atividade</TableCell>
                <TableCell>Módulo</TableCell>
                <TableCell>Data e Horário</TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((item) => {
            if (tipo === "Agendamentos") {
              const status = item.status || "Agendado";
              const nome = item.user?.name || "-";
              const role = item.user?.role || "";
              return (
                <TableRow key={item.id} className={renderStatusRowColor(status)}>
                  <TableCell>
                    {formatAgendamentoDataHora(item.date, item.startTime)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-black">{nome}</div>
                    <div className="text-sm text-gray-500">{role}</div>
                  </TableCell>
                  <TableCell>
                    <span className="bg-black text-white rounded-full px-3 py-1 inline-block text-center min-w-[40px]">
                      {item.room}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={renderStatusStyle(status)}>{status}</span>
                  </TableCell>
                  <TableCell className="space-x-2 flex">
                    {status === "Em análise" && (
                      <>
                        <button
                          onClick={() => handleAprovar(item.id)}
                          className="bg-black text-white rounded-full p-2"
                          title="Aprovar"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleCancelar(item.id)}
                          className="bg-black text-white rounded-full p-2"
                          title="Cancelar"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                    {status === "Agendado" && (
                      <button
                        onClick={() => handleCancelar(item.id)}
                        className="bg-black text-white rounded-full p-2"
                        title="Cancelar"
                      >
                        <X size={16} />
                      </button>
                    )}
                    {status === "Cancelado" && (
                      <span className="text-gray-400 italic"></span>
                    )}
                  </TableCell>
                </TableRow>
              );
            }

            if (tipo === "Clientes") {
              const enderecoFormatado = `${item.street}, ${item.number} - ${item.district}, ${item.city}`;
              const temAgendamento = item.permissions?.includes("Agendamentos");
              const temLogs = item.permissions?.includes("Logs");

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }) +
                      " às " +
                      new Date(item.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-black">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.role || "cliente"}
                    </div>
                  </TableCell>
                  <TableCell>{enderecoFormatado}</TableCell>
                  <TableCell className="space-x-2">
                    <button
                      onClick={() =>
                        onAtualizarPermissao?.(
                          item.id,
                          "Agendamentos",
                          !temAgendamento
                        )
                      }
                      className={`px-3 py-1 rounded-full text-sm ${
                        temAgendamento
                          ? "bg-black text-white"
                          : "bg-transparent text-black border border-black"
                      }`}
                    >
                      Agendamentos
                    </button>
                    <button
                      onClick={() =>
                        onAtualizarPermissao?.(item.id, "Logs", !temLogs)
                      }
                      className={`px-3 py-1 rounded-full text-sm ${
                        temLogs
                          ? "bg-black text-white"
                          : "bg-transparent text-black border border-black"
                      }`}
                    >
                      Logs
                    </button>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={item.status}
                      onChange={() => onToggleStatus?.(item.id)}
                      sx={{
                        "& .MuiSwitch-switchBase": {
                          color: "#000",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#000",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "#000",
                        },
                        "& .MuiSwitch-track": {
                          backgroundColor: "#bbb",
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            }

            if (tipo === "Logs") {
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium text-black">{item.cliente}</div>
                    <div className="text-sm text-gray-500">{item.tipo || "cliente"}</div>
                  </TableCell>
                  <TableCell>
                    <span className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 inline-block text-sm text-center min-w-[100px]">
                      {item.atividade}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 inline-block text-sm text-center min-w-[100px]">
                      {item.modulo}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="bg-gray-200 text-gray-800 rounded-full px-3 py-1 inline-block text-sm text-center min-w-[130px]">
                      {item.dataHora}
                    </span>
                  </TableCell>
                </TableRow>
              );
            }

            return null;
          })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={dados.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Linhas por página"
      />
    </TableContainer>
  );
}
