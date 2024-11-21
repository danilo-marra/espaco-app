import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "../ui/dialog";

interface ExcluirAgendaModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  message: string;
  messageAll: string;
  onConfirm: (deleteAll: boolean) => void;
  checked?: boolean;
}

export function ExcluirAgendaModal({
  isOpen,
  onOpenChange,
  title,
  message,
  messageAll,
  onConfirm,
  checked = false,
}: ExcluirAgendaModalProps) {
  const [deleteAll, setDeleteAll] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDeleteAll(checked);
    }
  }, [isOpen, checked]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <DialogContent className="fixed z-50 top-1/2 left-1/2 max-w-md w-full -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-6 shadow-lg focus:outline-none">
          <DialogTitle className="text-2xl font-bold text-azul">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-700 mb-6 flex flex-wrap space-y-4">
            <span>{message}</span>
            <span>
              <Checkbox
                className="mr-2 border-gray-400 data-[state=checked]:bg-rosa data-[state=checked]:border-rosa"
                id="deleteAll"
                checked={deleteAll}
                onCheckedChange={(checked) => setDeleteAll(checked as boolean)}
              />
              <label htmlFor="deleteAll">{messageAll}</label>
            </span>
          </DialogDescription>
          <div className="flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Não
            </Button>
            <Button
              variant="default"
              onClick={() => onConfirm(deleteAll)}
              className="bg-rosa hover:bg-rosa/70 text-white"
            >
              Sim
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
