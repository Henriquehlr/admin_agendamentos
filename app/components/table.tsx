"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Switch,
} from "@mui/material";

type TableComponentProps = {
  tipo: "Agendamentos" | "Clientes" | "Logs";
  dados: any[];
  onEditar: (id: number) => void;
};

export default function TableComponent({ tipo, dados, onEditar }: TableComponentProps) {
  const renderStatusColor = (status: string) => {
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

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {tipo === "Agendamentos" && (
              <>
                <TableCell>Data Agendamento</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Sala</TableCell>
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
          {dados.map((item) => (
            <TableRow key={item.id} className={tipo === "Agendamentos" ? renderStatusColor(item.status) : ""}>
              {tipo === "Agendamentos" && (
                <>
                  <TableCell>{item.data}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.sala}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    {item.status === "Em análise" && (
                      <>
                        <Button size="small" color="success" onClick={() => onEditar(item.id)}>✔️</Button>
                        <Button size="small" color="error" onClick={() => onEditar(item.id)}>❌</Button>
                      </>
                    )}
                    {item.status === "Agendado" && (
                      <Button size="small" color="error" onClick={() => onEditar(item.id)}>❌</Button>
                    )}
                  </TableCell>
                </>
              )}
              {tipo === "Clientes" && (
                <>
                  <TableCell>{item.dataCadastro}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.endereco}</TableCell>
                  <TableCell>
                    {item.permissoes.map((p: string) => (
                      <Button key={p} size="small" className="mr-1" variant="outlined">
                        {p}
                      </Button>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Switch checked={item.status} onChange={() => onEditar(item.id)} />
                  </TableCell>
                </>
              )}
              {tipo === "Logs" && (
                <>
                  <TableCell>{item.cliente}</TableCell>
                  <TableCell>{item.atividade}</TableCell>
                  <TableCell>{item.modulo}</TableCell>
                  <TableCell>{item.dataHora}</TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
