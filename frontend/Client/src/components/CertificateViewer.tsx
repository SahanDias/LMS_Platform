import { Award, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Certificate } from "@/lib/data";

interface CertificateViewerProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

const CertificateViewer = ({ certificate, isOpen, onClose }: CertificateViewerProps) => {
  if (!certificate) return null;

  const formattedDate = new Date(certificate.completedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Certificate of Completion</DialogTitle>
        </DialogHeader>
        
        <div className="relative overflow-hidden">
          {/* Certificate Design */}
          <div className="relative bg-gradient-to-br from-card via-card to-accent p-8 md:p-12">
            {/* Border decoration */}
            <div className="absolute inset-4 rounded-lg border-2 border-primary/20" />
            <div className="absolute inset-6 rounded-lg border border-primary/10" />
            
            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Logo */}
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                <Award className="h-8 w-8 text-primary-foreground" />
              </div>

              {/* Header */}
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                Certificate of Completion
              </p>
              <h2 className="mb-8 font-serif text-3xl font-bold text-foreground md:text-4xl">
                LearnHub Academy
              </h2>

              {/* Body */}
              <p className="mb-4 text-muted-foreground">This is to certify that</p>
              <p className="mb-4 font-serif text-2xl font-bold text-primary md:text-3xl">
                {certificate.userName}
              </p>
              <p className="mb-4 text-muted-foreground">has successfully completed the course</p>
              <p className="mb-8 font-serif text-xl font-semibold text-foreground md:text-2xl">
                {certificate.courseName}
              </p>

              {/* Date and ID */}
              <div className="mb-8 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-12">
                <div>
                  <p className="text-sm text-muted-foreground">Date of Completion</p>
                  <p className="font-medium text-foreground">{formattedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Certificate ID</p>
                  <p className="font-mono text-sm font-medium text-foreground">
                    {certificate.certificateNumber}
                  </p>
                </div>
              </div>

              {/* Signature area */}
              <div className="flex justify-center gap-16">
                <div className="text-center">
                  <div className="mb-2 h-px w-32 bg-border" />
                  <p className="text-xs text-muted-foreground">Instructor</p>
                </div>
                <div className="text-center">
                  <div className="mb-2 h-px w-32 bg-border" />
                  <p className="text-xs text-muted-foreground">Director</p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-primary/5" />
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-primary/5" />
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateViewer;
