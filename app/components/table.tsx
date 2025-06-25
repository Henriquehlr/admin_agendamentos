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

type TableComponentProps = {
  tipo: "Agendamentos" | "Clientes" | "Logs";
  dados: any[];
  onEditar: (id: number) => void;
};

export default function TableComponent({ tipo, dados, onEditar }: TableComponentProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("pt-BR");
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = dados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
              const nomeUsuario = item.user?.name || "-";
              return (
                <TableRow key={item.id} className={renderStatusRowColor(status)}>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>{nomeUsuario}</TableCell>
                  <TableCell>
                    <span className="bg-black text-white rounded-full px-3 py-1 inline-block text-center min-w-[40px]">
                      {item.room}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={renderStatusStyle(status)}>{status}</span>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <button
                      onClick={() => onEditar(item.id)}
                      className="bg-black text-white rounded-full px-3 py-1"
                    >
                      ✏️
                    </button>
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
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{enderecoFormatado}</TableCell>
                  <TableCell className="space-x-2">
                    <button
                      onClick={() => console.log(`Toggle Agendamentos para ID ${item.id}`)}
                      className={`px-3 py-1 rounded-full text-sm ${temAgendamento
                        ? "bg-black text-white"
                        : "bg-transparent text-black border border-black"
                        }`}
                    >
                      Agendamentos
                    </button>
                    <button
                      onClick={() => console.log(`Toggle Logs para ID ${item.id}`)}
                      className={`px-3 py-1 rounded-full text-sm ${temLogs
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
                      onChange={() => onEditar(item.id)}
                      sx={{
                        "& .MuiSwitch-switchBase": {
                          color: "#fff",
                        },
                        "& .MuiSwitch-track": {
                          backgroundColor: "#000",
                        },
                        "& .Mui-checked": {
                          color: "#fff",
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
                  <TableCell>{item.cliente}</TableCell>
                  <TableCell>{item.atividade}</TableCell>
                  <TableCell>{item.modulo}</TableCell>
                  <TableCell>{item.dataHora}</TableCell>
                </TableRow>
              );
            }

            return null;
          })}
        </TableBody>
      </Table>

      {/* Paginação */}
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
