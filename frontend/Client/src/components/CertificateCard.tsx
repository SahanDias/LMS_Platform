import { Award, Download, Share2, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Certificate } from "@/lib/data";

interface CertificateCardProps {
  certificate: Certificate;
  onView: () => void;
}

const CertificateCard = ({ certificate, onView }: CertificateCardProps) => {
  const formattedDate = new Date(certificate.completedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
        <div className="absolute right-4 top-4 opacity-20">
          <Award className="h-24 w-24" />
        </div>
        <Award className="mb-4 h-10 w-10" />
        <h3 className="relative z-10 text-xl font-bold">{certificate.courseName}</h3>
        <p className="relative z-10 mt-1 text-sm text-primary-foreground/80">
          Certificate of Completion
        </p>
      </div>

      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Awarded to</span>
            <span className="font-medium text-foreground">{certificate.userName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Certificate ID</span>
            <span className="font-mono text-xs text-foreground">{certificate.certificateNumber}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Completed
            </span>
            <span className="text-foreground">{formattedDate}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button onClick={onView} className="flex-1 gap-2">
            <Award className="h-4 w-4" />
            View
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateCard;
