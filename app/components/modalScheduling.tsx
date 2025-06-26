"use client";
import React, { useState } from "react";
import { X } from "lucide-react";

type SchedulingAdjustmentsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SchedulingAdjustmentsModal({
  isOpen,
  onClose,
}: SchedulingAdjustmentsModalProps) {
  const [roomName, setRoomName] = useState("Sala 01");
  const [scheduleTime, setScheduleTime] = useState("08:00 - 18:00");
  const [timeBlock, setTimeBlock] = useState("60 minutos");
  const [isEdit, setIsEdit] = useState(false);
  const [roomId, setRoomId] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      name: roomName,
      scheduleTime,
      timeBlock,
      date: "2025-06-27",
    };

    try {
      const url = isEdit
        ? `http://localhost:3000/rooms/${roomId}`
        : "http://localhost:3000/rooms";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Erro ao salvar sala");
      }

      alert(isEdit ? "Sala editada com sucesso!" : "Sala criada com sucesso!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao processar a solicitação.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Ajustes de agendamento</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium mb-1">Nome da sala</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Horário Inicial & Final
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Bloco de horários</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={timeBlock}
              onChange={(e) => setTimeBlock(e.target.value)}
            >
              <option value="10 minutos">10 minutos</option>
              <option value="30 minutos">30 minutos</option>
              <option value="60 minutos">1 Hora</option>
              <option value="120 minutos">2 Horas</option>
              <option value="180 minutos">3 Horas</option>
              <option value="240 minutos">4 Horas</option>
              <option value="300 minutos">5 Horas</option>
              <option value="360 minutos">6 Horas</option>
              <option value="420 minutos">7 Horas</option>
              <option value="480 minutos">8 Horas</option>
              <option value="540 minutos">9 Horas</option>
              <option value="600 minutos">10 Horas</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit"
              checked={isEdit}
              onChange={() => setIsEdit(!isEdit)}
            />
            <label htmlFor="edit" className="text-sm">
              Editar sala existente
            </label>
          </div>

          {isEdit && (
            <div>
              <label className="block font-medium mb-1">ID da Sala</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required={isEdit}
              />
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="bg-black text-white px-10 py-2 rounded hover:bg-gray-800"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
