"use client";

import type React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: { title: string; start: Date; end: Date; description?: string }) => void;
  startDate: Date;
  endDate: Date;
}

const NewEventModal: React.FC<NewEventModalProps> = ({ isOpen, onClose, onCreateEvent, startDate, endDate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateEvent({
      title,
      description,
      start: startDate,
      end: endDate,
    });
    setTitle("");
    setDescription("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-gray-600 dark:text-gray-200">Crear nuevo evento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 text-gray-600 dark:text-gray-200">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Título</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Descripción</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Comienzo</Label>
              <div className="col-span-3">{startDate.toLocaleString()}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Fin</Label>
              <div className="col-span-3">{endDate.toLocaleString()}</div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700">Crear evento</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewEventModal;
