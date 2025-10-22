import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlayCircle } from "lucide-react";

interface HelpVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stepName: string;
  stepId: string;
}

// Mapeamento de vídeos por step - será gerenciado pelo painel de controle futuramente
const VIDEO_URLS: Record<string, string> = {
  qualification: "", // URL será carregada do painel
  facts: "",
  claims: "",
  evidence: "",
  calculations: "",
  review: "",
};

const HelpVideoDialog = ({ open, onOpenChange, stepName, stepId }: HelpVideoDialogProps) => {
  const videoUrl = VIDEO_URLS[stepId];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-primary" />
            Como preencher: {stepName}
          </DialogTitle>
          <DialogDescription>
            Assista ao vídeo explicativo para entender melhor como preencher esta etapa.
          </DialogDescription>
        </DialogHeader>
        
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          {videoUrl ? (
            <video
              controls
              className="w-full h-full rounded-lg"
              src={videoUrl}
            >
              Seu navegador não suporta o elemento de vídeo.
            </video>
          ) : (
            <div className="text-center p-8">
              <PlayCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                Vídeo em breve
              </p>
              <p className="text-sm text-muted-foreground">
                O vídeo tutorial para esta etapa será disponibilizado em breve através do painel de controle.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpVideoDialog;
