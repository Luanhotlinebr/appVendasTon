import Icon from "@mdi/react";
import { mdiMenu } from "@mdi/js";

interface SideBarProps {
  className?: string;
}

export function SideBar({ className }: SideBarProps) {
  return (
    <div className={className}>
      <Icon path={mdiMenu} size={1} />
    </div>
  );
}

/*
- Cadastro de POS, Plano
- Configurações de comissionamento
- Fazer rotas relacionadas a isso
*/
